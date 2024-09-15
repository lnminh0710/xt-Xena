import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class Configuration {
  public static PublicSettings: any = {};

  public maxSizeLimit = 2097152000; // 2000Mb
  public imageMaxSizeLimit = 3145728; // 3Mb

  public localStorageCurrentUser = 'currentUser';
  public userRememberKey = '502bc647-e2f3-4bfd-8317-76d859f59403';
  public localStorageCurrentUserExpire = 'currentUserExpire';
  public localStorageAuthorization = 'Authorization';
  public localStorageAccessToken = 'accessToken';
  public localStorageRefreshToken = 'refreshToken';
  public localStorageExpiresIn = 'expiresIn';
  public localStorageLastUserPicture = 'lastUserPicture';
  public localStorageDefaultRole = 'defaultRole';

  public rootUrl = '/';
  public homeUrl = '/index';
  public static rootPrivateUrl = '/module';

  // PublicUrl
  public static rootPublicUrl = '/auth';
  public loginUrl = Configuration.rootPublicUrl + '/login';
  public accountDenied = Configuration.rootPublicUrl + '/accountdenied';
  public accountExpireUrl = Configuration.rootPublicUrl + '/accountexpire';
  public accountExpireThankUrl = Configuration.rootPublicUrl + '/expirethank';
  public forgotpasswordUrl = Configuration.rootPublicUrl + '/forgotpassword';

  // Api URL
  public refreshTokenUrl = '/api/authenticate/RefreshToken';

  // URL parameters
  public urlPramToken = 'accesstoken';
  public urlPramLoginName = 'loginName';
  public updateSuccess = 'Successfully';
  public updateFailed = 'Failed';

  // common
  public tokenType = 'Bearer';
  public passwordPath =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\{\}\|\\\:\;\"\'\<\,\>\.\?\/])[A-Za-z\d\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\{\}\|\\\:\;\"\'\<\,\>\.\?\/]{8,}/;
  public avoidPropetyRemoveText = 'xenapr_';
  public defaultCountDownTime = 5000; // unit: minute
  public static pageSize = 50; // grid page size default
  public static pageIndex = 1; // grid page index default
  public remainCountDownTime = 30; // unit: second
  public emptyGuid = '00000000-0000-0000-0000-000000000000';
  public defaultMainTabId = 'MainInfo';
  public defaultMainTabName = 'Main Overview';
  public expiredTokenOffsetSeconds = 600;
  public valueChangeDeboundTimeDefault = 500;
  public noteLengthDefault = 500;
  public enableTimeTraceLog = false;
  public static enableCheckDedupe = false;
  public textEditorFont = [
    {
      import: 'formats/font',
      whitelist: [
        'arial',
        'arialblack',
        'calibri',
        'comicsansms',
        'georgia',
        'helvetica',
        'lucidasansunicode',
        'portableuserinterface',
        'timenewroman',
        'trebuchetms',
        'verdana',
        'tahoma',
      ],
    },
  ];
  public paymentTypeData = [
    {
      paymentTypeText: 'Cash',
      paymentTypeId: 1,
      postageCosts: 1,
      paymentTypeGroup: 1,
    },
    {
      paymentTypeText: 'Cheque',
      paymentTypeId: 2,
      postageCosts: 2,
      paymentTypeGroup: 2,
    },
    {
      paymentTypeText: 'Credit Card',
      paymentTypeId: 3,
      postageCosts: 3,
      paymentTypeGroup: 3,
    },
  ];
  public popupResizeClassName = 'xn-p-dialog-resizable';
  public classXnTabGeneral = 'xn-tab--general';
  public classCampaignCodeDialog = 'campaign-code-dialog';
  public popupFullHeightClassName = 'xn-common-dialog--full-height';
  public popupFullViewClassName = 'xn-common-dialog-full-view';
  public widgetTitleTranslateFieldName = 'widgetTitleTranslate';
  public dateFormatInDataBase = 'MM/dd/yyyy';
  public printingUploadTemplateFolderName = 'Templates';
  public wordExtesion = '.doc, .docx, .dot, .dotx';
  public campaignExtension = '.doc, .docx, .dot, .dotx, .xlsx, .xls';
  public imageExtesion = '.jpg, .jpeg, .png, .gif';
  public widgetDotNotAddThisFilter = 'do no add this filter';

  public keyCode = {
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
  };
}

@Injectable()
export class ServiceUrl {
  public apiUrl = environment.apiEndpoint + '/api/';

  // User Control Api URL
  public serviceAuthenticateUrl = environment.apiEndpoint + '/api/authenticate';
  public serviceForgotPasswordUrl =
    this.serviceAuthenticateUrl + '/resetpassword';
  public serviceUpdatePasswordUrl =
    this.serviceAuthenticateUrl + '/updatepassword';
  public serviceSendNotificationUrl =
    this.serviceAuthenticateUrl + '/SendNotification';
  public checkTokenUrl = this.serviceAuthenticateUrl + '/CheckToken';
  public loginByUserIdUrl = this.serviceAuthenticateUrl + '/LoginByUserId';

  public globalSearch = this.apiUrl + 'Search/';
  public globalSearchGetAllModules = this.globalSearch + 'GetAllModules';
  public globalSearchGetSearchSummary = this.globalSearch + 'GetSearchSummary';

  public elasticSearch = this.apiUrl + 'ElSearch/';
  public elasticSearchSearchSummary = this.elasticSearch + 'GetSearchSummary';
  public elasticSearchSearchDetail = this.elasticSearch + 'SearchDetail';
  public elasticSearchSearchByField = this.elasticSearch + 'SearchByField';
  public elasticSearchDetailAdvance =
    this.elasticSearch + 'SearchDetailAdvance';
  public elasticSearchCustomerDoublet =
    this.elasticSearch + 'SearchCustomerDoublet';
  public elasticGetColumnSetting = this.elasticSearch + 'GetColumnSetting';

  public parkedItem = this.apiUrl + 'parkeditem/';
  public serviceGetParkedItemMenuUrl = this.parkedItem + 'GetParkedItemMenu';
  public serviceGetListParkedItemByModuleUrl =
    this.parkedItem + 'GetListParkedItemByModule';
  public serviceGetParkedItemByIdUrl = this.parkedItem + 'GetParkedItemById';
  public serviceSaveParkedItemByModuleUrl =
    this.parkedItem + 'SaveParkedItemByModule';
  public serviceSaveParkedMenuItemUrl = this.parkedItem + 'SaveParkedMenuItem';

  public common = this.apiUrl + 'common/';
  public getAllSearchModules = this.common + 'GetAllSearchModules';
  public getModules = this.common + 'getModules';
  public getDetailSubModule = this.common + 'getdetailsubmodule';
  public getTabSummaryInfor = this.common + 'GetTabSummaryInfor';
  public getModuleSetting = this.common + 'GetModuleSetting';
  public getSettingModule = this.common + 'GetSettingModules';
  public getComboxBoxList = this.common + 'GetComboBoxInfo';
  public getModuleToPersonType = this.common + 'GetModuleToPersonType';
  public createContact = this.common + 'createContact';
  public updateContact = this.common + 'updateContact';
  public getPublicSetting = this.common + 'GetPublicSetting';
  public getDynamicRulesType = this.common + 'GetDynamicRulesType';
  public sendEmail = this.common + 'SendEmail';
  public matchingCustomerData = this.common + 'MatchingCustomerData';
  public sendEmailWithImageAttached =
    this.common + 'SendEmailWithImageAttached';
  public getMainLanguages = this.common + 'GetMainLanguages';
  public serviceUpdateSettingsModuleUrl = this.common + 'UpdateSettingsModule';
  public getCustomerColumnsSetting = this.common + 'GetCustomerColumnsSetting';
  public getCountryGroup = this.common + 'GetCountryGroup';
  public saveCountryGroup = this.common + 'SaveCountryGroup';
  public getWidgetAppById = this.common + 'GetWidgetAppById';
  public updateWidgetApp = this.common + 'UpdateWidgetApp';
  public createQueue = this.common + 'CreateQueue';
  public deleteQueues = this.common + 'DeleteQueues';
  public getImageGalleryFolder = this.common + 'GetImageGalleryFolder';
  public getImagesByFolderId = this.common + 'GetImagesByFolderId';
  public savingSharingTreeGroups = this.common + 'SavingSharingTreeGroups';
  public editImagesGallery = this.common + 'EditImagesGallery';

  public globalSetting = this.apiUrl + 'GlobalSetting/';
  public getAllGlobalSettings = this.globalSetting + 'GetAllGlobalSettings';
  public getAdvanceSearchProfile =
    this.globalSetting + 'GetAdvanceSearchProfile';
  public GetGlobalSettingById = this.globalSetting + 'GetGlobalSettingById';
  public DeleteGlobalSettingById =
    this.globalSetting + 'DeleteGlobalSettingById';
  public SaveGlobalSetting = this.globalSetting + 'SaveGlobalSetting';
  public getMultiTranslateLabelText =
    this.globalSetting + 'getMultiTranslateLabelText';
  public getTranslateLabelText = this.globalSetting + 'GetTranslateLabelText';
  public saveTranslateLabelText = this.globalSetting + 'SaveTranslateLabelText';
  public getTranslateText = this.globalSetting + 'GetTranslateText';
  public getCommonTranslateLabelText =
    this.globalSetting + 'GetCommonTranslateLabelText';
  public getSystemTranslateText = this.globalSetting + 'getSystemTranslateText';

  public widget = this.apiUrl + 'widget/';
  public getAllWidgetTemplateByModuleId =
    this.widget + 'GetAllWidgetTemplateByModuleId';
  public getWidgetDetailByRequestString =
    this.widget + 'GetWidgetDetailByRequestString';
  public updateWidgetInfo = this.widget + 'UpdateWidgetInfo';
  public createWidgetSetting = this.widget + 'CreateWidgetSetting';
  public updateWidgetSetting = this.widget + 'UpdateWidgetSetting';
  public deleteWidgetSetting = this.widget + 'DeleteWidgetSetting';
  public getWidgetSetting = this.widget + 'GetWidgetSetting';
  public getWidgetOrderBy = this.widget + 'GetWidgetOrderBy';
  public saveWidgetOrderBy = this.widget + 'SaveWidgetOrderBy';

  public pageSetting = this.apiUrl + 'PageSetting/';
  public savePageSetting = this.pageSetting + 'SavePageSetting';
  public getPageSettingById = this.pageSetting + 'GetPageSettingById';

  // person
  public person = this.apiUrl + 'person/';
  public loadCommunication = this.person + 'LoadCommunication';
  public getPersonById = this.person + 'GetPersonById';
  public preLoadBusinessLogic = this.person + 'PreLoadBusinessLogic';
  public getPaymentAccount = this.person + 'getPaymentAccount';
  public getCCPRN = this.person + 'getCCPRN';
  public createPerson = this.person + 'CreatePerson';
  public updatePerson = this.person + 'UpdatePerson';
  public createPaymentAccount = this.person + 'CreatePaymentAccount';
  public createCostProvider = this.person + 'createCostProvider';
  public createCCPRN = this.person + 'createCCPRN';
  public getPaymentAccountById = this.person + 'GetPaymentAccountById';
  public getCustomerHistory = this.person + 'GetCustomerHistory';
  public getMandatoryField = this.person + 'GetMandatoryField';
  public getPersonData = this.person + 'GetPersonData';

  // article
  public article = this.apiUrl + 'article/';
  public getArticleById = this.article + 'getArticleById';
  public getArticleSetComposition = this.article + 'GetArticleSetComposition';
  public createArticle = this.article + 'createArticle';
  public updateArticle = this.article + 'UpdateArticle';
  public createArticlePurchasing = this.article + 'InsertArticlePurchasing';
  public updateArticleSetComposition =
    this.article + 'UpdateArticleSetComposition';
  public checkArticleNr = this.article + 'checkArticleNr';
  public getArticleByNr = this.article + 'getArticleByNr';
  public searchArticleByNr = this.article + 'SearchArticleByNr';
  public insertArticleMedia = this.article + 'InsertArticleMedia';
  public updateArticleMedia = this.article + 'UpdateArticleMedia';
  public getArticleMedia = this.article + 'GetArticleMedia';

  // campiagn
  public campaign = this.apiUrl + 'campaign/';
  public createCampaignArticle = this.campaign + 'CreateCampaignArticle';
  public getCampaignArticle = this.campaign + 'GetCampaignArticle';
  public searchMediaCode = this.campaign + 'SearchMediaCode';
  public getCampaignArticleCountries =
    this.campaign + 'GetCampaignArticleCountries';
  public createMediaCode = this.campaign + 'CreateMediaCode';
  public getCampaignWizardCountry = this.campaign + 'GetCampaignWizardCountry';
  public saveCampaignWizard = this.campaign + 'SaveCampaignWizard';
  public saveCampaignWizardCountriesT2 =
    this.campaign + 'SaveCampaignWizardCountriesT2';
  public getCampaignWizardT2 = this.campaign + 'GetCampaignWizardT2';
  public getCampaignWizardT1 = this.campaign + 'GetCampaignWizardT1';
  public getCampaignTracks = this.campaign + 'GetCampaignTracks';
  public getCampaignTracksCountries =
    this.campaign + 'GetCampaignTracksCountries';
  public saveCampaignTracks = this.campaign + 'SaveCampaignTracks';
  public saveCampaignCosts = this.campaign + 'SaveCampaignCosts';
  public getCampaignMediaCodeArticleSalesPrice =
    this.campaign + 'GetCampaignMediaCodeArticleSalesPrice';
  public getPaymentTypeSalesPrice = this.campaign + 'GetPaymentTypeSalesPrice';
  public saveCampaignMediaCodeArticleSalesPrice =
    this.campaign + 'SaveCampaignMediaCodeArticleSalesPrice';
  public savePaymentTypeSalesPrice =
    this.campaign + 'SavePaymentTypeSalesPrice';

