using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
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
                return StatusCode(401, "LockedOut");

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return StatusCode(401, "EmailNotConfirmed");

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
        public async Task<object> TryResetPassword(
            [FromForm][Required] string UserName,
            [FromForm][Required] string Email)
        {
            var user = await _userManager.FindByEmailAsync(Email);

            if (user?.UserName == UserName)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                _ = _emailSender.SendEmailAsync(Email,
                    "Reset your password in bangbangboom",
                    $@"
Dear {UserName},

To reset your password in bangbangboom, click the link below:
https://{_configuration["Domain"]}/account/confirmemail?email={WebUtility.UrlEncode(Email)}&token={WebUtility.UrlEncode(token)}

If you are not attempting to reset your password, please ignore this email.
");
                return Ok();
            }
            return StatusCode(401);
        }

        [HttpPost]
        public async Task<object> ResetPassword(
            [FromForm][Required] string Email,
            [FromForm][Required] string Token,
            [FromForm][Required] string NewPassword)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            var result = await _userManager.ResetPasswordAsync(user, Token, NewPassword);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, true);
                return Ok();
            }
            return StatusCode(401);
        }

        [HttpPost]
        public async Task<object> Register(
            [FromForm][Required] string UserName,
            [FromForm][Required] string Email,
            [FromForm][Required] string Password)
        {
            var user = new IdentityUser()
            {
                Id = UserName,
                UserName = UserName,
                Email = Email,
            };
            var result = await _userManager.CreateAsync(user, Password);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                _ = _emailSender.SendEmailAsync(Email,
                    "Confirm your email in bangbangboom",
                    $@"
Dear {UserName},

To confirm your email in bangbangboom, click the link below:
https://{_configuration["Domain"]}/account/confirmemail?email={WebUtility.UrlEncode(Email)}&token={WebUtility.UrlEncode(token)}

If you are not attempting to register an account in bangbangboom, please ignore this email.
");
                DeleteIfNotConfirmedAfter2h(user);
                return Ok();
            }
            return StatusCode(401, result.Errors.FirstOrDefault()?.Code);
        }

        [HttpPost]
        public async Task<object> ConfirmEmail(
            [FromForm][Required] string Email,
            [FromForm][Required] string Token)
        {
            var user = await _userManager.FindByEmailAsync(Email);
            var result = await _userManager.ConfirmEmailAsync(user, Token);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, true);
                return Ok();
            }
            return StatusCode(401);
        }

        [NonAction]
        private void DeleteIfNotConfirmedAfter2h(IdentityUser user)
        {
            Task.Run(async () =>
            {
                await Task.Delay(TimeSpan.FromHours(2));
                if(!await _userManager.IsEmailConfirmedAsync(user))
                {
                    await _userManager.DeleteAsync(user);
                }
            });
        }
    }
}
