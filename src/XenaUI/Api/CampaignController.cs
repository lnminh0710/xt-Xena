using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Business;
using XenaUI.Models;
using XenaUI.Utils;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class CampaignController : BaseController
    {
        private readonly AppSettings _appSettings;
        private readonly ICampaignBusiness _campaignBusiness;

        public CampaignController(IOptions<AppSettings> appSettings, ICampaignBusiness campaignBusiness)
        {
            _appSettings = appSettings.Value;
            _campaignBusiness = campaignBusiness;
        }

        // POST: api/Campaign/CreateMediaCode
        [HttpPost]
        [Route("CreateMediaCode")]
        public async Task<object> CreateMediaCode([FromBody]IList<CampaignMediaCodeModel> model)
        {
            return await _campaignBusiness.CreateMediaCode(model);
        }

        // POST: api/Campaign/CreateCampaigneArticle
        [HttpPost]
        [Route("CreateCampaignArticle")]
        public async Task<object> CreateCampaignArticle([FromBody]IList<CampagneArticleModel> model)
        {
            return await _campaignBusiness.CreateCampaignArticle(model);
        }

        // GET: api/Campaign/GetCampaignArticle
        [HttpGet]
        [Route("GetCampaignArticle")]
        public async Task<object> GetCampaignArticle(int idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignArticle(idSalesCampaignWizard);
        }

        // GET: api/Campaign/GetCampaignArticleCountries
        [HttpGet]
        [Route("GetCampaignArticleCountries")]
        public async Task<object> GetCampaignArticleCountries(int idArticle, int? idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignArticleCountries(idArticle, idSalesCampaignWizard);
        }

        // POST: api/Campaign/SaveCampaignWizard
        /// <summary>
        /// SaveCampaignWizard
        /// for create and save
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveCampaignWizard")]
        public async Task<object> SaveCampaignWizard([FromBody]CampaignWizardModel model)
        {
            return await _campaignBusiness.CreateCampaignWizard(model);
        }

        // GET: api/Campaign/GetCampaignWizardT1
        [HttpGet]
        [Route("GetCampaignWizardT1")]
        public async Task<object> GetCampaignWizardT1(int idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignWizardT1(idSalesCampaignWizard);
        }

        // GET: api/Campaign/GetCampaignWizardT2
        [HttpGet]
        [Route("GetCampaignWizardT2")]
        public async Task<object> GetCampaignWizardT2(int? idSalesCampaignWizard, string idLanguage)
        {
            return await _campaignBusiness.GetCampaignWizardT2(idSalesCampaignWizard, idLanguage);
        }

        // GET: api/Campaign/SearchMediaCode
        [HttpGet]
        [Route("SearchMediaCode")]
        public async Task<object> SearchMediaCode(string mediaCodeNr)
        {
            return await _campaignBusiness.SearchMediaCode(mediaCodeNr);
        }

        // GET: api/Campaign/GetMediaCodeDetail
        [HttpGet]
        [Route("GetMediaCodeDetail")]
        public async Task<object> GetMediaCodeDetail(int? idSalesCampaignWizardItems)
        {
            return await _campaignBusiness.GetMediaCodeDetail(idSalesCampaignWizardItems);
        }

        // GET: api/Campaign/CheckExistingMediaCodeMulti
        [HttpPost]
        [Route("CheckExistingMediaCodeMulti")]
        public async Task<object> CheckExistingMediaCodeMulti([FromBody]MediaCodesToCheckExist mediaCodes)
        {
            if(mediaCodes == null || string.IsNullOrEmpty(mediaCodes.mediaCodeNrs)) 
            {
                return StatusCode(400);
            }
            return await _campaignBusiness.CheckExistingMediaCodeMulti(mediaCodes.mediaCodeNrs);
        }

        // GET: api/Campaign/GetCampagnWizardCountry
        [HttpGet]
        [Route("GetCampaignWizardCountry")]
        public async Task<object> GetCampaignWizardCountry(int? idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignCountry(idSalesCampaignWizard);
        }

        // POST: api/Campaign/SaveCampaignWizardCountriesT2
        [HttpPost]
        [Route("SaveCampaignWizardCountriesT2")]
        public async Task<object> SaveCampaignWizardCountriesT2([FromBody]CampaignWizardCountriesT2Model model)
        {
            return await _campaignBusiness.CreateCampaignWizardCountriesT2(model);
        }

        // GET: api/Campaign/GetCampaignTracksCountries
        [HttpGet]
        [Route("GetCampaignTracksCountries")]
        public async Task<object> GetCampaignTracksCountries(int idSalesCampaignTracks, int idSalesCampaignWizard, int idSalesCampaignWizardTrack)
        {
            return await _campaignBusiness.GetCampaignTracksCountries(idSalesCampaignTracks, idSalesCampaignWizard, idSalesCampaignWizardTrack);
        }

        // GET: api/Campaign/GetCampaignTracks
        [HttpGet]
        [Route("GetCampaignTracks")]
        public async Task<object> GetCampaignTracks(int idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignTracks(idSalesCampaignWizard);
        }

        // POST: api/Campaign/SaveCampaignTracks
        [HttpPost]
        [Route("SaveCampaignTracks")]
        public async Task<object> SaveCampaignTracks([FromBody]CampaignTracksModel model)
        {
            return await _campaignBusiness.SaveCampaignTracks(model);
        }

        // POST: api/Campaign/SaveCampaignCosts
        /// <summary>
        /// SaveCampaignCosts
        /// for create and update(have to include IdBusinessCosts value)
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveCampaignCosts")]
        public async Task<object> SaveCampaignCosts([FromBody]CampaignCostsModel model)
        {
            return await _campaignBusiness.SaveCampaignCosts(model);
        }

        // GET: api/Campaign/GetCampaignCosts
        [HttpGet]
        [Route("GetCampaignCosts")]
        public async Task<object> GetCampaignCosts(int idBusinessCosts, bool? isWrap)
        {
            return await _campaignBusiness.GetCampaignCosts(idBusinessCosts, isWrap != null ? (bool)isWrap : false);
        }

        // POST: api/Campaign/SaveCampaignCostsItem
        [HttpPost]
        [Route("SaveBusinessCostsItem")]
        public async Task<object> SaveBusinessCostsItem([FromBody]CampaignCostItemsModel model)
        {
            return await _campaignBusiness.SaveCampaignCostsItem(model);
        }

        // GET: api/Campaign/GetCampaignCostsTreeView
        [HttpGet]
        [Route("GetCampaignCostsTreeView")]
        public async Task<object> GetCampaignCostsTreeView(int idBusinessCosts)
        {
            return await _campaignBusiness.GetCampaignCostsTreeView(idBusinessCosts);
        }

        // GET: api/Campaign/GetFilesByBusinessCostsId
        [HttpGet]
        [Route("GetFilesByBusinessCostsId")]
        public async Task<object> GetFilesByBusinessCostsId(int idBusinessCosts, bool? isUnWrap)
        {
            return await _campaignBusiness.GetFilesByBusinessCostsId(idBusinessCosts, isUnWrap != null ? (bool)isUnWrap : true);
        }

        // POST: api/Campaign/SaveFilesByBusinessCostsId
        /// <summary>
        /// SaveFilesByBusinessCostsId
        /// for create and update(have to include IdBusinessCostsFileAttach value)
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveFilesByBusinessCostsId")]
        public async Task<object> SaveFilesByBusinessCostsId([FromBody]CampaignCostFilesModel model)
        {
            return await _campaignBusiness.SaveFilesByBusinessCostsId(model);
        }

        // POST: api/Campaign/SaveFilesByIdSharingTreeGroups
        /// <summary>
        /// SaveFilesByIdSharingTreeGroups
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveFilesByIdSharingTreeGroups")]
        public async Task<object> SaveFilesByIdSharingTreeGroups([FromBody]CampaignCostFilesModel model)
        {
            return await _campaignBusiness.SaveFilesByIdSharingTreeGroups(model);
        }

        // GET: api/Campaign/GetBusinessCostsCountries
        [HttpGet]
        [Route("GetBusinessCostsCountries")]
        public async Task<object> GetBusinessCostsCountries(int idBusinessCostsItems, int idSalesCampaignWizard)
        {
            return await _campaignBusiness.GetCampaignCostsCountries(idBusinessCostsItems, idSalesCampaignWizard);
        }

        // GET: api/Campaign/GetCampaignCostsItem
        [HttpGet]
        [Route("GetBusinessCostsItem")]
        public async Task<object> GetBusinessCostsItem(int idBusinessCosts)
        {
            return await _campaignBusiness.GetCampaignCostsItem(idBusinessCosts);
        }

        // GET: api/Campaign/GetCampaignMediaCodeArticleSalesPrice
        [HttpGet]
        [Route("GetCampaignMediaCodeArticleSalesPrice")]
        public async Task<object> GetCampaignMediaCodeArticleSalesPrice(int idCountrylanguage, int idSalesCampaignWizard, int idSalesCampaignArticle)
        {
            string customMethodName = null;
            if (_appSettings.IsSelectionProject)
            {
                customMethodName = "SpCallExternalStored";
            }
            return await _campaignBusiness.GetCampaignMediaCodeArticleSalesPrice(idCountrylanguage, idSalesCampaignWizard, idSalesCampaignArticle, customMethodName);
        }

        /// <summary>
        /// GetPaymentTypeSalesPrice
        /// </summary>
        /// <param name="idSalesCampaignWizardItems"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetPaymentTypeSalesPrice")]
        public async Task<object> GetPaymentTypeSalesPrice(int idSalesCampaignWizardItems)
        {            
            return await _campaignBusiness.GetPaymentTypeSalesPrice(idSalesCampaignWizardItems);
        }

        // POST: api/Campaign/SaveCampaignMediaCodeArticleSalesPrice
        /// <summary>
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveCampaignMediaCodeArticleSalesPrice")]
        public async Task<object> SaveCampaignMediaCodeArticleSalesPrice([FromBody]CampaignMediaCodeArticleSalesPriceModel model)
        {
            string customMethodName = null;
            if (_appSettings.IsSelectionProject)
            {
                customMethodName = "SpCallExternalStored";
            }
            return await _campaignBusiness.SaveCampaignMediaCodeArticleSalesPrice(model, customMethodName);
        }


        /// <summary>
        /// SavePaymentTypeSalesPrice
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SavePaymentTypeSalesPrice")]
        public async Task<object> SavePaymentTypeSalesPrice([FromBody] CampaignPaymentTypeSalesPriceModel model)
        {           
            return await _campaignBusiness.SavePaymentTypeSalesPrice(model);
        }

        [HttpGet]
        [Route("CheckCampagneNr")]
        public async Task<object> CheckCampagneNr([FromQuery]CampaignNumberModel model)
        {
            return await _campaignBusiness.CheckCampagneNr(model);
        }

        [HttpGet]
        [Route("ListDocumentTemplateColumnName")]
        public async Task<object> ListDocumentTemplateColumnName(int idRepAppSystemColumnNameTemplate)
        {
            return await _campaignBusiness.ListDocumentTemplateColumnName(idRepAppSystemColumnNameTemplate);
        }

        [HttpGet]
        [Route("GetDocumentTemplateCountries")]
        public async Task<object> GetDocumentTemplateCountries(int idRepAppSystemColumnNameTemplate)
        {
            return await _campaignBusiness.GetDocumentTemplateCountries(idRepAppSystemColumnNameTemplate);
        }

        [HttpGet]
        [Route("ListDocumentTemplatesBySharingTreeGroup")]
        public async Task<object> ListDocumentTemplatesBySharingTreeGroup(int? idSharingTreeGroups)
        {
            return await _campaignBusiness.ListDocumentTemplatesBySharingTreeGroup(idSharingTreeGroups);
        }

        [HttpGet]
        [Route("ListTreeItemByIdSharingTreeGroupsRootname")]
        public async Task<object> ListTreeItemByIdSharingTreeGroupsRootname(int? idSharingTreeGroupsRootname)
        {
            return await _campaignBusiness.ListTreeItemByIdSharingTreeGroupsRootname(idSharingTreeGroupsRootname);
        }

        /// <summary>
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveSalesCampaignAddOn")]
        public async Task<object> SaveSalesCampaignAddOn([FromBody]CampaignSaveSalesCampaignAddOnModel model)
        {
            return await _campaignBusiness.SaveSalesCampaignAddOn(model);
        }

        /// <summary>
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveDocumentTemplateSampleDataFile")]
        public async Task<object> SaveDocumentTemplateSampleDataFile([FromBody]CampaignSaveSalesCampaignAddOnModel model)
        {
            return await _campaignBusiness.SaveDocumentTemplateSampleDataFile(model);
        }

        /// <summary>
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveAppSystemColumnNameTemplate")]
        public async Task<object> SaveAppSystemColumnNameTemplate([FromBody]CampaignSaveSalesCampaignAddOnModel model)
        {
            return await _campaignBusiness.SaveAppSystemColumnNameTemplate(model);
        }
    }
}
