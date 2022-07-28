using AutoMapper;
using XenaUI.Utils;

namespace XenaUI.Models
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //TSource, TDestination
            CreateMap<NotificationGetModel, NotificationGetData>();
            CreateMap<NotificationForCreateModel, NotificationForCreateData>();
            CreateMap<NotificationItemsForCreateModel, NotificationItemsForCreateData>();
            CreateMap<NotificationSetArchivedItem, NotificationSetArchivedItemModel>();
        }
    }
}
