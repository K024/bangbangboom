using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace bangbangboom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CsrfController : Controller
    {
        private readonly IAntiforgery _antiforgery;
        public CsrfController(IAntiforgery antiforgery)
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
