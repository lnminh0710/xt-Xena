using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Business
{
    /// <summary>
    /// ProjectBusiness
    /// </summary>
    public class ProjectBusiness : BaseBusiness, IProjectBusiness
    {
        private readonly IProjectService _projectService;
        private readonly IElasticSearchSyncBusiness _elasticSearchSyncBusiness;
        public ProjectBusiness(IHttpContextAccessor context, IProjectService projectService, IElasticSearchSyncBusiness elasticSearchSyncBusiness) : base(context)
        {
            _projectService = projectService;
            _elasticSearchSyncBusiness = elasticSearchSyncBusiness;
        }

        /// <summary>
        /// GetAllSearchModules
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetSelectionProject(int idSelectionProject)
        {
            ProjectData data = (ProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectData));
            data.IdSelectionProject = idSelectionProject.ToString();
            var result = await _projectService.GetSelectionProject(data);
            return result;
        }

        /// <summary>
        /// GetAllSearchModules
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetMediaCodePricing(int idSelectionProject, int idSelectionProjectCountry)
        {
            MediacodePricingCountryProjectData data = (MediacodePricingCountryProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(MediacodePricingCountryProjectData));
            data.IdSelectionProject = idSelectionProject.ToString();
            data.IdSelectionProjectCountry = idSelectionProjectCountry.ToString();
            var result = await _projectService.GetMediaCodePricing(data);
            return result;
        }

        /// <summary>
        /// InsertMediaCodeToCampaign
        /// </summary>
        /// <returns></returns>
        public async Task<object> InsertMediaCodeToCampaign(string idSelectionProject, string idSelectionWidget)
        {
            InsertMediaCodeToCampaign data = (InsertMediaCodeToCampaign)ServiceDataRequest.ConvertToRelatedType(typeof(InsertMediaCodeToCampaign));
            data.IdSelectionProject = idSelectionProject.ToString();
            data.IdSelectionWidget = idSelectionWidget.ToString();
            data.CrudType = "GetData";
            data.Mode = "Administion";
            var result = await _projectService.InsertMediaCodeToCampaign(data);
            return result;
        }

        /// <summary>
        /// GetAllSearchModules
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetListOfCampaign()
        {
            ProjectData data = (ProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectData));
            var result = await _projectService.GetSelectionProject(data);
            return result;
        }

        /// <summary>
        /// SaveProject
        /// </summary>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveProject(IList<ProjectModel> projectModel)
        {
            ProjectCreateData data = (ProjectCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectCreateData));
            Common.CreateSaveDataWithArray(data, projectModel, "Project");
            var result = await _projectService.SaveProject(data);

            // Sync to elastic search
            if (result != null && !string.IsNullOrWhiteSpace(result.ReturnID))
            {
                _elasticSearchSyncBusiness.SyncToElasticSearch(new ElasticSyncModel
                {
                    ModuleType = (projectModel[0].IdRepSelectionProjectType == (int)ProjectType.Campaign) ? ModuleType.SelectionCampagin : ModuleType.SelectionBroker,
                    KeyId = result.ReturnID
                });
            }
            return result;
        }

        /// <summary>
        /// SaveProjectExclude
        /// </summary>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveProjectExclude(ProjectExclude projectExclude)
        {
            ProjectExcludeData data = (ProjectExcludeData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectExcludeData));
            data.IdSelectionProject = projectExclude.IdSelectionProject;
            data.JSONText = data.CreateJsonText("ProjectExclude", projectExclude.ProjectExcludeData);

            var result = await _projectService.SaveProjectExclude(data);

            return result;
        }

        /// <summary>
        /// Save MediaCodePricing
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveMediaCodePricing(ProjectSaveMediaCodePricingModel model)
        {
            ProjectSaveMediaCodePricingData data = (ProjectSaveMediaCodePricingData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectSaveMediaCodePricingData));
            data.IdSelectionProject = model.IdSelectionProject;
            data.JSONText = data.CreateJsonText("MediaCodePricing", model.MediaCodePricing);
            //Common.CreateSaveDataWithArray(data, model.MediaCodePricing, "MediaCodePricing");
            var result = await _projectService.SaveMediaCodePricing(data);
            return result;
        }

        /// <summary>
        /// GetSelectionToExclude
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetSelectionToExclude(string idSelectionProject)
        {
            ProjectData data = (ProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectData));
            data.IdSelectionProject = idSelectionProject;
            var result = await _projectService.GetSelectionToExclude(data);
            return result;
        }

        /// <summary>
        /// GetSelectionIsExcluded
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetSelectionIsExcluded(string idSelectionProject)
        {
            ProjectData data = (ProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectData));
            data.IdSelectionProject = idSelectionProject;
            var result = await _projectService.GetSelectionIsExcluded(data);
            return result;
        }

        /// <summary>
        /// GetSelectionCountriesExcluded
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetSelectionCountriesExcluded(string idSelectionProject)
        {
            ProjectData data = (ProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(ProjectData));
            data.IdSelectionProject = idSelectionProject;
            var result = await _projectService.GetSelectionCountriesExcluded(data);
            return result;
        }

        /// <summary>
        /// GetSelectionMediacodeExcluded
        /// </summary>
        /// <returns></returns>
        public async Task<object> GetSelectionMediacodeExcluded(string idSelectionProject, string idSelectionProjectCountry)
        {
            MediacodePricingCountryProjectData data = (MediacodePricingCountryProjectData)ServiceDataRequest.ConvertToRelatedType(typeof(MediacodePricingCountryProjectData));
            data.IdSelectionProject = idSelectionProject;
            data.IdSelectionProjectCountry = idSelectionProjectCountry;
            var result = await _projectService.GetSelectionMediacodeExcluded(data);
            return result;
        }
    }
}
