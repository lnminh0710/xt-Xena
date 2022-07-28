using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Service;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using Newtonsoft.Json;
using XenaUI.Utils;
using Newtonsoft.Json.Serialization;
using System.Net;
using log4net;
using System.Reflection;
using System.Diagnostics;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class WidgetController : BaseController
    {
        private readonly IGlobalBusiness _iGlobalBusiness;
        private readonly ILog _logTime;
        private readonly AppSettings _appSettings;
        private readonly IPathProvider _pathProvider;

        public WidgetController(IGlobalBusiness iGlobalBusiness, IOptions<AppSettings> appSettings, IPathProvider pathProvider)
        {
            _iGlobalBusiness = iGlobalBusiness;
            _appSettings = appSettings.Value;
            _pathProvider = pathProvider;

            if (_appSettings.ShowDBQuery)
            {
                var assembly = Assembly.GetEntryAssembly();
                if (log4net.LogManager.GetRepository(assembly).Configured)
                {
                    _logTime = LogManager.GetLogger(assembly, "LogTime");
                }
            }
        }

        // GET: api/widget/GetAllWidgetTemplateByModuleId
        [HttpGet]
        [Route("GetAllWidgetTemplateByModuleId")]
        public async Task<object> GetAllWidgetTemplateByModuleId(string moduleId, string objectValue, bool? isWriteLog = false)
        {
            var result = _iGlobalBusiness.GetAllWidgetTemplateByModuleId(moduleId.ToString(), objectValue);
            return await Task.FromResult(result);
        }

        // GET: api/widget/GetWidgetDetailByRequestString
        /// <summary>
        /// GetGlobalSettingById
        /// </summary>
        /// <param name="request">IdSettingsGlobal</param>
        /// <param name="idRepWidgetType">IdSettingsGlobal</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetWidgetDetailByRequestString")]
        public async Task<object> GetWidgetDetailByRequestString([FromHeader]string request, int idRepWidgetType, string widgetGuid, string moduleName, string filterParam, string idLanguage, string widgetTitle, int? idRepWidgetApp, int? setOrderBy)
        {
            request = WebUtility.UrlDecode(request);
            filterParam = WebUtility.UrlDecode(filterParam);
            var result = _iGlobalBusiness.GetWidgetTemplateDetailByRequestString(request, idRepWidgetType, widgetGuid, moduleName, filterParam, idLanguage, widgetTitle, idRepWidgetApp, setOrderBy);

            return await result;
        }

        // Post: api/widget/UpdateWidgetInfo
        [HttpPost]
        [Route("UpdateWidgetInfo")]
        public async Task<object> UpdateWidgetInfo([FromBody] DataUpdateModel dataUpdate)
        {
            var result = _iGlobalBusiness.UpdateWidgetInfo(dataUpdate);

            return await result;
        }

        // GET: api/widget/GetWidgetSetting
        [HttpGet]
        [Route("GetWidgetSetting")]
        public async Task<object> GetWidgetSetting(string sqlFieldName, string sqlFieldValue)
        {
            WidgetSettingModel model = new WidgetSettingModel()
            {
                SqlFieldName = sqlFieldName,
                SqlFieldValue = sqlFieldValue
            };
            var result = _iGlobalBusiness.LoadWidgetSetting(model);

            return await result;
        }

        // Post: api/widget/CreateWidgetSetting
        [HttpPost]
        [Route("CreateWidgetSetting")]
        public async Task<object> CreateWidgetSetting([FromBody]WidgetSettingModel model)
        {
            var result = _iGlobalBusiness.CreateWidgetSetting(model);

            return await result;
        }

        // Post: api/widget/UpdateWidgetSetting
        [HttpPost]
        [Route("UpdateWidgetSetting")]
        public async Task<object> UpdateWidgetSetting([FromBody]WidgetSettingModel model)
        {
            var result = _iGlobalBusiness.UpdateWidgetSetting(model);

            return await result;
        }

        // Post: api/widget/DeleteWidgetSetting
        [HttpPost]
        [Route("DeleteWidgetSetting")]
        public async Task<object> DeleteWidgetSetting([FromBody]WidgetSettingModel model)
        {
            var result = _iGlobalBusiness.DeleteWidgetSetting(model);

            return await result;
        }

        // GET: api/widget/GetWidgetOrderBy
        [HttpGet]
        [Route("GetWidgetOrderBy")]
        public async Task<object> GetWidgetOrderBy(string widgetApp, string widgetGuid)
        {
            var result = _iGlobalBusiness.LoadWidgetOrderBy(widgetApp, widgetGuid);

            return await result;
        }

        // Post: api/widget/SaveWidgetOrderBy
        [HttpPost]
        [Route("SaveWidgetOrderBy")]
        public async Task<object> SaveWidgetOrderBy([FromBody]WidgetOrderByModel model)
        {
            var result = _iGlobalBusiness.SaveWidgetOrderBy(model);

            return await result;
        }
    }
}
