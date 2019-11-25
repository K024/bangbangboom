using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace bangbangboom
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;
            this.env = env;
        }

        private readonly IHostingEnvironment env;
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.AddLogging();
            services.AddMemoryCache();

            services.Configure<GzipCompressionProviderOptions>(
                options => options.Level = CompressionLevel.Fastest);
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<GzipCompressionProvider>();
                options.EnableForHttps = true;
            });

            AppDbContext.DefaultBuildOption += options =>
                this.ConfigureDatabase(options);

            services.AddDbContext<AppDbContext>(options =>
                AppDbContext.DefaultBuildOption(options));

            services.AddIdentity<AppUser, IdentityRole>()
                .AddDefaultTokenProviders()
                .AddEntityFrameworkStores<AppDbContext>();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;

                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
                options.User.RequireUniqueEmail = true;
                //options.SignIn.RequireConfirmedEmail = true;
            });

            services.Configure<SecurityStampValidatorOptions>(options =>
                options.ValidationInterval = TimeSpan.FromSeconds(10));

            services.Configure<DataProtectionTokenProviderOptions>(options =>
                options.TokenLifespan = TimeSpan.FromHours(2));

            void ConfigCookie(CookieBuilder cookie)
            {
                cookie.SecurePolicy = CookieSecurePolicy.None;
                cookie.SameSite = SameSiteMode.None;
                cookie.HttpOnly = true;
                cookie.Path = "/api/";
                cookie.Expiration = TimeSpan.FromDays(30);
            }

            services.ConfigureApplicationCookie(options =>
            {
                ConfigCookie(options.Cookie);
                options.ExpireTimeSpan = TimeSpan.FromDays(30);

                options.SlidingExpiration = true;

                options.Events.OnRedirectToAccessDenied =
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

            services.AddAntiforgery(options =>
            {
                ConfigCookie(options.Cookie);
                options.HeaderName = "X-XSRF-TOKEN";
            });

            services.Configure<GuidFileProviderOptions>(options =>
                options.BaseDir = Path.Combine(env.ContentRootPath, ".hashfiles"));
            services.AddSingleton<GuidFileProvider>();

            services.AddSingleton<MediaFileProcessor>();

            services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, ScheduedTaskService>();

            ConfiureProductionServices(services);

            services.AddMvc(options =>
                options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()))
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        protected virtual void ConfigureDatabase(DbContextOptionsBuilder options)
        {
            var connectionString = Configuration.GetConnectionString("MySql");
            options.UseMySql(connectionString);
        }

        protected virtual void ConfiureProductionServices(IServiceCollection services)
        {
            services.AddSingleton<IEmailSender, EmailSender>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, AppDbContext dbContext)
        {
            app.UseResponseCompression();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler(config =>
                {
                    config.Run(context =>
                    {
                        context.Response.StatusCode = 500;
                        return context.Response.WriteAsync("Internal Server Error!");
                    });
                });
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = c =>
                {
                    if (c.Context.Request.Path == "/index.html")
                        c.Context.Response.Headers.Add("Cache-Control", "public, max-age=0");
                    else
                        c.Context.Response.Headers.Add("Cache-Control", "public, max-age=3600");
                }
            });

            app.UseAuthentication();
            app.UseMvc();

            //app.Use(async (req, next) =>
            //{
            //    var uri = req.Request.Path.Value.ToLower();
            //    if (uri == "/api" || uri.StartsWith("/api/"))
            //        req.Response.StatusCode = StatusCodes.Status404NotFound;
            //    else
            //        await next();
            //});
            // app.UseSpa(config => { });

            dbContext.Database.EnsureCreated();
        }
    }
}
