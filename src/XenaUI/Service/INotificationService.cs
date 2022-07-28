using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public interface INotificationService
    {
        Task<WSDataReturn> GetNotifications(NotificationGetData data);

        Task<WSEditReturn> CreateNotification(NotificationCreateData data);        

        Task<WSEditReturn> SetArchivedNotifications(NotificationSetArchivedData data);
    }    
}

