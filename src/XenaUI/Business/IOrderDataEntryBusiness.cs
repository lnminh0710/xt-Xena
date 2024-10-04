using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IOrderDataEntryBusiness
    {
        /// <summary>
        /// GetMainCurrencyAndPaymentType
        /// </summary>
        /// <param name="mediacode"></param>
        /// <returns></returns>
        Task<object> GetMainCurrencyAndPaymentType(string mediacode, string campaignNr);

        /// <summary>
        /// GetMainCurrencyAndPaymentTypeForOrder
        /// </summary>
        /// <param name="mediacode"></param>
        /// <param name="campaignNr"></param>
        /// <returns></returns>
        Task<object> GetMainCurrencyAndPaymentTypeForOrder(string mediacode, string campaignNr);

        /// <summary>
        /// GetArticleData
        /// </summary>
        /// <param name="mediacode"></param>
        /// <returns></returns>
        Task<object> GetArticleData(string mediacode);

        /// <summary>
        /// GetCustomerData
        /// </summary>
        /// <param name="customerNr"></param>
        /// <returns></returns>
        Task<OrderDataEntryCustomerModel> GetCustomerData(string customerNr, string mediaCode);

        /// <summary>
        /// GetPreloadOrderData
        /// </summary>
        /// <returns></returns>
        Task<object> GetPreloadOrderData(string mode, int? skipIdPreload, int? idScansContainerItems, int? lotId);

        /// <summary>
        /// OrderDataEntryByLogin
        /// </summary>
        /// <param name="mode"></param>
        /// <param name="dateFrom"></param>
        /// <param name="dateTo"></param>
        /// <returns></returns>
        Task<object> OrderDataEntryByLogin(string mode, string dateFrom, string dateTo);

        /// <summary>
        /// TotalDataEntryByLogin
        /// </summary>        
        /// <returns></returns>
        Task<object> TotalDataEntryByLogin();

        /// <summary>
        /// CreateLotName
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> CreateLotName(LotData model);

        /// <summary>
        /// DeleteLot
        /// </summary>
        /// <param name="lotId"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteLot(string lotId);

        /// <summary>
        /// DeleteLotItem
        /// </summary>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteLotItem(string idScansContainerItems);

        /// <summary>
        /// SaveScanningOrder
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveScanningOrder(ScanningLotItemData model);

        Task<WSEditReturn> CloseLotScanningTool(LotData model); 

        /// <summary>
        /// SaveOrderDataEntryData
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> SaveOrderDataEntryData(OrderDataEntryCustomerForSaveModel model);

        Task<object> DeleteOrderDataEntryData(Dictionary<string,object> model);

        /// <summary>
        /// SavePaymentForOrder
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> SavePaymentForOrder(OrderDataEntryCustomerForSaveModel model);
        
        /// <summary>
        /// SendOrderToAdministrator
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SendOrderToAdministrator(SendOrderToAdministratorData model);

        Task<object> GetRejectPayments(string idPerson);

        Task<object> GetSalesOrderById(string idSalesOrder);

        Task<object> TestColissimo(string idSaleOrder, Dictionary<string, object> model);
        
        Task<WSDataReturn> SearchArticleByNumber(string articleNr);
    }
}

