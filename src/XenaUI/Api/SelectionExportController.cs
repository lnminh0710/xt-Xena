using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class SelectionExportController : BaseController
    {
        private readonly ISelectionExportBusiness _selectionExportBusiness;
        private IHostingEnvironment _environment;
        private readonly AppSettings _appSettings;

        public SelectionExportController(ISelectionExportBusiness selectionExportBusiness, IHostingEnvironment environment, IOptions<AppSettings> appSettings)
        {
            _selectionExportBusiness = selectionExportBusiness;
            _environment = environment;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// GetDataExport
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <param name="idCountryLanguage"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetDataExport")]
        public async Task<object> GetDataExport(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry)
        {
            return await _selectionExportBusiness.GetDataExport(idSelectionProject, idCountryLanguage, idSelectionProjectCountry);
        }

        [HttpGet]
        [Route("ExportMediaCode")]
        public async Task<object> ExportMediaCode(string idSelectionProject, string projectName, string fileType)
        {
            return await _selectionExportBusiness.ExportMediaCode(idSelectionProject, projectName, isExportXlsFile: fileType == "xls");
        }

        [HttpGet]
        [Route("ExportData")]
        public async Task<object> ExportData(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry, string fileType, string csvDelimiter)
        {
            return await _selectionExportBusiness.ExportDataExport(idSelectionProject, idCountryLanguage, idSelectionProjectCountry, isExportCsvFile: fileType == "csv", csvDelimiter: csvDelimiter, isExportXlsFile: fileType == "xls");
        }

        [HttpGet]
        [Route("ExportAll")]
        public async Task<object> ExportAll(string idSelectionProject, string projectName, string email, string fileType, string csvDelimiter)
        {
            return await _selectionExportBusiness.ExportAll(idSelectionProject, projectName, email, isExportCsvFile: fileType == "csv", csvDelimiter: csvDelimiter, isExportXlsFile: fileType == "xls");
        }
    }
}
