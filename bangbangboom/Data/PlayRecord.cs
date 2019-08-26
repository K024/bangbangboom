﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class PlayRecord
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

        public long MapId { get; set; }
        public virtual Map Map { get; set; }

        public DateTime DateTime { get; set; }
    }
}
