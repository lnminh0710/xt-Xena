using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    /// <summary>
    /// LoginData
    /// </summary>
    public class LoginData : Data
    {
        /// <summary>
        /// LoginName
        /// </summary>
        public string LoginName { get; set; }

        /// <summary>
        /// Password
        /// </summary>
        public string Password { get; set; }
        public string IPAddress { get; set; }
        public string OSType { get; set; }
        public string OSVersion { get; set; }
        public string BrowserType { get; set; }
        public string VersionBrowser { get; set; }
        public string StepLog { get; set; }
    }
}
