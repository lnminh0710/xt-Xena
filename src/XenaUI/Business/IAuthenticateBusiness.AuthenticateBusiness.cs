using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using SimpleTokenProvider;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;
using System.Collections.Generic;

namespace XenaUI.Business
{
    /// <summary>
    /// AuthenticateBusiness
    /// </summary>
    public class AuthenticateBusiness : BaseBusiness, IAuthenticateBusiness
    {
        private readonly IUniqueService _uniqueService;
        private readonly JwtIssuerOptions _jwtOptions;
        private readonly ILogger _logger;
        private readonly AppSettings _appSettings;
        private readonly IUserService _userService;
        private readonly IEmailBusiness _emailBusiness;

        public AuthenticateBusiness(IHttpContextAccessor context, IOptions<JwtIssuerOptions> jwtOptions, IOptions<AppSettings> appSettings,
            ILoggerFactory loggerFactory, IUniqueService uniqueService, IUserService userService, IEmailBusiness emailBusiness)
            : base(context)
        {
            _uniqueService = uniqueService;
            _jwtOptions = jwtOptions.Value;
            _appSettings = appSettings.Value;
            // check JWT Options at first before do anything else
            ThrowIfInvalidOptions(_jwtOptions);
            _logger = loggerFactory.CreateLogger<AuthenticateBusiness>();
            _userService = userService;
            _emailBusiness = emailBusiness;
        }

        #region Private OAuth
        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
          => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

        /// <summary>
        /// IMAGINE BIG RED WARNING SIGNS HERE!
        /// You'd want to retrieve claims through your claims provider
        /// in whatever way suits you, the below is purely for demo purposes!
        /// </summary>
        private static Task<ClaimsIdentity> GetClaimsIdentity(User user)
        {
            //if (user.LoginName == "MickeyMouse" &&
            //    user.Password == "MickeyMouseIsBoss123")
            //{
            //    return Task.FromResult(new ClaimsIdentity(new GenericIdentity(user.LoginName, "Token"),
            //      new[]
            //      {
            //        new Claim(ConstAuth.RoleKey, "Admin")
            //      }));
            //}

            //// Credentials are invalid, or account doesn't exist
            //return Task.FromResult<ClaimsIdentity>(null);

            return Task.FromResult(new ClaimsIdentity(new GenericIdentity(user.LoginName, "Token"),
                  new Claim[] { }));
        }

        /// <summary>
        /// BuildClaims
        /// </summary>
        /// <param name="userFromService"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        private async Task<OAuthTokens> BuildOAuthTokens(UserFromService userFromService, User user, TimeSpan validFor, Claim[] additionalClaims = null, string message = null, string messageType = null, TimeSpan? validForRefreshToken = null)
        {

            var identity = await GetClaimsIdentity(user);
            if (identity == null)
            {
                _logger.LogInformation($"Invalid loginName ({userFromService.LoginName}) or password ({userFromService.Password})");
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null,
                    message = message,
                    message_type = messageType
                };
            }


