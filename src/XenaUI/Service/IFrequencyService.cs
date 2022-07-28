using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// IFrequencyService
    /// </summary>
    public interface IFrequencyService
    {
        /// <summary>
        /// RebuildFrequencies
        /// </summary>
        /// <returns></returns>
        Task<object> RebuildFrequencies(FrequencyData data);

        /// <summary>
        /// GetFrequencyBusyIndicator
        /// </summary>
        /// <returns></returns>
        Task<object> GetFrequencyBusyIndicator(FrequencyData data);

        /// <summary>
        /// GetFrequency
        /// </summary>
        /// <returns></returns>
        Task<object> GetFrequency(FrequencyData data);

        /// <summary>
        /// SaveFrequency
        /// </summary>
        /// <returns></returns>
        Task<WSEditReturn> SaveFrequency(FrequencyCreateData data);
    }
}

