﻿namespace XenaUI.Utils.ElasticSearch
{
    public class IndexSearchSummary
    {
        /// <summary>
        /// key
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// Count
        /// </summary>    
        public long? Count { get; set; }

        public IndexSearchSummary ShallowCopy()
        {
            return (IndexSearchSummary)this.MemberwiseClone();
        }

    }
}
