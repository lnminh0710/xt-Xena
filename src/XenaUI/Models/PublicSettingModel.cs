using System;

namespace XenaUI.Models
{
    public class PublicSettingModel
    {
        /// <summary>
        /// UploadFolder
        /// </summary>
        public string UploadFolder { get; set; }

        /// <summary>
        /// TrackingUrl
        /// </summary>
        public string TrackingUrl { get; set; }

        /// <summary>
        /// FileShareUrl
        /// </summary>
        public string FileShareUrl { get; set; }

        /// <summary>
        /// SignalRApiUrl
        /// </summary>
        public string SignalRApiUrl { get; set; }

        /// <summary>
        /// PdfApiUrl
        /// </summary>
        public string PdfApiUrl { get; set; }

        /// <summary>
        /// AppVersion
        /// </summary>
        public string AppVersion { get; set; }

        /// <summary>
        /// EnableLayoutCustomization
        /// </summary>
        public bool EnableLayoutCustomization { get; set; }

        /// <summary>
        /// ApplyAccessRight
        /// </summary>
        public bool ApplyAccessRight { get; set; }

        /// <summary>
        /// IsSelectionProject
        /// </summary>
        public bool IsSelectionProject { get; set; }

        /// <summary>
        /// EnableOrderFailed
        /// </summary>
        public bool EnableOrderFailed { get; set; }

        /// <summary>
        /// EnableSignalR
        /// </summary>
        public bool EnableSignalR { get; set; }

        /// <summary>
        /// EnableSignalRForWidgetDetail
        /// </summary>
        public bool EnableSignalRForWidgetDetail { get; set; }

        /// <summary>
        /// EnableGSNewWindow
        /// </summary>
        public bool EnableGSNewWindow { get; set; }

        /// <summary>
        /// EnableSearchCustomerContact
        /// </summary>
        public bool EnableSearchCustomerContact { get; set; }

        /// <summary>
        /// JSPrintManagerDownloadLink
        /// </summary>
        public string JSPrintManagerDownloadLink { get; set; }

        /// <summary>
        /// MatchingWeight
        /// </summary>
        public int MatchingWeight { get; set; }

        public DateTime ServerDateNow { get; set; }

        public object SystemInfo { get; set; }

        public object Sentry { get; set; }

        public object ScanningTool { get; set; }

        public string ClientIpAddress { get; set; }

        public Utils.Currency SystemCurrency { get; set; }
        public bool SupportCampaignNumberPrefix { get; set; }
        public int MaxPageSize { get; set; }
        public bool CallODEDoublet { get; set; }
        public PublicSettingModel()
        {
            ServerDateNow = DateTime.Now;
        }
    }
}
