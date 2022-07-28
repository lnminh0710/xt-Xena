//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Options;

//namespace XenaUI.Utils
//{
//    /// <summary>
//    /// BaseRestServiceRequest
//    /// </summary>
//    public abstract class BaseRestServiceRequest
//    {
//        private readonly IHttpContextAccessor _httpContextAccessor;
//        private readonly AppSettings _appSettings;

//        public BaseRestServiceRequest(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor)
//        {
//            _httpContextAccessor = httpContextAccessor;
//            _appSettings = appSettings.Value;            
//        }

//        protected IRestRequestHelper Service { get; set; }

//        protected void InitService()
//        {
//            Service = new RestRequestHelper(_appSettings, _httpContextAccessor) { BaseUrl = Host, ServiceName = ServiceName, AuthString = AuthString, Timeout = Timeout };
//        }

//        /// <summary>
//        /// ServiceName
//        /// </summary>
//        protected abstract string Host { get; }

//        /// <summary>
//        /// AuthString
//        /// </summary>
//        protected abstract string AuthString { get; }

//        /// <summary>
//        /// ServiceName
//        /// </summary>
//        protected abstract string ServiceName { get; }

//        /// <summary>
//        /// In milliseconds
//        /// </summary>
//        protected abstract int Timeout { get; set; }
//    }
//}
