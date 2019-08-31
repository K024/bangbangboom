using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{

    public class Map
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string UploaderId { get; set; }
        public virtual AppUser Uploader { get; set; }

        public long MusicId { get; set; }
        public virtual Music Music { get; set; }

        [Required]
        [MaxLength(100)]
        public string MapName { get; set; }

        public double Difficulty { get; set; }

        [Required]
        [MaxLength(400)]
        public string Description { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime Date { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastModified { get; set; }

        [Required]
        public string MapContent { get; set; }
        [Required]
        [MaxLength(100)]
        public string ImageFileHashAndType { get; set; }

        public bool Proved { get; set; } = false;
        public virtual List<Rate> Rates { get; set; }
        public virtual List<PlayRecord> PlayRecords { get; set; }
        public virtual List<Comment> Comments { get; set; }

        public bool Locked { get; set; } = false;
        public bool Deleted { get; set; } = false;
    }

    public class MapShort
    {
        public long id;
        public string mapname;
        public double difficulty;
        public bool proved;
        public double rate;
        public long plays;
        public MusicShort music;
        public AppUserShort uploader;
        public bool locked;

        public static MapShort FormMap(Map m)
        {
            return new MapShort()
            {
                id = m.Id,
                mapname = m.MapName,
                difficulty = m.Difficulty,
                proved = m.Proved,
                rate = m.Rates.Average(r => r.RateScore),
                plays = m.PlayRecords.Count,
                music = MusicShort.FromMusic(m.Music),
                uploader = AppUserShort.FromAppUser(m.Uploader),
                locked = m.Locked,
            };
        }

    }
    public class MapDetailed
    {
        public long id;
        public string mapname;
        public double difficulty;
        public bool proved;
        public string descrption;
        public double rate;
        public long plays;
        public DateTime date;
        public DateTime lastmodified;
        public MusicDetailed music;
        public AppUserShort uploader;
        public bool locked;

        public static MapDetailed FormMap(Map m)
        {
            return new MapDetailed()
            {
                id = m.Id,
                mapname = m.MapName,
                difficulty = m.Difficulty,
                proved = m.Proved,
                descrption = m.Description,
                rate = m.Rates.Average(r => r.RateScore),
                plays = m.PlayRecords.Count,
                date = m.Date,
                lastmodified = m.LastModified,
                music = MusicDetailed.FromMusic(m.Music),
                uploader = AppUserShort.FromAppUser(m.Uploader),
                locked = m.Locked,
            };
        }

    }
}
