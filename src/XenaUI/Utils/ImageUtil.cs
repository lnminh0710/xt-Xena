using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace XenaUI.Utils
{
    public class ImageUtil
    {
        //public Image Base64ToImage(string base64String)
        //{
        //    // Convert base 64 string to byte[]
        //    byte[] imageBytes = Convert.FromBase64String(base64String);
        //    // Convert byte[] to Image
        //    using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        //    {
        //        Image image = Image.FromStream(ms, true);
        //        return image;
        //    }
        //}

        public static bool RewriteImage(Stream stream, string saveFilePath, bool isDisposeImage = false, Encoder encoder = null, long encoderValue = 90L)
        {
            var bmpUpload = (Bitmap)Image.FromStream(stream);
            return RewriteImage(bmpUpload, saveFilePath, isDisposeImage, encoder, encoderValue);
        }

        public static bool RewriteImage(string sourceFilePath, string saveFilePath, bool isDisposeImage = false, Encoder encoder = null, long encoderValue = 90L)
        {
            if (!File.Exists(sourceFilePath)) return false;

            var bmpUpload = (Bitmap)Image.FromFile(sourceFilePath, true);
            return RewriteImage(bmpUpload, saveFilePath, isDisposeImage, encoder, encoderValue);
        }

        public static bool RewriteImage(Bitmap sourceBitmap, string saveFilePath, bool isDisposeImage = false, Encoder encoder = null, long encoderValue = 90L)
        {
            if (sourceBitmap == null) return false;

            ImageCodecInfo[] info = ImageCodecInfo.GetImageEncoders();
            var encoderParams = new EncoderParameters(1);
            encoderParams.Param[0] = new EncoderParameter(encoder ?? Encoder.Quality, encoderValue);
            sourceBitmap.Save(saveFilePath, info[1], encoderParams);

            encoderParams.Dispose();
            if (isDisposeImage)
            {
                sourceBitmap.Dispose();
                sourceBitmap = null;
            }
            return true;
        }
    }
}
