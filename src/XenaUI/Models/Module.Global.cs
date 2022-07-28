using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace XenaUI.Models
{
    /// <summary>
    /// GlobalModule
    /// </summary>
    public class GlobalModule
    {
        /// <summary>
        /// IdSettingsGUI
        /// </summary>
        public int IdSettingsGUI { get; set; }

        /// <summary>
        /// IdSettingsGUIParent
        /// </summary>
        public int? IdSettingsGUIParent { get; set; }

        /// <summary>
        /// ModuleName
        /// </summary>
        public string ModuleName { get; set; }

        /// <summary>
        /// IconName
        /// </summary>
        public object IconName { get; set; }

        /// <summary>
        /// IconNameOver
        /// </summary>
        public object IconNameOver { get; set; }

        /// <summary>
        /// IsCanNew
        /// </summary>
        public bool IsCanNew { get; set; }

        /// <summary>
        /// IsCanSearch
        /// </summary>
        public bool IsCanSearch { get; set; }

        /// <summary>
        /// ToDisplay
        /// </summary>
        public string ToDisplay { get; set; }

        /// <summary>
        /// Children
        /// </summary>
        public IList<GlobalModule> Children { get; set; }

        /// <summary>
        /// SearchIndexKey
        /// </summary>
        public string SearchIndexKey { get; set; }

        /// <summary>
        /// IsClickable
        /// </summary>
        public bool? IsClickable { get; set; }

        /// <summary>
        /// NumberValue
        /// </summary>
        public string NumberValue { get; set; }
    }

    /// <summary>
    /// ModuleType
    /// </summary>
    public enum ModuleType
    {
        None = 0,
        Administration = 1,
        Customer = 2,
        Article = 3,

        Campaign = 4,
        Campaign_MediaCode = -41,//Custom Enum

        /// <summary>
        /// Business Costs
        /// </summary>
        CampagneCosts = 6,//Business Costs

        OrderDataEntry = 7,
        Statistic = 8,
        Tools = 9,
        Selection = 10,
        Broker = 11,
        CashProvider = 12,
        DesktopProvider = 13,
        FreightProvider = 14,
        Mandant = 15,
        Principal = 16,
        PostProvider = 17,
        PrintProvider = 18,
        Provider = 19,
        ScanCenter = 20,
        ServiceProvider = 21,
        Supplier = 22,
        Warehouse = 23,
        BlockedOrder = 24,
        DataExport = 25,
        Doublette = 26,
        Logistic = 27,
        Orders = 28,
        ReturnRefund = 29,
        Purchase = 30,
        StockCorrection = 31,
        ReminderLogic = 45,
        WarehouseMovement = 32,
        CCPRNManager = 33,
        CheckConfirm = 34,
        TracksSetup = 35,
        MailingData = 46,

        //Selection
        SelectionCampagin = 97,
        SelectionBroker = 98,
        SelectionCollect = 99,
    }

    public class ElasticSearchModule
    {
        /// <summary>
        /// ModuleType
        /// </summary>
        public ModuleType ModuleType { get; set; }

        /// <summary>
        /// PersonType
        /// </summary>
        public PersonTypeMode? PersonType { get; set; }

        /// <summary>
        /// Key to get data from StoreProcedure
        /// </summary>
        public string Object { get; set; }

        /// <summary>
        /// Search Index Name
        /// </summary>
        public string SearchIndexName { get; set; }

        /// <summary>
        /// Default Type Name
        /// </summary>
        public string DefaultTypeName { get; set; }

        /// <summary>
        /// Default Type Name
        /// </summary>
        public string ChildTypeName { get; set; }
    }

    public class ElasticSearchIndexName
    {
        #region Person Modules
        public const string Customer = "customer";
        public const string CustomerFoot = "customerfoot";
        public const string CustomerContact = "customercontact";
        public const string CustomerFootContact = "customerfootcontact";
        public const string Broker = "broker";
        public const string CashProvider = "cashprovider";
        public const string DesktopProvider = "desktopprovider";
        public const string FreightProvider = "freightprovider";
        public const string Mandant = "mandant";
        public const string PostProvider = "postprovider";
        public const string Principal = "principal";
        public const string PrintProvider = "printprovider";
        public const string Provider = "provider";
        public const string ScanCenter = "scancenter";
        public const string ServiceProvider = "serviceprovider";
        public const string Supplier = "supplier";
        public const string Warehouse = "warehouse";
        #endregion

        #region Other Modules
        public const string Orders = "orders";
        public const string ReturnRefund = "returnrefund";
        public const string StockCorrection = "stockcorrection";
        public const string WarehouseMovement = "warehousemovement";
        public const string Article = "article";
        public const string BusinessCosts = "businesscosts";
        public const string Campaign = "campaign";
        public const string CampaignMediaCode = "mediacode";
        #endregion

        #region Selection
        public const string SelectionCampagin = "selectioncampaign";
        public const string SelectionBroker = "selectionbroker";
        public const string SelectionCollect = "selectioncollect";
        #endregion

        public const string Notification = "notification";
    }

    public static class ElasticSearchModuleData
    {
        public static IList<ElasticSearchModule> ListModules;

        static ElasticSearchModuleData()
        {
            ListModules = new List<ElasticSearchModule>();

            #region Person Modules
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Customer,
                PersonType = PersonTypeMode.Customer,
                SearchIndexName = ElasticSearchIndexName.Customer,
                DefaultTypeName = ElasticSearchIndexName.Customer,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Broker,
                PersonType = PersonTypeMode.Broker,
                SearchIndexName = ElasticSearchIndexName.Broker,
                DefaultTypeName = ElasticSearchIndexName.Broker,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.CashProvider,
                PersonType = PersonTypeMode.CashProvider,
                SearchIndexName = ElasticSearchIndexName.CashProvider,
                DefaultTypeName = ElasticSearchIndexName.CashProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.DesktopProvider,
                PersonType = PersonTypeMode.DesktopProvider,
                SearchIndexName = ElasticSearchIndexName.DesktopProvider,
                DefaultTypeName = ElasticSearchIndexName.DesktopProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.FreightProvider,
                PersonType = PersonTypeMode.FreightProvider,
                SearchIndexName = ElasticSearchIndexName.FreightProvider,
                DefaultTypeName = ElasticSearchIndexName.FreightProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Mandant,
                PersonType = PersonTypeMode.Mandant,
                SearchIndexName = "mandant",
                DefaultTypeName = "mandant",
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.PostProvider,
                PersonType = PersonTypeMode.PostProvider,
                SearchIndexName = ElasticSearchIndexName.PostProvider,
                DefaultTypeName = ElasticSearchIndexName.PostProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Principal,
                PersonType = PersonTypeMode.Principal,
                SearchIndexName = ElasticSearchIndexName.Principal,
                DefaultTypeName = ElasticSearchIndexName.Principal,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.PrintProvider,
                PersonType = PersonTypeMode.PrintProvider,
                SearchIndexName = ElasticSearchIndexName.PrintProvider,
                DefaultTypeName = ElasticSearchIndexName.PrintProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Provider,
                PersonType = PersonTypeMode.Provider,
                SearchIndexName = ElasticSearchIndexName.Provider,
                DefaultTypeName = ElasticSearchIndexName.Provider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.ScanCenter,
                PersonType = PersonTypeMode.ScanCenter,
                SearchIndexName = ElasticSearchIndexName.ScanCenter,
                DefaultTypeName = ElasticSearchIndexName.ScanCenter,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.ServiceProvider,
                PersonType = PersonTypeMode.ServiceProvider,
                SearchIndexName = ElasticSearchIndexName.ServiceProvider,
                DefaultTypeName = ElasticSearchIndexName.ServiceProvider,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Supplier,
                PersonType = PersonTypeMode.Supplier,
                SearchIndexName = ElasticSearchIndexName.Supplier,
                DefaultTypeName = ElasticSearchIndexName.Supplier,
                Object = "PersonSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Warehouse,
                PersonType = PersonTypeMode.Warehouse,
                SearchIndexName = ElasticSearchIndexName.Warehouse,
                DefaultTypeName = ElasticSearchIndexName.Warehouse,
                Object = "PersonSearch"
            });
            #endregion

            #region Other Modules
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Orders,
                SearchIndexName = ElasticSearchIndexName.Orders,
                DefaultTypeName = ElasticSearchIndexName.Orders,
                Object = "CustomerOrders"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.ReturnRefund,
                SearchIndexName = ElasticSearchIndexName.ReturnRefund,
                DefaultTypeName = ElasticSearchIndexName.ReturnRefund,
                Object = "ReturnAndRefundSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.StockCorrection,
                SearchIndexName = ElasticSearchIndexName.StockCorrection,
                DefaultTypeName = ElasticSearchIndexName.StockCorrection,
                Object = "WarehouseCorrection"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.WarehouseMovement,
                SearchIndexName = ElasticSearchIndexName.WarehouseMovement,
                DefaultTypeName = ElasticSearchIndexName.WarehouseMovement,
                Object = "WarehouseMovement"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Article,
                SearchIndexName = ElasticSearchIndexName.Article,
                DefaultTypeName = ElasticSearchIndexName.Article,
                Object = "ArticleSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.CampagneCosts,
                SearchIndexName = ElasticSearchIndexName.BusinessCosts,
                DefaultTypeName = ElasticSearchIndexName.BusinessCosts,
                Object = "BusinessCostsSearch"
            });

            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Campaign,
                SearchIndexName = ElasticSearchIndexName.Campaign,
                DefaultTypeName = ElasticSearchIndexName.Campaign,
                Object = "CampaignSearch"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.Campaign_MediaCode,
                SearchIndexName = ElasticSearchIndexName.Campaign,
                DefaultTypeName = ElasticSearchIndexName.Campaign,
                ChildTypeName = ElasticSearchIndexName.CampaignMediaCode,
                Object = "CampaignMediaCodeSearch"
            });

            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.CCPRNManager,//???
                SearchIndexName = "ccprn",
                DefaultTypeName = "ccprn"
            });
            #endregion

            #region Selection Modules
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.SelectionCampagin,
                SearchIndexName = ElasticSearchIndexName.SelectionCampagin,
                DefaultTypeName = ElasticSearchIndexName.SelectionCampagin,
                Object = "Campaign"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.SelectionBroker,
                SearchIndexName = ElasticSearchIndexName.SelectionBroker,
                DefaultTypeName = ElasticSearchIndexName.SelectionBroker,
                Object = "Broker"
            });
            ListModules.Add(new ElasticSearchModule
            {
                ModuleType = ModuleType.SelectionCollect,
                SearchIndexName = ElasticSearchIndexName.SelectionCollect,
                DefaultTypeName = ElasticSearchIndexName.SelectionCollect,
                Object = "Collect"
            });
            #endregion
        }

        public static ElasticSearchModule GetModule(ModuleType type)
        {
            return ListModules.FirstOrDefault(n => n.ModuleType == type);
        }

        public static ElasticSearchModule GetModule(string searchIndexName)
        {
            return ListModules.FirstOrDefault(n => n.SearchIndexName == searchIndexName);
        }
    }
}
