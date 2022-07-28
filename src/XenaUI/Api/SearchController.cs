using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Service;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using Newtonsoft.Json;
using XenaUI.Utils;
using Newtonsoft.Json.Serialization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class SearchController : BaseController
    {
        private readonly ISearchBusiness _searchBusiness;

        public SearchController(ISearchBusiness searchBusiness)
        {
            _searchBusiness = searchBusiness;
        }

        // GET: api/search/GetAllModules
        /// <summary>
        /// GetAllModules
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetAllModules")]
        [Obsolete("This is deprecated, please use CommonController.GetAllSearchModules instead.")]
        public async Task<object> GetAllModules()
        {
            string authorization = Request.Headers["Authorization"];
            string accesstoken = authorization.Replace("Bearer ", "");
            var result = _searchBusiness.GetAllModules(accesstoken);

            return await result;
        }

        // GET: api/search/GetSearchSummary
        /// <summary>
        /// GetSearchSummary: 
        /// </summary>
        /// <param name="data">pass properties: Keyword, IdSettingsGUI</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSearchSummary")]
        [Obsolete("This is deprecated, please use ElSearchController.GetSearchSummary instead.")]
        public async Task<object> GetSearchSummary(string keyword, string moduleId, int pageIndex, int pageSize)
        {
            string authorization = Request.Headers["Authorization"];
            string accesstoken = authorization.Replace("Bearer ", "");
            var result = _searchBusiness.SearchSummaryWithKeywork(accesstoken, keyword, moduleId, pageIndex, pageSize);
            return await result;
        }

        // Post: api/search/GetSearchDetail
        /// <summary>
        /// GetSearchDetail
        /// </summary>
        /// <param name="data">pass properties: Keyword, IdSettingsGUI</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSearchDetail")]
        [Obsolete("This is deprecated, please use ElSearchController.SearchDetail instead.")]
        public async Task<object> GetSearchDetail(string keyword, string moduleId, int pageIndex, int pageSize)
        {
            string authorization = Request.Headers["Authorization"];
            string accesstoken = authorization.Replace("Bearer ", "");
            var result = _searchBusiness.SearchWithKeywork(accesstoken, keyword, moduleId, pageIndex, pageSize);
            
            return await result;
        }
    }
}