  public saveSalesCampaignAddOn = this.campaign + 'SaveSalesCampaignAddOn';
  public saveDocumentTemplateSampleDataFile =
    this.campaign + 'SaveDocumentTemplateSampleDataFile';
  public getCampaignCostsTreeView = this.campaign + 'GetCampaignCostsTreeView';
  public listDocumentTemplateColumnName =
    this.campaign + 'ListDocumentTemplateColumnName';
  public getDocumentTemplateCountries =
    this.campaign + 'GetDocumentTemplateCountries';
  public getMediaCodeDetail = this.campaign + 'GetMediaCodeDetail';
  public checkExistingMediaCodeMulti =
    this.campaign + 'CheckExistingMediaCodeMulti';
  public checkCampaignNumber = this.campaign + 'CheckCampagneNr';
  public saveAppSystemColumnNameTemplate =
    this.campaign + 'SaveAppSystemColumnNameTemplate';
  public listDocumentTemplatesBySharingTreeGroup =
    this.campaign + 'ListDocumentTemplatesBySharingTreeGroup';
  public listTreeItemByIdSharingTreeGroupsRootname =
    this.campaign + 'ListTreeItemByIdSharingTreeGroupsRootname';
  public saveFilesByIdSharingTreeGroups =
    this.campaign + 'SaveFilesByIdSharingTreeGroups';

  // business cost
  public saveFilesByBusinessCostsId =
    this.campaign + 'SaveFilesByBusinessCostsId';
  public getCampaignCosts = this.campaign + 'GetCampaignCosts';
  public getFilesByBusinessCostsId =
    this.campaign + 'GetFilesByBusinessCostsId';
  public getBusinessCostsItem = this.campaign + 'GetBusinessCostsItem';
  public getBusinessCostsCountries =
    this.campaign + 'GetBusinessCostsCountries';
  public saveBusinessCostsItem = this.campaign + 'SaveBusinessCostsItem';

  // data entry
  public dataEntry = this.apiUrl + 'OrderDataEntry/';
  public getArticleData = this.dataEntry + 'GetArticleData';
  public getCustomerData = this.dataEntry + 'GetCustomerData';
  public getPreloadOrderData = this.dataEntry + 'GetPreloadOrderData';
  public saveOrderDataEntry = this.dataEntry + 'SaveOrderDataEntry';
  public savePaymentForOrder = this.dataEntry + 'SavePaymentForOrder';
  public sendOrderToAdministrator = this.dataEntry + 'SendOrderToAdministrator';
  public getMainCurrencyAndPaymentType =
    this.dataEntry + 'GetMainCurrencyAndPaymentType';
  public getMainCurrencyAndPaymentTypeForOrder =
    this.dataEntry + 'GetMainCurrencyAndPaymentTypeForOrder';
  public getOrderDataEntryByLogin = this.dataEntry + 'OrderDataEntryByLogin';
  public getTotalDataEntryByLogin = this.dataEntry + 'TotalDataEntryByLogin';
  public getOrderFailed = this.dataEntry + 'GetOrderFailed';
  public saveOrderFailed = this.dataEntry + 'SaveOrderFailed';
  public deleteOrderFailed = this.dataEntry + 'DeleteOrderFailed';
  public deleteAllOrderFailed = this.dataEntry + 'DeleteAllOrderFailed';
  public getListOrderFailed = this.dataEntry + 'GetListOrderFailed';
  public getRejectPayments = this.dataEntry + 'GetRejectPayments';
  public getSalesOrderById = this.dataEntry + 'GetSalesOrderById';
  public deleteOrderData = this.dataEntry + 'DeleteOrderDataEntry';

  // bloomberg
  public bloomberg = this.apiUrl + 'bloomberg/';
  public getExchangeMoney = this.bloomberg + 'GetExchangeMoney';

  // return refund
  public returnRefund = this.apiUrl + 'ReturnAndRefund/';
  public getWidgetInfoByIds = this.returnRefund + 'GetWidgetInfoByIds';
  public saveReturnRefundWidgetData = this.returnRefund + 'SaveWidgetData';
  public saveUnblockOrder = this.returnRefund + 'SaveUnblockOrder';
  public saveDeleteOrder = this.returnRefund + 'SaveDeleteOrder';

  // block order
  public blockOrders = this.apiUrl + 'BlockOrders/';
  public getTextTemplate = this.blockOrders + 'GetTextTemplate';
  public getMailingListOfPlaceHolder =
    this.blockOrders + 'GetMailingListOfPlaceHolder';
  public getListOfMandantsByIdSalesOrder =
    this.blockOrders + 'GetListOfMandantsByIdSalesOrder';
  public getListOfMandantsByIdPerson =
    this.blockOrders + 'GetListOfMandantsByIdPerson';
  public getLetterTypeByMandant = this.blockOrders + 'GetLetterTypeByMandant';
  public getLetterTypeByWidgetAppId =
    this.blockOrders + 'GetLetterTypeByWidgetAppId';
  public getGroupAndItemsByLetterType =
    this.blockOrders + 'GetGroupAndItemsByLetterType';
  public getAssignWidgetByLetterTypeId =
    this.blockOrders + 'GetAssignWidgetByLetterTypeId';
  public getAllTypeOfAutoLetter = this.blockOrders + 'GetAllTypeOfAutoLetter';
  public getCountriesLanguageByLetterTypeId =
    this.blockOrders + 'GetCountriesLanguageByLetterTypeId';
  public getListOfTemplate = this.blockOrders + 'GetListOfTemplate';
  public saveTextTemplate = this.blockOrders + 'SaveTextTemplate';
  public saveSalesOrderLetters = this.blockOrders + 'SaveSalesOrderLetters';
  public saveSalesOrderLettersConfirm =
    this.blockOrders + 'SaveSalesOrderLettersConfirm';
  public saveSalesCustomerLetters =
    this.blockOrders + 'SaveSalesCustomerLetters';
  public saveBackOfficeLetters = this.blockOrders + 'SaveBackOfficeLetters';
  public saveBackOfficeLettersTest =
    this.blockOrders + 'SaveBackOfficeLettersTest';
  public saveBackOfficeLettersTestGeneratedDoc =
    this.blockOrders + 'SaveBackOfficeLettersTestGeneratedDoc';
  public confirmSalesOrderLetters =
    this.blockOrders + 'ConfirmSalesOrderLetters';
  public resetLetterStatus = this.blockOrders + 'ResetLetterStatus';
  public deteleSAV = this.blockOrders + 'DeleteBackOfficeLetters';

  // stock correction
  public stockCorrection = this.apiUrl + 'StockCorrection/';
  public getWarehouseArticle = this.stockCorrection + 'GetWarehouseArticle';
  public saveStockCorrection = this.stockCorrection + 'SaveStockCorrection';

  // tool
  public tools = this.apiUrl + 'Tools/';
  public getAllScanCenters = this.tools + 'GetAllScanCenters';
  public getScanCenterPools = this.tools + 'GetScanCenterPools';
  public getScanCenterDispatcher = this.tools + 'GetScanCenterDispatcher';
  public getAllScanDataEntryCenters = this.tools + 'GetAllScanDataEntryCenters';
  public saveScanDispatcherPool = this.tools + 'SaveScanDispatcherPool';
  public saveScanUndispatch = this.tools + 'SaveScanUndispatch';
  public getScanAssignmentDataEntryCenter =
    this.tools + 'GetScanAssignmentDataEntryCenter';
  public getScanAssignmentPool = this.tools + 'GetScanAssignmentPool';
  public getScanAssignedPool = this.tools + 'GetScanAssignedPool';
  public getScanAssignmentUsers = this.tools + 'GetScanAssignmentUsers';
  public getScanAssignmentUserLanguageAndCountry =
    this.tools + 'GetScanAssignmentUserLanguageAndCountry';
  public scanAssignmentAssignPoolsToUsers =
    this.tools + 'ScanAssignmentAssignPoolsToUsers';
  public scanAssignmentUnassignPoolsToUsers =
    this.tools + 'ScanAssignmentUnassignPoolsToUsers';
  public matchingCountry = this.tools + 'GetMatchingCountry';
  public getMatchingColumns = this.tools + 'GetMatchingColumns';
  public getMatchingConfiguration = this.tools + 'GetMatchingConfiguration';
  public saveMatchingConfiguration = this.tools + 'SaveMatchingConfiguration';
  public getScheduleTime = this.tools + 'GetScheduleTime';
  public saveScheduleTime = this.tools + 'SaveScheduleTime';
  public listSystemScheduleService = this.tools + 'ListSystemScheduleService';
  public getScheduleServiceStatusByQueueId =
    this.tools + 'GetScheduleServiceStatusByQueueId';
  public getSummayFileResultSystemSchedule =
    this.tools + 'GetSummayFileResultSystemSchedule';
  public getScheduleByServiceId = this.tools + 'GetScheduleByServiceId';
  public saveSystemSchedule = this.tools + 'SaveSystemSchedule';
  public saveStatusSystemSchedule = this.tools + 'SaveStatusSystemSchedule';
  public savingQueue = this.tools + 'SavingQueue';
  public saveMailingReturn = this.tools + 'SaveMailingReturn';
  public resetMailingReturn = this.tools + 'ResetMailingReturn';
  public getMailingReturnSummary = this.tools + 'GetMailingReturnSummary';
  public exportCustomerAndBusinessStatus =
    this.tools + 'ExportCustomerAndBusinessStatus';
  public getImportInvoiceFiles = this.tools + 'GetImportInvoiceFiles';
  public callbackSP = this.tools + 'CallbackSP';

  // warehouse
  public wareHouseMovement = this.apiUrl + 'WareHouseMovement/';
  public getWarehouseMovement = this.wareHouseMovement + 'GetWarehouseMovement';
  public searchArticles = this.wareHouseMovement + 'SearchArticles';
  public getArrivedArticles = this.wareHouseMovement + 'GetArrivedArticles';
  public getSelectedArticles = this.wareHouseMovement + 'GetSelectedArticles';
  public stockedArticles = this.wareHouseMovement + 'StockedArticles';
  public saveWarehouseMovement =
    this.wareHouseMovement + 'SaveWarehouseMovement';
  public saveGoodsReceiptPosted =
    this.wareHouseMovement + 'SaveGoodsReceiptPosted';
  public confirmGoodsReceiptPosted =
    this.wareHouseMovement + 'ConfirmGoodsReceiptPosted';

  // User management
  public user = this.apiUrl + 'User/';
  public getUserById = this.user + 'GetUserById';
  public getAllUserRole = this.user + 'GetAllUserRole';
  public listUserRoleByUserId = this.user + 'ListUserRoleByUserId';
  public listUserRoleInclueUserId = this.user + 'ListUserRoleInclueUserId';
  public checkExistUserByField = this.user + 'CheckExistUserByField';
  public saveUserProfile = this.user + 'SaveUserProfile';
  public saveRoleForUser = this.user + 'SaveRoleForUser';
  public saveUserWidgetLayout = this.user + 'SaveUserWidgetLayout';
  public getUserFunctionList = this.user + 'GetUserFunctionList';
  public assignRoleToMultipleUser = this.user + 'AssignRoleToMultipleUser';

  // User Module Workspace
  public getWorkspaceTemplate = this.user + 'GetWorkspaceTemplate';
  public getWorkspaceTemplateSharing =
    this.user + 'GetWorkspaceTemplateSharing';
  public applyWorkspaceTemplate = this.user + 'ApplyWorkspaceTemplate';
  public applyWorkspaceTemplateAll = this.user + 'ApplyWorkspaceTemplateAll';
  public saveWorkspaceTemplate = this.user + 'SaveWorkspaceTemplate';
  public saveWorkspaceTemplateAll = this.user + 'SaveWorkspaceTemplateAll';
  public deleteWorkspaceTemplate = this.user + 'DeleteWorkspaceTemplate';
  public saveDefaultWorkspaceTemplate =
    this.user + 'SaveDefaultWorkspaceTemplate';

  // Notification
  public notification = this.apiUrl + 'Notification/';
  public getNotifications = this.notification + 'GetNotifications';
  public createNotification = this.notification + 'CreateNotification';
  public setArchivedNotifications =
    this.notification + 'SetArchivedNotifications';
  public createNotificationWithSendEmail =
    this.notification + 'CreateNotificationWithSendEmail';

  //FileManager
  public fileManager = this.apiUrl + 'FileManager/';
  public downloadTemplates = this.fileManager + 'DownloadTemplates';
  public checkFileExisted = this.fileManager + 'CheckFileExisted';
  public getFile = this.fileManager + 'GetFile';
  public uploadFile = this.fileManager + 'UploadFile/';
  public getScanFile = this.fileManager + 'GetScanFile/';
  public uploadScanFile = this.fileManager + 'UploadScanFile/';
  public importArticleMediaZip = this.fileManager + 'ImportArticleMediaZip/';
  public donwloadReportNote = this.fileManager + 'DownloadReportNotes';

  public database = this.apiUrl + 'database/';
  public getListOfDatabaseNames = this.database + 'GetListOfDatabaseNames';
  public getListOfDatabaseCountry = this.database + 'GetListOfDatabaseCountry';
  public saveProjectDatabase = this.database + 'SaveProjectDatabase';

  public rule = this.apiUrl + 'rule/';
  public getProjectRules = this.rule + 'GetProjectRules';
  public getProjectRulesForTemplate = this.rule + 'GetProjectRulesForTemplate';
  public getComboBoxForRuleBuilder = this.rule + 'GetComboBoxForRuleBuilder';
  public getBlackListRules = this.rule + 'GetBlackListRules';
  public getOrdersGroups = this.rule + 'GetOrdersGroups';
  public saveProjectRules = this.rule + 'SaveProjectRules';
  public getTemplate = this.rule + 'GetTemplate';
  public saveBlackListProfile = this.rule + 'SaveBlackListProfile';
  public deleteDataToUsed = this.rule + 'DeleteDataToUsed';

  public country = this.apiUrl + 'country/';
  public getCountryGroupsList = this.country + 'GetCountryGroupsList';
  public getCountryGroupsName = this.country + 'GetCountryGroupsName';
  public getSelectionProjectCountry =
    this.country + 'GetSelectionProjectCountry';
  public saveCountryGroups = this.country + 'SaveCountryGroups';
  public saveProjectCountry = this.country + 'SaveProjectCountry';

