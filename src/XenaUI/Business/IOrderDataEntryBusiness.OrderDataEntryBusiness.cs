using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public class OrderDataEntryBusiness : BaseBusiness, IOrderDataEntryBusiness
    {
        private readonly IOrderDataEntryService _orderDataEntryService;
        private readonly IElasticSearchSyncBusiness _elasticSearchSyncBusiness;
        private readonly ICommonService _commonService;
        private readonly IShipmentBusiness _shipmentBusiness;
        private readonly AppSettings _appSettings;
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(Assembly.GetEntryAssembly(), "api");

        public OrderDataEntryBusiness(IHttpContextAccessor context, IOrderDataEntryService orderDataEntryService,
                              IElasticSearchSyncBusiness elasticSearchSyncBusiness, ICommonService commonService, IOptions<AppSettings> appSettings,
                              IShipmentBusiness shipmentBusiness) : base(context)
        {
            _orderDataEntryService = orderDataEntryService;
            _elasticSearchSyncBusiness = elasticSearchSyncBusiness;
            _commonService = commonService;
            _shipmentBusiness = shipmentBusiness;
            _appSettings = appSettings.Value;
        }

        public async Task<object> GetMainCurrencyAndPaymentType(string mediacode, string campaignNr)
        {
            OrderDataEntryData data = (OrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryData));
            data.MediaCode = mediacode;
            data.CampaignNr = campaignNr;
            var result = await _orderDataEntryService.GetMainCurrencyAndPaymentType(data);
            return result;
        }

        public async Task<object> GetMainCurrencyAndPaymentTypeForOrder(string mediacode, string campaignNr)
        {
            OrderDataEntryData data = (OrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryData));
            data.MediaCode = mediacode;
            data.CampaignNr = campaignNr;
            var result = await _orderDataEntryService.GetMainCurrencyAndPaymentTypeForOrder(data);
            return result;
        }

        public async Task<object> GetArticleData(string mediacode)
        {
            OrderDataEntryData data = (OrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryData));
            data.MediaCode = mediacode;
            var result = await _orderDataEntryService.GetArticleData(data);
            return result;
        }

        public async Task<OrderDataEntryCustomerModel> GetCustomerData(string customerNr, string mediaCode)
        {
            OrderDataEntryData data = (OrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryData));
            data.CustomerNr = customerNr;
            if(!string.IsNullOrWhiteSpace(mediaCode))
            {
                data.MediaCode = mediaCode;
            }            
            var result = await _orderDataEntryService.GetCustomerData(data);
            return result;
        }

        public async Task<object> GetPreloadOrderData(string mode, int? skipIdPreload, int? idScansContainerItems, int? lotId)
        {
            OrderDataEntryData data = (OrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryData));
            data.GUID = UserFromService.UserGuid;

            if (!string.IsNullOrEmpty(mode))
                data.Mode = mode;

            if (skipIdPreload != null)
                data.SkipIdScansContainerItemsPreload = skipIdPreload.ToString();

            if (idScansContainerItems.HasValue)
                data.IdScansContainerItems = idScansContainerItems.ToString();

            if (lotId.HasValue)
                data.IdScansContainer = lotId.ToString();

            var result = await _orderDataEntryService.GetPreloadOrderData(data);
            return result;
        }

        public async Task<object> OrderDataEntryByLogin(string mode, string dateFrom, string dateTo)
        {
            OrderDataEntryByLoginData data = (OrderDataEntryByLoginData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryByLoginData));
            data.DateFrom = dateFrom;
            data.DateTo = dateTo;
            data.Mode = mode;
            var result = await _orderDataEntryService.OrderDataEntryByLogin(data);
            return result;
        }

        public async Task<object> TotalDataEntryByLogin()
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            var result = await _orderDataEntryService.TotalDataEntryByLogin(data);
            return result;
        }

        /// <summary>
        /// DeleteLot
        /// </summary>
        /// <param name="lotId"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> DeleteLot(string lotId)
        {
            LotData data = (LotData)ServiceDataRequest.ConvertToRelatedType(typeof(LotData));
            data.IdScansContainer = lotId;
            var result = await _orderDataEntryService.DeleteLot(data);
            return result;
        }

        /// <summary>
        /// DeleteLotItem
        /// </summary>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> DeleteLotItem(string idScansContainerItems)
        {
            ScanningLotItemData data = (ScanningLotItemData)ServiceDataRequest.ConvertToRelatedType(typeof(ScanningLotItemData));
            data.IdScansContainerItems = idScansContainerItems;
            var result = await _orderDataEntryService.DeleteLotItem(data);
            return result;
        }

        public async Task<WSEditReturn> CreateLotName(LotData model)
        {
            LotData data = (LotData)ServiceDataRequest.ConvertToRelatedType(typeof(LotData), model);
            var result = await _orderDataEntryService.CreateLotName(data);
            return result;
        }

        public async Task<WSEditReturn> SaveScanningOrder(ScanningLotItemData model)
        {
            ScanningLotItemData data = (ScanningLotItemData)ServiceDataRequest.ConvertToRelatedType(typeof(ScanningLotItemData), model);
            var result = await _orderDataEntryService.SaveScanningOrder(data);
            return result;
        }

        public async Task<WSEditReturn> CloseLotScanningTool(LotData model)
        {
            LotData data = (LotData)ServiceDataRequest.ConvertToRelatedType(typeof(LotData), model);
            var result = await _orderDataEntryService.CloseLotScanningTool(data);
            return result;
        }

        public async Task<object> SaveOrderDataEntryData(OrderDataEntryCustomerForSaveModel model)
        {
            _logger.Debug("start SaveOrderDataEntryData ");
            var rs = await SavePaymentData(model, "SaveCustomerOrder");
            if (rs == null)
            {
                return rs;
            }
            WSEditReturn rsUpdate = (WSEditReturn)rs;
            if (rsUpdate.ReturnID == "-1") return rs;

            Dictionary<string, object> result = new Dictionary<string, object>();
            Dictionary<string, object> rsSaveOrder = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(rsUpdate));
            result.Add("resultSaveOrder", rsSaveOrder);


            _logger.Debug("SaveOrderDataEntryData resultSaving: " + rsUpdate.ReturnID + "       request IdSalesOrder: " + model.IdSalesOrder);

            if (_appSettings.ColissimoConfig != null) {
                /** call Colissimo shipment for case CREATE Order **/
                if (string.IsNullOrEmpty(model.IdSalesOrder) && model.Orders.Count > 0 && !model.Orders.First().IdSalesOrder.HasValue && model.Orders.First().IdRepSalesOrderShipper.HasValue)
                {
                    if (int.Parse(model.Orders.First().IdRepSalesOrderShipper.ToString()) == EShipper.Colissimo)
                    {
                        var resultShipment = await _shipmentBusiness.ProcessRequestShipment(rsUpdate.ReturnID, null);
                        Dictionary<string, object> rsSM = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(resultShipment));
                        //rsSaveOrder.Add("resultShipment", rsSM);
                        rsUpdate.resultShipment = rsSM;
                    }
                }
            }
            _logger.Debug("end SaveOrderDataEntryData ");
            return rsUpdate;
        }

        public async Task<object> DeleteOrderDataEntryData(Dictionary<string, object> data)
        {
            var spObject = "DeleteScanningItem";
            var spMethodName = "SpCallScanningOrdersEntry";
            if (string.IsNullOrEmpty(spObject) || string.IsNullOrEmpty(spMethodName))
            {
                throw new Exception("Data invalid");
            }
            Data baseData = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            SaveDynamicData saveData = new SaveDynamicData
            {
                BaseData = baseData,
                Data = data,
                IgnoredKeys = new List<string>() { "SpObject", "SpMethodName" },
                SpMethodName = spMethodName,
                SpObject = spObject
            };

            List<string> ignoredKeys = data.GetValue("IgnoredKeys") as List<string>;
            if (ignoredKeys != null && ignoredKeys.Count > 0)
            {
                saveData.IgnoredKeys.AddRange(ignoredKeys);
            }
            saveData.IgnoredKeys = saveData.IgnoredKeys.Distinct().ToList();

            var result = await _commonService.CallBackToDBByDynamicSP(saveData);
            return result;
        }

        public async Task<object> SavePaymentForOrder(OrderDataEntryCustomerForSaveModel model)
        {
            return await SavePaymentData(model, "ManualInvoicePayment");
        }

        private async Task<object> SavePaymentData(OrderDataEntryCustomerForSaveModel model, string objectName) {
            CustomerOrderDataEntryData data = (CustomerOrderDataEntryData)ServiceDataRequest.ConvertToRelatedType(typeof(CustomerOrderDataEntryData));
            data.IdSalesOrder = model.IdSalesOrder;
            data.IsLostAmount = model.IsLostAmount;

            if (model.CustomerData != null && model.CustomerData.Count > 0)
            {
                IList<PersonUpdateData> _personData = new List<PersonUpdateData>();
                foreach (var cust in model.CustomerData)
                {
                    _personData.Add((PersonUpdateData)Common.MappModelToData(new PersonUpdateData(), cust));
                }

                var _colPersonJSON = JsonConvert.SerializeObject(_personData,
                                        Newtonsoft.Json.Formatting.None,
                                        new JsonSerializerSettings
                                        {
                                            //Formatting = Formatting.Indented,
                                            NullValueHandling = NullValueHandling.Ignore
                                        });
                data.JSONCustomerData = string.Format(@"""CustomerData"":{0}", _colPersonJSON);
                data.JSONCustomerData = "{" + data.JSONCustomerData + "}";
            }

            if (model.Communications != null && model.Communications.Count > 0)
            {
                var _colCommunicationJSON = JsonConvert.SerializeObject(model.Communications,
                                        Newtonsoft.Json.Formatting.None,
                                        new JsonSerializerSettings
                                        {
                                            //Formatting = Formatting.Indented,
                                            NullValueHandling = NullValueHandling.Ignore
                                        });
                data.JSONCustomerComm = string.Format(@"""Communications"":{0}", _colCommunicationJSON);
                data.JSONCustomerComm = "{" + data.JSONCustomerComm + "}";
            }

            if (model.Orders != null && model.Orders.Count > 0)
            {
                var _colOrderJSON = JsonConvert.SerializeObject(model.Orders,
                                        Newtonsoft.Json.Formatting.None,
                                        new JsonSerializerSettings
                                        {
                                            //Formatting = Formatting.Indented,
                                            NullValueHandling = NullValueHandling.Ignore
                                        });
                data.JSONOrderData = string.Format(@"""OrderData"":{0}", _colOrderJSON);
                data.JSONOrderData = "{" + data.JSONOrderData + "}";
            }

            if (model.OrderArticles != null && model.OrderArticles.Count > 0)
            {
                var _colArticleJSON = JsonConvert.SerializeObject(model.OrderArticles,
                                        Newtonsoft.Json.Formatting.None,
                                        new JsonSerializerSettings
                                        {
                                            //Formatting = Formatting.Indented,
                                            NullValueHandling = NullValueHandling.Ignore
                                        });
                data.JSONOrderArticles = string.Format(@"""JSONOrderArticles"":{0}", _colArticleJSON);
                data.JSONOrderArticles = "{" + data.JSONOrderArticles + "}";
            }

            if (model.OrderPayments != null && model.OrderPayments.Count > 0)
            {
                var _colOrderPaymentsJSON = JsonConvert.SerializeObject(model.OrderPayments,
                                        Newtonsoft.Json.Formatting.None,
                                        new JsonSerializerSettings
                                        {
                                            //Formatting = Formatting.Indented,
                                            NullValueHandling = NullValueHandling.Ignore
                                        });
                data.JSONOrderPayments = string.Format(@"""JSONOrderPayments"":{0}", _colOrderPaymentsJSON);
                data.JSONOrderPayments = "{" + data.JSONOrderPayments + "}";
            }
            if (model.IdPerson > 0)
                data.IdPerson = model.IdPerson.ToString();
            if (!string.IsNullOrEmpty(model.CustomerNr))
                data.CustomerNr = model.CustomerNr.ToString();
            if (model.PaymentConfirm > 0)
                data.PaymentConfirm = model.PaymentConfirm.ToString();


            var result = await _orderDataEntryService.SaveOrderDataEntryData(data, objectName);
            if (!string.IsNullOrWhiteSpace(result.ReturnID))
            {
                _elasticSearchSyncBusiness.SyncToElasticSearch(new ElasticSyncModel
                {
                    ModuleType = ModuleType.Orders,
                    KeyId = result.ReturnID
                });
            }
            return result;
        }

        public async Task<WSEditReturn> SendOrderToAdministrator(SendOrderToAdministratorData model)
        {
            SendOrderToAdministratorData data = (SendOrderToAdministratorData)ServiceDataRequest.ConvertToRelatedType(typeof(SendOrderToAdministratorData), model);
            var result = await _orderDataEntryService.SendOrderToAdministrator(data);
            return result;
        }

        public async Task<object> GetRejectPayments(string idPerson)
        {
            OrderDataEntryGetRejectPaymentsData data = (OrderDataEntryGetRejectPaymentsData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryGetRejectPaymentsData));
            data.IdPerson = idPerson;
            return await _orderDataEntryService.GetRejectPayments(data);
        }

        public async Task<object> GetSalesOrderById(string idSalesOrder)
        {
            OrderDataEntryGetSalesOrderByIdData data = (OrderDataEntryGetSalesOrderByIdData)ServiceDataRequest.ConvertToRelatedType(typeof(OrderDataEntryGetSalesOrderByIdData));
            data.IdSalesOrder = idSalesOrder;
            return await _orderDataEntryService.GetSalesOrderById(data);
        }

        public async Task<object> TestColissimo(string idSaleOrder, Dictionary<string, object> datax)
        {
            return await _shipmentBusiness.ProcessRequestShipment(idSaleOrder, datax);
        }


        public async Task<WSDataReturn> SearchArticleByNumber(string articleNr)
        {
            _logger.Debug("start SearchArticleByNumber ");
            _logger.Info("start SearchArticleByNumber");
            ArticleSearchData data = (ArticleSearchData)ServiceDataRequest.ConvertToRelatedType(typeof(ArticleSearchData));
            data.ArticleNr = articleNr;
            WSDataReturn result = await _orderDataEntryService.SearchArticleByNumber(data);
            _logger.Debug("_logger.Debug result SearchArticleByNumber " + result);
            _logger.Info("_logger.Info result SearchArticleByNumber" + result);
            return result;
        }
    }
}
