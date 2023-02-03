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
    /// <summary>
    /// OrderDataEntryService
    /// </summary>
    public class OrderDataEntryService : BaseUniqueServiceRequest, IOrderDataEntryService
    {
        public OrderDataEntryService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting) : base(appSettings, httpContextAccessor, appServerSetting) { }

        public async Task<WSEditReturn> CreateLotName(LotData data)
        {
            data.MethodName = "SpCallScanningOrdersEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "ScanningLot";

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

        /// <summary>
        /// DeleteLot
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> DeleteLot(LotData data)
        {
            data.MethodName = "SpCallScanningOrdersEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "DeleteLot";

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


        /// <summary>
        /// DeleteLotItem
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> DeleteLotItem(ScanningLotItemData data)
        {
            data.MethodName = "SpCallScanningOrdersEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "DeleteScanItem";

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
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        /// <summary>
        /// GetMainCurrencyAndPaymentType
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<object> GetMainCurrencyAndPaymentType(OrderDataEntryData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.Object = "GetMailingData";
            data.Mode = "GetMainCurrencyAndPaymentType";

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

        /// <summary>
        /// GetMainCurrencyAndPaymentTypeForOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public Task<object> GetMainCurrencyAndPaymentTypeForOrder(OrderDataEntryData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpCallOrderDataEntry", "GetMailingData", "GetForManuelCurrencyAndPaymentType");
        }

        public async Task<object> GetArticleData(OrderDataEntryData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.Object = "GetMailingData";
            data.Mode = "GetArticles";

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

        public async Task<OrderDataEntryCustomerModel> GetCustomerData(OrderDataEntryData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.Object = "GetMailingData";
            data.Mode = "GetCustomerData";

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
            OrderDataEntryCustomerModel result = new OrderDataEntryCustomerModel();

            // get customer data
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(PersonModel));
            var rs = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType3));
            var response = rs[1];
            if (response != null)
                result.CustomerData = ((IList<PersonModel>)response).FirstOrDefault();
            if (result.CustomerData == null)
                result.CustomerData = new PersonModel();

            rs = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None));

            if( rs!= null && rs[0] != null )
            {
                JArray item = ((JArray)rs[0]);
                if(item!= null && item.Last != null && item.Last.FirstOrDefault() != null)
                {
                    if (item.Last.FirstOrDefault()["OrderSettingsMessage"] != null)
                    {
                        result.OrderSettingMessage = (item.Last.FirstOrDefault())["OrderSettingsMessage"].ToString();
                    }
                }
            }

            // get communication data
            data.Mode = "GetCustomerComm";
            bodyRquest.Request.Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                //Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            });
            response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            if (response != null)
                result.CommunicationData = (JArray)response;
            else
                result.CommunicationData = new JArray();

            return result;
        }

        public async Task<object> GetPreloadOrderData(OrderDataEntryData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.Object = "GetPreloadData";
            data.CrudType = "GetData";

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

        public Task<object> OrderDataEntryByLogin(OrderDataEntryByLoginData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWgOrderDataEntry", "OrderDataEntryByLogin");
        }

        public Task<object> TotalDataEntryByLogin(Data data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWgOrderDataEntry", "TotalDataEntryByLogin");
        }

        public async Task<WSEditReturn> SaveOrderDataEntryData(CustomerOrderDataEntryData data, string objectName)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = objectName;

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

        public async Task<WSEditReturn> SaveScanningOrder(ScanningLotItemData data)
        {
            data.MethodName = "SpCallScanningOrdersEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "ScanningLotItems";

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

        public async Task<WSEditReturn> CloseLotScanningTool(LotData data)
        {
            data.MethodName = "SpCallScanningOrdersEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "CloseLotScanningTool";

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
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> SendOrderToAdministrator(SendOrderToAdministratorData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SendOrderToAdministrator";

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

        public Task<object> GetRejectPayments(OrderDataEntryGetRejectPaymentsData data)
        {
            data.MethodName = "SpCallBusinessLogic";
            data.Object = "NotApprovedPaymentType";
            data.CrudType = "GetData";
            return GetDataWithMapTypeIsNone(data);
        }

        public Task<object> GetSalesOrderById(OrderDataEntryGetSalesOrderByIdData data)
        {
            data.MethodName = "SpAppWgOrderDataEntryByIdSalesOrder";
            data.Object = "OrderDataEntryByIdSalesOrder";
            return GetDataWithMapTypeIsNone(data);
        }

        public async Task<WSEditReturn> SaveOrderFileFromColissimo(SaveResponseFromColissimoData data)
        {
            data.MethodName = "SpCallOrderDataEntry";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveResponseFromColissimo";
            data.AppModus = "1";
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
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }
    }
}
