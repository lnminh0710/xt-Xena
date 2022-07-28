using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class RuleData : Data
    {
        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public string IdSelectionWidget { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }

        /// <summary>
        /// IdSelectionProjectCountry
        /// </summary>
        public string IdSelectionProjectCountry { get; set; }
    }
    public class RuleCreateData : CreateData
    {
        /// <summary>
        /// IdSelectionWidget
        /// </summary>
        public string IdSelectionWidget { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }
    }

    public enum QueryObject
    {
        OrdersRules = 1,
        ExtendRules = 2
    }

    // Will change when change id from database
    public enum SelectionWidgetType
    {
        Blacklist = 1,
        Orders = 2,
        OrdersGroup = 3,
        ExtendedRules = 4
    }
}
