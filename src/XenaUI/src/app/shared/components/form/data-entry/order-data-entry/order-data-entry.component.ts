import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    ElementRef,
} from "@angular/core";
import {
    FormControl,
    FormGroup,
    Validators,
    FormBuilder,
} from "@angular/forms";
import {
    CommonService,
    DataEntryService,
    AppErrorHandler,
    PropertyPanelService,
    SearchService,
    PersonService,
    HotKeySettingService,
    ModalService,
    DataEntryProcess,
    BaseService,
    SignalRService,
} from "app/services";
import {
    ComboBoxTypeConstant,
    Configuration,
    MessageModal,
    LocalStorageKey,
    OrderFailedDataEnum,
    OrderDataEntryTabEnum,
    GlobalSettingConstant,
} from "app/app.constants";
import { Observable } from "rxjs/Observable";
import { forkJoin } from "rxjs/Observable/forkJoin";
import { Subscription } from "rxjs/Subscription";
import { Uti, LocalStorageHelper, LocalStorageProvider } from "app/utilities";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import isNil from "lodash-es/isNil";
import isEqual from "lodash-es/isEqual";
import cloneDeep from "lodash-es/cloneDeep";

import {
    DataEntryActions,
    ProcessDataActions,
    CustomAction,
    TabSummaryActions,
    ParkedItemActions,
    TabButtonActions,
} from "app/state-management/store/actions";
import {
    FormModel,
    FieldFilter,
    ApiResultResponse,
    Currency,
    PaymentType,
    Module,
    MessageModel,
    FormOutputModel,
    OrderDataEntryModel,
    ParkedItemModel,
    WidgetPropertyModel,
    MessageModalModel,
    MessageModalHeaderModel,
    MessageModalBodyModel,
    MessageModalFooterModel,
    ButtonList,
} from "app/models";
import { ControlFocusComponent } from "app/shared/components/form";
import { DataEntryFormBase } from "app/shared/components/form/data-entry/data-entry-form-base";
import { ModuleSearchDialogComponent } from "app/shared/components/form";
import { MenuModuleId, SignalRActionEnum } from "app/app.constants";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
import * as parkedItemReducer from "app/state-management/store/reducer/parked-item";
import { ModuleList } from "app/pages/private/base";
import { Router } from "@angular/router";
import { DatePickerComponent } from "app/shared/components/xn-control";
import { format, addDays, subDays } from "date-fns/esm";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";
import { Dialog } from "primeng/components/dialog/dialog";

@Component({
    selector: "app-order-data-entry-form",
    styleUrls: ["./order-data-entry.component.scss"],
    templateUrl: "./order-data-entry.component.html",
})
export class OrderDataEntryFormComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy
{
    public isRenderForm: boolean;
    public listComboBox: any;
    public orderDataEntryForm: FormGroup;
    public mainCurrency: Currency;
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;
    public dialogStyleClass = this.consts.popupResizeClassName;

    private preDialogW: string;
    private preDialogH: string;
    private preDialogLeft: string;
    private preDialogTop: string;
    private formChangeSubscription: Subscription;
    private scanningStatusDataState: Observable<any>;
    private scanningStatusDataStateSubscription: Subscription;

    private customerDataStateSubscription: Subscription;
    private customerDataState: Observable<any>;
    private communicationDataStateSubscription: Subscription;
    private communicationDataState: Observable<any>;
    private paymentTypeDataStateSubscription: Subscription;
    private paymentTypeDataState: Observable<any>;
    private articleGridExportDataStateSubscription: Subscription;
    private articleGridExportDataState: Observable<any>;
    private orderTotalSummaryDataStateSubscription: Subscription;
    private orderTotalSummaryDataState: Observable<any>;
    private selectedSimpleTabChangedStateSubscription: Subscription;
    private selectedSimpleTabChangedState: Observable<any>;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private scanningStatusCallSkipStateSubscription: Subscription;
    private scanningStatusCallSkipState: Observable<any>;
    private selectedODETabState: Observable<any>;
    private selectedODETabStateSubscription: Subscription;
    private dataEntryCustomerMatchedDataState: Observable<number>;
    private dataEntryCustomerMatchedDataStateSubcription: Subscription;
    private requestChangeTabThenLoadDataState: Observable<any>;
    private requestChangeTabThenLoadDataStateSubcription: Subscription;

    private orderFailedReceiveDataState: Observable<any>;
    private orderFailedReceiveDataSubcription: Subscription;

    private selectedParkedItemState: Observable<ParkedItemModel>;
    private selectedParkedItemStateSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    public globalProperties: any;
    private data: any;
    public isInvalidOrderDate = false;
    public perfectScrollbarConfig: any = {};
    private dataEntryOrderDataState: Observable<FormModel>;
    private dataEntryOrderDataStateSubscription: Subscription;
    private customerData: any;
    private communicationData: any;
    private paymentTypeData: any;
    private articleGridExportData: any;
    private orderTotalSummaryData: any;
    private communicationDataRaw: any;
    private idPerson: any;
    private customerNr: any;
    public formFields: Array<FieldFilter> = [];
    private currentScanningStatus: any;
    private searchIndex = "campaign";
    private moduleId = MenuModuleId.campaign;
    private globalDateFormat: string = null;
    private additionSubtractionDay: any;
    private disableUntil: any = { year: 1900, month: 1, day: 1 };
    private disableSince: any = { year: 9999, month: 12, day: 31 };
    private indicatorControl: any = {
        isCustomerSearching: false,
        isMediaCodeSearching: false,
    };

    private previousValues: any = {
        mediaCode: "",
        campaignNumber: "",
    };
    private validMediaCodeCampaignNrList: Array<any> = [];
    private mediaCode: string;
    private campaignNr: string;
    private inputMediaCodeFirst: boolean;
    private inputCampaignNumberFirst: boolean;
    private inputMediaCodeFromDialog: boolean = false;
    private isSkipAction: boolean = false;
    private pressSkipButton: boolean = false;
    private isScanningTab: boolean = false;
    private isGamerTab: boolean = false;
    private countryListByCampaign: Array<any> = [];
    private _properties: WidgetPropertyModel[];
    private _isPreventSaveOrderTypeFromProperties: boolean = false;

    public moduleDialog: any = {
        campaign: {
            title: "Search Campaign",
            searchIndex: "campaign",
            module: new Module({ idSettingsGUI: MenuModuleId.campaign }),
        },
        customer: {
            title: "Search Customer",
            searchIndex: "customer",
            module: new Module({ idSettingsGUI: MenuModuleId.customer }),
        },
    };

    public isDataProcessing: boolean;

    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() outputWidgetFields: EventEmitter<any> = new EventEmitter();
    @Output() callSavePropertiesAction: EventEmitter<any> = new EventEmitter();

    @Input()
    set formFieldsData(formFields: FieldFilter[]) {
        if (formFields && formFields.length && formFields != this.formFields) {
            this.formFields = formFields;
            this.manageDisplayFormFields();
        }
    }
    @Input() set widgetProperties(data: WidgetPropertyModel[]) {
        this.execWidgetProperties(data);
    }

    @Input() tabID: string;

    @ViewChild("controlFocus") controlFocus: ControlFocusComponent;
    @ViewChild("orderDate") orderDateControl: DatePickerComponent;

    @ViewChild("searchCustomerDialogModule")
    searchCustomerDialogModule: ModuleSearchDialogComponent;
    @ViewChild("searchCompaignDialogModule")
    searchCompaignDialogModule: ModuleSearchDialogComponent;

    @ViewChild("mediacode") mediacodeCtrl: ElementRef;
    @ViewChild("campaignNumber") campaignNumberCtrl: ElementRef;
    @ViewChild("customer") customerCtrl: ElementRef;
    @ViewChild("orderBy") orderByCtrl: AngularMultiSelect;
    @ViewChild("orderType") orderTypeCtrl: AngularMultiSelect;
    @ViewChild("barcode") barcodeCtrl: ElementRef;
    @ViewChild("shipper") shipperCtrl: AngularMultiSelect;
    @ViewChild("packageNr") packageNrCtrl: ElementRef;

