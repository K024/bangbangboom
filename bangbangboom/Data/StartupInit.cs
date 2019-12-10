using bangbangboom.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace bangbangboom {
    public static class StartupInitExtensions {
        public static async void InitData(this Startup startup, IServiceProvider provider) {

            using var scope = provider.CreateScope();
            using var context = scope.ServiceProvider.GetService<AppDbContext>();
            using var usermanager = scope.ServiceProvider.GetService<UserManager<AppUser>>();
            using var rolemanager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
            var logger = scope.ServiceProvider.GetService<ILogger<Startup>>();

            await context.Database.EnsureCreatedAsync();

            var user = await usermanager.FindByNameAsync("admin");
            if (user is null) {

                var email = startup.configs.GetSection("Admin")["Email"];
                var password = startup.configs.GetSection("Admin")["Password"];

                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password)) {
                    using var transaction = await context.Database.BeginTransactionAsync();

                    user = new AppUser() {
                        Id = Guid.NewGuid().ToString(),
                        UserName = "admin",
                        Email = email,
                    };

                    await usermanager.CreateAsync(user, password);
                    if (!await rolemanager.RoleExistsAsync(Controllers.AppUserRole.Admin))
                        await rolemanager.CreateAsync(new IdentityRole(Controllers.AppUserRole.Admin));
                    if (!await rolemanager.RoleExistsAsync(Controllers.AppUserRole.Reviewer))
                        await rolemanager.CreateAsync(new IdentityRole(Controllers.AppUserRole.Reviewer));
                    await usermanager.AddToRolesAsync(user, new[] {
                                Controllers.AppUserRole.Admin, Controllers.AppUserRole.Reviewer });

                    logger.LogInformation("Admin account created.");
                    transaction.Commit();
                } else {
                    logger.LogWarning("No admin account created.");
                }
            }
        }
    }
}
