using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// UploadMode
    /// </summary>
    public enum UploadMode
    {
        Other = 0,
        ArticleMedia = 1,
        Profile = 2,
        Notification = 3,
        Template = 4,
        Printing = 5,
        Path = 6,// defined absoluted path
        General = 7,
        StatisticReport = 8,
        ODEFailed = 9,
        Inventory = 10,
        MailingReturn = 11,
        ImportDataMatrix = 12,
        ImageGallery = 13,
        ImportInvoicePayment = 14,
        SAVTemplate = 15
    }

    #region DownloadTemplates
    public class FileDownloadTemplatesModel
    {
        public string ZipFileName { get; set; }

        public bool IsReturnFile { get; set; }

        public UploadMode? Mode { get; set; }

        public string Id { get; set; }

        public IList<FileDownloadTemplateItem> Templates { get; set; }

        public FileDownloadTemplatesModel()
        {
            Templates = new List<FileDownloadTemplateItem>();
        }
    }

    public class FileDownloadTemplateItem
    {
        public string OriginalFilename { get; set; }
        public string Filename { get; set; }

        public string Path { get; set; }

        public UploadMode? Mode { get; set; }

        public string Id { get; set; }
        public string Content { get; set; }
    }
    #endregion

    public class FileInfoItem
    {
        /// <summary>
        /// Full file name
        /// </summary>
        public string FullFileName { get; set; }

        /// <summary>
        /// ReturnName
        /// </summary>
        public string ReturnName { get; set; }

        /// <summary>
        /// FileName
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// Extension
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// IsImage
        /// </summary>
        public bool IsImage { get; set; }
    }

    public class DeleteFileItem
    {
        public string MediaName { get; set; }

        public string SubFolder { get; set; }

        public UploadMode? UploadFileMode { get; set; }
    }
}
