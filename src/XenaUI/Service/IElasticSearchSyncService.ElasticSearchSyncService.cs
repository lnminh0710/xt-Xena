using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Utils;
using XenaUI.Utils.ElasticSearch;

namespace XenaUI.Service
{
    /// <summary>
    /// ElasticSearchSyncService
    /// </summary>
    public class ElasticSearchSyncService : BaseUniqueServiceRequest, IElasticSearchSyncService
    {
        public ElasticSearchSyncService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting) : base(appSettings, httpContextAccessor, appServerSetting) { }

        /// <summary>
        /// GetCustomerOrders
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<IList<EsSaleOrder>> GetCustomerOrders(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Object = "CustomerOrders";
            data.Mode = "GetData";

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
            expectedReturn.Add(0, typeof(EsSaleOrder));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Normal))[0];
            return response != null ? ((IList<EsSaleOrder>)response) : null;
        }

        /// <summary>
        /// GetBusinessCosts
        /// </summary>
        /// <param name="elasticSyncData"></param>
        /// <returns></returns>
        public async Task<IList<EsBusinessCost>> GetBusinessCosts(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Object = "BusinessCostsSearch";
            data.Mode = "GetData";

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
            expectedReturn.Add(0, typeof(EsBusinessCost));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Normal))[0];
            return response != null ? ((IList<EsBusinessCost>)response) : null;
        }

        /// <summary>
        /// GetCampaign
        /// </summary>
        /// <param name="elasticSyncData"></param>
        /// <returns></returns>
        public async Task<IList<EsCampaign>> GetCampaign(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Object = "CampaignSearch";
            data.Mode = "GetData";

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
            expectedReturn.Add(0, typeof(EsCampaign));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Normal))[0];
            return response != null ? ((IList<EsCampaign>)response) : null;
        }

        /// <summary>
        /// GetArticle
        /// </summary>
        /// <param name="elasticSyncData"></param>
        /// <returns></returns>
        public async Task<IList<EsArticle>> GetArticle(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Object = "ArticleSearch";
            data.Mode = "GetData";

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
            expectedReturn.Add(0, typeof(EsArticle));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Normal))[0];
            return response != null ? ((IList<EsArticle>)response) : null;
        }

        /// <summary>
        /// GetPerson
        /// </summary>
        /// <param name="elasticSyncData"></param>
        /// <returns></returns>
        public async Task<IList<EsPerson>> GetPerson(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Object = "PersonSearch";
            data.Mode = "GetData";

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
            expectedReturn.Add(0, typeof(EsPerson));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.Normal))[0];
            return response != null ? (IList<EsPerson>)response : null;
        }

        public async Task<IEnumerable<dynamic>> GetData(ElasticSyncData data)
        {
            data.MethodName = "SpSyncElasticSearch";
            data.Mode = "GetData";

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
                var array = (JArray)response;
                if (array.Count > 0)
                {
                    var listT = ConverterUtils.ToDynamicEnumerable((JArray)array[0]);

                    return listT;
                }
            }
            return null;
        }
    }
}
