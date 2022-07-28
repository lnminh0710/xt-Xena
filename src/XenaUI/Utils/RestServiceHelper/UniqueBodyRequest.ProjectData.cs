using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class ProjectData : Data
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }
    }


    public class ProjectCreateData : CreateData
    {
    }

    public class ProjectSaveMediaCodePricingData : CreateData
    {
        public int IdSelectionProject { get; set; }
    }

    public class ProjectExcludeData : CreateData
    {
        public string IdSelectionProject { get; set; }
    }

    public class MediacodePricingCountryProjectData : ProjectData
    {
        /// <summary>
        /// IdSelectionProjectCountry
        /// </summary>
        public string IdSelectionProjectCountry { get; set; }
    }

    public class InsertMediaCodeToCampaign : ProjectData
    {
        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public string IdSelectionWidget { get; set; }
    }

    public enum ProjectType
    {
        Campaign = 1,
        Broker = 2
    }
}
