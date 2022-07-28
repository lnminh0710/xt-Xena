using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    public class DatabaseData : Data
    {
        /// <summary>
        /// IdSelectionProjectDatabase
        /// </summary>
        public string IdSelectionProjectDatabase { get; set; }

        /// <summary>
        /// IdSelectionDatabaseName
        /// </summary>
        public string IdSelectionDatabaseName { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public string IdSelectionProject { get; set; }
    }


    public class DatabaseCreateData : CreateData
    {
        /// <summary>
        /// IdSelectionProjectDatabase
        /// </summary>
        public int? IdSelectionProjectDatabase { get; set; }

        /// <summary>
        /// IdSelectionDatabaseName
        /// </summary>
        public int? IdSelectionDatabaseName { get; set; }

        /// <summary>
        /// IdSelectionProject
        /// </summary>
        public int? IdSelectionProject { get; set; }

        /// <summary>
        /// Priority
        /// </summary>
        public int? Priority { get; set; }

        /// <summary>
        /// QtyFoundet
        /// </summary>
        public int? QtyFoundet { get; set; }

        /// <summary>
        /// QtyUsed
        /// </summary>
        public int? QtyUsed { get; set; }

        /// <summary>
        /// QtyToNeeded
        /// </summary>
        public int? QtyToNeeded { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? IsActive { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? IsDeleted { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? _DataBase_IsActive { get; set; }
    }
}
