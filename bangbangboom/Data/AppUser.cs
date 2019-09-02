
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        public DateTime Date { get; set; } = DateTime.Now;

        public virtual List<Music> UploadedMusics { get; set; }
        public virtual List<Map> UploadedMaps { get; set; }
        public virtual List<Favorite> Favorites { get; set; }

    }

    public class AppUserShort
    {
        public string username;
        public string nickname;

        public static AppUserShort FromAppUser(AppUser u)
        {
            return new AppUserShort()
            {
                username = u.UserName,
                nickname = u.NickName ?? u.UserName,
            };
        }
    }

    public class AppUserDetailed
    {
        public string username;
        public string nickname;
        public string whatsup;
        public bool hasprofile;
        public int uploadedmusics;
        public int uploadedmaps;
        public static AppUserDetailed FromAppUser(AppUser u)
        {
            return new AppUserDetailed()
            {
                username = u.UserName,
                nickname = u.NickName ?? u.UserName,
                whatsup = u.WhatsUp ?? "",
                hasprofile = !string.IsNullOrEmpty(u.ProfileFileHash),
                uploadedmusics = u.UploadedMusics.Count,
                uploadedmaps = u.UploadedMaps.Count
            };
        }
    }
}