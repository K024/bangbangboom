using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data {

    public class Map {
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
        public string ImageFileId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Status { get; set; } = "";
    }

#pragma warning disable IDE1006 // 命名样式
    public class MapInfo {
        public long id { get; set; }
        public AppUserInfo uploader { get; set; }
        public string musicname { get; set; }
        public string artist { get; set; }
        public string mapname { get; set; }
        public int difficulty { get; set; }
        public string description { get; set; }
        public int plays { get; set; }
        public int favorites { get; set; }
        public DateTimeOffset created { get; set; }
        public DateTimeOffset lastmodified { get; set; }
        public DateTimeOffset? reviewed { get; set; }
        public string status { get; set; }
        public bool hasmusic { get; set; }
        public bool hasimage { get; set; }

        // public MapInfo() { }
        public MapInfo(Map m) {
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
            hasimage = m.ImageFileId != null;
        }
    }
}
