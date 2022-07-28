using System.Threading.Tasks;
using XenaUI.Utils;
using XenaUI.Service;
using Microsoft.AspNetCore.Http;
using System;
using Newtonsoft.Json;
using XenaReport;
using System.IO;
using System.Globalization;
using System.Data;
using Newtonsoft.Json.Linq;
using XenaReport.Models;
using System.IO.Compression;
using XenaEmail;
using System.Collections.Generic;
using Microsoft.Extensions.Options;

namespace XenaUI.Business
{
    /// <summary>
    /// UniqueBusiness
    /// </summary>
    public class SelectionExportBusiness : BaseBusiness, ISelectionExportBusiness
    {
        public string SelectionExportFolder = "SelectionExport";
        private readonly IPathProvider _pathProvider;
        private readonly AppSettings _appSettings;
        private readonly ISelectionExportService _selectionExportService;

        public SelectionExportBusiness(IHttpContextAccessor context, IPathProvider pathProvider, IOptions<AppSettings> appSettings, ISelectionExportService SelectionExportService) : base(context)
        {
            _pathProvider = pathProvider;
            _appSettings = appSettings.Value;
            _selectionExportService = SelectionExportService;
        }

        public async Task<object> GetDataExport(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry)
        {
            SelectionExportData data = (SelectionExportData)ServiceDataRequest.ConvertToRelatedType(typeof(SelectionExportData));
            data.IdSelectionProject = idSelectionProject.ToString();
            if (idCountryLanguage != null)
            {
                data.IdCountryLanguage = idCountryLanguage;
            }

            if (idSelectionProjectCountry != null)
            {
                data.IdSelectionProjectCountry = idSelectionProjectCountry;
            }

            var result = await _selectionExportService.GetDataExport(data);
            return result;
        }

        public async Task<ReportFileInfo> ExportMediaCode(string idSelectionProject, string projectName, bool isExportXlsFile = false)
        {
            SelectionExportData data = (SelectionExportData)ServiceDataRequest.ConvertToRelatedType(typeof(SelectionExportData));
            data.IdSelectionProject = idSelectionProject;

            var jsonResult = (JArray)(await _selectionExportService.GetDataExportMediaCode(data));

            if (jsonResult != null && jsonResult.Count > 1)
            {
                DataSet dataSet = new DataSet();
                for (int i = 0; i < jsonResult.Count - 1; i++)
                {
                    DataTable DataTable = JsonConvert.DeserializeObject<DataTable>(jsonResult[i] + string.Empty);
                    dataSet.Tables.Add(DataTable);
                }

                #region Export File
                var reportFileInfo = new ReportFileInfo()
                {
                    OriginalFileName = string.Format("MediaCodeSummary_{0}.xlsx", DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss", CultureInfo.InvariantCulture)),
                    FullFolderPath = Path.Combine(_pathProvider.RootUploadFolderPath, SelectionExportFolder, string.Format(@"{0}\{1}\{2}", DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day))
                };
                reportFileInfo.Build();

                var report = new ReportSelectionMediaCodeExport(reportFileInfo, dataSet);
                report.IdSelectionProject = projectName;
                report.IsExportXlsFile = isExportXlsFile;
                report.Export();
                #endregion

                return await Task.FromResult(reportFileInfo);
            }
            return await Task.FromResult(new ReportFileInfo { });
        }

        public async Task<ReportFileInfo> ExportDataExport(string idSelectionProject, string idCountryLanguage, string idSelectionProjectCountry, bool isZip = true, bool isExportCsvFile = false, string csvDelimiter = ",", bool isExportXlsFile = false)
        {
            SelectionExportData data = (SelectionExportData)ServiceDataRequest.ConvertToRelatedType(typeof(SelectionExportData));
            data.IdSelectionProject = idSelectionProject;

            if (!string.IsNullOrEmpty(idCountryLanguage))
                data.IdCountryLanguage = idCountryLanguage;

            if (!string.IsNullOrEmpty(idSelectionProjectCountry))
                data.IdSelectionProjectCountry = idSelectionProjectCountry;

            var jsonResult = (JArray)(await _selectionExportService.GetDataExport(data));

            var zipFileName = "";
            if (jsonResult != null && jsonResult.Count > 1)
            {
                DataSet dataSet = new DataSet();
                for (int i = 0; i < jsonResult.Count - 1; i++)
                {
                    DataTable DataTable = JsonConvert.DeserializeObject<DataTable>(jsonResult[i] + string.Empty);

                    if (i == 0 && DataTable.Columns["ZipFileName"] != null && DataTable.Rows.Count > 0)
                    {
                        zipFileName = DataTable.Rows[0]["ZipFileName"] + string.Empty;
                    }
                    else
                    {
                        //ds render data
                        dataSet.Tables.Add(DataTable);
                    }
                }

                #region Export File
                var reportFileInfo = new ReportFileInfo()
                {
                    IsZip = isZip,
                    //OriginalFileName = string.Format("Selection{0}_{1}.zip", idSelectionProject, DateTime.Now.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture)),
                    FullFolderPath = Path.Combine(_pathProvider.RootUploadFolderPath, SelectionExportFolder, string.Format(@"{0}\{1}\{2}", DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day))
                };

                if (zipFileName != string.Empty)
                {
                    reportFileInfo.OriginalFileName = string.Format("{0}.zip", zipFileName);
                }
                else
                {
                    reportFileInfo.OriginalFileName = string.Format("Selection{0}_{1}.zip", idSelectionProject, DateTime.Now.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture));
                }
                reportFileInfo.Build();

                var report = new ReportSelectionDataExport(reportFileInfo, dataSet);
                report.IsExportCsvFile = isExportCsvFile;
                report.Delimiter = csvDelimiter;
                report.IsExportXlsFile = isExportXlsFile;

                //At the period time only support xlsx or csv
                if (isExportCsvFile)
                    report.IsExportXlsxFile = false;

                report.Export();
                #endregion

                return await Task.FromResult(reportFileInfo);
            }
            return await Task.FromResult(new ReportFileInfo { });
        }

