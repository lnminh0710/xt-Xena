import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    ComponentFactoryResolver,
    ComponentRef,
    ViewContainerRef,
    ViewChild,
    EventEmitter,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import {
    AppErrorHandler,
    DataEntryService,
    DatatableService,
    ModalService,
    BackOfficeService,
} from "app/services";
import * as uti from "app/utilities";
import { PaperworkComponent } from "app/shared/components/widget/components/paperwork";
import { ReducerManagerDispatcher } from "@ngrx/store";
import {
    DataEntryActions,
    CustomAction,
} from "app/state-management/store/actions";
import { DataEntryFormBase } from "app/shared/components/form/data-entry/data-entry-form-base";
import { Router } from "@angular/router";
import {
    OrderDataEntrySummaryModel,
    FieldFilter,
    MessageModel,
} from "app/models";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import {
    FilterModeEnum,
    MessageModal,
    OrderDataEntryTabEnum,
} from "app/app.constants";
import cloneDeep from "lodash-es/cloneDeep";
import { ModuleList } from "../../../../../pages/private/base";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";

@Component({
    selector: "order-list-summary",
    templateUrl: "./order-list-summary.component.html",
    styleUrls: ["./order-list-summary.component.scss"],
})
export class DataEntryOrderListSummaryComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy
{
    public orderListSummaryDataSource: any;
    public serverApiUrl = "/api/FileManager/GetScanFile?name=";
    public rowGrouping: boolean;
    private selectSummaryFilterState: Observable<any>;
    private clearSummaryFilterDataState: Observable<any>;
    private selectSummaryFilterStateSubscription: Subscription;
    private clearSummaryFilterDataStateSubscription: Subscription;
    private printStateSubscription: Subscription;
    private _fieldFilters: Array<FieldFilter>;
    private _selectedFilter: FilterModeEnum;
    private contentDetail: any = {
        collectionData: [],
        columnSettings: [],
    };

    @Input() tabID: string;
    @Input() gridId: string;
    @Input() set fieldFilters(data: Array<FieldFilter>) {
        if (!data || !data.length) {
            return;
        }
        this._fieldFilters = data;
        // this.updateColumnsSettingFromFilter();
        this.rebuldColumnsSettingFromFilter();
    }
    @Input() set selectedFilter(data: FilterModeEnum) {
        this._selectedFilter = data;
        this.rebuldColumnsSettingFromFilter();
    }
    @Input() globalProperties: any;
    @Output() onHeaderColsUpdated = new EventEmitter<Array<string>>();

    @ViewChild(XnAgGridComponent) xnAgGridComponent: XnAgGridComponent;

