using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System.Threading.Tasks;
using XenaUI.Constants;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using System.Dynamic;
using System.Globalization;

namespace XenaUI.Utils
{
    /// <summary>
    /// RestRequestHelper
    /// </summary>
    public class RestRequestHelper : IRestRequestHelper
    {
        private IRestClient _client;

        private IHttpContextAccessor _httpContextAccessor;
        private readonly AppSettings _appSettings;

        /// <summary>
        /// BaseServiceRequest
        /// </summary>
        public RestRequestHelper(AppSettings appSettings, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _appSettings = appSettings;
            _client = new RestClient();
        }

        public string BaseUrl
        {
            set { _client.BaseUrl = new Uri(value); }
        }

        public string ServiceName { get; set; }

        /// <summary>
        /// In milliseconds
        /// </summary>
        public int Timeout { get; set; }

        public string AuthString { get; set; }

        private RestRequest CreateRestRequest()
        {
            return new RestRequest
            {
                RequestFormat = DataFormat.Json,
                JsonSerializer = new CustomJsonSerializer()
            };
        }

        ///// <summary>
        ///// AddBody
        ///// </summary>
        ///// <param name="obj"></param>
        //public void AddBody(object obj)
        //{
        //    _request.AddBody(obj);
        //}

        ///// <summary>
        ///// AddJsonBody
        ///// </summary>
        ///// <param name="obj"></param>
        //public void AddJsonBody(object obj)
        //{
        //    _request.AddJsonBody(obj);
        //}

        /// <summary>
        /// AddParameter
        /// </summary>
        /// <param name="name"></param>
        /// <param name="value"></param>
        /// <param name="parameterType"></param>
        private void AddParameter(RestRequest request, string name, object value, ParameterType parameterType)
        {
            if (value.GetType().IsArray)
            {
                foreach (object val in (Array)value)
                {
                    request.AddParameter(name, val, parameterType);
                }
            }
            else
            {
                request.AddParameter(name, value, parameterType);
            }
        }

        ///// <summary>
        ///// AddJsonParameter
        ///// </summary>
        ///// <param name="name"></param>
        ///// <param name="value"></param>
        ///// <param name="parameterType"></param>
        ///// <param name="isIgnoreNullValue"></param>
        //public void AddJsonParameter(string name, object value, ParameterType parameterType = ParameterType.QueryString, bool isIgnoreNullValue = false)
        //{
        //    string jsonString;
        //    if (isIgnoreNullValue)
        //    {
        //        jsonString = JsonConvert.SerializeObject(value,
        //            new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
        //    }
        //    else
        //    {
        //        jsonString = JsonConvert.SerializeObject(value);
        //    }
        //    _request.AddParameter(name, jsonString, parameterType);
        //}

        /// <summary>
        /// Execute
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="method"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public async Task<Dictionary<int, object>> Execute(string resource,
            Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType,
            Method method, Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            var result = ExecuteSync(resource, expectedReturn, mappingType, method, parameter: parameter, body: body, version: version);
            return await Task.FromResult(result);
        }

        #region Mapping Type

