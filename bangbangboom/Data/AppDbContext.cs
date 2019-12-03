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
                .HasOne<AppUser>().WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Comment>()
                .HasOne<Map>().WithMany()
                .HasForeignKey(c => c.MapId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Comment>()
                .HasOne<Comment>().WithMany()
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Favorite>()
                .HasOne<AppUser>().WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Favorite>()
                .HasOne<Map>().WithMany()
                .HasForeignKey(f => f.MapId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Favorite>()
                .HasIndex(l => new { l.MapId, l.UserId })
                .IsUnique();

            modelBuilder.Entity<Map>()
                .HasOne<AppUser>().WithMany()
                .HasForeignKey(m => m.UploaderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PlayRecord>()
                .HasOne<Map>().WithMany()
                .HasForeignKey(p => p.MapId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Meta>()
                .HasIndex(m => m.Usage);
            modelBuilder.Entity<Meta>()
                .HasIndex(m => new { m.Usage, m.Key })
                .IsUnique();

        }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Map> Maps { get; set; }
        public DbSet<Meta> Metas { get; set; }
        public DbSet<PlayRecord> PlayRecords { get; set; }

        public DbQuery<AppUserInfo> AppUserInfos { get; set; }
        public DbQuery<MapInfo> MapInfos { get; set; }
    }

    public static class PageExtension
    {
        public static IQueryable<T> Page<T>(this IQueryable<T> q, int page = 1, int pagesize = 24)
        {
            var p = page - 1;
            return q.Skip(p * pagesize).Take(pagesize);
        }
    }

}