            // convert user object to string and encrypt it to hide from client
            // before assign to Claim Sub
            var strUser = JsonConvert.SerializeObject(user);
            if (string.IsNullOrEmpty(userFromService.UserGuid))
                userFromService.UserGuid = Guid.NewGuid().ToString();
            var strResult = JsonConvert.SerializeObject(userFromService);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, Common.Encrypt(strUser)),
                new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                new Claim(ConstAuth.AppInfoKey, strResult, ClaimValueTypes.String),
                identity.FindFirst(ConstAuth.RoleKey)
            };
            // add additionalClaims to claims
            if (additionalClaims != null)
            {
                int originalClaimsSize = claims.Length;
                Array.Resize(ref claims, originalClaimsSize + additionalClaims.Length);
                additionalClaims.CopyTo(claims, originalClaimsSize - 1);
            }
            ///----------refresh token------------------
            string refreshToken = string.Empty;
            if (validForRefreshToken != null)
            {
                _jwtOptions.ValidFor = (TimeSpan)validForRefreshToken;
                var _claims = new[]
                {
                    new Claim(ConstAuth.IsRefreshToken, "true", ClaimValueTypes.String),
                };
                int originalClaimsSize = claims.Length;
                Array.Resize(ref claims, originalClaimsSize + 1);
                _claims.CopyTo(claims, originalClaimsSize - 1);
                // Create the JWT security token and encode it.
                var _jwt = new JwtSecurityToken(
                    issuer: _jwtOptions.Issuer,
                    audience: _jwtOptions.Audience,
                    claims: claims,
                    notBefore: _jwtOptions.NotBefore,
                    expires: _jwtOptions.Expiration,
                    signingCredentials: _jwtOptions.SigningCredentials);

                refreshToken = new JwtSecurityTokenHandler().WriteToken(_jwt);
                claims[originalClaimsSize - 1] = null;
            }

            ///----------access token------------------
            _jwtOptions.ValidFor = validFor;
            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return new OAuthTokens()
            {
                access_token = encodedJwt,
                expires_in = _jwtOptions.ValidFor.TotalSeconds.ToString(),
                token_type = ConstAuth.TokenType,
                refresh_token = refreshToken,
                result = "Successfully",
                message = message,
                message_type = messageType
            };
        }

        #endregion

        #region Login
        private async Task<OAuthTokens> LoginByAccount(User user)
        {
            var result = await _uniqueService.GetUser(user);
            if (result == null || string.IsNullOrEmpty(result.IdLogin))
            {
                _logger.LogInformation($"Invalid loginName/password");
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null
                };
            }
            if (!string.IsNullOrEmpty(result.Message) && !string.IsNullOrEmpty(result.MessageType))
            {
                _logger.LogInformation(string.Format("account:{0} - message:{1}", user.LoginName, result.Message));
                switch (int.Parse(result.MessageType))
                {
                    case (int)EAuthMessageType.Expired:
                    case (int)EAuthMessageType.Denied:
                        return new OAuthTokens()
                        {
                            access_token = null,
                            expires_in = null,
                            token_type = null,
                            refresh_token = null,
                            message = result.Message,
                            message_type = result.MessageType
                        };
                }
            }
            user.IdLogin = result.IdLogin;
            return await BuildOAuthTokens(result, user, TimeSpan.FromHours(_appSettings.OAuthAccessTokenExpire), null, result.Message, result.MessageType, validForRefreshToken: TimeSpan.FromHours(_appSettings.OAuthRefreshTokenExpire));
        }

        public async Task<OAuthTokens> Login(User user)
        {
            // hash pwd before check
            if (!user.IsEncrypt)
            {
                user.Password = Common.SHA256Hash(user.Password);
            }

            return await LoginByAccount(user);
        }

        public async Task<OAuthTokens> LoginByUserId(User userLogin)
        {
            string loginName = "";
            string password = "";

            #region Get loginName and password
            UserProfileGetData data = (UserProfileGetData)ServiceDataRequest.ConvertToRelatedType(typeof(UserProfileGetData));
            data.IdPerson = userLogin.IdLogin;
            var userResult = (WSDataReturn)await _userService.GetUserById(data);
            if (userResult.Data.Count > 1)
            {
                var children = userResult.Data[1].Children<JObject>();
                JObject jLoginName = children.FirstOrDefault(o => o["ColumnName"] != null && o["ColumnName"].ToString() == "LoginName");
                if (jLoginName != null)
                {
                    loginName = jLoginName["Value"] + string.Empty;
                }

                JObject jPassword = children.FirstOrDefault(o => o["ColumnName"] != null && o["ColumnName"].ToString() == "Password");
                if (jPassword != null)
                {
                    password = jPassword["Value"] + string.Empty;
                }
            }
            #endregion

            if (string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(password))
            {
                _logger.LogInformation($"Cannot get the loginName and password by idLogin");
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null
                };
            }

            var user = new User {
                IdLogin = userLogin.IdLogin,
                LoginName = loginName,
                Password = password,
                IpAddress = userLogin.IpAddress,
                OsType = userLogin.OsType,
                OsVersion = userLogin.OsVersion,
                BrowserType = userLogin.BrowserType,
                VersionBrowser = userLogin.VersionBrowser,
                StepLog = userLogin.StepLog
            };

            return await LoginByAccount(user);
        }

        #endregion

        #region Reset Password

        public async Task<bool> ResetPassword(User user, HttpContext context, string domain)
        {
            var resultCheckUser = await _uniqueService.ResetPassword(user.LoginName);
            if (resultCheckUser == null || string.IsNullOrEmpty(resultCheckUser.IdLogin))
                return false;
            user.IdLogin = resultCheckUser.IdLogin;
            var secretKeyClaim = new Claim(ConstAuth.NewSecretKey,
                Common.SHA256Hash(_appSettings.OAuthSecretKey + DateTime.Now.ToString("yyyyddMM")));
            var isResetPassword = new Claim(ConstAuth.IsResetPassword, "true");

            var tokens = await BuildOAuthTokens(new UserFromService(), user, TimeSpan.FromMinutes(_appSettings.OAuthAccessTokenExpireForResetPassword), new[] { secretKeyClaim, isResetPassword });

            string hrefLink = string.Format("{0}/auth/resetpassword?accesstoken={1}", Common.GetFullDomainUrl(context), tokens.access_token);
            var emailModel = new EmailModel()
            {
                Subject = "<No reply> Reset Password",
                ToEmail = resultCheckUser.Email,
                Body = BuildResetPasswordEmailBody(hrefLink)
            };
            emailModel.ImageAttached = new List<ImageSend>
            {
                new ImageSend()
                {
                    Source = _emailBusiness.ImageToBase64(_appSettings.ImageLogoUrl),
                    EmbeddedId = Common.XeNaLogoCid
                }
            };

            var resultSendEmail = await _emailBusiness.SendEmailWithEmbeddedImage(emailModel);
            return resultSendEmail;
        }

        private string BuildResetPasswordEmailBody(string hrefLink)
        {
            return string.Format(@"<div style='width: 95%;
                            border: 1px solid #0b6599;
                            line-height: 16px;
                            font-size: 14px;
                            font-family: tahoma;
                            min-width: 400px;
                            margin-bottom: 30px;'>
                        <div style='width: 100%;
                                height: 50px;
                                background-color: #0b6599'>
                            <img style='width:130px' src='cid:{0}'/>
                        </div>
                        <div style='padding: 10px 40px 20px 40px;'>
                            <h1 style='line-height: 25px'>Reset Password</h1>
                            <br/>
                            <p>We received your request to reset password at Xena site.</p>
                            <p>Please click on reset button to update new password.</p>
                            <br/>
                            <p>This request will be expired in 2 hours. Until <strong style='color: #0b6599'>{1}</strong></p>
                            <br/>
                            <table style='
                                width: 200px;
                                height: 40px;
                                padding: 0;
                                background-color: #0b6599;
                                '>
                                <tbody><tr style='
                                    padding: 0;
                                    '>
                                    <td align='center'>
                                        <a href='{2}' style='font-size: 19px;
                                                        color: #fff;
                                                        text-decoration: none;
                                                        display: block;
                                                        padding: 0;
                                                        line-height: 45px;'>Reset password</a>
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
                                <i>*We send you  this email for reseting password purpose*</i>
                        </div>
                    </div>",
                    Common.XeNaLogoCid,
                    string.Format("{0:MM/dd/yyy hh:mm tt}", DateTime.Now),
                    hrefLink);
        }
        #endregion

        #region Update Password
        public async Task<OAuthTokens> UpdatePassword(string accesstoken, User clientUser)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accesstoken) as JwtSecurityToken;
            var user = JsonConvert.DeserializeObject<User>(Common.Decrypt(jsonToken.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value));
            var isResetPasswordClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == ConstAuth.IsResetPassword);
            // in case update pwd
            if (isResetPasswordClaim == null)
            {
                clientUser.Password = Common.SHA256Hash(clientUser.Password ?? "");
                if (clientUser.Password != user.Password)
                    return new OAuthTokens()
                    {
                        access_token = null,
                        expires_in = null,
                        token_type = null,
                        refresh_token = null,
                        result = "Invalid Password"
                    };
            }
            clientUser.NewPassword = Common.SHA256Hash(clientUser.NewPassword);
            var result = await _uniqueService.ChangePassword(user.LoginName, clientUser.NewPassword, user.IdLogin);

            if (result == null || result.ReturnValue.ToString() != user.IdLogin)
            {
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null,
                    result = "Failed"
                };
            }

            if (isResetPasswordClaim != null)
            {
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null,
                    result = "Successfully"
                };
            }
            user.Password = clientUser.NewPassword;
            var userFromService = JsonConvert.DeserializeObject<UserFromService>(jsonToken.Claims.First(c => c.Type == ConstAuth.AppInfoKey).Value);
            return await BuildOAuthTokens(userFromService, user, TimeSpan.FromHours(_appSettings.OAuthAccessTokenExpire));
        }
        #endregion

        #region Send Notification
        /// <summary>
        /// SendNotificationForExpiredUser
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<bool> SendNotificationForExpiredUser(string loginName, string content)
        {
            var resultSendEmail = await _uniqueService.SendNotificationForExpiredUser(loginName, content);

            return resultSendEmail;
        }
        #endregion

        #region Refresh token
        public async Task<OAuthTokens> RefreshToken()
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(AccessToken) as JwtSecurityToken;
            var isRefreshToken = jsonToken.Claims.FirstOrDefault(c => c.Type == ConstAuth.IsRefreshToken);
            if (isRefreshToken == null || isRefreshToken.Value != "true")
                return new OAuthTokens()
                {
                    access_token = null,
                    expires_in = null,
                    token_type = null,
                    refresh_token = null,
                    message = null,
                    message_type = null
                };
            return await BuildOAuthTokens(UserFromService, GetUserInfoFromToken(), TimeSpan.FromHours(_appSettings.OAuthAccessTokenExpire), validForRefreshToken: TimeSpan.FromHours(_appSettings.OAuthRefreshTokenExpire));
        }
        #endregion
    }
}