  public frequency = this.apiUrl + 'frequency/';
  public getFrequency = this.frequency + 'GetFrequency';
  public rebuildFrequencies = this.frequency + 'RebuildFrequencies';
  public getFrequencyBusyIndicator =
    this.frequency + 'GetFrequencyBusyIndicator';
  public saveFrequency = this.frequency + 'SaveFrequency';

  public project = this.apiUrl + 'project/';
  public saveProject = this.project + 'SaveProject';
  public saveProjectExclude = this.project + 'SaveProjectExclude';
  public saveMediaCodePricing = this.project + 'SaveMediaCodePricing';
  public getSelectionProject = this.project + 'GetSelectionProject';
  public getMediaCodePricing = this.project + 'GetMediaCodePricing';
  public insertMediaCodeToCampaign = this.project + 'InsertMediaCodeToCampaign';
  public getSelectionToExclude = this.project + 'GetSelectionToExclude';
  public getSelectionIsExcluded = this.project + 'GetSelectionIsExcluded';
  public getSelectionCountriesExcluded =
    this.project + 'GetSelectionCountriesExcluded';
  public getSelectionMediacodeExcluded =
    this.project + 'GetSelectionMediacodeExcluded';

  public selectionExport = this.apiUrl + 'selectionExport/';
  public getSelectionDataExport = this.selectionExport + 'GetDataExport';
  public exportAll = this.selectionExport + 'ExportAll';
  public exportSelectionMediaCode = this.selectionExport + 'ExportMediaCode';
  public exportSelectionData = this.selectionExport + 'ExportData';
}

@Injectable()
export class GlobalSearchConstant {
  public searchAll = 'All';
  public searchAdministration = 'Administration';
  public searchAricle = 'Article';
  public searchCampaign = 'Campaign';
  public searchCampaignCost = 'Campaign Cost';
  public searchCustomer = 'Customer';
  public searchOrder = 'Order';
  public searchPurchase = 'Purchase';
  public searchReturnAndReFund = 'Return & Refund';
  public searchStockCorrection = 'Stock Correction';
  public searchWareHuoseMovement = 'Warehourse Movement';
}

@Injectable()
export class GlobalSettingConstant {
  public settingUserNoticeMessage = 'UserNoticeMessage';
  public settingUserMain = 'SettingUserMain';
  public additionalInformationTabShow = 'AdditionalInformationTabShow';
  public additionalInformationSessionShow = 'AdditionalInformationSessionShow';
  public parkItemSessionShow = 'ParkItemSessionShow';
  public settingCheckedModules = 'SettingCheckedModules';
  public orderDataEntryTabList = 'OrderDataEntryTabList';
  public globalWidgetProperties = 'GlobalWidgetProperties';
  public tabHeaderCollapseState = 'TabHeaderCollapseState';
  public publishSetting = 'PublishSetting';
  public moduleLayoutSetting = 'ModuleLayoutSetting';
  public hotkeySetting = 'HotkeySetting';
  public gridPagingDropdown = 'GridPagingDropdown';
  public workingModulesPosition = 'WorkingModulesPosition';
  public ageFilterTemplate = 'AgeFilter_Template';
  public extendedFilterTemplate = 'ExtendedFilter_Template';
  public gsHistoryTabSearching = 'GSHTSearching';
  public searchProfile = 'SearchProfile';
  public mandatoryCustomerNr = 'MandatoryCustomerNr';
}

@Injectable()
export class PageSettingConstant {
  public HorizontalPageName = 'Horizontal';
  public VerticalPageName = 'Vertical';
}

@Injectable()
export class PageSize {
  public GlobalSearchDefaultSize = 370;
  public GlobalSearchHeaderSize = 33;

  public ParkedItemShowSize = 230;
  public ParkedItemHideSize = 30;
  public AdditionalInformationSize = 29;
}

@Injectable()
export class CustomerFormModeConstant {
  public create = 1;
  public update = 2;
}

@Injectable()
export class ComboBoxTypeConstant {
  static language = 1;
  static title = 2;
  static countryCode = 3;
  static customerStatus = 4;
  static pOBox = 5;
  static contactType = 6;
  static titleOfCourtesy = 7;
  static communicationTypeType = 8;
  static creditCardType = 9;
  static cashProviderType = 10;
  static principal = 11;
  static mandant = 12;
  static currency = 13;
  static providerCostType = 14;
  static paymentType = 15;
  static identifierCode = 16;
  static articleStatus = 17;
  static allMandant = 18;
  static serviceProvider = 19;
  static wareHouse = 20;
  static campaignWizardAddress = 21;
  static campaignGroup = 22;
  static campaignNamePrefix = 23;
  static currencyByCountry = 24;
  static currencyByWizardItems = 25;
  static invoicePaymentType = 26;
  static dataEntryLots = 27;
  static vat = 28;
  static widgetType = 29;
  static moduleItems = 30;
  static personType = 31;
  static getLetterType = 32;

  //------------------------------------------
  static treeMediaType = 'TreeMediaType';
  static additionalCosts_CostType = 'AdditionalCosts_CostType';
  static businessCosts_CostType = 'BusinessCosts_CostType';
  static scanDispatcherDataEntryCenter = 'ScanDispatcherDataEntryCenter';
  static orderType = 'orderType';
  static orderBy = 'orderBy';
  static repSalesCampaignCatalogPageType = 'repSalesCampaignCatalogPageType';
  static repSalesCampaignCatalogType = 'repSalesCampaignCatalogType';
  static repSalesCampaignCatalogFormat = 'repSalesCampaignCatalogFormat';
  static sendToAdminReason = 'SendToAdminReason';
  static repAppSystemColumnNameTemplate = 'repAppSystemColumnNameTemplate';
  static letterType = 'GetLetterType';
  static countryLanguageCode = 'CountryLanguageCode';
  static campaign = 'Campaign';
  static chartDataSourceObject = 'ChartDataSourceObject';
  static mailingReturnReason = 'mailingReturnReason';
  static odePaymentPost = 'ODEPaymentPost';
  static odePaymentBank = 'ODEPaymentBank';
  static paymentProvider = 'PaymentProvider';
  static SAVListenKey = 'SAVListenKey';
  static getShipper = 'GetShipper';
}

@Injectable()
export class MenuModuleId {
  static administration = 1;
  static customer = 2;
  static article = 3;
  static campaign = 4;
  static backoffice = 5;
  static businessCosts = 6;
  static orderDataEntry = 7;
  static statistic = 8;
  static tools = 9;
  static selection = 10;
  static broker = 11;
  static cashProvider = 12;
  static desktopProvider = 13;
  static freightProvider = 14;
  static mandant = 15;
  static principal = 16;
  static postProvider = 17;
  static printProvider = 18;
  static provider = 19;
  static scanCenter = 20;
  static serviceProvider = 21;
  static Supplier = 22;
  static Warehouse = 23;
  static blockedOrder = 24;
  static dataExport = 25;
  static doublette = 26;
  static logistic = 27;
  static orders = 28;
  static returnRefund = 29;
  static reminderLogin = 45;
  static invoicePayment = 47;
  static purchase = 30;
  static stockCorrection = 31;
  static warehouseMovement = 32;
  static cCPRNManager = 33;
  static checkConfirm = 34;
  static tracksSetup = 35;
  static scanManagement = 36;
  static doubletCheckTool = 37;
  static systemManagement = 38;
  static statistisReport = 39;
  static toolsAddOn = 40;
  static campaignAddOn = 41;
  static dashboard = 42;
  static mailingData = 46;
  static savLetter = 48;
  static printAutoLetter = 49;
  static selectionCampaign = 97;
  static selectionBroker = 98;
  static selectionCollect = 99;
  static archivedCampaign = 100;
}

@Injectable()
export class ModuleType {
  static PARKED_ITEM = 'ParkedItem';
  static WIDGET_TOOLBAR = 'WidgetToolbar';
  static LAYOUT_SETTING = 'LayoutSetting';
  static GLOBAL_PROPERTIES = 'GlobalProps';
}

@Injectable()
export class ArticleTabFieldMapping {
  static isSetArticle = 'ArticleSet';
  static isWarehouseControl = 'Warehouses';
  static isVirtual = 'Virtual';
}

@Injectable()
export class MessageModal {
  static MessageType = class {
    static error = 'error';
    static warning = 'warning';
    static success = 'success';
    static confirm = 'confirm';
    static information = 'information';
  };
  static ModalSize = class {
    static large = 'large';
    static middle = 'middle';
    static small = 'small';
  };
  static ButtonType = class {
    static default = 'default';
    static primary = 'primary';
    static success = 'success';
    static info = 'info';
    static warning = 'warning';
    static danger = 'danger';
    static link = 'link';
  };
}

@Injectable()
export class ModuleTabCombineNameConstant {
  static AdContact = '1-Contact';
  static AdPaymentAccount = '1-PaymentAccount';
  static CustomerContact = '2-Contact';
  static CustomerBDAddress = '2-BDAddress';
}

export class ControlType {
  static Numeric = 'numeric';
  static Textbox = 'textbox';
  static TextboxMask = 'textboxMask';
  static Checkbox = 'checkbox';
  static ComboBox = 'combobox';
  static DateTime = 'datetime';
  static DateTimePicker = 'datetimepicker';
  static Button = 'button';
}

export class FormSaveEvenType {
  static Successfully = 'Successfully';
  static Fail = 'Fail';
}

export class DispatcherMode {
  static Pool = 'SelectPool';
  static Dispatcher = 'SelectDispatcher';
}

export class AddressFormatConstant {
  public static Street = 'Street';
  public static StreetNr = 'StreetNr';
  public static Addition = 'Addition';
  public static CountryAddition = 'CountryAddition';
  public static NameAddition = 'NameAddition';
  public static StreetAddition1 = 'StreetAddition1';
  public static StreetAddition2 = 'StreetAddition2';
  public static StreetAddition3 = 'StreetAddition3';
  public static PoboxLabel = 'PoboxLabel';
  public static POBOX = 'POBOX';
  public static Place = 'Place';
  public static Area = 'Area';
  public static Zip = 'Zip';
  public static Zip2 = 'Zip2';
  public static CountryCode = 'CountryCode';
}

export enum FormStyle {
  JustifyContent = 'JustifyContent',
  BackgroundColor = 'Background',
  Color = 'Color',
  Border = 'Border',
  OddBackground = 'OddBackground',
  EvenBackground = 'EvenBackground',
  FontName = 'FontName',
  FontSize = 'FontSize',
  Bold = 'Bold',
  Italic = 'Italic',
  Underline = 'Underline',
  Height = 'Height',
  Width = 'Width',
  AutoWidth = 'AutoWidth',
  Left = 'Left',
  Center = 'Center',
  Right = 'Right',
  AutoHeight = 'AutoHeight',
  VerticalAlign = 'VerticalAlign',
}

export enum CssStyleForm {
  VerticalAlign = 'vertical-align',
  FlexStart = 'flex-start',
  SpaceAround = 'space-around',
  FlexEnd = 'flex-end',
  JustifyContent = 'justify-content',
  BackgroundColor = 'background-color',
  Color = 'color',
  BorderRight = 'border-right',
  OddRow = 'oddRow',
  EvenRow = 'evenRow',
  FontFamily = 'font-family',
  FontSize = 'font-size',
  FontWeight = 'font-weight',
  FontStyle = 'font-style',
  Underline = 'text-decoration',
  Height = 'height',
  Width = 'width',
}

export enum ModuleName {
  AllModules = 'All Modules',
  Base = 'Base',
  BackOffice = 'Backoffice',
  DataExport = 'DataExport',
  Doublette = 'Doublette',
  Logistic = 'Logistic',
  Statistic = 'Statistic',
  Tools = 'Tools',
  TracksSetup = 'TracksSetup',
  Selection = 'Selection',
  CampaignSelection = 'CampaignSelection',
  ArchivedCampaign = 'ArchivedCampaign',
  CollectSelection = 'CollectSelection',
  BrokerSelection = 'BrokerSelection',
  MailingData = 'MailingData',
}

export enum ModuleIdSettingGuid {
  AllModules = -1,
}

export enum MouseEvent {
  None = 'none',
  Click = 'click',
  Hover = 'hover',
  Always = 'always',
}

export enum TypeForm {
  LineBreak = 'lineBreak',
  Panel = 'panel',
  Control = 'control',
  Column = 'column',
}

export enum FileUploadModuleType {
  BusinessCost = 0,
  Campaign = 1,
  ToolsFileTemplate = 2,
  ImageGallery = 3,
}

export enum SharingTreeGroupsRootName {
  Article = 1,
  BusinessCosts = 2,
  DataEntry = 3,
  Repositorys = 4,
  Campagne = 5,
  Tools = 6,
  StatisticReport = 7,
  CustomerOrders = 8,
  CountryListWidgetGroup = 9,
  ImageGallery = 10,
}

export enum FilterModeEnum {
  ShowAll = 0,
  HasData = 1,
  EmptyData = 2,
  ShowAllWithoutFilter = 3,
}

export enum FilterOptionFormatDate {
  DateTime = 0,
  Date = 1,
}

export enum TabButtonsEnum {
  New = 1,
  Edit = 2,
  Cancel = 3,
}

export enum MainNotificationTypeEnum {
  All = 0,
  Feedback = 1,
  SendToAdmin = 2,
  AutoLetter = 3,
}

export enum NotificationStatusEnum {
  All = 0,
  New = 1,
  Archive = 2,
}

export enum WidgetLayoutSettingModeEnum {
  FullWidth = 0,
  FullHeight = 1,
  FullPage = 2,
  Resizable = 3,
}

export enum OrderDataEntryWidgetLayoutModeEnum {
  Inline = 1,
  InTab = 2,
}

export enum WidgetFormTypeEnum {
  List = 0,
  Group = 1,
}

export enum TranslateModeEnum {
  All = 1,
  WidgetOnly = 2,
}

export enum OrderByModeEnum {
  Default = 1,
  WidgetOnly = 2,
}

export enum TranslateDataTypeEnum {
  Label = 1,
  Data = 2,
  System = 5,
}

