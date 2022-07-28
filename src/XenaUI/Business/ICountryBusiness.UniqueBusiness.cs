using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Business
{
    /// <summary>
    /// UniqueBusiness
    /// </summary>
    public class CountryBusiness : BaseBusiness, ICountryBusiness
    {
        private readonly ICountryService _countryService;
        public CountryBusiness(IHttpContextAccessor context, ICountryService CountryService) : base(context)
        {
            _countryService = CountryService;
        }

        /// <summary>
        /// GetSelectionProjectCountry
        /// </summary>
        /// <param name="idKeyValue"></param>
        /// <param name="idSelectionWidget"></param>
        /// <returns></returns>
        public async Task<object> GetSelectionProjectCountry(int idKeyValue, int? idSelectionWidget)
        {
            CountryData data = (CountryData)ServiceDataRequest.ConvertToRelatedType(typeof(CountryData));
            data.IdKeyValue = idKeyValue.ToString();
            if (idSelectionWidget != null)
            {
                data.IdSelectionWidget = idSelectionWidget.ToString();
            }
            var result = await _countryService.GetSelectionProjectCountry(data);
            return result;
        }

        /// <summary>
        /// GetCountryGroupsName
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        public async Task<object> GetCountryGroupsName(int idSelectionProject)
        {
            CountryData data = (CountryData)ServiceDataRequest.ConvertToRelatedType(typeof(CountryData));
            data.IdSelectionProject = idSelectionProject.ToString();
            var result = await _countryService.GetListOfCampaign(data);
            return result;
        }

        /// <summary>
        /// GetCountryGroupsList
        /// </summary>
        /// <param name="idRepCountryLangaugeGroupsName"></param>
        /// <returns></returns>
        public async Task<object> GetCountryGroupsList(int idRepCountryLangaugeGroupsName)
        {
            CountryData data = (CountryData)ServiceDataRequest.ConvertToRelatedType(typeof(CountryData));
            data.IdRepCountryLangaugeGroupsName = idRepCountryLangaugeGroupsName.ToString();
            var result = await _countryService.GetCountryGroupsList(data);
            return result;
        }

        /// <summary>
        /// SaveProjectCountry
        /// </summary>
        /// <param name="projectCountryModel"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveProjectCountry(IList<ProjectCountryModel> projectCountryModel)
        {
            CountryCreateData data = (CountryCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(CountryCreateData));
            Common.CreateSaveDataWithArray(data, projectCountryModel, "ProjectCoutry");
            var result = await _countryService.SaveProjectCountry(data);
            return result;
        }

        /// <summary>
        /// SaveCountryGroups
        /// </summary>
        /// <param name="countryGroupModel"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveCountryGroups(CountryGroupModel countryGroupModel)
        {
            CountryCreateData data = (CountryCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(CountryCreateData));
            if (countryGroupModel.IdRepCountryLangaugeGroupsName != null && !string.IsNullOrEmpty(countryGroupModel.IdRepCountryLangaugeGroupsName.ToString()))
                data.IdRepCountryLangaugeGroupsName = countryGroupModel.IdRepCountryLangaugeGroupsName.ToString();
            if (!string.IsNullOrEmpty(countryGroupModel.GroupsName))
                data.GroupsName = countryGroupModel.GroupsName.ToString();
            if (countryGroupModel.IsDeleted != null && !string.IsNullOrEmpty(countryGroupModel.IsDeleted.ToString()))
                data.IsDeleted = countryGroupModel.IsDeleted.ToString();

            Common.CreateSaveDataWithArray(data, countryGroupModel.ProjectCoutry, "SaveCountryGroups");
            var result = await _countryService.SaveCountryGroups(data);
            return result;
        }
    }
}
