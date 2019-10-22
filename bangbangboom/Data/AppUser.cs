
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class AppUser : IdentityUser
    {
        [MaxLength(50)]
        public string NickName { get; set; }
        [MaxLength(100)]
        public string ProfileFileHash { get; set; }
        [MaxLength(300)]
        public string WhatsUp { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTimeOffset RegisterDate { get; set; } = DateTime.Now;
    }

    public class AppUserInfo
    {
        public string username;
        public string nickname;
        public string whatsup;
        public bool hasprofile;
        public int? uploadedmaps;
        // public AppUserInfo() { }
        public AppUserInfo(AppUser u)
        {
            username = u.UserName;
            nickname = u.NickName;
            whatsup = u.WhatsUp;
            hasprofile = u.ProfileFileHash != null;
        }
    }
}