export enum RequestSavingMode {
  SaveOnly = 0,
  SaveAndNew = 1,
  SaveAndClose = 2,
  SaveAndNext = 3,
}

export enum EditWidgetTypeEnum {
  Form = 1,
  Table = 2,
  Country = 3,
  TreeView = 4,
  EditableAddNewRow = 5,
  EditableDeleteRow = 6,
  InPopup = 7,
  Expand = 8,
  NoteForm = 9,
}

export enum SavingWidgetType {
  Form = 0,
  EditableTable = 1,
  Combination = 2,
  CombinationCreditCard = 3,
  Country = 4,
  TreeView,
  FileExplorer,
  FileExplorerWithLabel,
  FileTemplate = 27,
  ExportBlockedCustomer = 35,
  SAVLetter = 38,
}

export enum SplitterDirectionMode {
  Horizontal = 0,
  Vertical = 1,
}

export enum UploadFileMode {
  Other = 0,
  ArticleMedia = 1,
  Profile = 2,
  Notification = 3,
  Template = 4,
  Printing = 5,
  Path = 6,
  General = 7,
  ArticleMediaZipImport = 8,
  ODEFailed = 9,
  Inventory = 10,
  MailingReturn = 11,
  ImportDataMatrix = 12,
  ImageGallery = 13,
  ImportInvoicePayment = 14,
  SAVTeamplate = 15,
}

@Injectable()
export class ReplaceString {
  static JsonText = '<<JSONText>>';
  static SubInputParameter = '<<SubInputParameter>>';
}

export enum SalesCampaignType {
  Master = 1,
  Asile = 2,
  Inter = 3,
  Tracks = 4,
}

export enum ApiMethodResultId {
  None = 0,
  Success = 1,
  RecordAlreadyExists = 50,
  RecordAlreadyExistsWarning = 406,
  AuthorizationFailure = 500,
  UpdateFailure = 512,
  InactiveStatus = 513,
  RecordNotFound = 514,
  UnexpectedErrorInsertingData = 515,
  UnexpectedErrorUpdatingData = 517,
  MaxPasswordAttempts = 518,
  InvalidPassword = 519,
  DuplicateNameIsNotAllowed = 523,
  InvalidUser = 525,
  DeleteFailure = 529,
  InvalidWidget = 530,
  InvalidWidgetMethod = 531,
  InvalidLanguage = 532,
  InvalidMethod = 533,
  InvalidAuthorizedDataAccess = 539,
  InvalidApp = 540,
  SqlConnectionError = 998,
  UnexpectedError = 999,
}

@Injectable()
export class StoreStringCall {
  static StoreWidgetRequestMediaCodeMain = `{
		"Request":
		{
			"ModuleName"	: "GlobalModule",
			"ServiceName"	: "GlobalService",
			"Data":
			"{
				\\"MethodName\\"	: \\"SpAppWg001Campaign\\",

				\\"CrudType\\"		: null,
				\\"Object\\" : \\"MediaCodeMain\\",
				\\"Mode\\" : null,


				\\"WidgetTitle\\" : \\"MediaCode Main\\",
				\\"IsDisplayHiddenFieldWithMsg\\" : \\"1\\",
				<<LoginInformation>>,
				<<InputParameter>>
			}"
		}
	}`;
  static StoreWidgetRequestMediaCodeDetail = `{
		"Request":
		{
			"ModuleName"	: "GlobalModule",
			"ServiceName"	: "GlobalService",
			"Data":
			"{
				\\"MethodName\\"	: \\"SpAppWg001Campaign\\",

				\\"CrudType\\"		: null,
				\\"Object\\" : \\"MediaCodeDetail\\",
				\\"Mode\\" : null,


				\\"WidgetTitle\\" : \\"MediaCode Detail\\",
				\\"IsDisplayHiddenFieldWithMsg\\" : \\"1\\",
				<<LoginInformation>>,
				<<InputParameter>>
			}"
		}
	}`;
}

export class LocalSettingKey {
  static LANGUAGE = 'language';
  static SET_LANGUAGE_MODE = 'setLanguageMode';
}

@Injectable()
export class TabButtonActionConst {
  static FIRST_LOAD = 'FIRST_LOAD';
  static CHANGE_PARKED_ITEM_FROM_MAIN_TAB = 'CHANGE_PARKED_ITEM_FROM_MAIN_TAB';
  static CHANGE_PARKED_ITEM_FROM_OTHER_TAB =
    'CHANGE_PARKED_ITEM_FROM_OTHER_TAB';
  static CHANGE_SEARCH_RESULT_FROM_MAIN_TAB =
    'CHANGE_SEARCH_RESULT_FROM_MAIN_TAB';
  static CHANGE_SEARCH_RESULT_FROM_OTHER_TAB =
    'CHANGE_SEARCH_RESULT_FROM_OTHER_TAB';
  static BEFORE_NEW_MAIN_TAB = 'BEFORE_NEW_MAIN_TAB';
  static BEFORE_NEW_OTHER_TAB = 'BEFORE_NEW_OTHER_TAB';
  static NEW_MAIN_TAB = 'NEW_MAIN_TAB';
  static NEW_MAIN_TAB_AND_CHANGE_MODULE = 'NEW_MAIN_TAB_AND_CHANGE_MODULE';
  static NEW_OTHER_TAB = 'NEW_OTHER_TAB';
  static NEW_OTHER_TAB_AND_CHANGE_MODULE = 'NEW_OTHER_TAB_AND_CHANGE_MODULE';
  static BEFORE_EDIT_MAIN_TAB = 'BEFORE_EDIT_MAIN_TAB';
  static BEFORE_EDIT_OTHER_TAB = 'BEFORE_EDIT_OTHER_TAB';
  static EDIT_MAIN_TAB = 'EDIT_MAIN_TAB';
  static EDIT_MAIN_TAB_AND_CHANGE_MODULE = 'EDIT_MAIN_TAB_AND_CHANGE_MODULE';
  static EDIT_OTHER_TAB = 'EDIT_OTHER_TAB';
  static EDIT_OTHER_TAB_AND_CHANGE_MODULE = 'EDIT_OTHER_TAB_AND_CHANGE_MODULE';
  static BEFORE_CLONE_MAIN_TAB = 'BEFORE_CLONE_MAIN_TAB';
  static BEFORE_CLONE_OTHER_TAB = 'BEFORE_CLONE_OTHER_TAB';
  static CLONE_MAIN_TAB = 'CLONE_MAIN_TAB';
  static CLONE_MAIN_TAB_AND_CHANGE_MODULE = 'CLONE_MAIN_TAB_AND_CHANGE_MODULE';
  static CLONE_OTHER_TAB = 'CLONE_OTHER_TAB';
  static CLONE_OTHER_TAB_AND_CHANGE_MODULE =
    'CLONE_OTHER_TAB_AND_CHANGE_MODULE';
  static SAVE_AND_CLOSE_MAIN_TAB = 'SAVE_AND_CLOSE_MAIN_TAB';
  static SAVE_AND_CLOSE_OTHER_TAB = 'SAVE_AND_CLOSE_OTHER_TAB';
  static SAVE_AND_CLOSE_SIMPLE_TAB = 'SAVE_AND_CLOSE_SIMPLE_TAB';
  static SAVE_AND_NEW_MAIN_TAB = 'SAVE_AND_NEW_MAIN_TAB';
  static SAVE_AND_NEW_OTHER_TAB = 'SAVE_AND_NEW_OTHER_TAB';
  static SAVE_AND_NEXT = 'SAVE_AND_NEXT';
  static SAVE_AND_NEXT_SECOND_STEP = 'SAVE_AND_NEXT_SECOND_STEP';
  static SAVE_ONLY_MAIN_TAB = 'SAVE_ONLY_MAIN_TAB';
  static SAVE_ONLY_OTHER_TAB = 'SAVE_ONLY_OTHER_TAB';
  static SAVE_ORDER_DATA_ENTRY = 'SAVE_ORDER_DATA_ENTRY';
  static SAVE_ORDER_DATA_ENTRY_AND_CHANGE_TAB =
    'SAVE_ORDER_DATA_ENTRY_AND_CHANGE_TAB';
  static SAVE_ORDER_DATA_ENTRY_AND_REMOVE_TAB =
    'SAVE_ORDER_DATA_ENTRY_AND_REMOVE_TAB';
  static SAVE_ORDER_DATA_ENTRY_AND_RELOAD = 'SAVE_ORDER_DATA_ENTRY_AND_RELOAD';
  static EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB = 'EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB';
  static EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB =
    'EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB';
  static EDIT_AND_SAVE_ONLY_MAIN_TAB = 'EDIT_AND_SAVE_ONLY_MAIN_TAB';
  static EDIT_AND_SAVE_ONLY_OTHER_TAB = 'EDIT_AND_SAVE_ONLY_OTHER_TAB';
  static EDIT_AND_SAVE_AND_NEXT_MAIN_TAB = 'EDIT_AND_SAVE_AND_NEXT_MAIN_TAB';
  static EDIT_AND_SAVE_AND_NEXT_OTHER_TAB = 'EDIT_AND_SAVE_AND_NEXT_OTHER_TAB';
  static EDIT_AND_SAVE_AND_NEXT_SECOND_STEP =
    'EDIT_AND_SAVE_AND_NEXT_SECOND_STEP';
  static CHANGE_TAB = 'CHANGE_TAB';
  static RELOAD_ORDER_DATA_ENTRY = 'RELOAD_ORDER_DATA_ENTRY';
  static REMOVE_TAB = 'REMOVE_TAB';
  static CREATE_NEW_FROM_MODULE_DROPDOWN = 'CREATE_NEW_FROM_MODULE_DROPDOWN';
  static CHANGE_MODULE = 'CHANGE_MODULE';
  static CHANGE_SUB_MODULE = 'CHANGE_SUB_MODULE';
  static BEFORE_CLOSE = 'BEFORE_CLOSE';
  static EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP =
    'EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP';
  static EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP =
    'EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP';
  static EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP =
    'EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP';
  static EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP =
    'EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP';
  static EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW =
    'EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW';
  static EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW =
    'EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW';
  static BEFORE_EDIT_SIMPLE_TAB = 'BEFORE_EDIT_SIMPLE_TAB';
  static BEFORE_CLONE_SIMPLE_TAB = 'BEFORE_CLONE_SIMPLE_TAB';
  static EDIT_SIMPLE_TAB = 'EDIT_SIMPLE_TAB';
  static CLONE_SIMPLE_TAB = 'CLONE_SIMPLE_TAB';
  static EDIT_AND_SAVE_AND_CLOSE_SIMPLE_TAB =
    'EDIT_AND_SAVE_AND_CLOSE_SIMPLE_TAB';
  static REFRESH_TAB = 'REFRESH_TAB';

  static SAVE_AND_NEXT_STEP_SELECT_PROJECT =
    'SAVE_AND_NEXT_STEP_SELECT_PROJECT';
  static SAVE_AND_NEXT_STEP_COUNTRY = 'SAVE_AND_NEXT_STEP_COUNTRY';
  static SAVE_AND_NEXT_STEP_DATABASE = 'SAVE_AND_NEXT_STEP_DATABASE';
  static SAVE_AND_NEXT_STEP_LOGIC = 'SAVE_AND_NEXT_STEP_LOGIC';
  static SAVE_AND_NEXT_STEP_LOGIC_BLACKLIST =
    'SAVE_AND_NEXT_STEP_LOGIC_BLACKLIST';
  static SAVE_AND_NEXT_STEP_LOGIC_AGE_FILTER =
    'SAVE_AND_NEXT_STEP_LOGIC_AGE_FILTER';
  static SAVE_AND_NEXT_STEP_LOGIC_EXTENDED_FILTER =
    'SAVE_AND_NEXT_STEP_LOGIC_EXTENDED_FILTER';
  static SAVE_AND_NEXT_STEP_LOGIC_GROUP_PRIORITY =
    'SAVE_AND_NEXT_STEP_LOGIC_GROUP_PRIORITY';
  static SAVE_AND_NEXT_STEP_FREQUENCIES = 'SAVE_AND_NEXT_STEP_FREQUENCIES';
  static SAVE_AND_NEXT_STEP_EXPORT = 'SAVE_AND_NEXT_STEP_EXPORT';
  static SAVE_AND_NEXT_STEP_FINALIZE = 'SAVE_AND_NEXT_STEP_FINALIZE';

  static WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS =
    'WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS';
}

@Injectable()
export class PaymentMethod {
  static CHECK = 2;
  static CREDIT_CARD = 3;
}

@Injectable()
export class OrderSummaryFilterConst {
  static DAY = 'Day';
  static WEEK = 'Week';
  static MONTH = 'Month';
  static BY_DATE = 'ByDate';
  static SEND_TO_ADMIN = 'SendToAdmin';
}

@Injectable()
export class DateConfiguration {
  static FILTERDATA = [
    {
      type: OrderSummaryFilterConst.DAY,
      title: 'Today',
      subTitle: null,
      icon: 'fa-calendar-o',
      count: 0,
      loading: false,
      selected: false,
    },
    {
      type: OrderSummaryFilterConst.WEEK,
      title: 'This week',
      subTitle: null,
      icon: 'fa-calendar-check-o',
      count: 0,
      loading: false,
      selected: false,
    },
    {
      type: OrderSummaryFilterConst.MONTH,
      title: 'This month',
      subTitle: null,
      icon: 'fa-calendar',
      count: 0,
      loading: false,
      selected: false,
    },
    {
      type: OrderSummaryFilterConst.BY_DATE,
      title: 'By date',
      icon: 'fa-calendar-minus-o',
      count: 0,
      loading: false,
      selected: false,
    },
    {
      type: OrderSummaryFilterConst.SEND_TO_ADMIN,
      title: 'Send to admin',
      icon: 'fa-share-square-o',
      count: 0,
      loading: false,
      selected: false,
    },
  ];
  static WEEK_DAY = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  static MONTH_DAY = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ];
  static SCHEDULE_TYPE = ['OneTime', 'Daily', 'Weekly', 'Monthly', 'Annual'];
  static SCHEDULE_JSON_NAME = [
    'JHours',
    'JDays',
    'JWeeks',
    'JMonths',
    'JYears',
  ];
}

