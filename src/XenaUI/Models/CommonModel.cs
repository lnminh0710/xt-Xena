using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Models
{
    /// <summary>
    /// CustomerMatchedModel
    /// </summary>
    public class CustomerMatchedModel
    {
        public long IdPerson { get; set; }

        /// <summary>
        /// FirstName
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// LastName
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Street
        /// </summary>
        public string Street { get; set; }

        /// <summary>
        /// Zip
        /// </summary>
        public string Zip { get; set; }

        /// <summary>
        /// IdRepIsoCountryCode
        /// </summary>
        public string IdRepIsoCountryCode { get; set; }
    }

    /// <summary>
    /// CreateQueueModel
    /// </summary>
    public class CreateQueueModel
    {
        /// <summary>
        /// IdRepAppSystemScheduleServiceName
        /// </summary>
        public int IdRepAppSystemScheduleServiceName { get; set; }

        /// <summary>
        /// JsonText
        /// </summary>
        public string JsonText { get; set; }
    }

    /// <summary>
    /// DeleteQueuesModel
    /// </summary>
    public class DeleteQueuesModel
    {
        /// <summary>
        /// QueuesId
        /// </summary>
        public string QueuesId { get; set; }
    }

    /// <summary>
    /// SharingTreeGroupsModel
    /// </summary>
    public class SharingTreeGroupsModel
    {
        /// <summary>
        /// IdSharingTreeGroups
        /// </summary>
        public int? IdSharingTreeGroups { get; set; }

        /// <summary>
        /// Slave2IdSharingTreeGroups
        /// </summary>
        public int? Slave2IdSharingTreeGroups { get; set; }
        
        /// <summary>
        /// IdSharingTreeGroupsRootname
        /// </summary>
        public int? IdSharingTreeGroupsRootname { get; set; }
        
        /// <summary>
        /// IdApplicationOwner
        /// </summary>
        public int? IdApplicationOwner { get; set; }
        
        /// <summary>
        /// GroupName
        /// </summary>
        public string GroupName { get; set; }
        
        /// <summary>
        /// SortingIndex
        /// </summary>
        public int? SortingIndex { get; set; }
        
        /// <summary>
        /// IconName
        /// </summary>
        public string IconName { get; set; }
        
        /// <summary>
        /// IsBlocked
        /// </summary>
        public bool? IsBlocked { get; set; }
        
        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }
    }
}
