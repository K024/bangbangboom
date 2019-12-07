
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data {
    public class AppUser : IdentityUser {
        [MaxLength(50)]
        public string NickName { get; set; }
        [MaxLength(100)]
        public string ProfileFileId { get; set; }
        [MaxLength(300)]
        public string WhatsUp { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTimeOffset RegisterDate { get; set; } = DateTime.Now;
    }

#pragma warning disable IDE1006 // 命名样式
    public class AppUserInfo {
        public string username { get; set; }
        public string nickname { get; set; }
        public string whatsup { get; set; }
        public bool hasprofile { get; set; }
        public string[] roles { get; set; }
        public int? uploadedmaps { get; set; }
        // public AppUserInfo() { }
        public AppUserInfo(AppUser u) {
            username = u.UserName;
            nickname = u.NickName;
            whatsup = u.WhatsUp;
            hasprofile = u.ProfileFileId != null;
        }
    }
}