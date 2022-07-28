namespace XenaUI.Constants
{
    public static class ConstAuth
    {
        public static string AppSettings_OAuthSecretKey = "AppSettings:OAuthSecretKey";
        public static string TokenType = "Bearer";
        public static string UserRoleKey = "UserRole";
        public static string RoleKey = "Role";
        public static string RoleAdminKey = "Admin";
        public static string AppInfoKey = "appinfo";
        public static string NewSecretKey = "new_secret_key";
        public static string IsResetPassword = "isResetPassword";
        public static string IsRefreshToken = "isRefreshToken";

        public static string LogTimeXenaAPI = "X-ElapsedTime-XenaAPI";
        public static string LogTimeUniqueService = "X-ElapsedTime-UniqueService";
        public static string LogTimeXenaMapping = "X-ElapsedTime-XenaMapping";
    }

    public static class ConstNameSpace
    {
        public static string ModelProperty = "XenaUI.Models.Property";
        public static string ModelNameSpace = "XenaUI.Models";
        public static string ModelPropertyValue = "value";
        public static string ModelPropertyDisplayValue = "displayValue";
        public static string ModelPropertyOriginalColumnName = "originalComlumnName";
        public static string ModelPropertySetting = "setting";
        public static string TabSummaryInfor = "TabSummaryInfor";
        public static string TabSummaryData = "TabSummaryData";
        public static string ComboBox = "ComboBox";
        public static string ColumnName = "ColumnName";
        public static string DataType = "DataType";
        public static string Setting = "Setting";
        public static string ColumnSettings = "ColumnSettings";
        public static string DataLength = "DataLength";
        public static string OriginalColumnName = "OriginalColumnName";
        public static string CollectionData = "CollectionData";
        public static string WidgetTitle = "WidgetTitle";
        public static string Data = "Data";
        public static string IdValue = "idValue";
        public static string TextValue = "textValue";
        public static string IsoCode = "isoCode";
        public static string IsMain = "isMain";
        public static string IsActive = "isActive";
        public static string IdSalesCampaignWizardItems = "idSalesCampaignWizardItems";
        public static string IdBusinessCostsItems = "idBusinessCostsItems";
        public static string IdBusinessCostsItemsCountries = "idBusinessCostsItemsCountries";
        public static string DynamicColumn = "DynamicColumn";
    }

    public static class ConstWidgetReplaceToken
    {
        public static string LoginInfoToken = "<<LoginInformation>>";
        public static string FilterToken = "<<InputParameter>>";
        public static string ModeToken = "<<Mode>>";
        public static string ListenKey = "<<ListenKey>>";
    }

    public enum EAuthMessageType
    {
        ExpiredSoon = 1, // just warning
        Expired,// not allow
        Denied// not allow
    }

    public enum EComboBoxType
    {
        Language = 1,
        Title = 2,
        CountryCode = 3,
        CustomerStatus = 4,
        POBox = 5,
        ContactType = 6,
        TitleOfCourtesy = 7,
        CommunicationTypeType = 8,
        CreditCardType = 9,
        CashProviderType = 10,
        Principal = 11,
        Mandant = 12,
        Currency = 13,
        ProviderCostType = 14,
        PaymentType = 15,
        IdentifierCode = 16,
        ArticleStatus = 17,
        AllMandant = 18,
        ServiceProvider = 19,
        WareHouse = 20,
        CampaignWizardAddress = 21,
        CampaignGroup = 22,
        CampaignNamePrefix = 23,
        CurrencyByCountry = 24,
        CurrencyByWizardItems = 25,
        InvoicePaymentType = 26,
        DataEntryLots = 27,
        VAT = 28,
        WidgetType = 29,
        ModuleItems = 30,
        PersonType = 31,
        GetLetterType = 32,
    }

    public enum EIdRepWidgetType
    {
        DataSet = 1,
        DataGrid = 2,
        EditableDataGrid = 3,
        EditableTable = 4,
        Combination = 5,
        CombinationType2 = 6,
        GroupTable = 8,
        TreeCategoriesTable = 11,
        FileExplorer = 12,
        TableWithFilter = 20,
        ToolsFileTemplate = 29
    }

    public enum EExecuteMappingType
    {
        None,
        Normal,

        /// <summary>
        /// [[{\"ColumnName\":\"PersonNr,LastName,FirstName,COName,...\"}],[],[{\"PersonNr\":\"3010099103\",\"Last-Name\":\"Schneiter\",...},{...}]]
        /// </summary>
        Dynamic,

        DynamicType2,

        /// <summary>
        /// [[{\"WidgetTitle\":\"New Title....\"}],[{\"ColumnName\":\"IdPerson\",\"Value\":\"\",\"DataType\":\"bigint\",\"DataLength\":\"0\",\"OriginalColumnName\":\"B00Person_IdPerson\", \"Setting\":\"\"},...}]]
        /// </summary>
        DynamicType3,

        /// <summary>
        /// { "Data": "[[{\"SettingColumnName\":\"[{\\\"WidgetTitle\\\":\\\"Begin new World...\\\"},{\\\"ColumnsName\\\": [\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t   {\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\\"ColumnName\\\":........
        /// </summary>
        DynamicType4,

        /// <summary>
        /// combineation of Dataset and table
        /// </summary>
        DynamicType5,

        /// <summary>
        /// DynamicCoulumnsType
        /// </summary>
        DynamicCoulumnsType,

        TabSummary,
        ComboBox,
        Country,
        Country2,
        CreatePerson,
        OnlyReplaceAllEmtyObjectJson,
        OriginalString,
    }

    public enum EGetPageSettingType
    {
        ById = 1,
        ObjectNr = 2
    }
}
