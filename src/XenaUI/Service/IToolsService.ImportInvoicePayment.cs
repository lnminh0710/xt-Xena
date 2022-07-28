using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public partial class ToolsService
    {
        public Task<object> GetImportInvoiceFiles(Data data)
        {
            data.MethodName = "SpAppBackOffice";
            data.Object = "GetImportInvoiceFilesToExec";
            return GetDataWithMapTypeIsNone(data);
        }
    }
}
