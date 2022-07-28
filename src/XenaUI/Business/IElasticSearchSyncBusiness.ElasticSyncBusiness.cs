using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;
using System;
using XenaUI.Utils.ElasticSearch;
using System.Linq;
using MoreLinq;
using Nest;

namespace XenaUI.Business
{
    /// <summary>
    /// ElasticSearchSyncBusiness
    /// </summary>
    public class ElasticSearchSyncBusiness : BaseBusiness, IElasticSearchSyncBusiness
    {
        private readonly IElasticSearchSyncService _elasticSearchService;
        private IElasticSearchClientHelper _elasticSearchClientHelper;
        private readonly INotificationService _notificationService;
        private string ElasticSearchServiceUrl;

        public ElasticSearchSyncBusiness(IHttpContextAccessor context, IElasticSearchSyncService elasticSearchService, INotificationService notificationService, IAppServerSetting appServerSetting) : base(context)
        {
            _elasticSearchService = elasticSearchService;
            _notificationService = notificationService;

            ElasticSearchServiceUrl = appServerSetting.ServerConfig.ServerSetting.ElasticSearchServiceUrl;
            _elasticSearchClientHelper = new ElasticSearchClientHelper
            {
                IdApplicationOwner = this.UserFromService.IdApplicationOwner,
                EsUri = ElasticSearchServiceUrl
            };
        }

        #region Get
        /// <summary>
        /// GetCustomerOrders
        /// </summary>
        /// <param name="idSalesOrder"></param>
        /// <returns></returns>
        private async Task<EsSaleOrder> GetCustomerOrders(string idSalesOrder)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.KeyId = idSalesOrder;
            var result = await _elasticSearchService.GetCustomerOrders(data);
            return result != null ? result.FirstOrDefault() : null;
        }

