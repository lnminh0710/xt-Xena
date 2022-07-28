using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SimpleTokenProvider;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Business;
using XenaUI.Models;
using XenaUI.Utils;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using XenaUI.Constants;
using System.Text.Encodings.Web;
using RestSharp.Extensions.MonoHttp;

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class UserController : BaseController
    {
        private readonly AppSettings _appSettings;
        private readonly IUserBusiness _userBusiness;
        private readonly JsonSerializerSettings _serializerSettings;

        public UserController(IUserBusiness userBusiness, IOptions<AppSettings> appSettings)
        {
            _userBusiness = userBusiness;
            _appSettings = appSettings.Value;
            _serializerSettings = new JsonSerializerSettings
            {
                //Formatting = Formatting.Indented
            };
        }

        // GET: api/User/GetUserById
        [HttpGet]
        [Route("GetUserById")]
        public async Task<object> GetUserById(int idPerson)
        {
            return await _userBusiness.GetUserById(idPerson);
        }

        // GET: api/User/ListUserRoleByUserId
        [HttpGet]
        [Route("ListUserRoleByUserId")]
        public async Task<object> ListUserRoleByUserId(string userId)
        {
            return await _userBusiness.ListUserRoleByUserId(userId);
        }

        // GET: api/User/ListUserRoleInclueUserId
        [HttpGet]
        [Route("ListUserRoleInclueUserId")]
        public async Task<object> ListUserRoleInclueUserId(int idPerson)
        {
            return await _userBusiness.ListUserRoleInclueUserId(idPerson);
        }

        // GET: api/User/GetAllUserRole
        [HttpGet]
        [Route("GetAllUserRole")]
        public async Task<object> GetAllUserRole()
        {
            return await _userBusiness.GetAllUserRole();
        }

        // GET: api/User/CheckExistUserByField
        [HttpGet]
        [Route("CheckExistUserByField")]
        public async Task<object> CheckExistUserByField(string fieldName, string fieldValue)
        {
            return await _userBusiness.CheckExistUserByField(fieldName, fieldValue);
        }

        // POST: api/User/SaveUserProfile
        [HttpPost]
        [Route("SaveUserProfile")]
        public async Task<object> SaveUserProfile([FromBody]UserSaving model)
        {
            return await _userBusiness.SaveUserProfile(model, HttpContext, Domain);
        }

        // POST: api/User/SaveRoleForUser
        [HttpPost]
        [Route("SaveRoleForUser")]
        public async Task<object> SaveRoleForUser([FromBody]UserRoleUpdateModel model)
        {
            return await _userBusiness.SaveRoleForUser(model.Roles, HttpContext, model.IsSetDefaultRole);
        }

        [HttpPost]
        [Route("SaveUserWidgetLayout")]
        public async Task<object> SaveUserWidgetLayout([FromBody]UserWidgetLayoutUpdate model)
        {
            return await _userBusiness.SaveUserWidgetLayout(model, HttpContext);
        }

        [HttpGet]
        [Route("GetUserFunctionList")]
        public async Task<object> GetUserFunctionList(string idLoginRoles)
        {
            return await _userBusiness.GetUserFunctionList(idLoginRoles);
        }

        /// <summary>
        /// Assign Role List To Multiple Users
        /// </summary>E
        /// <param name="idLogins"> List ids string. Ex: '9,10,11,12'</param>
        /// <param name="idLoginRoles">List ids string. Ex: '9,10,11,12'</param>
        /// <returns></returns>
        [HttpPost]
        [Route("AssignRoleToMultipleUser")]
        public async Task<object> AssignRoleToMultipleUser(string idLogins, string idLoginRoles)
        {
            return await _userBusiness.AssignRoleToMultipleUser(idLogins, idLoginRoles);
        }

        [HttpGet]
        [Route("GetWorkspaceTemplate")]
        public async Task<object> GetWorkspaceTemplate(string objectNr)
        {
            return await _userBusiness.GetWorkspaceTemplate(objectNr);
        }

        [HttpGet]
        [Route("GetWorkspaceTemplateSharing")]
        public async Task<object> GetWorkspaceTemplateSharing(string idWorkspaceTemplate, string objectNr)
        {
            return await _userBusiness.GetWorkspaceTemplateSharing(idWorkspaceTemplate, objectNr);
        }

        [HttpPost]
        [Route("ApplyWorkspaceTemplate")]
        public async Task<object> ApplyWorkspaceTemplate([FromBody]UserModuleWorkspaceApply model)
        {
            return await _userBusiness.ApplyWorkspaceTemplate(model);
        }

        [HttpPost]
        [Route("ApplyWorkspaceTemplateAll")]
        public async Task<object> ApplyWorkspaceTemplateAll([FromBody]UserModuleWorkspaceApply model)
        {
            return await _userBusiness.ApplyWorkspaceTemplateAll(model);
        }

        [HttpPost]
        [Route("SaveWorkspaceTemplate")]
        public async Task<object> SaveWorkspaceTemplate([FromBody]UserModuleWorkspaceSave model)
        {
            return await _userBusiness.SaveWorkspaceTemplate(model);
        }

        [HttpPost]
        [Route("SaveWorkspaceTemplateAll")]
        public async Task<object> SaveWorkspaceTemplateAll([FromBody]UserModuleWorkspaceSave model)
        {
            return await _userBusiness.SaveWorkspaceTemplateAll(model);
        }

        [HttpPost]
        [Route("DeleteWorkspaceTemplate")]
        public async Task<object> DeleteWorkspaceTemplate([FromBody]UserModuleWorkspaceDelete model)
        {
            return await _userBusiness.DeleteWorkspaceTemplate(model);
        }

        [HttpPost]
        [Route("SaveDefaultWorkspaceTemplate")]
        public async Task<object> SaveDefaultWorkspaceTemplate([FromBody]UserModuleWorkspaceDefault model)
        {
            return await _userBusiness.SaveDefaultWorkspaceTemplate(model);
        }
    }
}
