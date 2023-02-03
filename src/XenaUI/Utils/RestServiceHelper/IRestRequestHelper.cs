using System;
using System.Collections.Generic;
using RestSharp;
using System.Threading.Tasks;
using XenaUI.Constants;

namespace XenaUI.Utils
{
    /// <summary>
    /// IRestRequestHelper
    /// </summary>
    public interface IRestRequestHelper
    {
        string BaseUrl { set; }

        string ServiceName { set; }

        string AuthString { set; }

        Task<Dictionary<int, object>> Execute(string resource, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Method method, Dictionary<string, object> parameter = null, object body = null, string version = "");

        Task<Dictionary<int, object>> Get(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");

        Task<Dictionary<int, object>> Post(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");

        Task<Dictionary<int, object>> Put(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");

        Task<Dictionary<int, object>> Patch(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");

        Task<Dictionary<int, object>> Delete(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");

        #region Sync
        Dictionary<int, object> ExecuteSync(string resource, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Method method, Dictionary<string, object> parameter = null, object body = null, string version = "");
        Dictionary<int, object> GetSync(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");
        Dictionary<int, object> PostSync(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "");
        #endregion
        //Task<T> ExecutePost<T>(object body, EExecuteMappingType mappingType, Dictionary<string, object> parameter = null, string resource = "", string version = "", int resultIndexForParsing = 0) where T : class;
    }
}
