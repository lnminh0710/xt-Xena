using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using XenaUI.Constants;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Business
{
    /// <summary>
    /// UniqueBusiness
    /// </summary>
    public class UniqueBusiness : BaseBusiness, IUniqueBusiness
    {
        private readonly IUniqueService _uniqueService;

        public UniqueBusiness(IHttpContextAccessor context, IUniqueService uniqueService) : base(context)
        {
            _uniqueService = uniqueService;
        }

        /// <summary>
        /// GetMainLanguages
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMainLanguages()
        {
            return await _uniqueService.GetMainLanguages(this.ServiceDataRequest);
        }

        /// <summary>
        /// GetAllSearchModules
        /// </summary>
        /// <returns></returns>
        public async Task<IList<GlobalModule>> GetAllSearchModules()
        {
            var results = _uniqueService.GetAllModules(ServiceDataRequest.IdLogin);
            var modules = (List<GlobalModule>)(await results);
            IList<GlobalModule> searchResultModules = new List<GlobalModule>();
            // Get Administrator Module
            var adminModule = modules.Where(p => p.IdSettingsGUI == 1).ToList();
            if (adminModule.Count > 0)
            {
                var subAdminModules = modules.Where(p => p.IsCanNew == true && p.IsCanSearch == true && p.IdSettingsGUIParent == 1).ToList();
                adminModule[0].Children = subAdminModules;
                searchResultModules.Add(adminModule[0]);
            }
            var otherSearchModules = modules.Where(p => p.IsCanSearch == true && p.IdSettingsGUIParent != 1 && p.IdSettingsGUI != 5).ToList();
            if (otherSearchModules.Count > 0)
            {
                searchResultModules = searchResultModules.Concat(otherSearchModules).ToList();
            }
            return searchResultModules;
        }

        /// <summary>
        /// GetAllGlobalModule
        /// </summary>
        /// <returns></returns>
        public Task<IList<GlobalModule>> GetAllGlobalModule()
        {
            return _uniqueService.GetAllGlobalModule(ServiceDataRequest.IdLogin);
        }

        /// <summary>
        /// GetDetailSubModule
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        public async Task<IList<GlobalModule>> GetDetailSubModule(int moduleId)
        {
            IList<GlobalModule> results = new List<GlobalModule>();
            var detailModule = _uniqueService.GetDetailSubModule(moduleId);
            var rs = (List<GlobalModule>)(await detailModule);
            if (rs != null && rs.Count > 0)
            {
                rs.Add(new GlobalModule
                {
                    IdSettingsGUI = moduleId,
                    IdSettingsGUIParent = null
                });
                var trees = rs.BuildTree();
                if (trees != null && trees.Count > 0)
                {
                    results = trees[0].Children;
                    RebuiltDetailSubModule(results);
                }
            }
            return results;
        }

        /// <summary>
        /// GetModuleSetting
        /// </summary>
        /// <param name="fieldName"></param>
        /// <param name="fieldValue"></param>
        /// <returns></returns>
        public async Task<IList<ModuleSettingModel>> GetModuleSetting(string fieldName, string fieldValue)
        {
            ModuleSettingData data = (ModuleSettingData)ServiceDataRequest.ConvertToRelatedType(typeof(ModuleSettingData));
            data.SqlFieldName = fieldName;
            data.SqlFieldValue = fieldValue;
            var result = await _uniqueService.GetModuleSetting(data);
            return result;
        }

        public async Task<IList<TabSummaryModel>> GetTabSummaryInformation(string moduleName, int idObject)
        {
            var data = (TabData)ServiceDataRequest.ConvertToRelatedType(typeof(TabData));
            data.Object = moduleName;
            data.IdObject = idObject;
            var result = await _uniqueService.GetTabSummaryInformation(data);
            if (result == null) return new List<TabSummaryModel>();
            foreach (var item in result)
            {
                var filter = item.TabSummaryData.Where(c => !c.IsFavorited);
                item.TabSummaryMenu = filter.ToList();
                item.TabSummaryData = item.TabSummaryData.Except(filter).ToList();

            }
            return result;
        }

        public async Task<object> GetCustomerColumnsSetting(string objectName)
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            data.Object = objectName;
            data.Mode = "GetColumnName";
            return await _uniqueService.GetCustomerColumnsSetting(data);
        }

        public async Task<object> GetComboBoxInformation(IList<string> comboBoxList, string strObject, string mode, string extraData = null)
        {
            var data = ServiceDataRequest;
            if (string.IsNullOrEmpty(strObject) && string.IsNullOrEmpty(mode))
            {
                data.Object = string.Join(",", comboBoxList.Select(c =>
                {
                    int n;
                    if (int.TryParse(c, out n))
                        return string.Format(@"""{0}""", ((EComboBoxType)n).ToString());
                    else
                        return string.Format(@"""{0}""", c);
                }));
            }
            else
            {
                data.Object = string.Format(@"""{0}""", strObject);
                data.Mode = mode;
            }

            var result = await _uniqueService.GetComboBoxInformation(data, extraData);
            return result;
        }

        /// <summary>
        /// Rebuilt
        /// </summary>
        /// <param name="modules"></param>
        private void RebuiltDetailSubModule(IEnumerable<GlobalModule> modules)
        {
            foreach (var result in modules)
            {
                if (!result.Children.Any())
                {
                    if (result.IsCanSearch)
                    {
                        result.Children.Add(new GlobalModule
                        {
                            IdSettingsGUI = -1,
                            ModuleName = result.ModuleName,
                            IsCanSearch = true,
                            IdSettingsGUIParent = result.IdSettingsGUI
                        });
                    }
                    if (result.IsCanNew)
                    {
                        result.Children.Add(new GlobalModule
                        {
                            IdSettingsGUI = -1,
                            ModuleName = result.ModuleName,
                            IsCanNew = true,
                            IdSettingsGUIParent = result.IdSettingsGUI
                        });
                    }
                }
                else
                {
                    RebuiltDetailSubModule(result.Children);
                }
            }
        }


        private async Task<WSContactEditReturn> SavingContactAsync(ContactEditModel model, ContactCreateData data, string crudType = "")
        {            
            if (model.Communications != null)
            {
                var communicationsValue = JsonConvert.SerializeObject(model.Communications);
                data.JSONText = string.Format(@"""Communications"":{0}", communicationsValue);
                data.JSONText = "{" + data.JSONText + "}";
            }

            if (model.PersonInterfaceContactCountries != null)
            {
                var countriesValue = JsonConvert.SerializeObject(model.PersonInterfaceContactCountries);
                data.JSONCountryText = string.Format(@"""PersonInterfaceContactCountries"":{0}", countriesValue);
                data.JSONCountryText = "{" + data.JSONCountryText + "}";
            }

            if (model.ContactAddressTypes != null && model.ContactAddressTypes.Count > 0)
            {
                var contactAddressTypes = JsonConvert.SerializeObject(model.ContactAddressTypes);
                data.JSONPersonContactAddressType = string.Format(@"""ContactAddressType"":{0}", contactAddressTypes);
                data.JSONPersonContactAddressType = "{" + data.JSONPersonContactAddressType + "}";
            }

            WSContactEditReturn result;
            if (crudType == "UPDATE")
            {
                result = await _uniqueService.UpdateContact(data, model.Communications != null ? model.Communications.Count : 0);
            }
            else
            {
                result = await _uniqueService.CreateContact(data, model.Communications != null ? model.Communications.Count : 0);
            }
            return result;
        }

        /// <summary>
        /// CreateContact
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<WSContactEditReturn> CreateContact(ContactEditModel model)
        {
            ContactCreateData data = (ContactCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(ContactCreateData));
            data = (ContactCreateData)Common.MappModelToData(data, model);
            return await SavingContactAsync(model, data);
        }

        /// <summary>
        /// UpdateContact
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<WSContactEditReturn> UpdateContact(ContactEditModel model)
        {
            ContactUpdateData data = (ContactUpdateData)ServiceDataRequest.ConvertToRelatedType(typeof(ContactUpdateData));
            data = (ContactUpdateData)Common.MappModelToData(data, model);
            return await SavingContactAsync(model, data, "UPDATE");
        }

        /// <summary>
        /// GetColumnSetting
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        public Task<object> GetColumnSetting(string moduleId)
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            data.Object = moduleId;
            return _uniqueService.GetColumnSetting(data);
        }

        public async Task<IList<ModuleToPersonTypeModel>> GetModuleToPersonType()
        {
            var result = await _uniqueService.GetModuleToPersonType(ServiceDataRequest);
            return result;
        }

        public async Task<object> GetSettingModule(string objectParam, int? idSettingsModule, string objectNr, string moduleType, string idLogin)
        {
            ModuleSettingData data = (ModuleSettingData)ServiceDataRequest.ConvertToRelatedType(typeof(ModuleSettingData));
            data.Object = objectParam;
            data.IdSettingsModule = idSettingsModule;
            data.ObjectNr = objectNr;
            data.ModuleType = moduleType;
            if (idLogin != null)
            {
                data.IdLogin = idLogin;
            }
            var result = await _uniqueService.GetSettingModule(data);
            return result;
        }

        public async Task<WSReturn> UpdateSettingsModule(string accesstoken, ModuleSettingModel model)
        {
            var data = new UpdateModuleSettingData
            {
                IdSettingsModule = model.IdSettingsModule,
                IdLogin = model.IdLogin + string.Empty,
                ObjectNr = model.ObjectNr,
                ModuleName = model.ModuleName,
                ModuleType = model.ModuleType,
                Description = model.Description,
                JsonSettings = model.JsonSettings
            };

            return await _uniqueService.UpdateSettingsModule(data);
        }

        /// <summary>
        /// GetDynamicRulesType
        /// </summary>
        /// <returns></returns>
        public Task<object> GetDynamicRulesType()
        {
            return _uniqueService.GetDynamicRulesType();
        }

        #region WidgetApp
        /// <summary>
        /// GetWidgetAppById
        /// </summary>
        /// <param name="idRepWidgetApp"></param>
        /// <returns></returns>
        public async Task<object> GetWidgetAppById(string idRepWidgetApp)
        {
            WidgetAppGetData data = (WidgetAppGetData)ServiceDataRequest.ConvertToRelatedType(typeof(WidgetAppGetData));
            data.IdRepWidgetApp = idRepWidgetApp + string.Empty;
            return await _uniqueService.GetWidgetAppById(data);
        }

        public async Task<WSEditReturn> UpdateWidgetApp(UpdateWidgetAppModel model)
        {
            UpdateWidgetAppData data = (UpdateWidgetAppData)ServiceDataRequest.ConvertToRelatedType(typeof(UpdateWidgetAppData));

            data.IdSettingsGUI = model.IdSettingsGUI;
            data.IdRepWidgetApp = model.IdRepWidgetApp;
            data.IdRepWidgetType = model.IdRepWidgetType;
            data.WidgetDataType = model.WidgetDataType;
            data.WidgetTitle = model.WidgetTitle;
            data.IconName = model.IconName;
            data.JsonString = model.JsonString;
            data.UpdateJsonString = model.UpdateJsonString;
            data.IdSettingsModule = model.IdSettingsModule;
            data.ToolbarJson = model.ToolbarJson;
            data.UsedModule = model.UsedModule;

            return await _uniqueService.UpdateWidgetApp(data);
        }
        #endregion
    }
}

