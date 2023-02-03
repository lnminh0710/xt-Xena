using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace XenaUI.Utils
{
    public class WSReturn
    {
        private int? _returnID = -1;
        /// <summary>
        /// ReturnID
        /// </summary>
        public int? ReturnValue { get { return _returnID; } set { if (value != null) _returnID = value; } }

        /// <summary>
        /// SQLMessage
        /// </summary>
        [JsonProperty(PropertyName = "SQL Message")]
        public string SQLMessage { get; set; }

        /// <summary>
        /// Message
        /// </summary>
        public string Message { get; set; }

        public bool SqlMessageContains(params string[] messages)
        {
            if (SQLMessage != null)
                return messages.Any(SQLMessage.Contains);

            if (Message != null)
                return messages.Any(Message.Contains);

            return false;
        }

        public bool MessageContains(params string[] messages)
        {
            if (Message != null)
                return messages.Any(Message.Contains);

            if (SQLMessage != null)
                return messages.Any(SQLMessage.Contains);

            return false;
        }
    }

    public class WSDataReturn
    {
        /// <summary>
        /// Data
        /// </summary>
        public JArray Data { get; set; }
    }

    public class WSCustomerEditReturn
    {
        /// <summary>
        /// IdPerson
        /// </summary>
        public string IdPerson { get; set; }

        /// <summary>
        /// StoredName
        /// </summary>
        public string StoredName { get; set; }

        /// <summary>
        /// Message
        /// </summary>
        public string EventType { get; set; }
    }

    public class WSContactEditReturn
    {
        private string _returnID = "";
        /// <summary>
        /// ReturnID
        /// </summary>
        public string ReturnID
        {
            get
            {
                return _returnID;
            }

            set
            {
                if (!string.IsNullOrEmpty(value))
                    _returnID = value;
            }
        }

        /// <summary>
        /// StoredName
        /// </summary>
        public string StoredName { get; set; }

        /// <summary>
        /// Message
        /// </summary>
        public string EventType { get; set; }
    }

    public class WSEditReturn
    {

        private string _returnID = "";
        /// <summary>
        /// ReturnID
        /// </summary>
        public string ReturnID
        {
            get
            {
                return _returnID;
            }
            set
            {
                if (!string.IsNullOrEmpty(value))
                    _returnID = value;
            }
        }

        private string _idBusinessCosts = "";
        /// <summary>
        /// _idBusinessCosts
        /// </summary>
        public string IdBusinessCosts
        {
            get
            {
                return _idBusinessCosts;
            }
            set
            {
                if (!string.IsNullOrEmpty(value))
                    _idBusinessCosts = value;
            }
        }

        /// <summary>
        /// StoredName
        /// </summary>
        public string StoredName { get; set; }

        /// <summary>
        /// Message 
        /// </summary>
        public string EventType { get; set; }

        /// <summary>
        /// SQLStoredMessage
        /// </summary>
        public string SQLStoredMessage { get; set; }

        public bool IsSuccess
        {
            get
            {
                return EventType == "Successfully";
            }
        }

        public string IdGenerateLetter { get; set; }

        public object resultShipment { get; set; }
    }

    public class WSDataReturnValue
    {
        public string ReturnID { get; set; }
        public string IdBusinessCosts { get; set; }
        public string StoredName { get; set; }

        /// <summary>
        /// Message 
        /// </summary>
        public string EventType { get; set; }

        /// <summary>
        /// SQLStoredMessage
        /// </summary>
        public string SQLStoredMessage { get; set; }

        public string TableName { get; set; }

        public bool IsSuccess
        {
            get
            {
                return EventType == "Successfully";
            }
        }
    }
}
