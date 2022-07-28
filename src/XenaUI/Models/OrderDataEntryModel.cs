using System.Collections.Generic;

namespace XenaUI.Models
{
    #region OrderDataEntryModel Model
    /// <summary>
    /// OrderDataEntryCustomerModel
    /// </summary>
    public class OrderDataEntryCustomerModel
    {
        /// <summary>
        /// CustomerData
        /// </summary>
        public PersonModel CustomerData { get; set; }

        /// <summary>
        /// CommunicationData
        /// </summary>
        public object CommunicationData { get; set; }

        /// <summary>
        /// OrderSettingMessage
        /// </summary>
        public string OrderSettingMessage { get; set; }
    }

    /// <summary>
    /// OrderDataEntryOrderDataModel
    /// </summary>
    public class OrderDataEntryOrderData
    {
        public int? IdSalesOrder { get; set; }

        public int? IdSalesCampaignWizard { get; set; }

        public string IdSalesCampaignWizardItems { get; set; }

        public int? IdRepSalesOrderType { get; set; }

        public int? IdRepSalesOrderProvenanceType { get; set; }

        public string MEDIACODE { get; set; }

        public string OrderDate { get; set; }
        public string PackageNr { get; set; }
        public int? IdRepSalesOrderShipper { get; set; }

        public string Notes { get; set; }

        public bool? IsActive { get; set; }

        public int? IsDeleted { get; set; }

        public decimal? Amount { get; set; }

        public decimal? GrossAmount { get; set; }

        public decimal? PostageCost { get; set; }

        public bool? IsFreeShipping { get; set; }

        public bool? IsGift { get; set; }

        public int? GiftType { get; set; }

        public int? IdRepCurrencyCode { get; set; }
        public int? IdScansContainerItems { get; set; }
    }

    /// <summary>
    /// OrderDataEntryOrderArticlesModel
    /// </summary>
    public class OrderDataEntryOrderArticles
    {
        public int? IdSalesOrderArticles { get; set; }

        public int? IdSalesOrder { get; set; }

        public int? IdArticle { get; set; }

        public string ArticleNr { get; set; }

        public int? Quantity { get; set; }

        public int? IsDeleted { get; set; }

        public decimal? SellingPrice { get; set; }

        public decimal? SalesAmount { get; set; }

        public bool? IsAllArticle { get; set; }
    }

    /// <summary>
    /// OrderDataEntryOrderPaymentsModel
    /// </summary>
    public class OrderDataEntryOrderPayments
    {
        public int? IdSalesOrderInvoicePayments { get; set; }

        public int? IdRepPaymentsMethods { get; set; }

        public int? IdSharingPaymentGateway { get; set; }

        public int? IdRepCurrencyCode { get; set; }

        public int? IdSharingCreditCard { get; set; }

        public int? IdRepCreditCardType { get; set; }

        public int? IdSharingPaymentCheque { get; set; }

        public string CreditCardHolderName { get; set; }

        public string CreditCardNr { get; set; }

        public int? CreditCardValidMonth { get; set; }

        public int? CreditCardValidYear { get; set; }

        public string CreditCardDate { get; set; }
        public string CreditCardCVV { get; set; }

        public string ChequeCodeline { get; set; }

        public string ChequeNr { get; set; }

        public string ChequeType { get; set; }

        public string ChequeCreditedDate { get; set; }

        public string ChequeRejectDate { get; set; }

        public decimal? PaidAmount { get; set; }

        public decimal? Amount { get; set; }

        public decimal? ConversionValue { get; set; }

        public decimal? ConversionPaidAmount { get; set; }

        public int? SystemCurrency { get; set; }

        public string IdCashProviderPaymentTerms { get; set; }
        public string PaymentDate { get; set; }

        public decimal? SystemConversionValue { get; set; }
    }

    /// <summary>
    /// OrderDataEntryCustomerForSaveModel
    /// </summary>
    public class OrderDataEntryCustomerForSaveModel
    {
        public string IdSalesOrder { get; set; }
        public int? IdPerson { get; set; }
        public string CustomerNr { get; set; }
        public int? PaymentConfirm { get; set; }
        public string IsLostAmount { get; set; }

        public IList<PersonEditModel> CustomerData { get; set; }

        public IList<Communication> Communications { get; set; }

        public IList<OrderDataEntryOrderData> Orders { get; set; }

        public IList<OrderDataEntryOrderArticles> OrderArticles { get; set; }

        public IList<OrderDataEntryOrderPayments> OrderPayments { get; set; }
    }

    /// <summary>
    /// SendOrderToAdministratorModel
    /// </summary>
    public class SendOrderToAdministratorModel
    {
        public int IdLoginToAdmin { get; set; }
        public int IdScansContainerItems { get; set; }
        public int IdRepSendToAdminReason { get; set; }
        public string Notes { get; set; }
    }
    #endregion

