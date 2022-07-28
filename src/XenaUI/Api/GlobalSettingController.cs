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
    public class GlobalSettingController : BaseController
    {
        private readonly IGlobalBusiness _iGlobalSettingBusiness;

        public GlobalSettingController(IGlobalBusiness iGlobalSettingBusiness)
        {
            _iGlobalSettingBusiness = iGlobalSettingBusiness;
        }

        // GET: api/globalsetting/GetAllGlobalSettings
        [HttpGet]
        [Route("GetAllGlobalSettings")]
        public async Task<object> GetAllGlobalSettings(string idSettingsGUI)
        {
            var result = await _iGlobalSettingBusiness.GetAllGlobalSettings(idSettingsGUI);
            return result;
        }

        // GET: api/globalsetting/GetAdvanceSearchProfile
        [HttpGet]
        [Route("GetAdvanceSearchProfile")]
        public async Task<object> GetAdvanceSearchProfile(string moduleId)
        {
            var result = await _iGlobalSettingBusiness.GetAdvanceSearchProfile(moduleId);
            return result;
        }

        // GET: api/globalsetting/GetGlobalSettingById
        /// <summary>
        /// GetGlobalSettingById
        /// </summary>
        /// <param name="idSettingsGlobal">IdSettingsGlobal</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetGlobalSettingById")]
        public async Task<object> GetGlobalSettingById(int idSettingsGlobal)
        {
            var result = await _iGlobalSettingBusiness.GetGlobalSettingById(idSettingsGlobal);
            return result;
        }

        // Post: api/globalsetting/DeleteGlobalSettingById
        /// <summary>
        /// DeleteGlobalSettingById
        /// </summary>
        /// <param name="idSettingsGlobal">Id of Settings Global</param>
        /// <returns></returns>
        [HttpPost]
        [Route("DeleteGlobalSettingById")]
        public async Task<object> DeleteGlobalSettingById(int idSettingsGlobal)
        {
            var result = await _iGlobalSettingBusiness.DeleteGlobalSettingById(idSettingsGlobal);
            return result;
        }

        // Post: api/globalsetting/SaveGlobalSettingById
        /// <summary>
        /// SaveGlobalSettingById
        /// </summary>
        /// <param name="globalSettingModel">GlobalSettingModel</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveGlobalSetting")]
        public async Task<object> SaveGlobalSetting([FromBody]GlobalSettingModel globalSettingModel)
        {
            var result = await _iGlobalSettingBusiness.SaveGlobalSettingById(globalSettingModel);
            return result;
        }

        // Post: api/globalsetting/SaveTranslateLabelText
        /// <summary>
        /// SaveTranslateLabelText
        /// </summary>
        /// <param name="translationModel">translationModel</param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveTranslateLabelText")]
        public async Task<object> SaveTranslateLabelText([FromBody]TranslationModel translationModel)
        {
            var result = await _iGlobalSettingBusiness.SaveTranslateLabelText(translationModel);
            return result;
        }

        // GET: api/globalsetting/GetCommonTranslateLabelText
        [HttpGet]
        [Route("GetCommonTranslateLabelText")]
        public async Task<object> GetCommonTranslateLabelText()
        {
            var result = _iGlobalSettingBusiness.GetCommonTranslateLabelText();

            return await result;
        }

        // GET: api/globalsetting/GetMultiTranslateLabelText
        [HttpGet]
        [Route("GetMultiTranslateLabelText")]
        public async Task<object> GetMultiTranslateLabelText(string originalText, string widgetMainID, string widgetCloneID, string idRepTranslateModuleType, string idTable, string fieldName, string tableName)
        {
            var result = _iGlobalSettingBusiness.GetMultiTranslateLabelText(originalText, widgetMainID, widgetCloneID, idRepTranslateModuleType, idTable, fieldName, tableName);

            return await result;
        }

        // GET: api/globalsetting/GetSystemTranslateText
        [HttpGet]
        [Route("GetSystemTranslateText")]
        public async Task<object> GetSystemTranslateText()
        {
            var result = _iGlobalSettingBusiness.GetSystemTranslateText();

            return await result;
        }

        // GET: api/globalsetting/GetTranslateLabelText
        [HttpGet]
        [Route("GetTranslateLabelText")]
        public async Task<object> GetTranslateLabelText(string originalText, string widgetMainID, string widgetCloneID, string idRepTranslateModuleType, string idTable, string fieldName, string tableName)
        {
            var result = _iGlobalSettingBusiness.GetTranslateLabelText(originalText, widgetMainID, widgetCloneID, idRepTranslateModuleType, idTable, fieldName, tableName);

            return await result;
        }

        [HttpGet]
        [Route("GetTranslateText")]
        public async Task<object> GetTranslateText(string widgetMainID, string widgetCloneID, string fields)
        {
            var result = _iGlobalSettingBusiness.GetTranslateText(widgetMainID, widgetCloneID,fields);
           
            return await result;
        }
    }
}
