using bangbangboom;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace UnitTest
{
    class TestStartup : Startup
    {
        private string dbfilename = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            "Desktop", "test.sqlite");

        public TestStartup(IConfiguration configuration) : base(configuration)
        {
            if (File.Exists(dbfilename)) File.Delete(dbfilename);
            configuration["Domain"] = "localhost:5001";
        }

        protected override void ConfigureDatabase(DbContextOptionsBuilder options)
        {
            options.UseSqlite("DataSource=" + dbfilename);
            // options.UseMySql(Configuration.GetConnectionString("MySql"));
        }

        protected override void ConfiureProductionServices(IServiceCollection services)
        {
            services.AddTransient<IEmailSender, TestEmailSender>();
        }
    }
    class CustomWebApplicationFactory<TEntryPoint> : WebApplicationFactory<TEntryPoint> where TEntryPoint : class
    {
        protected override IWebHostBuilder CreateWebHostBuilder()
        {
            return WebHost.CreateDefaultBuilder(null)
                .UseEnvironment("Development")
                .UseStartup<TEntryPoint>();
        }
    }
}
