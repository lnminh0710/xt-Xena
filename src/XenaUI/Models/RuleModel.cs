using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// RuleModel
    /// </summary>
    public class RuleModel
    {
        /// <summary>
        /// Id
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public int? IdSelectionWidget { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }

        /// <summary>
        /// JsonRules
        /// </summary>
        public IList<RuleDetailModel> JsonRules { get; set; }
    }

    /// <summary>
    /// RuleDetailModel
    /// </summary>
    public class RuleDetailModel
    {
        /// <summary>
        /// IdSelectionProjectCountry
        /// </summary>
        public int? IdSelectionProjectCountry { get; set; }

        /// <summary>
        /// Rules
        /// </summary>
        public object Rules { get; set; }
    }

    /// <summary>
    /// BlackListProfileModel
    /// </summary>
    public class BlackListProfileModel
    {
        /// <summary>
        /// IdSelectionWidgetTemplate
        /// </summary>
        public int? IdSelectionWidgetTemplate { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? IsActive { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public int? IsDeleted { get; set; }

        /// <summary>
        /// Description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public int? IdSelectionWidget { get; set; }

        /// <summary>
        /// TemplateData
        /// </summary>
        public string TemplateData { get; set; }
    }
}
