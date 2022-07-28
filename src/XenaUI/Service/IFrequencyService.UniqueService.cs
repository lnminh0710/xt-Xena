using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace XenaUI.Service
{
    /// <summary>
    /// IFrequencyService
    /// </summary>
    public class FrequencyService : BaseUniqueServiceRequest, IFrequencyService
    {
        public FrequencyService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public async Task<object> RebuildFrequencies(FrequencyData data)
        {
            var timeout = (int)TimeSpan.FromMinutes(20).TotalMilliseconds;//20 minutes
            return await GetData(data, "SpCallSelectionProject", "RebuildFrequencies", requestTimeout: timeout);
        }

        public async Task<object> GetFrequencyBusyIndicator(FrequencyData data)
        {
            return await GetData(data, "SpCallSelectionProject", "GetFrequencyBusyIndicator");
        }

        public async Task<object> GetFrequency(FrequencyData data)
        {
            return await GetData(data, "SpCallSelectionProjectGetData", "GetProjectFrequencies");
        }

        public async Task<WSEditReturn> SaveFrequency(FrequencyCreateData data)
        {
            data.MethodName = "SpCallSelectionProject";
            data.Object = "SaveProjectFrequencies";
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
    }
}
