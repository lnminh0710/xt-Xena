using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;
using System;
using System.Reflection;
using Newtonsoft.Json;
using XenaUI.Utils.ElasticSearch;

namespace XenaUI.Business
{
    public partial class BackOfficeBusiness : BaseBusiness, IBackOfficeBusiness
    {
        private readonly IBackOfficeService _backOfficeService;
        private readonly IElasticSearchSyncBusiness _elasticSearchSyncBusiness;

        public BackOfficeBusiness(IHttpContextAccessor context, IBackOfficeService backOfficeService,
                              IElasticSearchSyncBusiness elasticSearchSyncBusiness) : base(context)
        {
            _backOfficeService = backOfficeService;
            _elasticSearchSyncBusiness = elasticSearchSyncBusiness;
        }


        public async Task<object> GetBlockedOrderTextTemplate(int? idRepSalesOrderStatus)
        {
            BlockOrdersData data = (BlockOrdersData)ServiceDataRequest.ConvertToRelatedType(typeof(BlockOrdersData));
            data.IdRepSalesOrderStatus = idRepSalesOrderStatus;
            var result = await _backOfficeService.GetBlockedOrderTextTemplate(data);
            return result;
        }

        public async Task<object> GetMailingListOfPlaceHolder()
        {
            BlockOrdersData data = (BlockOrdersData)ServiceDataRequest.ConvertToRelatedType(typeof(BlockOrdersData));
            var result = await _backOfficeService.GetMailingListOfPlaceHolder(data);
            return result;
        }

        public async Task<object> GetListOfMandantsByIdSalesOrder(string idSalesOrder)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            data.IdSalesOrder = idSalesOrder;
            var result = await _backOfficeService.GetListOfMandantsByIdSalesOrder(data);
            return result;
        }

