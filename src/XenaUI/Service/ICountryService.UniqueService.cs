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
    /// CountryService
    /// </summary>
    public class CountryService : BaseUniqueServiceRequest, ICountryService
    {
        public CountryService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public Task<object> GetSelectionProjectCountry(CountryData data)
        {
            return GetData(data, "SpCallSelectionProjectGetData", "GetSelectionProjectCountry");
        }
        public Task<object> GetListOfCampaign(CountryData data)
        {
            return GetData(data, "SpCallWidgetGetData", "GetCountryGroupsName");
        }
        public Task<object> GetCountryGroupsList(CountryData data)
        {
            return GetData(data, "SpCallWidgetGetData", "GetCountryGroupsList");
        }

        public Task<WSEditReturn> SaveProjectCountry(CountryCreateData data)
        {
            return SaveData(data, "SpCallSelectionProject", "ProjectCoutry");
        }

        public Task<WSEditReturn> SaveCountryGroups(CountryCreateData data)
        {
            return SaveData(data, "SpCallWidgetDataChange", "SaveCountryGroups");
        }
    }
}
