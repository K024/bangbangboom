using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace bangbangboom.Services
{
    public class GuidFileProviderOptions
    {
        public string BaseDir { get; set; } = Path.Combine(
            Environment.CurrentDirectory, ".files");

        public int SubDirCount { get; set; } = 1;
    }

    public class GuidFileProvider
    {
        private readonly string baseDir;

        private readonly int subDirCount;

        public GuidFileProvider(IOptions<GuidFileProviderOptions> option)
        {
            var options = option.Value;
            baseDir = Path.GetFullPath(options.BaseDir);
            if (!Directory.Exists(baseDir))
                Directory.CreateDirectory(baseDir);
            subDirCount = options.SubDirCount;
            if (subDirCount < 0 || subDirCount > 10)
                subDirCount = 1;
        }

        public Stream GetFileByGuid(string guid)
        {
            var finfo = GetFileInfo(guid);
            if (!finfo.Exists) throw new FileNotFoundException();
            return finfo.OpenRead();
        }

        public async Task<string> SaveFileAsync(Stream fileStream)
        {
            fileStream.Position = 0;
            var guid = ToHex(Guid.NewGuid().ToByteArray());
            fileStream.Position = 0;
            var finfo = GetFileInfo(guid);
            if (!finfo.Exists)
            {
                finfo.Directory.Create();
                var fs = finfo.Create();
                await fileStream.CopyToAsync(fs);
                fs.Close();
            }
            fileStream.Position = 0;
            return guid;
        }

        public bool DeleteFile(string guid)
        {
            var finfo = GetFileInfo(guid);
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

        private FileInfo GetFileInfo(string guid)
        {
            if (guid.Length < subDirCount * 2) throw new ArgumentException();
            var i = 0;
            var path = baseDir;
            while (i < subDirCount)
            {
                path = Path.Combine(path, guid.Substring(i * 2, 2));
                i++;
            }
            path = Path.Combine(path, guid.Substring(i * 2));
            return new FileInfo(path);
        }
    }

    public static class GuidFileProviderExtensions
    {
        public static async Task<string> SaveImageFileWithThumbnail(this GuidFileProvider provider, 
            MediaFileProcessor processor, IFormFile file)
        {
            var id = "";
            var fs = file.OpenReadStream();
            if (!processor.TryProcessImage(fs, out var jpg)) return null;
            id += await provider.SaveFileAsync(jpg);
            if (processor.TryMinifyImage(jpg, out var min))
            {
                id += ":";
                id += await provider.SaveFileAsync(min);
            }
            return id;
        }

        public static Stream GetImageWithThumbnail(this GuidFileProvider provider, string id, bool min = false, out string etag)
        {
            var ids = id.Split(':');
            if (ids.Length == 2 && min)
            {
                etag = ids[1];
                return provider.GetFileByGuid(ids[1]);
            }
            etag = ids[0];
            return provider.GetFileByGuid(ids[0]);
        }

        public static void DeleteImageWithThumbnail(this GuidFileProvider provider, string id)
        {
            if (id is null) return;
            var ids = id.Split(':');
            foreach(var guid in ids)
            {
                provider.DeleteFile(guid);
            }
        }
    }
}
