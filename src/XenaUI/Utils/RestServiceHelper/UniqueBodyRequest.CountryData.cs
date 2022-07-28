using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class CountryData : Data
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }

        /// <summary>
        /// IdKeyValue
        /// </summary>
        public string IdKeyValue { get; set; }

        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public string IdSelectionWidget { get; set; }

        /// <summary>
        /// IdRepCountryLangaugeGroupsName
        /// </summary>
        public string IdRepCountryLangaugeGroupsName { get; set; }
    }


    public class CountryCreateData : CreateData
    {
        /// <summary>
        /// B02Project_IdSelectionProjectCountry
        /// </summary>
        public string GroupsName { get; set; }

        /// <summary>
        /// B02Project_IdSelectionProjectCountry
        /// </summary>
        public string IdRepCountryLangaugeGroupsName { get; set; }

        /// <summary>
        /// B02Project_IdSelectionProjectCountry
        /// </summary>
        public string IsDeleted { get; set; }
    }
}
