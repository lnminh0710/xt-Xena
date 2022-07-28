using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// IRuleService
    /// </summary>
    public interface IRuleService
    {
        /// <summary>
        /// GetProjectRules
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> GetProjectRules(RuleData ruleData);

        /// <summary>
        /// GetProjectRulesForTemplate
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> GetProjectRulesForTemplate(RuleData ruleData);

        /// <summary>
        /// GetProjectRulesForTemplate
        /// </summary>
        /// <param name="ruleData"></param>
        /// <param name="queryObject"></param>
        /// <returns></returns>
        Task<object> GetComboBoxForRuleBuilder(RuleData ruleData, string queryObject);

        /// <summary>
        /// GetOrdersGroups
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> GetOrdersGroups(RuleData ruleData);

        /// <summary>
        /// GetBlackListRules
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> GetBlackListRules(RuleData ruleData);

        /// <summary>
        /// GetTemplate
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> GetTemplate(RuleData ruleData);

        /// <summary>
        /// SaveProjectRules
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectRules(RuleCreateData ruleData);

        /// <summary>
        /// SaveBlackListProfile
        /// </summary>
        /// <param name="ruleCreateData"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBlackListProfile(RuleCreateData ruleCreateData);

        /// <summary>
        /// DeleteDataToUsed
        /// </summary>
        /// <param name="ruleData"></param>
        /// <returns></returns>
        Task<object> DeleteDataToUsed(RuleData ruleData);
    }
}
