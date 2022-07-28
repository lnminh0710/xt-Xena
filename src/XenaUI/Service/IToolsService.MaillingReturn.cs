using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using XenaUI.Utils;

namespace XenaUI.Service
{
    public partial class ToolsService
    {
        public Task<WSEditReturn> SaveMailingReturn(MailingReturnSaveData data)
        {
            data.MethodName = "SpCallTools";
            data.Object = "MailingReturns";
            return SaveData(data);
        }

        public Task<object> ResetMailingReturn(Data data)
        {
            data.MethodName = "SpCallMailingReturn";
            data.Object = "ResetMailingReturn";

            return SaveData<object>(data);
        }

        public Task<object> GetMailingReturnSummary(Data data)
        {
            data.MethodName = "SpCallMailingReturn";
            data.Object = "MailingReturnSummary";
            return GetDataWithMapTypeIsNone(data);
        }

        public async Task<object> ExportCustomerAndBusinessStatus(Data data, string customerStatusIds, string businessStatusIds)
        {
            data.MethodName = "SpCallTools";
            data.Object = "ExportCustomerAndBusinessStatus";
            var expandData = Common.ToDictionary(data);
            expandData["IdsCustomerStatus"] = customerStatusIds;
            expandData["IdsBusinessStatus"] = businessStatusIds;
            BodyRequest bodyRquest = CreateBodyRequestObject(expandData);
            var response = (await Service.Post(body: bodyRquest, expectedReturn: null, mappingType: Constants.EExecuteMappingType.None))[0];
            return response != null ? new WSDataReturn { Data = (JArray)response } : null;
        }
    }
}