        public async Task<object> GetListOfMandantsByIdPerson(string idPerson)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            data.IdPerson = idPerson;
            var result = await _backOfficeService.GetListOfMandantsByIdSalesOrder(data);
            return result;
        }

        public async Task<WSEditReturn> ConfirmSalesOrderLetters(string idGenerateLetter)
                {
                    ConfirmLettersData data = (ConfirmLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(ConfirmLettersData));
                    data.IdGenerateLetter = idGenerateLetter;

                    var result = await _backOfficeService.ConfirmSalesOrderLetters(data);

                    return result;
                }

        public async Task<WSEditReturn> ResetLetterStatus(string idGenerateLetter)
        {
                            ResetLetterStatusData data = (ResetLetterStatusData)ServiceDataRequest.ConvertToRelatedType(typeof(ResetLetterStatusData));
                            data.IdGenerateLetter = idGenerateLetter;

                            var result = await _backOfficeService.ResetLetterStatus(data);

                            return result;
        }

        public async Task<object> GetLetterTypeByMandant(string mandants)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            data.ListOfIdMandants = mandants;
            var result = await _backOfficeService.GetLetterTypeByMandant(data);
            return result;
        }

        public async Task<object> GetLetterTypeByWidgetAppId(string idRepWidgetApp)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            data.IdRepWidgetApp = idRepWidgetApp;
            var result = await _backOfficeService.GetLetterTypeByWidgetAppId(data);
            return result;
        }

        public async Task<object> GetGroupAndItemsByLetterType(string letterTypeId)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            data.IdBackOfficeLetters = letterTypeId;
            var result = await _backOfficeService.GetGroupAndItemsByLetterType(data);
            return result;
        }

        public async Task<object> GetAssignWidgetByLetterTypeId(string idBackOfficeLetters)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            if (!string.IsNullOrEmpty(idBackOfficeLetters)) {
                data.IdBackOfficeLetters = idBackOfficeLetters;
            }
            var result = await _backOfficeService.GetAssignWidgetByLetterTypeId(data);
            return result;
        }

        public async Task<object> GetAllTypeOfAutoLetter()
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            var result = await _backOfficeService.GetAllTypeOfAutoLetter(data);
            return result;
        }

        public async Task<object> GetCountriesLanguageByLetterTypeId(string idBackOfficeLetters)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            if (!string.IsNullOrEmpty(idBackOfficeLetters)) {
                data.IdBackOfficeLetters = idBackOfficeLetters;
            }
            var result = await _backOfficeService.GetCountriesLanguageByLetterTypeId(data);
            return result;
        }

        public async Task<object> GetListOfTemplate(string idBackOfficeLetters)
        {
            RequestCommonData data = (RequestCommonData)ServiceDataRequest.ConvertToRelatedType(typeof(RequestCommonData));
            if (!string.IsNullOrEmpty(idBackOfficeLetters)) {
                data.IdBackOfficeLetters = idBackOfficeLetters;
            }
            var result = await _backOfficeService.GetListOfTemplate(data);
            return result;
        }

        public async Task<WSEditReturn> SaveTextTemplate(BlockOrdersModel model)
        {
            BlockOrdersData data = (BlockOrdersData)ServiceDataRequest.ConvertToRelatedType(typeof(BlockOrdersData));
            data = (BlockOrdersData)Common.MappModelToSimpleData(data, model);
            if(model.MarkAsActive != null)
            {
                data.IsActive = (bool)model.MarkAsActive ? 1 : 0;
            }
            var result = await _backOfficeService.SaveTextTemplate(data);
            return result;
        }

        public async Task<WSEditReturn> SaveSalesOrderLetters(SalesOrderLettersViewModel model)
        {
           BackOfficeLettersData data = (BackOfficeLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLettersData));
           data = (BackOfficeLettersData)Common.MappModelToData(data, model, true);
           if (model.ReasonData != null && model.ReasonData.Count > 0)
           {
               var json = JsonConvert.SerializeObject(model.ReasonData, new JsonSerializerSettings
                                {
                                    NullValueHandling = NullValueHandling.Ignore
                                });
               data.JSONGenerateLetterItems = string.Format(@"""GenerateLetterItems"":{0}", json);
               data.JSONGenerateLetterItems = "{" + data.JSONGenerateLetterItems + "}";
           }
           return await _backOfficeService.SaveSalesOrderLetters(data);
        }

        public async Task<WSEditReturn> SaveSalesOrderLettersConfirm(ConfirmSalesOrderLettersViewModel model)
        {
           ConfirmBackOfficeLettersData data = (ConfirmBackOfficeLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(ConfirmBackOfficeLettersData));
           data = (ConfirmBackOfficeLettersData)Common.MappModelToData(data, model, true);
           data.JSONSalesOrderLetters = data.CreateJsonText("SalesOrderLetters", model.ConfirmBackOfficeLettersModels);
           return await _backOfficeService.SaveSalesOrderLettersConfirm(data);
        }

        public async Task<WSEditReturn> SaveSalesCustomerLetters(SalesOrderLettersViewModel model)
        {
           BackOfficeLettersData data = (BackOfficeLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLettersData));
           data = (BackOfficeLettersData)Common.MappModelToData(data, model, true);
           if (model.ReasonData != null && model.ReasonData.Count > 0)
           {
               var json = JsonConvert.SerializeObject(model.ReasonData, new JsonSerializerSettings
                                {
                                    NullValueHandling = NullValueHandling.Ignore
                                });
               data.JSONGenerateLetterItems = string.Format(@"""GenerateLetterItems"":{0}", json);
               data.JSONGenerateLetterItems = "{" + data.JSONGenerateLetterItems + "}";
           }
           return await _backOfficeService.SaveSalesCustomerLetters(data);
        }

        public async Task<WSEditReturn> SaveBackOfficeLetters(BackOfficeLettersViewModel model)
        {
            BackOfficeLetterTemplateData data = (BackOfficeLetterTemplateData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLetterTemplateData));
            data = (BackOfficeLetterTemplateData)Common.MappModelToData(data, model, true);
            if (model.Mandant != null && model.Mandant.Count > 0)
            {
                var jsonMandant = JsonConvert.SerializeObject(model.Mandant, new JsonSerializerSettings
                                {
                                    NullValueHandling = NullValueHandling.Ignore
                                });
                data.JSONMandant = string.Format(@"""Mandant"":{0}", jsonMandant);
                data.JSONMandant = "{" + data.JSONMandant + "}";
            }

            if (model.Countries != null && model.Countries.Count > 0)
            {
                var jsonCountries = JsonConvert.SerializeObject(model.Countries, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONCountries = string.Format(@"""Countries"":{0}", jsonCountries);
                data.JSONCountries = "{" + data.JSONCountries + "}";
            }

            if (model.AssignWidget != null && model.AssignWidget.Count > 0)
            {
                var jsonAssignWidget = JsonConvert.SerializeObject(model.AssignWidget, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONAssignWidget = string.Format(@"""AssignWidget"":{0}", jsonAssignWidget);
                data.JSONAssignWidget = "{" + data.JSONAssignWidget + "}";
            }
            if (model.Groups != null && model.Groups.Count > 0)
            {
                var jsonGroups = JsonConvert.SerializeObject(model.Groups, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONGroupsAndItems = string.Format(@"""Groups"":{0}", jsonGroups);
                data.JSONGroupsAndItems = "{" + data.JSONGroupsAndItems + "}";
            }
            if (model.DocTemplate != null && model.DocTemplate.Count > 0)
            {
                var jsonDocTemplate = JsonConvert.SerializeObject(model.DocTemplate, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONWordDocTemplate = string.Format(@"""DocTemplate"":{0}", jsonDocTemplate);
                data.JSONWordDocTemplate = "{" + data.JSONWordDocTemplate + "}";
            }
            return await _backOfficeService.SaveBackOfficeLetters(data);
        }

        public async Task<WSEditReturn> SaveBackOfficeLettersTest(SalesOrderLettersViewModel model)
        {
           BackOfficeLettersData data = (BackOfficeLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLettersData));
           data = (BackOfficeLettersData)Common.MappModelToData(data, model, true);
           if (model.ReasonData != null && model.ReasonData.Count > 0)
           {
               var json = JsonConvert.SerializeObject(model.ReasonData, new JsonSerializerSettings
                                {
                                    NullValueHandling = NullValueHandling.Ignore
                                });
               data.JSONBackOfficeLettersTest = string.Format(@"""LettersTest"":{0}", json);
               data.JSONBackOfficeLettersTest = "{" + data.JSONBackOfficeLettersTest + "}";
           }
           return await _backOfficeService.SaveBackOfficeLettersTest(data);
        }

        public async Task<WSEditReturn> SaveBackOfficeLettersTestGeneratedDoc(SalesOrderLettersViewModel model)
        {
           BackOfficeLettersData data = (BackOfficeLettersData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLettersData));
           data = (BackOfficeLettersData)Common.MappModelToData(data, model, true);
           if (model.TreeMedia != null && model.TreeMedia.Count > 0)
           {
               var json = JsonConvert.SerializeObject(model.TreeMedia, new JsonSerializerSettings
                                {
                                    NullValueHandling = NullValueHandling.Ignore
                                });
               data.JSONTreeMedia = string.Format(@"""TreeMedia"":{0}", json);
               data.JSONTreeMedia = "{" + data.JSONTreeMedia + "}";
           }
           return await _backOfficeService.SaveBackOfficeLettersTestGeneratedDoc(data);
        }

        public async Task<WSEditReturn> DeleteBackOfficeLetters(BackOfficeLetterTemplateDeleteData model)
        {
            BackOfficeLetterTemplateDeleteData data = (BackOfficeLetterTemplateDeleteData)ServiceDataRequest.ConvertToRelatedType(typeof(BackOfficeLetterTemplateDeleteData));
            data = (BackOfficeLetterTemplateDeleteData)Common.MappModelToData(data, model, true);
            data.IdGenerateLetter = model.IdGenerateLetter;
            return await _backOfficeService.DeleteBackOfficeLetters(data);
        }
    }
}
