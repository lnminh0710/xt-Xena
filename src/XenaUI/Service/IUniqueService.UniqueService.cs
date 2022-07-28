using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using XenaUI.Constants;
using System.Reflection;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using System.Dynamic;

namespace XenaUI.Service
{
    /// <summary>
    /// UniqueService
    /// </summary>
    public class UniqueService : BaseUniqueServiceRequest, IUniqueService
    {
        public UniqueService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        /// <summary>
        /// GetMainLanguages
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMainLanguages(Data data)
        {
            return await GetDataWithMapTypeIsNone(data, "SpAppWg002RepLanguage", "");
        }

        /// <summary>
        /// GetColumnSetting
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        public async Task<object> GetColumnSetting(Data data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Mode = "GetColumnName";            

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return (JArray)response;
        }

        /// <summary>
        /// GetAllModules
        /// </summary>
        /// <returns></returns>
        public async Task<IList<GlobalModule>> GetAllModules(string idLogin)
        {
            Data data = new Data
            {
                MethodName = "SpCallGuiMenus",
                CrudType = "Read",
                Object = "AllMenu",
                Mode = null,
                AppModus = "0",
                IdLogin = idLogin,
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(GlobalModule));
            IList<GlobalModule> response = (IList<GlobalModule>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response;
        }

        /// <summary>
        /// GetAllGlobalModule
        /// </summary>
        /// <returns></returns>
        public async Task<IList<GlobalModule>> GetAllGlobalModule(string idLogin)
        {
            Data data = new Data
            {
                MethodName = "SpCallGuiMenus",
                CrudType = "Read",
                Object = "MainMenu",
                Mode = null,
                AppModus = "0",
                IdLogin = idLogin,
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(GlobalModule));
            IList<GlobalModule> response = (IList<GlobalModule>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response;
        }

        /// <summary>
        /// GetDetailSubModule
        /// </summary>
        /// <returns></returns>
        public async Task<IList<GlobalModule>> GetDetailSubModule(int moduleId)
        {
            Data data = new Data
            {
                MethodName = "SpCallGuiMenus",
                CrudType = "Read",
                Object = "SubMenu",
                Mode = null,
                AppModus = "1",
                IdLogin = "1",
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null,
                IdSettingsGUI = moduleId.ToString()
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(GlobalModule));
            var response = (IList<GlobalModule>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response;
        }

        /// <summary>
        /// Get User By LoginName/Pwd
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<UserFromService> GetUser(User user)
        {
            LoginData data = new LoginData
            {
                MethodName = "SpCallLogin",
                AppModus = "0",
                IdLogin = "1",
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null,
                LoginName = user.LoginName,
                Password = user.Password,
                IPAddress = user.IpAddress,
                OSType = user.OsType,
                OSVersion = user.OsVersion,
                BrowserType = user.BrowserType,
                VersionBrowser = user.VersionBrowser,
                StepLog = user.StepLog,
                IsDisplayHiddenFieldWithMsg = "1"
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(UserFromService));
            var response = (IList<UserFromService>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? response.FirstOrDefault() : null;
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <param name="loginName"></param>
        /// <returns></returns>
        public async Task<UserFromService> ResetPassword(string loginName)
        {
            ResetPasswordData data = new ResetPasswordData
            {
                MethodName = "SpCallLogin",
                AppModus = "0",
                IdLogin = "",
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null,
                LoginName = loginName,
                Password = null,
                IsDisplayHiddenFieldWithMsg = "1",
                IsResetPassword = "1",
                Mode = "ResetPassword"
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(UserFromService));
            var response = (IList<UserFromService>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? response.FirstOrDefault() : null;
        }

        /// <summary>
        /// Get User By LoginName/Pwd
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<WSReturn> ChangePassword(string loginName, string newpassword, string idLogin)
        {
            LoginData data = new LoginData
            {
                MethodName = "SpCrudB00Login",
                AppModus = "0",
                IdLogin = idLogin,
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null,
                LoginName = loginName,
                Password = newpassword,
                IsDisplayHiddenFieldWithMsg = "1",
                CrudType = "Update",
                Object = "B00Login"
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (IList<WSReturn>)(await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? response.FirstOrDefault() : null;
        }

        /// <summary>
        /// Reset Password
        /// </summary>
        /// <param name="loginName"></param>
        /// <returns></returns>
        public Task<bool> SendNotificationForExpiredUser(string loginName, string content)
        {
            return Task.FromResult(true);
        }

        public async Task<IList<ModuleSettingModel>> GetModuleSetting(ModuleSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsModule";
            data.Object = "B00SettingsModule";
            data.CrudType = "Read";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(ModuleSettingModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? (IList<ModuleSettingModel>)response : null;
        }

        public async Task<object> GetSettingModule(ModuleSettingData data)
        {
            data.MethodName = "SpCallGetSettingsModule";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(ModuleSettingModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? (IList<ModuleSettingModel>)response : null;
        }

        public async Task<IList<TabSummaryModel>> GetTabSummaryInformation(TabData data)
        {
            data.MethodName = "SpCallGuiMenus";
            data.Mode = "TabMenu";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(TabSummaryModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.TabSummary))[0];
            return response != null ? (IList<TabSummaryModel>)response : null;
        }

        public async Task<object> GetCustomerColumnsSetting(Data data)
        {
            return await GetDataWithMapTypeIsNone(data, "SpSyncElasticSearch", data.Object);
        }

        public async Task<object> GetComboBoxInformation(Data data, string extraData = null)
        {
            data.MethodName = "SpCallComboBox";

            //object oData = data;

            //#region ExtraData
            //if (!string.IsNullOrEmpty(extraData))
            //{
            //    dynamic dData = ToExpandoObject(data);
            //    var arrExtraData = extraData.Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries);
            //    foreach (var extraDataItem in arrExtraData)
            //    {
            //        var arrExtraDataItem = extraDataItem.Split(new char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
            //        if (arrExtraDataItem.Length == 2)
            //        {
            //            dData[arrExtraDataItem[0]] = arrExtraDataItem[1];
            //        }
            //    }//for
            //    oData = dData;
            //}
            //#endregion

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };

            BodyRequest bodyRquest = new BodyRequest { Request = uniq };

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.ComboBox))[0];
            return response;
        }

        public async Task<WSContactEditReturn> SavingContact(ContactCreateData data, int numCommunications)
        {
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSContactEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSContactEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSContactEditReturn> CreateContact(ContactCreateData data, int numCommunications)
        {
            data.MethodName = "SpCallContactCreate";
            data.CrudType = "CREATE";
            return await SavingContact(data, numCommunications);
        }

        public async Task<WSContactEditReturn> UpdateContact(ContactCreateData data, int numCommunications)
        {
            data.MethodName = "SpCallContactUpdate";
            data.CrudType = "UPDATE";
            return await SavingContact(data, numCommunications);
        }

        public async Task<IList<ModuleToPersonTypeModel>> GetModuleToPersonType(Data data)
        {
            data.MethodName = "SpCallSettingsGlobalList";
            data.Object = "ModuleToPersonType";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                            //Formatting = Formatting.Indented,
                            NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(ModuleToPersonTypeModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? (IList<ModuleToPersonTypeModel>)response : null;
        }

        /// <summary>
        /// UpdateModuleSettingData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSReturn> UpdateSettingsModule(UpdateModuleSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsModule";
            data.AppModus = "0";
            data.GUID = null;
            data.Object = "B00SettingsModule";
            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService"
            };

            data.CrudType = "Update";
            uniq.Data = JsonConvert.SerializeObject(data);

            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }

        /// <summary>
        /// GetDynamicRulesType
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetDynamicRulesType()
        {
            Data data = new Data
            {
                MethodName = "SpCrudB02RepSelectionDynamicRulesType",
                CrudType = "READ",
                Object = "B02RepSelectionDynamicRulesType",
                Mode = "",
                AppModus = "0",
                IdLogin = "1",
                LoginLanguage = "1",
                IdApplicationOwner = "1",
                GUID = null
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return (JArray)response;
        }

        #region WidgetApp
        /// <summary>
        /// GetWidgetAppById
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<object> GetWidgetAppById(WidgetAppGetData data)
        {
            data.Object = "GetById";
            data.MethodName = "SpAppWg002GetWidgetApp";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];

            return response;
        }

        /// <summary>
        /// UpdateWidgetApp
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> UpdateWidgetApp(UpdateWidgetAppData data)
        {
            return await SaveData(data, "SpCallWidgetApp", "");
        }
        #endregion
    }
}
