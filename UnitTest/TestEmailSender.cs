using Microsoft.AspNetCore.Identity.UI.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest
{
    class TestEmailSender : IEmailSender
    {
        public readonly static Dictionary<string, string> Emails = new Dictionary<string, string>();

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            Emails[email] = "Subject: " + subject + "\nBody:\n" + htmlMessage;
            return Task.CompletedTask;
        }
    }
}
