using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IUserBusiness
    {
        /// <summary>
        /// GetUserById
        /// </summary>
        /// <param name="idPerson"></param>
        /// <returns></returns>
        Task<object> GetUserById(int? idPerson);

        /// <summary>
        /// ListUserRoleByUserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<object> ListUserRoleByUserId(string userId);

        /// <summary>
        /// ListUserRoleInclueUserId
        /// </summary>
        /// <param name="idPerson"></param>
        /// <returns></returns>
        Task<object> ListUserRoleInclueUserId(int? idPerson);

        /// <summary>
        /// GetAllUserRole
        /// </summary>
        /// <returns></returns>
        Task<object> GetAllUserRole();

        /// <summary>
        /// CheckExistUserByField
        /// </summary>
        /// <param name="fieldName"></param>
        /// <param name="fieldValue"></param>
        /// <returns></returns>
        Task<object> CheckExistUserByField(string fieldName, string fieldValue);

        /// <summary>
        /// SaveUserProfile
        /// </summary>
        /// <param name="model"></param>
        /// <param name="domain"></param>
        /// <returns></returns>
        Task<object> SaveUserProfile(UserSaving model, HttpContext context, string domain);

        /// <summary>
        /// SaveRoleForUser
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> SaveRoleForUser(IList<UserRoleUpdate> model, HttpContext context, string isSetDefaultRole = null);

        /// <summary>
        /// SaveUserWidgetLayout
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> SaveUserWidgetLayout(UserWidgetLayoutUpdate model, HttpContext context);

        /// <summary>
        /// GetUserFunctionList
        /// </summary>
        /// <param name="idLoginRoles"></param>
        /// <returns></returns>
        Task<object> GetUserFunctionList(string idLoginRoles);

        /// <summary>
        /// AssignRoleToMultipleUser
        /// </summary>
        /// <param name="idLogins"></param>
        /// <param name="idLoginRoles"></param>
        /// <returns></returns>
        Task<object> AssignRoleToMultipleUser(string idLogins, string idLoginRoles);

        /// <summary>
        /// GetWorkspaceTemplate
        /// </summary>
        /// <param name="objectNr"></param>
        /// <returns></returns>
        Task<object> GetWorkspaceTemplate(string objectNr);

        /// <summary>
        /// GetWorkspaceTemplateSharing
        /// </summary>
        /// <param name="idWorkspaceTemplate"></param>
        /// <param name="objectNr"></param>
        /// <returns></returns>
        Task<object> GetWorkspaceTemplateSharing(string idWorkspaceTemplate, string objectNr);

        /// <summary>
        /// ApplyWorkspaceTemplate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> ApplyWorkspaceTemplate(UserModuleWorkspaceApply model);


        /// <summary>
        /// ApplyWorkspaceTemplateAll
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<object> ApplyWorkspaceTemplateAll(UserModuleWorkspaceApply model);

        /// <summary>
        /// SaveWorkspaceTemplate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWorkspaceTemplate(UserModuleWorkspaceSave model);

        /// <summary>
        /// SaveWorkspaceTemplateAll
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveWorkspaceTemplateAll(UserModuleWorkspaceSave model);

        /// <summary>
        /// DeleteWorkspaceTemplate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> DeleteWorkspaceTemplate(UserModuleWorkspaceDelete model);

        /// <summary>
        /// SaveDefaultWorkspaceTemplate
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<WSEditReturn> SaveDefaultWorkspaceTemplate(UserModuleWorkspaceDefault model);
    }
}

