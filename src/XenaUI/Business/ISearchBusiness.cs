using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface ISearchBusiness
    {

        /// <summary>
        /// GetAllModules
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<IList<GlobalModule>> GetAllModules(string access_token);

        /// <summary>
        /// SearchSummaryWithKeywork
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="keyword"></param>
        /// <param name="moduleId"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        Task<int> SearchSummaryWithKeywork(string access_token, string keyword, string moduleId, int pageIndex, int pageSize);

        /// <summary>
        /// SearchWithKeywork
        /// </summary>
        /// <param name="access_token"></param>
        /// <param name="keyword"></param>
        /// <param name="moduleId"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        Task<CustomerCollection> SearchWithKeywork(string access_token, string keyword, string moduleId, int pageIndex, int pageSize);


    }
}
