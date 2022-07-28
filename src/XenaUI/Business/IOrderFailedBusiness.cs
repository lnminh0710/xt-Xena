using System.Threading.Tasks;
using XenaUI.Models;

namespace XenaUI.Business
{
    public interface IOrderFailedBusiness
    {
        /// <summary>
        /// Get Order by IdScansContainerItems
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        Task<object> GetOrder(string tabID, string idScansContainerItems);

        /// <summary>
        /// Save Order
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task SaveOrder(OrderFailedSaveModel model);

        /// <summary>
        /// Delete Order by IdScansContainerItems
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        Task DeleteOrder(string tabID, string idScansContainerItems);

        /// <summary>
        /// Delete All Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <returns></returns>
        Task DeleteAllOrders(string tabID);

        /// <summary>
        /// Get List of Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        Task<object> GetListOrders(string tabID, int pageIndex = 0, int pageSize = 20);

        /// <summary>
        /// Get List of ParkedItem Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        Task<object> GetListParkedItemOrders(string tabID, int pageIndex = 0, int pageSize = 20);
    }
}

