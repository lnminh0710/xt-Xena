using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Utils;
using XenaUI.Models;

namespace XenaUI.Business
{
    public interface IRuleBusiness
    {
        /// <summary>
        /// GetProjectRules
        /// </summary>
        /// <param name="idSelectionWidget"></param>
        /// <param name="idSelectionProject"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        Task<object> GetProjectRules(int idSelectionWidget, int idSelectionProject, int idSelectionProjectCountry);

        /// <summary>
        /// GetProjectRulesForTemplate
        /// </summary>
        /// <param name="idSelectionWidget"></param>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetProjectRulesForTemplate(int idSelectionWidget, int idSelectionProject);

        /// <summary>
        /// GetComboBoxForRuleBuilder
        /// </summary>
        /// <param name="queryObject"></param>
        /// <returns></returns>
        Task<object> GetComboBoxForRuleBuilder(int queryObject);

        /// <summary>
        /// GetOrdersGroups
        /// </summary>
        /// <returns></returns>
        Task<object> GetOrdersGroups();

        /// <summary>
        /// GetBlackListRules
        /// </summary>
        /// <returns></returns>
        Task<object> GetBlackListRules();

        /// <summary>
        /// GetTemplate
        /// </summary>
        /// <param name="idSelectionWidget"></param>
        /// <returns></returns>
        Task<object> GetTemplate(int? idSelectionWidget);

        /// <summary>
        /// SaveProjectRules
        /// </summary>
        /// <param name="ruleModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectRules(RuleModel ruleModel);

        /// <summary>
        /// SaveBlackListProfile
        /// </summary>
        /// <param name="blackListProfileModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBlackListProfile(IList<BlackListProfileModel> blackListProfileModel);

        /// <summary>
        /// DeleteDataToUsed
        /// </summary>
        /// <returns></returns>
        Task<object> DeleteDataToUsed();
        
    }
}
