using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using XenaUI.Utils;
using XenaUI.Constants;
using XenaUI.Service.Models;

namespace XenaUI.Service
{
    /// <summary>
    /// DynamicData Service
    /// </summary>
    public class DynamicDataService : BaseUniqueServiceRequest, IDynamicDataService
    {
        /// <summary>
        /// AddressBook Service
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <param name="appSettings"></param>
        /// <param name="appServerSetting"></param>
        public DynamicDataService(IHttpContextAccessor httpContextAccessor, IOptions<AppSettings> appSettings, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting)
        {
        }

        /// <summary>
        /// Get Data
        /// </summary>
        /// <param name="dynamicData"></param>
        /// <param name="mappingType"></param>
        /// <param name="returnType"></param>
        /// <returns></returns>
        public async Task<object> GetData(DynamicData dynamicData,
            EExecuteMappingType mappingType = EExecuteMappingType.None, 
            EDynamicDataGetReturnType returnType = EDynamicDataGetReturnType.None)
        {
            return await GetRawDynamicData(dynamicData, mappingType: mappingType, returnType: returnType);
        }

        public async Task<object> GetDynamicDataFormTable(DynamicData dynamicData,
            EExecuteMappingType mappingType = EExecuteMappingType.None,
            EDynamicDataGetReturnType returnType = EDynamicDataGetReturnType.None)
        {
            return null;// await GetRawDynamicDataFormTable(dynamicData, mappingType: mappingType, returnType: returnType);
        }

        /// <summary>
        /// Save Data
        /// </summary>
        /// <param name="dynamicData"></param>
        /// <returns></returns>
        public async Task<WSEditReturn> SaveData(DynamicData dynamicData)
        {
            throw new System.NotImplementedException();
        }
        public Task<WSEditReturn> SaveFormData(SaveDynamicData dynamicData)
        {
            throw new System.NotImplementedException();
        }
    }
}
