using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class Favorite
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public string Username { get; set; }
        public virtual AppUser User { get; set; }

        public long MapId { get; set; }
        public virtual Map Map { get; set; }

        public DateTime DateTime { get; set; }
    }
}
