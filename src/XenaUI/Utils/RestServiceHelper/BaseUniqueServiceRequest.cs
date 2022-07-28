using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Constants;

namespace XenaUI.Utils
{
    /// <summary>
    /// BaseUniqueServiceRequest
    /// </summary>
    public abstract class BaseUniqueServiceRequest
    {
        private string _host = string.Empty;
        private readonly IHttpContextAccessor _httpContextAccessor;
        protected readonly AppSettings _appSettings;
        private readonly ServerConfig _serverConfig;

        public BaseUniqueServiceRequest(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
        {
            _httpContextAccessor = httpContextAccessor;
            _appSettings = appSettings.Value;
            _serverConfig = appServerSetting.ServerConfig;

            Service = new RestRequestHelper(_appSettings, _httpContextAccessor) { BaseUrl = Host, ServiceName = ServiceName, AuthString = AuthString, Timeout = Timeout };
        }

        protected IRestRequestHelper Service { get; set; }

        /// <summary>
        /// Host
        /// </summary>
        protected string Host
        {
            get
            {
                if (string.IsNullOrEmpty(_host))
                {
                    _host = _serverConfig.ServerSetting.ServiceUrl;
                }
                return _host;
            }
        }

        /// <summary>
        /// AuthString
        /// </summary>
        protected string AuthString
        {
            get { return ""; }
        }

        /// <summary>
        /// ServiceName
        /// </summary>
        protected string ServiceName
        {
            get { return "UniqueService"; }
        }

        protected int Timeout { get; set; }

        protected async Task<object> GetData(Data data, string methodName, string objectName, EExecuteMappingType mappingType = EExecuteMappingType.None, int requestTimeout = 0)
        {
            data.MethodName = methodName;
            data.GUID = Guid.NewGuid().ToString();
            data.Object = objectName;

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            Timeout = requestTimeout;
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: mappingType))[0];
            return response;
        }

        protected async Task<object> GetDataWithMapTypeIsNone(Data data, string methodName, string objectName)
        {
            data.MethodName = methodName;
            data.Object = objectName;

            return await GetDataWithMapTypeIsNone(data);
        }

        protected async Task<object> GetDataWithMapTypeIsNone(Data data, string methodName, string objectName, string mode)
        {
            data.MethodName = methodName;
            data.Object = objectName;
            data.Mode = mode;

            return await GetDataWithMapTypeIsNone(data);
        }

        protected async Task<object> GetDataWithMapTypeIsNone(Data data)
        {
            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        protected async Task<WSEditReturn> SaveData(Data data, string methodName, string objectName)
        {
            data.MethodName = methodName;
            data.Object = objectName;

            return await SaveData(data);
        }

        protected async Task<WSEditReturn> SaveData(Data data)
        {
            return await SaveData<WSEditReturn>(data);
        }

        protected async Task<T> SaveData<T>(Data data) where T : class
        {
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(T));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<T>)response).FirstOrDefault() : null;
        }

        public ExpandoObject ToExpandoObject(object obj)
        {
            // Null-check
            IDictionary<string, object> expando = new ExpandoObject();

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(obj.GetType()))
            {
                expando.Add(property.Name, property.GetValue(obj));
            }

            return (ExpandoObject)expando;
        }

        protected BodyRequest CreateBodyRequest(Data data)
        {
            if (data.GUID == null)
            {
                data.GUID = Guid.NewGuid().ToString();
            }

            return CreateBodyRequestObject(data);
        }

        protected BodyRequest CreateBodyRequestObject(object data)
        {
            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Formatting.None,
                            new JsonSerializerSettings
                            {
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };

            return bodyRquest;

        }
    }
}
