namespace XenaUI.Utils.ElasticSearch
{
    public class ESSearchFieldBasic
    {
        /// <summary>
        /// FieldName
        /// - firstName.keyword: .keyword only used for Wildcard
        /// </summary>
        public string FieldName { get; set; }
        public string FieldValue { get; set; }

        /// <summary>
        /// Used to create QueryContainer List for Fields
        /// - Term, QueryString, Wildcard
        /// </summary>
        public ESQueryType QueryType { get; set; }

        /// <summary>
        /// Text, Keyword, Boolean, Numeric, Date
        /// </summary>
        public ESFieldDataType? FieldDataType { get; set; }

        public double? Boost { get; set; }

        public bool IsIgnoreSearch { get; set; }

        public void Build()
        {
            try
            {
                if (FieldDataType.HasValue)
                {
                    switch (FieldDataType.Value)
                    {
                        case ESFieldDataType.Numeric:
                            var isNumeric = ConverterUtils.IsNumeric(FieldValue, out double n);
                            if (isNumeric != true) IsIgnoreSearch = true;
                            break;
                        case ESFieldDataType.Boolean:
                            var isBool = bool.TryParse(FieldValue, out bool b);
                            if (isBool != true) IsIgnoreSearch = true;
                            break;
                    }
                }
            }
            catch { }
        }
    }
}
