using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface ICommonService
    {
        /// <summary>
        /// GetSystemInfo
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetSystemInfo(Data data);

        /// <summary>
        /// CreateQueue
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> CreateQueue(CommonCreateQueueData data);

        /// <summary>
        /// DeleteQueues
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteQueues(CommonDeleteQueuesData data);

        #region [Folder]

        /// <summary>
        /// GetImageGalleryFolder
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetImageGalleryFolder(Data data);
        
        /// <summary>
        /// GetImagesByFolderId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetImagesByFolderId(ImageGalleryData data);

        /// <summary>
        /// SavingSharingTreeGroups
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SavingSharingTreeGroups(SharingTreeGroupsData data);

        /// <summary>
        /// EditImagesGallery
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> EditImagesGallery(CampaignCreateData data);

        #endregion

        Task<JArray> GetReportNotesForOuput(Data data, string fieldName, string value);

        Task<WSEditReturn> DetectProcess(DetectProcessData data);
        Task<JArray> CallBackToDBByDynamicSP(SaveDynamicData saveData);
    }    
}

