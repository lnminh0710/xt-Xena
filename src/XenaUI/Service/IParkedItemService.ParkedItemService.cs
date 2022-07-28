using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// ParkedItemService
    /// </summary>
    public class ParkedItemService : BaseUniqueServiceRequest, IParkedItemService
    {
        public ParkedItemService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        /// <summary>
        /// GetParkedItemMenu
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<IList<ParkedMenuItemModel>> GetParkedItemMenu(ParkedItemData data)
        {
            ParkedItemData _data = new ParkedItemData
            {
                MethodName = "SpCallParkedItemsChoiceColumns",
                AppModus = "0",
                IdLogin = data.IdLogin,
                LoginLanguage = data.LoginLanguage,
                IdApplicationOwner = data.IdApplicationOwner,
                GUID = null,
                IsDisplayHiddenFieldWithMsg = "1",
                Object = data.Object
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(_data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(ParkedMenuItemModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? (IList<ParkedMenuItemModel>)response : null;
        }

        /// <summary>
        /// GetListParkedItemByModule
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<CollectionParkedItemModel> GetListParkedItem(ParkedItemData data)
        {
            ParkedItemData _data = new ParkedItemData
            {
                MethodName = "SpCallWg002ParkedItemsList",
                AppModus = "0",
                IdLogin = data.IdLogin,
                LoginLanguage = data.LoginLanguage,
                IdApplicationOwner = data.IdApplicationOwner,
                GUID = data.GUID,
                IsDisplayHiddenFieldWithMsg = "1",
                WidgetTitle = string.Empty,
                Object = data.Object,
                Mode = data.Mode,
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(_data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(CollectionParkedItemModel));
            expectedReturn.Add(2, typeof(CollectionParkedItemModel));
            expectedReturn.Add(3, typeof(object));
            CollectionParkedItemModel result = new CollectionParkedItemModel();
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Dynamic));
            foreach (var item in response)
            {
                if (item.Key < 2 && item.Value != null)
                {
                    var fistItem = ((IList<CollectionParkedItemModel>)item.Value).FirstOrDefault();
                    if (fistItem != null)
                    {
                        if (!string.IsNullOrEmpty(fistItem.IdSettingsModule))
                            result.IdSettingsModule = fistItem.IdSettingsModule;

                        if (!string.IsNullOrEmpty(fistItem.WidgetTitle))
                            result.WidgetTitle = fistItem.WidgetTitle;

                        if (!string.IsNullOrEmpty(fistItem.ParkedItemKey))
                            result.ParkedItemKey = fistItem.ParkedItemKey;

                        if (!string.IsNullOrEmpty(fistItem.KeyName))
                            result.KeyName = fistItem.KeyName;
                    }
                }

                if (item.Key == 3 && item.Value != null)
                    result.CollectionParkedtems = (IList<object>)item.Value;
            }
            return result;
        }

        /// <summary>
        /// SaveParkedItemByModule
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSReturn> SaveParkedItemByModule(UpdateParkedItemData data)
        {
            data.MethodName = "SpCrudB00SettingsModule";
            data.AppModus = "0";
            data.GUID = null;
            data.Object = "B00SettingsModule";
            NewParkedItemData newData = data;
            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService"
            };
            // create new if it does not exist setting module
            if (string.IsNullOrEmpty(data.IdSettingsModule))
            {
                newData.CrudType = "Create";
                uniq.Data = JsonConvert.SerializeObject(newData);
            }
            // update with existed setting module
            else
            {
                data.CrudType = "Update";
                uniq.Data = JsonConvert.SerializeObject(data);
            }

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
        /// SaveParkedMenuItem
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<bool> SaveParkedMenuItem(List<EditParkedMenuItemData> data, string moduleName)
        {
            //Delete
            Data _data = data[0];
            var resultDelete = await DelteAllParkedMenuItem(_data, moduleName);
            if (!resultDelete)
                return false;

            foreach (var item in data)
            {
                item.MethodName = "SpCrudB00SettingsWidgetItemsUser";
                item.AppModus = "0";
                item.GUID = null;
                item.Object = "B00SettingsWidgetItemsUser";
                item.CrudType = "Create";

                UniqueBody uniq = new UniqueBody
                {
                    ModuleName = "GlobalModule",
                    ServiceName = "GlobalService",
                    Data = JsonConvert.SerializeObject(item)
                };
                BodyRequest bodyRquest = new BodyRequest
                {
                    Request = uniq
                };

                var expectedReturn = new Dictionary<int, Type>();
                expectedReturn.Add(0, typeof(WSReturn));
                var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
                if (response == null) return false;

                var firstItem = ((IList<WSReturn>)response).FirstOrDefault();
                if (firstItem == null || !firstItem.SqlMessageContains(new[] { "Successfully", "record does not exist" }))
                    return false;
            }
            return true;
        }

        private async Task<bool> DelteAllParkedMenuItem(Data data, string moduleName)
        {
            DeleteParkedMenuItemData deleteData = new DeleteParkedMenuItemData
            {
                MethodName = "SpCallParkedItemsChoiceColumns",
                AppModus = "0",
                Object = "Delete",
                CrudType = data.CrudType,
                IdApplicationOwner = data.IdApplicationOwner,
                IdLogin = data.IdLogin,
                IdSettingsGUI = data.IdLogin,
                LoginLanguage = data.LoginLanguage,
                Mode = data.Mode,
                ModuleName = moduleName
            };

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(deleteData)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };

            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            if (response != null)
            {
                var firstItem = ((IList<WSReturn>)response).FirstOrDefault();
                if (firstItem != null)
                    return firstItem.MessageContains(new[] { "Successfully", "record does not exist" });
            }
            return false;
        }
    }
}
