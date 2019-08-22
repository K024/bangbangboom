using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PingController : ControllerBase
    {
        // GET api/ping
        [HttpGet]
        public object Get()
        {
            return "pong";
        }

        // GET api/ping/authorized
        [Authorize]
        [HttpGet("authorized")]
        public object GetAuthorized()
        {
            return "pong";
        }

        // POST api/ping
        [HttpPost]
        public object Post()
        {
            return "pong";
        }

        // POST api/ping/echo
        [HttpPost("echo")]
        public object PostEcho([FromForm][Required] string message)
        {
            return message;
        }
    }
}
