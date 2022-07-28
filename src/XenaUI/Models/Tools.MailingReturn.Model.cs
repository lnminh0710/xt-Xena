using System.Collections.Generic;
using System.IO;
using XenaUI.Utils;

namespace XenaUI.Models
{
    public class MailingReturnSaveItem
    {
        public string PersonNr { get; set; }
        public string MediaCode { get; set; }
        public string IdRepPersonStatus { get; set; }
        public string IdRepPersonBusinessStatus { get; set; }
        public string ImportFileName { get; set; }
    }

    public class MailingReturnImportFileModel
    {
        public IList<string> FileNames { get; set; }
        public IList<Stream> Files { get; set; }

        /// <summary>
        /// Column Names for checking
        /// </summary>
        public List<string> ColumnNames { get; set; }

        public MailingReturnImportFileModel()
        {
            FileNames = new List<string>();
            Files = new List<Stream>();
            ColumnNames = new List<string>();
        }
    }

    public class MailingReturnImportFileResult
    {
        public string MessageException { get; set; }
        public string MessageColumns { get; set; }
        public string MessageRows { get; set; }
        public int NumofRowsInvalid { get; set; }
        public int NumofRowsValid { get; set; }
        public IList<MailingReturnSaveItem> Data { get; set; }
        public string ImportFileName { get; set; }

        public WSEditReturn SaveResult { get; set; }

        public MailingReturnImportFileResult()
        {
            MessageException = string.Empty;
            MessageColumns = string.Empty;
            MessageRows = string.Empty;
            Data = new List<MailingReturnSaveItem>();
        }
    }
}
