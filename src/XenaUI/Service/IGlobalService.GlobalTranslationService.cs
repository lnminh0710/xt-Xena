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
    public partial class GlobalService : BaseUniqueServiceRequest, IGlobalService
    {
        #region Translation

        public Task<object> GetCommonTranslateLabelText(TranslateLabelGetData data)
        {
            data.MethodName = "SpAppWidgetTranslate";
            return GetDataWithMapTypeIsNone(data);
        }

        public Task<object> GetMultiTranslateLabelText(TranslateLabelGetData data)
        {
            data.MethodName = "SpAppWidgetTranslateMulti";
            return GetDataWithMapTypeIsNone(data);
        }

        public Task<object> GetSystemTranslateText(TranslateLabelGetData data)
        {
            data.MethodName = "SpAppWidget002TranslateMulti";
            data.IdRepTranslateModuleType = "5";
            return GetDataWithMapTypeIsNone(data);
        }

        public async Task<WSDataReturn> GetTranslateLabelText(TranslateLabelGetData data)
        {
            data.MethodName = "SpAppWidgetTranslate";

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

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        public async Task<WSEditReturn> SaveTranslateLabelText(TranslateLabelSaveData data)
        {
            data.MethodName = "SpCallTranslate";

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

        public async Task<WSDataReturn> GetTranslateText(TranslateTextGetData data)
        {
            data.MethodName = "SpAppWg001TextTranslate";
            data.Object = "TranslateText";

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

            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        #endregion
    }
}
