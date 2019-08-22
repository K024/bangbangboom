using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace bangbangboom.Services
{
    public class HashFileProviderOptions
    {
        public HashAlgorithm HashFunc { get; set; } = new HMACMD5();

        public string BaseDir { get; set; } = Path.Combine(
            Environment.CurrentDirectory, ".hashfiles");

        public int SubDirCount { get; set; } = 1;
    }

    public class HashFileProvider
    {
        private readonly HashAlgorithm hash;

        private readonly string baseDir;

        private readonly int subDirCount;

        public HashFileProvider(IOptions<HashFileProviderOptions> option)
        {
            var options = option.Value;
            hash = options.HashFunc ?? new HMACMD5();
            baseDir = Path.GetFullPath(options.BaseDir);
            if (!Directory.Exists(baseDir))
                Directory.CreateDirectory(baseDir);
            subDirCount = options.SubDirCount;
            if (subDirCount < 0 || subDirCount > 10)
                subDirCount = 1;
        }

        public Stream GetFileByHash(string hash)
        {
            var finfo = GetFileInfo(hash);
            if (!finfo.Exists) throw new FileNotFoundException();
            return finfo.OpenRead();
        }

        public async Task<string> SaveFileAsync(Stream fileStream)
        {
            fileStream.Position = 0;
            var filehash = ToHex(hash.ComputeHash(fileStream));
            fileStream.Position = 0;
            var finfo = GetFileInfo(filehash);
            if (!finfo.Exists)
            {
                finfo.Directory.Create();
                var fs = finfo.Create();
                await fileStream.CopyToAsync(fs);
                fs.Close();
            }
            fileStream.Position = 0;
            return filehash;
        }

        public bool DeleteFile(string hash)
        {
            var finfo = GetFileInfo(hash);
            if (!finfo.Exists) return false;
            finfo.Delete();
            return true;
        }

        private static string ToHex(byte[] bytes)
        {
            StringBuilder hex = new StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
                hex.AppendFormat("{0:x2}", b);
            return hex.ToString();
        }

        private FileInfo GetFileInfo(string hexhash)
        {
            if (hexhash.Length < subDirCount * 2) throw new ArgumentException();
            var i = 0;
            var path = baseDir;
            while (i < subDirCount)
            {
                path = Path.Combine(path, hexhash.Substring(i * 2, 2));
                i++;
            }
            path = Path.Combine(path, hexhash.Substring(i * 2));
            return new FileInfo(path);
        }
    }
}
