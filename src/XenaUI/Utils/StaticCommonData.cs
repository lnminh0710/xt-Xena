using System;
using System.Collections.Generic;
using System.Linq;
using XenaUI.Models;
using XenaUI.Utils.ElasticSearch;

namespace XenaUI.Utils
{
    public interface IStaticCommonData
    {
        void SetESIgnoredFields(IList<GlobalSettingModel> globalSettings);
    }

    public class StaticCommonData : IStaticCommonData
    {
        public void SetESIgnoredFields(IList<GlobalSettingModel> globalSettings)
        {
            //if (ElasticSearchClientHelper.ESIgnoredFields != null && ElasticSearchClientHelper.ESIgnoredFields.Count > 0) return;

            var globalSetting = globalSettings.FirstOrDefault(n => n.GlobalType == "ESIgnoredFields");
            if (globalSetting != null)
            {
                var ESIgnoredFields = (globalSetting.JsonSettings + string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries).Select(n => n.ToLower()).ToList();
                ElasticSearchClientHelper.ESIgnoredFields = ESIgnoredFields;
            }
        }
    }
}
