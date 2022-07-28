using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using XenaUI.Business;
using Newtonsoft.Json;
using XenaUI.Utils;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using XenaUI.Models;
using System.IO.Compression;
using System.Collections.Generic;
using System.Reflection;

namespace XenaUI.Api
{
    [Route("api/[controller]")]
    [Authorize]
    public class FileManagerController : Controller
    {
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(Assembly.GetEntryAssembly(), "DEBUG");
        private readonly IPathProvider _pathProvider;
        private readonly AppSettings _appSettings;
        private readonly ServerConfig _serverConfig;

        private readonly IOrderDataEntryBusiness _orderDataEntryBusiness;
        private readonly IPrintingBusiness _printingBusiness;
        private readonly IArticleBusiness _articleBusiness;
        private readonly IImageResizer _imageResizer;
        private readonly IInventoryBusiness _inventoryBusiness;
        private readonly IToolsBusiness _toolsBusiness;
        private readonly ICommonBusiness _commonBusiness;
        /// <summary>
        /// FileManagerController
        /// </summary>
        /// <param name="appSettings"></param>
        /// <param name="orderDataEntryBusiness"></param>
        /// <param name="appServerSetting"></param>
        /// <param name="printingBusiness"></param>
        /// <param name="pathProvider"></param>
        public FileManagerController(IOptions<AppSettings> appSettings, IAppServerSetting appServerSetting, IPathProvider pathProvider,
            IOrderDataEntryBusiness orderDataEntryBusiness, IPrintingBusiness printingBusiness, IImageResizer imageResizer,
            IArticleBusiness articleBusiness, IInventoryBusiness inventoryBusiness, IToolsBusiness toolsBusiness, ICommonBusiness commonBusiness)
        {
            _pathProvider = pathProvider;
            _appSettings = appSettings.Value;
            _serverConfig = appServerSetting.ServerConfig;
            _orderDataEntryBusiness = orderDataEntryBusiness;
            _printingBusiness = printingBusiness;
            _imageResizer = imageResizer;
            _articleBusiness = articleBusiness;
            _inventoryBusiness = inventoryBusiness;
            _toolsBusiness = toolsBusiness;
            _commonBusiness = commonBusiness;
            
        }

        #region ScanFile

        /// <summary>
        /// UploadScanFile
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("UploadScanFile")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadScanFile()
        {
            var request = HttpContext.Request;
            IFormFileCollection files = request.Form.Files;
            long size = files.Sum(f => f.Length);
            string uploadScanFolder = _pathProvider.FileShare + "\\XenaScan";
            string fileName = string.Empty;
            if (files.Any())
            {
                if (!Directory.Exists(uploadScanFolder))
                {
                    Directory.CreateDirectory(uploadScanFolder);
                }

                // 
                if (request.Form["OrderScanning"].Any())
                {
                    var watch = Stopwatch.StartNew();
                    var s = Uri.UnescapeDataString(request.Form["OrderScanning"].First());
                    ScanningLotItemData scanningLotItemData = JsonConvert.DeserializeObject<ScanningLotItemData>(s);
                    string lotIdFolder = Path.Combine(uploadScanFolder, "LotID" + scanningLotItemData.IdScansContainer);

                    if (!Directory.Exists(lotIdFolder))
                    {
                        Directory.CreateDirectory(lotIdFolder);
                    }

                    foreach (var file in files)
                    {
                        if (file.Length > 0)
                        {
                            fileName = Path.GetFileName(file.FileName);
                            using (var fileStream = new FileStream(Path.Combine(lotIdFolder, fileName), FileMode.Create))
                            {
                                // SentrySdk.CaptureMessage("file.CopyToAsync(fileStream)");
                                await file.CopyToAsync(fileStream);
                            }
                        }
                    }
                    scanningLotItemData.ScannedPath = lotIdFolder;
                    var result = _orderDataEntryBusiness.SaveScanningOrder(scanningLotItemData);
                    watch.Stop();

                    return Ok(new
                    {
                        UploadSpeed = watch.ElapsedMilliseconds,
                        Result = result.Result
                    });
                    //return Ok(result.Result);
                }
            }
            return Ok();
        }