        public async Task<ReportFileInfo> ExportAll(string idSelectionProject, string projectName, string email, bool isExportCsvFile = false, string csvDelimiter = ",", bool isExportXlsFile = false)
        {
            var resultExportMediaCode = await ExportMediaCode(idSelectionProject, projectName, isExportXlsFile: isExportXlsFile);
            var resultExportDataExport = await ExportDataExport(idSelectionProject, null, null, isZip: false, isExportCsvFile: isExportCsvFile, csvDelimiter: csvDelimiter, isExportXlsFile: isExportXlsFile);

            if (!string.IsNullOrEmpty(resultExportMediaCode.FullFileName) && File.Exists(resultExportMediaCode.FullFileName))
            {
                var mediaCodeFullFileName = Path.Combine(resultExportDataExport.FullZipFolderPath, resultExportMediaCode.OriginalFileName);
                File.Move(resultExportMediaCode.FullFileName, mediaCodeFullFileName);
            }

            ZipFile.CreateFromDirectory(resultExportDataExport.FullZipFolderPath, resultExportDataExport.FullFileName);
            Directory.Delete(resultExportDataExport.FullZipFolderPath, true);

            //Send Mail Report File
            SendMailReportFile(resultExportDataExport, projectName, email);

            return await Task.FromResult(resultExportDataExport);
        }

        private void SendMailReportFile(ReportFileInfo reportFileInfo, string projectName, string email)
        {
            if (!File.Exists(reportFileInfo.FullFileName)) return;

            Task.Run(() =>
            {
                IXenaEmailService emailService = new XenaEmailService();

                IList<EmailAttachmentFile> attachments = new List<EmailAttachmentFile>()
                {
                    new EmailAttachmentFile{
                        FullName=reportFileInfo.FullFileName,
                        DisplayName= reportFileInfo.OriginalFileName
                    }
                };

                emailService.SmtpMailSettings = new SmtpMailSettings()
                {
                    From = _appSettings.EmailSending.Email,
                    Host = _appSettings.EmailSending.Domain,
                    Port = _appSettings.EmailSending.Port,
                    UserName = _appSettings.EmailSending.Email,
                    Password = _appSettings.EmailSending.Password,
                };
                emailService.SendEmail(model: new XenaEmailModel
                {
                    ToEmail = email != null ? email : UserFromService.Email,
                    Subject = $"[Selection Export][Project {projectName}] Data export completed on {DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss")}",
                    Body = $"Project: {projectName}. Your selection data is export completed. Please see in attachments.",
                    Attachments = attachments
                }).Wait();
            });
        }
    }
}
