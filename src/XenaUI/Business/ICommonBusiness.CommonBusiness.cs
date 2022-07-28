using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using XenaUI.Service;
using XenaUI.Utils;
using Microsoft.Extensions.Options;
using XenaUI.Models;
using System.Collections.Generic;
using RestSharp;
using System.Dynamic;
using Newtonsoft.Json;
using System.Net;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using iTextSharp.text.pdf;
using System.IO;
using iTextSharp.text;

namespace XenaUI.Business
{
    public class CommonBusiness : BaseBusiness, ICommonBusiness
    {
        private IPathProvider _pathProvider;
        private readonly AppSettings _appSettings;
        private readonly ICommonService _commonService;
        private string DocumentTemplatePath { get; set; }

        public CommonBusiness(IHttpContextAccessor context,
            IOptions<AppSettings> appSettings,
            ICommonService commonService,
            IPathProvider pathProvider) : base(context)
        {
            _pathProvider = pathProvider;
            _appSettings = appSettings.Value;
            _commonService = commonService;

            DocumentTemplatePath = pathProvider.MapContentRootPath("DocumentTemplate");
        }

        public async Task<object> GetSystemInfo()
        {
            return await _commonService.GetSystemInfo(ServiceDataRequest);
        }

        public async Task<object> DedupeCheckPerson(CustomerMatchedModel person)
        {
            var restClient = new RestClient(_appSettings.MatchingApiUrl);

            if (_appSettings.MatchingWeight <= 0) _appSettings.MatchingWeight = 90;
            var _defaultThreshold = (double)_appSettings.MatchingWeight / 100;

            RestRequest request = new RestRequest("check", Method.POST);
            request.AddHeader("Content-Type", "application/json; charset=utf-8");
            request.AddHeader("Accept", "application/json");

            IList<XMatchField> searchPersonFields = new List<XMatchField>()
                    {
                        new XMatchField{name = "FirstName", threshold = _defaultThreshold},
                        new XMatchField{name = "LastName", threshold = _defaultThreshold},
                        new XMatchField{name = "Street", threshold = _defaultThreshold},
                        new XMatchField{name = "Zip", threshold = _defaultThreshold}
                    };

            dynamic model = new ExpandoObject();
            model.idRepIsoCountryCode = person.IdRepIsoCountryCode;
            model.fields = searchPersonFields;
            model.person = person;
            request.AddJsonBody(model);

            TaskCompletionSource<IRestResponse> taskCompletion = new TaskCompletionSource<IRestResponse>();
            RestRequestAsyncHandle handle = restClient.ExecuteAsync(request, r => taskCompletion.SetResult(r));
            RestResponse response = (RestResponse)(await taskCompletion.Task);

            #region Parse Data
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return JsonConvert.DeserializeObject<object>(response.Content);
            }
            #endregion

            return new { };
        }

        public async Task<object> MatchingApiCheckPerson(CustomerMatchedModel person)
        {
            string url = string.Format("{0}?firstName={1}&lastName={2}&street={3}&idRepIsoCountryCode={4}&zip={5}"
                , _appSettings.MatchingApiUrl
                , person.FirstName
                , person.LastName
                , person.Street
                , person.IdRepIsoCountryCode
                , person.Zip);

            RestClient restClient = new RestClient(url);
            RestRequest request = new RestRequest("", Method.GET);
            request.AddHeader("Accept", "application/json");

            TaskCompletionSource<IRestResponse> taskCompletion = new TaskCompletionSource<IRestResponse>();
            RestRequestAsyncHandle handle = restClient.ExecuteAsync(request, r => taskCompletion.SetResult(r));
            RestResponse response = (RestResponse)(await taskCompletion.Task);

            #region Parse Data
            if (response.StatusCode == HttpStatusCode.OK)
            {
                return JsonConvert.DeserializeObject<object>(response.Content);
            }
            #endregion

            return new { };
        }

        public async Task<WSEditReturn> CreateQueue(CreateQueueModel model)
        {
            CommonCreateQueueData data = (CommonCreateQueueData)ServiceDataRequest.ConvertToRelatedType(typeof(CommonCreateQueueData));
            var modelValue = JsonConvert.SerializeObject(model, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            });
            data.IdRepAppSystemScheduleServiceName = model.IdRepAppSystemScheduleServiceName.ToString();
            data.JSONText = model.JsonText;
            var result = await _commonService.CreateQueue(data);

