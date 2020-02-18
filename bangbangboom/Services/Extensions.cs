using System;
using System.IO;
using System.Threading;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;

namespace bangbangboom.Services {
    public static class Extensions {
        private static int counter = 0;
        private static readonly Random random = new Random();

        public static Guid NewGuid() {
            var count = Interlocked.Increment(ref counter);
            using var stream = new MemoryStream();
            using var writer = new BinaryWriter(stream);
            writer.Write(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
            writer.Write(count);
            writer.Write(random.Next());
            var bytes = stream.ToArray();
            return new Guid(bytes);
        }

        public static DateTimeOffset GetTime(this Guid guid) {
            var bytes = guid.ToByteArray();
            var UnixTimeMilliseconds = BitConverter.ToInt64(bytes);
            return DateTimeOffset.FromUnixTimeMilliseconds(UnixTimeMilliseconds);
        }

        public static string ToHexString(this byte[] bytes, string format = "x2") {
            StringBuilder hex = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
                hex.Append(b.ToString(format));
            return hex.ToString();
        }

        public static ObjectResult ProblemResult(this ControllerBase controller, int? statusCode = null, string title = null, string instance = null, object extensions = null, string detail = null) {
            var problem = controller.ProblemDetailsFactory.CreateProblemDetails(
                controller.HttpContext,
                statusCode, title, null, detail, instance);

            if (extensions != null) {
                foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(extensions)) {
                    object value = property.GetValue(extensions);
                    problem.Extensions.Add(property.Name, value);
                }
            }

            return new ObjectResult(problem) {
                StatusCode = problem.Status
            };
        }
    }
}