@Injectable()
// TODO: must re-render Id list from database when go live
export class RepWidgetAppIdEnum {
  static CustomerDetail = 2;
  static ContactTable = 5;
  static CustomerContactDetail = 7;
  static CustomerCommunitionTable = 10;
  static AdministrationDetail = 13;
  static PersonDetail = 14;
  static AdministrationContactDetail = 15;
  static AdminContactTable = 16;
  static MainCommunitionTable = 17;
  static TestEditTable = 19;
  static CashProviderDetail = 20;
  static CashProviderTable = 22;
  static CCPRNTable = 23;
  static CCPRNDetail = 24;
  static ProviderCostDetail = 25;
  static ProviderCostTable = 26;
  static MainArticleDetail = 27;
  static TranslationWidget = 28;
  static MainInvolvedCampaignTable = 29;
  static ArticleSet = 30;
  static ArticleSetDetail = 31;
  // static TranslationWidget = 32;
  static ContactCommunitionTable = 33;
  static ArticlePurchasingTable = 34;
  static CountryWidgetDetail = 35;
  // static ContactCommunitionTable = 36;
  static ArticleWarehouses = 37;
  static ArticleWarehousesmovement = 38;
  static ArticleJournal = 39;
  static UploadWidget = 40;
  static ArticleMediaWidget = 41;
  static ArticleCategories = 42;
  static ArticleMeasurement = 43;
  static CampaignCountriesTable = 44;
  static MediaCodeMain = 45;
  static MediaCodeDetail = 46;
  static CampaignArticle = 47;
  static CampaignArticleCountries = 48;
  static MediaCodeAdvertising = 49;
  static CampaignTracks = 50;
  static CampaignTracksCountries = 51;
  static CampaignCatalog = 52;
  static BusinessCostDetail = 53;
  static RowDetail = 54;
  static CustomerOrder = 55;
  // static CustomerDetail = 56;
  // static CustomerCommunitionTable = 57;
  static ArticleSetInvolvedCampaignTable = 58;
  static FileAttachement = 59;
  static CustomerDataEntry = 60;
  static OrderDataEntry = 61;
  static CustomerCommunicationDataEntry = 62;
  static ArticleGrid = 63;
  static CustomerAddress = 64;
  static OrderTotalSummary = 65;
  static ImageZoomer = 66;
  static ScanningStatus = 67;
  static PaymentType = 68;
  // static TranslationWidget = 69;
  // static TranslationWidget = 70;
  // static TranslationWidget = 71;
  // static TranslationWidget = 72;
  static CustomerHistory = 73;
  static NewInvoice = 74;
  // static CustomerOrder = 75;
  static OrderByCategory = 76;
  static ReturnPaymentWidget = 77;
  static GetInvoiceNumber = 78;
  static PaymentDetails = 79;
  static ArticleDetails = 80;
  static ArticleOrder = 81;
  static BlockOderbyCategory = 84;
  static RefundInfo = 85;
  static BlockOder = 86;
  static OrderDetail = 87;
  static PaymentDetail = 88;
  static ArticleDetail = 89;
  static TableWarehouseMovement = 90;
  static WarehouseMovementDetail = 91;
  static MovedArticle = 92;
  static ArrivedArticle = 93;
  static StockArticle = 94;
  static Cost = 95;
  static FileExplorer = 96;
  static ArticleHistory = 97;
  static Doublette = 98;
  static StockCorrectionDetail = 99;
  static StockCorrectionTable = 100;
  static OrderSummary = 101;
  static OrderListSummary = 102;
  static ArticleSalesTable = 103;
  static UserList = 104;
  static RepositoryName = 106;
  static RepositoryDetail = 107; //Has IdRepWidgetType = 3
  static MatchingTool = 109;

  static MailingParameters = 111;
  static ProductParameter = 112;
  static GlobalParameter = 113;
  static PostShippingCosts = 114;

  static CustomerStatus = 116;
  static CustomerBusinessStatus = 117;

  static FilterCondition = 121;
  static ReportType = 122;
  static RecentStatistic = 123;
  static CustomerDoublette = 124;
  static OrderDetailDataEntry = 125;
  static PrinterControl = 126;
  static CountryCustomerDoublette = 144;
  static ChartWidget = 149;
  static MailingReturn = 152;
  static ImportDataMatrix = 153;
  static ExportBlockedCustomer = 154;
  static EditPaymentType = 159;
  static SystemTranslateText = 160;
  static ImportInvoicePayment = 163;
  static SavLetterTemplate = 164;
  static PrinterAndConfirm = 167;

  static NoteForm = 10042;
}

@Injectable()
export class UpdatePasswordResultMessageEnum {
  static INVALID = 'Invalid Password';
  static FAILED = 'Failed';
  static SUCCESS = 'Successfully';
}

@Injectable()
export class LocalStorageKey {
  static OrderDataEntry_FormControlValue: string = 'ODE-FormValue';
  static LocalStorageGSTabKey = '__gs.tab';
  static LocalStorageGSModuleKey = '__gs.module';
  static LocalStorageGSStepKey = '__gs.step';
  static LocalStorageGSParkedItemsKey = '__gs.parkedItems';
  static LocalStorageGSModuleSettingKey = '__gs.moduleSetting';
  static LocalStorageGSFields = '__gs.fields';
  static LocalStorageGSFieldCondition = '__gs.fieldCondition';
  static LocalStorageGSProcessDataKey = '__gs.processData';
  static LocalStorageWidgetActionKey = '__widget.action';
  static LocalStorageWidgetContentDetailKey = '__widget.widgetContentDetail';
  static LocalStorageWidgetPropertyKey = '__widget.widgetProperty';
  static LocalStorageWidgetTempPropertyKey = '__widget.widgetTempProperty';
  static LocalStorageWidgetOriginalPropertyKey =
    '__widget.widgetOriginalProperty';
  static LocalStorageWidgetRowDataFromPopup = '__widget.rowDataFromPopup';

  static buildKey(key1: string, key2: string) {
    return key1 + ':' + key2;
  }
}

export enum AccessRightTypeEnum {
  Module = 'Module',
  SubModule = 'SubModule',
  Tab = 'Tab',
  Widget = 'Widget',
  WidgetMenuStatus = 'WidgetMenuStatus',
  AdditionalInfo = 'AdditionalInfo',
  ParkedItem = 'ParkedItem',
  TabButton = 'TabButton',
  WidgetButton = 'WidgetButton',
}

export enum AccessRightKeyEnum {
  SettingMenu__Menu_Skin = 'AR__SettingMenu__Menu_Skin',
  SettingMenu__Menu_GlobalSetting = 'AR__SettingMenu__Menu_GlobalSetting',
  SettingMenu__Menu_WidgetCustomization = 'AR__SettingMenu__Menu_WidgetCustomization',
  SettingMenu__Menu_DesignPageLayout = 'AR__SettingMenu__Menu_DesignPageLayout',
  SettingMenu__Menu_ApplyWidgetSetting = 'AR__SettingMenu__Menu_ApplyWidgetSetting',
  SettingMenu__Menu_ModuleLayoutSetting = 'AR__SettingMenu__Menu_ModuleLayoutSetting',
}

export enum AccessRightWidgetCommandButtonEnum {
  ToolbarButton = 'ToolbarButton',
  // ToolbarButton__EditButton = 'ToolbarButton__EditButton',
  ToolbarButton__TranslateButton = 'ToolbarButton__TranslateButton',
  ToolbarButton__FieldTranslateButton = 'ToolbarButton__FieldTranslateButton',
  ToolbarButton__PrintButton = 'ToolbarButton__PrintButton',
  ToolbarButton__UploadButton = 'ToolbarButton__UploadButton',
  ToolbarButton__EditTemplateButton = 'ToolbarButton__EditTemplateButton',
  // ToolbarButton__DeleteFileButton = 'ToolbarButton__DeleteFileButton',
  SettingButton = 'SettingButton',
  SettingButton__ShowDataSettingMenu = 'SettingButton__ShowDataSettingMenu',
  SettingButton__SettingMenu = 'SettingButton__SettingMenu',
  SettingButton__DetailMenu = 'SettingButton__DetailMenu',
  SettingButton__DetailMenu__ShowDataSettingMenu = 'SettingButton__DetailMenu__ShowDataSettingMenu',
  SettingButton__DetailMenu__SettingMenu = 'SettingButton__DetailMenu__SettingMenu',
  SettingButton__TableMenu = 'SettingButton__TableMenu',
  SettingButton__TableMenu__ShowDataSettingMenu = 'SettingButton__TableMenu__ShowDataSettingMenu',
  SettingButton__TableMenu__SettingMenu = 'SettingButton__TableMenu__SettingMenu',
}

export enum AccessRightParkedItemActionEnum {
  DisplayFieldPanel = 'DisplayFieldPanel',
  DisplayFieldPanel__DeleteAllButton = 'DisplayFieldPanel__DeleteAllButton',
  Edit = 'Edit', //Inluces: Draggable, Droppable, Delete, AddFromGlobalSearch, RemoveFromGlobalSearch

  Draggable = 'Draggable', //change position between items in list
  Droppable = 'Droppable', //drag from Global search into ParkedPanel
  Delete = 'Delete',
  AddFromGlobalSearch = 'AddFromGlobalSearch', //context menu of Global search
  RemoveFromGlobalSearch = 'RemoveFromGlobalSearch', //context menu of Global search
}

export enum PaymentTypeGroupEnum {
  Cash = 1,
  Cheque = 2,
  CreditCard = 3,
  PostBank = 4,
}

export enum PaymentTypeIdEnum {
  //Group Cash
  Cash = 1,
  CreditCardAlreadyPaid = 5,
  OpenInvoice = 6,

  //Group Cheque
  Cheque = 2,
  MoneyOrder = 7,

  //Group CreditCard
  CreditCard = 3,

  // Group PostBank
  Post = 8,
  Bank = 9,
}

export enum DefaultRowHeight {
  RowHeight = 28,
}

export enum CustomCellRender {
  CountryFlagCellRenderer = 'countryflag',
}

export enum ColumnVirtualisation {
  ColumnNumber = 42,
}

export enum WidgetTableName {
  CustomerOrder = 'Customer Order',
}

export enum KeyCode {
  Enter = 13,
  Escape = 27,
}

export enum OrderFailedDataEnum {
  ScanningData = 1,
  Order = 2,
  CustomerData = 3,
  TotalSummaryData = 4,
  PaymentType = 5,
  ArticleGrid = 6, //ArticleGridExportData & ArticleGridCampaignData: Articles used in this campaign
  CommunicationData = 7,
}

export enum QueryObject {
  OrdersRules = 1,
  ExtendRules = 2,
}

@Injectable()
export class RuleEnum {
  static Blacklist = 1;
  static Orders = 2;
  static OrdersGroup = 3;
  static ExtendedRules = 4;
}

@Injectable()
/*
Checking data follow database id with
idRepWidgetApp = 503: Age Filter widget
idRepWidgetApp = 504: Black List widget
idRepWidgetApp = 506: Extended Filter widget
idRepWidgetApp = 507: Group Priority widget

If database change those id that must be updated

Black list = 1
Age Filter = 2
OrdersGroup = 3
ExtendedRules = 4
*/
export class MapFromWidgetAppToFilterId {
  static 503 = 2;
  static 509 = 2;
  static 511 = 2;
  static 504 = 1;
  static 506 = 4;
  static 510 = 4;
  static 507 = 3;
}

// When change Id from Database need to change these Items in WidgetApp table.
export enum LogicItemsId {
  AgeFilter = 503,
  CountryBlackList = 504,
  DatabaseCombine = 505,
  ExtendedFilter = 506,
  GroupPriority = 507,
  AgeFilter_Extend = 509,
  ExtendedFilter_Extend = 510,
}
export enum SystemScheduleServiceName {
  OrdersSummary = 1,
  ArticleResidueStatistic = 2,
  WarehouseStatistic = 3,
  PrintingService = 4,
  DoubletService = 5,
  ElasticSearchSyncService = 6,
  RunSchedulerService = 7,
  MediaCodeStatistic = 8,
  MissingWordReport = 9,
  CallStoreProcedureService = 10,
}

export enum PersonTypeIdEnum {
  None = 0,
  Customer = 28,
  Contact = 29,
  Broker = 4,
  CashProvider = 5,
  DesktopProvider = 24,
  FreightProvider = 22,
  Mandant = 1,
  Principal = 2,
  PostProvider = 21,
  PrintProvider = 10,
  Provider = 3,
  ScanCenter = 27,
  ServiceProvider = 6,
  Supplier = 19,
  Warehouse = 7,
}

export enum SignalRTypenEnum {
  WidgetForm = 'WidgetForm',
  ES = 'ES',
  MatchingData = 'MatchingData',
  ImportDataMatrix = 'ImportDataMatrix',
  DesignLayout = 'DesignLayout',
  ImportInvoicePayment = 'ImportInvoicePayment',
  RCWord2Pdf = 'RCWord2Pdf', // Replace and Convert word to pdf
}

export enum SignalRJobEnum {
  //Common
  Disconnected = 'Disconnected',

  // Wigdet Form Detail
  Editing = 'Editing',

  // ES
  ES_ReIndex = 'ES_ReIndex',

  // Matching Data
  MatchingData = 'MatchingData',

  // Import DataMatrix
  ImportDataMatrix = 'ImportDataMatrix',

  // Design Layout
  DesignLayout = 'DesignLayout',

  // Import InvoicePayment
  ImportInvoicePayment = 'ImportInvoicePayment',

  // Replace and Convert word to pdf
  RCWord2Pdf = 'RCWord2Pdf',
}

export enum SignalRActionEnum {
  //#region Wigdet Form Detail
  ConnectEditing = 'ConnectEditing',
  StopEditing = 'StopEditing',
  DisconnectEditing = 'DisconnectEditing',
  IsThereAnyoneEditing = 'IsThereAnyoneEditing',
  SavedSuccessfully = 'SavedSuccessfully',
  //#endregion