            return result;
        }

        public async Task<WSEditReturn> DeleteQueues(DeleteQueuesModel model)
        {
            CommonDeleteQueuesData data = (CommonDeleteQueuesData)ServiceDataRequest.ConvertToRelatedType(typeof(CommonDeleteQueuesData));
            var modelValue = JsonConvert.SerializeObject(model, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            });
            data.QueuesId = model.QueuesId;
            var result = await _commonService.DeleteQueues(data);

            return result;
        }

        #region [Folder]

        public async Task<object> GetImageGalleryFolder()
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            var result = await _commonService.GetImageGalleryFolder(data);
            return result;
        }

        public async Task<object> GetImagesByFolderId(int? folderId)
        {
            ImageGalleryData data = (ImageGalleryData)ServiceDataRequest.ConvertToRelatedType(typeof(ImageGalleryData));
            data.IdSharingTreeGroups = folderId;
            var result = await _commonService.GetImagesByFolderId(data);
            return result;
        }

        public async Task<WSEditReturn> SavingSharingTreeGroups(SharingTreeGroupsModel model)
        {
            SharingTreeGroupsData data = (SharingTreeGroupsData)ServiceDataRequest.ConvertToRelatedType(typeof(SharingTreeGroupsData));
            data = (SharingTreeGroupsData)Common.MappModelToSimpleData(data, model);
            var result = await _commonService.SavingSharingTreeGroups(data);
            return result;
        }

        public async Task<object> EditImagesGallery(CampaignCostFilesModel model)
        {
            CampaignCreateData data = (CampaignCreateData)ServiceDataRequest.ConvertToRelatedType(typeof(CampaignCreateData));
            if (model.CampaignCostFiles != null && model.CampaignCostFiles.Count > 0)
            {
                string modelValue = JsonConvert.SerializeObject(model.CampaignCostFiles, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONText = string.Format(@"""ImageGallery"":{0}", modelValue);
                data.JSONText = "{" + data.JSONText + "}";
                var result = await _commonService.EditImagesGallery(data);

                if (result.IsSuccess && !string.IsNullOrEmpty(result.ReturnID))
                {
                    //This code will run async without affect the main thread
                    await _pathProvider.DeleteFiles(model.DeleteFiles).ConfigureAwait(false);
                }

                return result;
            }
            return new WSEditReturn();
        }

        #endregion

        public async Task<JArray> GetReportNotesForOuput(string fieldName, string value)
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            return await _commonService.GetReportNotesForOuput(data, fieldName, value);
        }

        public byte[] GeneratePdfFileForReportNote(JArray array, string templateFullFileName)
        {
            Byte[] res = null;
            using (MemoryStream ms = new MemoryStream())
            {
                var doc = new Document(PageSize.A4, 45, 45, 45, 60);
                var writer = PdfWriter.GetInstance(doc, ms);

                doc.Open();

                string chineseFont = Path.Combine(DocumentTemplatePath, "chinese.msyh.ttf");
                BaseFont customFont = BaseFont.CreateFont(chineseFont, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
                string defaultFont = FontFactory.HELVETICA;

                // title
                var titleParagraph = new Paragraph("Report Notes", FontFactory.GetFont(defaultFont, 16, Font.NORMAL));
                titleParagraph.SpacingAfter = 20;
                doc.Add(titleParagraph);

                // common info
                var commonInfos = array[0]?[0]?.ToList();
                if (commonInfos.Any())
                {
                    foreach (var item in commonInfos)
                    {
                        var properties = (JProperty)item;

                        var phrase = new Phrase();
                        phrase.Add(new Chunk($"{properties.Name}: ", FontFactory.GetFont(defaultFont, 12, Font.BOLD)));
                        phrase.Add(new Chunk(properties.Value.ToString(), FontFactory.GetFont(defaultFont, 12, Font.NORMAL)));
                        doc.Add(new Paragraph(phrase));
                    }
                }

                // table
                var dataInfo = JsonConvert.DeserializeObject<JArray>(array[1].ToString());
                if (dataInfo.Any())
                {
                    var ignoreFields = _appSettings.ExportReportNote.IgnoreField.Select(x => x.Trim().ToLower()).ToList();
                    var fieldNameToCheckShowLineThrough = _appSettings.ExportReportNote.ShowLineThroughByField.Trim().ToLower();
                    int totalColumn = 0;
                    var headerList = new List<string>();
                    foreach (var item in dataInfo[0])
                    {
                        var dataProperties = (JProperty)item;

                        var header = dataProperties.Name.Trim().ToLower();
                        if (ignoreFields.Contains(header)) continue;

                        totalColumn += 1;
                        headerList.Add(dataProperties.Name.Trim());
                    }

                    var widths = new List<float>();
                    float width = 0;
                    for (int i = 0; i < totalColumn; i++)
                    {
                        width += 0.5f;
                        float value = i == totalColumn - 1 ? (float)(totalColumn - width) : 0.5f;
                        widths.Add(value);
                    }
                    PdfPTable table = new PdfPTable(widths.ToArray());
                    table.TotalWidth = 500f;
                    table.LockedWidth = true;
                    table.SpacingBefore = 20f;
                    table.SpacingAfter = 30f;

                    // draw header
                    foreach (var item in headerList)
                    {
                        PdfPCell cm;

                        cm = new PdfPCell(new Phrase(5, item, FontFactory.GetFont(defaultFont, 12, Font.BOLD)));
                        cm.HorizontalAlignment = Element.ALIGN_LEFT;
                        cm.VerticalAlignment = Element.ALIGN_CENTER;
                        cm.BorderWidth = 1;
                        cm.Padding = 8;
                        table.AddCell(cm);
                    }

                    // draw body
                    foreach (var rowData in dataInfo.ToList())
                    {
                        var propertyCheckToShowLineThrough = rowData.FirstOrDefault(x => (x as JProperty).Name.Trim().ToLower() == fieldNameToCheckShowLineThrough);
                        var styleLineThrough = propertyCheckToShowLineThrough != null && (propertyCheckToShowLineThrough as JProperty).Value.ToString().ToLower().Trim() == "true";

                        foreach (var item in rowData.ToList())
                        {
                            var properties = (JProperty)item;
                            var header = properties.Name.Trim().ToLower();
                            if (ignoreFields.Contains(header)) continue;

                            PdfPCell cm;
                            Chunk chunk = new Chunk(properties.Value.ToString(), new Font(customFont, 12, Font.NORMAL));
                            if (styleLineThrough)
                            {
                                chunk.SetUnderline(1.5f, 3.5f);
                            }
                            cm = new PdfPCell(new Phrase(5, chunk));
                            cm.HorizontalAlignment = Element.ALIGN_LEFT;
                            cm.VerticalAlignment = Element.ALIGN_CENTER;
                            cm.BorderWidth = 1;
                            cm.Padding = 8;
                            table.AddCell(cm);
                        }
                    }

                    doc.Add(table);
                }

                doc.Close();

                res = ms.ToArray();
            }
            return res;
        }

        public async Task<object> CallBackToDBByDynamicSP(Dictionary<string, object> data)
        {
            var spObject = data.GetStringValue("Object");
            var spMethodName = data.GetStringValue("MethodName");
            if (string.IsNullOrEmpty(spObject) || string.IsNullOrEmpty(spMethodName))
            {
                throw new Exception("Data invalid");
            }
            Data baseData = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            SaveDynamicData saveData = new SaveDynamicData
            {
                BaseData = baseData,
                Data = data,
                IgnoredKeys = new List<string>() { "SpObject", "SpMethodName" },
                SpMethodName = spMethodName,
                SpObject = spObject
            };

            List<string> ignoredKeys = data.GetValue("IgnoredKeys") as List<string>;
            if (ignoredKeys != null && ignoredKeys.Count > 0)
            {
                saveData.IgnoredKeys.AddRange(ignoredKeys);
            }
            saveData.IgnoredKeys = saveData.IgnoredKeys.Distinct().ToList();

            var result = await _commonService.CallBackToDBByDynamicSP(saveData);

            //_logger.Debug($"Result save SaveDynamicData: {data}       {JsonConvert.SerializeObject(result)}");
            //if (result == null || string.IsNullOrWhiteSpace(result.ReturnID) || result.EventType == null || !"Successfully".Contains(result.EventType))
            //{
            //    return new WSEditReturn
            //    {
            //        ReturnID = "-1",
            //        EventType = null,
            //    };
            //}
            return result;
        }
    }
}
