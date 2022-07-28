using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty frequencys, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class FrequencyController : BaseController
    {
        private readonly IFrequencyBusiness _frequencyBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;

        public FrequencyController(IFrequencyBusiness frequencyBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _frequencyBusiness = frequencyBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetFrequency
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("RebuildFrequencies")]
        [AllowAnonymous]
        public async Task<object> RebuildFrequencies(int idSelectionProject)
        {
            //return await _frequencyBusiness.RebuildFrequencies(idSelectionProject);

            RebuildFrequenciesAsyn(idSelectionProject);
            return await Task.FromResult(true);
        }

        private void RebuildFrequenciesAsyn(int idSelectionProject)
        {
            Task.Run(() =>
           {
               _frequencyBusiness.RebuildFrequencies(idSelectionProject).Wait();
           });
        }

        /// <summary>
        /// GetFrequencyBusyIndicator
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetFrequencyBusyIndicator")]
        [AllowAnonymous]
        public async Task<object> GetFrequencyBusyIndicator(int idSelectionProject)
        {
            return await _frequencyBusiness.GetFrequencyBusyIndicator(idSelectionProject);
        }

        /// <summary>
        /// GetFrequency
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetFrequency")]
        [AllowAnonymous]
        public async Task<object> GetFrequency(int idSelectionProject, int idSelectionProjectCountry)
        {
            return await _frequencyBusiness.GetFrequency(idSelectionProject, idSelectionProjectCountry);
        }

        /// <summary>
        /// SaveFrequency
        /// </summary>
        /// <param name="frequencySaveModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveFrequency")]
        [AllowAnonymous]
        public async Task<WSEditReturn> SaveFrequency([FromBody]FrequencySaveModel frequencySaveModel)
        {
            return await _frequencyBusiness.SaveFrequency(frequencySaveModel);
        }
    }
}
