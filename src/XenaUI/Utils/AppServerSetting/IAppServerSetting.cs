using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Utils
{
    /// <summary>
    /// IAppServerSetting
    /// </summary>
    public interface IAppServerSetting
    {
        /// <summary>
        /// ServerConfig
        /// </summary>
        ServerConfig ServerConfig { get; }
    }
}
