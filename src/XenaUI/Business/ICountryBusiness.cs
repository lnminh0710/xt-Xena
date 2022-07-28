using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
  public interface ICountryBusiness
    {
        /// <summary>
        /// GetSelectionProjectCountry
        /// </summary>
        /// <param name="idKeyValue"></param>
        /// <param name="idSelectionWidget"></param>
        /// <returns></returns>
        Task<object> GetSelectionProjectCountry(int idKeyValue, int? idSelectionWidget);

        /// <summary>
        /// GetCountryGroupsName
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetCountryGroupsName(int idSelectionProject);

        /// <summary>
        /// GetCountryGroupsList
        /// </summary>
        /// <param name="idRepCountryLangaugeGroupsName"></param>
        /// <returns></returns>
        Task<object> GetCountryGroupsList(int idRepCountryLangaugeGroupsName);

        /// <summary>
        /// SaveProjectCountry
        /// </summary>
        /// <param name="projectCountryModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectCountry(IList<ProjectCountryModel> projectCountryModel);

        /// <summary>
        /// SaveCountryGroups
        /// </summary>
        /// <param name="countryGroupModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveCountryGroups(CountryGroupModel countryGroupModel);
    }
}
