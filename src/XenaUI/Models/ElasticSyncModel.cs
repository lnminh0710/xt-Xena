using System;

namespace XenaUI.Models
{
    /// <summary>
    /// ElasticSyncModel
    /// </summary>
    public class ElasticSyncModel
    {
        /// <summary>
        /// ModuleType
        /// </summary>
        public ModuleType? ModuleType { get; set; }

        /// <summary>
        /// GlobalModule
        /// </summary>
        public GlobalModule GlobalModule { get; set; }

        /// <summary>
        /// Object
        /// </summary>
        public string Object { get; set; }

        /// <summary>
        /// SearchIndexKey
        /// </summary>
        public string SearchIndexKey { get; set; }

        /// <summary>
        /// KeyId
        /// </summary>
        public string KeyId { get; set; }

        /// <summary>
        /// StartDate
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        /// IdPersonType
        /// </summary>
        public int? IdPersonType { get; set; }
    }
}
