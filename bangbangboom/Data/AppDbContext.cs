using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public static Action<DbContextOptionsBuilder> DefaultBuildOption;

        public static AppDbContext GetDefault()
        {
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            DefaultBuildOption(builder);
            return new AppDbContext(builder.Options);
        }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                DefaultBuildOption(optionsBuilder);
        }
    }
}
