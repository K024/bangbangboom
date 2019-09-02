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
        public long Id { get; set; } = 10000;

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
        public DateTime Date { get; set; } = DateTime.Now;
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastModified { get; set; } = DateTime.Now;

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

    public class RateDetail
    {
        public int r1;
        public int r2;
        public int r3;
        public int r4;
        public int r5;

        public static RateDetail FromRates(IEnumerable<Rate> rates)
        {
            var groups = rates.GroupBy(r => r.RateScore);
            var d = new RateDetail();
            foreach(var g in groups)
            {
                switch(g.Key)
                {
                    case 1: d.r1 = g.Count(); break;
                    case 2: d.r2 = g.Count(); break;
                    case 3: d.r3 = g.Count(); break;
                    case 4: d.r4 = g.Count(); break;
                    case 5: d.r5 = g.Count(); break;
                }
            }
            return d;
        }
    }
    public class MapDetailed
    {
        public long id;
        public string mapname;
        public double difficulty;
        public bool proved;
        public string description;
        public RateDetail rate;
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
                description = m.Description,
                rate = RateDetail.FromRates(m.Rates),
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
