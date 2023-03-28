import {
    Component,
    OnInit,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    EventEmitter,
    ViewChild,
    OnDestroy,
    ElementRef,
    AfterViewInit,
} from "@angular/core";
import {
    FilterModeEnum,
    OrderDataEntryWidgetLayoutModeEnum,
    RepWidgetAppIdEnum,
    WidgetFormTypeEnum,
} from "app/app.constants";
import {
    WidgetDetail,
    FilterData,
    FieldFilter,
    FormOutputModel,
    WidgetPropertyModel,
    Module,
    OrderDataEntryProperties,
} from "app/models";
import { WidgetModuleInfoTranslationComponent } from "app/shared/components/widget";
import {
    PropertyPanelActions,
    XnCommonActions,
    CustomAction,
} from "app/state-management/store/actions";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import {
    GlobalSettingService,
    PropertyPanelService,
    AppErrorHandler,
} from "app/services";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import { XnWidgetMenuStatusComponent } from "app/shared/components/widget/components/xn-widget-menu-status";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { ModuleList } from "app/pages/private/base";
import { ImageZoomerComponent } from "app/shared/components/image-zoomer/image-zoomer.component";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";

@Component({
    selector: "widget-data-entry-info",
    styleUrls: ["./widget-data-entry-info.component.scss"],
    templateUrl: "./widget-data-entry-info.component.html",
})
export class WidgetDataEntryInfoComponent
    implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
    public isLoad: boolean = true;
    public translatedSource: Array<any>;
    public originalTranslateText: Array<any> = null;
    public isShowTranslateDialog: boolean = false;
    public isShowODEWidgetSummarySetting: boolean = false;
    public globalProperties: any;
    public widgetBorderColor = "";
    public propertiesForSaving: {
        version: string;
        properties: any[];
    } = {
        version: "",
        properties: [],
    };

    protected properties: WidgetPropertyModel[] = [];
    protected originalProperties: WidgetPropertyModel[] = [];

    private widgetContainerW: number = 0;
    private _resized: any;
    private columnsName: Array<string> = [];
    private isShowMenuStatus: boolean;
    private _allowEdit: boolean;

    private dataEntryCallReloadStateSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private requestSavePropertiesStateSubscription: Subscription;
    private requestUpdatePropertiesStateSubscription: Subscription;

    private dataEntryCallReloadState: Observable<any>;
    private globalPropertiesState: Observable<any>;
    private requestSavePropertiesState: Observable<any>;
    private requestUpdatePropertiesState: Observable<any>;

    public perfectScrollbarConfig: any = {};
    public orderDataEntryWidgetLayoutMode =
        OrderDataEntryWidgetLayoutModeEnum.Inline;
    public orderDataEntryProperties: OrderDataEntryProperties =
        new OrderDataEntryProperties();
    public dataEntryWidgetType: number;
    public initwidgetMenuStatusData: any;
    public fieldFilters: Array<FieldFilter>;
    public selectedFilter: FilterModeEnum = FilterModeEnum.ShowAll;
    public widgetStyle: any = {
        border: null,
        borderColor: null,
        backgroundColor: null,
        globalBorder: null,
        globalBorderColor: null,
        globalBackgroundColor: null,
        showScrollBar: false,
    };

    isShowODEWidgetLayoutMode: boolean = false;

    @Output() onEditingWidget = new EventEmitter<WidgetDetail>();

    @ViewChild(XnWidgetMenuStatusComponent)
    widgetMenuStatusComponent: XnWidgetMenuStatusComponent;

    _data: WidgetDetail;
    @Input()
    set data(widgetDetail: WidgetDetail) {
        this._data = widgetDetail;
        this.dataEntryWidgetType = widgetDetail
            ? widgetDetail.idRepWidgetApp
            : 0;

        /*
        if (this.dataEntryWidgetType == 64 || this.dataEntryWidgetType == 65 ||
            this.dataEntryWidgetType == 63 || this.dataEntryWidgetType == 66 ||
            this.dataEntryWidgetType == 67)
            this.isShowMenuStatus = false;
        */

        // Menu display only on this widget
        // 1. Payment widget for layout configuration.
        if (this.dataEntryWidgetType == 68) {
            this.isShowODEWidgetLayoutMode = true;
            this.isShowMenuStatus = true;
        }

        // 2. Summary table for show hide columns.
        if (
            this.dataEntryWidgetType == RepWidgetAppIdEnum.OrderListSummary ||
            this.dataEntryWidgetType == RepWidgetAppIdEnum.OrderDetailDataEntry
        ) {
            this.isShowODEWidgetSummarySetting = true;
            this.isShowMenuStatus = true;
        }

        // this.isShowODEWidgetLayoutMode = this.dataEntryWidgetType == 68;

        if (this.dataEntryWidgetType == 62) {
            this.perfectScrollbarConfig = {
                suppressScrollX: true,
                suppressScrollY: true,
            };
        }
    }
    get data() {
        return this._data;
    }

    @Input() currentModule: Module;

    @Input()
    set dataFilter(_data: FilterData) {
        if (_data) {
            this.fieldFilters = _data.fieldFilters;
            if (_data.orderDataEntryWidgetLayoutMode)
                this.orderDataEntryWidgetLayoutMode =
                    _data.orderDataEntryWidgetLayoutMode;

            if (_data.orderDataEntryProperties) {
                this.orderDataEntryProperties = _data.orderDataEntryProperties;
                this.processODEProperties();
            }

            this.initwidgetMenuStatusData = {
                widgetDetail: this.data,
                fieldFilters: this.fieldFilters,
                selectedFilter: this.selectedFilter,
                orderDataEntryWidgetLayoutMode:
                    this.orderDataEntryWidgetLayoutMode,
                orderDataEntryProperties: this.orderDataEntryProperties,
                widgetProperties: this.properties,
            };
        }
    }

    @Input() set widgetProperties(properties: any) {
        if (!properties) {
            return;
        }

        if (isNil(properties.properties)) {
            this.properties = properties;
            this.propertiesForSaving.properties = cloneDeep(properties);
        } else {
            this.properties = properties.properties;
            this.propertiesForSaving = cloneDeep(properties);
        }

        this.originalProperties = cloneDeep(this.properties);

        this.changeProperties();

        if (this.initwidgetMenuStatusData) {
            this.initwidgetMenuStatusData.widgetProperties = this.properties;
            let showData = this.propertyPanelService.getItemRecursive(
                this.properties,
                "ShowData"
            );
            if (showData)
                this.initwidgetMenuStatusData.selectedFilter =
                    showData.value || 0;
        }
    }

    @ViewChild("currentComponent") currentComponent: any;

    @Input() set allowEdit(data: boolean) {
        this._allowEdit = data;
        setTimeout(() => {
            if (
                !this.columnsName ||
                !this.columnsName.length ||
                !this.widgetMenuStatusComponent
            )
                return;
            this.widgetMenuStatusComponent.manualAddFieldFilters(
                this.columnsName
            );
        }, 300);
    }

    get allowEdit() {
        return this._allowEdit;
    }
    @Input() tabID: string;

    @Input() set resized(_number: any) {
        setTimeout(() => {
            const container = $(this._eref.nativeElement).closest(
                "div.widget-module-info-container"
            );
            if (container.length) {
                this.widgetContainerW = container.width();
            }
            this._resized = _number;
        }, 500);
        this.resizeImageZoomer();
    }

    @Output()
    onRemoveWidget = new EventEmitter<WidgetDetail>();

    @Output()
    onChangeFieldFilter = new EventEmitter<any>();

    @ViewChild(ImageZoomerComponent) imageZoomerComponent: ImageZoomerComponent;

    @ViewChild("widgetInfoTranslation")
    widgetInfoTranslation: WidgetModuleInfoTranslationComponent;

    constructor(
        private _eref: ElementRef,
        private store: Store<AppState>,
        private commonActions: XnCommonActions,
        private globalSettingService: GlobalSettingService,
        private propertyPanelService: PropertyPanelService,
        private propertyPanelActions: PropertyPanelActions,
        private dispatcher: ReducerManagerDispatcher,
        private appErrorHandler: AppErrorHandler
    ) {
        this.dataEntryCallReloadState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID).callReload
        );
        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
        this.requestSavePropertiesState = this.store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    this.currentModule.moduleNameTrim
                ).requestSave
        );
    }

    ngOnInit() {
        if (this.dataEntryWidgetType == 62) {
            this.perfectScrollbarConfig = {
                suppressScrollX: false,
                suppressScrollY: true,
            };
        } else {
            this.perfectScrollbarConfig = {
                suppressScrollX: false,
                suppressScrollY: false,
            };
        }

        if (!this.initwidgetMenuStatusData)
            this.initwidgetMenuStatusData = {
                widgetDetail: this.data,
                fieldFilters: this.fieldFilters,
                selectedFilter: this.selectedFilter,
                orderDataEntryWidgetLayoutMode:
                    this.orderDataEntryWidgetLayoutMode,
                orderDataEntryProperties: this.orderDataEntryProperties,
                widgetProperties: this.properties,
            };

        this.dataEntryCallReloadStateSubscription =
            this.dataEntryCallReloadState.subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (!response || !response.reload) {
                        return;
                    }
                    this.isLoad = false;
                    setTimeout(() => {
                        this.isLoad = true;
                    }, 1000);
                });
            });

        this.requestSavePropertiesStateSubscription =
            this.requestSavePropertiesState.subscribe(
                (requestSavePropertiesState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            requestSavePropertiesState &&
                            JSON.stringify(this.propertiesForSaving) !==
                                JSON.stringify(this.properties)
                        ) {
                            const widgetData: WidgetDetail =
                                requestSavePropertiesState.propertiesParentData;
                            if (widgetData && widgetData.id === this.data.id) {
                                this.changeProperties();
                                this._saveMenuChanges();
                            }
                        }
                    });
                }
            );

        this.requestUpdatePropertiesStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === PropertyPanelActions.UPDATE_PROPERTIES &&
                    action.module.idSettingsGUI ==
                        this.currentModule.idSettingsGUI
                );
            })
            .map((action: CustomAction) => {
                return action.payload;
            })
            .subscribe((actionData) => {
                this.appErrorHandler.executeAction(() => {
                    if (actionData) {
                        const widgetData: WidgetDetail = actionData.widgetData;
                        const properties: any = actionData.widgetProperties;
                        if (
                            widgetData &&
                            widgetData.id &&
                            this.data.id &&
                            widgetData.id === this.data.id &&
                            properties
                        ) {
                            this.properties = cloneDeep(properties);
                            this.changeProperties();
                        }
                    }
                });
            });

        this.subscribeGlobalProperties();
    }

    ngOnDestroy() {}

    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewInit() {
        this.initView();
    }

    public onHeaderColsUpdatedHandler($event) {
        this.columnsName = $event;
        if (this.widgetMenuStatusComponent) {
            this.widgetMenuStatusComponent.manualAddFieldFilters(
                this.columnsName
            );
        }
    }

    private hasChanges(changes) {
        return (
            changes &&
            changes.hasOwnProperty("currentValue") &&
            changes.hasOwnProperty("previousValue")
        );
    }

    removeWidget(): void {
        this.onRemoveWidget.emit(this.data);
    }

    private getFieldFiltersFromWidgetInfo(widgetFields: any) {
        if (widgetFields && this.data) {
            this.data.contentDetail = {
                data: [null, widgetFields],
            };
            this.initwidgetMenuStatusData = {
                widgetDetail: this.data,
                fieldFilters: this.fieldFilters,
                selectedFilter: this.selectedFilter,
                orderDataEntryWidgetLayoutMode:
                    this.orderDataEntryWidgetLayoutMode,
                orderDataEntryProperties: this.orderDataEntryProperties,
                widgetProperties: this.properties,
            };
        }
    }

    public changeDisplayMode(dataFilter: any) {
        if (!dataFilter) return;
        this.selectedFilter = dataFilter.selectedFilter;
    }

    public changeODEProperties(properties: any) {
        if (!properties) return;
        this.orderDataEntryProperties = properties;

        this.processODEProperties();
    }

    public changeFieldFilter($event: FilterData) {
        this.fieldFilters = Object.assign(
            [],
            this.fieldFilters,
            $event.fieldFilters
        );
        this.orderDataEntryWidgetLayoutMode =
            $event.orderDataEntryWidgetLayoutMode;
        this.orderDataEntryProperties = $event.orderDataEntryProperties;
        this.initwidgetMenuStatusData = {
            widgetDetail: this.data,
            fieldFilters: this.fieldFilters,
            selectedFilter: this.selectedFilter,
            orderDataEntryWidgetLayoutMode: this.orderDataEntryWidgetLayoutMode,
            orderDataEntryProperties: this.orderDataEntryProperties,
            widgetProperties: this.properties,
        };
        //this.checkToShowRedBorder();

        // Save setting here
        this.onChangeFieldFilter.emit({
            fieldFilters: this.fieldFilters,
            widgetDetail: this.data,
        });
    }

    public onResizeStop() {
        this.resizeImageZoomer();
    }

    public outputDataHandler(eventData: FormOutputModel) {
        if (eventData.isDirty) this.onEditingWidget.emit(this.data);
    }

    public translateWidget() {
        if (this.currentComponent) {
            this.translatedSource =
                this.currentComponent.getCurrentTranslatedSource();
            this.isShowTranslateDialog = true;
            this.data.contentDetail.data = [null, this.translatedSource];
            setTimeout(() => {
                this.widgetInfoTranslation.showDialog =
                    this.isShowTranslateDialog;
            });
        }
    }

    public propertyClicked() {
        this.store.dispatch(
            this.propertyPanelActions.togglePanel(
                this.currentModule,
                true,
                this.data,
                this.properties,
                false
            )
        );
    }

    public onHiddenWidgetInfoTranslation($event) {
        this.isShowTranslateDialog = false;
        // Reload TranslatedSource
        this.getTranslateText();
    }

    public callSavePropertiesHandler() {
        this._saveMenuChanges();
    }

    private resizeImageZoomer() {
        if (this.imageZoomerComponent) {
            this.imageZoomerComponent.resizeImageZoomer();
        }
    }

    private initView() {
        this.getTranslateText();
    }

    private getTranslateText() {
        if (this.currentComponent) {
            const model = {
                widgetMainID: this.data.idRepWidgetApp,
                widgetCloneID: this.data.id,
                fields: this.currentComponent.getCurrentFields(),
            };
            this.globalSettingService
                .getTranslateText(
                    model.widgetMainID,
                    model.widgetCloneID,
                    model.fields
                )
                .subscribe((response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (response && response.data && response.data.length) {
                            this.translatedSource = response.data[1];
                        }
                    });
                });
        }
    }

    /**
     * subscribeGlobalProperties
     */
    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!globalProperties) {
                        return;
                    }
                    this.globalProperties = globalProperties;

                    const globalBorder =
                        this.propertyPanelService.getItemRecursive(
                            globalProperties,
                            "Border"
                        );
                    const globalBorderColor =
                        this.propertyPanelService.getItemRecursive(
                            globalProperties,
                            "BorderColor"
                        );
                    this.widgetStyle.globalBorder = globalBorder;
                    this.widgetStyle.globalBorderColor = globalBorderColor;
                    this.updateBorder();
                });
            });
    }

    private updateBorder() {
        if (
            !this.widgetStyle.globalBorder ||
            !this.widgetStyle.globalBorder.value
        ) {
            this.widgetBorderColor = "";
            return;
        }
        this.widgetBorderColor =
            "1px solid " +
            (this.widgetStyle.globalBorderColor
                ? this.widgetStyle.globalBorderColor.value
                : "#f39c12");
    }

    private processODEProperties() {
        setTimeout(() => {
            if (this.currentComponent) {
                switch (this.dataEntryWidgetType) {
                    case 125:
                        let isFormMode =
                            this.orderDataEntryProperties &&
                            this.orderDataEntryProperties.autoSwitchToDetail &&
                            !this.orderDataEntryProperties.multipleRowDisplay;
                        this.currentComponent.displayMode = isFormMode
                            ? "form"
                            : "grid";

                        let isFormDisplayWithGroup =
                            this.orderDataEntryProperties &&
                            this.orderDataEntryProperties.groupView;
                        this.currentComponent.formDisplayType =
                            isFormDisplayWithGroup
                                ? WidgetFormTypeEnum.Group
                                : WidgetFormTypeEnum.List;

                        if (!isFormMode) {
                            this.currentComponent.renderGrid = false;
                            setTimeout(() => {
                                this.currentComponent.renderGrid = true;

                                setTimeout(() => {
                                    if (
                                        this.currentComponent.wijmoGridComponent
                                    )
                                        this.currentComponent.wijmoGridComponent.refresh();

                                    if (this.currentComponent.xnAgGridComponent)
                                        this.currentComponent.xnAgGridComponent.refresh();
                                }, 300);
                            }, 100);
                        }
                        break;

                    default:
                        break;
                }
            }
        }, 200);
    }
    private changeProperties() {
        // TODO: Update data for each widget
    }

    private _saveMenuChanges(isClosedPropertyPanel?: boolean) {
        this.propertiesForSaving.properties = cloneDeep(this.properties);

        if (this.widgetMenuStatusComponent) {
            this.widgetMenuStatusComponent.resetToUpdateFieldsFilterFromOutside();
        }

        // Reset widget properties dirty
        this.properties = this.propertyPanelService.resetDirty(this.properties);
        this.propertiesForSaving.properties =
            this.propertyPanelService.resetDirty(
                this.propertiesForSaving.properties
            );

        // Save setting here
        this.onChangeFieldFilter.emit({
            fieldFilters: this.fieldFilters,
            widgetDetail: this.data,
            widgetFormType: 0,
            isClosedPropertyPanel: isClosedPropertyPanel,
        });
    }
}
