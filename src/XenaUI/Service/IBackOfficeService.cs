using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface IBackOfficeService
    {
        #region BlockOrders
        /// <summary>
        /// GetBlockedOrderTextTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetBlockedOrderTextTemplate(BlockOrdersData data);

        /// <summary>
        /// GetMailingListOfPlaceHolder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetMailingListOfPlaceHolder(BlockOrdersData data);

        /// <summary>
        /// GetListOfMandantsByIdSalesOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetListOfMandantsByIdSalesOrder(RequestCommonData data);

        /// <summary>
        /// GetLetterTypeByMandant
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetLetterTypeByMandant(RequestCommonData data);

        /// <summary>
        /// GetLetterTypeByWidgetAppId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetLetterTypeByWidgetAppId(RequestCommonData data);

        /// <summary>
        /// GetGroupAndItemsByLetterType
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetGroupAndItemsByLetterType(RequestCommonData data);

        /// <summary>
        /// GetAssignWidgetByLetterTypeId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>

        Task<object> GetAssignWidgetByLetterTypeId(RequestCommonData data);
        /// <summary>
        /// GetAssignWidgetByLetterTypeId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>

        Task<object> GetAllTypeOfAutoLetter(RequestCommonData data);
        /// <summary>
        /// GetAllTypeOfAutoLetter
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>

        Task<object> GetCountriesLanguageByLetterTypeId(RequestCommonData data);
        /// <summary>
        /// GetCountriesLanguageByLetterTypeId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>

        Task<object> GetListOfTemplate(RequestCommonData data);
        /// <summary>
        /// GetListOfTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>

        Task<WSEditReturn> SaveTextTemplate(BlockOrdersData data);

        /// <summary>
        /// SaveSalesOrderLetters
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesOrderLetters(BackOfficeLettersData data);

        /// <summary>
        /// SaveSalesOrderLettersConfirm
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesOrderLettersConfirm(ConfirmBackOfficeLettersData data);

        /// <summary>
        /// SaveSalesCustomerLetters
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesCustomerLetters(BackOfficeLettersData data);

        /// <summary>
        /// SaveBackOfficeLetters
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLetters(BackOfficeLetterTemplateData data);

        /// <summary>
        /// ConfirmSalesOrderLetters
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> ConfirmSalesOrderLetters(ConfirmLettersData data);

        /// <summary>
        /// ResetLetterStatus
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> ResetLetterStatus(ResetLetterStatusData data);

        /// <summary>
        /// SaveBackOfficeLettersTest
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLettersTest(BackOfficeLettersData data);

        /// <summary>
        /// SaveBackOfficeLettersTestGeneratedDoc
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLettersTestGeneratedDoc(BackOfficeLettersData data);

        Task<WSEditReturn> DeleteBackOfficeLetters(BackOfficeLetterTemplateDeleteData data);

        #endregion

        #region ReturnAndRefund
        /// <summary>
        /// GetOrderArticles
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWidgetInfoByIds(ReturnRefundData data);

        /// <summary>
        /// SaveWidgetData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWidgetData(ReturnRefundSaveData data);

        /// <summary>
        /// SaveUnblockOrder
        /// </summary>
        /// <param name="data"></param>
        /// <param name="isDeleted"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveUnblockOrder(ReturnRefundData data, bool? isDeleted);

        /// <summary>
        /// SaveDeleteOrder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveDeleteOrder(ReturnRefundData data);

        #endregion

        #region StockCorrection
        /// <summary>
        /// GetStockCorrection
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetStockCorrection(Data data);

        /// <summary>
        /// GetWarehouseArticle
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWarehouseArticle(StockCorrectionData data);

        /// <summary>
        /// SaveStockCorrection
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveStockCorrection(StockCorrectionData data);

        #endregion

        #region WareHouse Movement
        /// <summary>
        /// GetWarehouseMovement
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWarehouseMovement(Data data);

        /// <summary>
        /// GetWarehouseMovementForPdf
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWarehouseMovementForPdf(Data data);

        /// <summary>
        /// GetWarehouseMovementCosts
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWarehouseMovementCosts(WareHouseMovementData data);

		/// GetWarehouseMovementById
		/// </summary>
		/// <param name="data"></param>
		/// <returns></returns>
		Task<object> GetWarehouseMovementById(WareHouseMovementData data);

        /// <summary>
        /// GetArrivedArticles
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetArrivedArticles(WareHouseMovementSortingGoodsData data);

        /// <summary>
        /// GetSelectedArticles
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetSelectedArticles(WareHouseMovementSortingGoodsData data);

        /// <summary>
        /// StockedArticles
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> StockedArticles(WareHouseMovementStockedArticlesData data);

        /// <summary>
        /// SearchArticles
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> SearchArticles(WareHouseMovementSearchArticleData data);

        /// <summary>
        /// SaveWarehouseMovement
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWarehouseMovement(WareHouseMovementData data);

        /// <summary>
        /// SaveGoodsReceiptPosted
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveGoodsReceiptPosted(GoodsReceiptPostedData data);

        /// <summary>
        /// ConfirmGoodsReceiptPosted
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> ConfirmGoodsReceiptPosted(ConfirmGoodsReceiptPostedData data);

        #endregion
    }
}