        /// <summary>
        /// GetCustomerOrdersByDate
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private async Task<IList<EsSaleOrder>> GetCustomerOrdersByDate(DateTime date)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetCustomerOrders(data);
            return result;
        }

        /// <summary>
        /// GetBusinessCosts
        /// </summary>
        /// <param name="idBusinessCosts"></param>
        /// <returns></returns>
        private async Task<EsBusinessCost> GetBusinessCosts(string idBusinessCosts)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.KeyId = idBusinessCosts;
            var result = await _elasticSearchService.GetBusinessCosts(data);
            return result != null ? result.FirstOrDefault() : null;
        }

        /// <summary>
        /// GetBusinessCostsListByDate
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private async Task<IList<EsBusinessCost>> GetBusinessCostsListByDate(DateTime date)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetBusinessCosts(data);
            return result;
        }

        /// <summary>
        /// GetCampaign
        /// </summary>
        /// <param name="idSalesCampaignWizard"></param>
        /// <returns></returns>
        private async Task<EsCampaign> GetCampaign(string idSalesCampaignWizard)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.KeyId = idSalesCampaignWizard;
            var result = await _elasticSearchService.GetCampaign(data);
            return result != null ? result.FirstOrDefault() : null;
        }

        /// <summary>
        /// GetCampaignListByDate
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private async Task<IList<EsCampaign>> GetCampaignListByDate(DateTime date)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetCampaign(data);
            return result;
        }

        /// <summary>
        /// GetArticle
        /// </summary>
        /// <param name="idArticle"></param>
        /// <returns></returns>
        private async Task<EsArticle> GetArticle(string idArticle)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.KeyId = idArticle;
            var result = await _elasticSearchService.GetArticle(data);
            return result != null ? result.FirstOrDefault() : null;
        }

        /// <summary>
        /// GetArticleListByDate
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        private async Task<IList<EsArticle>> GetArticleListByDate(DateTime date)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetArticle(data);
            return result;
        }

        /// <summary>
        /// GetPerson
        /// </summary>
        /// <param name="idPerson"></param>
        /// <returns></returns>
        private async Task<EsPerson> GetPerson(string idPerson)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.KeyId = idPerson;
            var result = await _elasticSearchService.GetPerson(data);
            return result != null ? result.FirstOrDefault() : null;
        }

        /// <summary>
        /// GetPersonListByDate
        /// </summary>
        /// <param name="idPerson"></param>
        /// <returns></returns>
        private async Task<IList<EsPerson>> GetPersonListByDate(DateTime date)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetPerson(data);
            return result;
        }

        /// <summary>
        /// GetPersonListByPersonTypeAndDate
        /// </summary>
        /// <param name="date"></param>
        /// <param name="idPersonType"></param>
        /// <returns></returns>
        private async Task<IList<EsPerson>> GetPersonListByPersonTypeAndDate(DateTime date, int idPersonType)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.IdPersonType = idPersonType;
            data.StartDate = date.ToString("yyyy-MM-dd");
            var result = await _elasticSearchService.GetPerson(data);
            return result;
        }
        #endregion

        #region Sync
        /// <summary>
        /// SyncCustomerOrdersToElasticSearch
        /// </summary>
        /// <param name="idSalesOrder"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncCustomerOrdersToElasticSearch(string idSalesOrder, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                EsSaleOrder customerOrder = await GetCustomerOrders(idSalesOrder);
                if (customerOrder == null)
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "orders";
                }
                _elasticSearchClientHelper.CreateClient<EsSaleOrder>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsSaleOrder> { customerOrder }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncCustomerOrdersToElasticSearchByStartDate
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncCustomerOrdersToElasticSearchByStartDate(DateTime startDate, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                IList<EsSaleOrder> customerOrders = await GetCustomerOrdersByDate(startDate);
                if (customerOrders == null || !customerOrders.Any())
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "orders";
                }
                _elasticSearchClientHelper.CreateClient<EsSaleOrder>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(customerOrders, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncBusinessCostsToElasticSearch
        /// </summary>
        /// <returns></returns>
        public async void SyncBusinessCostsToElasticSearch(string idBusinessCosts, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                EsBusinessCost businessCost = await GetBusinessCosts(idBusinessCosts);
                if (businessCost == null)
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "businesscosts";
                }
                _elasticSearchClientHelper.CreateClient<EsBusinessCost>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsBusinessCost> { businessCost }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncBusinessCostsToElasticSearchByStartDate
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncBusinessCostsToElasticSearchByStartDate(DateTime startDate, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                IList<EsBusinessCost> result = await GetBusinessCostsListByDate(startDate);
                if (result == null || !result.Any())
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "businesscosts";
                }
                _elasticSearchClientHelper.CreateClient<EsBusinessCost>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(result, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncCampaignToElasticSearch
        /// </summary>
        /// <param name="idSalesCampaignWizard"></param>
        public async void SyncCampaignToElasticSearch(string idSalesCampaignWizard, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                EsCampaign result = await GetCampaign(idSalesCampaignWizard);
                if (result == null)
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "campaign";
                }
                _elasticSearchClientHelper.CreateClient<EsCampaign>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsCampaign> { result }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncCampaignToElasticSearchByStartDate
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncCampaignToElasticSearchByStartDate(DateTime startDate, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                IList<EsCampaign> result = await GetCampaignListByDate(startDate);
                if (result == null || !result.Any())
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "campaign";
                }
                _elasticSearchClientHelper.CreateClient<EsCampaign>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(result, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncArticleToElasticSearch
        /// </summary>
        /// <param name="idArticle"></param>
        public async void SyncArticleToElasticSearch(string idArticle, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                EsArticle result = await GetArticle(idArticle);
                if (result == null)
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "article";
                }
                _elasticSearchClientHelper.CreateClient<EsArticle>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsArticle> { result }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncArticleToElasticSearchByStartDate
        /// </summary>
        /// <param name="startDate"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncArticleToElasticSearchByStartDate(DateTime startDate, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                IList<EsArticle> result = await GetArticleListByDate(startDate);
                if (result == null || !result.Any())
                {
                    return true;
                }
                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                {
                    searchIndexKey = "article";
                }
                _elasticSearchClientHelper.CreateClient<EsArticle>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(result, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncPersonToElasticSearch
        /// </summary>
        /// <param name="idPerson"></param>
        public async void SyncPersonToElasticSearch(string idPerson, string searchIndexKey)
        {
            await Execute(async () =>
            {
                EsPerson result = await GetPerson(idPerson);
                if (result == null)
                {
                    return true;
                }
                // Sync to  elastic search
                _elasticSearchClientHelper.CreateClient<EsPerson>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsPerson> { result }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncPersonToElasticSearchByStartDate
        /// </summary>
        /// <param name="idPerson"></param>
        public async void SyncPersonToElasticSearchByStartDate(DateTime startDate, string searchIndexKey)
        {
            await Execute(async () =>
            {
                IList<EsPerson> result = new List<EsPerson>();
                PersonTypeMode personType = Common.GetPersonTypeFromIndexKey(searchIndexKey);
                if (personType != PersonTypeMode.None)
                {
                    result = await GetPersonListByPersonTypeAndDate(startDate, (int)personType);
                }
                if (result == null || !result.Any())
                {
                    return true;
                }
                // Sync to  elastic search
                _elasticSearchClientHelper.CreateClient<EsPerson>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(result, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncToElasticSearch
        /// </summary>
        /// <param name="module"></param>
        public void SyncToElasticSearch(GlobalModule module)
        {
            if (module.IdSettingsGUI == (int)ModuleType.Customer ||
                module.IdSettingsGUIParent == (int)ModuleType.Administration)
            {
                if (!string.IsNullOrWhiteSpace(module.SearchIndexKey))
                {
                    SyncPersonToElasticSearchByStartDate(DateTime.Today, module.SearchIndexKey);
                }
            }
            else if (module.IdSettingsGUI == (int)ModuleType.Article)
            {
                SyncArticleToElasticSearchByStartDate(DateTime.Today, module.SearchIndexKey);
            }
            else if (module.IdSettingsGUI == (int)ModuleType.Campaign)
            {
                SyncCampaignToElasticSearchByStartDate(DateTime.Today, module.SearchIndexKey);
            }
            else if (module.IdSettingsGUI == (int)ModuleType.CampagneCosts)
            {
                SyncBusinessCostsToElasticSearchByStartDate(DateTime.Today, module.SearchIndexKey);
            }
            else if (module.IdSettingsGUI == (int)ModuleType.Orders)
            {
                SyncCustomerOrdersToElasticSearchByStartDate(DateTime.Today, module.SearchIndexKey);
            }
        }
        #endregion

        #region Notification
        /// <summary>
        /// GetNotification
        /// </summary>
        /// <param name="idSalesCampaignWizard"></param>
        /// <returns></returns>
        private async Task<EsNotification> GetNotification(string idNotification)
        {
            NotificationGetData data = (NotificationGetData)ServiceDataRequest.ConvertToRelatedType(typeof(NotificationGetData));
            data.IdNotification = long.Parse(idNotification);
            var result = await _notificationService.GetNotifications(data);

            if (result.Data != null && result.Data.Count >= 2)
            {
                var list = result.Data[1].ToObject<List<EsNotification>>();
                if (list.Count == 0) return null;

                var item = list[0];
                try
                {
                    item.Comment = string.Join(" , ", list.Select(n => n.Comment));
                }
                catch { }

                item.IdApplicationOwner = int.Parse(data.IdApplicationOwner);
                return item;
            }

            return null;
        }

        /// <summary>
        /// SyncNotificationToElasticSearch
        /// </summary>
        /// <param name="idNotification"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncNotificationToElasticSearch(string idNotification, string searchIndexKey = null)
        {
            await Execute(async () =>
            {
                EsNotification result = await GetNotification(idNotification);
                if (result == null) return true;

                // Sync to  elastic search
                if (string.IsNullOrWhiteSpace(searchIndexKey))
                    searchIndexKey = "notification";

                _elasticSearchClientHelper.CreateClient<EsNotification>(searchIndexKey, isAutoMap: true);
                _elasticSearchClientHelper.IndexAll(new List<EsNotification> { result }, isBulkAll: true);
                return true;
            });
        }

        /// <summary>
        /// SyncArchivedNotificationToElasticSearch
        /// </summary>
        /// <param name="listArchivedNotifications"></param>
        /// <param name="searchIndexKey"></param>
        public async void SyncArchivedNotificationToElasticSearch(IEnumerable<EsArchivedNotification> listArchivedNotifications, string searchIndexKey = null)
        {
            await Execute(async () =>
           {
               await Task.Yield();
               if (listArchivedNotifications == null || listArchivedNotifications.Count() == 0) return true;

               // Sync to  elastic search
               if (string.IsNullOrWhiteSpace(searchIndexKey))
                   searchIndexKey = "notification";

               _elasticSearchClientHelper.CreateClient<EsNotification>(searchIndexKey, isAutoMap: true);

               foreach (var archivedNotification in listArchivedNotifications)
               {
                   _elasticSearchClientHelper.Update<EsNotification, EsArchivedNotification>(archivedNotification, archivedNotification.Id);
               }

               return true;
           });
        }
        #endregion

        #region Sync New
        private async Task<IEnumerable<dynamic>> GetData(ElasticSyncModel model)
        {
            ElasticSyncData data = (ElasticSyncData)ServiceDataRequest.ConvertToRelatedType(typeof(ElasticSyncData));
            data.Object = model.Object;
            data.KeyId = model.KeyId;

            if (model.StartDate.HasValue)
                data.StartDate = model.StartDate.Value.ToString("yyyy-MM-dd");

            if (model.IdPersonType.HasValue)
                data.IdPersonType = model.IdPersonType;

            var result = await _elasticSearchService.GetData(data);
            return result;
        }

        public async void SyncToElasticSearch(ElasticSyncModel model)
        {
            //Only sync from Queue (windows service)
            await Task.FromResult(true);

            //await Execute(async () =>
            //{
            //    ElasticSearchModule elasticSearchModule = null;
            //    if (model.GlobalModule != null)
            //    {
            //        model.StartDate = DateTime.Today;

            //        //Person Modules
            //        if (model.GlobalModule.IdSettingsGUI == (int)ModuleType.Customer ||
            //            model.GlobalModule.IdSettingsGUIParent == (int)ModuleType.Administration)
            //        {
            //            elasticSearchModule = ElasticSearchModuleData.GetModule(model.GlobalModule.SearchIndexKey);

            //            PersonTypeMode? personType = elasticSearchModule != null ? elasticSearchModule.PersonType : null;
            //            if (personType != null && personType != PersonTypeMode.None)
            //            {
            //                model.IdPersonType = (int)personType;
            //            }
            //        }
            //        else//Other Modules
            //        {
            //            model.ModuleType = (ModuleType)Enum.Parse(typeof(ModuleType), model.GlobalModule.IdSettingsGUI.ToString());

            //            elasticSearchModule = ElasticSearchModuleData.GetModule(model.ModuleType.Value);
            //        }
            //    }
            //    else
            //    {
            //        if (model.ModuleType.HasValue)
            //        {
            //            elasticSearchModule = ElasticSearchModuleData.GetModule(model.ModuleType.Value);
            //        }
            //        else if (!string.IsNullOrWhiteSpace(model.SearchIndexKey))
            //        {
            //            elasticSearchModule = ElasticSearchModuleData.GetModule(model.SearchIndexKey);
            //        }
            //    }

            //    //if not found: SearchIndexName or Object -> do nothing
            //    if (elasticSearchModule == null) return false;

            //    model.Object = elasticSearchModule.Object;
            //    var data = await GetData(model);
            //    if (data == null) return false;

            //    //Should instantiate here
            //    var esClientHelper = new ElasticSearchClientHelper
            //    {
            //        IdApplicationOwner = this.UserFromService.IdApplicationOwner,
            //        EsUri = ElasticSearchServiceUrl
            //    };

            //    esClientHelper.CreateClient<dynamic>(elasticSearchModule.SearchIndexName, elasticSearchModule.DefaultTypeName);

            //    IBulkResponse bulkResponse;
            //    switch (elasticSearchModule.ModuleType)
            //    {
            //        case ModuleType.Campaign_MediaCode://Only index Campaign MediaCode
            //            esClientHelper.CreateIndexWithParentChildRelationShip(elasticSearchModule.DefaultTypeName, elasticSearchModule.ChildTypeName);//"campaign", "mediacode"
            //            bulkResponse = esClientHelper.IndexAllWithParentChildRelationShip(data, elasticSearchModule.DefaultTypeName, elasticSearchModule.ChildTypeName, "idSalesCampaignWizard");
            //            break;
            //        //When creating order (ODE) successfully. In a store create order, we create queue to index customer. So don't need this code
            //        //case ModuleType.Orders:
            //        //    #region Sync for Order
            //        //    bulkResponse = esClientHelper.IndexAll(data);

            //        //    if (bulkResponse.IsValid && bulkResponse.Errors == false && data.Any())
            //        //    {
            //        //        #region Sync Customer
            //        //        var idPersons = data.Where(n => !string.IsNullOrEmpty(n.idPerson)).Select(n => n.idPerson).Distinct().ToList();
            //        //        if (idPersons.Count > 0)
            //        //        {
            //        //            var elasticSearchModuleCustomer = ElasticSearchModuleData.GetModule(ModuleType.Customer);
            //        //            esClientHelper.CreateClient<dynamic>(elasticSearchModuleCustomer.SearchIndexName, elasticSearchModuleCustomer.DefaultTypeName);

            //        //            foreach (var idPerson in idPersons)
            //        //            {
            //        //                var dataCustomer = await GetData(new ElasticSyncModel
            //        //                {
            //        //                    Object = elasticSearchModuleCustomer.Object,
            //        //                    KeyId = idPerson
            //        //                });
            //        //                if (dataCustomer == null) continue;

            //        //                bulkResponse = esClientHelper.IndexAll(dataCustomer);
            //        //            }//for
            //        //        }
            //        //        #endregion
            //        //    }
            //        //    #endregion
            //        //    break;
            //        default:
            //            // Sync to  elastic search
            //            bulkResponse = esClientHelper.IndexAll(data);
            //            break;
            //    }

            //    if (bulkResponse == null || !bulkResponse.IsValid || bulkResponse.Errors)
            //    {
            //        //write log
            //        return false;
            //    }

            //    return true;
            //});
        }
        #endregion
    }
}
