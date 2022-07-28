using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Utils;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace XenaUI.Service
{
    /// <summary>
    /// ProjectService
    /// </summary>
    public class ProjectService : BaseUniqueServiceRequest, IProjectService
    {
        public ProjectService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public async Task<object> GetSelectionProject(ProjectData data)
        {
            data.IsDisplayHiddenFieldWithMsg = "1";
            var response = await GetData(data, "SpCallSelectionProjectGetData", "GetSelectionProject");
            if (response != null)
            {
                var array = (JArray)response;
                if (array.Count > 1)
                {
                    return ((JArray)array[1]).ToWidgetDetailModel();
                }
            }

            return null;
        }

        public Task<object> GetMediaCodePricing(MediacodePricingCountryProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetMediaCodePricing");
        }

        public Task<object> InsertMediaCodeToCampaign(InsertMediaCodeToCampaign data)
        {
            return GetData(data, "SpCallBusinessLogic", "InsertMediaCodeToCampaing");
        }
        public Task<object> GetListOfCampaign(ProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetListOfCampaign");
        }

        public async Task<WSEditReturn> SaveProject(ProjectCreateData data)
        {
            data.MethodName = "SpCallSelectionProject";
            data.Object = "DataChangeProject";
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> SaveProjectExclude(ProjectExcludeData data)
        {
            data.MethodName = "SpCallSelectionProject";
            data.Object = "ProjectExclude";
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> SaveMediaCodePricing(ProjectSaveMediaCodePricingData data)
        {
            return await SaveData(data, "SpCallSelectionProject", "SaveMediaCodePricing");
        }

        public Task<object> GetSelectionToExclude(ProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetGetSelectionToExclude");
        }

        public Task<object> GetSelectionIsExcluded(ProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetGetSelectionIsExcluded");
        }

        public Task<object> GetSelectionCountriesExcluded(ProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetGetSelectionCountriesExcluded");
        }

        public Task<object> GetSelectionMediacodeExcluded(ProjectData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetGetSelectionMediacodeExcluded");
        }
    }
}
