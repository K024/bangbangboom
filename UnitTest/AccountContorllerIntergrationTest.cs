using bangbangboom.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace UnitTest
{
    [TestClass]
    public class AccountContorllerIntergrationTest
    { 

        [TestMethod]
        public async Task Register_EmailSent()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var email = Utilities.UniqueEmail();
            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", email)
            });
            var result = await client.PostAsync("api/account/register", form);

            result.EnsureSuccessStatusCode();

            Assert.IsNotNull(TestEmailSender.Emails[email]);
        }

        [TestMethod]
        [DataRow("test.com")]
        [DataRow("testcom")]
        public async Task Register_BadEmails(string bademail)
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", bademail)
            });
            var result = await client.PostAsync("api/account/register", form);

            Assert.AreEqual(HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [TestMethod]
        public async Task Register_EmailConflict()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            // get a client before getting a service
            var usermanager = Utilities.GetService<UserManager<IdentityUser>>();
            var mockid = Guid.NewGuid().ToString();
            var mockemail = Utilities.UniqueEmail();
            await usermanager.CreateAsync(new IdentityUser()
            {
                Id = mockid,
                UserName = mockid.Replace('-', '_'),
                Email = mockemail
            });

            Assert.IsNotNull(await usermanager.FindByIdAsync(mockid));

            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", mockemail)
            });
            var result = await client.PostAsync("api/account/register", form);

            Assert.AreEqual(HttpStatusCode.Unauthorized, result.StatusCode);
        }

        [TestMethod]
        public async Task ConfirmEmail_UserNameConflict()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var email = Utilities.UniqueEmail();
            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", email)
            });
            var result = await client.PostAsync("api/account/register", form);

            result.EnsureSuccessStatusCode();

            Assert.IsNotNull(TestEmailSender.Emails[email]);

            var usermanager = Utilities.GetService<UserManager<IdentityUser>>();
            var mockid = Guid.NewGuid().ToString();
            var mockemail = Utilities.UniqueEmail();
            var mockusername = Utilities.UniqueUserName();
            await usermanager.CreateAsync(new IdentityUser()
            {
                Id = mockid,
                UserName = mockusername,
                Email = mockemail
            });

            Assert.IsNotNull(await usermanager.FindByIdAsync(mockid));
            GetGuidAndToken(TestEmailSender.Emails[email], out var guid, out var token);

            var form2 = Form(new
            {
                guid,
                token,
                username = mockusername,
                password = "Password123"
            });

            var result2 = await client.PostAsync("api/account/confirmemail", form2);

            Assert.AreEqual(HttpStatusCode.Unauthorized, result2.StatusCode);
            Assert.AreEqual("DuplicateUserName", await result2.Content.ReadAsStringAsync());
        }

        [TestMethod]
        [DataRow("pass123")]
        [DataRow("passwordpassword")]
        public async Task ConfirmEmail_BadPassword(string badpassword)
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var email = Utilities.UniqueEmail();
            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", email)
            });
            var result = await client.PostAsync("api/account/register", form);

            result.EnsureSuccessStatusCode();

            Assert.IsNotNull(TestEmailSender.Emails[email]);
            GetGuidAndToken(TestEmailSender.Emails[email], out var guid, out var token);

            var form2 = Form(new
            {
                guid,
                token,
                username = Utilities.UniqueUserName(),
                password = badpassword
            });

            var result2 = await client.PostAsync("api/account/confirmemail", form2);

            Assert.AreEqual(HttpStatusCode.Unauthorized, result2.StatusCode);
            Assert.IsTrue((await result2.Content.ReadAsStringAsync()).StartsWith("Password"));
        }

        [TestMethod]
        public async Task ConfirmEmail_BadToken()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var email = Utilities.UniqueEmail();
            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", email)
            });
            var result = await client.PostAsync("api/account/register", form);

            result.EnsureSuccessStatusCode();

            Assert.IsNotNull(TestEmailSender.Emails[email]);
            GetGuidAndToken(TestEmailSender.Emails[email], out var guid, out var token);

            var form2 = Form(new
            {
                guid,
                token = "BadToken",
                username = Utilities.UniqueUserName(),
                password = "Password123"
            });

            var result2 = await client.PostAsync("api/account/confirmemail", form2);

            Assert.AreEqual(HttpStatusCode.Unauthorized, result2.StatusCode);
            Assert.IsTrue(string.IsNullOrEmpty(await result2.Content.ReadAsStringAsync()));
        }

        [TestMethod]
        public async Task RegiterAndConfirmEmail_Success()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var email = Utilities.UniqueEmail();
            var form = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("email", email)
            });
            var result = await client.PostAsync("api/account/register", form);
            result.EnsureSuccessStatusCode();
            Assert.IsNotNull(TestEmailSender.Emails[email]);
            GetGuidAndToken(TestEmailSender.Emails[email], out var guid, out var token);
            var form2 = Form(new
            {
                guid,
                token,
                username = Utilities.UniqueUserName(),
                password = "Password123"
            });
            var result2 = await client.PostAsync("api/account/confirmemail", form2);
            Assert.AreEqual(HttpStatusCode.OK, result2.StatusCode);

            var result3 = await client.GetAsync("api/account/current");
            result3.EnsureSuccessStatusCode();
            var json = JObject.Parse(await result3.Content.ReadAsStringAsync());
            Assert.AreEqual(email, json["email"]);
        }

        private static void GetGuidAndToken(string email, out string guid, out string token)
        {
            var cap = Regex.Match(email, "(http.+)\n").Groups;
            Assert.AreEqual(2, cap.Count);
            var url = new Uri(cap[1].Value);
            var query = url.ParseQueryString();
            guid = query["guid"];
            token = query["token"];
            Assert.IsFalse(string.IsNullOrEmpty(guid));
            Assert.IsFalse(string.IsNullOrEmpty(token));
        }

        private static FormUrlEncodedContent Form(object o)
        {

            var dictionary = new Dictionary<string, string>();
            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(o))
            {
                object value = property.GetValue(o);
                if (value is string)
                {
                    dictionary.Add(property.Name, (string)value);
                }
            }
            return new FormUrlEncodedContent(dictionary);
        }
    }
}
