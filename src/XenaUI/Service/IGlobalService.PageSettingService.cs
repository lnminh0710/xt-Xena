using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public partial class GlobalService : BaseUniqueServiceRequest, IGlobalService
    {
        public async Task<PageSettingModel> GetPageSettingById(PageSettingData data)
        {
            data.MethodName = "SpCrudB00SettingsPage";
            data.Object = "B00SettingsPage";
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
            expectedReturn.Add(0, typeof(PageSettingModel));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<PageSettingModel>)response).FirstOrDefault() : null;
        }

        public async Task<WSReturn> SavePageSetting(PageSettingUpdateData data)
        {
            data.MethodName = "SpCrudB00SettingsPage";
            data.AppModus = "0";
            data.GUID = null;
            data.Object = "B00SettingsPage";
            UniqueBody uniq = new UniqueBody
            {
                ModuleName = "GlobalModule",
                ServiceName = "GlobalService"
            };
            // create new if it does not exist setting global id
            if (data.IdSettingsPage == null)
            {
                data.CrudType = "Create";
                uniq.Data = JsonConvert.SerializeObject(data.ConvertToRelatedType(typeof(PageSettingCreateData)));
            }
            // update with existed setting global id
            else
            {
                data.CrudType = "Update";
                uniq.Data = JsonConvert.SerializeObject(data);
            }

            BodyRequest bodyRquest = new BodyRequest
            {
                Request = uniq
            };
            var expectedReturn = new Dictionary<int, Type>();
            expectedReturn.Add(0, typeof(WSReturn));
            var response = (await Service.Post(body: bodyRquest, expectedReturn: expectedReturn))[0];
            return response != null ? ((IList<WSReturn>)response).FirstOrDefault() : null;
        }
    }
}

