import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    ChangeDetectorRef,
    Injector,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import { Validators } from "@angular/forms";
import {
    DropdownListModel,
    ControlGridModel,
    ApiResultResponse,
    MessageModel,
    FormOutputModel,
} from "app/models";
import { MessageModal } from "app/app.constants";
import { Uti } from "app/utilities";
import * as wjInput from "wijmo/wijmo.angular2.input";
import {
    PropertyPanelService,
    WareHouseMovementService,
    DatatableService,
    CommonService,
    ModalService,
    BackOfficeService,
} from "app/services";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { RowData } from "app/state-management/store/reducer/widget-content-detail";
import {
    ProcessDataActions,
    TabButtonActions,
    CustomAction,
    WarehouseMovementActions,
} from "app/state-management/store/actions";
import { Subscription } from "rxjs/Subscription";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import cloneDeep from "lodash-es/cloneDeep";
import * as widgetContentDetailReducer from "app/state-management/store/reducer/widget-content-detail";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { FormBase } from "app/shared/components/form/form-base";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import { ControlFocusComponent } from "app/shared/components/form";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";

@Component({
    selector: "sorting-goods-edit-form",
    styleUrls: ["./sorting-goods-edit-form.component.scss"],
    templateUrl: "./sorting-goods-edit-form.component.html",
})
export class SortingGoodsEditFormComponent
    extends FormBase
    implements OnInit, OnDestroy, AfterViewInit
{
    private comServiceSubscription: Subscription;
    private getSortingGoodSubscription: Subscription;
    private getStockedArticlesSubscription: Subscription;
    private warehouseMovementDataState: Observable<RowData[]>;
    private warehouseMovementRequestConfirmAllStateSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private _isDirty = false;

    public _globalProperties: any[];

    private idWarehouseMovement: any;
    private currentArrivedArticle: any = {};
    private currentRightGridData: any = [];
    // private cachedGridData: any = [];
    // private deleteCachedGridData: any = [];
    private gridSectionHeight: any = { height: `calc(100% - 65px)` };
    private formGroupValueChangeSubscription: Subscription;
    private currentRowIndex: number = 0;

    @ViewChild("closingReasonDropDownList")
    closingReasonDropDownList: AngularMultiSelect;
    @ViewChild("arrivedArticleGridComponent")
    arrivedArticleGridComponent: XnAgGridComponent;
    @ViewChild("stockedArticleGridComponent")
    stockedArticleGridComponent: XnAgGridComponent;
    @ViewChild("focusControl") controlFocusComponent: ControlFocusComponent;
    @ViewChild("focusQuantity") quantityField: ElementRef;
    // public disableForm = true;
    public disabledFormStokedArticle = true;
    // public articleNumber = '';
    public newArticleNumber = "";
    public globalDateFormat = "";
    public globalNumberFormat = "";
    public dontShowCalendarWhenFocus: boolean = true;
    public isRenderForm: boolean;
    public closingReasonData: Array<DropdownListModel> = [];
    public arrivedArticleGrid: ControlGridModel = new ControlGridModel();
    public stockedArticleGrid: ControlGridModel = new ControlGridModel();

    @Input() set globalProperties(globalProperties: any[]) {
        this._globalProperties = globalProperties;
        this.globalDateFormat =
            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
            );
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
            );
        // this.dontShowCalendarWhenFocus = this.propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
    }

    get globalProperties() {
        return this._globalProperties;
    }

    constructor(
        private propertyPanelService: PropertyPanelService,
        private store: Store<AppState>,
        private wareHouseMovementService: WareHouseMovementService,
        private wareHouseMovementActions: WarehouseMovementActions,
        private datatableService: DatatableService,
        private commonService: CommonService,
        private modalService: ModalService,
        private processDataActions: ProcessDataActions,
        private tabButtonActions: TabButtonActions,
        private dispatcher: ReducerManagerDispatcher,
        private backOfficeService: BackOfficeService,
        private toasterService: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        protected router: Router,
        protected injector: Injector
    ) {
        super(injector, router);

        this.warehouseMovementDataState = this.store.select(
            (state) =>
                widgetContentDetailReducer.getWidgetContentDetailState(
                    state,
                    this.ofModule.moduleNameTrim
                ).rowsData
        );

        this.formEditModeState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditMode
        );
        this.formEditDataState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditData
        );
    }

    public ngOnInit() {
        this.subscribeFormEditModeState();
        this.subscribeWarehouseMovementRequestConfirmAllState();
        this.subscribeWarehouseMovementSaveAndConfirmState();
        this.initEmptyForm();
        this.initData();
        this.setFormOutputData(null);
    }

    public ngAfterViewInit() {
        this.afterViewInit();
        this.getDataForGrid();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public arrivedArticleGridRowClick($event: any) {
        this.currentArrivedArticle = $event;
        const articleNumber = Uti.getValueFromArrayByKey(
            this.currentArrivedArticle,
            "ArticleNr"
        );
        const newArticleNumber = Uti.getValueFromArrayByKey(
            this.currentArrivedArticle,
            "New ArticleNr"
        );
        this.newArticleNumber = newArticleNumber
            ? newArticleNumber
            : articleNumber;
        this.checkingFormEnable();
        this.initFocusControl();
    }

    public addStokedArticleItemClick() {
        this.formGroup["submitted"] = true;
        this.formGroup.updateValueAndValidity();
        if (!this.formGroup.valid) {
            return;
        }
        const formValue = this.formGroup.value;

        // if (!this.formGroup.valid) {
        //     this.modalService.warningMessage({
        //         message: 'Please input the Quantity'
        //     });
        //     return;
        // }
        if (!this.isAllowQuantity(formValue.quantity)) {
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__Quantity_Received_Is_Greater_Than_Quantity_In_Order",
                },
            ]);
            return;
        }
        if (!formValue.quantity) {
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__Quantity_Must_Greater_Than_Zero",
                },
            ]);
            return;
        }
        this.insertItemToGrid(formValue);
        this._isDirty = true;
        Uti.resetValueForForm(this.formGroup);
        this.setFormOutputData(null);
    }

    public onDeleteColumnClickHandler(eventData) {
        if (eventData) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    messageType: MessageModal.MessageType.error,
                    headerText: "Delete Order",
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Do_You_Want_To_Delete_This_Order",
                        },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        this.stockedArticleGridComponent.deleteRowByRowId(
                            eventData.DT_RowId
                        );
                        // this.addCachedDeleteData(eventData);
                        const data = cloneDeep(this.stockedArticleGrid.data);
                        Uti.removeItemInArray(
                            data,
                            eventData,
                            "IdWarehouseMovementGoodsReceiptPosted"
                        );
                        this._isDirty = true;
                        this.stockedArticleGrid = {
                            columns: this.stockedArticleGrid.columns,
                            data: data,
                        };
                        // this.updateCached();
                        // this.updateArrivedArticleGrid(eventData);
                        this.checkingFormEnable();
                        this.setFormOutputData(null);
                    },
                })
            );
        }
    }

    public isDirty() {
        let saveData = this.prepareSubmitData();
        return !!(this._isDirty && saveData && saveData.length);
    }

    public isValid() {
        return this.isDirty();
    }

    public submit() {
        if (!this.isDirty()) {
            this.setFormOutputData(false, null);
            return;
        }
        this.wareHouseMovementService
            .saveGoodsReceiptPosted(this.prepareSubmitData())
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response || !response.returnID) {
                            this.setFormOutputData(true, null);
                            return;
                        }
                        this._isDirty = false;
                        // don't emit the returnID, because that id is sortinggoodId, in the parked item it need the warehousemovementId
                        // and the mainId is warehousemovementId
                        // the parked item need that id to reslect the item
                        this.setFormOutputData(true, this.mainId);
                        this.getDataForGrid();
                        Uti.resetValueForForm(this.formGroup);
                    });
                },
                (err) => {
                    this.setFormOutputData(true);
                }
            );
    }

    public prepareSubmitData() {
        return [...this.makeInsertDataItem(), ...this.makeDeleteDataItem()];
    }

    protected setFormOutputData(
        submitResult: any,
        returnID?: any,
        errorMessage?: string
    ) {
        this.setValueForOutputModel(
            new FormOutputModel({
                submitResult: submitResult,
                formValue: this.formEditData,
                isValid: this.isValid(),
                isDirty: this.isDirty(),
                returnID: returnID,
                errorMessage: errorMessage || null,
            })
        );
    }

    public rowClickedHandler($event) {
        if (!$event) return;
        this.currentRowIndex = $event.rowIndex;
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/

    /********************************************************************************************/

    private subscribeSave() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.submit();
                });
            });
    }

    private subscribeFormEditModeState() {
        this.formEditModeStateSubscription = this.formEditModeState.subscribe(
            (formEditModeState: boolean) => {
                this.appErrorHandler.executeAction(() => {
                    this.formEditMode = formEditModeState;
                });
            }
        );

        this.formEditDataStateSubscription = this.formEditDataState.subscribe(
            (formEditDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.formEditData = formEditDataState;
                });
            }
        );
    }

    private formValueChange() {
        setTimeout(() => {
            this.formGroupValueChangeSubscription = this.formGroup.valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (this.formGroup.pristine) return;

                        if (
                            !this.isAllowQuantity(
                                this.formGroup.value.quantity || 0
                            )
                        ) {
                            this.modalService.warningMessage([
                                {
                                    key: "Modal_Message__Quantity_Received_Is_Greater_Than_Quantity_In_Order",
                                },
                            ]);
                        }
                        if (this.formGroup.valid) {
                            this.gridSectionHeight = {
                                height: `calc(100% - 65px)`,
                            };
                            return;
                        }
                        this.gridSectionHeight = {
                            height: `calc(100% - 85px)`,
                        };
                    });
                });
        }, 2000);
    }

    private initEmptyForm() {
        this.initForm({
            quantity: ["", Validators.required],
            division: "",
            coordinates: "",
            lot: "",
            expiryDate: "",
            closingReason: "",
        });
        this.isRenderForm = true;
    }

    private initData() {
        this.subscribeSave();
        this.getClosingReasonData();
        // this.checkIdSalesCampaignWizardItems();
        // this.waitToCheckWarehouseMovementIdAndGetData();
    }

    // private counterWaitToCheckWarehouseMovementIdAndGetData = 0;
    // private isCheckWarehouseMovementId = false;

    // private waitToCheckWarehouseMovementIdAndGetData() {
    //     setTimeout(() => {
    //         if (this.counterWaitToCheckWarehouseMovementIdAndGetData > 100) return;
    //         if (!this.isCheckWarehouseMovementId) {
    //             this.counterWaitToCheckWarehouseMovementIdAndGetData += 1;
    //             this.waitToCheckWarehouseMovementIdAndGetData();
    //             return;
    //         }
    //         this.isCheckWarehouseMovementId = false;
    //         if (this.disableForm) return;
    //         this.getClosingReasonData();
    //         this.getArrivedArticleData();
    //     }, 200);
    // }

    private getDataForGrid() {
        this.getArrivedArticleData();
        this.getStockedArticleData();
    }

    private insertItemToGrid(formValue: any) {
        let closingText = "";
        const idWarehouseMovementGoodsIssue = Uti.getValueFromArrayByKey(
            this.currentArrivedArticle,
            "IdWarehouseMovementGoodsIssue"
        );
        if (this.closingReasonDropDownList)
            closingText = this.closingReasonDropDownList.text;
        const receiveDate = formValue.expiryDate || null;
        const gridItem = {
            IdWarehouseMovementGoodsReceiptPosted: -(
                Math.random() * 1000000000000
            ),
            IdWarehouseMovementGoodsIssue: idWarehouseMovementGoodsIssue,
            ArticleNr: this.newArticleNumber,
            QuantityToPosted: formValue.quantity,
            LotNr: formValue.lot,
            Division: formValue.division,
            Coordinate: formValue.coordinates,
            ShelfLife: receiveDate,
            ReceiveDate: receiveDate,
            ClosingReason: closingText,
            IdRepWarehouseCorrection: formValue.closingReason,
            IsCanDeleted: 1,
        };
        const currentGridData = this.stockedArticleGrid.data;
        currentGridData.unshift(gridItem);
        this.stockedArticleGrid = cloneDeep({
            data: currentGridData,
            columns: this.stockedArticleGrid.columns,
        });
        // this.updateArrivedArticleGrid({
        //     ArticleNr: articleNr,
        //     QuantityToPosted: formValue.quantity
        // }, true);
        // this.updateCached();
        setTimeout(() => {
            this.checkingFormEnable();
            this.moveNextRowInArrivedArticleGrid();
        }, 300);

        this.changeDetectorRef.detectChanges();
    }

    private moveNextRowInArrivedArticleGrid() {
        if (this.currentRowIndex >= this.arrivedArticleGrid.data.length - 1)
            return;
        this.arrivedArticleGridComponent.selectRowIndex(
            this.currentRowIndex + 1
        );
        this.currentRowIndex++;
    }

    // private addCachedDeleteData(deleteItem: any) {
    //     if (deleteItem.IdWarehouseMovementGoodsReceiptPosted < 0) {
    //         return;
    //     }
    //     const itemId = Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'IdWarehouseMovementGoodsIssue');
    //     const currentItem = this.deleteCachedGridData.find(x => x.itemId === itemId);
    //     if (currentItem && currentItem.itemId) {
    //         currentItem.deleteData.push(deleteItem);
    //     } else {
    //         this.deleteCachedGridData.push({
    //             itemId: itemId,
    //             deleteData: [deleteItem]
    //         });
    //     }
    // }

    // private makeInsertData(): Array<any> {
    //     let result = [];
    //     this.cachedGridData.forEach(x => {
    //         result = [...result, ...(this.makeInsertDataItem(x))];
    //     });
    //     return result;
    // }

    // private makeInsertDataItem(cachedItem: any): Array<any> {
    private makeInsertDataItem(): Array<any> {
        const insertData = this.stockedArticleGrid.data.filter(
            (x) => x.IdWarehouseMovementGoodsReceiptPosted < 0
        );
        if (!insertData || !insertData.length) return [];
        return insertData.map((x) => {
            return {
                IdWarehouseMovementGoodsIssue: x.IdWarehouseMovementGoodsIssue,
                IdRepWarehouseCorrection: x.IdRepWarehouseCorrection,
                QuantityToPosted: x.QuantityToPosted,
                LotNr: x.LotNr,
                Division: x.Division,
                Coordinate: x.Coordinate,
                ShelfLife: x.ShelfLife,
                ReceiveDate: x.ReceiveDate,
                IsActive: true,
            };
        });
    }

    // private makeDeleteData(): Array<any> {
    //     let result = [];
    //     this.deleteCachedGridData.forEach(x => {
    //         result = [...result, ...(this.makeDeleteDataItem(x))];
    //     });
    //     return result;
    // }

    private makeDeleteDataItem(): Array<any> {
        const deleteData = Uti.getItemsDontExistItems(
            this.currentRightGridData,
            this.stockedArticleGrid.data,
            "IdWarehouseMovementGoodsReceiptPosted"
        );
        if (!deleteData || !deleteData.length) return [];
        return deleteData.map((x) => {
            return {
                IdWarehouseMovementGoodsReceiptPosted:
                    x.IdWarehouseMovementGoodsReceiptPosted,
                IsDeleted: "1",
            };
        });
    }

    private subscribeWarehouseMovementRequestConfirmAllState() {
        this.warehouseMovementRequestConfirmAllStateSubscription =
            this.dispatcher
                .filter((action: CustomAction) => {
                    return (
                        action.type ===
                            WarehouseMovementActions.REQUEST_CONFIRM_ALL &&
                        action.module.idSettingsGUI ==
                            this.ofModule.idSettingsGUI
                    );
                })
                .subscribe((simpleTabID: any) => {
                    this.appErrorHandler.executeAction(() => {
                        this.confirmAll();
                    });
                });
    }

    private subscribeWarehouseMovementSaveAndConfirmState() {
        this.warehouseMovementRequestConfirmAllStateSubscription =
            this.dispatcher
                .filter((action: CustomAction) => {
                    return (
                        action.type ===
                            WarehouseMovementActions.REQUEST_SAVE_AND_CONFIRM &&
                        action.module.idSettingsGUI ==
                            this.ofModule.idSettingsGUI
                    );
                })
                .subscribe((simpleTabID: any) => {
                    this.appErrorHandler.executeAction(() => {
                        this.saveAndConfirm();
                    });
                });
    }

    private confirmAll() {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                messageType: MessageModal.MessageType.confirm,
                headerText: "Confirm All",
                message: [
                    { key: "<p>" },
                    { key: "Modal_Message__Do_You_Want_To_Confirm_All_Items" },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.primary,
                callBack1: () => {
                    this.savingConfirmAllData();
                },
            })
        );
    }

    private saveAndConfirm() {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                messageType: MessageModal.MessageType.confirm,
                headerText: "Save & Confirm",
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Save_Confirm_All_Items",
                    },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.primary,
                callBack1: () => {
                    this.saveAndConfirmSortingGoods();
                },
            })
        );
    }

    private checkingFormEnable(inputQuantity = 0): boolean {
        if (!this.isAllowQuantity(inputQuantity)) {
            this.formGroup.disable();
            return (this.disabledFormStokedArticle = true);
        }

        this.formGroup.enable();
        Uti.resetValueForForm(this.formGroup);
        setTimeout(() => {
            this.quantityField.nativeElement.focus();
            this.initFocusControl();
        }, 300);
        return (this.disabledFormStokedArticle = false);
    }

    private isAllowQuantity(inputQuantity = 0) {
        const idWarehouseMovementGoodsIssue = Uti.getValueFromArrayByKey(
            this.currentArrivedArticle,
            "IdWarehouseMovementGoodsIssue"
        );
        if (!idWarehouseMovementGoodsIssue) {
            return false;
        }
        const quantityToMove = Uti.getValueFromArrayByKey(
            this.currentArrivedArticle,
            "QuantityToMove"
        );
        const totalQuantiry = this.stockedArticleGrid.data
            .filter(
                (x) =>
                    x.IdWarehouseMovementGoodsIssue ===
                    idWarehouseMovementGoodsIssue
            )
            .reduce((acc, value) => {
                return (
                    Uti.parFloatFromObject(acc, 0) +
                    Uti.parFloatFromObject(value.QuantityToPosted, 0)
                );
            }, inputQuantity);
        if (inputQuantity > 0) {
            return quantityToMove >= totalQuantiry;
        } else {
            return quantityToMove > totalQuantiry;
        }
    }

    private getClosingReasonData() {
        this.comServiceSubscription = this.commonService
            .getListComboBox("WareHouse,WarehouseCorrectionReason")
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) &&
                        !response.item.WarehouseCorrectionReason
                    ) {
                        this.formValueChange();
                        return;
                    }
                    this.closingReasonData =
                        response.item.WarehouseCorrectionReason;
                    setTimeout(() => {
                        this.closingReasonDropDownList.selectedIndex = -1;
                        this.formValueChange();
                    });
                });
            });
    }

    private getArrivedArticleData() {
        this.getSortingGoodSubscription = this.wareHouseMovementService
            .getArrivedArticles(this.mainId)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        if (
                            this.arrivedArticleGrid &&
                            this.arrivedArticleGrid.columns &&
                            this.arrivedArticleGrid.columns.length
                        ) {
                            this.arrivedArticleGrid = {
                                columns: this.arrivedArticleGrid.columns,
                                data: [],
                            };
                        }
                        return;
                    }
                    // response.item.data[1].push({"IdWarehouseMovementGoodsIssue": 3, "ArticleNr": "560001", "New ArticleNr": null, "ArticleNameShort": "Station Temporelle", "QuantityToMove": 500, "Moved": 100, "Confirmed": null, "NotConfirmed": 400});
                    let gridData =
                        this.datatableService.formatDataTableFromRawData(
                            response.item.data
                        );
                    gridData = this.datatableService.buildDataSource(gridData);
                    this.arrivedArticleGrid =
                        this.datatableService.appendRowId(gridData);
                    // this.getStockedArticleData();
                    // if (!this.arrivedArticleGrid.data.length) {
                    //     this.getDataForStockedArticles();
                    // }
                    this.setEnableForConfirmAllButton();
                });
            });
    }

    // private getDataForStockedArticles() {
    //     const idWarehouseMovementGoodsIssue = Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'IdWarehouseMovementGoodsIssue');
    //     this.articleNumber = Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'ArticleNr');
    //     this.newArticleNumber = Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'New ArticleNr') ? Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'New ArticleNr') : this.articleNumber;
    //     const item = this.cachedGridData.find(x => x.itemId === idWarehouseMovementGoodsIssue);
    //     if (item && item.itemId) {
    //         this.stockedArticleGrid = item.gridData;
    //         this.checkingFormEnable();
    //     } else {
    //         this.getStockedArticleData(idWarehouseMovementGoodsIssue)
    //     }
    // }

    // private getStockedArticleData(idWarehouseMovementGoodsIssue: any) {
    private getStockedArticleData() {
        // if (idWarehouseMovementGoodsIssue) {
        this.getStockedArticlesSubscription = this.wareHouseMovementService
            .stockedArticles(this.mainId)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        if (
                            this.stockedArticleGrid &&
                            this.stockedArticleGrid.columns &&
                            this.stockedArticleGrid.columns.length
                        ) {
                            this.stockedArticleGrid = {
                                columns: this.stockedArticleGrid.columns,
                                data: [],
                            };
                        }
                        return;
                    }
                    let gridData: any =
                        this.datatableService.formatDataTableFromRawData(
                            response.item.data
                        );
                    gridData = this.datatableService.buildDataSource(gridData);

                    gridData = this.datatableService.appendRowId(gridData);
                    gridData.columns.push({
                        title: "Delete",
                        data: "Delete",
                        visible: true,
                        readOnly: true,
                        setting: {},
                    });
                    this.stockedArticleGrid = gridData;
                    // this.cachedGridData.push({
                    //     itemId: idWarehouseMovementGoodsIssue,
                    //     gridData: cloneDeep(this.stockedArticleGrid)
                    // });
                    this.currentRightGridData = cloneDeep(gridData.data);
                    this.checkingFormEnable();
                });
            });
        // }
    }

    private setEnableForConfirmAllButton() {
        let movedTotal: number = 0;
        let confirmTotal: number = 0;

        for (let item of this.arrivedArticleGrid.data) {
            movedTotal += item.Moved || 0;
            confirmTotal += item.Confirmed || 0;
        }

        if (movedTotal <= confirmTotal) return;
        this.setValueForOutputModel(
            new FormOutputModel({
                submitResult: null,
                formValue: this.formEditData,
                isValid: true,
                isDirty: false,
                returnID: null,
                payload: {
                    isConfirmAllDirty: true,
                },
            })
        );
    }

    // private checkIdSalesCampaignWizardItems() {
    //     setTimeout(() => {
    //         this.isCheckWarehouseMovementId = true;
    //         if (this.mainId) {
    //             this.disableForm = false;
    //             return;
    //         }
    //         this.modalService.warningMessageHtmlContent({
    //             message: `<p>To new <strong>Sorting Good</strong></p>
    //             <p>You must select a item in <strong>Table Warehouse Movement</strong> first</p>
    //             <p>(you must wait the <strong>Table Warehouse Movement</strong> is loaded)</p>`,
    //             callBack: this.cancelItem.bind(this),
    //             closedCallBack: this.cancelItem.bind(this)
    //         });
    //     }, 300);
    // }

    private cancelItem() {
        this.store.dispatch(this.tabButtonActions.requestCancel(this.ofModule));
    }

    public savingConfirmAllData() {
        this.backOfficeService
            .confirmGoodsReceiptPosted(this.mainId)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    this._isDirty = false;
                    if (!Uti.isResquestSuccess(response)) {
                        this.toasterService.pop(
                            "error",
                            "Fail",
                            "Can not Confirm!"
                        );
                        return;
                    }
                    this.setFormOutputData(true, this.mainId);
                    this.toasterService.pop(
                        "success",
                        "Success",
                        "The data was confirmed."
                    );
                    this.store.dispatch(
                        this.wareHouseMovementActions.requestConfirmAllSuccess(
                            this.ofModule
                        )
                    );
                });
            });
    }

    public saveAndConfirmSortingGoods() {
        if (!this.isDirty()) {
            this.setFormOutputData(false, null);
            return;
        }
        this.wareHouseMovementService
            .saveGoodsReceiptPosted(this.prepareSubmitData())
            .subscribe((value) => {
                this.appErrorHandler.executeAction(() => {
                    if (!value || !value.returnID) {
                        this.setFormOutputData(true);
                        return;
                    }
                    this._isDirty = false;
                });
                this.backOfficeService
                    .confirmGoodsReceiptPosted(this.mainId)
                    .subscribe((data) => {
                        this.appErrorHandler.executeAction(() => {
                            this._isDirty = false;
                            if (!Uti.isResquestSuccess(data)) {
                                this.toasterService.pop(
                                    "error",
                                    "Fail",
                                    "Can not Confirm!"
                                );
                                return;
                            }
                            this.setFormOutputData(true, this.mainId);
                            this.toasterService.pop(
                                "success",
                                "Success",
                                "The data was confirmed."
                            );
                            this.store.dispatch(
                                this.wareHouseMovementActions.requestSaveAndConfirmSuccess(
                                    this.ofModule
                                )
                            );
                        });
                    });
            });
    }

    // private updateCached() {
    //     const idWarehouseMovementGoodsIssue = Uti.getValueFromArrayByKey(this.currentArrivedArticle, 'IdWarehouseMovementGoodsIssue');
    //     for (const item of this.cachedGridData) {
    //         if (item.itemId != idWarehouseMovementGoodsIssue) continue;
    //         item.gridData = cloneDeep(this.stockedArticleGrid);
    //     }
    // }

    // private updateArrivedArticleGrid(quantityData: any, isAdd?: boolean) {
    //     const currentItem = this.arrivedArticleGrid.data.find(x => x.ArticleNr === quantityData.ArticleNr);
    //     if (!currentItem || !currentItem.ArticleNr) return;
    //     currentItem.Moved = (currentItem.Moved || 0) + (quantityData.QuantityToPosted * (isAdd ? 1 : -1));
    //     // currentItem.NotConfirmed = (currentItem.QuantityToMove || 0) - (currentItem.Moved || 0);
    //     this.arrivedArticleGridComponent.updateRowData([currentItem]);
    // }

    private initFocusControl() {
        if (!this.controlFocusComponent) return;

        this.controlFocusComponent.initControl();
    }
}
