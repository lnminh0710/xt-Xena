using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;
using System;
using Newtonsoft.Json;

namespace XenaUI.Business
{
    /// <summary>
    /// UniqueBusiness
    /// </summary>
    public class RuleBusiness : BaseBusiness, IRuleBusiness
    {
        private readonly IRuleService _ruleService;
        public RuleBusiness(IHttpContextAccessor context, IRuleService RuleService) : base(context)
        {
            _ruleService = RuleService;
        }

        public async Task<object> GetProjectRules(int idSelectionWidget, int idSelectionProject, int idSelectionProjectCountry)
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            data.IdSelectionWidget = idSelectionWidget.ToString();
            data.IdSelectionProject = idSelectionProject.ToString();
            data.IdSelectionProjectCountry = idSelectionProjectCountry.ToString();
            var result = await _ruleService.GetProjectRules(data);
            return result;
        }

        public async Task<object> GetProjectRulesForTemplate(int idSelectionWidget, int idSelectionProject)
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            data.IdSelectionWidget = idSelectionWidget.ToString();
            data.IdSelectionProject = idSelectionProject.ToString();
            var result = await _ruleService.GetProjectRulesForTemplate(data);
            return result;
        }

        public async Task<object> GetComboBoxForRuleBuilder(int queryObject)
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            var queryObjectName = ((queryObject == 1) ? QueryObject.OrdersRules : QueryObject.ExtendRules).ToString();
            var result = await _ruleService.GetComboBoxForRuleBuilder(data, queryObjectName);
            return result;
        }

        public async Task<object> GetOrdersGroups()
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            var result = await _ruleService.GetOrdersGroups(data);
            return result;
        }

        public async Task<object> GetBlackListRules()
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            var result = await _ruleService.GetBlackListRules(data);
            return result;
        }

        public async Task<object> GetTemplate(int? idSelectionWidget)
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            data.IdSelectionWidget = idSelectionWidget.ToString();
            var result = await _ruleService.GetTemplate(data);
            return result;
        }

        public async Task<WSEditReturn> SaveProjectRules(RuleModel ruleModel)
        {
            RuleCreateData data = (RuleCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleCreateData));
            data.IdSelectionWidget = ruleModel.IdSelectionWidget.ToString();
            data.IdSelectionProject = ruleModel.IdSelectionProject.ToString();
            Common.CreateSaveDataWithArray(data, ruleModel.JsonRules, "ProjectRules");
            var result = await _ruleService.SaveProjectRules(data);
            return result;
        }

        public async Task<WSEditReturn> SaveBlackListProfile(IList<BlackListProfileModel> blackListProfileModel)
        {
            RuleCreateData data = (RuleCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleCreateData));
            Common.CreateSaveDataWithArray(data, blackListProfileModel, "ProjectWidgetTemplate");
            var result = await _ruleService.SaveBlackListProfile(data);
            return result;
        }

        /// <summary>
        /// DeleteDataToUsed
        /// </summary>
        /// <returns></returns>
        public async Task<object> DeleteDataToUsed()
        {
            RuleData data = (RuleData)ServiceDataRequest.ConvertToRelatedType(typeof(RuleData));
            var result = await _ruleService.DeleteDataToUsed(data);
            return result;
        }
    }
}
