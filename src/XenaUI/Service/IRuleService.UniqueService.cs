using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using XenaUI.Utils;
using System;

namespace XenaUI.Service
{
    /// <summary>
    /// RuleService
    /// </summary>
    public class RuleService : BaseUniqueServiceRequest, IRuleService
    {
        public RuleService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public Task<object> GetProjectRules(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallSelectionProjectGetData", "GetProjectRules");
        }
        public Task<object> GetProjectRulesForTemplate(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallSelectionProjectGetData", "GetProjectRulesForTemplate");
        }
        public Task<object> GetComboBoxForRuleBuilder(RuleData ruleData, string queryObject)
        {
            return GetData(ruleData, "SpCallWidgetGetData", queryObject);
        }

        public Task<object> GetOrdersGroups(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallSelectionProjectGetData", "GetOrdersGroups");
        }

        public Task<object> GetBlackListRules(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallSelectionProjectGetData", "GetBlackListRules");
        }

        public Task<object> GetTemplate(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallWidgetGetData", "GetTemplate");
        }

        public Task<WSEditReturn> SaveProjectRules(RuleCreateData ruleData)
        {
            string objectName = string.Empty;
            switch(int.Parse(ruleData.IdSelectionWidget))
            {
                case (int)SelectionWidgetType.Blacklist:
                case (int)SelectionWidgetType.OrdersGroup:
                    {
                        objectName = "ProjectRulesLists";
                        break;
                    }
                case (int)SelectionWidgetType.Orders:
                case (int)SelectionWidgetType.ExtendedRules:
                    {
                        objectName = "ProjectRules";
                        break;
                    }
            }
            return SaveData(ruleData, "SpCallSelectionProject", objectName);
        }

        public Task<WSEditReturn> SaveBlackListProfile(RuleCreateData ruleCreateData)
        {
            return SaveData(ruleCreateData, "SpCallSelectionProject", "ProjectWidgetTemplate");
        }

        /// <summary>
        /// DeleteDataToUsed
        /// </summary>
        /// <returns></returns>
        public Task<object> DeleteDataToUsed(RuleData ruleData)
        {
            return GetData(ruleData, "SpCallSelectionProject", "DeleteDataToUsed");
        }
    }
}
