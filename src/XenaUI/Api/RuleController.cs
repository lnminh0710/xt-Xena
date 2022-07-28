using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class RuleController : BaseController
    {
        private readonly IRuleBusiness _ruleBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;
        
        public RuleController(IRuleBusiness ruleBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _ruleBusiness = ruleBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetProjectRules
        /// </summary>
        /// <param name="idSelectionWidget"></param>
        /// <param name="idSelectionProject"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetProjectRules")]
        public async Task<object> GetProjectRules(int idSelectionWidget, int idSelectionProject, int idSelectionProjectCountry)
        {
            return await _ruleBusiness.GetProjectRules(idSelectionWidget, idSelectionProject, idSelectionProjectCountry);
        }

        /// <summary>
        /// GetProjectRulesForTemplate
        /// </summary>
        /// <param name="idSelectionWidget"></param>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetProjectRulesForTemplate")]
        public async Task<object> GetProjectRulesForTemplate(int idSelectionWidget, int idSelectionProject)
        {
            return await _ruleBusiness.GetProjectRulesForTemplate(idSelectionWidget, idSelectionProject);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="queryObject">
        ///     1. OrdersRules
        ///     2. ExtendRules
        /// </param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetComboBoxForRuleBuilder")]
        public async Task<object> GetComboBoxForRuleBuilder(int queryObject)
        {
            return await _ruleBusiness.GetComboBoxForRuleBuilder(queryObject);
        }

        /// <summary>
        /// GetOrdersGroups
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetOrdersGroups")]
        public async Task<object> GetOrdersGroups()
        {
            return await _ruleBusiness.GetOrdersGroups();
        }

        /// <summary>
        /// GetBlackListRules
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetBlackListRules")]
        public async Task<object> GetBlackListRules()
        {
            return await _ruleBusiness.GetBlackListRules();
        }

        /// <summary>
        /// Get List of Profile
        /// </summary>
        /// <param name="idSelectionWidget">
        ///     Black list = 1
        ///     Orders = 2
        ///     OrdersGroup = 3
        ///     ExtendedRules = 4
        /// </param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetTemplate")]
        public async Task<object> GetTemplate(int? idSelectionWidget)
        {
            return await _ruleBusiness.GetTemplate(idSelectionWidget);
        }

        /// <summary>
        /// SaveProjectRules
        /// </summary>
        /// <param name="ruleModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveProjectRules")]
        public async Task<WSEditReturn> SaveProjectRules([FromBody]RuleModel ruleModel)
        {
            return await _ruleBusiness.SaveProjectRules(ruleModel);
        }

        /// <summary>
        /// SaveBlackListProfile
        /// </summary>
        /// <param name="blackListProfileModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveBlackListProfile")]
        public async Task<WSEditReturn> SaveBlackListProfile([FromBody]IList<BlackListProfileModel> blackListProfileModel)
        {
            return await _ruleBusiness.SaveBlackListProfile(blackListProfileModel);
        }

        [HttpPost]
        [Route("DeleteDataToUsed")]
        public async Task<object> DeleteDataToUsed()
        {
            return await _ruleBusiness.DeleteDataToUsed();
        }
    }
}
