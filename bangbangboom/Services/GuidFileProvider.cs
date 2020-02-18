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

namespace bangbangboom.Services {
    public class GuidFileProviderOptions {
        public string BaseDir { get; set; }

        public int SubDirCount { get; set; } = 1;
    }

    public class GuidFileProvider {
        private readonly string baseDir;

        private readonly int subDirCount;

        public GuidFileProvider(IOptions<GuidFileProviderOptions> option) {
            var options = option.Value;
            baseDir = Path.GetFullPath(options.BaseDir);
            if (!Directory.Exists(baseDir))
                Directory.CreateDirectory(baseDir);
            subDirCount = options.SubDirCount;
            if (subDirCount < 0 || subDirCount > 10)
                subDirCount = 1;
        }

        public Stream GetFileByGuid(Guid id) {
            var finfo = GetFileInfoFromGuid(id);
            if (!finfo.Exists) throw new FileNotFoundException();
            return finfo.OpenRead();
        }

        public async Task<bool> SaveFileAsync(Guid id, Stream fileStream) {
            try {
                fileStream.Position = 0;
                var finfo = GetFileInfoFromGuid(id);
                if (!finfo.Exists) {
                    finfo.Directory.Create();
                    using var fs = finfo.Create();
                    await fileStream.CopyToAsync(fs);
                    return true;
                }
                return false;
            } finally {
                fileStream.Position = 0;
            }
        }

        public bool DeleteFile(Guid id) {
            var finfo = GetFileInfoFromGuid(id);
            if (!finfo.Exists) return false;
            finfo.Delete();
            return true;
        }

        private FileInfo GetFileInfoFromGuid(Guid id) {
            var str = id.ToString("N");
            var i = 0;
            var path = baseDir;
            while (i < subDirCount) {
                path = Path.Combine(path, str.Substring(i * 2, 2));
                i++;
            }
            path = Path.Combine(path, str.Substring(i * 2));
            return new FileInfo(path);
        }
    }

}
