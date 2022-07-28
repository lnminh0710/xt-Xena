using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
  public interface IFrequencyBusiness
  {
        /// <summary>
        /// RebuildFrequencies
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> RebuildFrequencies(int idSelectionProject);

        /// <summary>
        /// GetFrequencyBusyIndicator
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetFrequencyBusyIndicator(int idSelectionProject);

        /// <summary>
        /// GetFrequency
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <param name="idSelectionProjectCountry"></param>
        /// <returns></returns>
        Task<object> GetFrequency(int idSelectionProject, int idSelectionProjectCountry);

        /// <summary>
        /// SaveFrequency
        /// </summary>
        /// <param name="frequencySaveModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveFrequency(FrequencySaveModel frequencySaveModel);
    }
}

