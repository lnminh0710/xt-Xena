using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface ISelectionExportService
    {
        Task<object> GetDataExport(SelectionExportData selectionExportData);

        Task<object> GetDataExportMediaCode(SelectionExportData selectionExportData);
    }
}
