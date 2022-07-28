using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public partial class ToolsBusiness
    {
        public async Task<WSEditReturn> SaveMailingReturn(IList<MailingReturnSaveItem> items, string importFileName = null)
        {
            MailingReturnSaveData data = (MailingReturnSaveData)ServiceDataRequest.ConvertToRelatedType(typeof(MailingReturnSaveData));
            data.JSONText = data.CreateJsonText("MailingReturn", items);
            data.ImportFileName = importFileName;
            return await _toolsService.SaveMailingReturn(data);
        }

        public async Task<object> ExportCustomerAndBusinessStatus(string customerStatusIds, string businessStatusIds)
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            //data
            return await _toolsService.ExportCustomerAndBusinessStatus(data, customerStatusIds, businessStatusIds);
        }

        public async Task<object> ResetMailingReturn()
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            return await _toolsService.ResetMailingReturn(data);
        }

        public async Task<object> GetMailingReturnSummary()
        {
            Data data = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            return await _toolsService.GetMailingReturnSummary(data);
        }

        public async Task<MailingReturnImportFileResult> ImportFileMailingReturn(MailingReturnImportFileModel model)
        {
            var result = new MailingReturnImportFileResult();

            var listImport = new List<MailingReturnSaveItem>();
            if (model.ColumnNames.Count == 0)
            {
                model.ColumnNames = new List<string>() { "Customer#", "MediaCode", "CustomerStatus", "BusinessStatus" };
            }

            var fileIndex = 0;
            foreach (var file in model.Files)
            {
                var listFailedItems = new List<int>();
                var fileName = model.FileNames[fileIndex++];
                using (var package = new ExcelPackage(file))
                {
                    var workbook = package.Workbook;
                    var ws = workbook.Worksheets.First();
                    var endColumn = ws.Dimension.End.Column;

                    #region Column Names
                    var headerRowIndex = 1;
                    //FromRow, FromCol, ToRow, ToCol
                    //ws.Cells[?, ?, ?, ?]

                    //A: Name1, B: Name2
                    Dictionary<string, string> dicColumnNames = new Dictionary<string, string>();
                    var columnNames = new List<string>();// contains only column name
                    foreach (ExcelRangeBase headerRowCell in ws.Cells[headerRowIndex, 1, headerRowIndex, endColumn])
                    {
                        var cellAddress = Regex.Replace(headerRowCell.Address, @"[0-9]+", "");//B5 -> B
                        dicColumnNames[cellAddress] = headerRowCell.Text;
                        columnNames.Add(headerRowCell.Text);
                    }
                    #endregion

                    #region Check missing Header Columns
                    var missingColumnNames = new List<string>();
                    foreach (var columnName in model.ColumnNames)
                    {
                        if (!columnNames.Contains(columnName))
                        {
                            missingColumnNames.Add(columnName);
                        }
                    }

                    if (missingColumnNames.Count > 0)
                    {
                        result.MessageColumns += string.Format("* File: {1} -> Missing the columns: {0} <br/>", string.Join(", ", missingColumnNames), fileName);
                        continue;
                    }
                    #endregion

                    #region Data

                    var dataStartRowIndex = 2;
                    for (int rowNum = dataStartRowIndex; rowNum <= ws.Dimension.End.Row; rowNum++)
                    {
                        //FromRow, FromCol, ToRow, ToCol
                        var wsRow = ws.Cells[rowNum, 1, rowNum, endColumn];

                        var item = new MailingReturnSaveItem();
                        foreach (var cell in wsRow)
                        {
                            var cellText = (cell.Text + string.Empty).Trim();
                            if (cellText == string.Empty) continue;

                            var cellAddress = Regex.Replace(cell.Address, @"[0-9]+", "");//B5 -> B

                            string columnName;
                            if (dicColumnNames.TryGetValue(cellAddress, out columnName))
                            {
                                switch (columnName)
                                {
                                    case "Customer#":
                                        item.PersonNr = cellText;
                                        break;
                                    case "MediaCode":
                                        item.MediaCode = cellText;
                                        break;
                                    case "CustomerStatus":
                                        item.IdRepPersonStatus = cellText;
                                        break;
                                    case "BusinessStatus":
                                        item.IdRepPersonBusinessStatus = cellText;
                                        break;
                                }
                            }
                        }//for colunm of each row

                        if (!string.IsNullOrEmpty(item.PersonNr) && !string.IsNullOrEmpty(item.MediaCode) &&
                            (!string.IsNullOrEmpty(item.IdRepPersonStatus) || !string.IsNullOrEmpty(item.IdRepPersonBusinessStatus)))
                        {
                            //item.ImportFileName = fileName;
                            listImport.Add(item);
                        }
                        else//A row must have at least one column with data.
                        if (!string.IsNullOrEmpty(item.PersonNr) || !string.IsNullOrEmpty(item.MediaCode) ||
                            !string.IsNullOrEmpty(item.IdRepPersonStatus) || !string.IsNullOrEmpty(item.IdRepPersonBusinessStatus))
                            listFailedItems.Add(rowNum);
                        //Else: If the whole empty row -> error Empty row
                    }//for

                    if (listFailedItems.Count > 0)
                    {
                        result.NumofRowsInvalid += listFailedItems.Count;
                        //result.MessageRows += string.Format("* File: {1} -> Rows missing values: {0} <br/>", string.Join(", ", listFailedItems), fileName);
                    }
                    #endregion

                    workbook.Dispose();
                    package.Dispose();
                }//ExcelPackage

            }//for

            result.Data = listImport;
            result.NumofRowsValid = listImport.Count;
            result.ImportFileName = string.Join(",", model.FileNames);

            return await Task.FromResult(result);
        }
    }
}
