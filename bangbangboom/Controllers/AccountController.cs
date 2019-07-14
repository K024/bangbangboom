using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace bangbangboom.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        public AccountController(
            UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,
            IConfiguration configuration, IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Current()
        {
            var user = await _userManager.GetUserAsync(User);
            return new
            {
                user.UserName,
                user.Email,
                Roles = await _userManager.GetRolesAsync(user)
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

            var result = await _signInManager.PasswordSignInAsync(user, Password, true, true);

            if (result.Succeeded)
                return Ok();

            if (result.IsLockedOut)
                return StatusCode(403, "LockedOut");

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
            [FromForm][Required] string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);

            if (user != null && user.UserName == UserName)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                _ = _emailSender.SendEmailAsync(Email,
                    "Reset your password in bangbangboom",
                    $"Dear {UserName},\n\n" +
                    $"To reset your password in bangbangboom, click the link below:\n" +
                    $"https://{_configuration["Domain"]}/account/resetpassword?" +
                    $"guid={user.Id}&token={WebUtility.UrlEncode(token)}\n\n" +
                    $"If you are not attempting to reset your password, please ignore this email.");
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
            [FromForm][Required] string Email)
        {
            var id = Guid.NewGuid().ToString();
            var user = new IdentityUser()
            {
                Id = id,
                UserName = id.Replace('-', '_'),
                Email = Email,
            };
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                _ = _emailSender.SendEmailAsync(Email,
                    "Confirm your email in bangbangboom",
                    $"Dear {Email},\n\n" +
                    $"To confirm your email in bangbangboom, click the link below:\n" +
                    $"https://{_configuration["Domain"]}/account/confirmemail?" +
                    $"guid={user.Id}&token={WebUtility.UrlEncode(token)}\n\n" +
                    $"If you are not attempting to register an account in bangbangboom, please ignore this email.");
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
            [FromForm][Required] string UserName,
            [FromForm][Required] string Password,
            [FromServices] AppDbContext appDbContext)
        {
            using (var transaction = appDbContext.Database.BeginTransaction())
            {
                var user = await _userManager.FindByIdAsync(Guid);
                var result = await _userManager.ConfirmEmailAsync(user, Token);
                var message = "";
                while (result.Succeeded)
                {
                    var result2 = await _userManager.SetUserNameAsync(user, UserName);
                    if (!result2.Succeeded) { message = result2.Errors.FirstOrDefault()?.Code; break; }
                    var result3 = await _userManager.AddPasswordAsync(user, Password);
                    if (!result3.Succeeded) { message = result3.Errors.FirstOrDefault()?.Code; break; }
                    await _signInManager.SignInAsync(user, true);
                    transaction.Commit();
                    return Ok();
                }
                transaction.Rollback();
                return StatusCode(401, message);
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
