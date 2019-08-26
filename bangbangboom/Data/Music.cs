using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class Music
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [MaxLength(50)]
        public string UploaderId { get; set; }
        public virtual AppUser Uploader { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }
        [MaxLength(100)]
        public string TitleUnicode { get; set; }
        [MaxLength(100)]
        public string Artist { get; set; }
        [MaxLength(100)]
        public string ArtistUnicode { get; set; }
        [MaxLength(400)]
        public string Description { get; set; }
        public DateTime Date { get; set; }

        [MaxLength(100)]
        public string FileHash { get; set; }
        public bool Locked { get; set; } = false;
        public bool Deleted { get; set; } = false;

        public virtual List<Map> Maps { get; set; }
    }
}
