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
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace bangbangboom {
    public class Startup {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment) {
            configs = configuration;
            env = environment;
        }

        public readonly IWebHostEnvironment env;
        public readonly IConfiguration configs;

        public void ConfigureServices(IServiceCollection services) {
            services.AddOptions();
            services.AddLogging();
            services.AddMemoryCache();

            services.Configure<GzipCompressionProviderOptions>(
                options => options.Level = CompressionLevel.Fastest);
            services.AddResponseCompression(options => {
                options.Providers.Add<GzipCompressionProvider>();
                options.EnableForHttps = true;
            });

            AppDbContext.DefaultBuildOption += options => {
                var connectionString = configs.GetConnectionString("MySql");
                options.UseMySql(connectionString);
            };

            services.AddDbContext<AppDbContext>(options =>
                AppDbContext.DefaultBuildOption(options));

            services.AddIdentity<AppUser, IdentityRole>()
                .AddDefaultTokenProviders()
                .AddEntityFrameworkStores<AppDbContext>();

            services.Configure<IdentityOptions>(options => {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;

                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
                options.User.RequireUniqueEmail = true;
            });

            services.Configure<SecurityStampValidatorOptions>(options =>
                options.ValidationInterval = TimeSpan.FromMinutes(5));

            services.Configure<DataProtectionTokenProviderOptions>(options =>
                options.TokenLifespan = TimeSpan.FromHours(2));

            services.ConfigureApplicationCookie(options => {
                options.ExpireTimeSpan = TimeSpan.FromDays(30);

                options.SlidingExpiration = true;

                options.Events.OnRedirectToAccessDenied =
                options.Events.OnRedirectToLogin = context => {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

            services.AddAntiforgery(options => {
                options.HeaderName = "X-XSRF-TOKEN";
            });

            services.Configure<GuidFileProviderOptions>(options =>
                options.BaseDir = Path.Combine(env.ContentRootPath, configs["AppFiles"] ?? ".appfiles"));
            services.AddSingleton<GuidFileProvider>();
            services.AddSingleton<MediaFileProcessor>();
            services.AddSingleton<IHostedService, ScheduedTaskService>();
            services.AddSingleton<IEmailSender, EmailSender>();

            services.AddSingleton<AutoValidateAntiforgeryTokenAuthorizationFilter>();
            services.AddControllers(options =>
                options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));
        }


        public void Configure(IApplicationBuilder app, IServiceProvider serviceProvider) {

            app.UseResponseCompression();

            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseExceptionHandler(config => {
                    config.Run(context => {
                        context.Response.StatusCode = 500;
                        return context.Response.WriteAsync("Internal Server Error!");
                    });
                });
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions() {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions() {
                OnPrepareResponse = c => {
                    if (c.Context.Request.Path == "/index.html")
                        c.Context.Response.Headers.Add("Cache-Control", "public, max-age=0");
                    else
                        c.Context.Response.Headers.Add("Cache-Control", "public, max-age=3600");
                }
            });

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoint => {
                endpoint.MapControllers();
            });

            this.InitData(serviceProvider);
        }

    }
}
