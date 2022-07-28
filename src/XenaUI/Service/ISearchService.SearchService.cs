using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json.Linq;
using XenaUI.Constants;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Service
{
    /// <summary>
    /// SearchService
    /// </summary>
    public class SearchService : BaseUniqueServiceRequest, ISearchService
    {
        public SearchService(IOptions<AppSettings> appSettings, IHostingEnvironment hostingEnvironment, 
                             IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting) 
                            : base(appSettings, httpContextAccessor, appServerSetting) {
            _hostingEnvironment = hostingEnvironment;
        }

        private readonly IHostingEnvironment _hostingEnvironment;

        public async Task<IList<GlobalModule>> GetAllModules(Data data)
        {
            return await CreateFakeData_Modules();
        }

        public async Task<int> SearchSummaryWithKeywork(SearchData searchData)
        {
            return await CreateFakeData_SearchSummary(int.Parse(searchData.IdSettingsGUI));
        }

        public async Task<CustomerCollection> SearchWithKeywork(SearchData searchData)
        {
            var returnObj = new CustomerCollection();
            var result = await CreateFakeCustomerData_SearchDetail();
            returnObj.Total = result.Count;
            if (searchData.PageIndex > 1)
                returnObj.CollectionCustomers = (result).Skip((searchData.PageIndex - 1) * searchData.PageSize).Take(searchData.PageSize).ToList();
            else
                returnObj.CollectionCustomers = (result).Take(searchData.PageSize).ToList();
            return returnObj;
        }

        private Task<IList<GlobalModule>> CreateFakeData_Modules()
        {
            return Task.FromResult((IList<GlobalModule>) new List<GlobalModule>
            {
                new GlobalModule { IdSettingsGUI = 1, IconName = "fa-user-secret", ModuleName ="Administration" , Children = CreateFakeData_SubModules(1)},
                new GlobalModule { IdSettingsGUI = 2, IconName = "fa-user-secret", ModuleName ="Customer" , Children = CreateFakeData_SubModules(2), IsCanNew = true, IsCanSearch = true},
                new GlobalModule { IdSettingsGUI = 3, IconName = "fa-user-secret", ModuleName ="Article" },
                new GlobalModule { IdSettingsGUI = 4, IconName = "fa-user-secret", ModuleName ="Campaign" , Children = CreateFakeData_SubModules(4)},
                new GlobalModule { IdSettingsGUI = 5, IconName = "fa-user-secret", ModuleName ="Campagne Costs" , Children = CreateFakeData_SubModules(5)},                
                new GlobalModule { IdSettingsGUI = 7, IconName = "fa-user-secret", ModuleName ="Order" , Children = CreateFakeData_SubModules(7)},
                new GlobalModule { IdSettingsGUI = 8, IconName = "fa-user-secret", ModuleName ="Purchase" , Children = CreateFakeData_SubModules(8)},
                new GlobalModule { IdSettingsGUI = 9, IconName = "fa-user-secret", ModuleName ="Return Refund" , Children = CreateFakeData_SubModules(9)},
                new GlobalModule { IdSettingsGUI = 10, IconName = "fa-user-secret", ModuleName ="Stock Correction" , Children = CreateFakeData_SubModules(10)},
                new GlobalModule { IdSettingsGUI = 11, IconName = "fa-user-secret", ModuleName ="Warehouse Movement" , Children = CreateFakeData_SubModules(11)},
            });
        }

        private IList<GlobalModule> CreateFakeData_SubModules(int parentId)
        {
            switch(parentId)
            {
                case 1:
                
                    return new List<GlobalModule>
                    {
                        new GlobalModule { IdSettingsGUI = 12, IconName = "fa-user-secret", ModuleName ="Broker", IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 13, IconName = "fa-user-secret", ModuleName ="Cash Provider", IdSettingsGUIParent = 1 },
                        new GlobalModule { IdSettingsGUI = 14, IconName = "fa-user-secret", ModuleName ="Desktop Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 15, IconName = "fa-user-secret", ModuleName ="Freight Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 16, IconName = "fa-user-secret", ModuleName ="Mandant" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 17, IconName = "fa-user-secret", ModuleName ="Middleman" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 18, IconName = "fa-user-secret", ModuleName ="POST" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 19, IconName = "fa-user-secret", ModuleName ="Post Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 20, IconName = "fa-user-secret", ModuleName ="Principle" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 21, IconName = "fa-user-secret", ModuleName ="Print Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 22, IconName = "fa-user-secret", ModuleName ="Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 23, IconName = "fa-user", ModuleName ="Scan Center" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 24, IconName = "fa-user", ModuleName ="Service Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 25, IconName = "fa-support", ModuleName ="Supplier" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 26, IconName = "fa-product-hunt", ModuleName ="Translation Provider" , IdSettingsGUIParent = 1},
                        new GlobalModule { IdSettingsGUI = 27, IconName = "fa-home", ModuleName ="Warehouse" , IdSettingsGUIParent = 1}
                    };
                default:
                    return null;
            }
            
        }

        private Task<int> CreateFakeData_SearchSummary(int id)
        {
            if(id > 1 && id < 12)
                return Task.FromResult(new Random().Next(300, 1000));
            else
            {
                switch (id)
                {
                    case 1: return Task.FromResult(1600);
                    default: return Task.FromResult(100);
                }
            }
        }

        private Task<IList<Customer>> CreateFakeCustomerData_SearchDetail()
        {
            JArray jsonArray = JArray.Parse(File.ReadAllText(_hostingEnvironment.ContentRootPath + "\\FakeSearchDetailDataJson.json"));

            string[] colProperties = ((JProperty)jsonArray.First.First.First).Value.ToString()
                                        .Replace("{", string.Empty).Replace("}", string.Empty)
                                        .Split(new string[] { "," }, StringSplitOptions.None);
            string jsonRewrappedResult = string.Empty;
            foreach (var jsonObject in jsonArray[1])
            {
                try
                {
                    // loop throught the ColumnName array to set value to property of instance object
                    string jsonRewrappedItem = string.Empty;
                    for (int index = 0; index < colProperties.Length; index++)
                    {
                        try
                        {
                            JProperty jsonProperty = ((JObject)jsonObject).Properties().ElementAt(index);
                            jsonRewrappedItem += string.Format(@"""{0}"":[""{1}"":""{2}"",""{3}"":""{4}""]",
                                colProperties[index], //0
                                ConstNameSpace.ModelPropertyDisplayValue, jsonProperty.Name, //1,2
                                ConstNameSpace.ModelPropertyValue, jsonProperty.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty)); //3,4

                            if (index < colProperties.Length - 1)
                                jsonRewrappedItem += ",";
                            else
                            {
                                jsonRewrappedItem = string.Format("[{0}],", jsonRewrappedItem);
                                jsonRewrappedItem = jsonRewrappedItem.Replace("[", "{").Replace("]", "}");
                            }
                        }
                        catch { }
                    }
                    jsonRewrappedResult += jsonRewrappedItem;

                }
                catch
                {
                }
            }

            jsonRewrappedResult = jsonRewrappedResult.Remove(jsonRewrappedResult.Length - 1, 1);
            jsonRewrappedResult = string.Format(@"[{0}]", jsonRewrappedResult);

            return Task.FromResult(JsonConvert.DeserializeObject<IList<Customer>>(jsonRewrappedResult));
        }

        public Task<IList<GlobalModule>> GetAllModules(string access_token)
        {
            throw new NotImplementedException();
        }

        public Task<int> SearchSummaryWithKeywork(string access_token, SearchData searchData)
        {
            throw new NotImplementedException();
        }

        public Task<IList<Customer>> SearchWithKeywork(string access_token, SearchData searchData)
        {
            throw new NotImplementedException();
        }
    }
}
