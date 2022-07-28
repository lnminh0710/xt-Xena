using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace XenaUI.Service
{
    /// <summary>
    /// GlobalService
    /// </summary>
    public partial class CommonService : BaseUniqueServiceRequest, ICommonService
    {
        public CommonService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting)
        {
        }

        /// <summary>
        /// GetSystemInfo
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<object> GetSystemInfo(Data data)
        {
            data.MethodName = "SpAppSystemInfo";
            data.Object = "Get System Info";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };

            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            if (response != null)
            {
                var result = (JArray)response;
                if (result != null && result.Count > 0) return result.First().First();
            }

            return null;
        }
        
        public async Task<WSEditReturn> CreateQueue(CommonCreateQueueData data)
        {
            return await SaveData(data, "SpCallSystemScheduleQueue", "SavingQueue");
        }
        
        public async Task<WSEditReturn> DeleteQueues(CommonDeleteQueuesData data)
        {
            return await SaveData(data, "SpCallSystemScheduleQueue", "DeleteQueues");
        }

        #region [Folder]

        public Task<object> GetImageGalleryFolder(Data data)
        {
            return GetDataWithMapTypeIsNone(data, "SpCallImageGallery", "GetImageGalleryFolder");
        }

        public Task<object> GetImagesByFolderId(ImageGalleryData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpCallImageGallery", "GetImagesByFolderId");
        }

        public async Task<WSEditReturn> SavingSharingTreeGroups(SharingTreeGroupsData data)
        {
            return await SaveData(data, "SpCallImageGallery", "CallImageGalleryFolder");
        }

        public async Task<WSEditReturn> EditImagesGallery(CampaignCreateData data)
        {
            return await SaveData(data, "SpCallImageGallery", "EditImagesGallery");
        }

        #endregion

        public async Task<JArray> GetReportNotesForOuput(Data data, string fieldName, string value)
        {
            data.MethodName = "SpAppSharingNotes";
            data.Object = "GetNotesPerson";

            var expandData = Common.ToDictionary(data);
            expandData[fieldName] = value;

            BodyRequest bodyRquest = CreateBodyRequestObject(expandData);

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response == null ? null : (JArray)response;
        }


        public async Task<WSEditReturn> DetectProcess(DetectProcessData data)
        {
            data.MethodName = "SpAppWg002LogTransaction";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "KillProcess";

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
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<JArray> CallBackToDBByDynamicSP(SaveDynamicData saveData)
        {
            Data data = saveData.BaseData;
            data.MethodName = saveData.SpMethodName;
            data.Object = saveData.SpObject;

            var expandData = Common.ToDictionary(data);

            var types = new List<Type>() { typeof(object), typeof(Array), typeof(JObject), typeof(JArray) };
            foreach (KeyValuePair<string, object> entry in saveData.Data)
            {
                if (saveData.IgnoredKeys.Contains(entry.Key)) continue;

                var key = entry.Key;
                if (entry.Value != null && !entry.Key.StartsWith("JSON") && types.Contains(entry.Value.GetType()))
                {
                    key = "JSON" + entry.Key;
                }
                expandData[key] = entry.Value + string.Empty;
            }

            BodyRequest bodyRquest = CreateBodyRequestObject(expandData);

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response == null ? null : (JArray)response;
            //var response = await Execute(() => Service.ExecutePost<IList<WSEditReturn>>(bodyRquest, Constants.EExecuteMappingType.Normal));
            //return response?.FirstOrDefault();
        }
    }
}
