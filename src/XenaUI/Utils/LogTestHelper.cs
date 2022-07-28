using System.Text;

namespace XenaUI.Utils
{
    public class LogTestHelper
    {
        public bool Enabled { get; set; }
        public string FullFileName { get; set; }
        public StringBuilder Log { get; set; }

        public LogTestHelper()
        {
            Log = new StringBuilder();
        }

        public void AppendLog(string log)
        {
            if (!Enabled) return;

            Log.Append(log);
            //Log.AppendLine();
        }

        public void WriteLog()
        {
            if (!Enabled) return;

            Log.AppendLine("=========================");
            var filePath = string.IsNullOrEmpty(FullFileName) ? @"C:\inetpub\wwwroot\XenaDev_TraceLog\logTime.txt" : FullFileName;
            System.IO.File.AppendAllText(filePath, Log.ToString());

            Log = new StringBuilder();
        }
    }
}
