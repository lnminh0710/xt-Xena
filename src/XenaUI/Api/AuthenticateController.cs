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
    public class AuthenticateController : BaseController
    {
        private readonly AppSettings _appSettings;
        private readonly IAuthenticateBusiness _authenticateBusiness;
        private readonly JsonSerializerSettings _serializerSettings;

        public AuthenticateController(IAuthenticateBusiness authenticateBusiness, IOptions<AppSettings> appSettings)
        {
            _authenticateBusiness = authenticateBusiness;
            _appSettings = appSettings.Value;
            _serializerSettings = new JsonSerializerSettings
            {
                //Formatting = Formatting.Indented
            };
        }

        [HttpGet("checkServerOnline")]
        [AllowAnonymous]
        public bool CheckServerOnline()
        {
            return true;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<object> Login([FromBody] User user)
        {
            return await _authenticateBusiness.Login(user);
        }

        /// <summary>
        /// Login by user id. That means the user logged in and we need to login for getting new access_token
        /// </summary>
        /// <param name="idLogin"></param>
        /// <returns></returns>
        [HttpPost("LoginByUserId")]
        [Authorize]
        public async Task<object> LoginByUserId([FromBody] User user)
        {
            return await _authenticateBusiness.LoginByUserId(user);
        }

        [HttpPost("CheckToken")]
        [AllowAnonymous]
        public object CheckToken([FromBody] Token token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token.AccessToken) as JwtSecurityToken;
            var result = new CheckTokenResult();
            if (jsonToken.ValidTo < DateTime.UtcNow ||
                jsonToken.Claims.Where(c =>
                    c.Type == ConstAuth.NewSecretKey &&
                    c.Value == Common.SHA256Hash(_appSettings.OAuthSecretKey + DateTime.Now.ToString("yyyyddMM"))).Count() <= 0)
            {
                result.IsValid = false;
            }
            else
            {
                result.IsValid = true;
            }
            return result;
        }

        [HttpPost("resetpassword")]
        [AllowAnonymous]
        public async Task<object> ResetPassword([FromBody] User user)
        {
            return await _authenticateBusiness.ResetPassword(user, HttpContext, Domain);
        }

        [HttpPost("updatepassword")]
        public async Task<object> UpdatePassword([FromBody] User user)
        {
            string authorization = Request.Headers["Authorization"];
            string accesstoken = authorization.Replace("Bearer ", "");
            return await _authenticateBusiness.UpdatePassword(accesstoken, user);
        }

        [HttpPost("SendNotification")]
        [AllowAnonymous]
        public async Task<object> SendNotification([FromHeader] string loginName, [FromHeader] string content)
        {
            return await _authenticateBusiness.SendNotificationForExpiredUser(loginName, content);
        }

        [HttpPost("refreshtoken")]
        [Authorize]
        public async Task<object> RefreshToken()
        {
            return await _authenticateBusiness.RefreshToken();
        }
    }
}
