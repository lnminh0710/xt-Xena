using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IBackOfficeBusiness
    {
        #region ReturnAndRefund
        /// <summary>
        /// GetWidgetInfoByIds
        /// </summary>
        /// <returns></returns>
        Task<object> GetWidgetInfoByIds(string personNr, string invoiceNr, string mediaCode);

        /// <summary>
        /// SaveWidgetData
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWidgetData(ReturnRefundSaveModel model);

        /// <summary>
        /// SaveUnblockOrder
        /// </summary>
        /// <param name="idSalesOrder"></param>
        /// <param name="isDeleted"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveUnblockOrder(string idSalesOrder, bool? isDeleted);

         /// <summary>
         /// ConfirmSalesOrderLetters
         /// </summary>
         /// <param name="idGenerateLetter"></param>
         Task<WSEditReturn> ConfirmSalesOrderLetters(string idGenerateLetter);

         /// <summary>
         /// ResetLetterStatus
         /// </summary>
         /// <param name="idGenerateLetter"></param>
         Task<WSEditReturn> ResetLetterStatus(string idGenerateLetter);

        /// <summary>
        /// SaveDeleteOrder
        /// </summary>
        /// <param name="idSalesOrder"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveDeleteOrder(string idSalesOrder);

        #endregion

        #region BlockOrders
        /// <summary>
        /// GetBlockedOrderTextTemplate
        /// </summary>
        /// <param name="idRepSalesOrderStatus"></param>
        /// <returns></returns>
        Task<object> GetBlockedOrderTextTemplate(int? idRepSalesOrderStatus);

        /// <summary>
        /// GetMailingListOfPlaceHolder
        /// </summary>
        /// <returns></returns>
        Task<object> GetMailingListOfPlaceHolder();

        /// <summary>
        /// GetListOfMandantsByIdSalesOrder
        /// </summary>
        /// <param name="idSalesOrder"></param>
        /// <returns></returns>
        Task<object> GetListOfMandantsByIdSalesOrder(string idSalesOrder);

        /// <summary>
        /// GetListOfMandantsByIdPerson
        /// </summary>
        /// <param name="idPerson"></param>
        /// <returns></returns>
        Task<object> GetListOfMandantsByIdPerson(string idPerson);

        /// <summary>
        /// GetLetterTypeByMandant
        /// </summary>
        /// <param name="mandants"></param>
        /// <returns></returns>
        Task<object> GetLetterTypeByMandant(string mandants);

        /// <summary>
        /// GetLetterTypeByWidgetAppId
        /// </summary>
        /// <param name="idRepWidgetApp"></param>
        /// <returns></returns>
        Task<object> GetLetterTypeByWidgetAppId(string idRepWidgetApp);

        /// <summary>
        /// GetGroupAndItemsByLetterType
        /// </summary>
        /// <param name="letterTypeId"></param>
        /// <returns></returns>
        Task<object> GetGroupAndItemsByLetterType(string letterTypeId);

        /// <summary>
        /// GetAssignWidgetByLetterTypeId
        /// </summary>
        /// <param name="idBackOfficeLetters"></param>
        /// <returns></returns>
        Task<object> GetAssignWidgetByLetterTypeId(string idBackOfficeLetters);

        /// <summary>
        /// GetAllTypeOfAutoLetter
        /// </summary>
        /// <returns></returns>
        Task<object> GetAllTypeOfAutoLetter();

        /// <summary>
        /// GetAssignWidgetByLetterTypeId
        /// </summary>
        /// <param name="idBackOfficeLetters"></param>
        /// <returns></returns>
        Task<object> GetCountriesLanguageByLetterTypeId(string idBackOfficeLetters);

        /// <summary>
        /// GetListOfTemplate
        /// </summary>
        /// <param name="idBackOfficeLetters"></param>
        /// <returns></returns>
        Task<object> GetListOfTemplate(string idBackOfficeLetters);

        /// <summary>
        /// SaveTextTemplate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveTextTemplate(BlockOrdersModel model);

        /// <summary>
        /// SaveSalesOrderLetters
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesOrderLetters(SalesOrderLettersViewModel model);

        /// <summary>
        /// SaveSalesOrderLetters
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesOrderLettersConfirm(ConfirmSalesOrderLettersViewModel model);

        /// <summary>
        /// SaveSalesCustomerLetters
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveSalesCustomerLetters(SalesOrderLettersViewModel model);

        /// <summary>
        /// SaveBackOfficeLetters
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLetters(BackOfficeLettersViewModel model);

        /// <summary>
        /// SaveBackOfficeLettersTest
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLettersTest(SalesOrderLettersViewModel model);

        /// <summary>
        /// SaveBackOfficeLettersTestGeneratedDoc
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveBackOfficeLettersTestGeneratedDoc(SalesOrderLettersViewModel model);

        Task<WSEditReturn> DeleteBackOfficeLetters(BackOfficeLetterTemplateDeleteData model);

        #endregion

        #region StockCorrection
        /// <summary>
        /// GetStockCorrection
        /// </summary>
        /// <returns></returns>
        Task<object> GetStockCorrection();

        /// <summary>
        /// GetWarehouseArticle
        /// </summary>
        /// <param name="articleNr"></param>
        /// <param name="warehouseId"></param>
        /// <returns></returns>
        Task<object> GetWarehouseArticle(string articleNr, long warehouseId);

        /// <summary>
        /// SaveStockCorrection
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveStockCorrection(StockCorrectionModel model);
        #endregion

        #region WareHouse Movement
        /// <summary>
        /// GetWarehouseMovement
        /// </summary>
        /// <returns></returns>
        Task<object> GetWarehouseMovement();

        /// <summary>
        /// GetWarehouseMovementForPdf
        /// </summary>
        /// <returns></returns>
        Task<object> GetWarehouseMovementForPdf();

        /// <summary>
        /// GetWarehouseMovementCosts
        /// </summary>
        /// <param name="idWarehouseMovement"></param>
        /// <returns></returns>
        Task<object> GetWarehouseMovementCosts(int? idWarehouseMovement);

        /// <summary>
        /// GetWarehouseMovementById
        /// </summary>
        /// <param name="idWarehouseMovement"></param>
        /// <returns></returns>
        Task<object> GetWarehouseMovementById(int? idWarehouseMovement);

		/// <summary>
		/// GetArrivedArticles
		/// </summary>
		/// <param name="idWarehouseMovement"></param>
		/// <returns></returns>
		Task<object> GetArrivedArticles(int? idWarehouseMovement);

        /// <summary>
        /// GetSelectedArticles
        /// </summary>
        /// <param name="idWarehouseMovement"></param>
        /// <returns></returns>
        Task<object> GetSelectedArticles(int? idWarehouseMovement);

        /// <summary>
        /// StockedArticles
        /// </summary>
        /// <param name="idWarehouseMovement"></param>
        /// <returns></returns>
        Task<object> StockedArticles(int? idWarehouseMovement);

        /// <summary>
        /// SearchArticles
        /// </summary>
        /// <param name="searchString"></param>
        /// <param name="idPersonFromWarehouse"></param>
        /// <returns></returns>
        Task<object> SearchArticles(string searchString, int? idPersonFromWarehouse);

        /// <summary>
        /// SaveWarehouseMovement
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWarehouseMovement(WareHouseMovementModel model);

        /// <summary>
        /// SaveGoodsReceiptPosted
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveGoodsReceiptPosted(IList<GoodsReceiptPostedModel> model);

        /// <summary>
        /// ConfirmGoodsReceiptPosted
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> ConfirmGoodsReceiptPosted(ConfirmGoodsReceiptPostedModel model);

        #endregion

    }
}

