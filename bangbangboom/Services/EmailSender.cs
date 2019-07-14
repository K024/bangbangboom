using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly bool isDev;
        private readonly IConfiguration _config;
        public EmailSender(IHostingEnvironment env, IConfiguration config)
        {
            isDev = env.IsDevelopment();
            _config = config;
        }
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            if (isDev)
            {
                var filename = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    "Desktop", $"Email {DateTime.Now.ToString("MM-dd")}.txt");
                var output = new StreamWriter(new FileStream(
                    filename, FileMode.Append, FileAccess.Write));
                await output.WriteAsync(
$@"----------------------------------------------------
Time: {DateTime.Now.ToString("MM-dd HH:mm:ss")}
To: {email}
Subject: {subject}
Message:
{htmlMessage}

");
                output.Close();
            }
            else
            {
                throw new NotImplementedException();
            }
        }
    }
}