  //#region ES_ReIndex
  ES_ReIndex_Ping = 'ES_ReIndex_Ping', // Call to ping
  ES_ReIndex_ServiceAlive = 'ES_ReIndex_ServiceAlive', // Service keep live
  ES_ReIndex_Start = 'ES_ReIndex_Start', // Call start processing
  ES_ReIndex_StartSuccessfully = 'ES_ReIndex_StartSuccessfully', // Get all indexes that need to process
  ES_ReIndex_Stop = 'ES_ReIndex_Stop', // Call stop processing
  ES_ReIndex_StopSuccessfully = 'ES_ReIndex_StopSuccessfully', // Stop processing and return all indexes
  ES_ReIndex_GetStateOfSyncList = 'ES_ReIndex_GetStateOfSyncList', // Return all indexes
  ES_ReIndex_SyncCompleted = 'ES_ReIndex_SyncCompleted', // Synchronize successfully: Return all indexes
  ES_ReIndex_ShowMessage = 'ES_ReIndex_ShowMessage', // Only show message

  //Actions when synchronizing each Index
  ES_ReIndex_DBProcess = 'ES_ReIndex_DBProcess', // Repair get data from DB each of Index
  ES_ReIndex_DBDisconnect = 'ES_ReIndex_DBDisconnect', // Get data fail
  ES_ReIndex_SyncProcess = 'ES_ReIndex_SyncProcess', // Get data success and start to synchronize
  ES_ReIndex_SyncProcessState = 'ES_ReIndex_SyncProcessState', // Return percent when synchronizing
  ES_ReIndex_SyncProcessFinished = 'ES_ReIndex_SyncProcessFinished', // Synchronization one index is completed
  //#endregion

  //#region Matching Data
  MatchingData_Ping = 'MatchingData_Ping', // Call to ping
  MatchingData_ServiceAlive = 'MatchingData_ServiceAlive', // Service keep live
  MatchingData_Start = 'MatchingData_Start', // Start the matching data
  MatchingData_StartSuccessfully = 'MatchingData_StartSuccessfully', // Start successfully the matching data
  MatchingData_Stop = 'MatchingData_Stop', // Start the matching data
  MatchingData_StopSuccessfully = 'MatchingData_StopSuccessfully', // Stop the process successfully
  MatchingData_GetProcessingList = 'MatchingData_GetProcessingList', // Get processing list
  MatchingData_Processsing = 'MatchingData_Processsing', // Processing data
  MatchingData_Fail = 'MatchingData_Fail', // Processing data is fail
  MatchingData_Success = 'MatchingData_Success', // Processing data is successfully
  MatchingData_Finish = 'MatchingData_Finish', // Processing data is finished
  //#endregion

  //#region Import Data Matrix
  ImportDataMatrix_Ping = 'ImportDataMatrix_Ping', // Call to ping
  ImportDataMatrix_ServiceAlive = 'ImportDataMatrix_ServiceAlive', // Service keep live
  ImportDataMatrix_Start = 'ImportDataMatrix_Start', // Start
  ImportDataMatrix_StartSuccessfully = 'ImportDataMatrix_StartSuccessfully', // Start successfully
  ImportDataMatrix_Stop = 'ImportDataMatrix_Stop', // Start
  ImportDataMatrix_StopSuccessfully = 'ImportDataMatrix_StopSuccessfully', // Stop the process successfully
  ImportDataMatrix_GetProcessingList = 'ImportDataMatrix_GetProcessingList', // Get processing list
  ImportDataMatrix_Processsing = 'ImportDataMatrix_Processsing', // Processing data
  ImportDataMatrix_Fail = 'ImportDataMatrix_Fail', // Processing data is fail
  ImportDataMatrix_Success = 'ImportDataMatrix_Success', // Processing data is successfully for each file
  ImportDataMatrix_Finish = 'ImportDataMatrix_Finish', // Processing data is finished for all files
  //#endregion

  //#region DesignLayout
  DesignLayout_IsThereAnyoneEditing = 'DesignLayout_IsThereAnyoneEditing', // Call to check whether there is anyone Editing
  DesignLayout_ConnectEditing = 'DesignLayout_ConnectEditing', // Connect Editing
  DesignLayout_StopEditing = 'DesignLayout_StopEditing', // Stop Editing
  DesignLayout_SavedSuccessfully = 'DesignLayout_SavedSuccessfully',
  //#endregion

  //#region Import Invoice Payment
  ImportInvoicePayment_Ping = 'ImportInvoicePayment_Ping', // Call to ping
  ImportInvoicePayment_ServiceAlive = 'ImportInvoicePayment_ServiceAlive', // Service keep live
  ImportInvoicePayment_Start = 'ImportInvoicePayment_Start', // Start
  ImportInvoicePayment_StartSuccessfully = 'ImportInvoicePayment_StartSuccessfully', // Start successfully
  ImportInvoicePayment_Stop = 'ImportInvoicePayment_Stop', // Start
  ImportInvoicePayment_StopSuccessfully = 'ImportInvoicePayment_StopSuccessfully', // Stop the process successfully
  ImportInvoicePayment_GetProcessingList = 'ImportInvoicePayment_GetProcessingList', // Get processing list
  ImportInvoicePayment_Processsing = 'ImportInvoicePayment_Processsing', // Processing data
  ImportInvoicePayment_Fail = 'ImportInvoicePayment_Fail', // Processing data is fail
  ImportInvoicePayment_Success = 'ImportInvoicePayment_Success', // Processing data is successfully for each file
  ImportInvoicePayment_Finish = 'ImportInvoicePayment_Finish', // Processing data is finished for all files
  ImportInvoicePayment_FileAction = 'ImportInvoicePayment_FileAction', // Message after file processed

  ImportInvoicePayment_ImportFile = 'ImportInvoicePayment_ImportFile', // ImportFile
  ImportInvoicePayment_ImportFileFinish = 'ImportInvoicePayment_ImportFileFinish', // ImportFile Finish
  //#endregion

  //#region RCWord2Pdf
  RCWord2Pdf_Ping = 'RCWord2Pdf_Ping', // Call to ping
  RCWord2Pdf_ServiceAlive = 'RCWord2Pdf_ServiceAlive', // Service keep live
  RCWord2Pdf_Start = 'RCWord2Pdf_Start', // Start
  RCWord2Pdf_StartSuccessfully = 'RCWord2Pdf_StartSuccessfully', // Start successfully
  RCWord2Pdf_Stop = 'RCWord2Pdf_Stop', // Stop
  RCWord2Pdf_StopSuccessfully = 'RCWord2Pdf_StopSuccessfully', // Stop the process successfully
  RCWord2Pdf_GetProcessingList = 'RCWord2Pdf_GetProcessingList', // Get processing list
  RCWord2Pdf_Processsing = 'RCWord2Pdf_Processsing', // Processing data
  RCWord2Pdf_Fail = 'RCWord2Pdf_Fail', // Processing data is fail
  RCWord2Pdf_Success = 'RCWord2Pdf_Success', // Success for each queue
  RCWord2Pdf_Finish = 'RCWord2Pdf_Finish', // Finally all queue
  RCWord2Pdf_ProcessForODE = 'RCWord2Pdf_ProcessForODE', // Process for ODE
  //#endregion
}

export enum PropertyNameOfWidgetProperty {
  ComboboxStoreObject = 'comboboxStoreObject',
  LinkWidgetTitleId = 'LinkWidgetTitle',
}

export class GridId {
  static MainModuleGlobalSearch = [
    'f254cd5a-da85-4a39-be83-454f1e2beca4',
    'd594c5ae-d43f-4e0a-8e40-61e066bab837',
    'bfdf42aa-81a6-4aa6-bd16-a2ea779de3d0',
    '415f0a43-bd3a-4046-86a0-552a42320e73',
    '307a35a6-5906-467f-8dd6-b2e645dfb62d',
    '326a40b1-136d-4797-97dc-bb826e99c2bd',
    'd42f77a7-10a9-4f9b-8284-806ac55201bb',
    '40f0ba43-183e-4328-b6f6-68d1ec42ee7a',
    'a1e4d2ae-1947-4059-9070-bcea6a0757f2',
    '2713c60d-5164-4813-a55e-84166bb9cd3f',
    '9cacf7e2-3ae7-4f89-9237-1eb4a8dad240',
    'b9cdd041-0a34-476b-a52a-767e62d93f94',
    '29442b0b-39e7-424c-b94b-75deee7a9262',
    '7e8d7076-e521-4e00-9e29-bb92f38b7e69',
  ];
  static SubAdminModuleGlobalSearch = [
    '4e0e0a1f-a66f-4d59-827a-965987d006b9',
    'b775746d-0352-4cce-af00-8c201dc45fc1',
    '1a1cbff9-0895-4dc1-a400-c552519f53d1',
    '91226f42-fdaf-4494-88c9-5c1b5104e646',
    '0dfcf9bd-b747-4a40-870c-b8760b2e4298',
    'be6242df-fb85-4399-ba25-702630555664',
    '662295a8-920f-4842-95c8-12850582ef8f',
    '1427a6a6-a1ea-4439-b184-8a5a9239de58',
    '679169ce-5c6c-4b9d-a58e-dd9374b6d156',
    'd419044d-fd2f-46fb-8f44-7141164d68a9',
    'ff800217-fa30-4d6e-9b17-5825a6d35c95',
    'f16c2cc5-9442-4202-a5a5-652a30ca347a',
    'bc217e42-ca1e-4cb7-b828-f33b834eb276',
  ];
  static SelectionCampaignModuleGlobalSearch = [
    '46581465-78a1-4735-8013-2006b52d3493',
    '51bb854d-8b91-47e7-82f1-ff0cde5ad1df',
  ];
  static SelectionBrokerModuleGlobalSearch = [
    'cdd647ed-a7e7-4b0f-b4c7-2cf1d3759d71',
    '8d8bc02c-86ef-425e-a2fc-777ac0c0f24a',
  ];
  static SelectionCollectModuleGlobalSearch = [
    'b964a7b6-f220-44ff-a02c-f233b29609a3',
    'bc95edb9-ef40-4059-a436-8113c7630b62',
  ];
}

export class ModuleConfiguration {
  static Icon = {
    '1': 'fa-user-secret',
    '2': 'fa-users',
    '3': 'fa-newspaper-o',
    '4': 'fa-umbrella',
    '5': 'fa-calendar',
    '6': 'fa-calculator',
    '7': 'fa-list-alt',
    '8': 'fa-bar-chart-o',
    '9': 'fa-wrench',
    '10': 'fa-check-square-o',
    '24': 'fa-ban',
    '25': 'fa-mail-reply-all',
    '26': 'fa-clone',
    '27': 'fa-truck',
    '28': 'fa-shopping-cart',
    '29': 'fa-exchange',
    '30': 'fa-money',
    '31': 'fa-line-chart',
    '32': 'fa-home',
    '35': 'fa-random',
    '36': 'fa-print',
    '37': 'fa-check-circle-o',
    '38': 'fa-cog',
    '39': 'fa-bar-chart-o',
    '40': 'fa-plus-circle',
    '41': 'fa-umbrela',
    '46': 'fa-envelope-o',
    '97': 'fa-umbrella',
    '98': 'fa-exchange',
    '99': 'fa-newspaper-o',
  };
}

export enum WarehouseMovementFormEnum {
  None = '',
  SortingGood = 'SortingGood',
}

