using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace bangbangboom.Services
{
    public interface IHashFileProvider
    {
        Stream GetFileByHash(byte[] hash);
        byte[] SaveFile(Stream fileStream);
    }
}
