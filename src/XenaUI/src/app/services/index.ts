import * as service from 'app/services';
import * as consts from 'app/app.constants';
import * as uti from 'app/utilities';

export * from 'app/services/common';
export * from 'app/services/control';
export * from 'app/services/form';
export * from 'app/services/system';
export * from 'app/services/base.service';
export * from 'app/services/cache.service';
export * from 'app/services/google-analytics.service';
export * from 'app/services/signalR';
export * from 'app/services/widget-field.service';
export * from 'app/services/EventEmitter.service';

export const APP_SERVICES = [
    service.AccessRightsService,
    service.AppErrorHandler,
    service.ArticleService,
    service.AuthenticationService,
    service.BaseService,
    service.CacheService,
    service.GoogleAnalyticsService,
    service.CanActivateGuard,
    service.DeviceDetectorService,
    service.UnsavedModulesGuard,
    service.CampaignService,
    service.CommonService,
    service.ContextMenuService,
    service.DatatableService,
    service.DomHandler,
    service.GlobalSearchService,
    service.GlobalSettingService,
    service.ModalService,
    service.ModuleService,
    service.ModuleSettingService,
    service.PageSettingService,
    service.ParkedItemService,
    service.ParkedItemProcess,
    service.PersonService,
    service.SearchService,
    service.TabService,
    service.TreeViewService,
    service.UserService,
    service.ValidationService,
    service.WidgetTemplateSettingService,
    service.BusinessCostService,
    service.DownloadFileService,
    service.DataEntryService,
    service.DataEntryProcess,
    service.PropertyPanelService,
    service.DragService,
    service.BloombergService,
    service.BackOfficeService,
    service.ReturnRefundService,
    service.BlockedOrderService,
    service.StockCorrectionService,
    service.ToolsService,
    service.SplitterService,
    service.WareHouseMovementService,
    service.HotKeySettingService,
    service.OrderDataEntryService,
    service.UserProfileService,
    service.LayoutSettingService,
    service.TimeCheckerService,
    service.NotificationService,
    service.DatabaseService,
    service.RuleService,
    service.CountrySelectionService,
    service.FrequencyService,
    service.ProjectService,
    service.SignalRService,
    service.SelectionExportService,
    service.UserModuleWorkspaceService,
    service.WidgetFieldService,
    service.EventEmitterService,
    service.ObservableShareService,
    service.ResourceTranslationService,
    service.MenuStatusService,
    consts.ArticleTabFieldMapping,
    consts.ComboBoxTypeConstant,
    consts.Configuration,
    consts.ControlType,
    consts.CustomerFormModeConstant,
    consts.GlobalSearchConstant,
    consts.GlobalSettingConstant,
    consts.MenuModuleId,
    consts.MessageModal,
    consts.ModuleTabCombineNameConstant,
    consts.PageSettingConstant,
    consts.PageSize,
    consts.ReplaceString,
    consts.ServiceUrl,

    uti.SerializationHelper,
    uti.String,
    uti.Uti,
    uti.LocalStorageHelper,

    uti.SessionStorageProvider,
    uti.LocalStorageProvider
];
