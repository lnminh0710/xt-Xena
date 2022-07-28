using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IAuthenticateBusiness
    {
        /// <summary>
        /// Login by account: loginName, password
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<OAuthTokens> Login(User user);

        /// <summary>
        /// Login by UserId
        /// </summary>
        /// <param name="idLogin"></param>
        /// <returns></returns>
        Task<OAuthTokens> LoginByUserId(User user);

        /// <summary>
        /// ResetPassword
        /// </summary>
        /// <param name="user"></param>
        /// <param name="context"></param>
        /// <param name="domain"></param>
        /// <returns></returns>
        Task<bool> ResetPassword(User user, HttpContext context, string domain);

        /// <summary>
        /// UpdatePassword
        /// </summary>
        /// <param name="accesstoken"></param>
        /// <param name="clientUser"></param>
        /// <returns></returns>
        Task<OAuthTokens> UpdatePassword(string accesstoken, User clientUser);

        /// <summary>
        /// SendNotificationForExpiredUser
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        Task<bool> SendNotificationForExpiredUser(string loginName, string content);

        /// <summary>
        /// RefreshToken
        /// </summary>
        /// <returns></returns>
        Task<OAuthTokens> RefreshToken();
    }    
}

