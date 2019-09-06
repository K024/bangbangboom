using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
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
            optionsBuilder.UseLazyLoadingProxies();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany()
                .HasForeignKey(c => c.ParentCommentId);

            modelBuilder.Entity<LikeDislike>()
                .HasIndex(l => new { l.CommentId, l.UserId })
                .IsUnique();

            modelBuilder.Entity<Rate>()
                .HasIndex(l => new { l.MapId, l.UserId })
                .IsUnique();

            modelBuilder.Entity<Favorite>()
                .HasIndex(l => new { l.MapId, l.UserId })
                .IsUnique();
        }

        public DbSet<AdminRecord> AdminRecords { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<LikeDislike> LikeDislikes { get; set; }
        public DbSet<Map> Maps { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<PlayRecord> PlayRecords { get; set; }
        public DbSet<Rate> Rates { get; set; }
        public DbSet<Report> Reports { get; set; }
    }

    public static class PageExtension
    {
        public static IQueryable<T> Page<T>(this IQueryable<T> q,int page = 1, int pagesize = 24)
        {
            var p = page - 1;
            return q.Skip(p * pagesize).Take(pagesize);
        }
    }

}
