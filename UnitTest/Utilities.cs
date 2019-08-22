using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace UnitTest
{
    static class Utilities
    {
        private static WebApplicationFactory<TestStartup> _factory;

        public static WebApplicationFactory<TestStartup> Factory
        {
            get
            {
                if (_factory is null) _factory = new CustomWebApplicationFactory<TestStartup>()
                  .WithWebHostBuilder(options =>
                  {
                      options.UseSetting("https_port", "5001");
                  });
                return _factory;
            }
        }

        public static TService GetService<TService>()
        {
            var scope = Factory.Server.Host.Services.CreateScope();
            return scope.ServiceProvider.GetRequiredService<TService>();
        }

        public static async Task<HttpClient> GetClientWithCsrfAsync()
        {
            var client = Factory.CreateClient();
            var token = await client.GetAsync("api/xsrf");
            token.EnsureSuccessStatusCode();
            client.DefaultRequestHeaders.Add("X-CSRF-TOKEN", await token.Content.ReadAsStringAsync());
            return client;
        }

        public static async Task DumpResponseAsync(HttpResponseMessage response)
        {
            string fileName = System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + ".html";
            var fs = new StreamWriter(new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.Write));
            await fs.WriteAsync(await response.Content.ReadAsStringAsync());
            fs.Close();
            System.Diagnostics.Process.Start(@"cmd.exe ", @"/c " + fileName);
        }

        public static string UniqueEmail()
        {
            return Guid.NewGuid().ToString().Substring(0, 8) + "@test.com";
        }
        public static string UniqueUserName()
        {
            return Guid.NewGuid().ToString().Substring(0, 8);
        }
    }
}
