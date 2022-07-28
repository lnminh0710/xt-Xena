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
    public class BlockOrdersController : BaseController
    {
        private readonly IBackOfficeBusiness _blockOrdersBusiness;

        public BlockOrdersController(IBackOfficeBusiness blockOrdersBusiness)
        {
            _blockOrdersBusiness = blockOrdersBusiness;
        }

        // GET: api/BlockOrders/GetTextTemplate
        [HttpGet]
        [Route("GetTextTemplate")]
        public async Task<object> GetTextTemplate(int? idRepSalesOrderStatus)
        {
            return await _blockOrdersBusiness.GetBlockedOrderTextTemplate(idRepSalesOrderStatus);
        }

        // GET: api/BlockOrders/GetMailingListOfPlaceHolder
        [HttpGet]
        [Route("GetMailingListOfPlaceHolder")]
        public async Task<object> GetMailingListOfPlaceHolder()
        {
            return await _blockOrdersBusiness.GetMailingListOfPlaceHolder();
        }

        // GET: api/BlockOrders/GetListOfMandantsByIdSalesOrder
        [HttpGet]
        [Route("GetListOfMandantsByIdSalesOrder")]
        public async Task<object> GetListOfMandantsByIdSalesOrder(string idSalesOrder)
        {
            return await _blockOrdersBusiness.GetListOfMandantsByIdSalesOrder(idSalesOrder);
        }

        // GET: api/BlockOrders/GetListOfMandantsByIdPerson
        [HttpGet]
        [Route("GetListOfMandantsByIdPerson")]
        public async Task<object> GetListOfMandantsByIdPerson(string idPerson)
        {
            return await _blockOrdersBusiness.GetListOfMandantsByIdPerson(idPerson);
        }

        // GET: api/BlockOrders/GetLetterTypeByMandant
        [HttpGet]
        [Route("GetLetterTypeByMandant")]
        public async Task<object> GetLetterTypeByMandant(string mandants)
        {
            return await _blockOrdersBusiness.GetLetterTypeByMandant(mandants);
        }

        // GET: api/BlockOrders/GetLetterTypeByWidgetAppId
        [HttpGet]
        [Route("GetLetterTypeByWidgetAppId")]
        public async Task<object> GetLetterTypeByWidgetAppId(string idRepWidgetApp)
        {
            return await _blockOrdersBusiness.GetLetterTypeByWidgetAppId(idRepWidgetApp);
        }

        // GET: api/BlockOrders/GetGroupAndItemsByLetterType
        [HttpGet]
        [Route("GetGroupAndItemsByLetterType")]
        public async Task<object> GetGroupAndItemsByLetterType(string letterTypeId)
        {
            return await _blockOrdersBusiness.GetGroupAndItemsByLetterType(letterTypeId);
        }

        // GET: api/BlockOrders/GetAssignWidgetByLetterTypeId
        [HttpGet]
        [Route("GetAssignWidgetByLetterTypeId")]
        public async Task<object> GetAssignWidgetByLetterTypeId(string idBackOfficeLetters)
        {
            return await _blockOrdersBusiness.GetAssignWidgetByLetterTypeId(idBackOfficeLetters);
        }

        // GET: api/BlockOrders/GetAllTypeOfAutoLetter
        [HttpGet]
        [Route("GetAllTypeOfAutoLetter")]
        public async Task<object> GetAllTypeOfAutoLetter()
        {
            return await _blockOrdersBusiness.GetAllTypeOfAutoLetter();
        }

        // GET: api/BlockOrders/GetCountriesLanguageByLetterTypeId
        [HttpGet]
        [Route("GetCountriesLanguageByLetterTypeId")]
        public async Task<object> GetCountriesLanguageByLetterTypeId(string idBackOfficeLetters)
        {
            return await _blockOrdersBusiness.GetCountriesLanguageByLetterTypeId(idBackOfficeLetters);
        }

        // GET: api/BlockOrders/GetListOfTemplate
        [HttpGet]
        [Route("GetListOfTemplate")]
        public async Task<object> GetListOfTemplate(string idBackOfficeLetters)
        {
            return await _blockOrdersBusiness.GetListOfTemplate(idBackOfficeLetters);
        }

        /* POST Request*/

        // POST: api/BlockOrders/SaveTextTemplate
        [HttpPost]
        [Route("SaveTextTemplate")]
        public async Task<object> SaveTextTemplate([FromBody]BlockOrdersModel model)
        {
            return await _blockOrdersBusiness.SaveTextTemplate(model);
        }

        // POST: api/BlockOrders/SaveSalesOrderLetters
        [HttpPost]
        [Route("SaveSalesOrderLetters")]
        public async Task<object> SaveSalesOrderLetters([FromBody]SalesOrderLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveSalesOrderLetters(model);
        }

        // POST: api/BlockOrders/SaveSalesOrderLettersConfirm
        [HttpPost]
        [Route("SaveSalesOrderLettersConfirm")]
        public async Task<object> SaveSalesOrderLettersConfirm([FromBody]ConfirmSalesOrderLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveSalesOrderLettersConfirm(model);
        }

        // POST: api/BlockOrders/ConfirmSalesOrderLetters
        [HttpPost]
        [Route("ConfirmSalesOrderLetters")]
        public async Task<object> ConfirmSalesOrderLetters(string idGenerateLetter)
        {
            return await _blockOrdersBusiness.ConfirmSalesOrderLetters(idGenerateLetter);
        }

        // POST: api/BlockOrders/ResetLetterStatus
        [HttpPost]
        [Route("ResetLetterStatus")]
        public async Task<object> ResetLetterStatus(string idGenerateLetter)
        {
            return await _blockOrdersBusiness.ResetLetterStatus(idGenerateLetter);
        }

        // POST: api/BlockOrders/SaveSalesCustomerLetters
        [HttpPost]
        [Route("SaveSalesCustomerLetters")]
        public async Task<object> SaveSalesCustomerLetters([FromBody]SalesOrderLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveSalesCustomerLetters(model);
        }

        // POST: api/BlockOrders/SaveBackOfficeLetters
        [HttpPost]
        [Route("SaveBackOfficeLetters")]
        public async Task<object> SaveBackOfficeLetters([FromBody]BackOfficeLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveBackOfficeLetters(model);
        }

        // POST: api/BlockOrders/SaveBackOfficeLettersTest
        [HttpPost]
        [Route("SaveBackOfficeLettersTest")]
        public async Task<object> SaveBackOfficeLettersTest([FromBody]SalesOrderLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveBackOfficeLettersTest(model);
        }

        // POST: api/BlockOrders/SaveBackOfficeLettersTestGeneratedDoc
        [HttpPost]
        [Route("SaveBackOfficeLettersTestGeneratedDoc")]
        public async Task<object> SaveBackOfficeLettersTestGeneratedDoc([FromBody]SalesOrderLettersViewModel model)
        {
            return await _blockOrdersBusiness.SaveBackOfficeLettersTestGeneratedDoc(model);
        }

        [HttpPost]
        [Route("DeleteBackOfficeLetters")]
        public async Task<object> DeleteBackOfficeLetters([FromBody] BackOfficeLetterTemplateDeleteData model)
        {
            return await _blockOrdersBusiness.DeleteBackOfficeLetters(model);
        }
    }
}
