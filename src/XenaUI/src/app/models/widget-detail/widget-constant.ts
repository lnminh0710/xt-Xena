export enum WidgetType {
  None = 0,
  FieldSet = 1,
  DataGrid = 2,
  EditableGrid = 3,
  EditableTable = 4,
  Combination = 5, // combination of FieldSet + EditableTable
  CombinationCreditCard = 6, // combination of FieldSet and CreditCard,
  GroupTable = 8,
  Country = 9,
  Upload = 10,
  TreeView = 11,
  FileExplorer = 12,
  OrderDataEntry = 13,
  FieldSetReadonly = 16,
  Translation = 17,
  CustomerHistory = 18,
  ReturnRefund = 19,
  TableWithFilter = 20,
  SystemManagement = 21,
  Doublette = 22,
  EditableRoleTreeGrid = 23,
  BlankWidget = 24,
  FileExplorerWithLabel = 25,
  FileTemplate = 27,
  DateFilterCondition = 28,
  ToolFileTemplate = 29,
  ArticleTemplateUpload = 30,
  SynchronizeElasticsSearch = 32,
  CountrySelection = 121,
  DoubleGrid = 122,
  TripleGrid = 123,
  Chart = 33,
  PdfViewer = 34,
  ExportBlockedCustomer = 35,
  ImageGallery = 36,
  EditPaymentType = 37,
  SAVLetter = 38,
  SAVSendLetter = 39,
  NoteForm = 40,
  OpenInvoiceStatus = 172,
}

export enum WidgetKeyType {
  None = 0,
  Main = 1,
  Sub = 2,
}

export class WidgetConstant {
  static WidgetTypeIdCommon: any[] = [
    WidgetType.Combination,
    WidgetType.CombinationCreditCard,
    WidgetType.EditableGrid,
    WidgetType.ReturnRefund,
    // WidgetType.EditableTable,
    WidgetType.TableWithFilter,
    WidgetType.FileExplorer,
    WidgetType.ToolFileTemplate,
    WidgetType.EditableRoleTreeGrid,
    WidgetType.FileExplorerWithLabel,
  ];

  static WidgetTypeIdAllowWidgetInfoTranslation: any[] = [
    ...WidgetConstant.WidgetTypeIdCommon,
    ...[WidgetType.FieldSet, WidgetType.DataGrid],
  ];

  static WidgetTypeIdUpdateProperty: any[] = [
    ...WidgetConstant.WidgetTypeIdCommon,
    ...[WidgetType.Translation, WidgetType.CustomerHistory],
  ];
}
