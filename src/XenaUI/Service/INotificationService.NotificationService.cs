using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public class NotificationService : BaseUniqueServiceRequest, INotificationService
    {
        public NotificationService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting) : base(appSettings, httpContextAccessor, appServerSetting) { }

        /// <summary>
        /// If all fields = 0 : IdLoginNotification, MainNotificationType, NotificationStatus -> Get All
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<WSDataReturn> GetNotifications(NotificationGetData data)
        {
            data.MethodName = "SpAppWg002NotificationList";
            data.Object = "GetNotificationList";
            data.WidgetTitle = "Notification";
            data.IsDisplayHiddenFieldWithMsg = "1";

            if (data.IdNotification <= 0) data.IdNotification = null;

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                           data,
                           Newtonsoft.Json.Formatting.None,
                           new JsonSerializerSettings
                           {
                               //Formatting = Formatting.Indented,
                               NullValueHandling = NullValueHandling.Ignore
                           })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.OnlyReplaceAllEmtyObjectJson))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        public async Task<WSEditReturn> CreateNotification(NotificationCreateData data)
        {
            data.AppModus = "0";
            return await SaveData(data, "SpCallNotification", "Notification");
        }

        public async Task<WSEditReturn> SetArchivedNotifications(NotificationSetArchivedData data)
        {
            data.AppModus = "0";
            return await SaveData(data, "SpCallNotification", "Notification");
        }
    }
}
