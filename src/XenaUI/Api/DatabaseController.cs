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
    public class DatabaseController : BaseController
    {
        private readonly IDatabaseBusiness _databaseBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;

        public DatabaseController(IDatabaseBusiness databaseBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _databaseBusiness = databaseBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetListOfDatabaseNames
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetListOfDatabaseNames")]
        [AllowAnonymous]
        public async Task<object> GetListOfDatabaseNames(int idSelectionProject)
        {
            return await _databaseBusiness.GetListOfDatabaseNames(idSelectionProject);
        }

        /// <summary>
        /// GetListOfDatabaseCountry
        /// </summary>
        /// <param name="idSelectionDatabaseName"></param>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetListOfDatabaseCountry")]
        [AllowAnonymous]
        public async Task<object> GetListOfDatabaseCountry(int idSelectionDatabaseName, int idSelectionProject)
        {
            return await _databaseBusiness.GetListOfDatabaseCountry(idSelectionDatabaseName, idSelectionProject);
        }

        /// <summary>
        /// SaveProjectDatabase
        /// </summary>
        /// <param name="projectDatabaseModel"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveProjectDatabase")]
        [AllowAnonymous]
        public async Task<WSEditReturn> SaveProjectDatabase([FromBody]IList<ProjectDatabaseModel> projectDatabaseModel)
        {
            return await _databaseBusiness.SaveProjectDatabase(projectDatabaseModel);
        }
    }
}
