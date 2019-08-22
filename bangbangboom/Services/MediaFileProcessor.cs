using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using System;
using System.IO;
using System.Threading.Tasks;

namespace bangbangboom.Services
{
    public class MediaFileProcessor
    {
        public bool TryProcessImage(Stream input, out Stream jpg, int maxsize = 3 * 1024 * 1024)
        {
            try
            {
                if (input.Length > maxsize) throw new Exception();
                using (var image = Image.Load(input))
                {
                    jpg = new MemoryStream();
                    image.SaveAsJpeg(jpg);
                    jpg.Position = 0;
                    return true;
                }
            }
            catch (Exception)
            {
                jpg = null;
                return false;
            }
            finally
            {
                input.Position = 0;
            }
        }
    }
}
