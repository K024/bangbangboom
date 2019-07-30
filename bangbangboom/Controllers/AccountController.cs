using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Transactions;
using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace bangbangboom.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        public AccountController(
            UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Current()
        {
            var user = await _userManager.GetUserAsync(User);
            return new
            {
                username = user.UserName,
                emial = user.Email,
                roles = await _userManager.GetRolesAsync(user)
            };
        }

        [HttpPost]
        public async Task<object> Login(
            [FromForm][Required] string UserName,
            [FromForm][Required] string Password)
        {
            var user = (UserName.IndexOf('@') >= 0) ?
                await _userManager.FindByEmailAsync(UserName) :
                await _userManager.FindByNameAsync(UserName);

            if (user is null) return StatusCode(401);
            var result = await _signInManager.PasswordSignInAsync(user, Password, true, true);

            if (result.Succeeded)
                return Ok();

            if (result.IsLockedOut)
                return StatusCode(403, "LockedOut" + 
                    await _userManager.GetLockoutEndDateAsync(user));

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return StatusCode(403, "EmailNotConfirmed");

            return StatusCode(401);
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<object> ForgotPassword(
            [FromForm][Required] string UserName,
            [FromForm][Required] string Email,
            [FromServices] IEmailSender sender)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user != null && user.UserName == UserName)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                _ = sender.SendResetPasswordEmailAsync(Email, UserName, user.Id, token);
                return Ok();
            }
            return StatusCode(401);
        }

        [HttpPost]
        public async Task<object> ResetPassword(
            [FromForm][Required] string Guid,
            [FromForm][Required] string Token,
            [FromForm][Required] string NewPassword)
        {
            var user = await _userManager.FindByIdAsync(Guid);
            if (user is null) return StatusCode(401);
            var result = await _userManager.ResetPasswordAsync(user, Token, NewPassword);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, true);
                return Ok();
            }
            return StatusCode(401);
        }

        [HttpPost]
        public async Task<object> TestEmail(
            [FromForm][Required] string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            if (user == null)
                return Ok("Acceptable");
            return Ok("Registered");
        }

        [HttpPost]
        public async Task<object> Register(
            [FromForm][Required] string Email,
            [FromServices] IEmailSender sender)
        {
            var id = Guid.NewGuid().ToString();
            var user = new AppUser()
            {
                Id = id,
                UserName = id.Replace('-', '_'),
                Email = Email,
            };
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                _ = sender.SendRegisterConfirmEmailAsync(Email, id, token);
                DeleteIfNotConfirmedAfter2h(user.Id);
                return Ok();
            }
            return StatusCode(401);
        }

        [HttpPost]
        public async Task<object> TestUserName(
            [FromForm][Required] string UserName)
        {
            var user = await _userManager.FindByNameAsync(UserName);
            if (user == null)
                return Ok("Acceptable");
            return Ok("Registered");
        }

        [HttpPost]
        public async Task<object> ConfirmEmail(
            [FromForm][Required] string Guid,
            [FromForm][Required] string Token,
            [FromForm][Required][MaxLength(20)] string UserName,
            [FromForm][Required][MaxLength(20)] string Password,
            [FromServices] AppDbContext appDbContext)
        {
            if (!Regex.IsMatch(UserName, "^[A-Za-z][A-Za-z0-9_]{3,}$")) return StatusCode(401);
            using (var transaction = appDbContext.Database.BeginTransaction())
            {
                var user = await _userManager.FindByIdAsync(Guid);
                if (user is null) return StatusCode(401);
                var result = await _userManager.ConfirmEmailAsync(user, Token);
                while (result.Succeeded)
                {
                    var result2 = await _userManager.SetUserNameAsync(user, UserName);
                    if (!result2.Succeeded) break;
                    var result3 = await _userManager.AddPasswordAsync(user, Password);
                    if (!result3.Succeeded) break;
                    await _signInManager.SignInAsync(user, true);
                    await appDbContext.SaveChangesAsync();
                    transaction.Commit();
                    return Ok();
                }
                transaction.Rollback();
                return StatusCode(401);
            }
        }

        [NonAction]
        private void DeleteIfNotConfirmedAfter2h(string guid)
        {
            Task.Run(async () =>
            {
                await Task.Delay(TimeSpan.FromHours(2));
                var user = await _userManager.FindByIdAsync(guid);
                if (user != null && !await _userManager.IsEmailConfirmedAsync(user))
                {
                    await _userManager.DeleteAsync(user);
                }
            });
        }
    }
}
