using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public partial class BackOfficeService : BaseUniqueServiceRequest, IBackOfficeService
    {
        public BackOfficeService(IOptions<AppSettings> appSettings,
                                 IHttpContextAccessor httpContextAccessor,
                                 IAppServerSetting appServerSetting) : base(appSettings, httpContextAccessor, appServerSetting) { }


        public async Task<object> GetBlockedOrderTextTemplate(BlockOrdersData data)
        {
            data.MethodName = "SpAppB01BlockedOrders";
            data.Object = "GetBlockedOrderTextTemplate";

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

        public async Task<object> GetMailingListOfPlaceHolder(BlockOrdersData data)
        {
            data.MethodName = "SpAppB01BlockedOrders";
            data.Object = "GetMailingListOfPlaceHolder";

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

        public Task<object> GetListOfMandantsByIdSalesOrder(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetListofMandants");
        }

        public Task<object> GetLetterTypeByMandant(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetLetterTypeByIdMandants");
        }

        public Task<object> GetLetterTypeByWidgetAppId(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetAllLetterTypeByIdRepWidgetApp");
        }

        public Task<object> GetGroupAndItemsByLetterType(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetGroupAndItems");
        }

        public Task<object> GetAssignWidgetByLetterTypeId(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetAssignWidget");
        }

        public Task<object> GetAllTypeOfAutoLetter(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetTypeOfAutoLetter");
        }

        public Task<object> GetCountriesLanguageByLetterTypeId(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetCountriesLanguage");
        }

        public Task<object> GetListOfTemplate(RequestCommonData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppBackOfficeLetters", "GetListOfTemplate");
        }

        public Task<WSEditReturn> SaveSalesOrderLetters(BackOfficeLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeSalesOrderLetters", "SaveSalesOrderLetters");
        }

        public Task<WSEditReturn> SaveSalesOrderLettersConfirm(ConfirmBackOfficeLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeSalesOrderLetters", "SaveSalesOrderLettersConfirm");
        }

        public Task<WSEditReturn> SaveSalesCustomerLetters(BackOfficeLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeCustomerLetters", "SaveSalesOrderLetters");
        }

        public Task<WSEditReturn> SaveBackOfficeLetters(BackOfficeLetterTemplateData data)
        {
            return SaveData(data, "SpCallBackOfficeLetters", "SaveBackOfficeLetters");
        }

        public Task<WSEditReturn> SaveBackOfficeLettersTest(BackOfficeLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeLetters", "SaveBackOfficeLettersTest");
        }

        public Task<WSEditReturn> ConfirmSalesOrderLetters(ConfirmLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeSalesOrderLetters", "ConfirmSalesOrderLetters");
        }

        public Task<WSEditReturn> ResetLetterStatus(ResetLetterStatusData data)
        {
            return SaveData(data, "SpCallBackOfficeSalesOrderLetters", "ResetLetterStatus");
        }

        public Task<WSEditReturn> SaveBackOfficeLettersTestGeneratedDoc(BackOfficeLettersData data)
        {
            return SaveData(data, "SpCallBackOfficeLetters", "SaveBackOfficeLettersTestGeneratedDoc");
        }

        public async Task<WSEditReturn> SaveTextTemplate(BlockOrdersData data)
        {
            data.MethodName = "SpCallB01BlockedOrders";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveTextTemplate";

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

        public Task<WSEditReturn> DeleteBackOfficeLetters(BackOfficeLetterTemplateDeleteData data)
        {
            return SaveData(data, "SpCallBackOfficeLetters", "DeleteGenerateLetter");
        }
    }
}