export enum DefaultWidgetItemConfiguration {
  WidgetForm = '[{"id":"WidgetForm","name":"WidgetForm","disabled":false,"collapsed":true,"dataType":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean"},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String"}]}]},{"id":"Appearance","name":"Appearance","disabled":false,"collapsed":true,"dataType":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","disabled":false,"collapsed":true,"dataType":"String","children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean"},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color"}]},{"id":"WidgetTitle","name":"WidgetTitle","disabled":false,"collapsed":true,"dataType":"String","children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String"}]},{"id":"WidgetBackgroundStyle","name":"Background Style","disabled":false,"collapsed":true,"dataType":"String","children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset"},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color"},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery"},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String"}]}]},{"id":"Behavior","name":"Behavior","disabled":false,"collapsed":true,"dataType":null,"children":[{"id":"DisplayField","name":"DisplayField","disabled":false,"collapsed":true,"dataType":"MultiSelect","options":[],"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object"}]},{"id":"DropdownBehavior","name":"Dropdown Behavior","disabled":false,"collapsed":true,"dataType":"String","children":[{"id":"ApplyOnWidget","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean"},{"id":"ShowDropDownOfField","name":"Show dropdown when focus on field","value":null,"disabled":false,"collapsed":true,"options":[],"dataType":"ShowDropDownOfField"}]},{"id":"DesignColumnsOnWidget","name":"Design Columns On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean"},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"visible":false,"collapsed":true,"dataType":"Order"},{"id":"ControlColumnPanel","name":"ControlColumnPanel","value":"[]","disabled":true,"visible":false,"collapsed":true,"dataType":"ControlColumnPanel"},{"id":"DOBFormatByCountry","name":"DOB Format base on country","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean"}]}]',
  WidgetTable = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowBackground","name":"RowBackground","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyRowBackground","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleOddBackground","name":"Odd Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleEvenBackground","name":"Even Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleBorder","name":"Border Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"ControlColumnPanel","name":"ControlColumnPanel","value":"[]","disabled":true,"visible":false,"collapsed":true,"dataType":"ControlColumnPanel","options":null,"children":[]},{"id":"TableBehavior","name":"Table Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"ShowTotalRow","name":"Show Total Row","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"Position","name":"Position","value":"Both","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Top","value":"Top"},{"key":"Bottom","value":"Bottom"},{"key":"Both","value":"Both"}],"children":[]},{"id":"BackgroundTotalRow","name":"Background","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"TextColorTotalRow","name":"TextColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"MultipleRowDisplay","name":"Multiple Row Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSwitchToDetail","name":"Auto switch to detail","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DesignColumnsOnWidget","name":"Design Columns On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowGrouping","name":"Row Grouping","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"Pivoting","name":"Pivoting","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ColumnFilter","name":"Column Filter","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"DetailBehavior","name":"Detail Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetType","name":"WidgetType","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"DisplayField","name":"DisplayField","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]}]}]}]',
  WidgetEditTable = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowBackground","name":"RowBackground","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyRowBackground","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleOddBackground","name":"Odd Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleEvenBackground","name":"Even Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleBorder","name":"Border Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"ShowTotalRow","name":"Show Total Row","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"Position","name":"Position","value":"Both","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Top","value":"Top"},{"key":"Bottom","value":"Bottom"},{"key":"Both","value":"Both"}],"children":[]},{"id":"BackgroundTotalRow","name":"Background","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"TextColorTotalRow","name":"TextColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]},{"id":"MultipleRowDisplay","name":"Multiple Row Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowGrouping","name":"Row Grouping","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"Pivoting","name":"Pivoting","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ColumnFilter","name":"Column Filter","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DOBFormatByCountry","name":"DOB Format base on country","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DropdownBehavior","name":"Dropdown Behavior","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyOnWidget","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowDropDownOfField","name":"Show dropdown when focus on field","value":null,"disabled":false,"collapsed":true,"dataType":"ShowDropDownOfField","options":[],"children":[]}]}]}]',
  Combination = '[{"id":"WidgetCompile","name":"WidgetCompile","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":true,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayField","name":"DisplayField","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"DropdownBehavior","name":"Dropdown Behavior","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyOnWidget","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowDropDownOfField","name":"Show dropdown when focus on field","value":null,"disabled":false,"collapsed":true,"dataType":"ShowDropDownOfField","options":[],"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ImportantFields","name":"ImportantFields","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ImportantDisplayFields","name":"DisplayFields","value":null,"collapsed":true,"disabled":false,"options":null,"dataType":"MultiSelect","children":[]},{"id":"ImportantAppearance","name":"Appearance","value":null,"collapsed":true,"disabled":false,"dataType":null,"options":null,"children":[{"id":"ImportantLabelStyle","name":"LabelStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantLabelStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantLabelStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ImportantDataStyle","name":"DataStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantDataStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantDataStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]}]}]',
  CombinationCreditCard = '[{"id":"WidgetForm","name":"WidgetForm","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetType","name":"WidgetType","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"DisplayField","name":"DisplayField","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]}]},{"id":"ImportantFields","name":"ImportantFields","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ImportantDisplayFields","name":"DisplayFields","value":null,"collapsed":true,"disabled":false,"options":null,"dataType":"MultiSelect","children":[]},{"id":"ImportantAppearance","name":"Appearance","value":null,"collapsed":true,"disabled":false,"dataType":null,"options":null,"children":[{"id":"ImportantLabelStyle","name":"LabelStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantLabelStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantLabelStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ImportantDataStyle","name":"DataStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantDataStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantDataStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]}]}]',
  CountryAndUploadTreeView = '[{"id":"WidgetForm","name":"WidgetForm","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"LabelStyle","name":"LabelStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"LabelStyleAlign","name":"Align","value":"Right","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"LabelStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"LabelStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"LabelStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"LabelStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LabelStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LabelStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"DataStyle","name":"DataStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"DataStyleAlign","name":"Align","value":"Left","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"DataStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"DataStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"DataStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"DataStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DataStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DataStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetType","name":"WidgetType","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"DisplayField","name":"DisplayField","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]}]},{"id":"ImportantFields","name":"ImportantFields","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ImportantDisplayFields","name":"DisplayFields","value":null,"collapsed":true,"disabled":false,"options":null,"dataType":"MultiSelect","children":[]},{"id":"ImportantAppearance","name":"Appearance","value":null,"collapsed":true,"disabled":false,"dataType":null,"options":null,"children":[{"id":"ImportantLabelStyle","name":"LabelStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantLabelStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantLabelStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantLabelStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantLabelStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ImportantDataStyle","name":"DataStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ImportantDataStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ImportantDataStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"ImportantDataStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ImportantDataStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]}]}]',
  OrderDataEntry = '[{"id":"OrderType","name":"Order Type","value":"","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"1","value":"Ordered"},{"key":"2","value":"Gamer"},{"key":"3","value":"Requester"}],"children":[]}]',
  Translation = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":true,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]}]}]',
  BlankWidget = '[{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]}]',
  FieldSetReadonly = '[{"id":"WidgetForm","name":"WidgetForm","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"LabelStyle","name":"LabelStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"LabelStyleAlign","name":"Align","value":"Right","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"LabelStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"LabelStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"LabelStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"LabelStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LabelStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LabelStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LabelStyleLineHeight","name":"LineHeight","value":"1.1","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"1.1","value":"1.1"},{"key":"1.2","value":"1.2"},{"key":"1.3","value":"1.3"},{"key":"1.4","value":"1.4"},{"key":"1.5","value":"1.5"},{"key":"2.0","value":"2.0"},{"key":"2.5","value":"2.5"},{"key":"3.0","value":"3.0"},{"key":"3.5","value":"3.5"},{"key":"4.0","value":"4.0"}],"children":[]}]},{"id":"DataStyle","name":"DataStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"DataStyleAlign","name":"Align","value":"Left","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"DataStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"DataStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"DataStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"DataStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DataStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DataStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetType","name":"WidgetType","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"DisplayField","name":"DisplayField","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]}]}]',
  Doublette = '[{"id":"WidgetForm","name":"WidgetForm","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Matching Data","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"RowBackground","name":"RowBackground","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyRowBackground","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleOddBackground","name":"Odd Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleEvenBackground","name":"Even Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleBorder","name":"Border Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]}]}]',
  EditableRoleTreeGrid = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"RowBackground","name":"RowBackground","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyRowBackground","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleOddBackground","name":"Odd Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleEvenBackground","name":"Even Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleBorder","name":"Border Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":true,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]},{"id":"MultipleRowDisplay","name":"Multiple Row Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]',
  FileExplorerWithLabel = '[{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"ExternalParam","name":"ExternalParam","value":"","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]',
  TableWithFilter = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":true,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"OrderByField","name":"OrderByField","value":null,"disabled":false,"collapsed":true,"dataType":"Order","options":null,"children":[]},{"id":"MultipleRowDisplay","name":"Multiple Row Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowTotalRow","name":"Show Total Row","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]',
  ReturnRefund = '[{"id":"WidgetTable","name":"WidgetTable","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Title...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"HeaderStyle","name":"HeaderStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"HeaderStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"HeaderStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"HeaderStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"HeaderStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"RowStyle","name":"RowStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"RowStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[],"children":[]},{"id":"RowStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"DisplayColumn","name":"DisplayColumn","value":null,"disabled":false,"collapsed":true,"dataType":"MultiSelect","options":null,"children":[{"id":"ShowData","name":"ShowData","value":0,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]},{"id":"ShowTotalRow","name":"Show Total Row","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"Position","name":"Position","value":"Both","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Top","value":"Top"},{"key":"Bottom","value":"Bottom"},{"key":"Both","value":"Both"}],"children":[]},{"id":"BackgroundTotalRow","name":"Background","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"TextColorTotalRow","name":"TextColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"IsFitWidthColumn","name":"IsFitWidthColumn","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LayoutSetting","name":"LayoutSetting","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]},{"id":"MultipleRowDisplay","name":"Multiple Row Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"AutoSaveLayout","name":"Auto Save Layout","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowGrouping","name":"Row Grouping","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"Pivoting","name":"Pivoting","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ColumnFilter","name":"Column Filter","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DOBFormatByCountry","name":"DOB Format base on country","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]',
  SynchronizeElasticsSearch = '[{"id":"WidgetForm","name":"WidgetForm","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"ContactList","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetStyle","name":"WidgetStyle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"WidgetStyleBorder","name":"Border","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WidgetStyleBorderColor","name":"Border Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Elastic Search Re-Index","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"RowBackground","name":"RowBackground","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ApplyRowBackground","name":"Apply On Widget","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"RowStyleOddBackground","name":"Odd Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleEvenBackground","name":"Even Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"RowStyleBorder","name":"Border Row","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]}]}]',
  Chart = '[{"id":"ChartWidget","name":"Chart Widget","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DataSourceObject","name":"Data source Object","value":null,"disabled":false,"collapsed":true,"dataType":"Object","comboboxStoreObject":"ChartDataSourceObject","children":[],"options":[]},{"id":"LinkWidgetTitle","name":"Data source Object","value":null,"disabled":true,"collapsed":true,"dataType":"String","children":[],"visible":false,"options":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"Chart Widget","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetBackgroundStyle","name":"Background Style","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ResetBackground","name":"Reset Background","value":null,"disabled":false,"collapsed":true,"dataType":"Button","title":"Reset","options":[],"children":[]},{"id":"WidgetStyleBackgroundColor","name":"Background Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":[],"children":[]},{"id":"WidgetBackgroundStyleGradientColor","name":"Gradient Color","value":null,"disabled":false,"collapsed":true,"dataType":"ShowGradientColor","options":[],"typeGradient":null,"directionGradient":null,"children":[]},{"id":"WidgetBackgroundStyleImage","name":"Background Image","value":null,"disabled":false,"collapsed":true,"dataType":"ShowImageGallery","options":[],"children":[]},{"id":"OpacityImage","name":"Opacity Image","value":"0.5","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"ChartOptions","name":"Chart Options","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[{"id":"ChartType","name":"Chart Type","value":"Vertical Bar Chart","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Bar Charts","value":"Bar Charts","isHeader":true},{"key":"Vertical Bar Chart","value":"Vertical Bar Chart"},{"key":"Horizontal Bar Chart","value":"Horizontal Bar Chart"},{"key":"Grouped Vertical Bar Chart","value":"Grouped Vertical Bar Chart"},{"key":"Grouped Horizontal Bar Chart","value":"Grouped Horizontal Bar Chart"},{"key":"Stacked Vertical Bar Chart","value":"Stacked Vertical Bar Chart"},{"key":"Stacked Horizontal Bar Chart","value":"Stacked Horizontal Bar Chart"},{"key":"Normalized Vertical Bar Chart","value":"Normalized Vertical Bar Chart"},{"key":"Normalized Horizontal Bar Chart","value":"Normalized Horizontal Bar Chart"},{"key":"Pie Charts","value":"Pie Charts","isHeader":true},{"key":"Pie Chart","value":"Pie Chart"},{"key":"Advanced Pie Chart","value":"Advanced Pie Chart"},{"key":"Pie Grid","value":"Pie Grid"},{"key":"Area And Line Chart","value":"Area And Line Chart","isHeader":true},{"key":"Line Chart","value":"Line Chart"},{"key":"Area Chart","value":"Area Chart"},{"key":"Stacked Area Chart","value":"Stacked Area Chart"},{"key":"Normalized Area Chart","value":"Normalized Area Chart"},{"key":"Other Charts","value":"Other Charts","isHeader":true},{"key":"Combo Chart","value":"Combo Chart"}],"children":[]}]},{"id":"ChartSeries","name":"Chart Series","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"SingleXSerie","name":"X Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"SingleYSerie","name":"Y Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"MultiXSerie","name":"X Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"MultiYSeries","name":"Y Series","value":[],"disabled":false,"collapsed":true,"visible":false,"dataType":"MultiSelectCombobox","options":null,"children":[]},{"id":"ComboSingleXSerie","name":"Line X Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"ComboSingleYSerie","name":"Line Y Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"ComboMultiXSerie","name":"Bar X Serie","value":null,"disabled":false,"collapsed":true,"visible":false,"dataType":"Object","options":null,"children":[]},{"id":"ComboMultiYSeries","name":"Bar Y Series","value":[],"disabled":false,"collapsed":true,"visible":false,"dataType":"MultiSelectCombobox","options":null,"children":[]}]},{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Widget Tittle...","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"ColorScheme","name":"Color Scheme","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ColorChart","name":"Color Chart","value":"vivid","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"vivid","value":"vivid"},{"key":"natural","value":"natural"},{"key":"cool","value":"cool"},{"key":"fire","value":"fire"},{"key":"solar","value":"solar"},{"key":"air","value":"air"},{"key":"aqua","value":"aqua"},{"key":"flame","value":"flame"},{"key":"ocean","value":"ocean"},{"key":"forest","value":"forest"},{"key":"horizon","value":"horizon"},{"key":"neons","value":"neons"},{"key":"picnic","value":"picnic"},{"key":"night","value":"night"},{"key":"nightLights","value":"nightLights"}],"children":[]}]}]},{"id":"Behavior","name":"Behavior","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"BarChartBehavior","name":"Bar Chart","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ShowX","name":"Show X Axis","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowY","name":"Show Y Axis","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowGridLines","name":"Show Grid Lines","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"Gradients","name":"Use Gradients","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowLegend","name":"Show Legend","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LegendTitle","name":"Legend Title","value":"Legend","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ShowXAxisLabel","name":"Show X Axis Label","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"XAxisLabel","name":"X Axis Label","value":"Value","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"DisableTooltip","name":"Disable tooltip","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowYAxisLabel","name":"Show Y Axis Label","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"YAxisLabel","name":"Y Axis Label","value":"Number","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"PaddingBetweenBars","name":"Padding Between Bars","value":"8","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"PieChartBehavior","name":"Pie Chart","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"GradientsPie","name":"Use Gradients","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowLegendPie","name":"Show Legend","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowLabelPie","name":"Show Data Label","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"DisableTooltipPie","name":"Disable tooltip","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ExplodeSlices","name":"Explode Slices","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LegendTitlePie","name":"Legend Title","value":"Legend","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"AreaLineChartBehavior","name":"Area/Line Chart","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"ShowXAreaLine","name":"Show X Axis","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowYAreaLine","name":"Show Y Axis","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowGridLinesAreaLine","name":"Show Grid Lines","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"GradientsAreaLine","name":"Use Gradients","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowLegendAreaLine","name":"Show Legend","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LegendTitleAreaLine","name":"Legend Title","value":"Legend","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ShowXAxisLabelAreaLine","name":"Show X Axis Label","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"XAxisLabelAreaLine","name":"X Axis Label","value":"Value","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"DisableTooltipAreaLine","name":"Disable tooltip","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ShowYAxisLabelAreaLine","name":"Show Y Axis Label","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"YAxisLabelAreaLine","name":"Y Axis Label","value":"Number","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"AutoScale","name":"Auto Scale","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"Timeline","name":"Timeline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"LineInterpolation","name":"Line Interpolation","value":"Basis","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Basis","value":"Basis"},{"key":"Bundle","value":"Bundle"},{"key":"Cardinal","value":"Cardinal"},{"key":"Catmull Rom","value":"Catmull Rom"},{"key":"Linear","value":"Linear"},{"key":"Monotone X","value":"Monotone X"},{"key":"Monotone Y","value":"Monotone Y"},{"key":"Natural","value":"Natural"},{"key":"Step","value":"Step"},{"key":"Step After","value":"Step After"},{"key":"Step Before","value":"Step Before"}],"children":[]}]}]}]',
  PdfViewer = '[{"id":"PdfWidget","name":"PdfWidget","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"Pdf Widget","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Pdf Viewer","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"PdfSetting","name":"Pdf Setting","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"PdfColumn","name":"Pdf Column","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]}]}]',
  SAVSendLetter = '[{"id":"SAVSendLetterWidget","name":"SAV Send Letter Widget","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"With Widget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"Widget Name","value":"SAV Send Letter Widget","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"SAV Send Letter","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]},{"id":"SAVSendLetterSetting","name":"SAV Send Letter Setting","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"SAVListenKey","name":"SAV Listen Key","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":null,"children":[]}]}]}]',
  Column = '[{"id":"ColumnStyle","name":"Column","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ColumnStyleWidth","name":"Width (px)","value":"","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ColumnStyleLeft","name":"Padding Left (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ColumnStyleRight","name":"Padding Right (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ColumnStyleShowBorder","name":"Show Border","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ColumnStyleBorderColor","name":"Border Color","value":"","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ColumnStyleBorderStyle","name":"Border Style","value":"dotted","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"dotted","value":"dotted"},{"key":"solid","value":"solid"},{"key":"dashed","value":"dashed"},{"key":"double","value":"double"},{"key":"groove","value":"groove"},{"key":"inset","value":"inset"},{"key":"outset","value":"outset"}],"children":[]},{"id":"ColumnStyleBorderWeight","name":"Border Weight","value":"0","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ColumnStyleShowShadow","name":"Show Shadow","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ColumnStyleShadowColor","name":"Shadow Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ColumnStyleBackgroundColor","name":"BackgroundColor","value":"","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]}]',
  Panel = '[{"id":"TitleStyle","name":"Title","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"TitleStyleText","name":"TitleText","value":"New Panel","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"TitleStyleAlign","name":"Align","value":"Left","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"TitleStyleColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"TitleStyleBackgroundColor","name":"BackgroundColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"TitleStyleFontName","name":"FontName","value":"Tahoma","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Arial","value":"Arial"},{"key":"Arial Black","value":"Arial Black"},{"key":"Calibri","value":"Calibri"},{"key":"Comic Sans MS","value":"Comic Sans MS"},{"key":"Georgia","value":"Georgia"},{"key":"Helvetica","value":"Helvetica"},{"key":"Lucida Sans Unicode","value":"Lucida Sans Unicode"},{"key":"Portable User Interface","value":"Portable User Interface"},{"key":"Times New Roman","value":"Times New Roman"},{"key":"Trebuchet MS","value":"Trebuchet MS"},{"key":"Verdana","value":"Verdana"},{"key":"Tahoma","value":"Tahoma"}],"children":[]},{"id":"TitleStyleFontSize","name":"FontSize","value":"12","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"6","value":"6"},{"key":"7","value":"7"},{"key":"8","value":"8"},{"key":"9","value":"9"},{"key":"10","value":"10"},{"key":"11","value":"11"},{"key":"12","value":"12"},{"key":"13","value":"13"},{"key":"14","value":"14"},{"key":"15","value":"15"},{"key":"16","value":"16"},{"key":"17","value":"17"},{"key":"18","value":"18"},{"key":"19","value":"19"},{"key":"20","value":"20"}],"children":[]},{"id":"TitleStyleBold","name":"Bold","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"TitleStyleItalic","name":"Italic","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"TitleStyleUnderline","name":"Underline","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"TitleStyleShow","name":"Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"PanelStyle","name":"Panel","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"PanelStyleHeight","name":"Height","value":"30","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"PanelStyleAutoHeight","name":"Auto Height","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"PanelStyleLeft","name":"Padding Left (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"PanelStyleRight","name":"Padding Right (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"PanelStyleBorderShowBorder","name":"Show Border","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"PanelStyleBorderColor","name":"Border Color","value":"black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"PanelStyleBorderStyle","name":"Border Style","value":"solid","disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"dotted","value":"dotted"},{"key":"solid","value":"solid"},{"key":"dashed","value":"dashed"},{"key":"double","value":"double"},{"key":"groove","value":"groove"},{"key":"inset","value":"inset"},{"key":"outset","value":"outset"}],"children":[]},{"id":"PanelStyleBorderWeight","name":"Border Weight","value":"1","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"PanelStyleShadowShowShadow","name":"Show Shadow","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"PanelStyleShadowColor","name":"Shadow Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"PanelStyleBackgroundBackgroundColor","name":"BackgroundColor","value":"","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]},{"id":"UnderLineStyle","name":"UnderLine","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"UnderLineStyleUnderLineShow","name":"Show UnderLine","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"UnderLineStyleUnderLineColor","name":"Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"UnderLineStyleUnderLineWeight","name":"Weight","value":"1","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"UnderLineStyleShadowShow","name":"Show Shadow","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"UnderLineStyleShadowColor","name":"Shadow Color","value":"Black","disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]}]},{"id":"Behaviour","name":"Behaviour","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"BehaviourIsRow","name":"Switch Row Panel","value":false,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]',
  Field = '[{"id":"IGeneralSetting","name":"General","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"IGeneralSettingBackgroundColor","name":"BackgroundColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"IGeneralSettingVerticalAlign","name":"Vertical Align","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Top","value":"Top"},{"key":"Middle","value":"Middle"},{"key":"Bottom","value":"Bottom"}],"children":[]},{"id":"IGeneralSettingHeight","name":"Height (px)","value":"18","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"IGeneralSettingAutoHeight","name":"Auto Height","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ILabelStyle","name":"Label","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ILabelStyleJustifyContent","name":"Align","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"ILabelStyleBackgroundColor","name":"BackgroundColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ILabelStyleColor","name":"Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ILabelStyleFontName","name":"FontName","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Arial","value":"Arial"},{"key":"Arial Black","value":"Arial Black"},{"key":"Calibri","value":"Calibri"},{"key":"Comic Sans MS","value":"Comic Sans MS"},{"key":"Georgia","value":"Georgia"},{"key":"Helvetica","value":"Helvetica"},{"key":"Lucida Sans Unicode","value":"Lucida Sans Unicode"},{"key":"Portable User Interface","value":"Portable User Interface"},{"key":"Times New Roman","value":"Times New Roman"},{"key":"Trebuchet MS","value":"Trebuchet MS"},{"key":"Verdana","value":"Verdana"},{"key":"Tahoma","value":"Tahoma"}],"children":[]},{"id":"ILabelStyleFontSize","name":"FontSize","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"6","value":"6"},{"key":"7","value":"7"},{"key":"8","value":"8"},{"key":"9","value":"9"},{"key":"10","value":"10"},{"key":"11","value":"11"},{"key":"12","value":"12"},{"key":"13","value":"13"},{"key":"14","value":"14"},{"key":"15","value":"15"},{"key":"16","value":"16"},{"key":"17","value":"17"},{"key":"18","value":"18"},{"key":"19","value":"19"},{"key":"20","value":"20"}],"children":[]},{"id":"ILabelStyleBold","name":"Bold","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ILabelStyleItalic","name":"Italic","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ILabelStyleUnderline","name":"Underline","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ILabelWidth","name":"Width (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ILabelAutoWidth","name":"Auto Width","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ILabelLeft","name":"Padding Left (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ILabelRight","name":"Padding Right (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ILabelStyleShow","name":"Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"ISeparate","name":"Separate","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"ISeparateValue","name":"Separator String","value":"","maxLength":4,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ISeparateJustifyContent","name":"Align","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"ISeparateBackgroundColor","name":"BackgroundColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ISeparateColor","name":"Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"ISeparateFontName","name":"FontName","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Arial","value":"Arial"},{"key":"Arial Black","value":"Arial Black"},{"key":"Calibri","value":"Calibri"},{"key":"Comic Sans MS","value":"Comic Sans MS"},{"key":"Georgia","value":"Georgia"},{"key":"Helvetica","value":"Helvetica"},{"key":"Lucida Sans Unicode","value":"Lucida Sans Unicode"},{"key":"Portable User Interface","value":"Portable User Interface"},{"key":"Times New Roman","value":"Times New Roman"},{"key":"Trebuchet MS","value":"Trebuchet MS"},{"key":"Verdana","value":"Verdana"},{"key":"Tahoma","value":"Tahoma"}],"children":[]},{"id":"ISeparateFontSize","name":"FontSize","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"6","value":"6"},{"key":"7","value":"7"},{"key":"8","value":"8"},{"key":"9","value":"9"},{"key":"10","value":"10"},{"key":"11","value":"11"},{"key":"12","value":"12"},{"key":"13","value":"13"},{"key":"14","value":"14"},{"key":"15","value":"15"},{"key":"16","value":"16"},{"key":"17","value":"17"},{"key":"18","value":"18"},{"key":"19","value":"19"},{"key":"20","value":"20"}],"children":[]},{"id":"ISeparateBold","name":"Bold","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ISeparateItalic","name":"Italic","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ISeparateUnderline","name":"Underline","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ISeparateWidth","name":"Width (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ISeparateAutoWidth","name":"Auto Width","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"ISeparateLeft","name":"Padding Left (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ISeparateRight","name":"Padding Right (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"ISeparateShow","name":"Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]},{"id":"IDataStyle","name":"Value","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"IDataStyleJustifyContent","name":"Align","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Left","value":"Left"},{"key":"Center","value":"Center"},{"key":"Right","value":"Right"}],"children":[]},{"id":"IDataStyleAlignBackgroundColor","name":"BackgroundColor","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"IDataStyleColor","name":"Color","value":null,"disabled":false,"collapsed":true,"dataType":"Color","options":null,"children":[]},{"id":"IDataStyleFontName","name":"FontName","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"Arial","value":"Arial"},{"key":"Arial Black","value":"Arial Black"},{"key":"Calibri","value":"Calibri"},{"key":"Comic Sans MS","value":"Comic Sans MS"},{"key":"Georgia","value":"Georgia"},{"key":"Helvetica","value":"Helvetica"},{"key":"Lucida Sans Unicode","value":"Lucida Sans Unicode"},{"key":"Portable User Interface","value":"Portable User Interface"},{"key":"Times New Roman","value":"Times New Roman"},{"key":"Trebuchet MS","value":"Trebuchet MS"},{"key":"Verdana","value":"Verdana"},{"key":"Tahoma","value":"Tahoma"}],"children":[]},{"id":"IDataStyleFontSize","name":"FontSize","value":null,"disabled":false,"collapsed":true,"dataType":"Object","options":[{"key":"6","value":"6"},{"key":"7","value":"7"},{"key":"8","value":"8"},{"key":"9","value":"9"},{"key":"10","value":"10"},{"key":"11","value":"11"},{"key":"12","value":"12"},{"key":"13","value":"13"},{"key":"14","value":"14"},{"key":"15","value":"15"},{"key":"16","value":"16"},{"key":"17","value":"17"},{"key":"18","value":"18"},{"key":"19","value":"19"},{"key":"20","value":"20"}],"children":[]},{"id":"IDataStyleBold","name":"Bold","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"IDataStyleItalic","name":"Italic","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"IDataStyleUnderline","name":"Underline","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"IDataStyleWidth","name":"Width (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"IDataStyleAutoWidth","name":"Auto Width","value":null,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"IDataStyleLeft","name":"Padding Left (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"IDataStyleRight","name":"Padding Right (px)","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]},{"id":"IDataStyleShow","name":"Display","value":true,"disabled":false,"collapsed":true,"dataType":"Boolean","options":null,"children":[]}]}]',
  NoteForm = '[{"id":"NoteWidget","name":"NoteWidget","disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WithParkedItem","name":"WithParkedItem","value":false,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[]},{"id":"WithWidget","name":"WithWidget","value":true,"disabled":true,"collapsed":true,"dataType":"Boolean","options":null,"children":[{"id":"WidgetName","name":"WidgetName","value":"Pdf Widget","disabled":true,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Appearance","name":"Appearance","value":null,"disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"WidgetTitle","name":"WidgetTitle","value":null,"disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[{"id":"TitleText","name":"TitleText","value":"Note Form","disabled":false,"collapsed":true,"dataType":"String","options":null,"children":[]}]}]},{"id":"Behavior","name":"Behavior","disabled":false,"collapsed":true,"dataType":null,"children":[{"id":"DateTimeFormat","name":"Date Time Format","disabled":false,"collapsed":true,"dataType":null,"options":null,"children":[{"id":"Display","name":"Display","value":0,"disabled":false,"collapsed":true,"dataType":"Object"}]}]}]',
  Linebreak = '',
}

export enum OrderDataEntryTabEnum {
  Manual = 'Manual',
  Scanning = 'Scanning',
  Gamer = 'Gamer',
}

export enum ArticlesInvoiceQuantity {
  QtyKeep = 'QtyKeep',
  QtyBackToWareHouse = 'QtyBackToWarehouse',
  QtyDefect = 'QtyDefect',
}

export enum BadChequeEnum {
  ThreatSAV = 'ThreatSAV',
  BadCheckSAV = 'BadCheckSAV',
  BadCheck = 'BadCheck',
}

export enum SAVIdConnectionName {
  IdSalesOrder = 'IdSalesOrder',
  IdPerson = 'IdPerson',
}

export enum ESQueryType {
  Term,
  QueryString,
  Wildcard,
}
