using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public class SelectionExportService : BaseUniqueServiceRequest, ISelectionExportService
    {
        public SelectionExportService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public Task<object> GetDataExport(SelectionExportData data)
        {
            return GetData(data, "SpCallProjectDataExport", "DataExport");
        }

        public Task<object> GetDataExportMediaCode(SelectionExportData data)
        {
            return GetData(data, "SpCallProjectDataExport", "MediaCodeExport");
        }
    }
}
