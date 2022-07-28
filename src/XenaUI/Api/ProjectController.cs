using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectController : BaseController
    {
        private readonly IProjectBusiness _projectBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;

        public ProjectController(IProjectBusiness projectBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _projectBusiness = projectBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetSelectionProject
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionProject")]
        public async Task<object> GetSelectionProject(int idSelectionProject)
        {
            return await _projectBusiness.GetSelectionProject(idSelectionProject);
        }

        /// <summary>
        /// GetListOfCampaign
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetListOfCampaign")]
        public async Task<object> GetListOfCampaign()
        {
            return await _projectBusiness.GetListOfCampaign();
        }

        /// <summary>
        /// SaveProject
        /// </summary>
        /// <param name="projectModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveProject")]
        public async Task<WSEditReturn> SaveProject([FromBody]IList<ProjectModel> projectModel)
        {
            return await _projectBusiness.SaveProject(projectModel);
        }

        /// <summary>
        /// GetMediaCodePricing
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetMediaCodePricing")]
        [AllowAnonymous]
        public async Task<object> GetMediaCodePricing(int idSelectionProject, int idSelectionProjectCountry)
        {
            return await _projectBusiness.GetMediaCodePricing(idSelectionProject, idSelectionProjectCountry);
        }

        [HttpPost]
        [Route("SaveMediaCodePricing")]
        public async Task<WSEditReturn> SaveMediaCodePricing([FromBody]ProjectSaveMediaCodePricingModel model)
        {
            return await _projectBusiness.SaveMediaCodePricing(model);
        }

        /// <summary>
        /// InsertMediaCodeToCampaign
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("InsertMediaCodeToCampaign")]
        [AllowAnonymous]
        public async Task<object> InsertMediaCodeToCampaign(string idSelectionProject, string idSelectionWidget)
        {
            return await _projectBusiness.InsertMediaCodeToCampaign(idSelectionProject, idSelectionWidget);
        }

        /// <summary>
        /// GetSelectionToExclude
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionToExclude")]
        public async Task<object> GetSelectionToExclude(string idSelectionProject)
        {
            return await _projectBusiness.GetSelectionToExclude(idSelectionProject);
        }

        /// <summary>
        /// GetSelectionIsExcluded
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionIsExcluded")]
        public async Task<object> GetSelectionIsExcluded(string idSelectionProject)
        {
            return await _projectBusiness.GetSelectionIsExcluded(idSelectionProject);
        }

        /// <summary>
        /// GetSelectionCountriesExcluded
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionCountriesExcluded")]
        public async Task<object> GetSelectionCountriesExcluded(string idSelectionProject)
        {
            return await _projectBusiness.GetSelectionCountriesExcluded(idSelectionProject);
        }

        /// <summary>
        /// GetSelectionMediacodeExcluded
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionMediacodeExcluded")]
        public async Task<object> GetSelectionMediacodeExcluded(string idSelectionProject, string idSelectionProjectCountry)
        {
            return await _projectBusiness.GetSelectionMediacodeExcluded(idSelectionProject, idSelectionProjectCountry);
        }

        /// <summary>
        /// SaveProjectExclude
        /// </summary>
        /// <param name="projectExclude"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveProjectExclude")]
        public async Task<WSEditReturn> SaveProjectExclude([FromBody]ProjectExclude projectExclude)
        {
            return await _projectBusiness.SaveProjectExclude(projectExclude);
        }
    }
}
