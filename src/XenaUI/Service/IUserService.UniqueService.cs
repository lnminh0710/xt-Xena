using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using XenaUI.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;

namespace XenaUI.Service
{
    /// <summary>
    /// UniqueService
    /// </summary>
    public class UserService : BaseUniqueServiceRequest, IUserService
    {
        public UserService(IOptions<AppSettings> appSettings, IHttpContextAccessor httpContextAccessor, IAppServerSetting appServerSetting)
            : base(appSettings, httpContextAccessor, appServerSetting) { }

        public Task<object> GetUserById(UserProfileGetData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpAppWg001UserProfile", "GetUserById");
        }

        public Task<object> ListUserRoleByUserId(UserProfileGetData data)
        {
            // TODO: will replace to right name
            return GetDataWithMapTypeIsNone(data, "SpCallUserRole", "LoginRolebyUser");
        }

        public Task<object> GetAllUserRole(UserProfileGetData data)
        {
            return GetDataWithMapTypeIsNone(data, "SpCallUserRole", "UserRoleList");
        }

        public Task<object> ListUserRoleInclueUserId(UserProfileGetData data)
        {
            // TODO: will replace to right name
            return GetDataWithMapTypeIsNone(data, "Test", "Test");
        }

        public Task<object> CheckExistUserByField(UserProfileData data)
        {
            // TODO: will replace to right name
            return GetDataWithMapTypeIsNone(data, "SpAppWg001UserProfile", "GetUserById");
        }

        public Task<WSEditReturn> SaveUserProfile(UserProfileData data)
        {
            // TODO: will replace to right name
            return SaveData(data, "SpCallUserProfile", "UserProfile");
        }

        public Task<WSEditReturn> SaveRoleForUser(UserProfileGetData data)
        {
            return SaveData(data, "SpCallUserRole", "LoginRolebyUser");
        }

        public Task<WSEditReturn> AssignRoleToMultipleUser(UserRolesUpdateData data)
        {
            return SaveData(data, "SpCallUserRole", "AssignUsersRoles");
        }

        public Task<object> GetWorkspaceTemplate(UserModuleWorkspaceGet data)
        {
            return GetDataWithMapTypeIsNone(data, "SpGetWorkspaceTemplate", "GetWorkspaceTemplate");
        }

        public Task<object> GetWorkspaceTemplateSharing(UserModuleWorkspaceGetSharing data)
        {
            return GetDataWithMapTypeIsNone(data, "SpGetWorkspaceTemplate", "GetWorkspaceTemplateSharing");
        }

        public Task<WSEditReturn> ApplyWorkspaceTemplate(UserModuleWorkspaceApplyData data)
        {
            return SaveData(data, "SpCallWorkspaceTemplate", "Apply");
        }

        public Task<WSEditReturn> ApplyWorkspaceTemplateAll(UserModuleWorkspaceApplyData data)
        {
            return SaveData(data, "SpCallWorkspaceTemplateAll ", "Apply");
        }

        public async Task<WSEditReturn> SaveWorkspaceTemplate(UserModuleWorkspaceSaveData data)
        {
            data.MethodName = "SpCallWorkspaceTemplate";

            if (data.IdWorkspaceTemplate == null)
            {
                data.Object = "New";
            }
            else
            {
                data.Object = "Override";
            }

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

        public async Task<WSEditReturn> SaveWorkspaceTemplateAll(UserModuleWorkspaceSaveData data)
        {
            data.MethodName = "SpCallWorkspaceTemplateAll";

            if (data.IdWorkspaceTemplate == null)
            {
                data.Object = "New";
            }
            else
            {
                data.Object = "Override";
            }

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

        public async Task<WSEditReturn> DeleteWorkspaceTemplate(UserModuleWorkspaceDeleteData data)
        {
            data.MethodName = "SpCallWorkspaceTemplate";
            data.Object = "Delete";
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

        public async Task<object> SaveUserWidgetLayout(UserWidgetLayoutUpdateData data)
        {
            data.MethodName = "SpCallUserWidgetLayout";
            data.GUID = Guid.NewGuid().ToString();
            data.CrudType = "UPDATE";

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

        /// <summary>
        /// GetUserFunctionList
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<object> GetUserFunctionList(UserFunctionListGetData data)
        {
            data.MethodName = "SpAppWg002UserRoleDetail";
            data.Object = "GetUserRole";

            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService",
                Data = JsonConvert.SerializeObject(
                            data,
                            Newtonsoft.Json.Formatting.None,
                            new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore })
            };
            BodyRequest bodyRquest = new BodyRequest { Request = uniq };
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            if (response != null)
            {
                var jarray = (JArray)response;
                if (jarray.Count > 1)
                {
                    Dictionary<string, Dictionary<string, bool>> result = new Dictionary<string, Dictionary<string, bool>>();
                    jarray = (JArray)jarray[1];
                    foreach (JToken jToken in jarray)
                    {
                        string key = "";
                        Dictionary<string, bool> model = new Dictionary<string, bool>();
                        foreach (JProperty prop in ((JObject)jToken).Properties())
                        {
                            switch (prop.Name)
                            {
                                case "KeyValue":
                                    key = prop.Value + string.Empty;
                                    break;
                                case "RMRead":
                                case "RMNew":
                                case "RMEdit":
                                case "RMDelete":
                                case "RMExport":
                                    model[prop.Name.Substring(2).ToLower()] = ConverterUtils.ToBool(prop.Value);
                                    break;
                            }
                        }//for

                        if (key != string.Empty && key != "{}")
                        {
                            //Group by Key and 'Or' Read/New/Edit/Delete/Export
                            var prevModel = result.GetValueOrDefault(key);
                            if (prevModel != null)
                            {
                                //Or bit with current model
                                foreach (string modelKey in model.Keys.ToArray())
                                {
                                    model[modelKey] = model[modelKey] | prevModel[modelKey];
                                }
                            }

                            result[key] = model;
                        }
                    }//for
                    return result;
                }
            }

            return null;
        }

        public async Task<WSEditReturn> SaveDefaultWorkspaceTemplate(UserModuleWorkspaceDefaultData data)
        {
            data.MethodName = "SpCallWorkspaceTemplate";
            data.Object = "SaveDefault";

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
    }
}
