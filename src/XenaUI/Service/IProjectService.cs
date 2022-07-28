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
    public interface IProjectService
    {
        /// <summary>
        /// GetSelectionProject
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionProject(ProjectData projectData);
        /// <summary>
        /// GetMediaCodePricing
        /// </summary>
        /// <returns></returns>
        Task<object> GetMediaCodePricing(MediacodePricingCountryProjectData projectData);
        /// <summary>
        /// InsertMediaCodeToCampaign
        /// </summary>
        /// <returns></returns>
        Task<object> InsertMediaCodeToCampaign(InsertMediaCodeToCampaign projectData);
        /// <summary>
        /// GetListOfCampaign
        /// </summary>
        /// <returns></returns>
        Task<object> GetListOfCampaign(ProjectData projectData);
        /// <summary>
        /// SaveProject
        /// </summary>
        /// <returns></returns>
        Task<WSEditReturn> SaveProject(ProjectCreateData projectData);

        /// <summary>
        /// SaveProjectExclude
        /// </summary>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectExclude(ProjectExcludeData projectExclude);

        /// <summary>
        /// Save MediaCodePricing
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveMediaCodePricing(ProjectSaveMediaCodePricingData data);

        /// <summary>
        /// GetSelectionToExclude
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionToExclude(ProjectData projectData);

        /// <summary>
        /// GetSelectionIsExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionIsExcluded(ProjectData projectData);

        /// <summary>
        /// GetSelectionCountriesExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionCountriesExcluded(ProjectData projectData);

        /// <summary>
        /// GetSelectionMediacodeExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionMediacodeExcluded(ProjectData projectData);
    }
}

