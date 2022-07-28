using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Service
{
    /// <summary>
    /// GlobalService
    /// </summary>
    public partial class GlobalService : BaseUniqueServiceRequest, IGlobalService
    {
        protected readonly IPathProvider _pathProvider;

        public GlobalService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting, IPathProvider pathProvider)
            : base(appSettings, httpContextAccessor, appServerSetting)
        {
            _pathProvider = pathProvider;
        }

        #region Global Settings
        public async Task<bool> DeleteGlobalSettingById(GlobalSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsGlobal";
            data.Object = "B00SettingsGlobal";
            data.CrudType = "Delete";
            data.AppModus = "0";

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
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            if (response != null)
            {
                var firstItem = ((IList<WSReturn>)response).FirstOrDefault();
                if (firstItem != null)
                    return firstItem.SqlMessageContains(new[] { "Successfully", "record does not exist" });
            }
            return false;
        }

        public async Task<IList<GlobalSettingModel>> GetAllGlobalSettings(Data data)
        {
            data.MethodName = "SpCallSettingsGlobalList";
            data.Object = "Global Settings";

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
            expectedReturn.Add(0, typeof(GlobalSettingModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? (IList<GlobalSettingModel>)response : null;
        }

        public async Task<GlobalSettingModel> GetGlobalSettingById(GlobalSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsGlobal";
            data.Object = "B00SettingsGlobal";
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
            expectedReturn.Add(0, typeof(GlobalSettingModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<GlobalSettingModel>)response).FirstOrDefault() : null;
        }

        public async Task<WSReturn> SaveGlobalSettingById(GlobalSettingUpdateData data)
        {
            data.MethodName = "SpCallSettingsGlobalList";
            data.Object = "SaveGlobalSetting";
            data.GUID = null;

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
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
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }

        public Task<object> GetAdvanceSearchProfile(Data data)
        {
            return GetData(data, "SpCallSettingsGlobalList", "GetAdvanceSearchProfile");
        }

        #endregion
    }
}
