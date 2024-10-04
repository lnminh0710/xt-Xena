using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface IOrderDataEntryService
    {
        /// <summary>
        /// GetMainCurrencyAndPaymentType
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetMainCurrencyAndPaymentType(OrderDataEntryData data);

        /// <summary>
        /// GetMainCurrencyAndPaymentTypeForOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetMainCurrencyAndPaymentTypeForOrder(OrderDataEntryData data);

        /// <summary>
        /// GetArticleData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetArticleData(OrderDataEntryData data);

        /// <summary>
        /// GetCustomerData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<OrderDataEntryCustomerModel> GetCustomerData(OrderDataEntryData data);

        /// <summary>
        /// GetPreloadOrderData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetPreloadOrderData(OrderDataEntryData data);

        /// <summary>
        /// OrderDataEntryByLogin
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> OrderDataEntryByLogin(OrderDataEntryByLoginData data);

        /// <summary>
        /// TotalDataEntryByLogin
        /// </summary>
        /// <returns></returns>
        Task<object> TotalDataEntryByLogin(Data data);

        /// <summary>
        /// DeleteLot
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteLot(LotData data);

        /// <summary>
        /// DeleteLotItem
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteLotItem(ScanningLotItemData data);

        /// <summary>
        /// CreateLotName
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> CreateLotName(LotData data);

        /// <summary>
        /// SaveScanningOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveScanningOrder(ScanningLotItemData data);

        Task<WSEditReturn> CloseLotScanningTool(LotData data);

        /// <summary>
        /// SaveScanningOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SendOrderToAdministrator(SendOrderToAdministratorData data);

        /// <summary>
        /// SaveOrderDataEntryData
        /// </summary>
        /// <param name="data"></param>
        /// <param name="objectName"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveOrderDataEntryData(CustomerOrderDataEntryData data, string objectName);

        Task<object> GetRejectPayments(OrderDataEntryGetRejectPaymentsData data);

        Task<object> GetSalesOrderById(OrderDataEntryGetSalesOrderByIdData data);

        Task<WSEditReturn> SaveOrderFileFromColissimo(SaveResponseFromColissimoData data);
        Task<WSDataReturn> SearchArticleByNumber(ArticleSearchData data);
    }
}

