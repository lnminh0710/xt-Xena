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
    public class PageSettingController : BaseController
    {
        private readonly IGlobalBusiness _iGlobalBusiness;

        public PageSettingController(IGlobalBusiness iGlobalBusiness)
        {
            _iGlobalBusiness = iGlobalBusiness;
        }

        // GET: api/pagesetting/GetPageSettingById
        /// <summary>
        /// GetPageSettingById
        /// </summary>
        /// <param name="id_settings_global">IdSettingsGlobal</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetPageSettingById")]
        public async Task<object> GetPageSettingById(string pageId)
        {
            var result = await _iGlobalBusiness.GetPageSetting(pageId, Constants.EGetPageSettingType.ObjectNr);
            return result;
        }

        // Post: api/pagesetting/SavePageSetting
        /// <summary>
        /// SavePageSetting
        /// </summary>
        /// <param name="pageSettingModel">PageSettingModel</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SavePageSetting")]
        public async Task<object> SavePageSetting([FromBody]PageSettingModel pageSettingModel)
        {
            var result = await _iGlobalBusiness.SavePageSetting(pageSettingModel);
            return result;
        }
    }
}
