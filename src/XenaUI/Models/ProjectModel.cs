using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// ProjectModel
    /// </summary>
    public class ProjectModel
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }
        /// <summary>
        /// ProjectName
        /// </summary>
        public string ProjectName { get; set; }

        /// <summary>
        /// IdSalesCampaignWizard
        /// </summary>
        public int? IdSalesCampaignWizard { get; set; }

        /// <summary>
        /// IdSalesCampaignWizard
        /// </summary>
        public int? IdRepSelectionProjectType { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public bool? IsActive { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public bool? IsDeleted { get; set; }
    }

    public class ProjectMediaCodePricingItem
    {
        /// <summary>
        /// MediaCode
        /// </summary>
        public string MediaCode { get; set; }

        /// <summary>
        /// MediaCodeLabel
        /// </summary>
        public string MediaCodeLabel { get; set; }

        /// <summary>
        /// MediaCodePrice
        /// </summary>
        public string MediaCodePrice { get; set; }
    }

    public class ProjectSaveMediaCodePricingModel
    {
        public int IdSelectionProject { get; set; }
        public IList<ProjectMediaCodePricingItem> MediaCodePricing { get; set; }
    }

    public class ProjectExclude
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }

        /// <summary>
        /// ProjectExcludeData
        /// </summary>
        public IList<ProjectExcludeDataModel> ProjectExcludeData { get; set; }
    }

    public class ProjectExcludeDataModel
    {
        /// <summary>
        /// IdSelectionProjectExclude
        /// </summary>
        public string IdSelectionProjectExclude { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }

        /// <summary>
        /// ExcludeIdSelectionProject
        /// </summary>
        public string ExcludeIdSelectionProject { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public string IsActive { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }

        /// <summary>
        /// JsonCountiesExclude
        /// </summary>
        public string JsonCountiesExclude { get; set; }
    }
}
