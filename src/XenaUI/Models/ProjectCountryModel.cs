using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// ProjectCountryModel
    /// </summary>
    public class CountryGroupModel
    {
        /// <summary>
        /// IdRepCountryLangaugeGroupsName
        /// </summary>
        public int? IdRepCountryLangaugeGroupsName { get; set; }

        /// <summary>
        /// GroupsName
        /// </summary>
        public string GroupsName { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public int? IsDeleted { get; set; }

        /// <summary>
        /// ProjectCoutry
        /// </summary>
        public IList<ProjectCountryModel> ProjectCoutry { get; set; }
    }

    /// <summary>
    /// ProjectCountryModel
    /// </summary>
    public class ProjectCountryModel
    {
        /// <summary>
        /// IdSelectionProjectCountry
        /// </summary>
        public int? IdSelectionProjectCountry { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }

        /// <summary>
        /// IdRepCountryLangauge
        /// </summary>
        public string IdRepCountryLangauge { get; set; }

        /// <summary>
        /// IdRepCountryLangaugeGroups
        /// </summary>
        public string IdRepCountryLangaugeGroups { get; set; }

        /// <summary>
        /// QtyToNeeded
        /// </summary>
        public string QtyToNeeded { get; set; }

        /// <summary>
        /// IdSalesCampaignWizard
        /// </summary>
        public int? IdSalesCampaignWizard { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? IsActive { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public int? IsDeleted { get; set; }
    }
}
