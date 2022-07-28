using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class SearchData : Data
    {
        /// <summary>
        /// Keyword
        /// </summary>
        public string Keyword { get; set; }

        /// <summary>
        /// PageIndex
        /// </summary>
        public int PageIndex { get; set; }

        /// <summary>
        /// PageSize
        /// </summary>
        public int PageSize { get; set; }
    }
}
