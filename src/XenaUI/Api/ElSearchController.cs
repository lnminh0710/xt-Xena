using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Utils.ElasticSearch;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using XenaUI.Utils;
using Nest;
using XenaUI.Models;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    public class ElSearchController : BaseController
    {
        private readonly AppSettings _appSettings;
        private IPathProvider _pathProvider;
        IElasticSearchClientHelper _elasticSearchClientHelper;
        IUniqueBusiness _uniqueBusiness;

        public ElSearchController(IOptions<AppSettings> appSettings, IUniqueBusiness uniqueBusiness, IBaseBusiness baseBusiness, IAppServerSetting appServerSetting, IPathProvider pathProvider)
        {
            _appSettings = appSettings.Value;
            _pathProvider = pathProvider;
            _uniqueBusiness = uniqueBusiness;

            _elasticSearchClientHelper = new ElasticSearchClientHelper(_appSettings.EnableLogES)
            {
                IdApplicationOwner = baseBusiness.UserFromService.IdApplicationOwner,
                EsUri = appServerSetting.ServerConfig.ServerSetting.ElasticSearchServiceUrl
            };
        }

        /// <summary>
        /// GetSearchSummary
        /// </summary>
        /// <param name="indexes"></param>
        /// <param name="keyword"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSearchSummary")]
        [AllowAnonymous]
        public IList<IndexSearchSummary> GetSearchSummary(string indexes, string keyword, bool isWithStar = false, string searchWithStarPattern = null,
                IList<string> fieldName = null, IList<string> fieldValue = null)
        {
            indexes = RemoveFakeIndexes(indexes);
            if (string.IsNullOrEmpty(indexes))
                return new List<IndexSearchSummary>();

            keyword = string.IsNullOrEmpty(keyword) ? "*" : keyword;

            _elasticSearchClientHelper.CreateClient<dynamic>();

            if (!_appSettings.IsSelectionProject)
            {
                IList<ESSearchFieldBasic> fields = new List<ESSearchFieldBasic>();
                #region FieldName,fieldValue
                if (fieldName != null && fieldName.Count > 0 && fieldValue != null && fieldValue.Count > 0)
                {
                    for (int i = 0; i < fieldName.Count; i++)
                    {
                        if (i >= fieldValue.Count) break;

                        fields.Add(new ESSearchFieldBasic
                        {
                            FieldName = fieldName[i],
                            FieldValue = fieldValue[i],
                            QueryType = ESQueryType.Wildcard
                        });
                    }//for
                }
                #endregion

                _elasticSearchClientHelper.EsConfigFolder = GetEsConfigFolder();
                _elasticSearchClientHelper.EnableSearchCustomerContact = _appSettings.EnableSearchCustomerContact;
                return _elasticSearchClientHelper.GetIndexSummary(indexes, keyword, isWithKeywords: isWithStar, searchWithStarPattern: searchWithStarPattern, fields: fields);
            }

            #region Selection
            IList<IndexSearchSummary> result = new List<IndexSearchSummary>();

            //IsActive
            var getResult = _elasticSearchClientHelper.GetIndexSummary(indexes, keyword, isWithKeywords: isWithStar,
                fields: new List<ESSearchFieldBasic>() { new ESSearchFieldBasic
                    {
                        FieldName = "isActive",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    }});
            foreach (var item in getResult)
            {
                item.Key = item.Key + "isactive";
                result.Add(item);
            }

            //IsArchived
            getResult = _elasticSearchClientHelper.GetIndexSummary(indexes, keyword, isWithKeywords: isWithStar,
                fields: new List<ESSearchFieldBasic>() { new ESSearchFieldBasic
                    {
                        FieldName = "isArchived",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    }});
            foreach (var item in getResult)
            {
                item.Key = item.Key + "isarchived";
                result.Add(item);
            }

            #region Calculate for parent
            foreach (var key in indexes.Split(','))
            {
                result.Add(new IndexSearchSummary()
                {
                    Key = key,
                    Count = result.Where(n => n.Key.StartsWith(key)).Sum(n => n.Count)
                });
            }
            #endregion

            return result;
            #endregion
        }

        /// <summary>
        /// SearchDetail
        /// </summary>
        /// <param name="searchIndex"></param>
        /// <param name="searchType"></param>
        /// <param name="keyword"></param>
        /// <param name="moduleId"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="fieldName"></param>
        /// <param name="fieldValue"></param>
        /// <param name="isWithStar"></param>
        /// <param name="searchWithStarPattern"></param>
        /// <param name="isGetCustomerById"></param>
        /// <param name="onlySearchCampaign"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("SearchDetail")]
        [AllowAnonymous]
        public async Task<EsSearchResult<dynamic>> SearchDetail(string searchIndex, string searchType, string keyword, int moduleId, int pageIndex, int pageSize,
            IList<string> fieldName = null, IList<string> fieldValue = null, bool isWithStar = false, string searchWithStarPattern = null,
            bool isGetCustomerById = false, bool onlySearchCampaign = false)
        {
            keyword = string.IsNullOrEmpty(keyword) ? "*" : keyword;
            if (string.IsNullOrWhiteSpace(searchType))
                searchType = searchIndex;

            IList<ESSearchFieldBasic> fields = new List<ESSearchFieldBasic>();

            var isCustomerContact = searchIndex == ElasticSearchIndexName.CustomerContact ||
                                    searchIndex == ElasticSearchIndexName.CustomerFootContact;

            #region FieldName,fieldValue
            if (fieldName != null && fieldName.Count > 0 && fieldValue != null && fieldValue.Count > 0)
            {
                for (int i = 0; i < fieldName.Count; i++)
                {
                    if (i >= fieldValue.Count) break;

                    var field = new ESSearchFieldBasic
                    {
                        FieldName = fieldName[i],
                        FieldValue = fieldValue[i],
                        QueryType = ESQueryType.Wildcard
                    };
                    if (isCustomerContact && field.FieldName.StartsWith("id"))
                    {
                        field.QueryType = ESQueryType.Term;
                    }
                    fields.Add(field);
                }//for
            }
            #endregion

            #region SelectionProject
            if (_appSettings.IsSelectionProject)
            {
                var isActive = searchIndex.ToLower().Contains("isactive");
                var isArchived = searchIndex.ToLower().Contains("isarchived");
                var subStringLength = isActive ? "isactive".Length : isArchived ? "isarchived".Length : 0;
                searchIndex = searchIndex.Substring(0, searchIndex.Length - subStringLength);
                searchType = searchIndex;

                if (isActive)
                {
                    fields.Add(new ESSearchFieldBasic
                    {
                        FieldName = "isActive",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    });
                }
                if (isArchived)
                {
                    fields.Add(new ESSearchFieldBasic
                    {
                        FieldName = "isArchived",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    });
                }
            }
            #endregion

            #region Prepare Index
            if (searchIndex == ElasticSearchIndexName.CampaignMediaCode)
            {
                searchIndex = ElasticSearchIndexName.Campaign;
                searchType = ElasticSearchIndexName.CampaignMediaCode;
            }
            else if (searchIndex == ElasticSearchIndexName.CustomerFoot)
            {
                searchIndex = ElasticSearchIndexName.Customer;
                searchType = ElasticSearchIndexName.CustomerFoot;
            }
            else if (searchIndex == ElasticSearchIndexName.CustomerContact)
            {
                searchIndex = ElasticSearchIndexName.Customer;
                searchType = ElasticSearchIndexName.CustomerContact;
            }
            else if (searchIndex == ElasticSearchIndexName.CustomerFootContact)
            {
                searchIndex = ElasticSearchIndexName.Customer;
                searchType = ElasticSearchIndexName.CustomerFootContact;
            }
            #endregion

            _elasticSearchClientHelper.CreateClient<dynamic>(searchIndex, searchType);
            _elasticSearchClientHelper.EsConfigFolder = GetEsConfigFolder();
            _elasticSearchClientHelper.EnableSearchCustomerContact = _appSettings.EnableSearchCustomerContact;
            EsSearchResult<dynamic> resultList = _elasticSearchClientHelper.SearchAny<dynamic>(keyword, pageIndex, pageSize, isWithKeywords: isWithStar, searchWithStarPattern: searchWithStarPattern, fields: fields, isGetCustomerById: isGetCustomerById, onlySearchCampaign: onlySearchCampaign);

            var setting = _uniqueBusiness.GetColumnSetting(isCustomerContact ? "ContactSearch" : moduleId.ToString());
            resultList.Setting = await setting;
            return resultList;
        }

        /// <summary>
        /// SearchByField
        /// </summary>
        /// <param name="field"></param>
        /// <param name="searchIndex"></param>
        /// <param name="keyword"></param>
        /// <param name="moduleId"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchFieldByWildCard"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("SearchByField")]
        [AllowAnonymous]
        public async Task<EsSearchResult<dynamic>> SearchByField(string field, string searchIndex, string keyword, int moduleId, int pageIndex, int pageSize, ESQueryType? queryType = null)
        {
            keyword = string.IsNullOrEmpty(keyword) ? "*" : keyword;

            IList<ESSearchFieldBasic> fields = new List<ESSearchFieldBasic>();

            #region SelectionProject
            if (_appSettings.IsSelectionProject)
            {
                var isActive = keyword.ToLower().Contains("isactive");
                var isArchived = keyword.ToLower().Contains("isarchived");
                var subStringLength = isActive ? "isactive".Length : isArchived ? "isarchived".Length : 0;
                keyword = keyword.Substring(0, keyword.Length - subStringLength);

                if (isActive)
                {
                    fields.Add(new ESSearchFieldBasic
                    {
                        FieldName = "isActive",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    });
                }
                if (isArchived)
                {
                    fields.Add(new ESSearchFieldBasic
                    {
                        FieldName = "isArchived",
                        FieldValue = "1",
                        QueryType = ESQueryType.Term
                    });
                }
            }
            #endregion

            _elasticSearchClientHelper.CreateClient<dynamic>(searchIndex);
            _elasticSearchClientHelper.EnableSearchCustomerContact = _appSettings.EnableSearchCustomerContact;
            EsSearchResult<dynamic> resultList = _elasticSearchClientHelper.SearchByField<dynamic>(field, keyword, pageIndex, pageSize, fields: fields, queryType: queryType);

            var setting = _uniqueBusiness.GetColumnSetting(moduleId.ToString());
            resultList.Setting = await setting;
            return resultList;
        }

        [HttpGet]
        [Route("SearchAnyByCondition")]
        [AllowAnonymous]
        public async Task<object> SearchAnyByCondition(string searchIndex, string keyword, int pageIndex, int pageSize)
        {
            string searchType = searchIndex;

            _elasticSearchClientHelper.CreateClient<dynamic>(searchIndex);

            keyword = (keyword + string.Empty).Trim();
            keyword = string.IsNullOrEmpty(keyword) ? "*" : keyword;

            keyword = keyword.ToLower();

            if (keyword != "*" && !keyword.Contains("*"))
                keyword = "*" + keyword + "*";

            //ESSearchConditionGroup searchConditionGroup = new ESSearchConditionGroup();
            //searchConditionGroup.Conditions.Add(new ESSearchCondition
            //{
            //    QueryClause = ESQueryClause.Should,
            //    QueryType = ESQueryType.Wildcard,
            //    Fields = new List<ESSearchField>()
            //        {
            //            new ESSearchField{FieldName = "articleNameShort_lower", FieldValue = keyword},
            //            new ESSearchField{FieldName = "articleNr", FieldValue = keyword}
            //        }
            //});

            ESSearchCondition searchCondition = new ESSearchCondition()
            {
                QueryClause = ESQueryClause.Should,
                Fields = new List<ESSearchField>()
                    {
                        new ESSearchField{FieldName = "articleNameShort_lower", FieldValue = keyword, QueryType = ESQueryType.Wildcard},
                        new ESSearchField{FieldName = "articleNr", FieldValue = keyword, QueryType = ESQueryType.Wildcard}
                    }
            };

            var result = _elasticSearchClientHelper.SearchAnyByCondition<dynamic>(searchCondition, pageIndex, pageSize);

            return await Task.FromResult(result);
        }

        /// <summary>
        /// Search Detail Advance
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SearchDetailAdvance")]
        public async Task<EsSearchResult<dynamic>> SearchDetailAdvance([FromBody] ESSearchDetailAdvanceModel model)
        {
            model.Keyword = string.IsNullOrEmpty(model.Keyword) ? "*" : model.Keyword;
            if (string.IsNullOrWhiteSpace(model.SearchType))
                model.SearchType = model.SearchIndex;

            var fieldName = new List<string>();
            var fieldValue = new List<string>();

            #region SelectionProject
            if (_appSettings.IsSelectionProject)
            {
                var isActive = model.SearchIndex.ToLower().Contains("isactive");
                var isArchived = model.SearchIndex.ToLower().Contains("isarchived");
                var subStringLength = isActive ? "isactive".Length : isArchived ? "isarchived".Length : 0;
                model.SearchIndex = model.SearchIndex.Substring(0, model.SearchIndex.Length - subStringLength);
                model.SearchType = model.SearchIndex;

                if (isActive)
                {
                    fieldName.Add("isActive");
                    fieldValue.Add("1");
                }
                if (isArchived)
                {
                    fieldName.Add("isArchived");
                    fieldValue.Add("1");
                }
            }
            #endregion

            #region Prepare Index
            if (model.SearchIndex == ElasticSearchIndexName.CampaignMediaCode)
            {
                model.SearchIndex = ElasticSearchIndexName.Campaign;
                model.SearchType = ElasticSearchIndexName.CampaignMediaCode;
            }

            if (model.SearchIndex == ElasticSearchIndexName.CustomerFoot)
            {
                model.SearchIndex = ElasticSearchIndexName.Customer;
                model.SearchType = ElasticSearchIndexName.CustomerFoot;
            }
            else if (model.SearchIndex == ElasticSearchIndexName.CustomerContact)
            {
                model.SearchIndex = ElasticSearchIndexName.Customer;
                model.SearchType = ElasticSearchIndexName.CustomerContact;
            }
            else if (model.SearchIndex == ElasticSearchIndexName.CustomerFootContact)
            {
                model.SearchIndex = ElasticSearchIndexName.Customer;
                model.SearchType = ElasticSearchIndexName.CustomerFootContact;
            }
            #endregion

            _elasticSearchClientHelper.CreateClient<dynamic>(model.SearchIndex);

            ESSearchConditionRootGroups rootGroups = model.BuildSearchConditionGroups();
            var resultList = _elasticSearchClientHelper.SearchAnyByCondition<dynamic>(rootGroups, model.PageIndex, model.PageSize);

            var setting = _uniqueBusiness.GetColumnSetting(model.ModuleId.ToString());
            resultList.Setting = await setting;
            return resultList;
        }

        [HttpGet]
        [Route("GetColumnSetting")]
        public async Task<object> GetColumnSetting(int moduleId)
        {
            var setting = await _uniqueBusiness.GetColumnSetting(moduleId.ToString());
            return setting;
        }

        #region Customer Doublet

        /// <summary>
        ///  Search CustomerDoublet
        /// </summary>
        /// <param name="searchType"></param>
        /// <param name="fieldName"></param>
        /// <param name="fieldValue"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("SearchCustomerDoublet")]
        [AllowAnonymous]
        public async Task<EsSearchResult<dynamic>> SearchCustomerDoublet(List<string> fieldValue)
        {
            int pageIndex = 0;
            int pageSize = 1000;

            string searchIndex = ElasticSearchIndexName.Customer;
            string searchType = searchIndex;
            int moduleId = 2;//customer

            IList<ESSearchFieldBasic> fields = new List<ESSearchFieldBasic>();
            foreach (var value in fieldValue)
            {
                var field = new ESSearchFieldBasic
                {
                    FieldName = "personNr",
                    FieldValue = value,
                    QueryType = ESQueryType.Term
                };
                fields.Add(field);
            }

            _elasticSearchClientHelper.CreateClient<dynamic>(searchIndex, searchType);
            _elasticSearchClientHelper.EsConfigFolder = GetEsConfigFolder();
            EsSearchResult<dynamic> resultList = _elasticSearchClientHelper.SearchCustomerDoublet<dynamic>(fields, pageIndex, pageSize);

            var setting = _uniqueBusiness.GetColumnSetting("CustomerDoublet");//moduleId.ToString()
            resultList.Setting = await setting;
            return resultList;
        }
        #endregion

        #region Private
        private string RemoveFakeIndexes(string indexes)
        {
            if (string.IsNullOrEmpty(indexes)) return "";

            string[] arr = indexes.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                               .Select(n => n.Trim())
                                               .Where(n => n != string.Empty && n != "dashboard")
                                               .ToArray();
            return string.Join(",", arr);
        }
        private string GetEsConfigFolder()
        {
            return _pathProvider.MapContentRootPath(string.Format(@"ESConfigs\{0}", _appSettings.IsSelectionProject ? "Selection" : "Xena"));
        }
        #endregion
    }
}
