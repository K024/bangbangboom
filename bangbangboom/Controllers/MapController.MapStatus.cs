using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using bangbangboom.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Identity;

namespace bangbangboom.Controllers {
    public static class MapStatus {
        public readonly static string Wip = "wip";
        public readonly static string Reviewing = "reviewing";
        public readonly static string NotPass = "notpass";
        public readonly static string Reviewed = "reviewed";
        public readonly static string Proved = "proved";

        public readonly static string[] CanModify = new[] { Wip, Reviewing, NotPass };
        public readonly static string[] CanPublicView = new[] { Reviewing, Reviewed, Proved };
        public readonly static string[] CanList = new[] { Reviewed, Proved };
    }
}