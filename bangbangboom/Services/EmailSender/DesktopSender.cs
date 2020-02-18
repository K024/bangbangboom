using System;
using System.IO;
using System.Threading.Tasks;

namespace bangbangboom.Services
{

    public class DesktopSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string htmlMessage, bool isHtml = false)
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
}