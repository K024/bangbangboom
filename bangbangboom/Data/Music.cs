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
        public long Id { get; set; } = 10000;

        [Required]
        [MaxLength(50)]
        public string UploaderId { get; set; }
        public virtual AppUser Uploader { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        [Required]
        [MaxLength(100)]
        public string TitleUnicode { get; set; }
        [Required]
        [MaxLength(100)]
        public string Artist { get; set; }
        [Required]
        [MaxLength(100)]
        public string ArtistUnicode { get; set; }
        [Required]
        [MaxLength(400)]
        public string Description { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(100)]
        public string FileHash { get; set; }
        public bool Locked { get; set; } = false;
        public bool Deleted { get; set; } = false;

        public virtual List<Map> Maps { get; set; }
    }

    public class MusicShort
    {
        public long id;
        public AppUserShort uploader;
        public string title;
        public string titleunicode;
        public string artist;
        public string artistunicode;
        public bool locked;
        public DateTime date;

        public static MusicShort FromMusic(Music m)
        {
            return new MusicShort()
            {
                id = m.Id,
                uploader = AppUserShort.FromAppUser(m.Uploader),
                title = m.Title,
                titleunicode = m.TitleUnicode,
                artist = m.Artist,
                artistunicode = m.ArtistUnicode,
                locked = m.Locked,
                date = m.Date
            };
        }
    }
    public class MusicDetailed
    {
        public long id;
        public AppUserShort uploader;
        public string title;
        public string titleunicode;
        public string artist;
        public string artistunicode;
        public string description;
        public int mapscount;
        public bool locked;
        public DateTime date;

        public static MusicDetailed FromMusic(Music m)
        {
            return new MusicDetailed()
            {
                id = m.Id,
                uploader = AppUserShort.FromAppUser(m.Uploader),
                title = m.Title,
                titleunicode = m.TitleUnicode,
                artist = m.Artist,
                artistunicode = m.ArtistUnicode,
                description = m.Description,
                locked = m.Locked,
                mapscount = m.Maps.Count(),
                date = m.Date
            };
        }
    }
}
