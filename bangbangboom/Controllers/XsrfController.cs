using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class XsrfController : Controller
    {
        private readonly IAntiforgery _antiforgery;
        public XsrfController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        [HttpGet]
        public object Get()
        {
            return _antiforgery.GetAndStoreTokens(HttpContext).RequestToken;
        }
    }
}
