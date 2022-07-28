using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface ISearchService
    {
        /// <summary>
        /// GetAllModules
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<IList<GlobalModule>> GetAllModules(Data data);

        /// <summary>
        /// SearchSummaryWithKeywork
        /// </summary>
        /// <param name="searchData"></param>
        /// <returns></returns>
        Task<int> SearchSummaryWithKeywork(SearchData searchData);

        /// <summary>
        /// SearchWithKeywork
        /// </summary>
        /// <param name="searchData"></param>
        /// <returns></returns>
        Task<CustomerCollection> SearchWithKeywork(SearchData searchData);

    }    
}

