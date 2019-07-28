using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace UnitTest
{
    [TestClass]
    public class CsrfControllerIntergationTest
    {

        [TestMethod]
        public async Task ShouldReturnBadRequest()
        {
            var client = Utilities.Factory.CreateClient();
            var result = await client.PostAsync("api/ping", new StringContent(""));
            Assert.AreEqual(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [TestMethod]
        public async Task ShouldReturnPong()
        {
            var client = await Utilities.GetClientWithCsrfAsync();

            var result = await client.PostAsync("api/ping", new StringContent(""));
            result.EnsureSuccessStatusCode();

            Assert.AreEqual("pong", await result.Content.ReadAsStringAsync());
        }
    }
}
