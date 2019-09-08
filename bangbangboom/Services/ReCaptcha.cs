using bangbangboom.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace bangbangboom.Services
{
    public class ReCaptchaService
    {
        private readonly string secret;
        private readonly string header = "X-reCAPTCHA";

        private readonly HttpClient client = new HttpClient();
        private static readonly string url = "https://www.recaptcha.net/recaptcha/api/siteverify";
        public readonly ILogger logger;

        public ReCaptchaService(IConfiguration config, ILogger logger)
        {
            secret = config.GetSection("ReCaptcha")?["secret"];
            header = config.GetSection("ReCaptcha")?["header"] ?? header;
            client.Timeout = TimeSpan.FromSeconds(10);
            this.logger = logger;
        }

        public async Task<bool> Verify(HttpRequest request, double minScore)
        {
            try
            {
                if (secret is null) throw new Exception("ReCaptcha secret is null");

                var ip = request.HttpContext.Connection.RemoteIpAddress.ToString();
                var token = request.Headers[header].FirstOrDefault();

                if (token is null) return false;

                var r = await client.PostAsync(url, new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", secret),
                    new KeyValuePair<string, string>("response", token),
                    new KeyValuePair<string, string>("remoteip", ip),
                }));
                r.EnsureSuccessStatusCode();
                var res = JsonConvert.DeserializeObject<Response>(await r.Content.ReadAsStringAsync());
                return minScore <= res.score;
            }
            catch (Exception e)
            {
                logger.LogError(e, "ReCaptcha not verified");
                return true;
            }
        }

#pragma warning disable CS0649
        private class Response
        {
            public bool success;
            public double score;
            public string action;
            public DateTime challenge_ts;
            public string hostname;
            public string[] errorCodes;
        }
#pragma warning restore CS0649

        public class BanRecord
        {
            public DateTime time;
            public int counter = 0;
        }
    }

    public class ReCaptchaAttribute : Attribute, IAsyncActionFilter, IFilterFactory
    {
        private ReCaptchaService service;
        private AppDbContext context;
        public bool IsReusable => false;

        private readonly double minScore;

        public ReCaptchaAttribute(double minScore = 0.2)
        {
            this.minScore = minScore;
        }

        public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
        {
            service = serviceProvider.GetRequiredService<ReCaptchaService>();
            context = serviceProvider.GetRequiredService<AppDbContext>();
            return null;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (context.HttpContext.Request.Method.ToLower() == "post" 
                && !context.Filters.Any(f => f is NoReCaptchaAttribute))
            {
                var ip = context.HttpContext.Connection.RemoteIpAddress.ToString();
                var res = await service.Verify(context.HttpContext.Request, minScore);
                if (!res)
                {
                    service.logger.LogWarning("reCaptcha Verify failed on ip: " + ip);
                }
            }
            await next();
        }
    }

    public class NoReCaptchaAttribute : Attribute, IAsyncActionFilter
    {
        public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            return next();
        }
    }
}
