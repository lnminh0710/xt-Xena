using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;

namespace XenaUI.Business
{
    /// <summary>
    /// UserBusiness
    /// </summary>
    public class UserBusiness : BaseBusiness, IUserBusiness
    {
        private readonly IUserService _userService;
        private readonly AppSettings _appSettings;
        private readonly IEmailBusiness _emailBusiness;

        public UserBusiness(IHttpContextAccessor context, IOptions<AppSettings> appSettings, IUserService userService, IEmailBusiness emailBusiness) : base(context)
        {
            _userService = userService;
            _appSettings = appSettings.Value;
            _emailBusiness = emailBusiness;
        }

        public async Task<object> GetUserById(int? idPerson)
        {
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.IdPerson = idPerson == null ? "" : idPerson.Value.ToString();
            var result = await _userService.GetUserById(data);
            return result;
        }

        public async Task<object> ListUserRoleByUserId(string userId)
        {
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.JSONText = "{\"LoginRolebyUser\":[{\"IdLogin\":\"" + (string.IsNullOrEmpty(userId) ? data.IdLogin : userId) + "\"}]}";
            data.CrudType = "Read";
            var result = await _userService.ListUserRoleByUserId(data);
            return result;
        }

        public async Task<object> GetAllUserRole()
        {
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.JSONText = "{\"UserRoleList\":[{\"IdLoginRoles\":\"\"}]}";
            data.CrudType = "Read";
            var result = await _userService.GetAllUserRole(data);
            return result;
        }

        public async Task<object> ListUserRoleInclueUserId(int? idPerson)
        {
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.IdPerson = idPerson == null ? "" : idPerson.Value.ToString();
            var result = await _userService.ListUserRoleInclueUserId(data);
            return result;
        }

