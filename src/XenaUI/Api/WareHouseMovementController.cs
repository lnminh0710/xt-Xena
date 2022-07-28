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
    public class WareHouseMovementController : BaseController
    {
        private readonly IBackOfficeBusiness _wareHouseMovementBusiness;

        public WareHouseMovementController(IBackOfficeBusiness wareHouseMovementBusiness)
        {
            _wareHouseMovementBusiness = wareHouseMovementBusiness;
        }

        // GET: api/WareHouseMovement/GetData
        [HttpGet]
        [Route("GetData")]
        public async Task<object> GetData()
        {
            var result = _wareHouseMovementBusiness.GetWarehouseMovement();
            
            return await result;
        }

        // GET: api/WareHouseMovement/GetDataPdf
        [HttpGet]
        [Route("GetDataPdf")]
        public async Task<object> GetDataPdf()
        {
            var result = _wareHouseMovementBusiness.GetWarehouseMovementForPdf();
           
            return await result;
        }

        // GET: api/WareHouseMovement/GetCosts
        [HttpGet]
        [Route("GetCosts")]
        public async Task<object> GetCosts(int? idWarehouseMovement)
        {
            var result = _wareHouseMovementBusiness.GetWarehouseMovementCosts(idWarehouseMovement);
            
            return await result;
        }

        // GET: api/WareHouseMovement/GetWarehouseMovement
        [HttpGet]
        [Route("GetWarehouseMovement")]
        public async Task<object> GetWarehouseMovement(int? idWarehouseMovement)
        {
            var result = _wareHouseMovementBusiness.GetWarehouseMovementById(idWarehouseMovement);

            return await result;
        }

		// GET: api/WareHouseMovement/GetSelectedArticles
		[HttpGet]
        [Route("GetSelectedArticles")]
        public async Task<object> GetSelectedArticles(int? idWarehouseMovement)
        {
            return await _wareHouseMovementBusiness.GetSelectedArticles(idWarehouseMovement);
        }

        // GET: api/WareHouseMovement/GetArrivedArticles
        [HttpGet]
        [Route("GetArrivedArticles")]
        public async Task<object> GetArrivedArticles(int? idWarehouseMovement)
        {
            return await _wareHouseMovementBusiness.GetArrivedArticles(idWarehouseMovement);
        }

        // GET: api/WareHouseMovement/StockedArticles
        [HttpGet]
        [Route("StockedArticles")]
        public async Task<object> StockedArticles(int? idWarehouseMovement)
        {
            return await _wareHouseMovementBusiness.StockedArticles(idWarehouseMovement);
        }

        // GET: api/WareHouseMovement/SearchArticles
        [HttpGet]
        [Route("SearchArticles")]
        public async Task<object> SearchArticles(string searchString, int? idPersonFromWarehouse)
        {
            return await _wareHouseMovementBusiness.SearchArticles(searchString, idPersonFromWarehouse);
        }

        //POST: api/WareHouseMovement/SaveWarehouseMovement
        [HttpPost]
        [Route("SaveWarehouseMovement")]
        public async Task<object> SaveWarehouseMovement([FromBody]WareHouseMovementModel model)
        {
           return await _wareHouseMovementBusiness.SaveWarehouseMovement(model);
        }

        //POST: api/WareHouseMovement/SaveGoodsReceiptPosted
        [HttpPost]
        [Route("SaveGoodsReceiptPosted")]
        public async Task<object> SaveGoodsReceiptPosted([FromBody]IList<GoodsReceiptPostedModel> model)
        {
            return await _wareHouseMovementBusiness.SaveGoodsReceiptPosted(model);
        }

        //POST: api/WareHouseMovement/ConfirmGoodsReceiptPosted
        [HttpPost]
        [Route("ConfirmGoodsReceiptPosted")]
        public async Task<object> ConfirmGoodsReceiptPosted([FromBody]ConfirmGoodsReceiptPostedModel model)
        {
            return await _wareHouseMovementBusiness.ConfirmGoodsReceiptPosted(model);
        }
    }
}