        [HttpGet]
        [Route("GetScanFile")]
        [AllowAnonymous]
        public IActionResult GetScanFile(string name, string returnName)
        {
            if (System.IO.File.Exists(name))
            {
                var fileNameToSave = name.IndexOf("\\", StringComparison.Ordinal) > -1 ? Path.GetFileName(name) : name;
                var fileBytes = System.IO.File.ReadAllBytes(name);
                if (string.IsNullOrEmpty(returnName))
                    return File(fileBytes, "application/octet-stream", fileNameToSave);

                return File(fileBytes, "application/octet-stream", returnName);
            }
            return StatusCode(404);
        }
        #endregion

        #region File

        /// <summary>
        /// UploadFile
        /// </summary>
        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 2097152000)]
        [RequestSizeLimit(2097152000)]
        [Route("UploadFile")]
        [AllowAnonymous]
        public async Task<object> UploadFile(UploadMode? mode = null, string subFolder = null, string saveFileName = null)
        {
            var request = HttpContext.Request;
            IFormFileCollection files = request.Form.Files;
            long size = files.Sum(f => f.Length);
            string uploadFolder = _pathProvider.GetFullUploadFolderPath(mode, subFolder);
            string fileName = string.Empty;
            string originalFileName = string.Empty;
            string path = "";
            if (files.Any())
            {
                #region Special Cases
                switch (mode)
                {
                    case UploadMode.Inventory:
                        return await UploadFileInventory(files);
                    case UploadMode.MailingReturn:
                        return await UploadFileMailingReturn(files, uploadFolder);
                }
                #endregion

                var file = files.First();
                fileName = string.IsNullOrEmpty(saveFileName) ? Guid.NewGuid().ToString() + Path.GetExtension(file.FileName) : saveFileName;
                originalFileName = Path.GetFileName(file.FileName);
                var fullFileName = Path.Combine(uploadFolder, fileName);

                //size (in bytes): 500000 bytes = 500 kb
                if (size >= 500000 && PathProvider.ImageExtensions.Contains(Path.GetExtension(file.FileName).ToLowerInvariant()))
                {
                    ImageUtil.RewriteImage(file.OpenReadStream(), fullFileName, isDisposeImage: true);
                    file = null;
                }
                else
                {
                    using (var fileStream = new FileStream(fullFileName, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                }

                path = _pathProvider.TrimFolderPath(uploadFolder);
            }
            return Ok(new { fileName, originalFileName, size, path });
        }

        [HttpGet]
        [Route("GetFile")]
        [AllowAnonymous]
        public IActionResult GetFile(string name, string returnName, UploadMode? mode = null, string subFolder = null)
        {
            if (string.IsNullOrEmpty(name)) return StatusCode(404);

            var fileInfoItem = _pathProvider.GetFileInfoItem(name, returnName: returnName, mode: mode, subFolder: subFolder);

            if (!string.IsNullOrEmpty(fileInfoItem.FullFileName) && System.IO.File.Exists(fileInfoItem.FullFileName))
            {
                Stream stream = null;
                //byte[] fileBytes = null;
                var query = HttpContext.Request.Query;
                if (fileInfoItem.IsImage && (query.ContainsKey("w") || query.ContainsKey("h")))
                {
                    var fileBytes = _imageResizer.ResizeImage(fileInfoItem, HttpContext.Request.Query);
                    stream = new MemoryStream(fileBytes);
                }
                else
                {
                    //fileBytes = System.IO.File.ReadAllBytes(fileInfoItem.FullFileName);
                    stream = new FileStream(fileInfoItem.FullFileName, FileMode.Open, FileAccess.Read);
                }

                var fileResult = new FileStreamResult(stream, XenaUtils.MIMEAssistant.GetMIMETypeByExtension(fileInfoItem.Extension));
                if (!string.IsNullOrEmpty(returnName))
                    fileResult.FileDownloadName = fileInfoItem.ReturnName;

                return fileResult;

                //return File(fileBytes, "application/octet-stream", fileInfoItem.ReturnName);
            }
            return StatusCode(404);
        }

        [HttpGet]
        [Route("CheckFileExisted")]
        [AllowAnonymous]
        public bool CheckFileExisted(string fileName, UploadMode? mode, string subFolder = null)
        {
            var fileInfoItem = _pathProvider.GetFileInfoItem(fileName, mode: mode, subFolder: subFolder);
            return System.IO.File.Exists(fileInfoItem.FullFileName);
        }

        [HttpPost]
        [Route("DownloadTemplates")]
        [AllowAnonymous]
        public async Task<object> DownloadTemplates([FromBody]FileDownloadTemplatesModel model)
        {
            var printingDownloadTemplatesModel = new PrintingDownloadTemplatesModel();

            string uploadFolder = _pathProvider.GetFullUploadFolderPath(model.Mode, model.Id);

            foreach (var item in model.Templates)
            {
                if (item.Mode != null)
                {
                    uploadFolder = _pathProvider.GetFullUploadFolderPath(item.Mode, item.Id);
                }

                printingDownloadTemplatesModel.Templates.Add(new PrintingTemplateItem
                {
                    Filename = item.Filename,
                    OriginalFilename = item.OriginalFilename,
                    Path = uploadFolder,
                    Content = item.Content
                });
            }//for

            var response = await _printingBusiness.DownloadTemplates(printingDownloadTemplatesModel, model.ZipFileName);

            if (!string.IsNullOrEmpty(response.FullFileName))
            {
                if (model.IsReturnFile)
                    return File(response.Content, System.Net.Mime.MediaTypeNames.Application.Octet, response.FileName);

                return response.Content;
            }

            return StatusCode(404);
        }
        #endregion

        /// <summary>
        /// ImportArticleMediaZip
        /// </summary>
        [HttpPost]
        [RequestFormLimits(MultipartBodyLengthLimit = 2097152000)]
        [RequestSizeLimit(2097152000)]
        [Route("ImportArticleMediaZip")]
        [AllowAnonymous]
        public async Task<object> ImportArticleMediaZip()
        {
            var request = HttpContext.Request;
            IFormFileCollection files = request.Form.Files;
            if (files == null || !files.Any())
            {
                return StatusCode(404);
            }

            string uploadFolder = _pathProvider.GetFullUploadFolderPath(UploadMode.ArticleMedia, null);
            IList<ArticleMediaZipInfo> articleMediaZipInfos = new List<ArticleMediaZipInfo>();
            using (var stream = files[0].OpenReadStream())
            {
                using (var archive = new ZipArchive(stream))
                {
                    foreach (ZipArchiveEntry entry in archive.Entries)
                    {
                        if (entry.FullName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                         || entry.FullName.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
                        {
                            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(entry.Name);
                            string originalFileName = Path.GetFileName(entry.Name);
                            string destinationPath = Path.GetFullPath(Path.Combine(uploadFolder, fileName));
                            string path = _pathProvider.TrimFolderPath(uploadFolder);
                            string articleNr = Path.GetFileNameWithoutExtension(entry.Name);
                            entry.ExtractToFile(destinationPath);

                            articleMediaZipInfos.Add(new ArticleMediaZipInfo()
                            {
                                ArticleNr = articleNr,
                                FileName = fileName,
                                FilePath = path,
                                FileSize = entry.Length,
                                OriginalName = originalFileName
                            });
                        }
                    }
                }
            }
            return await _articleBusiness.InsertArticleMediaZip(articleMediaZipInfos);
        }

        private async Task<object> UploadFileInventory(IFormFileCollection files)
        {
            var result = await _inventoryBusiness.ImportFileInventory(new InventoryImportFileModel
            {
                File = files.First().OpenReadStream()
            });
            return Ok(new { item = result });
        }

        private async Task<object> UploadFileMailingReturn(IFormFileCollection files, string uploadFolder)
        {
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }
            string fileName = DateTime.Now.ToString("yyyyMMdd_HHmmss") + "_" +  Path.GetFileName(files.First().FileName);
            string fullFile = Path.Combine(uploadFolder, fileName);
            _logger.Warn("UploadFileMailingReturn  " + fullFile);
            var file = files.First();
            using (var fileStream = new FileStream(fullFile, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            
            var result = new MailingReturnImportFileResult();
            Stream st = new FileStream(fullFile, FileMode.Open);
            try
            {                
                List<string> names = fileName.Split(",").ToList();
                List<Stream> streams = new List<Stream>();
                streams.Add(st);
                result = await _toolsBusiness.ImportFileMailingReturn(new MailingReturnImportFileModel
                {
                    FileNames =  names,
                    Files = streams
                });

                #region Save With Paging            
                if (result.Data.Count > 0)
                {
                    _logger.Warn("SaveMailingReturn: total data  " + result.Data.Count);
                    var listSaveResult = new List<WSEditReturn>();
                    const int pageSize = 100;
                    int pageIndex = 1;
                    while (true)
                    {
                        var list = result.Data.OrderBy(n => n.PersonNr).Skip(pageSize * (pageIndex - 1)).Take(pageSize).ToList();
                        if (list.Count == 0) break;

                        WSEditReturn saveResult = null;
                        try
                        {
                            saveResult =  await _toolsBusiness.SaveMailingReturn(list, result.ImportFileName);
                            _logger.Warn("SaveMailingReturn: result import pageIndex " + pageIndex + " \r\n " + JsonConvert.SerializeObject(saveResult));
                        }
                        catch (Exception exc)
                        {
                            _logger.Error("SaveMailingReturn: error . pageIndex " + pageIndex + "   list: " + list.Count, exc);
                        }

                        listSaveResult.Add(saveResult);

                        if (list.Count == 0 || list.Count < pageSize)
                        {
                            break;
                        }

                        pageIndex++;
                    }//while

                    if (listSaveResult.Count > 0)
                        result.SaveResult = listSaveResult.FirstOrDefault(n => n.IsSuccess) ?? listSaveResult.First();

                    _logger.Warn("SaveMailingReturn: SUCCESS . Total PageIndex " + (pageIndex));
                } else
                {
                    _logger.Error("SaveMailingReturn: NOT EXIST DATA on file  " + fullFile);
                }
                #endregion
            }
            catch (Exception ex)
            {
                _logger.Error("SaveMailingReturn  " + fullFile, ex);
                result.MessageException = $"Exception: {ex.Message}";
            } finally
            {
                if (st != null)
                {
                    try
                    {
                        st.Close();
                    }
                    catch (Exception e) {
                        _logger.Error("SaveMailingReturn: error close Stream  ", e);
                    }                    
                }
            }

            return Ok(new
            {
                item = new
                {
                    result.MessageException,
                    result.NumofRowsInvalid,
                    result.NumofRowsValid,
                    result.MessageColumns,
                    result.MessageRows,
                    result.SaveResult
                }
            });
        }

        [HttpGet]
        [Route("DownloadReportNotes")]
        [AllowAnonymous]
        public async Task<IActionResult> DownloadReportNotes(string fieldName, string value)
        {
            if (string.IsNullOrEmpty(fieldName) || string.IsNullOrEmpty(value)) return StatusCode(400);

            var reportsNoteObj = await _commonBusiness.GetReportNotesForOuput(fieldName, value);
            if (reportsNoteObj == null) return StatusCode(404);


            var bytes = _commonBusiness.GeneratePdfFileForReportNote(reportsNoteObj, "report-note.html");
            if (bytes == null) return StatusCode(500);

            var stream = new MemoryStream(bytes);

            return File(stream, System.Net.Mime.MediaTypeNames.Application.Pdf, $"{DateTime.Now.Ticks}");
        }
    }
}
