using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class PlayRecord
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; } 

        [MaxLength(100)]
        public string UserId { get; set; }

        public long MapId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTimeOffset DateTime { get; set; } = DateTimeOffset.Now;
    }
}
