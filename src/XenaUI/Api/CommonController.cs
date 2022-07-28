using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using RestSharp;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class CommonController : BaseController
    {
        private readonly IUniqueBusiness _uniqueBusiness;
        private readonly ICommonBusiness _commonBusiness;
        private readonly IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;
        private readonly ServerConfig _serverConfig;
        private readonly SentrySettings _sentrySettings;
        private readonly IEmailBusiness _emailBusiness;
        private IPathProvider _pathProvider;

        public CommonController(IUniqueBusiness uniqueBusiness, ICommonBusiness commonBusiness,
            IHostingEnvironment environment, IOptions<AppSettings> appSettings, IAppServerSetting appServerSetting, IOptions<SentrySettings> sentrySettings,
            IEmailBusiness emailBusiness, IPathProvider pathProvider)
        {
            _pathProvider = pathProvider;
            _environment = environment;
            _appSettings = appSettings.Value;
            _serverConfig = appServerSetting.ServerConfig;
            _sentrySettings = sentrySettings.Value;

            _commonBusiness = commonBusiness;
            _uniqueBusiness = uniqueBusiness;
            _emailBusiness = emailBusiness;
        }

        [HttpGet]
        [Route("GetAllSearchModules")]
        [AllowAnonymous]
        public async Task<IEnumerable<GlobalModule>> GetAllSearchModules()
        {
            return await _uniqueBusiness.GetAllSearchModules();
        }

        /// <summary>
        /// GetMainLanguages
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetMainLanguages")]
        public async Task<object> GetMainLanguages()
        {
            return await _uniqueBusiness.GetMainLanguages();
        }

        // GET: api/common/getmodules
        [HttpGet]
        [Route("GetModules")]
        public async Task<IEnumerable<GlobalModule>> GetModules()
        {
            return await _uniqueBusiness.GetAllGlobalModule();
        }

        // GET: api/common/GetModuleSetting
        [HttpGet]
        [Route("GetModuleSetting")]
        public async Task<IList<ModuleSettingModel>> GetModuleSetting(string fieldName, string fieldValue)
        {
            return await _uniqueBusiness.GetModuleSetting(fieldName, fieldValue);
        }

        // GET: api/common/GetSettingModules
        [HttpGet]
        [Route("GetSettingModules")]
        public async Task<object> GetSettingModules(string objectParam, string objectNr, string moduleType, int? idSettingsModule, string idLogin)
        {
            return await _uniqueBusiness.GetSettingModule(objectParam, idSettingsModule, objectNr, moduleType, idLogin);
        }

        [HttpGet]
        [Route("GetDetailSubModule")]
        public async Task<IEnumerable<GlobalModule>> GetDetailSubModule(int moduleId)
        {
            return await _uniqueBusiness.GetDetailSubModule(moduleId);
        }

        [HttpGet]
        [Route("GetModuleToPersonType")]
        public async Task<IList<ModuleToPersonTypeModel>> GetModuleToPersonType()
        {
            return await _uniqueBusiness.GetModuleToPersonType();
        }

        [HttpGet]
        [Route("GetTabSummaryInfor")]
        public async Task<object> GetTabSummaryInfor(string moduleName, int idObject)
        {
            return await _uniqueBusiness.GetTabSummaryInformation(moduleName, idObject);
        }

        [HttpGet]
        [Route("GetCustomerColumnsSetting")]
        public async Task<object> GetCustomerColumnsSetting(string objectName)
        {
            return await _uniqueBusiness.GetCustomerColumnsSetting(objectName);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="comboBoxList">reference from ConstAuth.EComboBoxType</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetComboBoxInfo")]
        public async Task<object> GetComboBoxInfo(string comboBoxList, string strObject, string mode, string extraData = null)
        {
            if (string.IsNullOrEmpty(comboBoxList) && string.IsNullOrEmpty(strObject) && string.IsNullOrEmpty(mode))
                return string.Empty;
            List<string> comboListInt = null;
            if (!string.IsNullOrEmpty(comboBoxList))
            {
                var list = comboBoxList.Split(new string[] { "," }, StringSplitOptions.None);
                var enumList = Enum.GetNames(typeof(Constants.EComboBoxType)).ToList();
                comboListInt = list.Select(c =>
                {
                    int n;
                    if (int.TryParse(c.Trim(), out n))
                        return n.ToString();
                    else
                    {
                        var filter = enumList.FirstOrDefault(e => e.ToLower() == c.Trim().ToLower());
                        if (!string.IsNullOrEmpty(filter))
                            return Enum.Parse(typeof(Constants.EComboBoxType), filter).ToString();
                        else
                            return c;
                    }

                }).ToList();
            }
            return await _uniqueBusiness.GetComboBoxInformation(comboListInt, strObject, mode, extraData);
        }

        // POST: api/common/CreateContact
        [HttpPost]
        [Route("CreateContact")]
        public async Task<object> CreateContact([FromBody]ContactEditModel contact)
        {
            return await _uniqueBusiness.CreateContact(contact);
        }

        // POST: api/common/UpdateContact
        [HttpPost]
        [Route("UpdateContact")]
        public async Task<object> UpdateContact([FromBody]ContactEditModel contact)
        {
            return await _uniqueBusiness.UpdateContact(contact);
        }

        [HttpGet]
        [Route("GetPublicSetting")]
        [AllowAnonymous]
        public async Task<object> GetPublicSetting()
        {
            var result = new PublicSettingModel();
            result = (PublicSettingModel)Common.MappModelToSimpleData(result, _appSettings);

            #region build_number
            var filePathBuildNumber = _pathProvider.MapContentRootPath("build_number.txt");
            if (System.IO.File.Exists(filePathBuildNumber))
            {
                var buildNumberFileContent = System.IO.File.ReadAllText(filePathBuildNumber);
                if (!string.IsNullOrEmpty(buildNumberFileContent))
                {
                    result.AppVersion = "Build " + buildNumberFileContent.Trim();
                }
            }
            #endregion

            result.ClientIpAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();
            result.FileShareUrl = _serverConfig.ServerSetting.FileShareUrl;
            result.SignalRApiUrl = _serverConfig.ServerSetting.SignalRApiUrl;
            result.PdfApiUrl = _serverConfig.ServerSetting.PdfApiUrl;
            result.ScanningTool = _appSettings.ScanningTool;
            result.Sentry = _sentrySettings;
            result.SystemInfo = await _commonBusiness.GetSystemInfo();

            return result;
        }

        // POST: api/common/SendEmail
        [HttpPost]
        [Route("SendEmail")]
        public async Task<object> SendEmail([FromBody]EmailSimpleModel model)
        {
            return await _emailBusiness.SendEmail(model);
        }

        // POST: api/common/SendEmail
        [HttpPost]
        [Route("SendEmailWithImageAttached")]
        public async Task<object> SendEmailWithImageAttached([FromBody]EmailModel model)
        {
            model.ToEmail = _appSettings.SupportEmail;
            return await _emailBusiness.SendNotificationEmail(model);
        }

        // Post: api/common/SaveSettingModules
        /// <summary>
        /// UpdateSettingsModule
        /// </summary>
        /// <param name="data">
        /// Edit Parked Item Data
        /// pass properties such as: ObjectNr(33), ModuleName(Parked Customer), ModuleType(44), 
        /// Description, JsonSettings((5489,5,6547,4586,2145)), IsActive(1 or 0)
        /// </param>
        /// <returns></returns>
        [HttpPost]
        [Route("UpdateSettingsModule")]
        public async Task<object> UpdateSettingsModule([FromBody]ModuleSettingModel model)
        {
            string authorization = Request.Headers["Authorization"];
            string accesstoken = authorization.Replace("Bearer ", "");
            var result = _uniqueBusiness.UpdateSettingsModule(accesstoken, model);

            return await result;
        }

        // Post: api/common/MatchingCustomerData
        [HttpPost]
        [Route("MatchingCustomerData")]
        public async Task<object> MatchingCustomerData([FromBody]CustomerMatchedModel model)
        {
            //return await _commonBusiness.MatchingApiCheckPerson(model);

            return await _commonBusiness.DedupeCheckPerson(model);
        }

        [HttpGet]
        [Route("GetDynamicRulesType")]
        public async Task<object> GetDynamicRulesType()
        {
            return await _uniqueBusiness.GetDynamicRulesType();
        }

        #region WidgetApp
        [HttpGet]
        [Route("GetWidgetAppById")]
        public async Task<object> GetWidgetAppById(string idRepWidgetApp)
        {
            return await _uniqueBusiness.GetWidgetAppById(idRepWidgetApp);
        }

        [HttpPost]
        [Route("UpdateWidgetApp")]
        public async Task<object> UpdateWidgetApp([FromBody]UpdateWidgetAppModel model)
        {
            var result = _uniqueBusiness.UpdateWidgetApp(model);

            return await result;
        }

        [HttpPost]
        [Route("CreateQueue")]
        public async Task<object> CreateQueue([FromBody]CreateQueueModel model)
        {
            var result = _commonBusiness.CreateQueue(model);

            return await result;
        }

        [HttpPost]
        [Route("DeleteQueues")]
        public async Task<object> DeleteQueues([FromBody]DeleteQueuesModel model)
        {
            var result = _commonBusiness.DeleteQueues(model);

            return await result;
        }
        #endregion

        #region [Folder]

        [HttpGet]
        [Route("GetImageGalleryFolder")]
        public async Task<object> GetImageGalleryFolder()
        {
            return await _commonBusiness.GetImageGalleryFolder();
        }

        [HttpGet]
        [Route("GetImagesByFolderId")]
        public async Task<object> GetImagesByFolderId(int? folderId)
        {
            return await _commonBusiness.GetImagesByFolderId(folderId);
        }

        [HttpPost]
        [Route("SavingSharingTreeGroups")]
        public async Task<object> SavingSharingTreeGroups([FromBody]SharingTreeGroupsModel model)
        {
            var result = _commonBusiness.SavingSharingTreeGroups(model);

            return await result;
        }

        /// <summary>
        /// EditImagesGallery
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("EditImagesGallery")]
        public async Task<object> EditImagesGallery([FromBody]CampaignCostFilesModel model)
        {
            return await _commonBusiness.EditImagesGallery(model);
        }

        #endregion
    }
}
