using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Service;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using Newtonsoft.Json;
using XenaUI.Utils;
using Newtonsoft.Json.Serialization;
using System.Net;
using AutoMapper;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly INotificationBusiness _notificationBusiness;
        private readonly AppSettings _appSettings;
        private readonly ServerConfig _serverConfig;

        public NotificationController(IMapper mapper, INotificationBusiness notificationBusiness, IOptions<AppSettings> appSettings, IAppServerSetting appServerSetting)
        {
            _mapper = mapper;
            _notificationBusiness = notificationBusiness;
            _appSettings = appSettings.Value;
            _serverConfig = appServerSetting.ServerConfig;
        }

        [HttpGet]
        [Route("GetNotifications")]
        public async Task<object> GetNotifications(NotificationGetModel model)
        {
            return await _notificationBusiness.GetNotifications(model);
        }

        [HttpPost]
        [Route("CreateNotification")]
        public async Task<object> CreateNotification([FromBody]NotificationCreateModel model)
        {
            return await _notificationBusiness.CreateNotification(model);
        }

        [HttpPost]
        [Route("SetArchivedNotifications")]
        public async Task<object> SetArchivedNotifications([FromBody]IList<NotificationSetArchivedItemModel> model)
        {
            return await _notificationBusiness.SetArchivedNotifications(model);
        }

        [HttpPost]
        [Route("CreateNotificationWithSendEmail")]
        public async Task<object> CreateNotificationWithSendEmail([FromBody]EmailModel model)
        {
            model.ToEmail = _appSettings.SupportEmail;

            return await _notificationBusiness.CreateNotificationWithSendEmail(model, _appSettings, Domain);
        }
    }
}
