using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace bangbangboom.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly bool isDev;
        private object UserName;

        public EmailSender(IHostingEnvironment env, IConfiguration config)
        {
            isDev = env.IsDevelopment();
            IEmailSenderExtentions.domain = config["Domain"];
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

    public static class IEmailSenderExtentions
    {
        public static string domain { get; set; } = "localhost";

        public static async Task SendRegisterConfirmEmailAsync(this IEmailSender sender, 
            string email, string guid, string token)
        {
            var subject = "Confirm your email in bangbangboom";
            var message =
                $"Dear {email},\n\n" +
                $"To confirm your email in bangbangboom, click the link below:\n" +
                $"https://{domain}/confirmemail?" +
                $"guid={guid}&token={WebUtility.UrlEncode(token)}\n\n" +
                $"If you are not attempting to register an account in bangbangboom, please ignore this email.";
            await sender.SendEmailAsync(email, subject, message);
        }

        public static async Task SendResetPasswordEmailAsync(this IEmailSender sender, 
            string email, string username, string guid, string token)
        {
            var subject = "Reset your password in bangbangboom";
            var message =
                $"Dear {username},\n\n" +
                $"To reset your password in bangbangboom, click the link below:\n" +
                $"https://{domain}/resetpass?" +
                $"guid={guid}&token={WebUtility.UrlEncode(token)}\n\n" +
                $"If you are not attempting to reset your password, please ignore this email.";
            await sender.SendEmailAsync(email, subject, message);
        }
    }
}