        /// <summary>
        /// Make mapping for return json from service before send to client
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="expectedReturn"></param>
        /// <param name="mappingType"></param>
        /// <param name="retObject"></param>
        private void MakeMapping(string jsonData, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Dictionary<int, object> retObject)
        {
            jsonData = jsonData.Replace(":{},", @":null,")
                               .Replace(": {},", @":null,")
                               .Replace(": {}", @":null,")
                               .Replace(":{}", @":null,");

            if (mappingType == EExecuteMappingType.OriginalString)
            {
                retObject.Add(0, jsonData);
                return;
            }

            JArray jsonArray = JArray.Parse(jsonData);
            if (jsonArray.Count <= 0)
            {
                retObject.Add(0, null);
                return;
            }

            switch (mappingType)
            {
                case EExecuteMappingType.None:
                case EExecuteMappingType.OnlyReplaceAllEmtyObjectJson:
                    retObject.Add(0, jsonArray);
                    break;

                case EExecuteMappingType.CreatePerson:
                    if (jsonArray.Count > 0 && Common.IsValidJson(jsonArray.Last.ToString()))
                    {
                        var js = jsonArray.Last.ToString();
                        retObject.Add(0, JsonConvert.DeserializeObject(js, typeof(IList<>).MakeGenericType(expectedReturn.First().Value)));
                    }
                    break;
                case EExecuteMappingType.Normal:
                    foreach (var item in expectedReturn)
                    {
                        var listTypeNormal = typeof(IList<>).MakeGenericType(item.Value);
                        if (jsonArray.Count > item.Key && Common.IsValidJson(jsonArray[item.Key].ToString()))
                        {
                            var js = jsonArray[item.Key].ToString();
                            retObject.Add(item.Key, JsonConvert.DeserializeObject(js, listTypeNormal));
                        }
                    }
                    break;

                case EExecuteMappingType.ComboBox:
                    retObject.Add(0, JsonConvert.DeserializeObject(MapCombobox2(jsonArray)));
                    break;

                case EExecuteMappingType.Country:
                case EExecuteMappingType.Country2:
                    retObject.Add(0, JsonConvert.DeserializeObject(MapCountry(jsonArray, mappingType)));
                    break;

                case EExecuteMappingType.TabSummary:
                    var listTypePair = typeof(IList<>).MakeGenericType(expectedReturn[0]);
                    retObject.Add(0, JsonConvert.DeserializeObject(MapTabSummary(jsonArray), listTypePair));
                    break;

                case EExecuteMappingType.Dynamic:
                    MapDynamicType1(jsonArray, expectedReturn, mappingType, retObject);
                    break;
                case EExecuteMappingType.DynamicType2:
                    MapDynamicType2(jsonArray, expectedReturn, mappingType, retObject);
                    break;
                case EExecuteMappingType.DynamicType3:
                    MapDynamicType3(jsonArray, expectedReturn, mappingType, retObject);
                    break;
                case EExecuteMappingType.DynamicType4:
                case EExecuteMappingType.DynamicCoulumnsType:
                    MapDynamicType4(jsonArray, expectedReturn, mappingType, retObject);
                    break;
            }
        }

