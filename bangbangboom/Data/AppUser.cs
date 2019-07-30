using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

        public virtual List<Music> UploadedMusics { get; set; }
        public virtual List<Map> UploadedMaps { get; set; }
    }
}