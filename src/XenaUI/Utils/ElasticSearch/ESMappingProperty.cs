using System.Collections.Generic;
using Nest;

namespace XenaUI.Utils.ElasticSearch
{
    public class ESMappingProperty : IProperty
    {
        IDictionary<string, object> IProperty.LocalMetadata { get; set; }
        public PropertyName Name { get; set; }
        public string Type { get; set; }
        public double? Boost { get; set; }

        public ESQueryType QueryType { get; set; }
        public ESFieldDataType FieldDataType { get; set; }
        string IProperty.Type { get; set; }

        public ESMappingProperty()
        {
        }

        public void SetQueryType(string type)
        {
            switch (type)
            {
                case "keyword":
                    QueryType = ESQueryType.Wildcard;
                    FieldDataType = ESFieldDataType.Keyword;
                    break;
                case "text":
                    QueryType = ESQueryType.QueryString;
                    FieldDataType = ESFieldDataType.Text;
                    break;
                case "term":
                    QueryType = ESQueryType.Term;
                    FieldDataType = ESFieldDataType.Keyword;
                    break;
                case "date":
                    QueryType = ESQueryType.Term;
                    FieldDataType = ESFieldDataType.Date;
                    break;
                case "boolean":
                    QueryType = ESQueryType.Term;
                    FieldDataType = ESFieldDataType.Boolean;
                    break;
                case "long":
                case "integer":
                case "short":
                case "byte":
                case "double":
                case "float":
                case "half_float":
                case "scaled_float":
                    QueryType = ESQueryType.Term;
                    FieldDataType = ESFieldDataType.Numeric;
                    break;
                default:
                    FieldDataType = ESFieldDataType.Text;
                    break;
            }
        }
    }
}
