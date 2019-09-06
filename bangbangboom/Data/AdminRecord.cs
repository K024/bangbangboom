using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace bangbangboom.Data
{
    public class AdminRecord
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; } 

        [Required]
        public string AdminId { get; set; }
        public virtual AppUser Admin { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime DateTime { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
        [Required]
        [MaxLength(100)]
        public string Detail { get; set; }

        [Required]
        [MaxLength(20)]
        public string AffectType { get; set; }
        [Required]
        [MaxLength(50)]
        public string AffectId { get; set; }
    }
}
