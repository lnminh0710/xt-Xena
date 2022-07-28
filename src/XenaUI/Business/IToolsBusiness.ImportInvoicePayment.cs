using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public partial class ToolsBusiness
    {
        public async Task<object> GetImportInvoiceFiles()
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            return await _toolsService.GetImportInvoiceFiles(data);
        }
    }
}
