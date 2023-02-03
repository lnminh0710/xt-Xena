using System.Collections.Generic;

namespace XenaUI.Utils
{
    /// <summary>
    /// AppSettings
    /// </summary>
    public class AppSettings
    {
        /// <summary>
        /// OAuthSecretKey
        /// </summary>
        public string OAuthSecretKey { get; set; }

        /// <summary>
        /// OAuthAccessTokenExpire
        /// unit: hour
        /// </summary>
        public double OAuthAccessTokenExpire { get; set; }

        /// <summary>
        /// OAuthRefreshTokenExpire
        /// unit: hour
        /// </summary>
        public double OAuthRefreshTokenExpire { get; set; }

        /// <summary>
        /// OAuthAccessTokenExpireForResetPassword
        /// unit: minute
        /// </summary>
        public int OAuthAccessTokenExpireForResetPassword { get; set; }

        /// <summary>
        /// EmailSending
        /// </summary>
        public EmailSending EmailSending { get; set; }

        /// <summary>
        /// UploadFolder
        /// </summary>
        public string UploadFolder { get; set; }

        /// <summary>
        /// ArticleMediaUploadFolder
        /// </summary>
        public string ArticleMediaUploadFolder { get; set; }

        /// <summary>
        /// ProfileUploadFolder
        /// </summary>
        public string ProfileUploadFolder { get; set; }

        /// <summary>
        /// NotificationUploadFolder
        /// </summary>
        public string NotificationUploadFolder { get; set; }

        /// <summary>
        /// OtherUploadFolder
        /// </summary>
        public string OtherUploadFolder { get; set; }

        /// <summary>
        /// TemplateUploadFolder
        /// </summary>
        public string TemplateUploadFolder { get; set; }

        /// <summary>
        /// SAVTemplateUploadFolder
        /// </summary>
        public string SAVTemplateUploadFolder { get; set; }

        /// <summary>
        /// PrintingUploadFolder
        /// </summary>
        public string PrintingUploadFolder { get; set; }

        /// <summary>
        /// GeneralUploadFolder
        /// </summary>
        public string GeneralUploadFolder { get; set; }

        /// <summary>
        /// StatisticReportUploadFolder
        /// </summary>
        public string StatisticReportUploadFolder { get; set; }

        /// <summary>
        /// ODEFailedUploadFolder
        /// </summary>
        public string ODEFailedUploadFolder { get; set; }

        /// <summary>
        /// InventoryUploadFolder
        /// </summary>
        public string InventoryUploadFolder { get; set; }

        public string ImportDataMatrixFolder { get; set; }
        public string ImportInvoicePaymentFolder { get; set; }

        /// <summary>
        /// FileShareUrl
        /// </summary>
        public string BloombergUrl { get; set; }

        /// <summary>
        /// EnableTimeTraceLog
        /// </summary>
        public bool EnableTimeTraceLog { get; set; }

        /// <summary>
        /// TrackingUrl
        /// </summary>
        public string TrackingUrl { get; set; }

        /// <summary>
        /// AppVersion
        /// </summary>
        public string AppVersion { get; set; }

        /// <summary>
        /// ServerConfig
        /// </summary>
        public IList<ServerConfig> ServerConfig { get; set; }

        /// <summary>
        /// EnableLayoutCustomization
        /// </summary>
        public bool EnableLayoutCustomization { get; set; }

        /// <summary>
        /// EnableOrderFailed
        /// </summary>
        public bool EnableOrderFailed { get; set; }

        /// <summary>
        /// ApplyAccessRight
        /// </summary>
        public bool ApplyAccessRight { get; set; }

        /// <summary>
        /// EnableSignalR
        /// </summary>
        public bool EnableSignalR { get; set; }

        /// <summary>
        /// EnableSignalRForWidgetDetail
        /// </summary>
        public bool EnableSignalRForWidgetDetail { get; set; }

        /// <summary>
        /// IsSelectionProject
        /// </summary>
        public bool IsSelectionProject { get; set; }

        /// <summary>
        /// ShowDBQuery
        /// </summary>
        public bool ShowDBQuery { get; set; }

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
        /// EnableLogES
        /// </summary>
        public bool EnableLogES { get; set; }

        /// <summary>
        /// SupportEmail
        /// </summary>
        public string SupportEmail { get; set; }

        /// <summary>
        /// Image Logo Url
        /// </summary>
        public string ImageLogoUrl { get; set; }

        /// <summary>
        /// MatchingWeight
        /// </summary>
        public int MatchingWeight { get; set; }

        public ScanningTool ScanningTool { get; set; }

        /// <summary>
        /// MatchingApiUrl
        /// </summary>
        public string MatchingApiUrl { get; set; }

        /// <summary>
        /// SystemCurrency
        /// </summary>
        public Currency SystemCurrency { get; set; }

        /// <summary>
        /// SupportCampaignNumberPrefix
        /// </summary>
        public bool SupportCampaignNumberPrefix { get; set; }

        /// <summary>
        /// MaxPageSize
        /// </summary>
        public int MaxPageSize { get; set; }

        /// <summary>
        /// CallODEDoublet
        /// </summary>
        public bool CallODEDoublet { get; set; }

        public ExportReportNote ExportReportNote { get; set; }
        public AppSettings()
        {
        }

        public ColissimoConfig ColissimoConfig { get; set; }
    }

    public class ColissimoConfig
    {
        public string ContractNumber { get; set; }
        public string Key { get; set; }
        public string URLGenerateLabel { get; set; }
        public string UploadFolder { get; set; }
    }

    /// <summary>
    /// ServerConfig
    /// </summary>
    public class ServerConfig
    {
        /// <summary>
        /// Domain
        /// </summary>
        public string Domain { get; set; }

        /// <summary>
        /// ServerSetting
        /// </summary>
        public ServerSetting ServerSetting { get; set; }
    }

    /// <summary>
    /// ServerSetting
    /// </summary>
    public class ServerSetting
    {
        /// <summary>
        /// UploadFolder
        /// </summary>
        public string UploadFolder { get; set; }

        /// <summary>
        /// ServiceUrl
        /// </summary>
        public string ServiceUrl { get; set; }

        /// <summary>
        /// ElasticSearchServiceUrl
        /// </summary>
        public string ElasticSearchServiceUrl { get; set; }

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
    }

    public class EmailSending
    {
        public EmailSending()
        {
            this.Domain = "smtp.gmail.com";
        }

        /// <summary>
        /// Sender
        /// </summary>
        public string Sender { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Domain
        /// default: smtp.gmail.com
        /// </summary>
        public string Domain { get; set; }

        /// <summary>
        /// Port
        /// default: 587
        /// </summary>
        public int Port { get; set; } = 587;

        /// <summary>
        /// Type of Content (html or plain)
        /// </summary>
        public string ContentType { get; set; }
    }

    public class ScanningTool
    {
        /// <summary>
        /// DownloadUrl
        /// </summary>
        public string DownloadUrl { get; set; }

        /// <summary>
        /// Version
        /// </summary>
        public string Version { get; set; }
    }

    public class SentrySettings
    {
        /// <summary>
        /// ClientDsn
        /// </summary>
        public string ClientDsn { get; set; }
    }

    public class Currency
    {
        /// <summary>
        /// Key
        /// </summary>
        public int Key { get; set; }

        /// <summary>
        /// Value
        /// </summary>
        public string Value { get; set; }
    }

    public class ExportReportNote
    {
        public List<string> IgnoreField { get; set; }
        public string ShowLineThroughByField { get; set; }
    }
}
