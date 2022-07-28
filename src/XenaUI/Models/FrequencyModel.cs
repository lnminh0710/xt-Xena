using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// FrequencyModel
    /// </summary>
    public class FrequencyModel
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }

        /// <summary>
        /// IdSelectionProjectRules
        /// </summary>
        public int? IdSelectionProjectRules { get; set; }

        /// <summary>
        /// IdSharingTreeGroups
        /// </summary>
        public int? IdSharingTreeGroups { get; set; }

        /// <summary>
        /// IdSelectionProjectCountry
        /// </summary>
        public int? IdSelectionProjectCountry { get; set; }

        /// <summary>
        /// HeaderName
        /// </summary>
        public string HeaderName { get; set; }

        /// <summary>
        /// Qty
        /// </summary>
        public int? Qty { get; set; }

        /// <summary>
        /// ExportQty
        /// </summary>
        public int? ExportQty { get; set; }

        /// <summary>
        /// ExportPriority
        /// </summary>
        public int? ExportPriority { get; set; }
    }

    /// <summary>
    /// FrequencyModel
    /// </summary>
    public class FrequencySaveModel
    {
        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }

        /// <summary>
        /// Frequencies
        /// </summary>
        public IList<FrequencyModel> Frequencies { get; set; }
    }
}
