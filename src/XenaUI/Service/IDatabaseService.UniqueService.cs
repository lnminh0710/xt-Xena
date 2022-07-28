using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace XenaUI.Service
{
    /// <summary>
    /// DatabaseService
    /// </summary>
    public class DatabaseService : BaseUniqueServiceRequest, IDatabaseService
    {
        public DatabaseService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public Task<object> GetListOfDatabaseNames(DatabaseData databaseData)
        {
            return GetData(databaseData, "SpCallSelectionProjectGetData", "GetListOfDatabaseNames");
        }
        public Task<object> GetListOfDatabaseCountry(DatabaseData databaseData)
        {
            return GetData(databaseData, "SpCallSelectionProjectGetData", "GetListOfDatabaseCountry");
        }
        public Task<WSEditReturn> SaveProjectDatabase(DatabaseCreateData databaseCreateData)
        {
            return SaveData(databaseCreateData, "SpCallSelectionProject", "ProjectDataBase");
        }
    }
}
