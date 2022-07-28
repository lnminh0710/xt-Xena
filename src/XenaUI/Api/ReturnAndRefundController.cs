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

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class ReturnAndRefundController : BaseController
    {
        private readonly IBackOfficeBusiness _returnAndRefundBusiness;

        public ReturnAndRefundController(IBackOfficeBusiness returnAndRefundBusiness)
        {
            _returnAndRefundBusiness = returnAndRefundBusiness;
        }

        // GET: api/ReturnAndRefund/GetWidgetInfoByIds
        [HttpGet]
        [Route("GetWidgetInfoByIds")]
        public async Task<object> GetWidgetInfoByIds(string personNr, string invoiceNr, string mediaCode)
        {
            var result = _returnAndRefundBusiness.GetWidgetInfoByIds(personNr, invoiceNr, mediaCode);

            return await result;

        }

        // POST: api/ReturnAndRefund/SaveWidgetData
        [HttpPost]
        [Route("SaveWidgetData")]
        public async Task<object> SaveWidgetData([FromBody]ReturnRefundSaveModel model)
        {
            var result = _returnAndRefundBusiness.SaveWidgetData(model);

            return await result;

        }

        // POST: api/ReturnAndRefund/SaveUnblockOrder
        [HttpPost]
        [Route("SaveUnblockOrder")]
        public async Task<object> SaveUnblockOrder(string idSalesOrder, bool? isDelete)
        {
            var result = _returnAndRefundBusiness.SaveUnblockOrder(idSalesOrder, isDelete);

            return await result;

        }

        // POST: api/ReturnAndRefund/SaveDeleteOrder
        [HttpPost]
        [Route("SaveDeleteOrder")]
        public async Task<object> SaveDeleteOrder(string idSalesOrder)
        {
            var result = _returnAndRefundBusiness.SaveDeleteOrder(idSalesOrder);

            return await result;

        }
    }
}
