using Newtonsoft.Json;

namespace XenaUI.Models
{
    /// <summary>
    /// User
    /// </summary>
    public class UserFromService : User
    {
        /// <summary>
        /// NickName
        /// </summary>
        public string NickName { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// FullName
        /// </summary>
        public string FullName { get; set; }

        /// <summary>
        /// ModuleName
        /// </summary>
        public string ModuleName { get; set; }

        /// <summary>
        /// RMRead
        /// </summary>
        public string RMRead { get; set; }

        /// <summary>
        /// Message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// ValidTo
        /// </summary>
        public string ValidTo { get; set; }

        /// <summary>
        /// MessageType
        /// </summary>
        public string MessageType { get; set; }

        /// <summary>
        /// Language
        /// </summary>
        public string Language { get; set; }

        /// <summary>
        /// Culture
        /// </summary>
        public string Culture { get; set; }

        /// <summary>
        /// IdApplicationOwner
        /// </summary>
        public string IdApplicationOwner { get; set; }

        /// <summary>
        /// LoginPicture
        /// </summary>
        public string LoginPicture { get; set; }

        /// <summary>
        /// UserGuid
        /// </summary>
        public string UserGuid { get; set; }
    }
}
