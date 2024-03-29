namespace XenaUI.Utils
{
    public class PrintingGetCampaignData : Data
    {
        /// <summary>
        /// IdSalesCampaignWizard
        /// </summary>
        public string IdSalesCampaignWizard { get; set; }

        /// <summary>
        /// IdCountrylanguage
        /// </summary>
        public string IdCountrylanguage { get; set; }

        /// <summary>
        /// WidgetTitle
        /// </summary>
        public string WidgetTitle { get; set; }

        public string IdRepGPMToolsType { get; set; }
        
    }

    public class PrintingCampaignConfirmData : Data
    {
        /// <summary>
        /// IdSalesCampaignWizard
        /// </summary>
        public string IdSalesCampaignWizard { get; set; }

        /// <summary>
        /// IdCountrylanguage
        /// </summary>
        public string IdCountrylanguage { get; set; }

        /// <summary>
        /// WidgetTitle
        /// </summary>
        public string WidgetTitle { get; set; }

        /// <summary>
        /// IdGPMToolsTypeExport
        /// </summary>
        public string IdGPMToolsTypeExport { get; set; }

        /// <summary>
        /// QtyRecivedFromClient
        /// </summary>
        public string QtyRecivedFromClient { get; set; }

        /// <summary>
        /// DateRecivedFromClient
        /// </summary>
        public string DateRecivedFromClient { get; set; }
    }

    public class RequestTemplateData : Data
    {
        public string IdSalesCampaignWizardItems { get; set; }
        public string ExternalParam { get; set; }
    }
}
