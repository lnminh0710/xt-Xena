using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System;
using System.Net;
using XenaUI.Models;

namespace XenaUI.Utils
{
    public class CustomExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            HttpStatusCode status = HttpStatusCode.InternalServerError;
            string message = "Server error occurred.";

            var exceptionType = context.Exception.GetType();
            var content = context.Exception.StackTrace;
            if (exceptionType == typeof(UnauthorizedAccessException))
            {
                message = "Unauthorized Access";
                status = HttpStatusCode.Unauthorized;
            }
            else if (exceptionType == typeof(NotImplementedException))
            {
                message = "A server error occurred: NotImplementedException.";
                status = HttpStatusCode.NotImplemented;
            }
            else
            {
                message = context.Exception.Message;
                content = context.Exception.Data["Content"] + string.Empty;
            }

            context.ExceptionHandled = true;
            HttpResponse response = context.HttpContext.Response;
            response.StatusCode = (int)status;
            response.ContentType = "application/json";

            var apiResultResponse = new ApiResultResponse()
            {
                StatusCode = ApiMethodResultId.UnexpectedError,
                ResultDescription = message,
                Item = content
            };
            var result = JsonConvert.SerializeObject(apiResultResponse);

            response.WriteAsync(result);
        }
    }
}
