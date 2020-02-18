using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace bangbangboom.Services
{

    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage, bool isHtml = false);
    }

    public static class IEmailSenderExtentions
    {
        public static async Task SendTokenEmailAsync(this IEmailSender sender,
            string email, string token)
        {
            var subject = "bangbangboom Verification Email";
            var message =
                $"Your verification token is:\n\n" +
                $"<h2>{token}</h2>\n\n" +
                $"Note: This token is valid for 2 hours.\n";
            await sender.SendEmailAsync(email, subject, message, true);
        }

        public static IServiceCollection AddAutoChooseSender(this IServiceCollection service, IConfiguration config)
        {
            if (config == null)
            {
                service.AddSingleton<IEmailSender, DesktopSender>();
            }
            else
            {
                service.Configure<SmtpServerOptions>(config);
                service.AddSingleton<IEmailSender, SmtpSender>();
            }
            return service;
        }
    }
}