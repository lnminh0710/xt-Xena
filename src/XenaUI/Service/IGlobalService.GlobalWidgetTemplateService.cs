using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public partial class GlobalService : BaseUniqueServiceRequest, IGlobalService
    {
        #region Wdget Template
        public object GetAllWidgetTemplateByModuleId(Data data)
        {
            //var watch = Stopwatch.StartNew();

            bool isReturnRawData = !string.IsNullOrEmpty(data.Object);
            data.MethodName = "SpCallWidgetManaging";
            if (!isReturnRawData)
                data.Object = "SelectWidgetApp";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(data)
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            if (isReturnRawData)
            {
                var response = Service.PostSync(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None)[0];

                return response != null ? new WSDataReturn { Data = (JArray)response } : null;
            }
            else
            {
                var expectedReturn = new Dictionary<int, Type>();
                expectedReturn.Add(0, typeof(WidgetTemplateModel));

                var response = Service.PostSync(body: bodyRquest, expectedReturn: expectedReturn)[0];

                return response != null ? (IList<WidgetTemplateModel>)response : null;
            }
        }

        public async Task<object> GetWidgetTemplateDetailByRequestString(string request, int idRepWidgetType)
        {
            BodyRequest bodyRquest = JsonConvert.DeserializeObject<BodyRequest>(request);
            var expectedReturn = new Dictionary<int, Type>();
            switch (idRepWidgetType)
            {
                case (int)EIdRepWidgetType.Combination:
                case (int)EIdRepWidgetType.CombinationType2:
                case (int)EIdRepWidgetType.DataSet:
                case (int)EIdRepWidgetType.DataGrid:
                case (int)EIdRepWidgetType.TableWithFilter:
                case (int)EIdRepWidgetType.EditableTable:
                case (int)EIdRepWidgetType.EditableDataGrid:
                case (int)EIdRepWidgetType.FileExplorer:
                case (int)EIdRepWidgetType.ToolsFileTemplate:
                default:
                    var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
                    return response != null ? new WSDataReturn { Data = (JArray)response } : null;


                case (int)EIdRepWidgetType.GroupTable:
                case (int)EIdRepWidgetType.TreeCategoriesTable:
                    expectedReturn.Add(1, typeof(DynamicCollection));
                    var _response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn, mappingType: Constants.EExecuteMappingType.DynamicType4))[1];
                    return _response != null ? ((IList<DynamicCollection>)_response).FirstOrDefault() : null;
            }
        }

        public async Task<WSDataReturnValue> UpdateWidgetInfo(string request)
        {
            BodyRequest bodyRquest = JsonConvert.DeserializeObject<BodyRequest>(request);

            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSDataReturnValue));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSDataReturnValue>)response).FirstOrDefault() : null;
        }

        public async Task<WSDataReturn> LoadWidgetSetting(WidgetSettingLoadData data)
        {
            data.MethodName = "SpCallGetSettingWidget";
            data.CrudType = "Read";
            data.Object = "B00SettingsWidget";

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

        public async Task<WSReturn> CreateWidgetSetting(WidgetSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsWidget";
            data.CrudType = "Create";
            data.Object = "B00SettingsWidget";
            data.GUID = Guid.NewGuid().ToString();
            data.AppModus = "0";

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
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSReturn> DeleteWidgetSetting(WidgetSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsWidget";
            data.CrudType = "Delete";
            data.Object = "B00SettingsWidget";
            data.GUID = Guid.NewGuid().ToString();
            data.AppModus = "0";

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
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSReturn> UpdateWidgetSetting(WidgetSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsWidget";
            data.CrudType = "Update";
            data.Object = "B00SettingsWidget";
            data.GUID = Guid.NewGuid().ToString();
            data.AppModus = "0";

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
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }

        public async Task<WSDataReturn> LoadWidgetOrderBy(WidgetOrderByData data)
        {
            data.MethodName = "SpSys_SysAppTools";
            data.Object = "GetWidgetOrderBy";
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

        public async Task<WSEditReturn> SaveWidgetOrderBy(WidgetOrderByData data)
        {
            data.MethodName = "SpSys_SysAppTools";
            data.CrudType = "Update";
            data.Object = "SaveWidgetOrderBy";
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

        #endregion
    }
}

