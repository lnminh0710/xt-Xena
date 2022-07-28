using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface IUserService
    {
        /// <summary>
        /// GetUserById
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetUserById(UserProfileGetData data);

        /// <summary>
        /// ListUserRoleByUserId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> ListUserRoleByUserId(UserProfileGetData data);

        /// <summary>
        /// GetAllUserRole
        /// </summary>
        /// <returns></returns>
        Task<object> GetAllUserRole(UserProfileGetData data);

        /// <summary>
        /// ListUserRoleInclueUserId
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> ListUserRoleInclueUserId(UserProfileGetData data);

        /// <summary>
        /// UserProfileData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> CheckExistUserByField(UserProfileData data);

        /// <summary>
        /// SaveUserProfile
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveUserProfile(UserProfileData data);

        /// <summary>
        /// SaveRoleForUser
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveRoleForUser(UserProfileGetData data);

        /// <summary>
        /// SaveRoleForUser
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> SaveUserWidgetLayout(UserWidgetLayoutUpdateData data);

        /// <summary>
        /// GetUserFunctionList
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetUserFunctionList(UserFunctionListGetData data);

        /// <summary>
        /// AssignRoleToMultipleUser
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> AssignRoleToMultipleUser(UserRolesUpdateData data);

        /// <summary>
        /// GetWorkspaceTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWorkspaceTemplate(UserModuleWorkspaceGet data);

        /// <summary>
        /// GetWorkspaceTemplateSharing
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWorkspaceTemplateSharing(UserModuleWorkspaceGetSharing data);

        /// <summary>
        /// ApplyWorkspaceTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> ApplyWorkspaceTemplate(UserModuleWorkspaceApplyData data);

        /// <summary>
        /// ApplyWorkspaceTemplateAll
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> ApplyWorkspaceTemplateAll(UserModuleWorkspaceApplyData data);

        /// <summary>
        /// SaveWorkspaceTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWorkspaceTemplate(UserModuleWorkspaceSaveData data);

        /// <summary>
        /// SaveWorkspaceTemplateAll
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWorkspaceTemplateAll(UserModuleWorkspaceSaveData data);

        /// <summary>
        /// DeleteWorkspaceTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteWorkspaceTemplate(UserModuleWorkspaceDeleteData data);

        /// <summary>
        /// SaveDefaultWorkspaceTemplate
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveDefaultWorkspaceTemplate(UserModuleWorkspaceDefaultData data);
    }
}

