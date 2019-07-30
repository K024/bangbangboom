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

            modelBuilder.ManyToAppUser<Music>(
                m => m.UploaderName,
                m => m.Uploader,
                u => u.UploadedMusics);

            modelBuilder.ManyToAppUser<Map>(
                m => m.UploaderName,
                m => m.Uploader,
                u => u.UploadedMaps);

            modelBuilder.ManyToAppUser<Rate>(
                r => r.Username,
                r => r.User);

            modelBuilder.ManyToAppUser<Comment>(
                r => r.Username,
                r => r.User);

            modelBuilder.ManyToAppUser<LikeDislike>(
                r => r.Username,
                r => r.User);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.SubComments)
                .HasForeignKey(c => c.ParentCommentId);

            modelBuilder.Entity<LikeDislike>()
                .HasIndex(l => new { l.Username, l.CommentId })
                .IsUnique();

            modelBuilder.Entity<Rate>()
                .HasIndex(l => new { l.Username, l.MapId })
                .IsUnique();
        }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<LikeDislike> LikeDislikes { get; set; }
        public DbSet<Map> Maps { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<Rate> Rates { get; set; }
    }

    
    static class ModelBuilderExtensions
    {

        public static void ManyToAppUser<TEntity>(
            this ModelBuilder builder,
            Expression<Func<TEntity, object>> ForeignKey,
            Expression<Func<TEntity, AppUser>> NavProp = null,
            Expression<Func<AppUser, IEnumerable<TEntity>>> RevNavProp = null)
            where TEntity : class
        {
            var r1 = builder.Entity<TEntity>();

            ReferenceNavigationBuilder<TEntity, AppUser> r2;
            if (NavProp != null) r2 = r1.HasOne(NavProp);
            else r2 = r1.HasOne<AppUser>();

            ReferenceCollectionBuilder<AppUser, TEntity> r3;
            if (RevNavProp != null) r3 = r2.WithMany(RevNavProp);
            else r3 = r2.WithMany();

            r3.HasForeignKey(ForeignKey)
                .HasPrincipalKey(u => u.UserName)
                .IsRequired();
        }
    }
}
