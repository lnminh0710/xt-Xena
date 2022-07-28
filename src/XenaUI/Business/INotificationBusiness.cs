using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface INotificationBusiness
    {
        Task<WSDataReturn> GetNotifications(NotificationGetModel model);

        Task<WSEditReturn> CreateNotification(NotificationCreateModel model);

        Task<WSEditReturn> SetArchivedNotifications(IList<NotificationSetArchivedItemModel> items);

        Task<WSEditReturn> CreateNotificationWithSendEmail(EmailModel model, AppSettings appSettings, string domain);
    }
}

