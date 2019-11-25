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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

namespace bangbangboom.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AccountController : Controller
    {
        private readonly SignInManager<AppUser> signInManager;
        private readonly UserManager<AppUser> userManager;
        private readonly IEmailSender sender;
        private readonly IMemoryCache cache;

        public AccountController(
            UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            IEmailSender sender, IMemoryCache cache)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.sender = sender;
            this.cache = cache;
        }

        private readonly Random random = new Random();

        [NonAction]
        private string RandToken()
        {
            return random.Next(1000000, 2000000).ToString().Substring(1);
        }

        [HttpPost]
        public async Task<object> Login(
            [FromForm][Required] string UserName,
            [FromForm][Required] string Password)
        {
            var user = (UserName.IndexOf('@') >= 0) ?
                await userManager.FindByEmailAsync(UserName) :
                await userManager.FindByNameAsync(UserName);

            if (user != null)
            {
                var result = await signInManager.PasswordSignInAsync(user, Password, true, true);

                if (result.Succeeded)
                    return Ok();

                if (result.IsLockedOut)
                    return StatusCode(403, "Locked out until: " +
                        await userManager.GetLockoutEndDateAsync(user));
            }

            return StatusCode(401, "Username or password wrong.");
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Logout()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<object> ForgotPassword(
            [FromForm][Required] string Email)
        {
            var user = await userManager.FindByEmailAsync(Email);
            if (user != null)
            {
                var key = "ResetPassword:" + Email;
                if (cache.TryGetValue(key, out _))
                {
                    return StatusCode(403, "Sent too many emails.");
                }
                else
                {
                    var token = RandToken();
                    cache.Set(key, token, DateTimeOffset.Now + TimeSpan.FromHours(2));
                    await sender.SendTokenEmailAsync(Email, token);
                    return Ok();
                }
            }
            return StatusCode(401, "No such user.");
        }

        [HttpPost]
        public async Task<object> ResetPassword(
            [FromForm][Required] string Email,
            [FromForm][Required] string Token,
            [RegularExpression(@"^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[\x00-\xff]{8,20}$")]
            [FromForm][Required][MaxLength(20)] string NewPassword)
        {
            var key = "ResetPassword:" + Email;
            if (!cache.TryGetValue(key, out string token))
                return StatusCode(401, "Invalid token.");
            else if (token != Token)
                return StatusCode(401, "Invalid token.");
            cache.Remove(key);

            var user = await userManager.FindByEmailAsync(Email);
            if (user is null) return StatusCode(401, "No such user.");
            if (user.PasswordHash != null)
                await userManager.RemovePasswordAsync(user);
            if ((await userManager.AddPasswordAsync(user, NewPassword)).Succeeded)
            {
                await signInManager.SignInAsync(user, true);
                return Ok();
            }
            return StatusCode(401, "Reset password failed.");
        }

        [HttpPost]
        public async Task<object> TestEmail(
            [FromForm][Required] string Email)
        {
            var user = await userManager.FindByEmailAsync(Email);
            if (user == null)
                return Ok("acceptable");
            return Ok("registered");
        }

        [HttpPost]
        public async Task<object> SendRegisterEmail(
            [FromForm][Required] string Email)
        {
            var user = await userManager.FindByEmailAsync(Email);
            if (user != null) return StatusCode(403, "Email has been registered.");
            var key = "Register:" + Email;
            if (cache.TryGetValue(key, out _))
            {
                return StatusCode(403, "Sent too many emails.");
            }
            else
            {
                var token = RandToken();
                cache.Set(key, token, DateTimeOffset.Now + TimeSpan.FromHours(2));
                await sender.SendTokenEmailAsync(Email, token);
                return Ok();
            }
        }


        [HttpPost]
        public async Task<object> TestUserName(
            [RegularExpression(@"^[A-Za-z][A-Za-z0-9_]{3,20}$")]
            [FromForm][Required] string UserName)
        {
            var user = await userManager.FindByNameAsync(UserName);
            if (user == null)
                return Ok("acceptable");
            return Ok("registered");
        }

        [HttpPost]
        public async Task<object> Register(
            [FromForm][Required] string Email,
            [FromForm][Required] string Token,
            [RegularExpression(@"^[A-Za-z][A-Za-z0-9_]{3,20}$")]
            [FromForm][Required] string UserName,
            [RegularExpression(@"^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)[\x00-\xff]{8,20}$")]
            [FromForm][Required] string Password)
        {
            var key = "Register:" + Email;
            if (!cache.TryGetValue(key, out string token) || token != Token)
                return StatusCode(401, "Invalid token.");
            cache.Remove(key);

            var user = new AppUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = UserName,
                Email = Email,
            };
            var result1 = await userManager.CreateAsync(user, Password);
            if (!result1.Succeeded)
            {
                return StatusCode(401, "Create user failed.");
            }
            await signInManager.SignInAsync(user, true);
            return Ok();
        }
    }
}
