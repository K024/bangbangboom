using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.Primitives;
using System;
using System.IO;
using System.Threading.Tasks;

namespace bangbangboom.Services {
    public class MediaFileProcessor {
        public bool TryProcessImage(Stream input, out Stream jpg, int maxsize = 3 * 1024 * 1024) {
            try {
                if (input.Length > maxsize) throw new Exception();
                using var image = Image.Load(input);
                jpg = new MemoryStream();
                image.SaveAsJpeg(jpg);
                jpg.Position = 0;
                return true;
            } catch (Exception) {
                jpg = null;
                return false;
            } finally {
                input.Position = 0;
            }
        }

        public bool TryMinifyImage(Stream input, out Stream jpg, int maxBorder = 300) {
            try {
                if (maxBorder <= 0) throw new ArgumentOutOfRangeException();

                using var image = Image.Load(input);
                using var im = image.CloneAs<Rgb24>();

                var size = im.Size();
                if (size.Width <= maxBorder && size.Height <= maxBorder) {
                    jpg = null;
                    return false;
                }
                jpg = new MemoryStream();
                var f = (double)size.Width / size.Height;
                if (f > 1) {
                    size.Width = maxBorder;
                    size.Height = (int)(maxBorder / f);
                } else {
                    size.Height = maxBorder;
                    size.Width = (int)(maxBorder * f);
                }
                im.Mutate(m => m.Resize(size));
                im.SaveAsJpeg(jpg);
                jpg.Position = 0;
                return true;
            } catch (Exception) {
                jpg = null;
                return false;
            } finally {
                input.Position = 0;
            }
        }
    }
}
