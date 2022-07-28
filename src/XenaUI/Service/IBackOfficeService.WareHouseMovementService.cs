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
        public Task<object> GetWarehouseMovement(Data data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppB00WarehouseMovement", "GetWarehouseMovement");
        }

        public Task<object> GetWarehouseMovementForPdf(Data data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppB00WarehouseMovement", "GetWarehouseMovementForPdf");
        }

        public Task<object> GetWarehouseMovementCosts(WareHouseMovementData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppB00WarehouseMovement", "GetWarehouseMovementCosts");
        }

        public async Task<object> GetWarehouseMovementById(WareHouseMovementData data)
        {
            data.MethodName = "SpAppB00WarehouseMovement";
            data.Object = "GetWarehouseMovementById";

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
            expectedReturn.Add(1, typeof(WareHouseMovementInfoModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType3))[1];
            return response != null ? ((IList<WareHouseMovementInfoModel>)response).FirstOrDefault() : null;
        }

        public Task<object> GetArrivedArticles(WareHouseMovementSortingGoodsData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWg002WarehouseMovement", "SortingGoods");
        }

        public Task<object> GetSelectedArticles(WareHouseMovementSortingGoodsData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWg002WarehouseMovement", "MovedArticles");
        }

        public Task<object> StockedArticles(WareHouseMovementStockedArticlesData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWg002WarehouseMovement", "StockedArticles");
        }

        public Task<object> SearchArticles(WareHouseMovementSearchArticleData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWg002WarehouseMovement", "SearchArticles");
        }

        public Task<WSEditReturn> SaveWarehouseMovement(WareHouseMovementData data)
        {
            return SaveData(data, "SpCallWarehouseMovement", "SaveWarehouseMovement");
        }
    }
}


