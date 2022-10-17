using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using XenaUI.Models;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using System;
using XenaUI.Utils;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class PrintingController : Controller
    {
        private IPathProvider _pathProvider;
        private readonly IPrintingBusiness _printingBusiness;

        public PrintingController(IPrintingBusiness printingBusiness, IPathProvider pathProvider)
        {
            _pathProvider = pathProvider;
            _printingBusiness = printingBusiness;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetStatus")]
        public ActionResult<bool> GetStatus()
        {
            return true;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetCampaignDatas")]
        public async Task<object> GetCampaigns(string objectName, string secondInstance)
        {
            return await _printingBusiness.GetCampaigns(objectName, secondInstance);
        }

        [HttpPost]
        [Route("Confirm")]
        [AllowAnonymous]
        public async Task<object> ConfirmGetCampain([FromBody]PrintingCampaignConfirmModel model)
        {
            return await _printingBusiness.ConfirmGetCampaign(model);
        }

        [HttpPost]
        [Route("DownloadTemplates")]
        [AllowAnonymous]
        public async Task<object> DownloadTemplates([FromBody]PrintingDownloadTemplatesModel model)
        {
            if(!string.IsNullOrEmpty(model.IdSalesCampaignWizardItems) || !string.IsNullOrEmpty(model.ExternalParam))
            {
                try
                {
                    RequestTemplateModel requrestModel = new RequestTemplateModel()
                    {
                        IdSalesCampaignWizardItems = model.IdSalesCampaignWizardItems,
                        ExternalParam = model.ExternalParam
                    };
                    var s = await _printingBusiness.ReGetNewTemplate(requrestModel);
                    if (s == null) return null;
                    WSDataReturn dt = (WSDataReturn)s;
                    if (dt == null || dt.Data == null)
                    {
                        throw new Exception("info template not found on DB.");
                    }
                    JArray item = dt.Data;
                    if (item.Count == 1 || item.Last.FirstOrDefault() == null)
                    {
                        throw new Exception("info template not found on DB.");
                    }
                    string MediaName = (item.Last.FirstOrDefault())["MediaName"] != null ? (item.Last.FirstOrDefault())["MediaName"].ToString() : "";
                    string MediaOriginalName = (item.Last.FirstOrDefault())["MediaOriginalName"] != null ? (item.Last.FirstOrDefault())["MediaOriginalName"].ToString() : "";

                    if (string.IsNullOrEmpty(MediaName))
                    {
                        throw new Exception("template not found on DB.");
                    }

                    string uploadFolder = _pathProvider.GetFullUploadFolderPath(UploadMode.Printing, model.IdSalesCampaignWizardItems);

                    PrintingDownloadTemplatesModel templ = new PrintingDownloadTemplatesModel();
                    templ.IdFolder = model.IdSalesCampaignWizardItems;
                    templ.Templates = new List<PrintingTemplateItem>();
                    PrintingTemplateItem t = new PrintingTemplateItem();
                    t.Filename = MediaName;
                    t.OriginalFilename = MediaOriginalName;
                    templ.Templates.Add(t);

                    foreach (var it in templ.Templates)
                    {
                        it.Path = uploadFolder;
                    }

                    var response = await _printingBusiness.DownloadTemplates(templ);
                    if (response == null)
                    {
                        throw new Exception("cannot define template.");
                    }
                    if (!string.IsNullOrEmpty(response.FullFileName))
                    {
                        return File(response.Content, System.Net.Mime.MediaTypeNames.Application.Octet, response.FileName);
                    }
                    else if (string.IsNullOrEmpty(model.IdFolder))
                    {
                        throw new Exception("cannot define template. " + uploadFolder +" \t " + JsonConvert.SerializeObject(templ));
                    }

                    //return new
                    //{
                    //    Message = "Create zip file failed"
                    //};
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    if (string.IsNullOrEmpty(model.IdFolder))
                    {
                        return new
                        {
                            Message = ex.Message,
                            StackTrace = ex.StackTrace,
                        };
                    }
                }
            }

            try
            {
                string uploadFolder = _pathProvider.GetFullUploadFolderPath(UploadMode.Printing, model.IdFolder);
                foreach (var item in model.Templates)
                {
                    item.Path = uploadFolder;
                }//for

                var response = await _printingBusiness.DownloadTemplates(model);

                if (!string.IsNullOrEmpty(response.FullFileName))
                {
                    return File(response.Content, System.Net.Mime.MediaTypeNames.Application.Octet, response.FileName);
                }

                return new
                {
                    Message = "Create zip file failed"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    Message = ex.Message,
                    StackTrace = ex.ToString(),
                };
            }
        }

        [HttpPost]
        [Route("Re-DownloadTemplates")]
        [AllowAnonymous]
        public async Task<object> ReDownloadTemplates([FromBody] RequestTemplateModel model)
        {
            try
            {
                var s = await _printingBusiness.ReGetNewTemplate(model);
                if (s == null) return null;
                WSDataReturn dt = (WSDataReturn)s;
                JArray item = dt.Data;
                if (dt.Data.Count == 1)
                {
                    return new
                    {
                        Message = "template not found on DB."
                    };
                }
                string MediaName = (item.Last.FirstOrDefault())["MediaName"] != null ? (item.Last.FirstOrDefault())["MediaName"].ToString() : "";
                string MediaOriginalName = (item.Last.FirstOrDefault())["MediaOriginalName"] != null ? (item.Last.FirstOrDefault())["MediaOriginalName"].ToString() : "";

                if (string.IsNullOrEmpty(MediaName))
                {
                    return new
                    {
                        Message = "template not found on db"
                    };
                }

                string uploadFolder = _pathProvider.GetFullUploadFolderPath(UploadMode.Printing, model.IdSalesCampaignWizardItems);

                PrintingDownloadTemplatesModel templ = new PrintingDownloadTemplatesModel();
                templ.IdFolder = model.IdSalesCampaignWizardItems;
                templ.Templates = new List<PrintingTemplateItem>();
                PrintingTemplateItem t = new PrintingTemplateItem();
                t.Filename = MediaName;
                t.OriginalFilename = MediaOriginalName;

                foreach (var it in templ.Templates)
                {
                    it.Path = uploadFolder;
                }

                var response = await _printingBusiness.DownloadTemplates(templ);

                if (!string.IsNullOrEmpty(response.FullFileName))
                {
                    return File(response.Content, System.Net.Mime.MediaTypeNames.Application.Octet, response.FileName);
                }

                return new
                {
                    Message = "Create zip file failed"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    Message = ex.Message,
                    StackTrace = ex.ToString(),
                };
            }
        }


        [HttpPost]
        [Route("DownloadArticleMedia")]
        [AllowAnonymous]
        public async Task<object> DownloadArticleMedia([FromBody]IList<ArticleMedia> articleMediaList)
        {
            try
            {
                if (articleMediaList != null && articleMediaList.Any())
                {
                    string rootUploadFolderPath = _pathProvider.FileShare;
                    string uploadPrintingFolder = _pathProvider.GetFullUploadFolderPath(UploadMode.Printing);

                    var response = await _printingBusiness.DownloadArticleMedia(articleMediaList, rootUploadFolderPath, uploadPrintingFolder);

                    if (!string.IsNullOrEmpty(response.FullFileName))
                    {
                        return File(response.Content, System.Net.Mime.MediaTypeNames.Application.Octet, response.FileName);
                    }

                }
                return new
                {
                    Message = "Create zip file failed"
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    Message = ex.Message,
                    StackTrace = ex.ToString(),
                };
            }
        }
    }
}
