using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// IDatabaseService
    /// </summary>
    public interface IDatabaseService
    {
        /// <summary>
        /// GetListOfDatabaseNames
        /// </summary>
        /// <param name="databaseData"></param>
        /// <returns></returns>
        Task<object> GetListOfDatabaseNames(DatabaseData databaseData);

        /// <summary>
        /// GetListOfDatabaseCountry
        /// </summary>
        /// <param name="databaseData"></param>
        /// <returns></returns>
        Task<object> GetListOfDatabaseCountry(DatabaseData databaseData);

        /// <summary>
        /// SaveProjectDatabase
        /// </summary>
        /// <param name="databaseCreateData"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectDatabase(DatabaseCreateData databaseCreateData);
    }
}

