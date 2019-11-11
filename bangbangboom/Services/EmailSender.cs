using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace bangbangboom.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IEmailSender sender;

        public EmailSender(IConfiguration config)
        {
            //IEmailSenderExtentions.Domain = config["Domain"] ?? "localhost";
            var cfg = config.GetSection("SMTP");
            if (cfg.Value != null)
                sender = new SmtpSender(cfg["server"], cfg.GetValue<int>("port"), cfg["user"], cfg["password"]);
            else
                sender = new DesktopSender();
        }
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            await sender.SendEmailAsync(email, subject, htmlMessage);
        }
    }

    public class DesktopSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
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
    }

    public class SmtpSender : IEmailSender
    {
        public readonly SmtpClient client;
        public readonly string username;

        public SmtpSender(string server, int port, string username, string password)
        {
            client = new SmtpClient(server, port)
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true,
            };

            this.username = username;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var msg = new MailMessage(username, email)
            {
                Subject = subject,
                Body = htmlMessage,
                BodyEncoding = Encoding.UTF8
            };
            await client.SendMailAsync(msg);
        }
    }

    public static class IEmailSenderExtentions
    {
        public static async Task SendTokenEmailAsync(this IEmailSender sender,
            string email, string token)
        {
            var subject = "bangbangboom Verification Email";
            var message =
                $"Your verification token is:\n\n" +
                $"<h2> {token} </h2>\n\n" +
                $"Note: This token is valid for 2 hours.\n";
            await sender.SendEmailAsync(email, subject, message);
        }
    }
}
