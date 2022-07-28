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
    /// FrequencyBusiness
    /// </summary>
    public class FrequencyBusiness : BaseBusiness, IFrequencyBusiness
    {
        private readonly IFrequencyService _frequencyService;
        private readonly IElasticSearchSyncBusiness _elasticSearchSyncBusiness;
        public FrequencyBusiness(IHttpContextAccessor context, IFrequencyService frequencyService, IElasticSearchSyncBusiness elasticSearchSyncBusiness) : base(context)
        {
            _frequencyService = frequencyService;
            _elasticSearchSyncBusiness = elasticSearchSyncBusiness;
        }

        /// <summary>
        /// RebuildFrequencies
        /// </summary>
        /// <param name="idSelectionFrequency"></param>
        /// <returns></returns>
        public async Task<object> RebuildFrequencies(int idSelectionFrequency)
        {
            FrequencyData data = (FrequencyData)ServiceDataRequest.ConvertToRelatedType(typeof(FrequencyData));
            data.IdSelectionProject = idSelectionFrequency.ToString();
            var result = await _frequencyService.RebuildFrequencies(data);
            return result;
        }

        /// <summary>
        /// GetFrequencyBusyIndicator
        /// </summary>
        /// <param name="idSelectionFrequency"></param>
        /// <returns></returns>
        public async Task<object> GetFrequencyBusyIndicator(int idSelectionFrequency)
        {
            FrequencyData data = (FrequencyData)ServiceDataRequest.ConvertToRelatedType(typeof(FrequencyData));
            data.IdSelectionProject = idSelectionFrequency.ToString();
            var result = await _frequencyService.GetFrequencyBusyIndicator(data);
            return result;
        }

        /// <summary>
        /// GetFrequency
        /// </summary>
        /// <param name="idSelectionFrequency"></param>
        /// <param name="idSelectionFrequencyCountry"></param>
        /// <returns></returns>
        public async Task<object> GetFrequency(int idSelectionFrequency, int idSelectionFrequencyCountry)
        {
            FrequencyData data = (FrequencyData)ServiceDataRequest.ConvertToRelatedType(typeof(FrequencyData));
            data.IdSelectionProject = idSelectionFrequency.ToString();
            data.IdSelectionProjectCountry = idSelectionFrequencyCountry.ToString();
            var result = await _frequencyService.GetFrequency(data);
            return result;
        }

        /// <summary>
        /// SaveFrequency
        /// </summary>
        /// <param name="frequencySaveModel"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveFrequency(FrequencySaveModel frequencySaveModel)
        {
            FrequencyCreateData data = (FrequencyCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(FrequencyCreateData));
            if (frequencySaveModel.IdSelectionProject != null && !string.IsNullOrEmpty(frequencySaveModel.IdSelectionProject.ToString()))
                data.IdSelectionProject = frequencySaveModel.IdSelectionProject.ToString();
            Common.CreateSaveDataWithArray(data, frequencySaveModel.Frequencies, "Frequencies");
            var result = await _frequencyService.SaveFrequency(data);
            return result;

        }
    }
}
