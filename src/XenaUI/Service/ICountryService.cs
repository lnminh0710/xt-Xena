using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
  /// <summary>
  /// IUniqueService
  /// </summary>
  public interface ICountryService
  {
        /// <summary>
        /// GetSelectionProject
        /// </summary>
        /// <param name="countryData"></param>
        /// <returns></returns>
        Task<object> GetSelectionProjectCountry(CountryData countryData);

        /// <summary>
        /// GetListOfCampaign
        /// </summary>
        /// <param name="countryData"></param>
        /// <returns></returns>
        Task<object> GetListOfCampaign(CountryData countryData);

        /// <summary>
        /// GetCountryGroupsList
        /// </summary>
        /// <param name="countryData"></param>
        /// <returns></returns>
        Task<object> GetCountryGroupsList(CountryData countryData);

        /// <summary>
        /// SaveProjectCountry
        /// </summary>
        /// <param name="countryCreateData"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectCountry(CountryCreateData countryCreateData);

        /// <summary>
        /// SaveCountryGroups
        /// </summary>
        /// <param name="countryCreateData"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveCountryGroups(CountryCreateData countryCreateData);
    }
}
