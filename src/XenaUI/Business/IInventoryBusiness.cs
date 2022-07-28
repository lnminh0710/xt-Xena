using System.Threading.Tasks;
using XenaUI.Models;

namespace XenaUI.Business
{
    public interface IInventoryBusiness
    {
        Task<object> ImportFileInventory(InventoryImportFileModel model);
    }
}
