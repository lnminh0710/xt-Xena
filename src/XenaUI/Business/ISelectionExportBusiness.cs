using System.Threading.Tasks;
using XenaReport.Models;

namespace XenaUI.Business
{
    public interface ISelectionExportBusiness
    {
        /// <summary>
        /// GetDataExport
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <param name="idCountryLanguage"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        Task<object> GetDataExport(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry);

        Task<ReportFileInfo> ExportMediaCode(string idSelectionProject, string projectName, bool isExportXlsFile = false);

        Task<ReportFileInfo> ExportDataExport(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry, bool isZip = true, bool isExportCsvFile = false, string csvDelimiter = ",", bool isExportXlsFile = false);

        Task<ReportFileInfo> ExportAll(string idSelectionProject, string projectName, string email, bool isExportCsvFile = false, string csvDelimiter = ",", bool isExportXlsFile = false);
    }
}
