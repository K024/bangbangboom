using Microsoft.EntityFrameworkCore;
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

        [MaxLength(100)]
        public string MusicName { get; set; }

        [MaxLength(100)]
        public string Artist { get; set; }

        [MaxLength(100)]
        public string MapName { get; set; }

        public int Difficulty { get; set; }

        [MaxLength(400)]
        public string Description { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTimeOffset Created { get; set; } = DateTimeOffset.Now;
        public DateTimeOffset LastModified { get; set; } = DateTimeOffset.Now;
        public DateTimeOffset? Reviewed { get; set; }

        [MaxLength(100)]
        public string MusicFileId { get; set; }
        public string MapContent { get; set; }
        [MaxLength(100)]
        public string ImageFileIdAndType { get; set; }

        [Required]
        [MaxLength(10)]
        public string Status { get; set; } = "";
    }

    public class MapInfo
    {
        public long id;
        public AppUserInfo uploader;
        public string musicname;
        public string artist;
        public string mapname;
        public int difficulty;
        public string description;
        public int plays;
        public int favorites;
        public DateTimeOffset created;
        public DateTimeOffset lastmodified;
        public DateTimeOffset? reviewed;
        public string status;
        public bool hasmusic;
        public bool hasimage;

        // public MapInfo() { }
        public MapInfo(Map m)
        {
            id = m.Id;
            musicname = m.MusicName;
            artist = m.Artist;
            mapname = m.MapName;
            difficulty = m.Difficulty;
            created = m.Created;
            lastmodified = m.LastModified;
            reviewed = m.Reviewed;
            status = m.Status;
            hasmusic = m.MusicFileId != null;
            hasimage = m.ImageFileIdAndType != null;
        }
    }
}