        public async Task<object> CheckExistUserByField(string fieldName, string fieldValue)
        {
            UserProfileData data = (UserProfileData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileData));
            switch (fieldName)
            {
                case "LoginName":
                    {
                        data.LoginName = fieldValue;
                        break;
                    }
                case "Email":
                    {
                        data.Email = fieldValue;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            var result = await _userService.CheckExistUserByField(data);
            return result;
        }

        #region SaveUserProfile
        public async Task<object> SaveUserProfile(UserSaving model, HttpContext context, string domain)
        {
            UserProfileData data = (UserProfileData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileData));
            data = (UserProfileData)Common.MappModelToData(data, model, true);
            if (model.UserProfile.Password != null)
                data.Password = Common.SHA256Hash(model.UserProfile.Password);
            var roles = JsonConvert.SerializeObject(model.UserRoles, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            });
            data.JSONText = string.Format(@"""UserRoles"":{0}", roles);
            data.JSONText = "{" + data.JSONText + "}";
            var result = await _userService.SaveUserProfile(data);
            if (model.UserProfile.IdPerson == null && !string.IsNullOrEmpty(result.ReturnID))
            {
                SendUserInformationToUserEmail(model.UserProfile, context);
            }
            return result;
        }

        private void SendUserInformationToUserEmail(UserProfile user, HttpContext context)
        {
            var domainUrl = Common.GetFullDomainUrl(context);
            Task.Run(() =>
            {
                string hrefLink = string.Format("{0}/auth/login", domainUrl);
                var emailModel = new EmailModel()
                {
                    Subject = "[No reply] Xena creates a new user",
                    ToEmail = user.Email,
                    Body = BuildEmailBody(user, hrefLink)
                };
                emailModel.ImageAttached = new List<ImageSend>
                {
                    new ImageSend()
                    {
                        Source = _emailBusiness.ImageToBase64(_appSettings.ImageLogoUrl),
                        EmbeddedId = Common.XeNaLogoCid
                    }
                };
                _emailBusiness.SendEmailWithEmbeddedImage(emailModel);
            });
        }

        private string BuildEmailBody(UserProfile user, string hrefLink)
        {
            return string.Format(@"<table style='width: 1200px;
                                    border: 1px solid #0b6599;
                                    line-height: 16px;
                                    font-size: 14px;
                                    font-family: tahoma;
                                    min-width: 400px;
                                    margin-bottom: 30px;'>
                                    <tr><td>
                                <div style='width: 100%;
                                        height: 50px;
                                        background-color: #0b6599'>
                                    <img style='width:130px' src='cid:{0}'/>
                                </div>
                                <div style='padding: 10px 40px 20px 40px;'>
                                    <h1 style='line-height: 25px'>Create new account</h1>
                                    <br/>
                                    <strong>Dear {1},</strong>
                                    <p>We has just created an account form your email <strong>{2}</strong></p>
                                    <br/>
                                    <strong>Account Information:</strong>
                                    <p style='padding-left: 20px'>Login name:&nbsp;<strong>{3}</strong></p>
                                    <p style='padding-left: 20px'>Password:&nbsp;<strong>{4}</strong></p>
                                    <br/>
                                    <p>Please click on Sign In button for starting.</p>
                                    <br/>
                                    <table style='
                                        width: 150px;
                                        height: 40px;
                                        padding: 0;
                                        background-color: #0b6599;
                                        '>
                                        <tbody><tr style='
                                            padding: 0;
                                            '>
                                            <td align='center'>
                                                <a href='{5}' style='font-size: 19px;
                                                                color: #fff;
                                                                text-decoration: none;
                                                                display: block;
                                                                padding: 0;
                                                                line-height: 45px;'>Sign In</a>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </div>
                                <div style='width: calc(100% - 20px);
                                        height: 30px;
                                        background-color: #cdcece;
                                        border-top: 1px solid #0b6599;
                                        padding-top: 20px;
                                        padding-left: 20px;'>
                                        <i>*We send you  this email for creating new account purpose*</i>
                                </div>
                            </td></tr></table>",
                Common.XeNaLogoCid,
                user.FullName,
                user.Email,
                user.LoginName,
                user.Password,
                hrefLink);
        }

        #endregion

        public async Task<object> SaveRoleForUser(IList<UserRoleUpdate> roles, HttpContext context, string isSetDefaultRole = null)
        {
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.JSONText = "{\"LoginRolebyUser\":[";
            for (int i = 0; i < roles.Count; i++)
            {
                data.JSONText = data.JSONText +
                    "{\"IdLoginRolesLoginGw\":\"" + roles[i].IdLoginRolesLoginGw + "\"" +
                    ",\"IdLoginRoles\":\"" + roles[i].IdLoginRoles + "\"" +
                    ",\"IdLogin\":\"" + roles[i].IdLogin + "\"" +
                    ",\"IsDefault\":\"" + roles[i].IsDefault + "\"}"
                    + (i != roles.Count - 1 ? "," : "");
            }
            data.JSONText = data.JSONText + "]}";
            data.IsSetDefaultRole = isSetDefaultRole;

            var result = await _userService.ListUserRoleByUserId(data);
            return result;
        }

        public async Task<object> SaveUserWidgetLayout(UserWidgetLayoutUpdate model, HttpContext context)
        {
            UserWidgetLayoutUpdateData data = (UserWidgetLayoutUpdateData)ServiceDataRequest.ConvertToRelatedType(typeof(UserWidgetLayoutUpdateData));
            data.ObjectNr = model.ObjectNr;
            data.IdMember = model.IdMember;

            var result = await _userService.SaveUserWidgetLayout(data);
            return result;
        }


        /// <summary>
        /// GetUserFunctionList
        /// </summary>
        /// <param name="idLoginRoles"></param>
        /// <returns></returns>
        public async Task<object> GetUserFunctionList(string idLoginRoles)
        {
            UserFunctionListGetData data = (UserFunctionListGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserFunctionListGetData));
            data.IdLoginRoles = idLoginRoles + string.Empty;
            data.IsAll = "0";
            var result = await _userService.GetUserFunctionList(data);
            return result;
        }

        /// <summary>
        /// Assign Role List To Multiple Users
        /// </summary>E
        /// <param name="idLogins"> List ids string. Ex: '9,10,11,12'</param>
        /// <param name="idLoginRoles">List ids string. Ex: '9,10,11,12'</param>
        /// <returns></returns>
        public async Task<object> AssignRoleToMultipleUser(string idLogins, string idLoginRoles)
        {
            UserRolesUpdateData data = (UserRolesUpdateData)ServiceDataRequest.ConvertToRelatedType(typeof(UserRolesUpdateData));
            data.ListOfIdLogin = idLogins;
            data.ListOfIdLoginRoles = idLoginRoles;
            var result = await _userService.AssignRoleToMultipleUser(data);
            return result;
        }

        public async Task<object> GetWorkspaceTemplate(string objectNr)
        {
            UserModuleWorkspaceGet data = (UserModuleWorkspaceGet)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceGet));
            data.ObjectNr = objectNr;
            var result = await _userService.GetWorkspaceTemplate(data);
            return result;
        }

        public async Task<object> GetWorkspaceTemplateSharing(string idWorkspaceTemplate, string objectNr)
        {
            UserModuleWorkspaceGetSharing data = (UserModuleWorkspaceGetSharing)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceGetSharing));
            data.IdWorkspaceTemplate = idWorkspaceTemplate;
            data.ObjectNr = objectNr;
            var result = await _userService.GetWorkspaceTemplateSharing(data);
            return result;
        }

        public async Task<object> ApplyWorkspaceTemplate(UserModuleWorkspaceApply model)
        {
            UserModuleWorkspaceApplyData data = (UserModuleWorkspaceApplyData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceApplyData));
            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.ObjectNr = model.ObjectNr;

            var result = await _userService.ApplyWorkspaceTemplate(data);
            return result;
        }

        public async Task<object> ApplyWorkspaceTemplateAll(UserModuleWorkspaceApply model)
        {
            UserModuleWorkspaceApplyData data = (UserModuleWorkspaceApplyData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceApplyData));
            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.ObjectNr = model.ObjectNr;

            var result = await _userService.ApplyWorkspaceTemplateAll(data);
            return result;
        }

        public async Task<WSEditReturn> SaveWorkspaceTemplate(UserModuleWorkspaceSave model)
        {
            UserModuleWorkspaceSaveData data = (UserModuleWorkspaceSaveData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceSaveData));

            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.IdWorkspaceTemplateDestination = model.IdWorkspaceTemplateDestination;
            data.WorkSpaceName = model.WorkSpaceName;
            data.ObjectNr = model.ObjectNr;
            data.IsForAllUser = model.IsForAllUser;
            data.IsUserDefault = model.IsUserDefault;
            data.IsOwner = model.IsOwner;
            data.IsActive = model.IsActive;
            data.IsDeleted = model.IsDeleted;
            data.JSONWorkspaceTemplateSharing = data.CreateJsonText("WorkspaceTemplateSharing", model.ShareList);

            var result = await _userService.SaveWorkspaceTemplate(data);
            return result;
        }

        public async Task<WSEditReturn> SaveWorkspaceTemplateAll(UserModuleWorkspaceSave model)
        {
            UserModuleWorkspaceSaveData data = (UserModuleWorkspaceSaveData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceSaveData));

            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.IdWorkspaceTemplateDestination = model.IdWorkspaceTemplateDestination;
            data.WorkSpaceName = model.WorkSpaceName;
            data.ObjectNr = model.ObjectNr;
            data.IsForAllUser = model.IsForAllUser;
            data.IsUserDefault = model.IsUserDefault;
            data.IsOwner = model.IsOwner;
            data.IsActive = model.IsActive;
            data.IsDeleted = model.IsDeleted;
            data.JSONWorkspaceTemplateSharing = data.CreateJsonText("WorkspaceTemplateSharing", model.ShareList);

            var result = await _userService.SaveWorkspaceTemplateAll(data);
            return result;
        }

        public async Task<WSEditReturn> DeleteWorkspaceTemplate(UserModuleWorkspaceDelete model)
        {
            UserModuleWorkspaceDeleteData data = (UserModuleWorkspaceDeleteData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceDeleteData));

            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.IsDeleted = model.IsDeleted;

            var result = await _userService.DeleteWorkspaceTemplate(data);
            return result;
        }

        public async Task<WSEditReturn> SaveDefaultWorkspaceTemplate(UserModuleWorkspaceDefault model)
        {
            UserModuleWorkspaceDefaultData data = (UserModuleWorkspaceDefaultData)ServiceDataRequest.ConvertToRelatedType(typeof(UserModuleWorkspaceDefaultData));

            data.IdWorkspaceTemplate = model.IdWorkspaceTemplate;
            data.ObjectNr = model.ObjectNr;

            var result = await _userService.SaveDefaultWorkspaceTemplate(data);
            return result;
        }
    }
}
