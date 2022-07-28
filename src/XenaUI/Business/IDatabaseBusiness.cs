using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
  public interface IDatabaseBusiness
  {
        /// <summary>
        /// GetListOfDatabaseNames
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetListOfDatabaseNames(int idSelectionProject);

        /// <summary>
        /// GetListOfDatabaseCountry
        /// </summary>
        /// <param name="idSelectionDatabaseName"></param>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetListOfDatabaseCountry(int idSelectionDatabaseName, int idSelectionProject);

        /// <summary>
        /// SaveProjectDatabase
        /// </summary>
        /// <param name="projectDatabaseModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectDatabase(IList<ProjectDatabaseModel> projectDatabaseModel);
    }
}

