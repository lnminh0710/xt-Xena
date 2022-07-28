using System;
using System.Net;

namespace XenaUI.Utils
{
    public class RestApiException : Exception
    {
        public RestApiException(string message, Exception ex) : base(message, ex)
        {
        }

        public HttpStatusCode StatusCode { get; set; }
        public string StatusDescription { get; set; }
        public string Content { get; set; }
    }
}
