using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Utils;
using XenaUI.Models;
using Newtonsoft.Json.Linq;

namespace XenaUI.Business
{
    public interface ICommonBusiness
    {
        /// <summary>
        /// GetSystemInfo
        /// </summary>
        /// <returns></returns>
        Task<object> GetSystemInfo();

        Task<object> DedupeCheckPerson(CustomerMatchedModel person);

        Task<object> MatchingApiCheckPerson(CustomerMatchedModel person);

        /// <summary>
        /// CreateQueue
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> CreateQueue(CreateQueueModel model);

        /// <summary>
        /// DeleteQueues
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteQueues(DeleteQueuesModel model);

        #region [Folder]

        /// <summary>
        /// GetImageGalleryFolder
        /// </summary>
        /// <returns>object</returns>
        Task<object> GetImageGalleryFolder();

        /// <summary>
        /// GetImagesByFolderId
        /// </summary>
        /// <param name="folderId"></param>
        /// <returns>object</returns>
        Task<object> GetImagesByFolderId(int? folderId);

        /// <summary>
        /// SavingSharingTreeGroups
        /// </summary>
        /// <param name="model"></param>
        /// <returns>WSEditReturn</returns>
        Task<WSEditReturn> SavingSharingTreeGroups(SharingTreeGroupsModel model);
        
        /// <summary>
        /// EditImagesGallery
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> EditImagesGallery(CampaignCostFilesModel model);

        #endregion

        Task<JArray> GetReportNotesForOuput(string fieldName, string value);

        byte[] GeneratePdfFileForReportNote(JArray array, string templateFullFileName);


        Task<object> CallBackToDBByDynamicSP(Dictionary<string, object> data);
    }
}