        /// <summary>
        /// map for combobox type
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <returns></returns>
        private string MapCombobox(JArray jsonArray)
        {
            string strJsonResult = string.Empty;
            // loops through item in jsonArray and names for it
            for (int i = 0; i < jsonArray.Count; i++)
            {
                string dataType = string.Empty;
                string strJsonCollection = string.Empty;
                // loop through item in jsonArray and restructure
                foreach (var item in ((JArray)jsonArray[i]))
                {
                    string strJsonItem = string.Empty;
                    // loop through property of item and restructure/rename
                    foreach (JProperty prop in ((JObject)item).Properties())
                    {
                        string propValue = prop.Value + string.Empty;
                        // do nothing for 'DataType' property 
                        if (prop.Name == "DataType")
                        {
                            if (string.IsNullOrEmpty(dataType))
                            {
                                dataType = propValue.Replace("{", string.Empty).Replace("}", string.Empty);
                                dataType = char.ToLower(dataType[0]) + dataType.Substring(1);
                            }
                            continue;
                        }

                        // combine property name and value into json string
                        strJsonItem += string.Format(@"""{0}"":""{1}""",
                                    char.ToLower(prop.Name[0]) + prop.Name.Substring(1),
                                    propValue.Replace("{", string.Empty).Replace("}", string.Empty));

                        // append "," if this is not the last property
                        if (prop != ((JObject)item).Properties().Last())
                            strJsonItem += ",";
                    }
                    strJsonItem = string.Format(@"{{{0}}}", strJsonItem);
                    // append to json collection
                    strJsonCollection += strJsonItem;
                    // append "," if this is not the last item
                    if (((JArray)jsonArray[i]).Last != item)
                        strJsonCollection += ",";
                }

                // append to json result string
                strJsonResult += string.Format(@"""{0}"":[{1}]", dataType, strJsonCollection);
                if (i < jsonArray.Count - 1)
                    strJsonResult += ",";
            }
            strJsonResult = string.Format(@"{{{0}}}", strJsonResult);
            strJsonResult = strJsonResult.Replace(@"\n", @"\\n")
                                         .Replace(@"\s", @"\\s")
                                         .Replace(@"\t", @"\\t")
                                         .Replace(@"\r", @"\\r");
            return strJsonResult;
        }

        private string MapCombobox2(JArray jsonArray)
        {
            #region Convert all values to string
            for (int i = 0; i < jsonArray.Count; i++)
            {
                foreach (var item in ((JArray)jsonArray[i]))
                {
                    foreach (JProperty prop in ((JObject)item).Properties())
                    {
                        if (prop.Name == "DataType") continue;

                        prop.Value = prop.Value + string.Empty;

                    }//for JProperty
                }//for JArray Child
            }//for JArray Parent
            #endregion

            List<List<ExpandoObject>> listDynamic = new List<List<ExpandoObject>>();

            for (int i = 0; i < jsonArray.Count; i++)
            {
                List<ExpandoObject> data = ((JArray)jsonArray[i]).ToObject<List<ExpandoObject>>();
                listDynamic.Add(data);
            }

            var resultDictionary = new Dictionary<string, object>();
            foreach (List<ExpandoObject> items in listDynamic)
            {
                var firstItem = items.GroupBy(x => ((dynamic)x).DataType).FirstOrDefault();
                if (firstItem != null && firstItem.Key != null)
                    resultDictionary.Add(firstItem.Key.ToString(), items);
            }

            var jsonResult = JsonConvert.SerializeObject(resultDictionary,
                new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Formatting = Formatting.None
                });

            return jsonResult;
        }

        /// <summary>
        /// map for Country type
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="mappingType"></param>
        /// <returns></returns>
        private string MapCountry(JArray jsonArray, EExecuteMappingType mappingType)
        {
            string strJsonCollection = string.Empty;
            var array = mappingType == EExecuteMappingType.Country ? jsonArray[1] : jsonArray[0];
            foreach (var item in ((JArray)array))
            {
                JProperty propText = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "CountryLanguage");
                string text = propText != null ?
                                    propText.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    string.Empty;
                if (text.Contains(@"'"))
                    text = text.Replace(@"'", @"\'");

                JProperty propIsMain = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IsMain");
                string isMain = propIsMain != null ?
                                    propIsMain.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    "false";

                JProperty propId = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IdCountrylanguage");
                string id = propId != null ?
                                    propId.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    string.Empty;

                JProperty propIsoCode = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IsoCode");
                string isoCode = propIsoCode != null ?
                                    propIsoCode.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    string.Empty;

                JProperty propIsActive = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IsActive");
                string isActive = propIsActive != null ?
                                    propIsActive.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    "false";

                JProperty propIdSalesCampaignWizardItems = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IdSalesCampaignWizardItems");
                string idSalesCampaignWizardItems = propIdSalesCampaignWizardItems != null ?
                                    propIdSalesCampaignWizardItems.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                    string.Empty;



                string jsonRewrappedItem;
                if (mappingType == EExecuteMappingType.Country2)
                {
                    JProperty propIdBusinessCostsItems = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IdBusinessCostsItems");
                    string idBusinessCostsItems = propIdBusinessCostsItems != null ?
                                        propIdBusinessCostsItems.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                        string.Empty;

                    JProperty propIdBusinessCostsItemsCountries = ((JObject)item).Properties().FirstOrDefault(c => c.Name == "IdBusinessCostsItemsCountries");
                    string idBusinessCostsItemsCountries = propIdBusinessCostsItemsCountries != null ?
                                        propIdBusinessCostsItemsCountries.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                        string.Empty;
                    jsonRewrappedItem = string.Format(@"{{'{0}':'{1}','{2}':'{3}','{4}':'{5}','{6}':'{7}','{8}':'{9}','{10}':'{11}','{12}':'{13}','{14}':'{15}'}}",
                                                       ConstNameSpace.TextValue, text, //0,1
                                                       ConstNameSpace.IdValue, id, //2,3
                                                       ConstNameSpace.IsMain, isMain,//4,5
                                                       ConstNameSpace.IsoCode, isoCode,//6,7
                                                       ConstNameSpace.IsActive, isActive,//8,9
                                                       ConstNameSpace.IdSalesCampaignWizardItems, idSalesCampaignWizardItems,//10,11
                                                       ConstNameSpace.IdBusinessCostsItems, idBusinessCostsItems,//12,13
                                                       ConstNameSpace.IdBusinessCostsItemsCountries, idBusinessCostsItemsCountries//14,15
                                                   );
                }
                else
                    jsonRewrappedItem = string.Format(@"{{'{0}':'{1}','{2}':'{3}','{4}':'{5}','{6}':'{7}','{8}':'{9}','{10}':'{11}'}}",
                                                           ConstNameSpace.TextValue, text, //0,1
                                                           ConstNameSpace.IdValue, id, //2,3
                                                           ConstNameSpace.IsMain, isMain,//4,5
                                                           ConstNameSpace.IsoCode, isoCode,//6,7
                                                           ConstNameSpace.IsActive, isActive,//8,9
                                                           ConstNameSpace.IdSalesCampaignWizardItems, idSalesCampaignWizardItems//10,11
                                                       );
                if (item != ((JArray)array).Last)
                    jsonRewrappedItem += ",";

                strJsonCollection += jsonRewrappedItem;
            }
            strJsonCollection = string.Format(@"{{""{0}"":[{1}]}}", "countryCode", strJsonCollection);
            return strJsonCollection;
        }

        /// <summary>
        /// map for Tab Summary type
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <returns></returns>
        private string MapTabSummary(JArray jsonArray)
        {
            string jsonResult = string.Empty;
            for (int i = 0; i + 1 < jsonArray.Count; i += 2)
            {
                jsonResult += string.Format(@"{{""{0}"":{1},""{2}"":{3}}},",
                                    ConstNameSpace.TabSummaryInfor, jsonArray[i].First.ToString(), //0,1
                                    ConstNameSpace.TabSummaryData, jsonArray[i + 1].ToString()); //2, 3
            }
            jsonResult = jsonResult.Remove(jsonResult.Length - 1, 1);
            jsonResult = string.Format(@"[{0}]", jsonResult);
            //jsonResult = jsonResult.Replace(":{},", @":"""",")
            //                       .Replace(": {},", @": """",")
            //                       .Replace(": {}", @": """"")
            //                       .Replace(":{}", @":""""");
            return jsonResult;
        }

        /// <summary>
        /// map for Dynamic type 1
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="expectedReturn"></param>
        /// <param name="mappingType"></param>
        /// <param name="retObject"></param>
        private void MapDynamicType1(JArray jsonArray, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Dictionary<int, object> retObject)
        {
            foreach (var item in expectedReturn)
            {
                try
                {
                    if (jsonArray.Count - 1 < item.Key)
                    {
                        retObject.Add(item.Key, null);
                        continue;
                    }

                    string[] colProperties = ((JProperty)jsonArray.First.First.First).Value.ToString()
                                            .Replace("{", string.Empty).Replace("}", string.Empty)
                                            .Split(new string[] { "," }, StringSplitOptions.None);

                    string jsonRewrappedResult = RestructureJsonStringWithDynamicCase(jsonArray, item.Key, colProperties, mappingType);
                    var listType = typeof(List<>).MakeGenericType(new[] { item.Value });
                    if (!string.IsNullOrEmpty(jsonRewrappedResult))
                    {
                        retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonRewrappedResult, listType));
                    }
                    else
                    {
                        if (jsonArray.Count > item.Key && Common.IsValidJson(jsonArray[item.Key].ToString()))
                        {
                            //retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString().Replace(":{},", @":"""",").Replace(": {},", @": """",").Replace(": {}", @": """"").Replace(":{}", @":"""""), listType));
                            retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString(), listType));
                        }
                    }
                }
                catch { }
            }//for
        }

        /// <summary>
        /// map for Dynamic type 2
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="expectedReturn"></param>
        /// <param name="mappingType"></param>
        /// <param name="retObject"></param>
        private void MapDynamicType2(JArray jsonArray, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Dictionary<int, object> retObject)
        {
            foreach (var item in expectedReturn)
            {
                if (jsonArray.Count - 1 < item.Key)
                {
                    retObject.Add(item.Key, null);
                    continue;
                }

                List<string> colProperties = new List<string>();
                for (int i = 0; i < jsonArray[1].Count(); i++)
                {
                    colProperties.Add(((JProperty)((jsonArray[1])[i].First)).Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty));
                }
                string jsonRewrappedResult = RestructureJsonStringWithDynamicCase(jsonArray, item.Key, colProperties.ToArray(), mappingType);
                var listType = typeof(List<>).MakeGenericType(new[] { item.Value });
                if (!string.IsNullOrEmpty(jsonRewrappedResult))
                {
                    retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonRewrappedResult, listType));
                }
                else
                {
                    if (jsonArray.Count > item.Key && Common.IsValidJson(jsonArray[item.Key].ToString()))
                    {
                        //retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString().Replace(":{},", @":"""",").Replace(": {},", @": """",").Replace(": {}", @": """"").Replace(":{}", @":"""""), listType));
                        retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString(), listType));
                    }
                }
            }
        }

        /// <summary>
        /// map for Dynamic type 3
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="expectedReturn"></param>
        /// <param name="mappingType"></param>
        /// <param name="retObject"></param>
        private void MapDynamicType3(JArray jsonArray, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Dictionary<int, object> retObject)
        {
            foreach (var item in expectedReturn)
            {
                if (jsonArray.Count - 1 < item.Key)
                {
                    retObject.Add(item.Key, null);
                    continue;
                }
                string jsonRewrappedResult = string.Empty;
                int index = 0;
                int totalRows = jsonArray[item.Key].Count();
                foreach (var jsonObject in jsonArray[item.Key])
                {
                    JProperty propColName = ((JObject)jsonObject).Properties()
                                                                 .FirstOrDefault(c => c.Name == "ColumnName");
                    string colName = propColName != null ?
                                        propColName.Value.ToString()
                                                         .Replace("{", string.Empty)
                                                         .Replace("}", string.Empty) :
                                        string.Empty;

                    JProperty propValue = ((JObject)jsonObject).Properties()
                                                               .FirstOrDefault(c => c.Name == "Value");
                    string value = propValue != null ?
                                        propValue.Value.ToString()
                                                       .Replace("{", string.Empty)
                                                       .Replace("}", string.Empty)
                                                       .Replace(@"\", @"\\")//2018-11-14: Hoa.Nguyen: fix temporarily
                    : string.Empty;
                    if (value.Contains(@"'"))
                        value = value.Replace(@"'", @"\'");

                    JProperty propOriginalColumnName = ((JObject)jsonObject).Properties().FirstOrDefault(c => c.Name == "OriginalColumnName");
                    string original = propOriginalColumnName != null ?
                                        propOriginalColumnName.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty) :
                                        string.Empty;

                    JProperty propSetting = ((JObject)jsonObject).Properties().FirstOrDefault(c => c.Name == "Setting");
                    string setting = propSetting != null ?
                                        propSetting.Value.ToString() :
                                        string.Empty;
                    // just get the text after "_"
                    if (!string.IsNullOrEmpty(original) && original.Contains("_"))
                    {
                        original = original.Split(new string[] { "_" }, StringSplitOptions.None).Last();
                    }

                    var key = !string.IsNullOrEmpty(original) ? char.ToLower(original[0]) + original.Substring(1) : original;
                    string jsonRewrappedItem = string.Format(@"'{0}':{{'{1}':'{2}','{3}':'{4}','{5}':'{6}','{7}':'{8}'}}",
                                                key, //0
                                                ConstNameSpace.ModelPropertyDisplayValue, colName, //1,2
                                                ConstNameSpace.ModelPropertyValue, value, //3,4
                                                ConstNameSpace.ModelPropertyOriginalColumnName, original, //5, 6
                                                ConstNameSpace.ModelPropertySetting, setting //7, 8
                                                );

                    if (index < totalRows - 1)
                        jsonRewrappedItem += ",";
                    // append to json result
                    jsonRewrappedResult += jsonRewrappedItem;
                    index++;
                }

                jsonRewrappedResult = "[{" + jsonRewrappedResult + "}]";
                jsonRewrappedResult = jsonRewrappedResult.Replace(@";\n", @";\\n");
                jsonRewrappedResult = jsonRewrappedResult.Replace(@";\s", @";\\s");
                jsonRewrappedResult = jsonRewrappedResult.Replace(@";\t", @";\\t");
                jsonRewrappedResult = jsonRewrappedResult.Replace(@";\r", @";\\r");

                var listType = typeof(List<>).MakeGenericType(new[] { item.Value });
                if (!string.IsNullOrEmpty(jsonRewrappedResult) && Common.IsValidJson(jsonRewrappedResult))
                {
                    retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonRewrappedResult, listType));
                }
                else
                {
                    if (jsonArray.Count > item.Key && Common.IsValidJson(jsonArray[item.Key].ToString()))
                    {
                        retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString().Replace(":{},", @":'',").Replace(": {},", @": '',").Replace(": {}", @": ''").Replace(":{}", @":''"), listType));
                    }
                }
            }
        }

        /// <summary>
        /// map for Dynamic type 4
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="expectedReturn"></param>
        /// <param name="mappingType"></param>
        /// <param name="retObject"></param>
        private void MapDynamicType4(JArray jsonArray, Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType, Dictionary<int, object> retObject)
        {
            foreach (var item in expectedReturn)
            {
                if (jsonArray.Count - 1 < item.Key)
                {
                    retObject.Add(item.Key, null);
                    continue;
                }
                // get json Setting object
                var jsonSetting = JArray.Parse(((JProperty)jsonArray.First.First.First).Value.ToString());

                // get widgetTitle string
                string widgetTitle = ((JProperty)((JObject)jsonSetting.First).First).Value.ToString();
                // get json Setting list
                var jsonSettingsList = ((JProperty)jsonSetting.Last().First).Value;
                List<string> colProperties = new List<string>();
                string resultSettings = string.Empty;
                // build json string of settings
                foreach (var set in jsonSettingsList)
                {
                    var jsonObjectSetting = ((JObject)set);
                    // properties
                    string columnName = jsonObjectSetting.Property(ConstNameSpace.ColumnName).Value.ToString();
                    string dataType = jsonObjectSetting.Property(ConstNameSpace.DataType).Value.ToString();
                    string dataLength = jsonObjectSetting.Property(ConstNameSpace.DataLength).Value.ToString();
                    string setting = jsonObjectSetting.Property(ConstNameSpace.Setting).Value.ToString();
                    string originalColumnName = jsonObjectSetting.Property(ConstNameSpace.OriginalColumnName).Value.ToString();
                    colProperties.Add(columnName);
                    // build string
                    string strSettingitem = string.Format(@"'{0}':'{1}','{2}':'{3}','{4}':'{5}','{6}':{7}",
                        ConstNameSpace.DataType, dataType, //0,1
                        ConstNameSpace.DataLength, dataLength,//2,3
                        ConstNameSpace.OriginalColumnName, originalColumnName,//4,5
                        ConstNameSpace.Setting, setting);//6,7
                    strSettingitem = string.Format(@"'{0}':{{{1}}},", char.ToLower(columnName[0]) + columnName.Substring(1), strSettingitem);
                    resultSettings += strSettingitem;
                }
                // remove "," at the end
                resultSettings = resultSettings.Remove(resultSettings.Length - 1, 1);
                resultSettings = string.Format("{{{0}}}", resultSettings);

                // build json of data
                string jsonRewrappedResult = RestructureJsonStringWithDynamicCase(jsonArray, item.Key, colProperties.ToArray(), mappingType);
                var listType = typeof(List<>).MakeGenericType(new[] { item.Value });
                if (!string.IsNullOrEmpty(jsonRewrappedResult) || !string.IsNullOrEmpty(resultSettings))
                {
                    string jsResult = string.Format(@"'{0}':'{1}','{2}':{3},'{4}':{5}",
                        ConstNameSpace.WidgetTitle, widgetTitle,
                        ConstNameSpace.CollectionData, string.IsNullOrEmpty(jsonRewrappedResult) ? "[]" : jsonRewrappedResult,
                        ConstNameSpace.ColumnSettings, string.IsNullOrEmpty(resultSettings) ? "{}" : resultSettings);
                    jsResult = "[{" + jsResult + "}]";
                    retObject.Add(item.Key, JsonConvert.DeserializeObject(jsResult, listType));
                }
                else
                {
                    if (jsonArray.Count > item.Key && Common.IsValidJson(jsonArray[item.Key].ToString()))
                    {
                        retObject.Add(item.Key, JsonConvert.DeserializeObject(jsonArray[item.Key].ToString().Replace(":{},", @":'',").Replace(": {},", @": '',").Replace(": {}", @": ''").Replace(":{}", @":''"), listType));
                    }
                }
            }
        }

        /// <summary>
        /// RestructureJsonStringWithDynamicCase
        /// </summary>
        /// <param name="jsonArray"></param>
        /// <param name="itemKey"></param>
        /// <param name="colProperties"></param>
        /// <param name="mappingType"></param>
        /// <returns></returns>
        private string RestructureJsonStringWithDynamicCase(JArray jsonArray, int itemKey, string[] colProperties, EExecuteMappingType mappingType)
        {
            bool isCanMapDynamic = false;
            string jsonRewrappedResult = string.Empty;

            foreach (var jsonObject in jsonArray[itemKey])
            {
                isCanMapDynamic = true;
                try
                {
                    if (((JObject)jsonObject).Properties().Count() < colProperties.Count())
                    {
                        isCanMapDynamic = false;
                        break;
                    }
                    // loop throught the ColumnName array to set value to property of instance object
                    string jsonRewrappedItem = string.Empty;
                    //colProperties = colProperties.OrderBy(c => c).ToArray();
                    for (int index = 0; index < colProperties.Length; index++)
                    {
                        try
                        {
                            JProperty jsonProperty = ((JObject)jsonObject).Properties().ElementAt(index);
                            switch (mappingType)
                            {
                                case EExecuteMappingType.Dynamic:
                                default:
                                    string _value = jsonProperty.Value.ToString()
                                                                      .Replace("{", string.Empty)
                                                                      .Replace("}", string.Empty)
                                                                      .Replace(@"\", @"\\");//2018-11-14: Hoa.Nguyen: fix temporarily 
                                    if (_value.Contains(@"'"))
                                        _value = _value.Replace(@"'", @"\'");
                                    if (mappingType == EExecuteMappingType.DynamicCoulumnsType &&
                                        jsonProperty.Name.Trim().Equals(ConstNameSpace.DynamicColumn))
                                    {
                                        _value = WebUtility.UrlEncode(jsonProperty.Value.ToString());
                                    }

                                    if (jsonProperty.Value.Type == JTokenType.Date)
                                    {
                                        _value = jsonProperty.Value.Value<DateTime>().ToString("u");
                                    }

                                    jsonRewrappedItem += string.Format(@"'{0}':['{1}':'{2}','{3}':'{4}','{5}':'{6}']",
                                    char.ToLower(colProperties[index][0]) + colProperties[index].Substring(1), //0
                                    ConstNameSpace.ModelPropertyDisplayValue, jsonProperty.Name, //1,2
                                    ConstNameSpace.ModelPropertyValue, _value, //3,4
                                    ConstNameSpace.ModelPropertyOriginalColumnName,//5
                                    colProperties[index]); //6
                                    break;
                                case EExecuteMappingType.DynamicType2:
                                    jsonRewrappedItem += string.Format(@"'{0}':['{1}':'{2}','{3}':'{4}','{5}':'{6}']",
                                    jsonProperty.Name, //0
                                    ConstNameSpace.ModelPropertyDisplayValue, colProperties[index], //1,2
                                    ConstNameSpace.ModelPropertyValue, jsonProperty.Value.ToString().Replace("{", string.Empty).Replace("}", string.Empty), //3,4
                                    ConstNameSpace.ModelPropertyOriginalColumnName,//5
                                    jsonProperty.Name); //6
                                    break;
                            }

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
                    isCanMapDynamic = false;
                    break;
                }
            }
            if (isCanMapDynamic)
            {
                jsonRewrappedResult = jsonRewrappedResult.Remove(jsonRewrappedResult.Length - 1, 1);
                jsonRewrappedResult = string.Format(@"[{0}]", jsonRewrappedResult);
                jsonRewrappedResult = jsonRewrappedResult.Replace(":{},", @":'',").Replace(": {},", @": '',").Replace(": {}", @": ''").Replace(":{}", @":''");
                return jsonRewrappedResult;
            }
            else
                return string.Empty;
        }

        #endregion

        /// <summary>
        /// Get
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public Task<Dictionary<int, object>> Get(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return Execute(resource, expectedReturn, method: Method.GET, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }

        /// <summary>
        /// Post
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public Task<Dictionary<int, object>> Post(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return Execute(resource, expectedReturn, method: Method.POST, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }

        /// <summary>
        /// Put
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public Task<Dictionary<int, object>> Put(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return Execute(resource, expectedReturn, method: Method.PUT, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }

        /// <summary>
        /// Delete
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public Task<Dictionary<int, object>> Delete(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return Execute(resource, expectedReturn, method: Method.DELETE, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }

        /// <summary>
        /// Patch
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="resource"></param>
        /// <param name="parameter"></param>
        /// <param name="body"></param>
        /// <param name="version"></param>
        /// <returns></returns>
        public Task<Dictionary<int, object>> Patch(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return Execute(resource, expectedReturn, method: Method.PATCH, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }

        #region Sync
        public Dictionary<int, object> ExecuteSync(string resource,
            Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType,
            Method method, Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            #region Enable Time TraceLog
            // start log time for Unique Service
            Stopwatch watchLogTimeUniqueService = null;
            Stopwatch watchMakeMapping = null;
            Stopwatch watchJsonConvert = null;
            DateTime now = DateTime.Now;
            if (_appSettings.EnableTimeTraceLog)
            {
                watchLogTimeUniqueService = Stopwatch.StartNew();
                watchMakeMapping = new Stopwatch();
                watchJsonConvert = new Stopwatch();

                var context = _httpContextAccessor.HttpContext;
                context.Response.OnStarting(state =>
                {
                    var httpContext = (HttpContext)state;
                    if (string.IsNullOrEmpty(httpContext.Response.Headers[Constants.ConstAuth.LogTimeUniqueService]))
                    {
                        string log = string.Format("start: {0} - end: {1} - total: {2}ms ~ {3}s.",
                            now.Subtract(watchLogTimeUniqueService.Elapsed).ToString("hh:mm:ss:fff"),
                            now.ToString("HH:mm:ss:fff"),
                            watchLogTimeUniqueService.ElapsedMilliseconds, watchLogTimeUniqueService.Elapsed.TotalSeconds);
                        httpContext.Response.Headers.Add(Constants.ConstAuth.LogTimeUniqueService, new[] { log });
                    }
                    if (string.IsNullOrEmpty(httpContext.Response.Headers[Constants.ConstAuth.LogTimeXenaMapping]))
                    {
                        string log = string.Format("*JsonConvert: {0}ms ~ {1}s *MakeMapping: {2}ms ~ {3}s",
                            watchJsonConvert.ElapsedMilliseconds, watchJsonConvert.Elapsed.TotalSeconds,
                            watchMakeMapping.ElapsedMilliseconds, watchMakeMapping.Elapsed.TotalSeconds);
                        httpContext.Response.Headers.Add(Constants.ConstAuth.LogTimeXenaMapping, new[] { log });
                    }
                    return Task.FromResult(0);
                }, context);
            }
            #endregion

            var request = CreateRestRequest();
            if (!string.IsNullOrWhiteSpace(version) ||
                !string.IsNullOrWhiteSpace(ServiceName) ||
                !string.IsNullOrWhiteSpace(resource))
            {
                string res = string.Format(CultureInfo.CurrentCulture, "{0}/{1}/{2}", version, ServiceName, resource);
                char last = res[res.Length - 1];
                if (last == '/')
                {
                    res = res.Remove(res.Length - 1);
                }
                request.Resource = res;
            }
            request.Method = method;
            
            Dictionary<int, object> retObject = new Dictionary<int, object>();

            if (body != null)
                request.AddBody(body);

            #region Parameter
            if (parameter != null)
            {
                var paramKeys = parameter.Keys.ToArray();
                var paramVals = parameter.Values.ToArray();
                if (paramKeys.Length == paramVals.Length)
                {
                    for (var i = 0; i < paramKeys.Length; i++)
                    {
                        AddParameter(request, paramKeys[i], paramVals[i], ParameterType.QueryString);
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(AuthString))
            {
                AddParameter(request, "Authorization", AuthString, ParameterType.HttpHeader);
            }
            #endregion

            if (Timeout > 0)
            {
                //var timeout = 60 * 60 * 1000;//In milliseconds
                request.Timeout = Timeout;
                request.ReadWriteTimeout = Timeout;

                _client.Timeout = Timeout;
                _client.ReadWriteTimeout = Timeout;
            }

            TaskCompletionSource<IRestResponse> taskCompletion = new TaskCompletionSource<IRestResponse>();
            RestRequestAsyncHandle handle = _client.ExecuteAsync(request, res => taskCompletion.SetResult(res));
            if (Timeout > 0)
            {
                handle.WebRequest.Timeout = Timeout;
                handle.WebRequest.ReadWriteTimeout = Timeout;
            }
            RestResponse response = (RestResponse)taskCompletion.Task.Result;

            // stop log time for Unique Service
            if (_appSettings.EnableTimeTraceLog)
            {
                watchLogTimeUniqueService.Stop();
            }

            if (response.StatusCode == HttpStatusCode.OK
            || response.StatusCode == HttpStatusCode.NonAuthoritativeInformation
            || response.StatusCode == HttpStatusCode.NoContent
            || response.StatusCode == HttpStatusCode.ResetContent
            || response.StatusCode == HttpStatusCode.PartialContent
            || response.StatusCode == HttpStatusCode.Created)
            {
                try
                {
                    if (_appSettings.EnableTimeTraceLog)
                        watchJsonConvert.Start();

                    ResultResponse resultResponse = JsonConvert.DeserializeObject<ResultResponse>(response.Content);

                    if (_appSettings.EnableTimeTraceLog)
                        watchJsonConvert.Stop();

                    if (resultResponse != null && resultResponse.Data != null)
                    {
                        if (_appSettings.EnableTimeTraceLog)
                            watchMakeMapping.Start();

                        // mapping json array from service with expected object
                        MakeMapping(resultResponse.Data, expectedReturn, mappingType, retObject);

                        if (_appSettings.EnableTimeTraceLog)
                            watchMakeMapping.Stop();

                        return retObject;
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            else
            {
                var exception = new Exception(response.ErrorMessage ?? "Exception from Unique Service API. "
                                + "Content: " + (response.Content ?? " NULL") + ". ErrorExc:" + (response.ErrorException != null ? response.ErrorException.Message : "NULL"));
                //exception.Data["StatusCode"] = response.StatusCode;
                exception.Data["Content"] = response.Content;
                throw exception;
            }

            return retObject;
        }
        public Dictionary<int, object> GetSync(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return ExecuteSync(resource, expectedReturn, method: Method.GET, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }
        public Dictionary<int, object> PostSync(Dictionary<int, Type> expectedReturn, EExecuteMappingType mappingType = EExecuteMappingType.Normal, string resource = "", Dictionary<string, object> parameter = null, object body = null, string version = "")
        {
            return ExecuteSync(resource, expectedReturn, method: Method.POST, mappingType: mappingType, parameter: parameter, body: body, version: version);
        }
        #endregion
    }
}
