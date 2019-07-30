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

        public string UploaderName { get; set; }
        public virtual AppUser Uploader { get; set; }

        public long MusicId { get; set; }
        public virtual Music Music { get; set; }

        [MaxLength(100)]
        public string MapName { get; set; }
        [MaxLength(400)]
        public string Description { get; set; }
        public DateTime Date { get; set; }

        public string MapContent { get; set; }
        [MaxLength(100)]
        public string ImageFileHash { get; set; }

        public long PlayCount { get; set; }
        public bool Proved { get; set; } = false;
        public virtual List<Rate> Rates { get; set; }
        public virtual List<Comment> Comments { get; set; }

        public bool Locked { get; set; } = false;
    }
}
