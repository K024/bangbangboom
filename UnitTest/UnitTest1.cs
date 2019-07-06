using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Diagnostics;
using System.Net;

namespace UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var Email = "someone@test.com";
            var token = Guid.NewGuid().ToString();
            Trace.WriteLine(
                $"https://bangbang.ml/account/confirmemail?email={WebUtility.UrlEncode(Email)}&token={WebUtility.UrlEncode(token)}");
            Assert.IsTrue(true);
        }
    }
}
