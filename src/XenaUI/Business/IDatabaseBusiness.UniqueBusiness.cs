using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using XenaUI.Constants;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Business
{
  /// <summary>
  /// UniqueBusiness
  /// </summary>
  public class DatabaseBusiness : BaseBusiness, IDatabaseBusiness
    {
        private readonly IDatabaseService _databaseService;
        public DatabaseBusiness(IHttpContextAccessor context, IDatabaseService databaseService) : base(context)
        {
            _databaseService = databaseService;
        }


        /// <summary>
        /// GetListOfDatabaseNames
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        public async Task<object> GetListOfDatabaseNames(int idSelectionProject)
        {
            DatabaseData data = (DatabaseData)ServiceDataRequest.ConvertToRelatedType(typeof(DatabaseData));
            data.IdSelectionProject = idSelectionProject.ToString();
            var result = await _databaseService.GetListOfDatabaseNames(data);
            return result;
        }

        /// <summary>
        /// GetListOfDatabaseCountry
        /// </summary>
        /// <param name="idSelectionDatabaseName"></param>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        public async Task<object> GetListOfDatabaseCountry(int idSelectionDatabaseName, int idSelectionProject)
        {
            DatabaseData data = (DatabaseData)ServiceDataRequest.ConvertToRelatedType(typeof(DatabaseData));
            data.IdSelectionDatabaseName = idSelectionDatabaseName.ToString();
            data.IdSelectionProject = idSelectionProject.ToString();
            var result = await _databaseService.GetListOfDatabaseCountry(data);
            return result;
        }

        /// <summary>
        /// SaveProjectDatabase
        /// </summary>
        /// <param name="projectDatabaseModel"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveProjectDatabase(IList<ProjectDatabaseModel> projectDatabaseModel)
        {
            DatabaseCreateData data = (DatabaseCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(DatabaseCreateData));
            Common.CreateSaveDataWithArray(data, projectDatabaseModel, "ProjectDataBase");
            var result = await _databaseService.SaveProjectDatabase(data);
            return result;
        }
    }
}
