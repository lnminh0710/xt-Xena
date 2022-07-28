using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace XenaUI.Models
{
    /// <summary>
    /// User
    /// </summary>
    public class User
    {
        /// <summary>
        /// LoginName
        /// </summary>
        public string LoginName { get; set; }

        /// <summary>
        /// Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// NewPassword
        /// </summary>
        public string NewPassword { get; set; }

        /// <summary>
        /// IdLogin
        /// </summary>
        public string IdLogin { get; set; }

        /// <summary>
        /// IsEncrypt
        /// </summary>
        public bool IsEncrypt { get; set; }
        
        public string IpAddress { get; set; }
        public string OsType { get; set; }
        public string OsVersion { get; set; }
        public string BrowserType { get; set; }
        public string VersionBrowser { get; set; }
        public string StepLog { get; set; }
    }

    /// <summary>
    /// Token
    /// </summary>
    public class Token
    {
        /// <summary>
        /// AccessToken
        /// </summary>
        public string AccessToken { get; set; }
    }

    /// <summary>
    /// CheckTokenResult
    /// </summary>
    public class CheckTokenResult
    {
        /// <summary>
        /// IsValid
        /// </summary>
        public bool IsValid { get; set; }
    }

    #region [For User Management]

    /// <summary>
    /// UserProfile
    /// </summary>
    public class UserSaving
    {
        /// <summary>
        /// UserProfile
        /// <summary>
        public UserProfile UserProfile { get; set; }

        /// <summary>
        /// UserRoles
        /// <summary>
        [IgnoreMap]
        public IList<UserRole> UserRoles { get; set; }
    }

    /// <summary>
    /// UserProfile
    /// </summary>
    public class UserRole
    {
        /// <summary>
        /// UserRoleId
        /// <summary>
        public int? UserRoleId { get; set; }

        /// <summary>
        /// RoleId
        /// <summary>
        public int? RoleId { get; set; }

        /// <summary>
        /// IsDeleted
        /// <summary>
        public bool? IsDeleted { get; set; }
    }

    /// <summary>
    /// UserProfile
    /// </summary>
    public class UserProfile
    {
        /// <summary>
        /// IdLogin
        /// <summary>
        public int? IdPerson { get; set; }

        /// <summary>
        /// IdAppUser
        /// <summary>
        public int? IdAppUser { get; set; }

        /// <summary>
        /// LoginName
        /// <summary>
        public string LoginName { get; set; }

        /// <summary>
        /// Password
        /// <summary>
        public string Password { get; set; }

        /// <summary>
        /// NickName
        /// <summary>
        public string NickName { get; set; }

        /// <summary>
        /// FullName
        /// <summary>
        public string FullName { get; set; }

        /// <summary>
        /// LastName
        /// <summary>
        public string LastName { get; set; }

        /// <summary>
        /// FirstName
        /// <summary>
        public string FirstName { get; set; }

        /// <summary>
        /// DateOfBirth
        /// <summary>
        public string DateOfBirth { get; set; }

        /// <summary>
        /// LoginPicture
        /// <summary>
        public string LoginPicture { get; set; }

        /// <summary>
        /// DbserverIdLogin
        /// <summary>
        public int? DbserverIdLogin { get; set; }

        /// <summary>
        /// DbServerLoginName
        /// <summary>
        public string DbServerLoginName { get; set; }

        /// <summary>
        /// DbServerSidString
        /// <summary>
        public string DbServerSidString { get; set; }

        /// <summary>
        /// DbServerUpdate
        /// <summary>
        public DateTime? DbServerUpdate { get; set; }

        /// <summary>
        /// DbServerPassword
        /// <summary>
        public string DbServerPassword { get; set; }

        /// <summary>
        /// DbServerPasswordChangeDate
        /// <summary>
        public DateTime? DbServerPasswordChangeDate { get; set; }

        /// <summary>
        /// DbServerPasswordAddDayToExpiration
        /// <summary>
        public int? DbServerPasswordAddDayToExpiration { get; set; }

        /// <summary>
        /// ValidFrom
        /// <summary>
        public string ValidFrom { get; set; }

        /// <summary>
        /// ValidTo
        /// <summary>
        public string ValidTo { get; set; }

        /// <summary>
        /// Email
        /// <summary>
        public string Email { get; set; }

        /// <summary>
        /// IsBlocked
        /// <summary>
        public bool? IsBlocked { get; set; }

        /// <summary>
        /// IsDeleted
        /// <summary>
        public bool? IsDeleted { get; set; }

        /// <summary>
        /// IdRepLanguage
        /// </summary>
        public string IdRepLanguage { get; set; }

        /// <summary>
        /// CreateDate
        /// <summary>
        public DateTime? CreateDate { get; set; }

        /// <summary>
        /// UpdateDate
        /// <summary>
        public DateTime? UpdateDate { get; set; }
    }

    public class UserRoleUpdate
    {
        /// <summary>
        /// IdLoginRolesLoginGw
        /// <summary>
        public string IdLoginRolesLoginGw { get; set; }

        /// <summary>
        /// IdLoginRoles
        /// <summary>
        public string IdLoginRoles { get; set; }

        /// <summary>
        /// IsBlocked
        /// <summary>
        public bool? IsBlocked { get; set; }

        /// <summary>
        /// IsDefault
        /// <summary>
        public bool? IsDefault { get; set; }

        /// <summary>
        /// IdLogin
        /// <summary>
        public int? IdLogin { get; set; }
    }

    public class UserRoleUpdateModel
    {
        public string IsSetDefaultRole { get; set; }
        public IList<UserRoleUpdate> Roles { get; set; }

        public UserRoleUpdateModel()
        {
            Roles = new List<UserRoleUpdate>();
        }
    }

    public class UserWidgetLayoutUpdate
    {
        /// <summary>
        /// IdMember
        /// <summary>
        public string IdMember { get; set; }

        /// <summary>
        /// ObjectNr
        /// <summary>
        public string ObjectNr { get; set; }
    }
    #endregion
}
