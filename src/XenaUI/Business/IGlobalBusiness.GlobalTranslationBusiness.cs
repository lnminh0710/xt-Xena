using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using XenaUI.Utils.ElasticSearch;

namespace XenaUI.Business
{
    public partial class GlobalBusiness : BaseBusiness, IGlobalBusiness
    {
        public async Task<object> GetCommonTranslateLabelText()
        {
            TranslateLabelGetData data = (TranslateLabelGetData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateLabelGetData));
            data.IdRepTranslateModuleType = "5";
            data.Mode = "GetAll";
            return await _globalService.GetCommonTranslateLabelText(data);
        }

        public async Task<object> GetMultiTranslateLabelText(string originalText, string widgetMainID, string widgetCloneID, string idRepTranslateModuleType, string idTable, string fieldName, string tableName)
        {
            TranslateLabelGetData data = (TranslateLabelGetData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateLabelGetData));
            data.OriginalText = originalText;
            data.WidgetMainID = widgetMainID;
            data.WidgetCloneID = widgetCloneID;
            data.IdRepTranslateModuleType = idRepTranslateModuleType;
            data.IdTable = idTable;
            data.FieldName = fieldName;
            data.TableName = tableName;
            return await _globalService.GetMultiTranslateLabelText(data);
        }

        public async Task<WSDataReturn> GetTranslateLabelText(string originalText, string widgetMainID, string widgetCloneID, string idRepTranslateModuleType, string idTable, string fieldName, string tableName)
        {
            TranslateLabelGetData data = (TranslateLabelGetData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateLabelGetData));
            data.OriginalText = originalText;
            data.WidgetMainID = widgetMainID;
            data.WidgetCloneID = widgetCloneID;
            data.IdRepTranslateModuleType = idRepTranslateModuleType;
            data.IdTable = idTable;
            data.FieldName = fieldName;
            data.TableName = tableName;
            var result = await _globalService.GetTranslateLabelText(data);
            return result;
        }

        public async Task<object> GetSystemTranslateText()
        {
            TranslateLabelGetData data = (TranslateLabelGetData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateLabelGetData));
            var result = await _globalService.GetSystemTranslateText(data);
            return result;
        }

        public async Task<WSEditReturn> SaveTranslateLabelText(TranslationModel model)
        {
            TranslateLabelSaveData data =
                (TranslateLabelSaveData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateLabelSaveData));
            if (model.Translations != null && model.Translations.Count > 0)
            {
                string modelValue = JsonConvert.SerializeObject(model.Translations, new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });
                data.JSONText = string.Format(@"""TranslateLabelText"":{0}", modelValue);
                data.JSONText = "{" + data.JSONText + "}";
                var result = await _globalService.SaveTranslateLabelText(data);
                return result;
            }
            return new WSEditReturn();
        }

        public async Task<WSDataReturn> GetTranslateText(string widgetMainID, string widgetCloneID, string fields)
        {
            TranslateTextGetData data = (TranslateTextGetData)ServiceDataRequest.ConvertToRelatedType(typeof(TranslateTextGetData));
            data.WidgetMainID = widgetMainID;
            data.WidgetCloneID = widgetCloneID;
            data.IdRepLanguage = UserFromService.Language;
            data.Fields = fields;
            var result = await _globalService.GetTranslateText(data);
            return result;
        }
    }
}
