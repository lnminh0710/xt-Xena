using System.Collections.Generic;

namespace XenaUI.Models
{
    public class ShipmentOrderModel
    {
        public string OrderNr { get; set; }
    
        public string RefDecommand { get; set; }

        public string TagUtili { get; set; }

        public double? PoidsKg { get; set; }

        public string EnCasDeNonLivrasion { get; set; }

        public string DimDuColis { get; set; }

        public string TotalAmount { get; set; }
    }

    public class ShipmentArticleModel
    {
        public string Description { get; set; }
        public int? Quantity { get; set; }
        public double? Weight { get; set; }
        public double? Value { get; set; }
        public double? HsCode { get; set; }
        public string OriginCountry { get; set; }
        public string MontantTVA { get; set; }
        public double? CustomerFees { get; set; }
        public string Artref { get; set; }
        public string DroitDeDouane { get; set; }
        public string OriginalIdent { get; set; }
        
    }

    public class ShipmentSenderModel
    {
        public string CompanyName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Service { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string CountryCode { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string Email { get; set; }

        public int HasCustomerDeclaration { get; set; }
        public int HasSignature { get; set; }
    }

    public class ShipmentReceiverModel
    {
        public string CompanyName { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Line0 { get; set; }
        public string Line1 { get; set; }
        public string CountryCode { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string Email { get; set; }
    }

    public class ShipmentColissimoModel
    {
        public string contractNumber { get; set; }
        public string password { get; set; }
        public ColissimoOuputFormatModel outputFormat { get; set; }
        public ColissimoLetterModel letter { get; set; }
    }

    public class ColissimoOuputFormatModel
    {
        public int x { get; set; }
        public int y { get; set; }
        public string outputPrintingType { get; set; }
    }

    public class ColissimoLetterModel
    {
        public ColissimoServiceModel service { get; set; }
        public ColissimoParcelModel parcel { get; set; }
        public ColissimoCustomsDeclarationsModel customsDeclarations { get; set; }
        public ColissimoSenderModel sender { get; set; }
        public ColissimoReceiverModel addressee { get; set; }
    }

    public class ColissimoServiceModel
    {
        public string productCode { get; set; }
        public string depositDate { get; set; }
        public string orderNumber { get; set; }
        public string commercialName { get; set; }
        public double? totalAmount { get; set; }
        public int returnTypeChoice { get; set; }

    }

    public class ColissimoParcelModel
    {
        public double? weight { get; set; }
    }

    public class ColissimoCustomsDeclarationsModel
    {
        public int includeCustomsDeclarations { get; set; }
        public ColissimoContentsModel contents { get; set; }
    }

    public class ColissimoContentsModel
    {
        public List<ColissimoArticleModel> article { get; set; }
        public ColissimoCategoryModel category { get; set; }
    }

    public class ColissimoArticleModel
    {
        public string description { get; set; }
        public int? quantity { get; set; }
        public double? weight { get; set; }
        public double? value { get; set; }
        public double? hsCode { get; set; }
        public string originCountry { get; set; }
        public string currency { get; set; }
        public double? vatAmount { get; set; }
        public double? customsFees { get; set; }
        public string artref { get; set; }
        public string originalIdent { get; set; }
    }

    public class ColissimoCategoryModel
    {
        public int value { get; set; }
    }

    public class ColissimoSenderModel
    {
        public string senderParcelRef { get; set; }
        public ColissimoAddressModel address { get; set; }
    }

    public class ColissimoReceiverModel
    {
        public string addresseeParcelRef { get; set; }
        public bool codeBarForReference { get; set; }
        public ColissimoAddressModel address { get; set; }
    }

    public class ColissimoAddressModel
    {
        public string companyName { get; set; }
        public string lastName { get; set; }
        public string firstName { get; set; }
        public string line0 { get; set; }
        public string line1 { get; set; }
        public string line2 { get; set; }
        public string countryCode { get; set; }
        public string originCountry { get; set; }
        public string city { get; set; }
        public string zipCode { get; set; }
        public string email { get; set; }
    }

    public class ColissimoMessageResponseModel
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string MessageContent { get; set; }
    }

    public class ColissimoResponseModel
    {
        public ColissimoMessageResponseModel Message { get; set; }
        public List<ColissimoMessageResponseModel> Messages { get; set; }       
        public string LabelXmlV2Reponse { get; set; }
        public ColissimoLabelV2ResponseModel LabelV2Response { get; set; }
        public List<string> PDFFiles { get; set; }
    }

    public class ColissimoLabelV2ResponseModel
    {
        public string ParcelNumber { get; set; }
        public string ParcelNumberPartner { get; set; }
        public string PdfUrl { get; set; }
        public object Fields { get; set; }
    }

    public class SaleOrderFilesModel
    {
        public string FileName { get; set; }
        public string MediaPath { get; set; }
    }
}
