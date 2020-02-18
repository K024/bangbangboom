using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace bangbangboom.Services
{

    public class SmtpServerOptions
    {
        public string Server { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class SmtpSender : IEmailSender
    {
        public readonly SmtpClient client;
        public readonly string username;

        public SmtpSender(IOptions<SmtpServerOptions> opt)
        {
            var options = opt.Value;
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            client = new SmtpClient(options.Server, options.Port)
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(options.UserName, options.Password),
                EnableSsl = true,
            };

            username = options.UserName;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage, bool isHtml = false)
        {
            var msg = new MailMessage(username, email)
            {
                Subject = subject,
                Body = htmlMessage,
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = isHtml,
            };
            await client.SendMailAsync(msg);
        }
    }
}