    #region Scanning Models
    /// <summary>
    /// LotModel
    /// </summary>
    public class LotModel
    {
        /// <summary>
        /// IdPerson
        /// </summary>
        public int? IdPerson { get; set; }

        /// <summary>
        /// QuantityEstimated
        /// </summary>
        public int? QuantityEstimated { get; set; }

        /// <summary>
        /// QuantityProcessed
        /// </summary>
        public int? QuantityProcessed { get; set; }

        /// <summary>
        /// LotName
        /// </summary>
        public string LotName { get; set; }

        /// <summary>
        /// SourceContainerGUID
        /// </summary>
        public string SourceContainerGUID { get; set; }

        /// <summary>
        /// ClientOpenDateUTC
        /// </summary>
        public string ClientOpenDateUTC { get; set; }

        /// <summary>
        /// ClientCloseDateUTC
        /// </summary>
        public string ClientCloseDateUTC { get; set; }

        /// <summary>
        /// AbortDateUTC
        /// </summary>
        public string AbortDateUTC { get; set; }

        /// <summary>
        /// ContainerColor
        /// </summary>
        public string ContainerColor { get; set; }

        /// <summary>
        /// LotReportFilename
        /// </summary>
        public string LotReportFilename { get; set; }

        /// <summary>
        /// DoneDate
        /// </summary>
        public string DoneDate { get; set; }

        /// <summary>
        /// Notes
        /// </summary>
        public string Notes { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public bool? IsActive { get; set; }
    }

    /// <summary>
    /// ScanningLotItemModel
    /// </summary>
    public class ScanningLotItemModel
    {
        /// <summary>
        /// IdScansContainer
        /// </summary>
        public int? IdScansContainer { get; set; }

        /// <summary>
        /// IdRepScansContainerType
        /// </summary>
        public int? IdRepScansContainerType { get; set; }

        /// <summary>
        /// IdCountrylanguage
        /// </summary>
        public int? IdCountrylanguage { get; set; }

        /// <summary>
        /// IdRepPaymentsMethods
        /// </summary>
        public int? IdRepPaymentsMethods { get; set; }

        /// <summary>
        /// ScannerTwainDllVersion
        /// </summary>
        public string ScannerTwainDllVersion { get; set; }

        /// <summary>
        /// ScannerDevice
        /// </summary>
        public string ScannerDevice { get; set; }

        /// <summary>
        /// CustomerNr
        /// </summary>
        public string CustomerNr { get; set; }

        /// <summary>
        /// MediaCode
        /// </summary>
        public string MediaCode { get; set; }

        /// <summary>
        /// ScannedPath
        /// </summary>
        public string ScannedPath { get; set; }

        /// <summary>
        /// ScannedFilename
        /// </summary>
        public string ScannedFilename { get; set; }

        /// <summary>
        /// ScannedDateUTC
        /// </summary>
        public string ScannedDateUTC { get; set; }

        /// <summary>
        /// ReceivingDate
        /// </summary>
        public string ReceivingDate { get; set; }

        /// <summary>
        /// CoordinateX
        /// </summary>
        public string CoordinateX { get; set; }

        /// <summary>
        /// CoordinateY
        /// </summary>
        public string CoordinateY { get; set; }

        /// <summary>
        /// CoordinatePageNr
        /// </summary>
        public int? CoordinatePageNr { get; set; }

        /// <summary>
        /// NumberOfImages
        /// </summary>
        public int? NumberOfImages { get; set; }

        /// <summary>
        /// NumberOfImagesCheques
        /// </summary>
        public int? NumberOfImagesCheques { get; set; }

        /// <summary>
        /// SourceScanGUID
        /// </summary>
        public string SourceScanGUID { get; set; }

        /// <summary>
        /// ProcessGUID
        /// </summary>
        public string ProcessGUID { get; set; }

        /// <summary>
        /// Notes
        /// </summary>
        public string Notes { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public bool? IsActive { get; set; }

        /// <summary>
        /// IsWhiteMail
        /// </summary>
        public bool? IsWhiteMail { get; set; }

        /// <summary>
        /// IsCheque
        /// </summary>
        public bool? IsCheque { get; set; }

        /// <summary>
        /// IsDeletedByAdmin
        /// </summary>
        public bool? IsDeletedByAdmin { get; set; }

        /// <summary>
        /// IsCustomerNrEnteredManually
        /// </summary>
        public bool? IsCustomerNrEnteredManually { get; set; }

        /// <summary>
        /// IsMediaCodeEnteredManually
        /// </summary>
        public bool? IsMediaCodeEnteredManually { get; set; }
    }
    #endregion

}
