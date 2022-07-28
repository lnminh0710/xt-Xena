using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IPrintingBusiness
    {
        Task<object> GetCampaigns(string objectName, string secondInstance);

        Task<object> ConfirmGetCampaign(PrintingCampaignConfirmModel model);

        Task<PrintingDownloadTemplatesResponse> DownloadTemplates(PrintingDownloadTemplatesModel model, string zipFileName = null);

        Task<PrintingDownloadTemplatesResponse> DownloadArticleMedia(IList<ArticleMedia> articleMediaList, string rootUploadFolderPath, string uploadFolder);
    }
}

