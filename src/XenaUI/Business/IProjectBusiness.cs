using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IProjectBusiness
    {
        /// <summary>
        /// GetSelectionProject
        /// </summary>
        /// <param name="idSelectionProject"></param>
        /// <returns></returns>
        Task<object> GetSelectionProject(int idSelectionProject);

        /// <summary>
        /// GetListOfCampaign
        /// </summary>
        /// <returns></returns>
        Task<object> GetListOfCampaign();

        /// <summary>
        /// GetMediaCodePricing
        /// </summary>
        /// <returns></returns>
        Task<object> GetMediaCodePricing(int idSelectionProject, int idSelectionProjectCountry);

        /// <summary>
        /// InsertMediaCodeToCampaign
        /// </summary>
        /// <returns></returns>
        Task<object> InsertMediaCodeToCampaign(string idSelectionProject, string idSelectionWidget);

        /// <summary>
        /// SaveProject
        /// </summary>
        /// <param name="projectModel"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProject(IList<ProjectModel> projectModel);

        /// <summary>
        /// SaveProjectExclude
        /// </summary>
        /// <param name="projectExclude"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveProjectExclude(ProjectExclude projectExclude);

        /// <summary>
        /// Save MediaCodePricing
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveMediaCodePricing(ProjectSaveMediaCodePricingModel model);

        /// <summary>
        /// GetSelectionToExclude
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionToExclude(string idSelectionProject);

        /// <summary>
        /// GetSelectionIsExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionIsExcluded(string idSelectionProject);

        /// <summary>
        /// GetSelectionCountriesExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionCountriesExcluded(string idSelectionProject);

        /// <summary>
        /// GetSelectionMediacodeExcluded
        /// </summary>
        /// <returns></returns>
        Task<object> GetSelectionMediacodeExcluded(string idSelectionProject, string idSelectionProjectCountry);
    }
}

