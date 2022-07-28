using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Dynamic;
using XenaUI.Constants;
using System.Reflection;
using System;
using System.Globalization;

namespace XenaUI.Business
{
    public class OrderFailedBusiness : BaseBusiness, IOrderFailedBusiness
    {
        private readonly IPathProvider _pathProvider;
        public OrderFailedBusiness(IHttpContextAccessor context, IPathProvider pathProvider) : base(context)
        {
            _pathProvider = pathProvider;
        }

        /// <summary>
        /// Get Order by IdScansContainerItems
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        public async Task<object> GetOrder(string tabID, string idScansContainerItems)
        {
            var fullFolderPath = GetFullUploadFolderPath(tabID);
            var fullFileName = Path.Combine(fullFolderPath, idScansContainerItems + ".txt");

            if (File.Exists(fullFileName))
            {
                return File.ReadAllText(fullFileName, Encoding.Unicode);
            }

            return await Task.FromResult(string.Empty);
        }

        /// <summary>
        /// Save Order
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task SaveOrder(OrderFailedSaveModel model)
        {
            model.IdLogin = ServiceDataRequest.IdLogin;

            if (string.IsNullOrEmpty(model.CreateDate))
                model.CreateDate = DateTime.Now.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture);

            var fullFolderPath = GetFullUploadFolderPath(model.TabID);

