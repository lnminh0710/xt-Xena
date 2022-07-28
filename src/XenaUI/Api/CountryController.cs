using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty Countrys, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class CountryController : BaseController
    {
        private readonly ICountryBusiness _countryBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;

        public CountryController(ICountryBusiness countryBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _countryBusiness = countryBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetSelectionProjectCountry
        /// </summary>
        /// <param name="idKeyValue"></param>
        /// <param name="idSelectionWidget"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSelectionProjectCountry")]
        [AllowAnonymous]
        public async Task<object> GetSelectionProjectCountry(int idKeyValue, int? idSelectionWidget)
        {
            return await _countryBusiness.GetSelectionProjectCountry(idKeyValue, idSelectionWidget);
        }

        /// <summary>
        /// GetCountryGroupsName
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCountryGroupsName")]
        [AllowAnonymous]
        public async Task<object> GetCountryGroupsName(int idSelectionProject)
        {
            return await _countryBusiness.GetCountryGroupsName(idSelectionProject);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCountryGroupsList")]
        [AllowAnonymous]
        public async Task<object> GetCountryGroupsList(int idRepCountryLangaugeGroupsName)
        {
            return await _countryBusiness.GetCountryGroupsList(idRepCountryLangaugeGroupsName);
        }

        /// <summary>
        /// SaveProjectCountry
        /// </summary>
        /// <param name="projectCountryModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveProjectCountry")]
        [AllowAnonymous]
        public async Task<WSEditReturn> SaveProjectCountry([FromBody]IList<ProjectCountryModel> projectCountryModel)
        {
            return await _countryBusiness.SaveProjectCountry(projectCountryModel);
        }

        /// <summary>
        /// SaveProjectCountry
        /// </summary>
        /// <param name="countryGroupModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveCountryGroups")]
        [AllowAnonymous]
        public async Task<WSEditReturn> SaveCountryGroups([FromBody]CountryGroupModel countryGroupModel)
        {
            return await _countryBusiness.SaveCountryGroups(countryGroupModel);
        }
    }
}
