using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// PersonService
    /// </summary>
    public class PersonService : BaseUniqueServiceRequest, IPersonService
    {
        public PersonService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public async Task<WSCustomerEditReturn> CreateCustomer(CustomerCreateData data, int numCommunications)
        {
            data.MethodName = "SpCallCustomerCreate";
            data.CrudType = "CREATE";
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data, Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                //Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(numCommunications, typeof(WSCustomerEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[numCommunications];
            return response != null ? ((IList<WSCustomerEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSCustomerEditReturn> UpdateCustomer(CustomerUpdateData data)
        {
            data.MethodName = "SpCallCustomerUpdate";
            data.CrudType = "UPDATE";
            data.GUID = Guid.NewGuid().ToString();

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data, Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings
                            {
                                //Formatting = Formatting.Indented,
                                NullValueHandling = NullValueHandling.Ignore
                            })
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(WSCustomerEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[1];
            return response != null ? ((IList<WSCustomerEditReturn>)response).FirstOrDefault() : null;
        }

        public Task<WSReturn> DeleteCustomer(CustomerDeleteData data)
        {
            throw new NotImplementedException();
        }

        public async Task<Customer> GetCustomer(CustomerData data)
        {

            data.MethodName = "SpCallCustomerUpdate";
            data.CrudType = "Read";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(2, typeof(Customer));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType2))[2];
            return response != null ? ((IList<Customer>)response).FirstOrDefault() : null;
        }

        public async Task<object> PreLoadBusinessLogic(CustomData data)
        {

            data.MethodName = "SpCallOrderDataEntry";
            data.CrudType = "GetData";
            data.Object = "PreLoadBusinessLogic";
            data.Mode = "AdditionalMandatoryFields";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response;
        }

        public async Task<PersonModel> GetPerson(PersonData data)
        {
            data.MethodName = "SpCallPersonRead";
            data.CrudType = "Read";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(PersonModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType3))[1];
            return response != null ? ((IList<PersonModel>)response).FirstOrDefault() : null;
        }

        public async Task<WSCustomerEditReturn> CreatePerson(PersonCreateData data)
        {
            data.MethodName = "SpCallPersonCreate";
            data.CrudType = "CREATE";
            return await SavingPerson(data);
        }

        public async Task<WSCustomerEditReturn> UpdatePerson(PersonUpdateData data)
        {
            data.MethodName = "SpCallPersonUpdate";
            data.CrudType = "UPDATE";
            return await SavingPerson(data);
        }

        private async Task<WSCustomerEditReturn> SavingPerson(dynamic data)
        {
            data.GUID = Guid.NewGuid().ToString();
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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSCustomerEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.CreatePerson))[0];
            return response != null ? ((IList<WSCustomerEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<object> LoadPaymentAccount(PaymentData data)
        {
            data.MethodName = "SpCallCashProviderRead";

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(object));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType3))[1];
            return response != null ? ((IList<object>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> CreatePaymentAccount(PaymentCreateData data, int numIdentiferCodes)
        {
            data.MethodName = "SpCallCashProviderCreate";
            data.CrudType = "CREATE";
            data.GUID = Guid.NewGuid().ToString();

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(numIdentiferCodes, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[numIdentiferCodes];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> CreateCCPRN(CCPRNCreateData data, int numCashProviderContractCreditcardType)
        {
            data.MethodName = "SpCallCashProviderContractCreate";
            data.CrudType = "CREATE";
            data.GUID = Guid.NewGuid().ToString();

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<object> LoadCCPRN(CCPRNData data)
        {
            data.MethodName = "SpCallCashProviderContractRead";

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(1, typeof(object));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType3))[1];
            return response != null ? ((IList<object>)response).FirstOrDefault() : null;
        }

        public async Task<WSEditReturn> CreateCostProvider(CostProviderCreateData data, int numProviderCostsItems)
        {
            data.MethodName = "SpCallProviderCostsCreate";
            data.CrudType = "CREATE";
            data.GUID = Guid.NewGuid().ToString();

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(numProviderCostsItems * 7, typeof(WSEditReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[numProviderCostsItems * 7];
            return response != null ? ((IList<WSEditReturn>)response).FirstOrDefault() : null;
        }

        public async Task<object> LoadCommunication(PersonData data)
        {
            data.MethodName = "SpAppWg002GetGridCommunication";
            data.IdPerson = null;
            data.GUID = Guid.NewGuid().ToString();
            data.WidgetTitle = "Communication";

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        public async Task<object> GetCustomerHistory(PersonData data)
        {
            data.MethodName = "SpAppB01CustomerHistory";
            data.GUID = Guid.NewGuid().ToString();
            data.WidgetTitle = "Get Customer History";
            data.Object = "GetCustomerHistory";

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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }

        public async Task<object> GetMandatoryField(PersonData data)
        {
            data.MethodName = "SpCallBusinessLogic";
            data.WidgetTitle = "Get Mandatory Fields";
            data.Object = "SetMandatoryFields";

            return await PostToService(data);
        }

        /// <summary>
        /// GetPersonData
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<object> GetPersonData(PersonData data)
        {
            data.MethodName = "SpAppB00Matching";
            data.WidgetTitle = "Customer Doublette";
            data.Object = "GetPersonData";
            return await PostToService(data);
        }


        private async Task<object> PostToService(PersonData data)
        {
            data.GUID = Guid.NewGuid().ToString();
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
            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }
    }
}
