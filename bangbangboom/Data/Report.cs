using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class Report
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; } = 10000;

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(30)]
        public string From { get; set; }

        [Required]
        [MaxLength(30)]
        public string Type { get; set; }
        [Required]
        [MaxLength(30)]
        public string Target { get; set; }

        [Required]
        [MaxLength(400)]
        public string Reason { get; set; }

        public bool Handled { get; set; } = false;

        public string HandledById { get; set; }
        public virtual AppUser HandledBy { get; set; }

        [MaxLength(200)]
        public string Additional { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastModified { get; set; } = DateTime.Now;
    }

    public class ReportDetail
    {
        public long id;
        public DateTime date;
        public string from;
        public string type;
        public string target;
        public string reason;
        public bool handled;
        public AppUserShort handledby;
        public string additional;
        public DateTime lastmodified;

        public static ReportDetail FromReport(Report r)
        {
            return new ReportDetail()
            {
                id = r.Id,
                date = r.Date,
                from = r.From,
                type = r.Type,
                target = r.Target,
                reason = r.Reason,
                handled = r.Handled,
                handledby = (r.HandledBy is null) ? null : AppUserShort.FromAppUser(r.HandledBy),
                additional = r.Additional,
                lastmodified = r.LastModified
            };
        }
    }

}
