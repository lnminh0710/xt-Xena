using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface IPrintingService
    {
        Task<WSDataReturn> GetCampaigns(PrintingGetCampaignData data);

        Task<WSDataReturn> ConfirmGetData(PrintingCampaignConfirmData data);
    }    
}

