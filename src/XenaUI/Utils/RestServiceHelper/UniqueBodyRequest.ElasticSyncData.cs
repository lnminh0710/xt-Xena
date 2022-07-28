using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    /// <summary>
    /// ElasticSyncData
    /// </summary>
    public class ElasticSyncData : Data
    {
        /// <summary>
        /// KeyId
        /// </summary>
        public string KeyId { get; set; }

        /// <summary>
        /// StartDate
        /// </summary>
        public string StartDate { get; set; }

        /// <summary>
        /// IdPersonType
        /// </summary>
        public int? IdPersonType { get; set; }
    }
}