    constructor(
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private dataEntryService: DataEntryService,
        private datatableService: DatatableService,
        private dataEntryActions: DataEntryActions,
        protected containerRef: ViewContainerRef,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected router: Router,
        private dispatcher: ReducerManagerDispatcher,
        private modalService: ModalService,
        private backOfficeService: BackOfficeService
    ) {
        super(router, {
            defaultTranslateText: "summaryData",
            emptyData: new OrderDataEntrySummaryModel(),
        });
        this.selectSummaryFilterState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .selectSummaryFilter
        );
        this.clearSummaryFilterDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .clearSummaryFilterData
        );
    }
    public ngOnInit() {
        this.selectSummaryFilterStateSubscription =
            this.selectSummaryFilterState.subscribe(
                (selectSummaryFilterState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (selectSummaryFilterState) {
                            this.dataEntryService
                                .getOrderDataEntryByLogin(
                                    selectSummaryFilterState.mode,
                                    selectSummaryFilterState.dateFrom,
                                    selectSummaryFilterState.dateTo
                                )
                                .subscribe((response) => {
                                    this.appErrorHandler.executeAction(() => {
                                        if (
                                            !uti.Uti.isResquestSuccess(response)
                                        ) {
                                            return;
                                        }
                                        let tableData: any =
                                            this.datatableService.formatDataTableFromRawData(
                                                response.item.data
                                            );
                                        this.contentDetail =
                                            cloneDeep(tableData);
                                        this.onHeaderColsUpdated.emit(
                                            Object["values"](
                                                this.contentDetail
                                                    .columnSettings
                                            ).map((x) => {
                                                return {
                                                    fieldName:
                                                        x.OriginalColumnName,
                                                    fieldDisplayName:
                                                        x.ColumnHeader,
                                                };
                                            })
                                        );

                                        // tableData = this.datatableService.buildDataSource(tableData);
                                        // tableData = this.datatableService.buildWijmoDataSource(tableData);
                                        // this.orderListSummaryDataSource = tableData;
                                        // this.updateColumnsSettingFromFilter();
                                        this.rebuldColumnsSettingFromFilter();

                                        this.store.dispatch(
                                            this.dataEntryActions.orderSummaryDataLoaded(
                                                {
                                                    mode: selectSummaryFilterState.mode,
                                                    dataCount:
                                                        this
                                                            .orderListSummaryDataSource
                                                            .data.length,
                                                },
                                                this.tabID
                                            )
                                        );
                                    });
                                });
                        }
                    });
                }
            );
        this.clearSummaryFilterDataStateSubscription =
            this.clearSummaryFilterDataState.subscribe(
                (clearSummaryFilterDataState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (clearSummaryFilterDataState) {
                            if (
                                this.orderListSummaryDataSource &&
                                this.orderListSummaryDataSource.columns
                            ) {
                                let currentColumns =
                                    this.orderListSummaryDataSource.columns;
                                this.orderListSummaryDataSource = null;
                                this.orderListSummaryDataSource = {
                                    columns: currentColumns,
                                    data: [],
                                };
                            }
                        }
                    });
                }
            );
        this.subscribePrintState();
    }
    public ngOnDestroy() {
        this.store.dispatch(
            this.dataEntryActions.clearSelectedOrderSummaryItem(this.tabID)
        );

        uti.Uti.unsubscribe(this);
    }
    public rebuildTranslateText() {
        this.rebuildTranslateTextSelf();
        uti.Uti.rebuildColumnHeaderForGrid(
            this.orderListSummaryDataSource,
            this.transferTranslate
        );
    }
    public handleRowGrouping(data) {
        this.rowGrouping = data;
    }
    public onPdfColumnClick($event) {
        if ($event && $event.PDF) {
            if (this.getFileExtension($event.PDF) === "tiff") {
                $event.PDF += ".pdf";
            }

            let a = document.createElement("a");
            a.href =
                this.serverApiUrl +
                $event.PDF +
                "&returnName=" +
                `[` +
                $event.OrderType +
                `]-` +
                `[` +
                $event.MediaCode +
                `]-` +
                `[` +
                $event.CampaignNr +
                `]-` +
                `[` +
                $event.FirstName +
                `]-` +
                `[` +
                $event.LastName +
                `]` +
                `.pdf`;
            a.click();
        }
    }

    private getFileExtension(filename) {
        return filename.split(".").pop();
    }
    /**
     * subscribePrintState
     */
    private subscribePrintState() {
        this.printStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === DataEntryActions.DATA_ENTRY_PRINT &&
                    action.area == this.tabID
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.printWidget();
                });
            });
    }
    /**
     * printWidget
     */
    private printWidget(): void {
        const factory =
            this.componentFactoryResolver.resolveComponentFactory(
                PaperworkComponent
            );
        var componentRef: ComponentRef<PaperworkComponent> =
            this.containerRef.createComponent(factory);
        const paperworkComponent: PaperworkComponent = componentRef.instance;
        paperworkComponent.agGridComponent = this.xnAgGridComponent;
        paperworkComponent.setTitle("Order Summary");
        paperworkComponent.print();
        componentRef.destroy();
    }

    private rebuldColumnsSettingFromFilter() {
        if (!this.contentDetail || !this.contentDetail.columnSettings) return;
        let contentDetail = cloneDeep(this.contentDetail);
        if (this._fieldFilters && this._fieldFilters.length) {
            contentDetail.columnSettings =
                this.datatableService.updateTableColumnSettings(
                    this._selectedFilter,
                    this._fieldFilters,
                    contentDetail.columnSettings,
                    contentDetail.collectionData
                );
        }

        let tableData = this.datatableService.buildDataSource(
            cloneDeep(contentDetail)
        );
        tableData = this.datatableService.buildWijmoDataSource(tableData);
        this.orderListSummaryDataSource = tableData;
    }

    // private updateColumnsSettingFromFilter() {
    //     setTimeout(() => {
    //         if (!this._fieldFilters
    //             || !this._fieldFilters.length
    //             || !this.orderListSummaryDataSource
    //             || !this.orderListSummaryDataSource.columns
    //             || !this.orderListSummaryDataSource.columns.length) return;
    //         let visibleColumns = [];
    //         let inVisibleColumns = [];
    //         for (let item of this._fieldFilters) {
    //             if (item.selected) {
    //                 visibleColumns.push(item.fieldName);
    //             } else {
    //                 inVisibleColumns.push(item.fieldName);
    //             }
    //         }
    //         this.wijmoGridComponent.toogleColumns(visibleColumns, true);
    //         this.wijmoGridComponent.toogleColumns(inVisibleColumns, false);
    //     }, 300);
    // }

    public onEditRowColumnClick(item) {
        if (item) {
            const willChangeTabId = OrderDataEntryTabEnum.Manual;

            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Confirmation",
                    message: [
                        { key: "<p>" },
                        { key: "Modal_Message__Do_You_Want_To_Go_To" },
                        { key: willChangeTabId },
                        { key: "Modal_Message__Tab" },
                        { key: "</p>" },
                    ],
                    callBack1: () => {
                        this.store.dispatch(
                            this.dataEntryActions.requestChangeTab(
                                willChangeTabId
                            )
                        );

                        this.store.dispatch(
                            this.dataEntryActions.requestChangeTabThenLoadData(
                                {
                                    mediacode: item.MediaCode,
                                    campaignNr: item.CampaignNr,
                                    customerNr: item.CustomerNr,
                                    idSalesOrder: item.IdSalesOrder,
                                },
                                willChangeTabId
                            )
                        );
                    },
                })
            );
        }
    }

    public onChangeSelectedItems($event) {
        if ($event && $event.length) {
            let selectedItem = {
                IdSalesOrder: $event.find((x) => x.key === "IdSalesOrder")
                    .value,
            };
            this.store.dispatch(
                this.dataEntryActions.selectOrderSummaryItem(
                    selectedItem,
                    this.tabID
                )
            );
        }
    }

    public onDeleteOrder(eventData) {
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
                        this.saveUnblockOrder(eventData, true);
                    },
                })
            );
        }
    }

    private saveUnblockOrder(eventData: any, isDelete?: boolean) {
        this.backOfficeService
            .saveUnblockOrder(eventData.IdSalesOrder, isDelete)
            .subscribe((resultData: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!this.xnAgGridComponent) return;
                    this.xnAgGridComponent.deleteRowByRowId(eventData.DT_RowId);
                });
            });
    }
}