            #region 1. Save file IdScansContainerItems.txt
            var fullFileName = Path.Combine(fullFolderPath, model.IdScansContainerItems + ".txt");
            var content = JsonConvert.SerializeObject(model, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            File.WriteAllText(fullFileName, content, Encoding.Unicode);
            #endregion

            #region 2. Save File ParkekItems.txt: this is summary file, it contains all items
            var parkekItemsFullFileName = Path.Combine(fullFolderPath, "ParkekItems.txt");
            var parkekItemsContent = "";
            if (File.Exists(parkekItemsFullFileName))
            {
                parkekItemsContent = File.ReadAllText(parkekItemsFullFileName, Encoding.Unicode);
            }

            var parkedItems = JsonConvert.DeserializeObject<List<OrderFailedParkedItem>>(parkekItemsContent) ?? new List<OrderFailedParkedItem>();
            var parkedItem = parkedItems.FirstOrDefault(n => n.Key == model.IdScansContainerItems);
            if (parkedItem == null)
            {
                parkedItem = new OrderFailedParkedItem();
                parkedItems.Add(parkedItem);
            }

            parkedItem.Key = model.IdScansContainerItems;
            parkedItem.Ticks = DateTime.Now.Ticks;
            parkedItem.Data = model.GetParkedItemData();

            parkekItemsContent = JsonConvert.SerializeObject(parkedItems, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            File.WriteAllText(parkekItemsFullFileName, parkekItemsContent, Encoding.Unicode);
            #endregion

            await Task.FromResult(true);
        }

        /// <summary>
        /// Delete Order by IdScansContainerItems
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="idScansContainerItems"></param>
        /// <returns></returns>
        public async Task DeleteOrder(string tabID, string idScansContainerItems)
        {
            var fullFolderPath = GetFullUploadFolderPath(tabID);

            #region 1. Delete file IdScansContainerItems.txt
            var fullFileName = Path.Combine(fullFolderPath, idScansContainerItems + ".txt");
            if (File.Exists(fullFileName))
            {
                File.SetAttributes(fullFileName, FileAttributes.Normal);
                File.Delete(fullFileName);
            }
            #endregion

            #region 2. Delete item in File ParkekItems.txt
            var parkekItemsFullFileName = Path.Combine(fullFolderPath, "ParkekItems.txt");
            var parkekItemsContent = "";
            if (File.Exists(parkekItemsFullFileName))
            {
                parkekItemsContent = File.ReadAllText(parkekItemsFullFileName, Encoding.Unicode);
            }

            var parkedItems = JsonConvert.DeserializeObject<List<OrderFailedParkedItem>>(parkekItemsContent) ?? new List<OrderFailedParkedItem>();
            var parkedItem = parkedItems.FirstOrDefault(n => n.Key == idScansContainerItems);
            if (parkedItem != null)
            {
                parkedItems.Remove(parkedItem);
                parkekItemsContent = JsonConvert.SerializeObject(parkedItems, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                File.WriteAllText(parkekItemsFullFileName, parkekItemsContent, Encoding.Unicode);
            }
            #endregion

            await Task.FromResult(true);
        }

        /// <summary>
        /// Delete All Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <returns></returns>
        public async Task DeleteAllOrders(string tabID)
        {
            var fullFolderPath = GetFullUploadFolderPath(tabID);

            //Delete All files IdScansContainerItems.txt
            if (Directory.Exists(fullFolderPath))
            {
                var dir = new DirectoryInfo(fullFolderPath);
                dir.Attributes = dir.Attributes & ~FileAttributes.ReadOnly;
                dir.Delete(true);
            }

            await Task.FromResult(true);
        }

        /// <summary>
        /// Get List of Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<object> GetListOrders(string tabID, int pageIndex = 0, int pageSize = 20)
        {
            pageIndex = pageIndex < 0 ? 0 : pageIndex;

            var fullFolderPath = GetFullUploadFolderPath(tabID);

            if (Directory.Exists(fullFolderPath))
            {
                string[] dirs = Directory.GetFiles(fullFolderPath, "*.txt")
                                .OrderByDescending(f => new FileInfo(f).LastWriteTime)
                                .Skip(pageSize * (pageIndex - 1))
                                .Take(pageSize).ToArray();

                if (dirs.Length > 0)
                {
                    var parkedItemsData = new List<OrderFailedParkedItemData>();
                    foreach (string fullFileName in dirs)
                    {
                        string content = File.ReadAllText(fullFileName, Encoding.Unicode);
                        if (!string.IsNullOrEmpty(content))
                        {
                            var parkedItem = JsonConvert.DeserializeObject<OrderFailedParkedItemData>(content);
                            parkedItemsData.Add(parkedItem);
                        }
                    }

                    dynamic dataModel = CreateParkedItems(parkedItemsData);
                    return await Task.FromResult(dataModel);
                }
            }

            return await Task.FromResult(string.Empty);
        }

        /// <summary>
        /// Get List of ParkedItem Orders
        /// </summary>
        /// <param name="tabID"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<object> GetListParkedItemOrders(string tabID, int pageIndex = 0, int pageSize = 20)
        {
            pageIndex = pageIndex < 0 ? 0 : pageIndex;

            var fullFolderPath = GetFullUploadFolderPath(tabID);

            var parkekItemsFullFileName = Path.Combine(fullFolderPath, "ParkekItems.txt");
            if (File.Exists(parkekItemsFullFileName))
            {
                var parkekItemsContent = File.ReadAllText(parkekItemsFullFileName, Encoding.Unicode);
                if (!string.IsNullOrEmpty(parkekItemsContent))
                {
                    var parkedItems = JsonConvert.DeserializeObject<List<OrderFailedParkedItem>>(parkekItemsContent) ?? new List<OrderFailedParkedItem>();
                    if (parkedItems != null && parkedItems.Count > 0)
                    {
                        var parkedItemsData = parkedItems.OrderByDescending(n => n.Ticks).Select(n => n.Data).ToList();

                        dynamic dataModel = CreateParkedItems(parkedItemsData);

                        return await Task.FromResult(dataModel);
                    }
                }
            }

            return await Task.FromResult(string.Empty);
        }

        #region Private
        private string GetFullUploadFolderPath(string tabID)
        {
            var subFolder = string.Format("{0}\\{1}", tabID, ServiceDataRequest.IdLogin);
            var fullFolderPath = _pathProvider.GetFullUploadFolderPath(UploadMode.ODEFailed, subFolder);
            return fullFolderPath;
        }

        private object CreateParkedItems(List<OrderFailedParkedItemData> parkedItems)
        {
            dynamic dataModel = new ExpandoObject();
            dataModel.keyName = "IdScansContainerItems";
            dataModel.parkedItemKey = "IdScansContainerItems";

            var list = new List<object>();
            foreach (var parkedItem in parkedItems)
            {
                var model = CreateParkedItemData(parkedItem);
                list.Add(model);
            }

            dataModel.collectionParkedtems = list;

            return dataModel;
        }

        private Dictionary<string, object> CreateParkedItemData(OrderFailedParkedItemData parkedItem)
        {
            /*
                "articleNr": {
                    "displayValue": "ArticleNr",
                    "value": "875600",
                    "originalComlumnName": "ArticleNr"
                }
                */

            Dictionary<string, object> model = new Dictionary<string, object>();
            foreach (PropertyInfo prop in parkedItem.GetType().GetProperties())
            {
                var originalPropName = prop.Name;
                Dictionary<string, string> modelValue = new Dictionary<string, string>();
                modelValue[ConstNameSpace.ModelPropertyDisplayValue] = originalPropName;
                modelValue[ConstNameSpace.ModelPropertyOriginalColumnName] = originalPropName;
                modelValue[ConstNameSpace.ModelPropertyValue] = prop.GetValue(parkedItem) + string.Empty;

                model[ConverterUtils.FirstCharacterToLower(originalPropName)] = modelValue;
            }

            return model;
        }
        #endregion
    }
}
