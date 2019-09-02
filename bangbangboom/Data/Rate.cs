using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{

    public class Rate
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; } = 10000;

        [Required]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

        public long MapId { get; set; }
        public virtual Map Map { get; set; }

        public int RateScore { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