    private pDialogMediacode: any;
    @ViewChild("pDialogMediacode") set pDialogMediacodeInstance(
        pDialogMediacodeInstance: Dialog
    ) {
        this.pDialogMediacode = pDialogMediacodeInstance;
    }
    constructor(
        private elementRef: ElementRef,
        private consts: Configuration,
        private formBuilder: FormBuilder,
        private comService: CommonService,
        private dataEntryService: DataEntryService,
        private store: Store<AppState>,
        private dataEntryActions: DataEntryActions,
        private processDataActions: ProcessDataActions,
        private tabSummaryActions: TabSummaryActions,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        private searchService: SearchService,
        private personService: PersonService,
        public hotKeySettingService: HotKeySettingService,
        private dispatcher: ReducerManagerDispatcher,
        private modalService: ModalService,
        private _changeDetectorRef: ChangeDetectorRef,
        protected router: Router,
        private dataEntryProcess: DataEntryProcess,
        private toasterService: ToasterService,
        private parkedItemActions: ParkedItemActions,
        private tabButtonActions: TabButtonActions,
        private uti: Uti,
        private globalSettingConstant: GlobalSettingConstant,
        private signalRService: SignalRService
    ) {
        super(router, {
            defaultTranslateText: "orderDataEntryData",
            emptyData: new OrderDataEntryModel(),
        });

        this.dataEntryOrderDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID).orderData
        );
        this.customerDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .customerData
        );
        this.communicationDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .communicationData
        );
        this.paymentTypeDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .paymentTypeData
        );
        this.orderTotalSummaryDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .orderTotalSummaryData
        );
        this.articleGridExportDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .articleGridExportData
        );
        this.scanningStatusDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .scanningStatusData
        );
        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
        this.scanningStatusCallSkipState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .scanningStatusCallSkip
        );
        this.selectedSimpleTabChangedState = this.store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedSimpleTab
        );
        this.selectedODETabState = this.store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedODETab
        );
        this.requestChangeTabThenLoadDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .requestChangeTabThenLoadData
        );
        this.selectedParkedItemState = this.store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    ModuleList.OrderDataEntry.moduleNameTrim
                ).selectedParkedItem
        );
        this.dataEntryCustomerMatchedDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .customerMatchedData
        );

        if (Configuration.PublicSettings.enableOrderFailed) {
            this.orderFailedReceiveDataState = this.store.select(
                (state) =>
                    dataEntryReducer.getDataEntryState(state, this.tabID)
                        .orderFailedReceiveData
            );
        }
    }

    public ngOnInit() {
        this.store.dispatch(
            this.dataEntryActions.dataEntryResetAllFormData(this.tabID)
        );

        this.isScanningTab = this.tabID == OrderDataEntryTabEnum.Scanning;
        this.isGamerTab = this.tabID == OrderDataEntryTabEnum.Gamer;
        this.initFormData();
        this.reInitTootltip();
        this.getInitDropdownlistData();
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
        this.initFormFieldData();
        this.subcribeRequestSaveState();
        this.subcribeDataEntryState();
        this.subscribeGlobalProperties();
        this.subscribeCustomerMatchedData();
        this.subscribeRequestChangeTabThenLoadDataState();
        this.subscribeOrderFailed();
        this.subscribeSelectedParkedItemState();
        this.syncOrderFailed();
    }

    public ngOnDestroy() {
        this.dataEntryProcess.reset();
        this.store.dispatch(
            this.dataEntryActions.dataEntryResetAllFormData(this.tabID)
        );

        Uti.unsubscribe(this);

        this.orderDataEntryForm = null;
        this.listComboBox = null;
        this.perfectScrollbarConfig = null;
        this.data = null;
        this.customerData = null;
        this.communicationData = null;
        this.paymentTypeData = null;
        this.articleGridExportData = null;
        this.orderTotalSummaryData = null;
        this.communicationDataRaw = null;

        //clear OrderFailed
        this.clearOrderFailed(true);
        //reset ScanBarcode Process
        this.scanBarcodeClearData();
        this.clearEditOrder(true);
    }

    //#region Init Data
    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties.length) {
                        this.globalProperties = globalProperties;
                        this.globalDateFormat =
                            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                                globalProperties
                            );
                        this.additionSubtractionDay =
                            this.propertyPanelService.getItemRecursive(
                                globalProperties,
                                "AdditionSubtractionDay"
                            );
                        this.buildMinAndMaxOrderDate();
                    }
                });
            });
    }

    private buildMinAndMaxOrderDate() {
        let additionSubtractionDay =
            (this.additionSubtractionDay && this.additionSubtractionDay.value
                ? this.additionSubtractionDay.value
                : 0) *
                1 +
            1;
        const today = new Date();
        const subDate = subDays(today, additionSubtractionDay);
        const addDate = addDays(today, additionSubtractionDay);
        this.disableUntil = {
            year: subDate.getFullYear(),
            month: subDate.getMonth() + 1,
            day: subDate.getDate(),
        };
        this.disableSince = {
            year: addDate.getFullYear(),
            month: addDate.getMonth() + 1,
            day: addDate.getDate(),
        };
    }

    private subscribeDataEntryOrderDataState() {
        if (this.dataEntryOrderDataStateSubscription)
            this.dataEntryOrderDataStateSubscription.unsubscribe();

        this.dataEntryOrderDataStateSubscription =
            this.dataEntryOrderDataState.subscribe((orderData) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        orderData &&
                        orderData.formValue &&
                        this.orderDataEntryForm &&
                        orderData.formValue != this.orderDataEntryForm.value
                    ) {
                        this.orderDataEntryForm.setValue(orderData.formValue);
                        this.orderDataEntryForm.updateValueAndValidity();
                    }
                    if (
                        !orderData ||
                        !orderData.formValue ||
                        !orderData.formValue.mediacode
                    )
                        this.store.dispatch(
                            this.dataEntryActions.dataEntrySetOrderDataMediaCode(
                                "",
                                this.tabID
                            )
                        );
                    else
                        this.store.dispatch(
                            this.dataEntryActions.dataEntrySetOrderDataMediaCode(
                                orderData.formValue.mediacode,
                                this.tabID
                            )
                        );
                });
            });
    }

    private maximize() {
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.dialogStyleClass =
            this.consts.popupResizeClassName +
            "  " +
            this.consts.popupFullViewClassName;
        if (this.pDialogMediacode) {
            this.preDialogW =
                this.pDialogMediacode.containerViewChild.nativeElement.style.width;
            this.preDialogH =
                this.pDialogMediacode.containerViewChild.nativeElement.style.height;
            this.preDialogLeft =
                this.pDialogMediacode.containerViewChild.nativeElement.style.left;
            this.preDialogTop =
                this.pDialogMediacode.containerViewChild.nativeElement.style.top;

            this.pDialogMediacode.containerViewChild.nativeElement.style.width =
                $(document).width() + "px";
            this.pDialogMediacode.containerViewChild.nativeElement.style.height =
                $(document).height() + "px";
            this.pDialogMediacode.containerViewChild.nativeElement.style.top =
                "0px";
            this.pDialogMediacode.containerViewChild.nativeElement.style.left =
                "0px";
            this.mediaCodeBodyHeight = {
                height: $(document).height() - 120 + "px",
            };
        }
    }

    private restore() {
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.consts.popupResizeClassName;
        this.mediaCodeModalHeight = window.screen.height - 300;
        this.mediaCodeBodyHeight = {
            height: this.mediaCodeModalHeight - 135 + "px",
        };
        if (this.pDialogMediacode) {
            this.pDialogMediacode.containerViewChild.nativeElement.style.width =
                this.preDialogW;
            this.pDialogMediacode.containerViewChild.nativeElement.style.height =
                this.preDialogH;
            this.pDialogMediacode.containerViewChild.nativeElement.style.top =
                this.preDialogTop;
            this.pDialogMediacode.containerViewChild.nativeElement.style.left =
                this.preDialogLeft;
        }
    }

    private subscribeScanningStatusDataState() {
        if (this.scanningStatusDataStateSubscription)
            this.scanningStatusDataStateSubscription.unsubscribe();
        //when the scanning wigdet loaded -> it will dispatch the first order with called the action dataEntryScanningStatusSummary
        this.scanningStatusDataStateSubscription =
            this.scanningStatusDataState.subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        response == null ||
                        response == undefined ||
                        !this.orderDataEntryForm
                    )
                        return;

                    const item: any = response.length ? response[0] : null;
                    const message = item
                        ? " getDataByMediaCode & getCustomerData: " +
                          item.mediaCode +
                          " - " +
                          item.customerNr
                        : "";

                    //ignore get data
                    if (
                        this.dataEntryProcess
                            .ignoreProcessForSubcribeScanningStatusData
                    ) {
                        console.log("ignore " + message);
                        this.focusOnControl();
                        return;
                    }

                    if (this.dataEntryProcess.isLoadFromBuffer)
                        console.log("Load from buffer " + message);

                    //if there is data before -> force reset all data
                    if (this.currentScanningStatus) this.clearAllData();

                    if (item) {
                        this.currentScanningStatus = item;

                        if (item.customerNr && item.customerNr.length) {
                            this.orderDataEntryForm.controls[
                                "customer"
                            ].setValue(item.customerNr);
                            this.orderDataEntryForm.controls[
                                "customer"
                            ].updateValueAndValidity();

                            this.getCustomerData(
                                item.customerNr,
                                item.mediaCode
                            );
                        }

                        if (item.mediaCode && item.mediaCode.length) {
                            this.orderDataEntryForm.controls[
                                "mediacode"
                            ].setValue(item.mediaCode);
                            this.orderDataEntryForm.controls[
                                "mediacode"
                            ].updateValueAndValidity();
                            this.orderDataEntryForm.controls[
                                "campaignNumber"
                            ].setValue(item.campaignNr);
                            this.orderDataEntryForm.controls[
                                "campaignNumber"
                            ].updateValueAndValidity();
                            this.inputMediaCodeFirst = true;

                            this.getDataByMediaCode(item.mediaCode);
                        }
                    } else {
                        //There is no any order
                        this.focusOnControl();
                    }
                });
            });
    }

    private subcribeDataEntryState() {
        this.customerDataStateSubscription = this.customerDataState.subscribe(
            (customerDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        customerDataState &&
                        !isEqual(this.customerData, customerDataState)
                    ) {
                        this.customerData = customerDataState;
                        this.checkValidStatusForSaving();
                        this.customerHasCountryOfCurrentCampaign(1);
                    }
                });
            }
        );

        this.communicationDataStateSubscription =
            this.communicationDataState.subscribe(
                (communicationDataState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            communicationDataState &&
                            !isEqual(
                                this.communicationData,
                                communicationDataState
                            )
                        ) {
                            this.communicationData = communicationDataState;
                        }
                    });
                }
            );

        this.paymentTypeDataStateSubscription =
            this.paymentTypeDataState.subscribe((paymentTypeDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        paymentTypeDataState &&
                        !isEqual(this.paymentTypeData, paymentTypeDataState)
                    ) {
                        this.paymentTypeData = paymentTypeDataState;
                        this.checkValidStatusForSaving();
                    }
                });
            });

        this.articleGridExportDataStateSubscription =
            this.articleGridExportDataState.subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        response &&
                        !isEqual(this.articleGridExportData, response)
                    ) {
                        this.articleGridExportData = response;
                        this.checkValidStatusForSaving();
                    }
                });
            });

        this.orderTotalSummaryDataStateSubscription =
            this.orderTotalSummaryDataState.subscribe(
                (orderTotalSummaryDataState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            orderTotalSummaryDataState &&
                            !isEqual(
                                this.orderTotalSummaryData,
                                orderTotalSummaryDataState
                            )
                        ) {
                            this.orderTotalSummaryData =
                                orderTotalSummaryDataState;
                        }
                    });
                }
            );

        this.scanningStatusCallSkipStateSubscription =
            this.scanningStatusCallSkipState.subscribe((canSkip: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!canSkip) return;

                    this.isSkipAction = canSkip.skip;
                    if (this.isSkipAction) {
                        this.pressSkipButton = true;
                    }
                });
            });

        this.selectedSimpleTabChangedStateSubscription =
            this.selectedSimpleTabChangedState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !data ||
                        !data.TabID ||
                        this.dataEntryProcess.selectedODETab.TabID != this.tabID
                    )
                        return;

                    this.focusOnControlOfWigdetInSimpleTab();
                });
            });

        this.selectedODETabStateSubscription =
            this.selectedODETabState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !data ||
                        !data.TabID ||
                        this.dataEntryProcess.selectedODETab.TabID != this.tabID
                    )
                        return;

                    this.checkValidStatusForSaving();
                    this.checkDirtyStatusForForm();
                    this.focusOnControl();
                });
            });
    }

    private reInitTootltip() {
        this.rebuildTooltip("mediacode", "order-data-entry-media-code");
        this.rebuildTooltip("barcode", "order-data-entry-barcode");
        this.rebuildTooltip(
            "campaignNumber",
            "order-data-entry-campaign-number"
        );
        this.rebuildTooltip("customer", "order-data-entry-customer-number");
    }

    private rebuildTooltip(formField: string, divId: string) {
        if (this[formField + "ChangeSubscription"])
            this[formField + "ChangeSubscription"].unsubscribe();

        this[formField + "ChangeSubscription"] =
            this.orderDataEntryForm.controls[formField].valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        const txt = $(
                            "#txt-" + divId,
                            this.elementRef.nativeElement
                        );
                        let fontSize: any = txt.css("font-size");
                        fontSize = isNaN(parseInt(fontSize))
                            ? 12
                            : parseInt(fontSize);
                        const textWidth = Uti.getTextWidth(txt.val(), fontSize);
                        const div: any = $(
                            "#" + divId,
                            this.elementRef.nativeElement
                        );
                        // substract for icon width is 50px
                        if (textWidth >= txt.innerWidth() - 50) {
                            setTimeout(() => {
                                div.attr("xn-tooltip", "");
                                div.attr("tooltipText", `'${txt.val()}'`);
                            }, 500);
                        }

                        switch (formField) {
                            case "campaignNumber":
                                this.store.dispatch(
                                    this.dataEntryActions.dataEntrySelectedCampaignNumberData(
                                        this.orderDataEntryForm.controls[
                                            "campaignNumber"
                                        ].value,
                                        this.tabID
                                    )
                                );
                                break;

                            case "customer":
                                this.store.dispatch(
                                    this.dataEntryActions.dataEntryCustomerIdChanged(
                                        this.orderDataEntryForm.controls[
                                            "customer"
                                        ].value,
                                        this.tabID
                                    )
                                );
                                break;
                        }
                    });
                });
    }

    private getCustomMandatoryField(mediaCode: string) {
        if (!mediaCode) {
            this.store.dispatch(
                this.dataEntryActions.dataEntrySetCustomerMandatoryField(
                    null,
                    this.tabID
                )
            );
            return;
        }

        this.personService
            .preLoadBusinessLogic(mediaCode)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    let mandatoryFields = null;
                    if (
                        Uti.isResquestSuccess(response) &&
                        response.item.length &&
                        response.item[0] &&
                        response.item[0].length &&
                        response.item[0][0].GetMandatoryField &&
                        typeof response.item[0][0].GetMandatoryField ===
                            "string"
                    ) {
                        mandatoryFields = JSON.parse(
                            response.item[0][0].GetMandatoryField
                        );
                        if (
                            mandatoryFields &&
                            mandatoryFields.MandatoryParameter
                        ) {
                            mandatoryFields =
                                mandatoryFields.MandatoryParameter;
                        }
                    }
                    this.store.dispatch(
                        this.dataEntryActions.dataEntrySetCustomerMandatoryField(
                            mandatoryFields,
                            this.tabID
                        )
                    );
                });
            });
    }

    private getInitDropdownlistData() {
        this.comService
            .getListComboBox(
                ComboBoxTypeConstant.orderBy +
                    "," +
                    ComboBoxTypeConstant.principal +
                    "," +
                    ComboBoxTypeConstant.orderType +
                    "," +
                    ComboBoxTypeConstant.getShipper
            )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) return;

                    if (!response.item.getShipper)
                        response.item.getShipper = [];

                    this.listComboBox = Object.assign({}, response.item);
                    this.initDataForForm();
                });
            });
    }

    private initDataForForm() {
        if (!this.listComboBox || this.isRenderForm) return;

        this.isRenderForm = true;
        this.subscribeDataEntryOrderDataState();
        this.subscribeScanningStatusDataState();
        this.updateFormMainValue();

        //Set default value for the shipper combobox
        //if (!this.orderDataEntryForm.controls['idRepSalesOrderShipper'].value && this.listComboBox.getShipper && this.listComboBox.getShipper.length) {
        //    this.orderDataEntryForm.controls['idRepSalesOrderShipper'].setValue(this.listComboBox.getShipper[0].idValue);
        //}
    }

    private isValidOrderDate(d: any): boolean {
        if (Object.prototype.toString.call(d) === "[object Date]") {
            // it is a date
            if (isNaN(d.getTime())) {
                // d.valueOf() could also work
                // date is not valid
                return false;
            } else {
                // date is valid
                return true;
            }
        }

        return false;
    }

    // save formControlValue to Local Storage
    public storeFormControlValue(): void {
        if (!this.orderDataEntryForm || !this.orderDataEntryForm.dirty) return;

        let orderDate: any = "";
        // keep the true date when update to local storage.
        // Because if default the day is substract in 1 day.
        if (this.orderDataEntryForm.controls["orderDate"].value) {
            orderDate = new Date(
                this.orderDataEntryForm.controls["orderDate"].value
            );
            if (this.isValidOrderDate(orderDate)) orderDate.setHours(7);
            else orderDate = "";
        }
        const formControlValueState = {
            isDisplayBarCode:
                this.orderDataEntryForm.controls["isDisplayBarCode"].value,
            orderBy: this.orderDataEntryForm.controls["orderBy"].value,
            orderType: this.orderDataEntryForm.controls["orderType"].value,
            orderDate: orderDate,
            orderDay: this.orderDataEntryForm.controls["orderDay"].value,
            orderMonth: this.orderDataEntryForm.controls["orderMonth"].value,
            orderYear: this.orderDataEntryForm.controls["orderYear"].value,
            idRepSalesOrderShipper:
                this.orderDataEntryForm.controls["idRepSalesOrderShipper"]
                    .value,
        };
        this.callUpdateOrderTypeProperty(formControlValueState.orderType);
        LocalStorageHelper.toInstance(LocalStorageProvider).setItem(
            LocalStorageKey.buildKey(
                LocalStorageKey.OrderDataEntry_FormControlValue,
                this.tabID
            ),
            formControlValueState
        );
    }
    private subscribeCustomerMatchedData() {
        this.dataEntryCustomerMatchedDataStateSubcription =
            this.dataEntryCustomerMatchedDataState.subscribe(
                (customerMatchedData: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!customerMatchedData) return;

                        if (customerMatchedData.forceSaveODE) {
                            this.onSubmitSaveODE();
                        } else {
                            if (!customerMatchedData.personNr) return;

                            //set null to ignore confirm dialog when changing Customer
                            this.idPerson = null;
                            this.customerItemSelect(customerMatchedData);
                        }
                    });
                }
            );
    }

    private subscribeRequestChangeTabThenLoadDataState() {
        this.requestChangeTabThenLoadDataStateSubcription =
            this.requestChangeTabThenLoadDataState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!data) return;

                    this.waitToLoadOrder(data);
                });
            });
    }

    private subscribeSelectedParkedItemState() {
        this.selectedParkedItemStateSubscription =
            this.selectedParkedItemState.subscribe(
                (selectedParkedItemState: ParkedItemModel) => {
                    this.appErrorHandler.executeAction(() => {
                        if (selectedParkedItemState) {
                            this.reGetOrderFailed(
                                selectedParkedItemState.id.value
                            );
                        }
                    });
                }
            );
    }

    // get from Local Storage
    private bindFormControlValue(): void {
        const formControlValueState = LocalStorageHelper.toInstance(
            LocalStorageProvider
        ).getItem(
            LocalStorageKey.buildKey(
                LocalStorageKey.OrderDataEntry_FormControlValue,
                this.tabID
            ),
            {}
        );

        if (!formControlValueState.hasOwnProperty("isDisplayBarCode")) return;

        this.orderDataEntryForm.controls["isDisplayBarCode"].setValue(
            formControlValueState["isDisplayBarCode"]
        );

        if (formControlValueState["orderBy"]) {
            this.orderDataEntryForm.controls["orderBy"].setValue(
                formControlValueState["orderBy"]
            );
        }
        if (
            !this.orderTypeValueFromWidgetProperty &&
            formControlValueState["orderType"]
        ) {
            this.orderTypeValueFromWidgetProperty =
                formControlValueState["orderType"];
        }
        this.orderDataEntryForm.controls["orderType"].setValue(
            this.orderTypeValueFromWidgetProperty || ""
        );
        this.orderDataEntryForm.controls["orderDate"].setValue(
            formControlValueState["orderDate"]
                ? new Date(formControlValueState["orderDate"])
                : new Date()
        );
        this.orderDataEntryForm.controls["orderDate"].markAsPristine();
        this.orderDataEntryForm.controls["orderDay"].setValue(
            formControlValueState["orderDay"]
        );
        this.orderDataEntryForm.controls["orderMonth"].setValue(
            formControlValueState["orderMonth"]
        );
        this.orderDataEntryForm.controls["orderYear"].setValue(
            formControlValueState["orderYear"]
        );
        if (formControlValueState["idRepSalesOrderShipper"]) {
            this.orderDataEntryForm.controls["idRepSalesOrderShipper"].setValue(
                formControlValueState["idRepSalesOrderShipper"]
            );
        }
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI ==
                        this.ofModule.idSettingsGUI &&
                    action.area == this.tabID
                );
            })
            .subscribe((actionData: CustomAction) => {
                this.appErrorHandler.executeAction(() => {
                    this.orderDataEntryForm["submitted"] = true;
                    this.orderDataEntryForm.updateValueAndValidity();

                    //Validate Order Data Entry widget
                    let isFormValid = this.formValidate();

                    //Validate Customer Data widget
                    if (!this.customerData || !this.customerData.isValid)
                        isFormValid = false;

                    if (isFormValid) {
                        const orderTypeValue =
                            this.orderDataEntryForm.controls["orderType"].value;
                        //If order type is not GAMMER
                        if (orderTypeValue !== "2") {
                            //orderTotalSummary
                            if (
                                !this.orderTotalSummaryData ||
                                !this.orderTotalSummaryData.paymentDetails ||
                                !this.orderTotalSummaryData.paymentDetails
                                    .length
                            )
                                isFormValid = false;

                            //articleGrid
                            if (
                                isFormValid &&
                                (!this.articleGridExportData ||
                                    !this.articleGridExportData.isValid ||
                                    !this.articleGridExportData.formValue ||
                                    !this.articleGridExportData.formValue
                                        .length)
                            )
                                isFormValid = false;

                            if (
                                isFormValid &&
                                (!this.paymentTypeData ||
                                    !this.paymentTypeData.isValid ||
                                    !this.paymentTypeData.mappedData ||
                                    !this.paymentTypeData.mappedData.length)
                            )
                                isFormValid = false;
                        }
                    }

                    if (isFormValid) {
                        if (this.isDataProcessing) return;

                        //if IsoCountryCode of Customer is existing in Countrys of Campaign
                        if (!this.customerHasCountryOfCurrentCampaign(2))
                            return;

                        if (
                            Configuration.PublicSettings.callODEDoublet &&
                            this.isCallDoubletCheckBeforeSavingODE()
                        )
                            this.callDoubletCheck(true);
                        else if (this.isShowWarningDialogPaymentTotalAmount())
                            this.showWarningDialogPaymentTotalAmount();
                        else this.onSubmitSaveODE();
                    } else {
                        this.validateFormFailed();
                    }
                });
            });
    }
    private onSubmitSaveODE() {
        this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
        );
        this.onSubmit(
            this.customerData,
            this.communicationData,
            this.paymentTypeData,
            this.articleGridExportData
        );
    }

    private getGlobalSettingsMandatoryCustomerNr() {
        const settings = BaseService.cacheService.getValue(
            "getAllGlobalSettings:-1"
        );
        const mandatoryCustomerNrSetting = settings.find(
            (x) =>
                x.globalName === this.globalSettingConstant.mandatoryCustomerNr
        );

        if (
            !mandatoryCustomerNrSetting ||
            mandatoryCustomerNrSetting.jsonSettings != "1"
        )
            return false;

        return true;
    }
    //#endregion

    //#region Form
    private initEmptyData(): any {
        // Default value from Local Storage
        const formControlValueState = LocalStorageHelper.toInstance(
            LocalStorageProvider
        ).getItem(
            LocalStorageKey.buildKey(
                LocalStorageKey.OrderDataEntry_FormControlValue,
                this.tabID
            ),
            {}
        );
        return {
            idSalesOrder: null,
            idSalesCampaignWizard: null,
            campaignNumber: null,
            packageNr: null,
            idRepSalesOrderShipper:
                formControlValueState["idRepSalesOrderShipper"],
            barcode: null,
            customer: null,
            customerId: null,
            idSalesCampaignMediaCode: null,
            mediacode: null,
            orderBy: formControlValueState["orderBy"],
            orderType: null,
            orderDate: formControlValueState["orderDate"] || new Date(),
            orderMonth: formControlValueState["orderMonth"],
            orderDay: formControlValueState["orderDay"],
            orderYear: formControlValueState["orderYear"],
            isDisplayBarCode: formControlValueState["isDisplayBarCode"],
            isDisplayCustomer: true,
            isDisplayMediaCode: true,
        };
    }

    private manageDisplayFormFields() {
        if (!this.orderDataEntryForm) return;

        this.formFields.forEach((field) => {
            if (!field.selected) {
                if (this.orderDataEntryForm.controls[field.fieldName]) {
                    this.orderDataEntryForm.removeControl(field.fieldName);
                }
            } else {
                if (!this.orderDataEntryForm.controls[field.fieldName]) {
                    const requireValidate =
                        field.fieldName == "barcode" ||
                        field.fieldName == "customer" ||
                        field.fieldName == "mediacode"
                            ? Validators.required
                            : null;
                    this.orderDataEntryForm.addControl(
                        field.fieldName,
                        new FormControl()
                    );

                    if (requireValidate)
                        this.orderDataEntryForm.controls[
                            field.fieldName
                        ].setValidators(requireValidate);

                    this.orderDataEntryForm.updateValueAndValidity();
                }
            }
        });
        this.orderDataEntryForm.updateValueAndValidity();
        this.initFocusControl(true);
    }

    private initFormData() {
        this.idPerson = null;
        this.customerNr = null;
        let _data: any = this.data ? this.data : this.initEmptyData();
        const isMandatoryCustomerNr =
            this.getGlobalSettingsMandatoryCustomerNr();

        this.orderDataEntryForm = this.formBuilder.group({
            idSalesOrder: null,
            idSalesCampaignWizard: null,
            campaignNumber: _data.campaignNumber,
            packageNr: _data.packageNr,
            idRepSalesOrderShipper: _data.idRepSalesOrderShipper,
            barcode: [_data.barcode],
            customer: isMandatoryCustomerNr
                ? [_data.customer, Validators.required, this.incorrectValidator]
                : [_data.customer, null, this.incorrectValidator],
            customerId: null,
            idSalesCampaignMediaCode: null,
            mediacode: [
                _data.mediacode,
                Validators.required,
                this.incorrectValidator,
            ],
            orderBy: [_data.orderBy || "", Validators.required],
            orderType: [
                _data.orderType || this.orderTypeValueFromWidgetProperty || "",
                Validators.required,
            ],
            orderDate: [_data.orderDate || "", Validators.required],
            orderMonth: [_data.orderMonth || ""],
            orderDay: [_data.orderDay || ""],
            orderYear: [_data.orderYear || ""],
            isDisplayBarCode: true,
            isDisplayCustomer: true,
            isDisplayMediaCode: true,
        });
        this.orderDataEntryForm["submitted"] = false;
        this.manageDisplayFormFields();
        this.bindFormControlValue();

        setTimeout(() => {
            this.orderDataEntryForm.markAsPristine();
            this.orderDataEntryForm.markAsUntouched();
        }, 200);
    }

    private resetWidgetData() {
        this.currentScanningStatus = null;
        this.articleGridExportData = null;
        this.customerData = null;
        this.orderTotalSummaryData = null;
        this.paymentTypeData = null;
    }

    private updateFormMainValue() {
        if (!this.orderDataEntryForm) return;

        if (this.formChangeSubscription)
            this.formChangeSubscription.unsubscribe();

        this.formChangeSubscription = this.orderDataEntryForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (!data) return;

                    const formValue = this.orderDataEntryForm.value;
                    if (isEqual(data, formValue)) return;
                    let isFormValid = true;

                    if (this.orderDataEntryForm.untouched) {
                        this.orderDataEntryForm.markAsPristine();
                        this.orderDataEntryForm.markAsUntouched();
                    }

                    if (!this.orderDataEntryForm.pristine)
                        isFormValid = this.orderDataEntryForm.valid;

                    this.store.dispatch(
                        this.dataEntryActions.dataEntryOrderDataChanged(
                            new FormModel({
                                formValue: formValue,
                                isValid: isFormValid,
                                isDirty: this.orderDataEntryForm.dirty,
                            }),
                            this.tabID
                        )
                    );

                    this.checkValidStatusForSaving();

                    if (
                        !(
                            this.orderDataEntryForm.pristine &&
                            this.orderDataEntryForm.untouched
                        )
                    ) {
                        this.setOutputData(null);
                    }
                });
            });
    }

    private getErrorMessageWithRequiredWigdets() {
        const $container = $("order-data-entry-tab #" + this.tabID);

        if (!$container.length) return null;

        let arrayObjects: Array<string> = [];

        if (!$container.find("app-order-data-entry-form").length)
            arrayObjects.push("Order Data Entry");

        if (!$container.find("app-customer-data-entry-form").length)
            arrayObjects.push("Customer Data Entry");

        //Order type is not GAMMER
        if (
            this.orderDataEntryForm &&
            this.orderDataEntryForm.controls["orderType"].value != "2"
        ) {
            if (!$container.find("data-entry-article-grid").length)
                arrayObjects.push("Article Grid");

            // if (!$container.find('data-entry-order-payment-type').length)
            //     arrayObjects.push('Payment Type');

            if (!$container.find("data-entry-order-total-summary").length)
                arrayObjects.push("Order Total Summary");
        }

        if (arrayObjects.length) {
            //xxx widget is required for saving data
            const wigdetNames = arrayObjects.join(", ");
            return arrayObjects.length == 1
                ? `The ` + wigdetNames + ` widget is required for saving data!`
                : `The ` +
                      wigdetNames +
                      ` widgets are required for saving data!`;
        }

        return null;
    }

    private validateFormFailed() {
        this.submitFailed();
        this.focusWhenValidation();
        this._changeDetectorRef.detectChanges();
    }

    private isShowWarningDialogPaymentTotalAmount() {
        if (
            this.tabID != OrderDataEntryTabEnum.Manual &&
            this.tabID != OrderDataEntryTabEnum.Scanning
        )
            return false;
        if (
            !this.orderTotalSummaryData ||
            !this.orderTotalSummaryData.subTotalAmount ||
            !this.paymentTypeData ||
            !this.paymentTypeData.mappedData ||
            !this.paymentTypeData.mappedData.length
        )
            return false;

        const subTotalAmount = Number(
            this.orderTotalSummaryData.subTotalAmount
        );
        if (subTotalAmount === 0) return false;

        return true;
    }

    private showWarningDialogPaymentTotalAmount() {
        //Only show warning when subTotal is negative
        this.modalService.showMessageModal(
            new MessageModalModel({
                customClass: "dialog-confirm-total",
                //callBackFunc: null,
                messageType: MessageModal.MessageType.warning,
                modalSize: MessageModal.ModalSize.middle,
                showCloseButton: true,
                header: new MessageModalHeaderModel({
                    text: "Save Order",
                }),
                body: new MessageModalBodyModel({
                    isHtmlContent: true,
                    content: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__The_Payment_Not_Enough_Order_Save_Order",
                        },
                        { key: "</p>" },
                    ],
                }),
                footer: new MessageModalFooterModel({
                    isFocus: true,
                    buttonList: [
                        new ButtonList({
                            buttonType: MessageModal.ButtonType.primary,
                            text: "Accept",
                            //disabled: false,
                            customClass: "",
                            callBackFunc: () => {
                                this.modalService.hideModal();
                                if (this.paymentTypeData)
                                    this.paymentTypeData.paymentConfirm = 1; //Accept

                                this.onSubmitSaveODE();
                            },
                        }),
                        new ButtonList({
                            buttonType: MessageModal.ButtonType.default,
                            text: "Pay in new Order",
                            customClass: "",
                            callBackFunc: () => {
                                this.modalService.hideModal();
                                if (this.paymentTypeData)
                                    this.paymentTypeData.paymentConfirm = 2; //Pay in new Order

                                this.onSubmitSaveODE();
                            },
                        }),
                        new ButtonList({
                            buttonType: MessageModal.ButtonType.default,
                            text: "Cancel",
                            customClass: "",
                            callBackFunc: () => {
                                this.modalService.hideModal();
                            },
                            focus: true,
                        }),
                    ],
                }),
            })
        );
    }

    private submitFailed() {
        const errorMessage = this.getErrorMessageWithRequiredWigdets();
        let outputData = {
            isDirty: this.orderDataEntryForm.dirty,
            isValid: false,
            formValue: this.orderDataEntryForm.value,
            submitResult: false,
            errorMessage: errorMessage,
        };
        this.store.dispatch(
            this.processDataActions.formValid(outputData.isValid, this.ofModule)
        );
        this.store.dispatch(
            this.processDataActions.formDirty(outputData.isDirty, this.ofModule)
        );
        this.store.dispatch(
            this.processDataActions.saveOnlyMainTabResult(
                outputData,
                this.ofModule
            )
        );
    }

    public onSubmit(
        customerData: FormModel,
        communicationData: FormModel,
        paymentTypeData,
        articleGridData
    ) {
        try {
            const model = this.orderDataEntryForm.value;
            let data = {
                IdPerson: model.customerId,
                CustomerNr: this.orderDataEntryForm.controls["customer"].value,
                CustomerData: null,
                Communications:
                    communicationData &&
                    communicationData.mappedData &&
                    communicationData.mappedData.length
                        ? communicationData.mappedData
                        : null,
                Orders: [this.prepareOrderData()],
                OrderArticles:
                    articleGridData &&
                    articleGridData.mappedData &&
                    articleGridData.mappedData.length
                        ? articleGridData.mappedData
                        : null,
                OrderPayments:
                    paymentTypeData &&
                    paymentTypeData.mappedData &&
                    paymentTypeData.mappedData.length
                        ? this.prepareOrderPaymentsData(
                              paymentTypeData.mappedData
                          )
                        : null,
                PaymentConfirm: paymentTypeData
                    ? paymentTypeData.paymentConfirm
                    : null,
            };

            if (customerData && customerData.mappedData) {
                customerData.mappedData["PersonAlias"] = null;
                if (customerData.originalCustomerData) {
                    customerData.mappedData["Person"]["IsActive"] =
                        Uti.toBoolean(
                            customerData.originalCustomerData.isActive.value ||
                                "true"
                        );
                    customerData.mappedData["Person"]["IsMatch"] =
                        Uti.toBoolean(
                            customerData.originalCustomerData.isMatch.value ||
                                "false"
                        );
                }
                data.CustomerData = [customerData.mappedData];
            }

            if (this.scanBarcodeProcess.saveEnabled)
                this.saveDataEntryForScanBarcode(data);
            else this.saveDataEntry(data);
        } catch (ex) {
            this.orderDataEntryForm["submitted"] = true;
        }

        return false;
    }

    private prepareOrderPaymentsData(mappedData: Array<any>) {
        if (
            this.orderTotalSummaryData &&
            this.orderTotalSummaryData.paymentDetails.length
        ) {
            mappedData.forEach((item) => {
                const paymentItem =
                    this.orderTotalSummaryData.paymentDetails.find(
                        (p) => p.paymentId == item["PaymentId"]
                    );
                if (paymentItem) {
                    let findItem = null;
                    if (paymentItem.amounts)
                        findItem = paymentItem.amounts.find(
                            (p) => p.index == item["AmountIndex"]
                        );

                    findItem = findItem || paymentItem;
                    if (findItem) {
                        item["PaidAmount"] = findItem.cost;
                        if (findItem.exchangeRate) {
                            item["PaidAmount"] = findItem.exchangeValue;
                            item["ConversionValue"] = findItem.exchangeRate;
                            item["ConversionPaidAmount"] = findItem.cost;
                            item["SystemCurrency"] = findItem.systemCurrency;
                            item["SystemConversionValue"] =
                                findItem.systemConversionValue;
                        }
                    }
                }
            });
        }
        return mappedData;
    }

    private prepareOrderData() {
        const model = this.orderDataEntryForm.value;
        let resultData = {
            IdSalesOrder: null,
            IdSalesCampaignWizard: model.idSalesCampaignWizard,
            IdSalesCampaignWizardItems: "",
            IdRepSalesOrderType: model.orderType,
            IdRepSalesOrderProvenanceType: model.orderBy,
            MEDIACODE: model.mediacode,
            PackageNr: model.packageNr,
            IdRepSalesOrderShipper: model.idRepSalesOrderShipper,
            OrderDate: Uti.parseDateToDBString(model.orderDate),
            Notes: "",
            IsActive: true,
            IsDeleted: "0",
            Amount: null,
            GrossAmount: null,
            PostageCost: null,
            IsFreeShipping: false,
            IsGift: true,
            GiftType: null,
            IdRepCurrencyCode: this.mainCurrency
                ? this.mainCurrency.idRepCurrencyCode
                : null,
            IdScansContainerItems: this.currentScanningStatus
                ? this.currentScanningStatus.idScansContainerItems
                : null,
        };

        if (this.orderTotalSummaryData) {
            resultData["Amount"] = this.orderTotalSummaryData.total;
            resultData["GrossAmount"] = this.orderTotalSummaryData.totalAmount;
            resultData["IsFreeShipping"] =
                this.orderTotalSummaryData.isFreeShipping;
            if (!this.orderTotalSummaryData.isFreeShipping)
                resultData["PostageCost"] =
                    this.orderTotalSummaryData.deliveryCharges;
        }
        if (this.articleGridExportData && this.articleGridExportData.giftInfo) {
            resultData["IsGift"] = this.articleGridExportData.giftInfo.isGift;
            resultData["GiftType"] =
                this.articleGridExportData.giftInfo.giftType;
        }
        return resultData;
    }

    private setOutputData(submitResult: any, data?: any) {
        let outputModel: any = null;
        if (!isNil(data)) {
            outputModel = data;
        } else {
            outputModel = new FormOutputModel({
                isDirty: this.orderDataEntryForm.dirty,
                isValid: this.orderDataEntryForm.valid,
                formValue: this.orderDataEntryForm.value,
                submitResult: submitResult,
            });
        }
        this.outputData.emit(outputModel);
    }

    private saveDataEntry(data) {
        this.isDataProcessing = true;
        this.dataEntryProcess.paymentTypeData = {};

        const testingOrderFailed = false;
        if (testingOrderFailed) {
            this.processForOrderFailed();
            return;
        }

        this.dataEntryService
            .saveOrderDataEntry(data)
            .finally(() => {
                this.isDataProcessing = false;
            })
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response) return;
                        if (response.returnID)
                            this.saveDataEntrySuccess(response);
                        else this.saveDataEntryFailed();
                    });
                },
                (err) => {
                    //failed
                    this.saveDataEntryFailed();
                }
            );
    }

    private saveDataEntrySuccess(saveResult: any) {
        this.dataEntryProcess.paymentTypeData = {
            paymentType: this.paymentTypeData
                ? cloneDeep(this.paymentTypeData.formValue)
                : null,
            mainCurrency: this.orderFailedData.mainCurrency,
            mainPaymenTypeList: this.orderFailedData.mainPaymenTypeList,
        };
        this.dataEntryProcess.notApprovedPaymentsMethods = null;

        this.deleteOrderFailed();

        //prevent call save OrderType
        this._isPreventSaveOrderTypeFromProperties = true;
        this.clearAllData(true);
        //dispatch to Reset All Form Data
        this.store.dispatch(
            this.dataEntryActions.dataEntryResetAllFormData(this.tabID)
        );
        //dispatch to notify save success
        this.store.dispatch(
            this.dataEntryActions.dataEntrySaveResult(
                new FormOutputModel({
                    isDirty: false,
                    isValid: true,
                    formValue: this.orderDataEntryForm.value,
                    submitResult: true,
                    returnID: saveResult.returnID,
                }),
                this.tabID
            )
        );

        //dispatch to reload tab
        setTimeout(() => {
            this.store.dispatch(
                this.dataEntryActions.dataEntryScanningStatusCallReload(
                    true,
                    this.tabID
                )
            );
            this.focusOnBarcode(1500);
            //allow call save OrderType
            this._isPreventSaveOrderTypeFromProperties = false;

            //Save SAV file
            this.saveSAVFile(saveResult.returnID, saveResult.idGenerateLetter);
        }, 300);
    }

    private saveDataEntryFailed() {
        //save order failed:
        this.processForOrderFailed();

        //dispatch failed
        this.store.dispatch(
            this.dataEntryActions.dataEntrySaveResult(
                new FormOutputModel({
                    isDirty: false,
                    isValid: true,
                    formValue: this.orderDataEntryForm.value,
                    submitResult: true,
                    returnID: null,
                }),
                this.tabID
            )
        );
        //Save SAV file
    }

    private saveDataEntryForScanBarcode(data) {
        //console.log('scanBarcode-SaveDataEntryForScanBarcode: ' + new Date());
        //this.buildDataForSAV();

        this.dataEntryService.saveOrderDataEntry(data, true).subscribe(
            (response: any) => {
                if (!response) return;

                this.toasterService.pop(
                    "success",
                    "Success",
                    "Save added successfully"
                );
                if (response.returnID && response.idGenerateLetter) {
                    this.saveSAVFile(
                        response.returnID,
                        response.idGenerateLetter
                    );
                }
            },
            (err) => {
                this.toasterService.pop(
                    "error",
                    "Failed",
                    "Save operation is not successful."
                );
            }
        );

        //Allow saving continuously
        this.clearAllDataForScanBarcode();
    }

    private clearAllDataForScanBarcode() {
        this.setIncorrectValidatorControl("mediacode", true); //valid
        this.setIncorrectValidatorControl("customer", true); //valid

        this.previousValues = {
            mediaCode: "",
            campaignNumber: "",
        };
        this.validMediaCodeCampaignNrList.length = 0;
        this.countryListByCampaign.length = 0;
        this.mediaCode = "";
        this.campaignNr = "";
        this.inputMediaCodeFirst = false;
        this.inputCampaignNumberFirst = false;
        this.inputMediaCodeFromDialog = false;
        this.resetWidgetData();
        //prevent call save OrderType
        this._isPreventSaveOrderTypeFromProperties = true;
        this.storeFormControlValue();
        Uti.resetValueForForm(this.orderDataEntryForm);
        this.clearCustomerAndCommunicationData();
        this.bindFormControlValue();
        this.orderDataEntryForm.markAsPristine();
        this.orderDataEntryForm.markAsUntouched();

        //set = true to prevent focus on first control of tab Customer
        this.pressSkipButton = true;

        this.scanBarcodeProcess.saveEnabled = false;
        setTimeout(() => {
            this.scanBarcodeProcess.preventFocus = false;
            this.isDataProcessing = false;
            this.focusOnBarcode(1500);
            //allow call save OrderType
            this._isPreventSaveOrderTypeFromProperties = false;
        }, 300);
    }

    private formValidate(): boolean {
        this.validateOrderDate();
        return this.orderDataEntryForm.valid && !this.isInvalidOrderDate;
    }

    private checkValidStatusForSaving() {
        let orderDataEntryFormStatus = this.orderDataEntryForm.valid;
        let customerStatus = false;
        let isValid = true;

        //don't check customer with case customerNr doesn't exists in DB
        if (this.customerData) customerStatus = true;

        const orderTypeValue =
            this.orderDataEntryForm.controls["orderType"].value;
        //Order type is GAMMER
        if (orderTypeValue == "2") {
            isValid = orderDataEntryFormStatus && customerStatus;
        } else {
            let paymentTypeStatus = false;
            let articleGridExportStatus = false;

            if (this.paymentTypeData)
                paymentTypeStatus = this.paymentTypeData.isValid;

            if (this.articleGridExportData)
                articleGridExportStatus = this.articleGridExportData.isValid;

            isValid =
                orderDataEntryFormStatus &&
                paymentTypeStatus &&
                articleGridExportStatus &&
                customerStatus;
        }

        if (isValid) isValid = this.customerHasCountryOfCurrentCampaign();

        this.store.dispatch(
            this.dataEntryActions.dataEntryDisabledSaveButton(
                isValid,
                orderTypeValue,
                this.tabID
            )
        );

        return isValid;
    }

    private checkDirtyStatusForForm() {
        const isDirty =
            (this.orderDataEntryForm && this.orderDataEntryForm.dirty) ||
            (this.customerData && this.customerData.isDirty) ||
            (this.paymentTypeData && this.paymentTypeData.isDirty) ||
            (this.articleGridExportData &&
                this.articleGridExportData.isDirty) ||
            (this.communicationData && this.communicationData.isDirty);

        this.store.dispatch(
            this.processDataActions.formDirty(isDirty, this.ofModule)
        );
    }

    private initFormFieldData() {
        this.buildFormFields();
        this.buildWidgetContentDetail();
    }

    private buildWidgetContentDetail() {
        const results = [];

        if (this.formFields && this.formFields.length) {
            this.formFields.forEach((field) => {
                results.push({
                    ColumnName: field.fieldDisplayName,
                    OriginalColumnName: field.fieldName,
                    Setting: [],
                    Value: null,
                });
            });
        }

        this.outputWidgetFields.emit(results);
    }

    private buildFormFields() {
        if (this.formFields || this.formFields.length) return;

        this.formFields = [
            new FieldFilter({
                fieldDisplayName: "Barcode",
                fieldName: "barcode",
                selected: true,
                isEditable: false,
            }),
            new FieldFilter({
                fieldDisplayName: "Customer#",
                fieldName: "customer",
                selected: true,
                isEditable: false,
            }),
            new FieldFilter({
                fieldDisplayName: "Mediacode",
                fieldName: "mediacode",
                selected: true,
                isEditable: false,
            }),
            new FieldFilter({
                fieldDisplayName: "Order By",
                fieldName: "orderBy",
                selected: true,
                isEditable: false,
            }),
            new FieldFilter({
                fieldDisplayName: "Order Type",
                fieldName: "orderType",
                selected: true,
                isEditable: false,
            }),
            new FieldFilter({
                fieldDisplayName: "Order Date",
                fieldName: "orderDate",
                selected: true,
                isEditable: false,
            }),
        ];
    }

    private clearAllData(dontClearStore?: boolean) {
        this.setIncorrectValidatorControl("mediacode", true); //valid
        this.setIncorrectValidatorControl("customer", true); //valid

        this.previousValues = {
            mediaCode: "",
            campaignNumber: "",
        };
        this.validMediaCodeCampaignNrList.length = 0;
        this.countryListByCampaign.length = 0;
        this.mediaCode = "";
        this.campaignNr = "";
        this.inputMediaCodeFirst = false;
        this.inputCampaignNumberFirst = false;
        this.inputMediaCodeFromDialog = false;
        if (dontClearStore != true) {
            this.store.dispatch(
                this.dataEntryActions.dataEntrySetArticleGridData(
                    {},
                    this.tabID
                )
            );
            this.store.dispatch(
                this.dataEntryActions.dataEntrySetMainCurrencyAndPaymentTypeList(
                    null,
                    [],
                    this.tabID
                )
            );
        }
        this.resetWidgetData();
        this.storeFormControlValue();
        Uti.resetValueForForm(this.orderDataEntryForm);
        this.clearCustomerAndCommunicationData(dontClearStore);
        this.bindFormControlValue();
        this.orderDataEntryForm.markAsPristine();
        this.orderDataEntryForm.markAsUntouched();

        //set = true to prevent focus on first control of tab Customer
        this.pressSkipButton = true;
        //dispatch to active tab Customer
        this.store.dispatch(
            this.tabSummaryActions.requestSelectSimpleTab(0, this.ofModule)
        );

        this.clearOrderFailed(dontClearStore);
    }
    //#endregion

    //#region OrderType
    public orderTypeGotFocus() {
        if (this.orderTypeCtrl && !this.orderTypeCtrl.selectedValue) {
            this.orderTypeCtrl.isDroppedDown = true;
            this.orderTypeCtrl.onIsDroppedDownChanged();
        }
    }

    public orderTypeSelectedIndexChanged() {
        if (
            this.orderTypeCtrl &&
            this.orderTypeCtrl.selectedValue &&
            !this.orderTypeCtrl.isDroppedDown &&
            this.orderDataEntryForm.controls["orderType"].value &&
            !this._isPreventSaveOrderTypeFromProperties
        ) {
            this.orderTypeValueFromWidgetProperty =
                this.orderDataEntryForm.controls["orderType"].value;
            this.storeFormControlValue();
        }
    }
    //#endregion

    //#region OrderBy
    public orderByGotFocus() {
        if (this.orderByCtrl && !this.orderByCtrl.selectedValue) {
            this.orderByCtrl.isDroppedDown = true;
            this.orderByCtrl.onIsDroppedDownChanged();
        }
    }

    public orderBySelectedIndexChanged() {
        if (
            this.orderByCtrl &&
            this.orderByCtrl.selectedValue &&
            !this.orderByCtrl.isDroppedDown &&
            this.orderDataEntryForm.controls["orderBy"].value &&
            !this._isPreventSaveOrderTypeFromProperties
        ) {
            this.storeFormControlValue();
        }
    }
    //#endregion

    //#region OrderDate
    public orderDateChanged() {
        const orderDate = this.orderDataEntryForm.controls["orderDate"].value;
        if (orderDate) {
            const orderDay = this.uti.formatLocale(orderDate, "dd");
            const orderMonth = this.uti.formatLocale(orderDate, "MM");
            const orderYear = this.uti.formatLocale(orderDate, "yyyy");
            this.orderDataEntryForm.controls["orderDay"].setValue(orderDay);
            this.orderDataEntryForm.controls["orderMonth"].setValue(orderMonth);
            this.orderDataEntryForm.controls["orderYear"].setValue(orderYear);

            this.storeFormControlValue();
            this.validateOrderDate(orderDay, orderMonth, orderYear);
        }
    }

    private validateOrderDate(day?: any, month?: any, year?: any) {
        if (!day) {
            const orderDate =
                this.orderDataEntryForm.controls["orderDate"].value;
            if (orderDate) {
                day = this.uti.formatLocale(orderDate, "dd");
                month = this.uti.formatLocale(orderDate, "MM");
                year = this.uti.formatLocale(orderDate, "yyyy");
            }
        }

        if (
            !(!day && !month && !year) &&
            (!day ||
                !month ||
                !year ||
                !this.isValidDate(day + "/" + month + "/" + year))
        ) {
            this.isInvalidOrderDate = true;
        }
        this.isInvalidOrderDate = false;
    }

    private isValidDate(s) {
        const bits = s.split("/"),
            y = bits[2],
            m = bits[1],
            d = bits[0],
            // Assume not leap year by default (note zero index for Jan)
            daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // If evenly divisible by 4 and not evenly divisible by 100,
        // or is evenly divisible by 400, then a leap year
        if ((!(parseInt(y) % 4) && parseInt(y) % 100) || !(parseInt(y) % 400)) {
            daysInMonth[1] = 29;
        }
        return (
            y.length == 4 &&
            parseInt(y) >= new Date().getFullYear() - 100 &&
            !/\D/.test(String(d)) &&
            parseInt(d) > 0 &&
            parseInt(d) <= daysInMonth[parseInt(m) - 1]
        );
    }

    public onOrderDateGotFocus() {
        $(this.orderDateControl.hostElement).focus();
    }
    //#endregion

    //#region MediaCode
    private mediaCodeTyping: boolean = false;
    public mediacodeKeyup(event) {
        this.mediaCodeTyping = true;

        if (!this.inputMediaCodeFirst && !this.inputCampaignNumberFirst)
            this.inputMediaCodeFirst = true;

        // Ctrl: 17, A: 65, C: 67, V: 86
        const isCtrlAorCorV =
            (event.composed || event.ctrlKey) &&
            (event.keyCode === 17 ||
                event.keyCode === 65 ||
                event.keyCode === 67); // || event.keyCode === 86
        if (
            this.inputMediaCodeFirst &&
            !isCtrlAorCorV &&
            this.orderDataEntryForm.controls["mediacode"].value !=
                this.previousValues.mediaCode
        )
            this.orderDataEntryForm.controls["campaignNumber"].setValue("");

        if (event.keyCode == 13) {
            this.mediaCodeTyping = false;
            this.mediacodeDoSearch();
        }
    }

    public mediacodeBlur(event) {
        if (!this.mediaCodeTyping) return;

        this.mediaCodeTyping = false;
        this.mediacodeDoSearch();
    }

    public mediaCodeResetValue() {
        if (this.inputMediaCodeFirst)
            this.orderDataEntryForm.controls["campaignNumber"].setValue("");

        this.mediacodeDoSearch();
    }

    private mediacodeDoSearch() {
        this.orderDataEntryForm.updateValueAndValidity();
        const mediaCode = this.orderDataEntryForm.controls["mediacode"].value;
        const campaignNumber =
            this.orderDataEntryForm.controls["campaignNumber"].value;

        if (mediaCode) {
            let allowSearch: boolean =
                this.previousValues.mediaCode !== mediaCode ||
                this.previousValues.campaignNumber !== campaignNumber ||
                (mediaCode && !campaignNumber);
            if (allowSearch) {
                this.previousValues = {
                    mediaCode: mediaCode,
                    campaignNumber: campaignNumber,
                };
                this.getDataByMediaCode(mediaCode);
            }
        } else {
            if (!campaignNumber) {
                this.inputMediaCodeFirst = false;
                this.inputCampaignNumberFirst = false;
            }

            if (mediaCode || campaignNumber) {
                this.previousValues = {
                    mediaCode: mediaCode,
                    campaignNumber: campaignNumber,
                };
            }

            if (
                this.isShowDialogConfirmForChangingMediaCode() &&
                this.validMediaCodeCampaignNrList &&
                this.validMediaCodeCampaignNrList.length
            ) {
                const resetDataWhenMediaCodeChanged = () => {
                    const lastMediaCodeCampaignNr =
                        this.validMediaCodeCampaignNrList[
                            this.validMediaCodeCampaignNrList.length - 1
                        ];
                    this.orderDataEntryForm.controls["mediacode"].setValue(
                        lastMediaCodeCampaignNr.mediaCode
                    );
                    this.orderDataEntryForm.controls["campaignNumber"].setValue(
                        lastMediaCodeCampaignNr.campaignNr
                    );

                    this.previousValues = {
                        mediaCode: lastMediaCodeCampaignNr.mediaCode,
                        campaignNumber: lastMediaCodeCampaignNr.campaignNr,
                    };

                    this.inputMediaCodeFirst = true;
                    this.focusOnControl();
                };

                this.modalService.confirmMessageHtmlContent(
                    new MessageModel({
                        headerText: "Change MediaCode",
                        messageType: MessageModal.MessageType.warning,
                        message: [
                            { key: "<p>" },
                            {
                                key: "Modal_Message__Do_You_Want_To_Reset_Current_Payment_Article_Data",
                            },
                            { key: "</p>" },
                        ],
                        buttonType1: MessageModal.ButtonType.warning,
                        okText: "Yes",
                        cancelText: "No",
                        callBack1: () => {
                            let idx =
                                this.validMediaCodeCampaignNrList.findIndex(
                                    (x) =>
                                        x.mediaCode ==
                                            this.previousValues.mediaCode &&
                                        x.campaignNr ==
                                            this.previousValues.campaignNumber
                                );
                            if (idx !== -1) {
                                //At position Index, remove 1 item
                                this.validMediaCodeCampaignNrList.splice(
                                    idx,
                                    1
                                );
                            }

                            this.previousValues = {
                                mediaCode: mediaCode,
                                campaignNumber: campaignNumber,
                            };

                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySetArticleGridData(
                                    {},
                                    this.tabID
                                )
                            );
                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySetMainCurrencyAndPaymentTypeList(
                                    this.mainCurrency,
                                    [],
                                    this.tabID
                                )
                            );

                            this.focusOnControl();
                        },
                        callBack2: () => {
                            resetDataWhenMediaCodeChanged();
                        },
                        callBackCloseButton: () => {
                            resetDataWhenMediaCodeChanged();
                        },
                    })
                );
            }
        }
        this.store.dispatch(
            this.dataEntryActions.dataEntrySetOrderDataMediaCode(
                mediaCode,
                this.tabID
            )
        );
    }

    //Payment Type / Article Grid: has changed data and has changed MediaCode / CampaignNumber -> show dialog confirm
    private isShowDialogConfirmForChangingMediaCode() {
        if (
            this.validMediaCodeCampaignNrList &&
            this.validMediaCodeCampaignNrList.length &&
            ((this.paymentTypeData && this.paymentTypeData.isDirty) ||
                (this.articleGridExportData &&
                    this.articleGridExportData.isDirty))
        )
            return true;

        return false;
    }

    private checkShowDialogConfirmForChangingMediaCode(
        mediacode,
        campaign,
        setNewPaymentType,
        setNewArticleGrid
    ) {
        let setNewMediaCodeCampaignNr = () => {
            //CampaignNr
            if (this.orderDataEntryForm.controls) {
                this.orderDataEntryForm.controls["campaignNumber"].setValue(
                    campaign.CampaignNr
                );
                this.validMediaCodeCampaignNrList = [
                    {
                        mediaCode: mediacode,
                        campaignNr: campaign.CampaignNr,
                    },
                ];
                this.previousValues = {
                    mediaCode: mediacode,
                    campaignNumber: campaign.CampaignNr,
                };
            }
        };

        let resetPreviousMediaCodeCampaignNr = () => {
            if (
                this.validMediaCodeCampaignNrList &&
                this.validMediaCodeCampaignNrList.length
            ) {
                const lastMediaCodeCampaignNr =
                    this.validMediaCodeCampaignNrList[
                        this.validMediaCodeCampaignNrList.length - 1
                    ];

                this.orderDataEntryForm.controls["mediacode"].setValue(
                    lastMediaCodeCampaignNr.mediaCode
                );
                this.orderDataEntryForm.controls["campaignNumber"].setValue(
                    lastMediaCodeCampaignNr.campaignNr
                );
                this.previousValues = {
                    mediaCode: lastMediaCodeCampaignNr.mediaCode,
                    campaignNumber: lastMediaCodeCampaignNr.campaignNr,
                };

                this.mediacodeDoSearch();
            }
        };

        // Edited case
        if (
            this.isShowDialogConfirmForChangingMediaCode() &&
            this.isSkipAction === false &&
            this.validMediaCodeCampaignNrList &&
            this.validMediaCodeCampaignNrList.length
        ) {
            const lastMediaCampaign =
                this.validMediaCodeCampaignNrList[
                    this.validMediaCodeCampaignNrList.length - 1
                ];
            if (
                !this.mediaCodeShowDialog &&
                (lastMediaCampaign.mediaCode != mediacode ||
                    lastMediaCampaign.campaignNr != campaign.CampaignNr)
            ) {
                // Display confirm message here
                this.modalService.confirmMessageHtmlContent(
                    new MessageModel({
                        headerText: "Change MediaCode",
                        messageType: MessageModal.MessageType.warning,
                        message: [
                            { key: "<p>" },
                            {
                                key: "Modal_Message__Mediacode_CampaignNr_Changed_Do_You_Want_To_Reset_Current_Payment_Article_Data",
                            },
                            { key: "</p>" },
                        ],
                        buttonType1: MessageModal.ButtonType.warning,
                        callBack1: () => {
                            setNewMediaCodeCampaignNr();
                            setNewPaymentType();
                            setNewArticleGrid();

                            this.focusOnControl();
                        },
                        callBack2: () => {
                            resetPreviousMediaCodeCampaignNr();
                        },
                        callBackCloseButton: () => {
                            resetPreviousMediaCodeCampaignNr();
                        },
                    })
                );
            }
            if (
                lastMediaCampaign.mediaCode == mediacode &&
                lastMediaCampaign.campaignNr == campaign.CampaignNr &&
                !this.orderDataEntryForm.controls["campaignNumber"].value
            ) {
                this.orderDataEntryForm.controls["campaignNumber"].setValue(
                    lastMediaCampaign.campaignNr
                );
                this.focusOnControl();
            }
        }
        // Not edited yet.
        else {
            setNewMediaCodeCampaignNr();
            setNewPaymentType();
            setNewArticleGrid();
            this.focusOnControl();

            this.editOrderCheckLoading.loadedMediaCode = true;
            this.loadOrder();
        }
    }

    private getDataByMediaCode(mediacode: string) {
        this.indicatorControl.isMediaCodeSearching = true;
        let campaignNr = null;
        if (this.orderDataEntryForm) {
            campaignNr =
                this.orderDataEntryForm.controls["campaignNumber"].value;
        }
        forkJoin(
            this.dataEntryService.getArticleDataByMediacodeNr(
                mediacode,
                this.isScanningTab
            ),
            this.dataEntryService.getMainCurrencyAndPaymentType(
                mediacode,
                campaignNr,
                this.isScanningTab
            )
        )
            .finally(() => {
                this.indicatorControl.isMediaCodeSearching = false;
            })
            .subscribe(([response1, response2]) => {
                this.appErrorHandler.executeAction(() => {
                    let isValidArticleData: boolean;
                    let isValidCampaignNr: boolean;
                    let isValidPaymentType: boolean;
                    const currencyIndex = 0;
                    const paymentTypeIndex = 1;

                    // For Article Data
                    if (
                        response1 &&
                        response1.data &&
                        response1.data.length &&
                        response1.data[1].length
                    )
                        isValidArticleData = true;

                    // For CampaignNr
                    if (response2 && response2.data && response2.data.length) {
                        if (
                            response2.data[currencyIndex] &&
                            response2.data[currencyIndex].length &&
                            response2.data[currencyIndex][0].CampaignNr
                        ) {
                            // Binding data whenever user open mediacode dialog
                            const item = response2.data[currencyIndex][0];
                            Object.assign(this.mediaCodeResult, {
                                campaignNr: item.CampaignNr,
                                idRepIsoCountryCode: item.IdRepIsoCountryCode,
                                idRepLanguage: item.IdRepLanguage,
                                idSalesCampaignWizard:
                                    item.IdSalesCampaignWizard,
                            });

                            //[{"IsoCode":"FR"},{"IsoCode":"DE"},{"IsoCode":"GB"},{"IsoCode":"AU"},{"IsoCode":"US"}]
                            this.countryListByCampaign = JSON.parse(
                                item.IsoCountries
                            );

                            isValidCampaignNr = true;
                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySelectedCampaignNumberData(
                                    item.CampaignNr,
                                    this.tabID
                                )
                            );

                            this.customerHasCountryOfCurrentCampaign();
                        }

                        // For Payment Type
                        if (
                            response2.data[paymentTypeIndex] &&
                            response2.data[paymentTypeIndex].length
                        )
                            isValidPaymentType = true;
                    }

                    this.setIncorrectValidatorControl(
                        "mediacode",
                        isValidCampaignNr && isValidPaymentType
                    ); //true: valid, false: error

                    // Found CampaignNr
                    if (isValidCampaignNr) {
                        const campaign = response2.data[currencyIndex][0];
                        let setNewArticleGrid = () => {
                            if (isValidArticleData)
                                this.store.dispatch(
                                    this.dataEntryActions.dataEntrySetArticleGridData(
                                        response1,
                                        this.tabID
                                    )
                                );
                            else
                                this.store.dispatch(
                                    this.dataEntryActions.dataEntrySetArticleGridData(
                                        {},
                                        this.tabID
                                    )
                                );
                        };

                        let setNewPaymentType = () => {
                            this.mainCurrency = new Currency({
                                idRepCurrencyCode: campaign.IdRepCurrencyCode,
                                currencyCode: campaign.CurrencyCode,
                            });

                            if (isValidPaymentType) {
                                const array = response2.data[
                                    paymentTypeIndex
                                ] as Array<any>;
                                let mainPaymenTypeList: Array<PaymentType> =
                                    array.map((p) => {
                                        return new PaymentType({
                                            idRepInvoicePaymentType:
                                                p.IdRepInvoicePaymentType,
                                            paymentType: p.PaymentType,
                                            postageCosts: p.PostageCosts,
                                            paymentGroup: Number(
                                                p.PaymentGroup
                                            ),
                                        });
                                    });

                                this.orderFailedData.mainCurrency =
                                    this.mainCurrency;
                                this.orderFailedData.mainPaymenTypeList =
                                    mainPaymenTypeList;
                            } else {
                                this.orderFailedData.mainPaymenTypeList = [];
                            }
                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySetMainCurrencyAndPaymentTypeList(
                                    this.mainCurrency,
                                    this.orderFailedData.mainPaymenTypeList,
                                    this.tabID
                                )
                            );
                        };
                        this.checkShowDialogConfirmForChangingMediaCode(
                            mediacode,
                            campaign,
                            setNewPaymentType,
                            setNewArticleGrid
                        );
                    }
                    // Not Found Campagin Nr
                    else {
                        if (this.isShowDialogConfirmForChangingMediaCode()) {
                            this.modalService.warningMessageHtmlContent({
                                message: [
                                    {
                                        key: "Modal_Message__The_Mediacode_And_CampaignNr_Are_Not_Consistent",
                                    },
                                ],
                                closeText: "Ok",
                                callBack: () => {
                                    if (
                                        this.validMediaCodeCampaignNrList &&
                                        this.validMediaCodeCampaignNrList.length
                                    ) {
                                        const lastMediaCodeCampaignNr =
                                            this.validMediaCodeCampaignNrList[
                                                this
                                                    .validMediaCodeCampaignNrList
                                                    .length - 1
                                            ];
                                        if (this.orderDataEntryForm) {
                                            this.orderDataEntryForm.controls[
                                                "mediacode"
                                            ].setValue(
                                                lastMediaCodeCampaignNr.mediaCode
                                            );
                                            this.orderDataEntryForm.controls[
                                                "campaignNumber"
                                            ].setValue(
                                                lastMediaCodeCampaignNr.campaignNr
                                            );
                                        }
                                        this.previousValues = {
                                            mediaCode:
                                                lastMediaCodeCampaignNr.mediaCode,
                                            campaignNumber:
                                                lastMediaCodeCampaignNr.campaignNr,
                                        };
                                    }
                                    this.focusOnControl();
                                },
                            });
                        } else {
                            this.countryListByCampaign.length = 0;

                            //Clear Article Grid
                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySetArticleGridData(
                                    {},
                                    this.tabID
                                )
                            );
                            //Clear Payment Type
                            this.store.dispatch(
                                this.dataEntryActions.dataEntrySetMainCurrencyAndPaymentTypeList(
                                    this.mainCurrency,
                                    [],
                                    this.tabID
                                )
                            );

                            this.focusOnControl();
                        }
                    }

                    this.scanBarcodeGetMediaCodeFinish();
                });
            });
    }

    //#region media code Search Dialog
    public mediaCodeResult: any = {};
    public mediaCodeShowDialog = false;
    public mediaCodeModalWidth = 0;
    public mediaCodeModalHeight = 0;
    public mediaCodeBodyHeight: any;

    public mediaCodeShowSearchDialog() {
        this.mediaCodeShowDialog = true;
        this.mediaCodeModalWidth = window.screen.width - 200;
        this.mediaCodeModalHeight = window.screen.height - 300;
        this.mediaCodeBodyHeight = {
            height: this.mediaCodeModalHeight - 135 + "px",
        };
    }

    //(On Dialog) click on the 'Ok' button
    public mediaCodeClickOkDialog() {
        this.mediaCodeModalWidth = 0;
        this.mediaCodeModalHeight = 0;
        this.isMaximized = false;
        this.mediaCodeShowDialog = false;

        this.orderDataEntryForm.controls["mediacode"].setValue(
            this.mediaCodeResult.mediaCode
        );
        this.orderDataEntryForm.controls["idSalesCampaignMediaCode"].setValue(
            this.mediaCodeResult.idSalesCampaignMediaCode
        );

        if (this.inputMediaCodeFirst) {
            this.orderDataEntryForm.controls["campaignNumber"].setValue(
                this.mediaCodeResult.campaignNr
            );
        }

        this.getDataByMediaCode(
            this.orderDataEntryForm.controls["mediacode"].value
        );
        this.getCustomMandatoryField(
            this.orderDataEntryForm.controls["mediacode"].value
        );

        this.orderDataEntryForm.updateValueAndValidity();

        this.store.dispatch(
            this.dataEntryActions.dataEntrySetOrderDataMediaCode(
                this.mediaCodeResult.mediaCode,
                this.tabID
            )
        );

        this.previousValues = {
            mediaCode: this.mediaCodeResult.mediaCode,
            campaignNumber: this.mediaCodeResult.campaignNr,
        };

        if (this.mediaCodeResult.mediaCode) {
            this.setOutputData(
                null,
                new FormOutputModel({
                    isValid: this.orderDataEntryForm.valid,
                    isDirty: true,
                    formValue: this.orderDataEntryForm.value,
                    submitResult: null,
                })
            );
        }
    }

    //(On Dialog) called when 'click' on row to select MediaCode
    public mediaCodeSelectWhenClickOnRow($event: any) {
        if (!this.inputMediaCodeFirst && !this.inputCampaignNumberFirst)
            this.inputMediaCodeFirst = true;

        this.mediaCodeResult = $event;
        this.previousValues = {
            mediaCode: this.mediaCodeResult.mediaCode,
            campaignNumber: this.mediaCodeResult.campaignNr,
        };
    }

    //(On Dialog) called when 'double click' on row to select MediaCode -> select row and close dialog
    public mediaCodeSelectWhenDoubleClickOn($event: any) {
        this.mediaCodeSelectWhenClickOnRow($event);
        this.mediaCodeClickOkDialog();
    }

    //(On Dialog) click on the 'Close' button
    public mediaCodeCloseDialog() {
        this.mediaCodeModalWidth = 0;
        this.mediaCodeModalHeight = 0;
        this.isMaximized = false;
        this.mediaCodeShowDialog = false;
    }

    private setIncorrectValidatorControl(
        controlName: string,
        isValid: boolean
    ) {
        if (!isValid) this.scanBarcodeProcess.preventFocus = false;

        if (!this.orderDataEntryForm) return;

        const ctrl = this.orderDataEntryForm.controls[controlName];
        if (!ctrl) return;

        ctrl["valueIncorrect"] = !isValid;
        ctrl.markAsDirty();

        ctrl.setErrors(isValid ? null : { incorrect: true });

        let errorMessage: string;
        switch (controlName) {
            case "mediacode":
                if (isValid) {
                    this.dataEntryProcess.mediaCodeDoesnotExist = false;
                } else {
                    this.dataEntryProcess.mediaCodeDoesnotExist = true;
                    errorMessage = "Media code does not exist";
                }
                break;
            case "customer":
                if (!isValid) errorMessage = "Customer number does not exist";
                break;
            default:
                if (!isValid)
                    errorMessage =
                        controlName.toUpperCase() + " does not exist";
                break;
        } //switch

        if (errorMessage)
            this.toasterService.pop("error", "Error", errorMessage);

        ctrl.updateValueAndValidity();
    }

    private incorrectValidator(control: FormControl): Observable<any> {
        return new Observable<any>((obser) => {
            if (!control["valueIncorrect"]) {
                obser.next(null); //ok
            } else {
                obser.next({ incorrect: true });
            }
            obser.complete();
        }).debounceTime(300);
    }
    //#endregion

    //#endregion

    //#region CampaignNumber
    private campaignNumberTyping: boolean = false;
    public campaignNumberKeyup($event) {
        this.campaignNumberTyping = true;

        if (!this.inputMediaCodeFirst && !this.inputCampaignNumberFirst)
            this.inputCampaignNumberFirst = true;

        if ($event.keyCode === 13) {
            this.campaignNumberTyping = false;
            this.campaignNumberDoSearch();
        }
    }

    public campaignNumberBlur($event) {
        if (!this.campaignNumberTyping) return;

        this.campaignNumberTyping = false;
        this.campaignNumberDoSearch();
    }

    public campaignNumberResetValue() {
        this.campaignNumberDoSearch();
    }

    private campaignNumberDoSearch() {
        this.orderDataEntryForm.updateValueAndValidity();
        const mediaCode = this.orderDataEntryForm.controls["mediacode"].value;
        const campaignNumber =
            this.orderDataEntryForm.controls["campaignNumber"].value;

        if (mediaCode) {
            let allowSearch: boolean =
                this.previousValues.mediaCode !== mediaCode ||
                this.previousValues.campaignNumber !== campaignNumber ||
                (mediaCode && !campaignNumber);
            if (allowSearch) {
                this.previousValues = {
                    mediaCode: mediaCode,
                    campaignNumber: campaignNumber,
                };
                this.getDataByMediaCode(mediaCode);
            }
        } else {
            if (!campaignNumber) {
                this.inputMediaCodeFirst = false;
                this.inputCampaignNumberFirst = false;
            }
        }

        this.store.dispatch(
            this.dataEntryActions.dataEntrySelectedCampaignNumberData(
                campaignNumber,
                this.tabID
            )
        );
    }

    public campaignNumberShowSearchDialog() {
        if (!this.searchCompaignDialogModule) return;

        this.searchCompaignDialogModule.open(
            this.orderDataEntryForm.controls.campaignNumber.value
        );
    }

    public campaignNumberItemSelect(data) {
        if (!data) return;

        if (!this.inputMediaCodeFirst && !this.inputCampaignNumberFirst)
            this.inputCampaignNumberFirst = true;

        const mediaCode = this.orderDataEntryForm.controls["mediacode"].value;
        const campaignNumber = data["campaignNr"];

        this.orderDataEntryForm.controls["campaignNumber"].setValue(
            campaignNumber
        );
        this.orderDataEntryForm.controls["idSalesCampaignWizard"].setValue(
            data["idSalesCampaignWizard"]
        );
        this.orderDataEntryForm.updateValueAndValidity();
        this.previousValues = {
            mediaCode: mediaCode,
            campaignNumber: campaignNumber,
        };
        this.setOutputData(
            null,
            new FormOutputModel({
                isValid: this.orderDataEntryForm.valid,
                isDirty: true,
                formValue: this.orderDataEntryForm.value,
                submitResult: null,
            })
        );

        this.focusOnControl();
    }
    //#endregion

    //#region Customer
    private customerTyping: boolean = false;
    public customerKeyup(event) {
        this.customerTyping = true;

        // only exe business if it is enter key
        if (event.keyCode == 13) {
            this.customerTyping = false;
            this.customerDoSearch();
        }
    }

    public customerBlur() {
        if (!this.customerTyping) return;

        this.customerTyping = false;
        this.customerDoSearch();
    }

    public customerResetValue() {
        // Existing customer
        if (this.idPerson || this.customerNr) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Change Customer",
                    messageType: MessageModal.MessageType.warning,
                    message: [
                        { key: "<p>" },
                        { key: "Modal_Message__Do_You_Want_To_Reset_Customer" },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.warning,
                    callBack1: () => {
                        this.clearCustomerAndCommunicationData();
                    },
                    callBack2: () => {
                        this.restoreCustomerAndCommunicationData();
                    },
                    callBackCloseButton: () => {
                        this.restoreCustomerAndCommunicationData();
                    },
                })
            );
        } else {
            this.clearCustomerAndCommunicationData();
        }
    }

    private customerDoSearch() {
        // only exe business if it is enter key
        const value = this.orderDataEntryForm.controls["customer"].value;
        if (value) {
            if (value !== this.customerNr) {
                this.indicatorControl.isCustomerSearching = true;
                //searchIndex, keyword, moduleId, pageIndex, pageSize, ...., isGetCustomerById
                this.searchService
                    .search(
                        "customer",
                        value,
                        2,
                        1,
                        100,
                        null,
                        null,
                        null,
                        null,
                        true
                    )
                    .finally(() => {
                        this.indicatorControl.isCustomerSearching = false;
                    })
                    .subscribe((response) => {
                        this.appErrorHandler.executeAction(() => {
                            this.customerSearchCompleted(response.item);
                        });
                    });
            }
        } else {
            this.customerSearchCompleted(null);
        }
    }

    private customerSearchCompleted(data: any): void {
        this.idPerson = this.orderDataEntryForm.controls["customerId"].value;
        if (data) {
            if (data.total == 1) {
                const item = data.results[0];
                if (this.idPerson || this.customerNr) {
                    this.modalService.confirmMessageHtmlContent(
                        new MessageModel({
                            headerText: "Change Customer",
                            messageType: MessageModal.MessageType.warning,
                            message: [
                                { key: "<p>" },
                                {
                                    key: "Modal_Message__Customer_Number_Changed_Would_You_Like_Change_Current_Customer_Communication_Data",
                                },
                                { key: "</p>" },
                            ],
                            buttonType1: MessageModal.ButtonType.warning,
                            okText: "Yes",
                            cancelText: "No",
                            callBack1: () => {
                                this.changeCustomerAndCommunicationData(item);
                            },
                            callBack2: () => {
                                this.restoreCustomerAndCommunicationData();
                            },
                            callBackCloseButton: () => {
                                this.restoreCustomerAndCommunicationData();
                            },
                        })
                    );
                } else {
                    this.changeCustomerAndCommunicationData(item);
                }
            } else if (data.total > 1) {
                this.customerShowSearchDialog();
            } else if (data.total == 0) {
                //if search from elastic isn't successfully, we will get from DB
                const customerNr =
                    this.orderDataEntryForm.controls["customer"].value;
                this.getCustomerData(customerNr);
            }
        } else {
            // Show Dialog(Ok) if has Data => Restore data
            if (this.idPerson || this.customerNr) {
                this.modalService.confirmMessageHtmlContent(
                    new MessageModel({
                        headerText: "Change Customer",
                        messageType: MessageModal.MessageType.warning,
                        message: [
                            { key: "<p>" },
                            {
                                key: "Modal_Message__Customer_Number_Changed_Would_You_Like_Reset_Customer_Communication_Data",
                            },
                            { key: "</p>" },
                        ],
                        buttonType1: MessageModal.ButtonType.warning,
                        callBack1: () => {
                            this.clearCustomerAndCommunicationData();
                        },
                        callBack2: () => {
                            this.restoreCustomerAndCommunicationData();
                        },
                        callBackCloseButton: () => {
                            this.restoreCustomerAndCommunicationData();
                        },
                    })
                );
            } else {
                this.clearCustomerAndCommunicationData();
            }
        }
    }

    private changeCustomerAndCommunicationData(data: any) {
        this.orderDataEntryForm.controls["customer"].setValue(data.personNr);
        this.orderDataEntryForm.controls["customerId"].setValue(data.idPerson);
        this.getCustomerData(data.personNr);
    }

    private getCustomerData(custNr: string, mdCode?: string) {
        if (!custNr) {
            //reset customer
            this.setIncorrectValidatorControl("customer", false); //error
            this.customerResetValue();
            return;
        }
        let mediaCode =
            mdCode || this.orderDataEntryForm.controls["mediacode"].value;
        this.isDataProcessing = true;
        this.dataEntryService
            .getCustomerDataByCustomerNr(custNr, this.isScanningTab, mediaCode)
            .finally(() => {
                if (!this.idSalesOrder) {
                    this.isDataProcessing = false;
                }
            })
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !response ||
                        !this.orderDataEntryForm ||
                        !this.orderDataEntryForm.controls
                    )
                        return;

                    //has data
                    if (
                        response.customerData &&
                        response.customerData["personNr"] &&
                        response.customerData["personNr"].value.length
                    ) {
                        this.store.dispatch(
                            this.dataEntryActions.dataEntryCustomerDataChanged(
                                new FormModel({
                                    rawData: response.customerData,
                                }),
                                this.tabID
                            )
                        );

                        this.idPerson = response.customerData["idPerson"].value;
                        this.customerNr =
                            response.customerData["personNr"].value;
                        this.orderDataEntryForm.controls["customerId"].setValue(
                            this.idPerson
                        );
                        this.orderDataEntryForm.controls[
                            "customerId"
                        ].updateValueAndValidity();
                        this.orderDataEntryForm.controls["customer"].setValue(
                            this.customerNr
                        );
                        this.setIncorrectValidatorControl("customer", true); //valid

                        //getRejectPayments: Blocked by Cheque
                        if (!this.idSalesOrder) {
                            this.isDataProcessing = true;
                        }
                        this.dataEntryProcess.notApprovedPaymentsMethods = null;
                        this.dataEntryService
                            .getRejectPayments(this.idPerson)
                            .finally(() => {
                                if (!this.idSalesOrder) {
                                    this.isDataProcessing = false;
                                }
                            })
                            .subscribe((response) => {
                                this.appErrorHandler.executeAction(() => {
                                    if (
                                        response &&
                                        response.data &&
                                        response.data.length &&
                                        response.data[0].length
                                    ) {
                                        this.dataEntryProcess.notApprovedPaymentsMethods =
                                            response.data[0];
                                        this.store.dispatch(
                                            this.dataEntryActions.rejectIdPayments(
                                                response.data[0],
                                                this.tabID
                                            )
                                        );
                                        this.store.dispatch(
                                            this.dataEntryActions.updateIsCancelSAV(
                                                false,
                                                this.tabID,
                                                this.ofModule
                                            )
                                        );
                                    } else {
                                        this.dataEntryProcess.notApprovedPaymentsMethods =
                                            null;
                                        this.store.dispatch(
                                            this.dataEntryActions.rejectIdPayments(
                                                [],
                                                this.tabID
                                            )
                                        );
                                    }
                                });
                            });

                        this.editOrderCheckLoading.loadedCustomer = true;
                        this.loadOrder();

                        setTimeout(() => {
                            this.customerHasCountryOfCurrentCampaign();
                            this.focusOnControl();

                            //idPerson = null && personNr != null -> person from DB Mailling
                            if (!this.idPerson && this.customerNr) {
                                if (
                                    Configuration.PublicSettings.callODEDoublet
                                ) {
                                    if (this.customerData) {
                                        this.customerData.needToCheckMatchingData =
                                            true;
                                    }

                                    //Call 'doublet check' immediately
                                    this.callDoubletCheck();
                                }
                            }
                        }, 500);

                        this.scanBarcodeGetCustomerFinish();
                    } else {
                        //not found customer
                        this.setIncorrectValidatorControl("customer", false); //error
                        this.customerResetValue();
                    }

                    if (response.communicationData) {
                        let formValue = null;
                        if (response.communicationData.length > 1)
                            formValue = response.communicationData[1];

                        this.communicationDataRaw = response.communicationData;
                        this.store.dispatch(
                            this.dataEntryActions.dataEntryCommunicationDataChanged(
                                new FormModel({
                                    formValue: formValue,
                                    rawData: response.communicationData,
                                }),
                                this.tabID
                            )
                        );
                    } else {
                        //reset
                        this.communicationDataRaw = null;
                        this.store.dispatch(
                            this.dataEntryActions.dataEntryCommunicationDataChanged(
                                new FormModel({ formValue: null, rawData: [] }),
                                this.tabID
                            )
                        );
                    }
                    if (response.orderSettingMessage) {
                        this.modalService.warningMessageHtmlContent({
                            message: [{ key: response.orderSettingMessage }],
                            closeText: "Ok",
                            text: "Customer Alert",
                        });
                    }
                });
            });
    }

    private restoreCustomerAndCommunicationData() {
        if (this.customerNr) {
            this.orderDataEntryForm.controls["customer"].setValue(
                this.customerNr
            );
            this.setIncorrectValidatorControl("customer", true);
        }

        if (this.idPerson)
            this.orderDataEntryForm.controls["customerId"].setValue(
                this.idPerson
            );

        if (this.communicationDataRaw)
            this.store.dispatch(
                this.dataEntryActions.dataEntryCommunicationDataChanged(
                    new FormModel({
                        formValue: this.communicationDataRaw[1],
                        rawData: this.communicationDataRaw,
                    }),
                    this.tabID
                )
            );

        this.focusOnControl();
    }

    private clearCustomerAndCommunicationData(dontClearStore?: boolean) {
        this.orderDataEntryForm.controls["customerId"].setValue("");
        this.customerNr = null;
        this.idPerson = null;
        this.communicationDataRaw = null;
        if (dontClearStore != true) {
            this.store.dispatch(
                this.dataEntryActions.rejectIdPayments(null, this.tabID)
            );
            this.store.dispatch(
                this.dataEntryActions.dataEntryCustomerDataChanged(
                    null,
                    this.tabID
                )
            );
            this.store.dispatch(
                this.dataEntryActions.dataEntryCommunicationDataChanged(
                    new FormModel({ formValue: null, rawData: [] }),
                    this.tabID
                )
            );
        }
    }

    public customerShowSearchDialog() {
        this.searchCustomerDialogModule.open(
            this.orderDataEntryForm.controls.customer.value
        );
    }

    public customerItemSelect(data) {
        if (!data) return;

        if (
            (this.idPerson || this.customerNr) &&
            ((this.customerData && this.customerData.isDirty) ||
                (this.communicationData && this.communicationData.isDirty))
        ) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Change Customer",
                    messageType: MessageModal.MessageType.warning,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Customer_Number_Changed_Would_You_Like_Change_Current_Customer_Communication_Data",
                        },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.warning,
                    callBack1: () => {
                        this.changeCustomerAndCommunicationData(data);
                    },
                    callBack2: () => {
                        this.restoreCustomerAndCommunicationData();
                    },
                    callBackCloseButton: () => {
                        this.restoreCustomerAndCommunicationData();
                    },
                })
            );
        } else {
            // PersonNr, IdPerson
            const idPerson = Uti.getValueFromArrayByKey(data, "idPerson");
            const customerNr = Uti.getValueFromArrayByKey(data, "personNr");
            this.orderDataEntryForm.controls["customer"].setValue(customerNr);
            this.orderDataEntryForm.controls["customerId"].setValue(idPerson);
            this.orderDataEntryForm.updateValueAndValidity();

            this.getCustomerData(customerNr);

            this.setOutputData(
                null,
                new FormOutputModel({
                    isValid: this.orderDataEntryForm.valid,
                    isDirty: true,
                    formValue: this.orderDataEntryForm.value,
                    submitResult: null,
                })
            );
        }
    }

    public customerCloseSearchDialog($event) {
        //if has customerNr before -> set value
        if (this.customerNr)
            this.orderDataEntryForm.controls["customer"].setValue(
                this.customerNr
            );
    }

    private isShowingAlertCustomerHasCountry: boolean = false;
    private customerHasCountryOfCurrentCampaign(caseChecking?: number) {
        /*
        When Customer has country does not exist in country list of a campaign.
        The ODE should be show an alert with message "The country does not support on this Campaign, Please skip this order"
        With a Skip button to skip this order
        */
        //this.countryListByCampaign
        if (
            this.customerData &&
            this.customerData.formValue &&
            this.customerData.formValue.idRepIsoCountryCode &&
            this.countryListByCampaign &&
            this.countryListByCampaign.length &&
            this.orderDataEntryForm.controls["campaignNumber"].value
        ) {
            //[{"IsoCode":"FR"},{"IsoCode":"DE"},{"IsoCode":"GB"},{"IsoCode":"AU"},{"IsoCode":"US"}]
            const findItem = this.countryListByCampaign.find(
                (item) =>
                    item.IdRepIsoCountryCode ==
                    this.customerData.formValue.idRepIsoCountryCode
            );

            if (findItem != null) {
                this.isShowingAlertCustomerHasCountry = false;
                return true;
            }

            if (this.isShowingAlertCustomerHasCountry) return;
            //1: show Dialog, 2: ShowToaster, 3: only checking
            if (caseChecking === 1) {
                this.isShowingAlertCustomerHasCountry = true;
                this.modalService.alertMessage(
                    new MessageModel({
                        headerText: "Unsupported Order",
                        messageType: MessageModal.MessageType.error,
                        modalSize: MessageModal.ModalSize.small,
                        message: [
                            {
                                key: "Modal_Message__The_Country_Not_Support_Campaign",
                            },
                        ],
                        okText: "OK",
                        callBack: () => {
                            this.isShowingAlertCustomerHasCountry = false;
                        },
                    }),
                    false,
                    true
                );
            } else if (caseChecking === 2) {
                this.toasterService.pop(
                    "error",
                    "Unsupported Order",
                    "The country does not support on this Campaign"
                );
            }
        }
        return false;
    }

    private callDoubletCheck(forceSaveODE?: boolean) {
        this.store.dispatch(
            this.dataEntryActions.callDoubletCheck(
                { isCheck: true, forceSaveODE: forceSaveODE },
                this.tabID
            )
        );
    }

    private isCallDoubletCheckBeforeSavingODE() {
        return (
            !this.idPerson ||
            (this.customerData &&
                this.customerData.isDirty &&
                this.customerData.needToCheckMatchingData)
        );
    }
    //#endregion

    //#region Barcode
    private scanBarcodeProcess: any = {
        preventFocus: false,
        saveEnabled: false,
        needToSaveAutomatically: false,
        isGetCustomerFinish: false,
        isGetMediaCodeFinish: false,
    };

    private scanBarcodeClearData() {
        this.scanBarcodeProcessReset();
        this.scanBarcodeClearInterval();
    }

    private scanBarcodeProcessReset() {
        this.scanBarcodeProcess.needToSaveAutomatically = false;
        this.scanBarcodeProcess.isGetCustomerFinish = false;
        this.scanBarcodeProcess.isGetMediaCodeFinish = false;

        clearTimeout(this.scanBarcodeSaveAutomaticallyTimeout);
        this.scanBarcodeSaveAutomaticallyTimeout = null;
    }

    public onKeyPressBarcode(event) {
        // only execute business if it is enter key
        if (event.keyCode == 13) {
            const value = this.orderDataEntryForm.controls["barcode"].value;
            if (value && (value as string).indexOf(";") > 0) {
                const splits = (value as string).split(";");
                if (splits.length === 3) {
                    const customer = splits[1];
                    const mediacode = splits[2];
                    this.orderDataEntryForm.controls["customer"].setValue(
                        customer
                    );
                    this.orderDataEntryForm.controls["mediacode"].setValue(
                        mediacode
                    );
                    this.orderDataEntryForm.updateValueAndValidity();

                    if (mediacode && customer) {
                        if (this.isGamerTab) {
                            this.scanBarcodePreventFocus();
                            this.scanBarcodeProcess.needToSaveAutomatically =
                                true;
                            this.scanBarcodeProcess.isGetCustomerFinish = false;
                            this.scanBarcodeProcess.isGetMediaCodeFinish =
                                false;
                        }

                        this.getCustomerData(customer);
                        this.getDataByMediaCode(mediacode);

                        if (this.isGamerTab)
                            this.scanBarcodeSaveAutomatically();
                    }
                }
            }
            if (event.preventDefault) event.preventDefault();
            if (event.stopPropagation) event.stopPropagation();
        }
    }

    public updateBarcodeStatus(status) {
        this.orderDataEntryForm.controls["isDisplayBarCode"].setValue(!status);
        this.orderDataEntryForm.updateValueAndValidity();
        this._changeDetectorRef.detectChanges();
    }

    public displayBarCodeChanged($event) {
        this.initFocusControl(true);

        if (this.orderDataEntryForm.controls["isDisplayBarCode"].value) {
            setTimeout(() => {
                this.barcodeCtrl.nativeElement.focus();
            }, 300);
        }

        this.storeFormControlValue();
    }

    private scanBarcodeSaveAutomaticallyTimeout: any;
    private scanBarcodeSaveAutomatically() {
        if (!this.scanBarcodeProcess.needToSaveAutomatically) return;

        //console.log('scanBarcode-SaveAutomatically : ' + new Date());
        clearTimeout(this.scanBarcodeSaveAutomaticallyTimeout);
        this.scanBarcodeSaveAutomaticallyTimeout = null;
        this.scanBarcodeSaveAutomaticallyTimeout = setTimeout(() => {
            if (!this.scanBarcodeProcess.needToSaveAutomatically) return;

            if (
                !this.scanBarcodeProcess.isGetCustomerFinish ||
                !this.scanBarcodeProcess.isGetMediaCodeFinish
            ) {
                //call itself to waiting GetCustomer and GetMediaCode
                this.scanBarcodeSaveAutomatically();
                return;
            }

            this.scanBarcodeProcessReset();

            const isValid = this.checkValidStatusForSaving();
            if (isValid) {
                //console.log('scanBarcode-Request Save without timeout : ' + new Date());
                this.scanBarcodeRequestSave();
            } else {
                setTimeout(() => {
                    //console.log('scanBarcode-Request Save with timeout : ' + new Date());
                    this.scanBarcodeRequestSave();
                }, 200);
            }
        }, 100);
    }

    private scanBarcodeRequestSave() {
        this.scanBarcodeProcess.saveEnabled = true;
        this.store.dispatch(
            this.tabButtonActions.requestSaveOnlyWithoutControllingTab(
                this.ofModule
            )
        );
    }

    private scanBarcodeGetCustomerFinish() {
        this.scanBarcodeProcess.isGetCustomerFinish = true;
    }

    private scanBarcodeGetMediaCodeFinish() {
        this.scanBarcodeProcess.isGetMediaCodeFinish = true;
    }

    private scanBarcodePreventFocusInterval: any;
    private scanBarcodePreventFocus() {
        this.scanBarcodeProcess.preventFocus = true;

        this.scanBarcodeClearInterval();
        this.scanBarcodePreventFocusInterval = setInterval(() => {
            if (!this.scanBarcodeProcess.preventFocus) {
                this.scanBarcodeClearInterval();
                return;
            }
            //console.log('focus', $(':focus').length);
            $(":focus").blur();
        });
    }

    private scanBarcodeClearInterval() {
        clearInterval(this.scanBarcodePreventFocusInterval);
        this.scanBarcodePreventFocusInterval = null;
    }
    //#endregion

    //#region Shipper/ PackageNr
    public shipperGotFocus() {
        if (!this.shipperCtrl) return;

        if (!this.shipperCtrl.selectedValue) {
            this.shipperCtrl.isDroppedDown = true;
            this.shipperCtrl.onIsDroppedDownChanged();
        }
    }

    public shipperSelectedIndexChanged() {
        if (!this.shipperCtrl) return;

        const ctrlPackageNr = this.orderDataEntryForm.controls["packageNr"];
        if (this.shipperCtrl.selectedValue) {
            if (
                !this.shipperCtrl.isDroppedDown &&
                this.orderDataEntryForm.controls["idRepSalesOrderShipper"]
                    .value &&
                !this._isPreventSaveOrderTypeFromProperties
            ) {
                this.storeFormControlValue();
            }
            if (ctrlPackageNr) {
                // ctrlPackageNr.setValidators([Validators.required]);
                ctrlPackageNr.updateValueAndValidity();
            }
        } else {
            if (ctrlPackageNr) {
                // ctrlPackageNr.clearValidators();
                ctrlPackageNr.updateValueAndValidity();
                ctrlPackageNr.setValue("");
            }
        }
    }
    //#endregion

    //#region Translate
    private getCurrentTranslateText() {
        return this.localizer;
    }

    public rebuildTranslateText() {}
    //#endregion

    //#region Focus
    private initFocusControl(noFocusFirstControl?: boolean) {
        if (!this.controlFocus) return;

        this.controlFocus.initControl(noFocusFirstControl);
    }

    private getRealElementToFocus($item) {
        const tagName: string = $item[0].tagName;
        switch (tagName) {
            case "XN-DATE-PICKER":
            case "WJ-COMBO-BOX":
                return $item.find("input");
        }
        return $item;
    }

    private getFirstInvalidElement(componentTagName) {
        componentTagName = componentTagName || "";
        const tabId = "order-data-entry-tab #" + this.tabID + " ";
        const invalidSelector = tabId + componentTagName + " form .ng-invalid";
        const $invalidInputs = $(invalidSelector).not("div,span,a,p");

        if ($invalidInputs.length) {
            this.scanBarcodeProcess.preventFocus = false;
            return $invalidInputs.first();
        }

        return $invalidInputs;
    }

    private focusOnElement($element) {
        if (!$element.length) return;

        if (!$element.is(":visible"))
            this.controlFocus.selectChildAndParentTab(
                $element.closest(".tab-pane")
            );
        else this.getRealElementToFocus($element).focus();
    }

    private focusWhenValidation() {
        setTimeout(() => {
            //get first invalid element of the current tab ODE
            let $element = this.getFirstInvalidElement("");
            this.focusOnElement($element);
        }, 300);
    }

    private timeoutFocusOnControl: any;
    private focusOnControl() {
        clearTimeout(this.timeoutFocusOnControl);
        this.timeoutFocusOnControl = null;

        this.timeoutFocusOnControl = setTimeout(() => {
            if (
                !this.orderDataEntryForm ||
                !this.orderDataEntryForm.controls ||
                !this.mediacodeCtrl ||
                this.mediaCodeShowDialog ||
                !this.barcodeCtrl ||
                this.scanBarcodeProcess.saveEnabled
            )
                return;

            const hasCustomer = this.idPerson || this.customerNr;

            let elementToFocus: any;
            if (
                this.orderDataEntryForm.controls["isDisplayBarCode"].value &&
                !this.orderDataEntryForm.controls["barcode"].value &&
                !hasCustomer &&
                !this.orderDataEntryForm.controls["mediacode"].value &&
                !this.orderDataEntryForm.controls["campaignNumber"].value &&
                !this.orderDataEntryForm.controls["orderType"].value &&
                !this.orderDataEntryForm.controls["orderBy"].value
            ) {
                setTimeout(() => {
                    this.barcodeCtrl.nativeElement.focus();
                }, 500);
                return;
            } else if (!this.orderDataEntryForm.controls["mediacode"].value)
                elementToFocus = this.mediacodeCtrl.nativeElement;
            else if (!this.orderDataEntryForm.controls["campaignNumber"].value)
                elementToFocus = this.campaignNumberCtrl.nativeElement;
            else if (!this.orderDataEntryForm.controls["orderType"].value)
                elementToFocus = this.orderTypeCtrl;
            else if (!this.orderDataEntryForm.controls["orderBy"].value)
                elementToFocus = this.orderByCtrl;
            else if (!this.orderDataEntryForm.controls["customer"].value)
                elementToFocus = this.customerCtrl.nativeElement;
            else if (
                !this.orderDataEntryForm.controls["idRepSalesOrderShipper"]
                    .value
            )
                elementToFocus = this.shipperCtrl;
            else if (!this.orderDataEntryForm.controls["packageNr"].value)
                elementToFocus = this.packageNrCtrl.nativeElement;

            if (elementToFocus) {
                elementToFocus.focus();
            } else if (hasCustomer) {
                //get Last control Customer
                const tabId = "order-data-entry-tab #" + this.tabID + " ";
                const selector =
                    tabId +
                    "app-customer-data-entry-form form input, " +
                    tabId +
                    "app-customer-data-entry-form form select";
                let $element = $(selector).last();

                this.focusOnElement($element);
            }
        }, 500);
    }

    private focusOnControlOfWigdetInSimpleTab() {
        clearTimeout(this.timeoutFocusOnControl);
        this.timeoutFocusOnControl = null;

        this.timeoutFocusOnControl = setTimeout(() => {
            if (
                !this.mediacodeCtrl ||
                this.mediaCodeShowDialog ||
                this.scanBarcodeProcess.saveEnabled
            )
                return;

            if (this.pressSkipButton) {
                this.pressSkipButton = false;
                return;
            }

            const tabId =
                "order-data-entry-tab #" +
                this.tabID +
                " .simple-tab-content-container .tab-pane.active ";
            let $element: any;
            const invalidSelector =
                tabId +
                "app-customer-data-entry-form form .ng-invalid, " +
                tabId +
                "data-entry-order-payment-type form .ng-invalid";
            let $invalidInputs = $(invalidSelector).not("div,span,a,p");

            if ($invalidInputs.length) {
                this.scanBarcodeProcess.preventFocus = false;
                $element = this.getRealElementToFocus($invalidInputs.first());
            } else {
                const selector =
                    tabId +
                    "app-customer-data-entry-form form input:visible, " +
                    tabId +
                    "app-customer-data-entry-form form select:visible, " +
                    tabId +
                    "data-entry-order-payment-type form input:visible, " +
                    tabId +
                    "data-entry-order-payment-type form select:visible";
                let $inputs = $(selector);

                if (!$inputs.length) return;

                $element =
                    this.idPerson || this.customerNr
                        ? $inputs.last()
                        : $inputs.first();
            }

            if ($element && $element.length) {
                $element.get(0).focus();
            }
        }, 200);
    }

    private focusOnBarcode(timeout?: number) {
        if (
            this.orderDataEntryForm.controls["isDisplayBarCode"].value &&
            !this.orderDataEntryForm.controls["barcode"].value
        )
            setTimeout(() => {
                this.barcodeCtrl.nativeElement.focus();
            }, timeout || 300);
        else this.focusOnControl();
    }
    //#endregion

    //#region Order Failed
    private isSaveOrderFailedProcessing = false;
    private orderFailedData: any = this.createOrderFailedData();
    private orderFailedDataCheckSaving: any =
        this.createOrderFailedDataCheckSaving();

    private idFileOrderFailed: any;
    private reGetOrderFailedTimeout = null;
    private autoSyncOrderFailedTimeout = null;

    private createOrderFailedDataCheckSaving() {
        return {
            hasCustomerData: null,
            hasPaymentType: null,
            hasArticleGrid: null,
            hasCommunicationData: null,
        };
    }

    private createOrderFailedData() {
        return {
            scanningData: null,
            order: null,
            customerData: null,
            totalSummaryData: null,
            paymentType: null,
            articleGridExportData: null,
            articleGridCampaignData: null, //Articles used in this campaign
            communicationData: null,

            //Extra info
            mainCurrency: null,
            mainPaymenTypeList: null,
        };
    }

    private clearOrderFailed(dontClearStore?: boolean) {
        if (!Configuration.PublicSettings.enableOrderFailed) return;

        this.isSaveOrderFailedProcessing = false;
        this.idFileOrderFailed = null;

        clearTimeout(this.reGetOrderFailedTimeout);
        this.reGetOrderFailedTimeout = null;
        clearTimeout(this.autoSyncOrderFailedTimeout);
        this.autoSyncOrderFailedTimeout = null;

        this.orderFailedData = this.createOrderFailedData();
        this.orderFailedDataCheckSaving =
            this.createOrderFailedDataCheckSaving();
        //clear store
        if (dontClearStore != true) {
            this.store.dispatch(
                this.dataEntryActions.cachedFailedData(null, this.tabID)
            );
        }
    }

    private subscribeOrderFailed() {
        if (!Configuration.PublicSettings.enableOrderFailed) return;

        this.orderFailedReceiveDataSubcription =
            this.orderFailedReceiveDataState.subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        this.dataEntryProcess.selectedODETab.TabID != this.tabID
                    )
                        return;

                    if (response && response.data) {
                        switch (response.key) {
                            case OrderFailedDataEnum.CustomerData:
                                this.orderFailedData.customerData =
                                    response.data;
                                this.orderFailedDataCheckSaving.hasCustomerData =
                                    true;
                                break;
                            case OrderFailedDataEnum.PaymentType:
                                this.orderFailedData.paymentType =
                                    response.data;
                                this.orderFailedDataCheckSaving.hasPaymentType =
                                    true;
                                break;
                            case OrderFailedDataEnum.ArticleGrid:
                                if (response.data) {
                                    this.orderFailedData.articleGridExportData =
                                        response.data.articleGridExportData;
                                    this.orderFailedData.articleGridCampaignData =
                                        response.data.articleGridCampaignData;
                                    this.orderFailedDataCheckSaving.hasArticleGrid =
                                        true;
                                }
                                break;
                            case OrderFailedDataEnum.CommunicationData:
                                this.orderFailedData.communicationData =
                                    response.data;
                                this.orderFailedDataCheckSaving.hasCommunicationData =
                                    true;
                                break;
                        }

                        //check if there is full data -> will save local storage and save file
                        if (
                            this.orderFailedDataCheckSaving.hasCustomerData &&
                            this.orderFailedDataCheckSaving.hasPaymentType &&
                            this.orderFailedDataCheckSaving.hasArticleGrid &&
                            this.orderFailedDataCheckSaving.hasCommunicationData
                        ) {
                            this.saveOrderFailed();
                        }
                    }
                });
            });
    }

    private processForOrderFailed() {
        if (!Configuration.PublicSettings.enableOrderFailed) return;

        this.isDataProcessing = true;
        //1. dispatch to widgdet to notify getting data
        //2. subscribe to revceiving data from widget
        //3. Check received enough data: save local storage, save file

        this.orderFailedDataCheckSaving =
            this.createOrderFailedDataCheckSaving();
        this.orderFailedData.order = this.orderDataEntryForm.value;
        this.orderFailedData.totalSummaryData = this.orderTotalSummaryData;
        this.store.dispatch(
            this.dataEntryActions.orderFailedRequestData(
                { isNotify: true },
                this.tabID
            )
        );
    }

    private saveOrderFailed() {
        if (this.isSaveOrderFailedProcessing) return;

        //set dateOfBirth for customerData
        if (
            this.orderFailedData.customerData.dateOfBirth &&
            this.customerData.mappedData &&
            this.customerData.mappedData.PersonMasterData
        )
            this.orderFailedData.customerData.dateOfBirth.value = format(
                new Date(
                    this.customerData.mappedData.PersonMasterData.DateOfBirth
                ),
                "dd.MM.yyyy"
            );

        this.isSaveOrderFailedProcessing = true;
        let data = {
            TabID: this.tabID,
            CreateDate: format(new Date(), "dd.MM.yyyy"),
            JsonData: JSON.stringify(this.orderFailedData),
            IdScansContainerItems: "",
            Mediacode: this.orderFailedData.order.mediacode,
            CampaignNr: this.orderFailedData.order.campaignNumber,
            CustomerNr: this.orderFailedData.order.customer,
        };

        if (this.currentScanningStatus) {
            data.IdScansContainerItems =
                this.currentScanningStatus.idScansContainerItems;
        } else {
            const fileName =
                data.Mediacode + "_" + data.CampaignNr + "_" + data.CustomerNr;
            //Clean FileName: remove Invalid FileName Chars
            data.IdScansContainerItems = fileName
                .replace(/[^a-z0-9-_]/gi, "-")
                .replace(/-{2,}/gi, "-");
        }

        this.idFileOrderFailed = data.IdScansContainerItems;

        this.dataEntryService
            .saveOrderFailed(data)
            .finally(() => {
                this.isDataProcessing = false;
                this.isSaveOrderFailedProcessing = false;
                this.autoSyncOrderFailed();
            })
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (response) {
                            this.store.dispatch(
                                this.parkedItemActions.requestReloadList(
                                    this.ofModule
                                )
                            );
                            //clear data
                            this.orderFailedData = this.createOrderFailedData();
                        }
                    });
                },
                (err) => {}
            );
    }

    private deleteOrderFailed() {
        if (
            !this.dataEntryProcess.isProcessForOrderFailed ||
            !this.idFileOrderFailed
        )
            return;

        this.dataEntryService
            .deleteOrderFailed(this.tabID, this.idFileOrderFailed)
            .finally(() => {
                this.isDataProcessing = false;
                this.dataEntryProcess.isProcessForOrderFailed = false;
                this.idFileOrderFailed = null;
            })
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        //reload parked item panel
                        if (response) {
                            this.store.dispatch(
                                this.parkedItemActions.requestReloadList(
                                    this.ofModule
                                )
                            );
                        }
                    });
                },
                (err) => {}
            );
    }

    private reGetOrderFailed(idScansContainerItems) {
        if (this.dataEntryProcess.selectedODETab.TabID != this.tabID) return;

        this.idFileOrderFailed = idScansContainerItems;

        clearTimeout(this.reGetOrderFailedTimeout);
        this.reGetOrderFailedTimeout = null;
        this.reGetOrderFailedTimeout = setTimeout(() => {
            this.isDataProcessing = true;
            this.dataEntryService
                .getOrderFailed(this.tabID, idScansContainerItems)
                .finally(() => {
                    this.isDataProcessing = false;
                })
                .subscribe((response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response) return;

                        this.clearDataToLoadEditOrder();
                        setTimeout(() => {
                            this.dataEntryProcess.isProcessForOrderFailed =
                                true;
                            const rawData = JSON.parse(response);
                            this.orderFailedData = JSON.parse(rawData.JsonData);

                            this.restorePreviousFormValue();

                            this.store.dispatch(
                                this.dataEntryActions.cachedFailedData(
                                    this.orderFailedData,
                                    this.tabID
                                )
                            );
                        }, 500);
                    });
                });
        }, 300);
    }

    private restorePreviousFormValue(order?: any, dontLoadFirstTab?: boolean) {
        order = order || this.orderFailedData.order;
        if (!this.orderDataEntryForm || !order) return;

        //convert date json string to date
        if (order.orderDate)
            order.orderDate = Uti.parseISODateToDate(order.orderDate);

        Uti.setValueForForm(this.orderDataEntryForm, order);

        this.idPerson = order.customerId;
        this.customerNr = order.customer;

        this.orderDataEntryForm.markAsPristine();
        this.orderDataEntryForm.markAsUntouched();

        if (!dontLoadFirstTab) {
            //set = true to prevent focus on first control of tab Customer
            this.pressSkipButton = true;
            //dispatch to active tab Customer
            this.store.dispatch(
                this.tabSummaryActions.requestSelectSimpleTab(0, this.ofModule)
            );
        }
    }

    private syncOrderFailed() {
        if (
            !Configuration.PublicSettings.enableOrderFailed ||
            this.dataEntryProcess.selectedODETab.TabID != this.tabID ||
            !this.dataEntryService.hasOrderFailedInLocalStorage()
        )
            return;

        this.dataEntryService
            .syncOrderFailedFromLocalStorageToFiles()
            .finally(() => {})
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    this.store.dispatch(
                        this.parkedItemActions.requestReloadList(this.ofModule)
                    );
                });
            });
    }

    private autoSyncOrderFailed() {
        if (
            !Configuration.PublicSettings.enableOrderFailed ||
            this.dataEntryProcess.selectedODETab.TabID != this.tabID ||
            !this.dataEntryService.hasOrderFailedInLocalStorage()
        )
            return;

        clearTimeout(this.autoSyncOrderFailedTimeout);
        this.autoSyncOrderFailedTimeout = null;
        this.autoSyncOrderFailedTimeout = setTimeout(() => {
            this.dataEntryService
                .syncOrderFailedFromLocalStorageToFiles()
                .finally(() => {
                    if (this.dataEntryService.hasOrderFailedInLocalStorage()) {
                        this.autoSyncOrderFailed();
                    } else {
                        this.dataEntryProcess.isProcessForOrderFailed = true;
                    }
                })
                .subscribe((response) => {
                    this.appErrorHandler.executeAction(() => {
                        this.store.dispatch(
                            this.parkedItemActions.requestReloadList(
                                this.ofModule
                            )
                        );
                    });
                });
        }, 3000);
    }
    //#endregion

    //#region WidgetProperties
    private orderTypeValueFromWidgetProperty: any;
    private execWidgetProperties(data: WidgetPropertyModel[]) {
        if (!data) return;

        this._properties = data;
        const orderType: WidgetPropertyModel =
            this.propertyPanelService.getItemRecursive(
                this._properties,
                "OrderType"
            );
        if (!orderType) return;

        this.orderTypeValueFromWidgetProperty = orderType.value;
        if (!this.orderDataEntryForm) return;

        // this flag will prevent the automactically saving property when the Order Type dropdownlist changes item.
        this._isPreventSaveOrderTypeFromProperties = true;
        setTimeout(() => {
            // auto set default value after 1.2s
            this._isPreventSaveOrderTypeFromProperties = false;
        }, 1200);

        this.orderDataEntryForm.controls["orderType"].setValue(
            this.orderTypeValueFromWidgetProperty
        );
    }

    private callUpdateOrderTypeProperty(orderType: any) {
        if (
            !orderType ||
            this._isPreventSaveOrderTypeFromProperties ||
            this.orderTypeValueFromWidgetProperty == orderType
        )
            return;

        let orderTypeItem: WidgetPropertyModel =
            this.propertyPanelService.getItemRecursive(
                this._properties,
                "OrderType"
            );
        if (
            orderTypeItem &&
            orderTypeItem.value &&
            orderTypeItem.value != orderType
        ) {
            orderTypeItem.value = orderType;
            this.callSavePropertiesAction.emit();
            Uti.dontShowSuccessMessage = true;
        }
    }
    //#endregion

    //#region Edit Order
    private idSalesOrder: any;
    private editOrderCheckLoading: any = this.createEditOrderCheckLoading();

    private createEditOrderCheckLoading() {
        return {
            loadedMediaCode: null,
            loadedCustomer: null,
        };
    }

    private clearEditOrder(dontClearStore?: boolean) {
        this.idSalesOrder = null;
        this.editOrderCheckLoading = this.createEditOrderCheckLoading();
        //clear store
        if (dontClearStore != true) {
            this.store.dispatch(
                this.dataEntryActions.editOrder(null, this.tabID)
            );
        }
    }

    private loadOrder() {
        if (
            !this.idSalesOrder ||
            !this.editOrderCheckLoading.loadedMediaCode ||
            !this.editOrderCheckLoading.loadedCustomer
        )
            return;

        this.dataEntryProcess.isProcessingLoadEditOrder = true;
        this.dataEntryService
            .getSalesOrderById(this.idSalesOrder)
            .finally(() => {
                this.dataEntryProcess.loadOrderFinished(() => {
                    setTimeout(() => {
                        this.isDataProcessing = false;
                        this.idSalesOrder = null;
                        this.editOrderCheckLoading =
                            this.createEditOrderCheckLoading();
                    }, 500);
                });
            })
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    console.log("getOrder: " + this.idSalesOrder, response);
                    if (response && response.data && response.data.length > 2) {
                        this.orderDataEntryForm.controls[
                            "idSalesOrder"
                        ].setValue(this.idSalesOrder);
                        const editOrderData =
                            this.dataEntryProcess.buildEditOrderModel(
                                response.data,
                                this.mainCurrency,
                                this.orderFailedData.mainPaymenTypeList
                            );
                        this.restorePreviousFormValue(
                            editOrderData.order,
                            true
                        );
                        this.store.dispatch(
                            this.dataEntryActions.editOrder(
                                editOrderData,
                                this.tabID
                            )
                        );
                    }
                });
            });
    }

    private clearDataToLoadEditOrder() {
        this.idSalesOrder = null;
        this.editOrderCheckLoading = this.createEditOrderCheckLoading();

        this.setIncorrectValidatorControl("mediacode", true); //valid
        this.setIncorrectValidatorControl("customer", true); //valid

        this.previousValues = {
            mediaCode: "",
            campaignNumber: "",
        };
        this.validMediaCodeCampaignNrList.length = 0;
        this.countryListByCampaign.length = 0;
        this.mediaCode = "";
        this.campaignNr = "";
        this.inputMediaCodeFirst = false;
        this.inputCampaignNumberFirst = false;
        this.inputMediaCodeFromDialog = false;
        this.customerNr = null;
        this.idPerson = null;
        this.communicationDataRaw = null;
        this.currentScanningStatus = null;
        this.articleGridExportData = null;
        this.customerData = null;
        this.orderTotalSummaryData = null;
        this.paymentTypeData = null;
        //set = true to prevent focus on first control of tab Customer
        this.pressSkipButton = true;
        //dispatch to active tab Customer
        this.store.dispatch(
            this.tabSummaryActions.requestSelectSimpleTab(0, this.ofModule)
        );
    }

    private waitToLoadOrder(data: any, count?: number) {
        count = count || 1;
        if (count > 60) return; //retry 60 times, each time 500ms -> 30s

        //if component still haven't loaded, wait 1s
        if (this.getErrorMessageWithRequiredWigdets()) {
            //console.log('EditOrder: wait 0.5s for loading paymentItemComponent');
            setTimeout(() => {
                this.waitToLoadOrder(data, ++count);
            }, 500);
        } else {
            this.clearDataToLoadEditOrder();
            setTimeout(() => {
                //keep idSalesOrder to wait for MediaCode and Customer loaded -> load order
                this.idSalesOrder = data.idSalesOrder;

                this.orderDataEntryForm.controls["mediacode"].setValue(
                    data.mediacode
                );
                this.orderDataEntryForm.controls["customer"].setValue(
                    data.customerNr
                );
                this.orderDataEntryForm.controls["campaignNumber"].setValue(
                    data.campaignNr
                );
                this.getDataByMediaCode(data.mediacode);
                this.getCustomerData(data.customerNr);

                this.store.dispatch(
                    this.dataEntryActions.clearRequestChangeTabThenLoadData(
                        this.tabID
                    )
                );
            });
        }
    }
    //#endregion

    //#region Call SignalR to save SAV
    private saveSAVFile(idSalesOrder: string, idGenerateLetter: string) {
        if (!idSalesOrder || !idGenerateLetter) return;

        const model = this.signalRService.createMessageRCWord2Pdf();
        model.Action = SignalRActionEnum.RCWord2Pdf_ProcessForODE;
        model.Data = [
            {
                IdSalesOrder: idSalesOrder,
                IdGenerateLetter: idGenerateLetter,
                IsProcessForODE: true,
            },
        ];
        this.signalRService.sendMessage(model);
    }
    //#endregion
}
