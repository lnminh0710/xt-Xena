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
        public async Task<object> GetWidgetInfoByIds(ReturnRefundData data)
        {
            data.MethodName = "SpAppB01ReturnAndRefunds";
            data.Object = "GetWidgetIDs";
            data.WidgetTitle = "Article Sales Pricing...";

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

        public async Task<WSEditReturn> SaveWidgetData(ReturnRefundSaveData data)
        {
            data.MethodName = "SpCallB01ReturnAndRefunds";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveReturnAndRefunds";
            data.WidgetTitle = "SaveReturnAndRefunds";

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

        public async Task<WSEditReturn> SaveUnblockOrder(ReturnRefundData data, bool? isDeleted)
        {
            data.MethodName = "SpCallB01BlockedOrders";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveUnblockOrder";
            data.WidgetTitle = "Save/Delete UnblockOrder";

            if (isDeleted == true)
            {
                data.Object = "SaveDeleteOrder";//DeleteOrder
            }

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

        public async Task<WSEditReturn> SaveDeleteOrder(ReturnRefundData data)
        {
            data.MethodName = "SpCallB01BlockedOrders";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveDeleteOrder";
            data.WidgetTitle = "Save Delete Order";

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
    }
}
