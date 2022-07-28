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
        public async Task<object> GetStockCorrection(Data data)
        {
            data.MethodName = "SpAppB00StockCorrection";
            data.Object = "GetStockCorrection";

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

        public async Task<object> GetWarehouseArticle(StockCorrectionData data)
        {
            data.MethodName = "SpAppB00StockCorrection";
            data.Object = "GetWarehouseArticle";

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

        public async Task<WSEditReturn> SaveStockCorrection(StockCorrectionData data)
        {
            data.MethodName = "SpCallB00StockCorrection";
            data.GUID = Guid.NewGuid().ToString();
            data.Object = "SaveStockCorrection";

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

        public Task<WSEditReturn> SaveGoodsReceiptPosted(GoodsReceiptPostedData data)
        {
            return SaveData(data, "SpCallWarehouseMovement", "SaveGoodsReceiptPosted");
        }

        public Task<WSEditReturn> ConfirmGoodsReceiptPosted(ConfirmGoodsReceiptPostedData data)
        {
            return SaveData(data, "SpCallWarehouseMovement", "ConfirmGoodsReceiptPosted");
        }
    }
}
