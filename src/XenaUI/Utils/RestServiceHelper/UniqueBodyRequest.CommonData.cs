using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class CommonCreateQueueData : Data
    {
        /// <summary>
        /// IdRepAppSystemScheduleServiceName
        /// </summary>
        public string IdRepAppSystemScheduleServiceName { get; set; }

        private string jSONText = "{}";
        /// <summary>
        /// JSONText
        /// </summary>
        public string JSONText { get { return jSONText; } set { if (!string.IsNullOrEmpty(value)) jSONText = value; } }
    }

    public class CommonDeleteQueuesData : Data
    {
        /// <summary>
        /// QueuesId
        /// </summary>
        public string QueuesId { get; set; }
    }

    public class ImageGalleryData : Data
    {
        /// <summary>
        /// IdSharingTreeGroups
        /// </summary>
        public int? IdSharingTreeGroups { get; set; }
    }

    /// <summary>
    /// SharingTreeGroupsData
    /// </summary>
    public class SharingTreeGroupsData: Data
    {
        /// <summary>
        /// IdSharingTreeGroups
        /// </summary>
        public int? IdSharingTreeGroups { get; set; }

        /// <summary>
        /// Slave2IdSharingTreeGroups
        /// </summary>
        public int? Slave2IdSharingTreeGroups { get; set; }
        
        /// <summary>
        /// IdSharingTreeGroupsRootname
        /// </summary>
        public int? IdSharingTreeGroupsRootname { get; set; }
        
        /// <summary>
        /// GroupName
        /// </summary>
        public string GroupName { get; set; }
        
        /// <summary>
        /// SortingIndex
        /// </summary>
        public int? SortingIndex { get; set; }
        
        /// <summary>
        /// IconName
        /// </summary>
        public string IconName { get; set; }
        
        /// <summary>
        /// IsBlocked
        /// </summary>
        public bool? IsBlocked { get; set; }
        
        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }
    }

    public class DetectProcessData : Data
    {
        /// <summary>
        /// IdSharingTreeGroups
        /// </summary>
        public string IdProcess { get; set; }
    }

    public class SaveDynamicData
    {
        public List<string> IgnoredKeys { get; set; }
        public Data BaseData { get; set; }
        public Dictionary<string, object> Data { get; set; }

        public string SpObject { get; set; }
        public string SpMethodName { get; set; }


        public SaveDynamicData()
        {
            IgnoredKeys = new List<string>();
            Data = new Dictionary<string, object>();
        }
    }
}
