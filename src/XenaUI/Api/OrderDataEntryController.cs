using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    /// <summary>
    /// OrderDataEntryController
    /// </summary>
    [Route("api/[controller]")]
    [Authorize]
    public class OrderDataEntryController : BaseController
    {
        private readonly IOrderDataEntryBusiness _orderDataEntryBusiness;
        private readonly IOrderFailedBusiness _orderFailedBusiness;

        public OrderDataEntryController(IOrderDataEntryBusiness orderDataEntryBusiness, IOrderFailedBusiness orderFailedBusiness)
        {
            _orderDataEntryBusiness = orderDataEntryBusiness;
            _orderFailedBusiness = orderFailedBusiness;
        }

        // GET: api/OrderDataEntry/GetMainCurrencyAndPaymentType
        [HttpGet]
        [Route("GetMainCurrencyAndPaymentType")]
        public async Task<object> GetMainCurrencyAndPaymentType(string mediacode, string campaignNr)
        {
            return await _orderDataEntryBusiness.GetMainCurrencyAndPaymentType(mediacode, campaignNr);
        }

        // GET: api/OrderDataEntry/GetMainCurrencyAndPaymentTypeForOrder
        [HttpGet]
        [Route("GetMainCurrencyAndPaymentTypeForOrder")]
        public async Task<object> GetMainCurrencyAndPaymentTypeForOrder(string mediacode, string campaignNr)
        {
            return await _orderDataEntryBusiness.GetMainCurrencyAndPaymentTypeForOrder(mediacode, campaignNr);
        }

        // GET: api/OrderDataEntry/GetArticleData
        [HttpGet]
        [Route("GetArticleData")]
        public async Task<object> GetArticleData(string mediacode)
        {
            var result = _orderDataEntryBusiness.GetArticleData(mediacode);

            return await result;
        }

        // GET: api/OrderDataEntry/GetCustomerData
        [HttpGet]
        [Route("GetCustomerData")]
        public async Task<object> GetCustomerData(string customerNr, string mediaCode)
        {
            var result = _orderDataEntryBusiness.GetCustomerData(customerNr, mediaCode);

            return await result;
        }

        // GET: api/OrderDataEntry/GetPreloadOrderData
        [HttpGet]
        [Route("GetPreloadOrderData")]
        public async Task<object> GetPreloadOrderData(string mode, int? skipIdPreload, int? idScansContainerItems, int? lotId)
        {
            var result = _orderDataEntryBusiness.GetPreloadOrderData(mode, skipIdPreload, idScansContainerItems, lotId);

            return await result;
        }

        // GET: api/OrderDataEntry/OrderDataEntryByLogin
        [HttpGet]
        [Route("OrderDataEntryByLogin")]
        public async Task<object> OrderDataEntryByLogin(string mode, string dateFrom, string dateTo)
        {
            return await _orderDataEntryBusiness.OrderDataEntryByLogin(mode, dateFrom, dateTo);
        }

        // GET: api/OrderDataEntry/TotalDataEntryByLogin
        [HttpGet]
        [Route("TotalDataEntryByLogin")]
        public async Task<object> TotalDataEntryByLogin()
        {
            return await _orderDataEntryBusiness.TotalDataEntryByLogin();
        }

        // POST: api/OrderDataEntry/CreateLotName
        [HttpPost]
        [Route("CreateLotName")]
        public async Task<object> CreateLotName([FromBody]LotData model)
        {
            var result = _orderDataEntryBusiness.CreateLotName(model);

            return await result;
        }

        // GET: api/OrderDataEntry/DeleteLot
        [HttpGet]
        [Route("DeleteLot")]
        public async Task<object> DeleteLot(string lotId)
        {
            return await _orderDataEntryBusiness.DeleteLot(lotId);
        }


        // GET: api/OrderDataEntry/DeleteLotItem
        [HttpGet]
        [Route("DeleteLotItem")]
        public async Task<object> DeleteLotItem(string idScansContainerItems)
        {
            return await _orderDataEntryBusiness.DeleteLotItem(idScansContainerItems);
        }

        // POST: api/OrderDataEntry/SaveScanningOrder
        [HttpPost]
        [Route("SaveScanningOrder")]
        public async Task<object> SaveScanningOrder([FromBody]ScanningLotItemData model)
        {
            var result = _orderDataEntryBusiness.SaveScanningOrder(model);

            return await result;
        }


        // POST: api/OrderDataEntry/CloseLotScanningTool
        [HttpPost]
        [Route("CloseLotScanningTool")]
        public async Task<object> CloseLotScanningTool([FromBody] LotData model)
        {
            var result = _orderDataEntryBusiness.CloseLotScanningTool(model);

            return await result;
        }

        // POST: api/OrderDataEntry/SaveOrderDataEntry
        [HttpPost]
        [Route("SaveOrderDataEntry")]
        public async Task<object> SaveOrderDataEntry([FromBody]OrderDataEntryCustomerForSaveModel model)
        {
            var result = _orderDataEntryBusiness.SaveOrderDataEntryData(model);

            return await result;
        }

        [HttpPost]
        [Route("DeleteOrderDataEntry")]
        public async Task<object> DeleteOrderDataEntry([FromBody] Dictionary<string,object> model)
        {
            var result = _orderDataEntryBusiness.DeleteOrderDataEntryData(model);

            return await result;
        }

        // POST: api/OrderDataEntry/SavePaymentForOrder
        [HttpPost]
        [Route("SavePaymentForOrder")]
        public async Task<object> SavePaymentForOrder([FromBody]OrderDataEntryCustomerForSaveModel model)
        {
            var result = _orderDataEntryBusiness.SavePaymentForOrder(model);

            return await result;
        }

        // POST: api/OrderDataEntry/SendOrderToAdministrator
        [HttpPost]
        [Route("SendOrderToAdministrator")]
        public async Task<object> SendOrderToAdministrator([FromBody]SendOrderToAdministratorData model)
        {
            var result = _orderDataEntryBusiness.SendOrderToAdministrator(model);
            return await result;
        }

        #region OrderFailed
        [HttpGet]
        [Route("GetOrderFailed")]
        public async Task<object> GetOrderFailed(string tabID, string idScansContainerItems)
        {
            return await _orderFailedBusiness.GetOrder(tabID, idScansContainerItems);
        }

        [HttpPost]
        [Route("SaveOrderFailed")]
        public async Task<object> SaveOrderFailed([FromBody]OrderFailedSaveModel model)
        {
            await _orderFailedBusiness.SaveOrder(model);

            return await Task.FromResult(new { Success = true });
        }

        [HttpPost]
        [Route("DeleteOrderFailed")]
        public async Task<object> DeleteOrderFailed([FromBody]OrderFailedDeleteModel model)
        {
            await _orderFailedBusiness.DeleteOrder(model.TabID, model.IdScansContainerItems);

            return await Task.FromResult(new { Success = true });
        }

        [HttpPost]
        [Route("DeleteAllOrderFailed")]
        public async Task<object> DeleteAllOrderFailed([FromBody]OrderFailedDeleteAllModel model)
        {
            await _orderFailedBusiness.DeleteAllOrders(model.TabID);

            return await Task.FromResult(new { Success = true });
        }

        [HttpGet]
        [Route("GetListOrderFailed")]
        public async Task<object> GetListOrderFailed(string tabID, int pageIndex = 0, int pageSize = 20, bool isGetSummaryFile = true)
        {
            if (isGetSummaryFile)
                return await _orderFailedBusiness.GetListParkedItemOrders(tabID, pageIndex, pageSize);

            return await _orderFailedBusiness.GetListOrders(tabID, pageIndex, pageSize);
        }
        #endregion

        [HttpGet]
        [Route("GetRejectPayments")]
        public async Task<object> GetRejectPayments(string idPerson)
        {
            return await _orderDataEntryBusiness.GetRejectPayments(idPerson);
        }

        [HttpGet]
        [Route("GetSalesOrderById")]
        public async Task<object> GetSalesOrderById(string idSalesOrder)
        {
            return await _orderDataEntryBusiness.GetSalesOrderById(idSalesOrder);
        }
    }
}
