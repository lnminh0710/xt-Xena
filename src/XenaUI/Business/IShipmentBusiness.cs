using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;

namespace XenaUI.Business
{
    public interface IShipmentBusiness
    {
        Task<ColissimoResponseModel> ProcessRequestShipment(string idOfOrder, Dictionary<string, object>  datax);

    }
}

