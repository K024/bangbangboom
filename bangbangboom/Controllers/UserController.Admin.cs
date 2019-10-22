﻿using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{
    public static class AppUserRole
    {
        public readonly static string Admin = "admin";
        public readonly static string Reviewer = "reviewer";
    }

    public partial class UserController : ControllerBase
    {

        [Authorize]
        [HttpGet]
        public async Task<object> All(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var users =
               from u in context.Users
               where u.EmailConfirmed
               orderby u.RegisterDate descending
               select new AppUserInfo(u);
            return users.Page(page ?? 1);
        }

        [Authorize]
        [HttpPost]
        public async Task<object> SetAdmin(
            [FromForm][Required] string username)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var to = await userManager.FindByNameAsync(username);
            if (to is null) return StatusCode(404);

            await userManager.AddToRolesAsync(to, new[] { AppUserRole.Admin, AppUserRole.Reviewer });
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> SetReviewer(
            [FromForm][Required] string username)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var to = await userManager.FindByNameAsync(username);
            if (to is null) return StatusCode(404);

            await userManager.AddToRolesAsync(to, new[] { AppUserRole.Reviewer });
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> UnsetReviewer(
            [FromForm][Required] string username)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var to = await userManager.FindByNameAsync(username);
            if (to is null) return StatusCode(404);
            if (await userManager.IsInRoleAsync(to, AppUserRole.Admin))
                return StatusCode(403);

            await userManager.RemoveFromRolesAsync(to, new[] { AppUserRole.Reviewer });
            return Ok();
        }


        [Authorize]
        [HttpPost]
        public async Task<object> BlockUser(
            [FromForm] int? days,
            [FromForm][Required] string username)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var to = await userManager.FindByNameAsync(username);
            if (to is null) return StatusCode(404);
            if (await userManager.IsInRoleAsync(to, AppUserRole.Admin))
                return StatusCode(403);

            await userManager.SetLockoutEndDateAsync(to, DateTimeOffset.Now + TimeSpan.FromDays(days ?? -1));
            return Ok();
        }
    }
}