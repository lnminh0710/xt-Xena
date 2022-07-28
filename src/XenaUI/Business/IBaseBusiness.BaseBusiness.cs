using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Utils;
using AutoMapper;
using Sentry;
using System.Threading.Tasks;

namespace XenaUI.Business
{
    /// <summary>
    /// BaseBusiness
    /// </summary>
    public class BaseBusiness : IBaseBusiness
    {
        protected readonly IHttpContextAccessor _context;
        public BaseBusiness(IHttpContextAccessor context)
        {
            _context = context;

            Init();
        }

        public string AccessToken
        {
            get;
            private set;
        }

        public Data ServiceDataRequest
        {
            get;
            private set;
        }

        public UserFromService UserFromService
        {
            get;
            private set;
        }

        private void Init()
        {
            string authorization = _context.HttpContext.Request.Headers["Authorization"];
            if (string.IsNullOrEmpty(authorization))
            {
                SetEmptyData();
                return;
            }

            AccessToken = authorization.Replace("Bearer ", "");

            if (string.IsNullOrEmpty(AccessToken))
            {
                SetEmptyData();
                return;
            }

            try
            {
                string idRepLanguage = _context.HttpContext.Request.Headers["IdRepLanguage"];
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(AccessToken) as JwtSecurityToken;
                UserFromService = JsonConvert.DeserializeObject<UserFromService>(jsonToken.Claims.First(c => c.Type == ConstAuth.AppInfoKey).Value);

                string language = !string.IsNullOrWhiteSpace(idRepLanguage) ? idRepLanguage : UserFromService.Language;
                ServiceDataRequest = new Data
                {
                    IdLogin = UserFromService.IdLogin,
                    IdApplicationOwner = UserFromService.IdApplicationOwner,
                    LoginLanguage = language
                };
            }
            catch (Exception ex)
            {
                var data = new Dictionary<string, string>();
                data.Add("Authorization", authorization);
                SentrySdk.AddBreadcrumb("BaseBusiness-Init-Parse Jwt", category: "Jwt", data: data);
                throw ex;
            }
        }

        private void SetEmptyData()
        {
            AccessToken = string.Empty;
            ServiceDataRequest = new Data();
            UserFromService = new UserFromService();
        }

        public User GetUserInfoFromToken()
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(AccessToken) as JwtSecurityToken;
            string strUser = Common.Decrypt(jsonToken.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            return JsonConvert.DeserializeObject<User>(strUser);
        }

        public async Task<bool> Execute(Func<Task<bool>> action)
        {
            bool rs = false;
            try
            {
                rs = await action();
            }
            catch (Exception ex)
            {
                SentrySdk.CaptureException(ex);
            }
            return rs;
        }
    }
}
