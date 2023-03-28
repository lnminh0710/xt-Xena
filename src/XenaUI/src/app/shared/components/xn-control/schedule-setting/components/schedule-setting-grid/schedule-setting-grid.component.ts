import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    Output,
    OnChanges,
    OnDestroy,
    ViewChild,
    SimpleChanges,
    EventEmitter,
    TemplateRef,
    ChangeDetectorRef,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { ScheduleEvent, MessageModel } from "app/models";
import {
    MessageModal,
    DateConfiguration,
    SystemScheduleServiceName,
} from "app/app.constants";
import {
    ModalService,
    GlobalSettingService,
    AppErrorHandler,
} from "app/services";
import * as wjcCore from "wijmo/wijmo";
import * as wjcGrid from "wijmo/wijmo.grid";
import find from "lodash-es/find";
import reject from "lodash-es/reject";
import cloneDeep from "lodash-es/cloneDeep";
import sortBy from "lodash-es/sortBy";
import filter from "lodash-es/filter";
import uniqBy from "lodash-es/uniqBy";
import groupBy from "lodash-es/groupBy";
import isNil from "lodash-es/isNil";
import { format } from "date-fns/esm";
import { Uti } from "app/utilities/uti";
import { TemplateCellRenderer } from "app/shared/components/xn-control/xn-ag-grid/components/template-cell-renderer/template-cell-renderer.component";
import {
    GridApi,
    TooltipParams,
    // GridOptions
} from "ag-grid-community";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";

@Component({
    selector: "schedule-setting-grid",
    styleUrls: ["./schedule-setting-grid.component.scss"],
    templateUrl: "./schedule-setting-grid.component.html",
})
export class ScheduleSettingGridComponent
    extends BaseComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
    public SCHEDULE_TYPE = DateConfiguration.SCHEDULE_TYPE;
    public allowMerging = wjcGrid.AllowMerging.All;
    public nextScheduleEvent: ScheduleEvent = new ScheduleEvent();
    public dayOfWeekEnum: Array<string> = DateConfiguration.WEEK_DAY;
    public gridColumns: Array<any> = [];
    public defaultColDef: any = {
        sortable: true,
        resizable: true,
        filter: true,
    };
    // public gridOptions: GridOptions;
    // public popupParent;
    public systemScheduleServiceNameView = SystemScheduleServiceName;
    public gridData: any = {
        columns: [],
        data: [],
    };
    public gridId = "fd649f91-f4ee-4376-a3eb-e9f995f2e32c";
    public columnsLayoutSettings = {
        settings: [
            {
                colId: "ag-Grid-AutoColumn",
                hide: false,
                aggFunc: null,
                width: 200,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "startDate",
                hide: true,
                aggFunc: null,
                width: 200,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "stopDate",
                hide: true,
                aggFunc: null,
                width: 200,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "sort",
                hide: true,
                aggFunc: null,
                width: 200,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "on",
                hide: true,
                aggFunc: null,
                width: 147,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: 0,
            },
            {
                colId: "at",
                hide: false,
                aggFunc: null,
                width: 146,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "email",
                hide: false,
                aggFunc: null,
                width: 146,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "parameter",
                hide: false,
                aggFunc: null,
                width: 146,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "note",
                hide: false,
                aggFunc: null,
                width: 146,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
            {
                colId: "Delete",
                hide: false,
                aggFunc: null,
                width: 100,
                pivotIndex: null,
                pinned: null,
                rowGroupIndex: null,
            },
        ],
        sortState: [],
    };
    public showGrid = false;

    private _api: GridApi;

    @ViewChild("scheduleEventGrid") public scheduleEventGrid: XnAgGridComponent;
    @ViewChild("deleteButton") deleteButton: TemplateRef<any>;
    @ViewChild("runButton") runButton: TemplateRef<any>;

    @Input() scheduleType: any;
    @Input() currentRowData: any;
    @Input() globalDateFormat: string = "MM/dd/yyyy";
    @Input() scheduleEventGridData: Array<ScheduleEvent>;

    @Output() onDeleteAction: EventEmitter<any> = new EventEmitter();
    @Output() onRunAction: EventEmitter<any> = new EventEmitter();
    @Output() onRowDoubleClickedAction: EventEmitter<any> = new EventEmitter();
    @Output() onGridEditedAction: EventEmitter<any> = new EventEmitter();
    @Output() onCheckAllCheckedAction: EventEmitter<any> = new EventEmitter();

    constructor(
        private _modalService: ModalService,
        private _globalSettingService: GlobalSettingService,
        private _appErrorHandler: AppErrorHandler,
        private _ref: ChangeDetectorRef,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        // this.initGrid();
        // this.buildContextMenuItems = this.buildContextMenuItems.bind(this);
        // this.popupParent = document.querySelector("body");
    }

    public ngOnDestroy() {}

    public ngAfterViewInit() {
        setTimeout(() => {
            this.gridData = {
                columns: this.createColumns(),
                data: [],
            };
            // this.gridColumns = this.createColumns();
            this.loadColumnSetting();
            this.detectChanges();
        }, 300);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty("scheduleEventGridData")) {
            setTimeout(() => {
                this.makeScheduleGridData();
            }, 500);
        }
    }

    public deleteClickHandle($event): void {
        const item = this.scheduleEventGridData.find((x) => x.id == $event.id);
        this._modalService.confirmMessageHtmlContent(
            new MessageModel({
                headerText: "Delete Event",
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "<p>" },
                    { key: "Modal_Message__Do_You_Want_To_Delete_Event" },
                    { key: " " + item.on },
                    { key: " - " },
                    { key: item.at },
                    { key: "?</p>" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.deleteGridItem($event.id);
                    this.callExpandNodeByData([item.on]);
                    this.onDeleteAction.emit($event.id);
                },
            })
        );
    }

    public runScheduleClickHandle(data: any) {
        this.onRunAction.emit(
            this.scheduleEventGridData.find((x) => x.id == data.id)
        );
    }

    public deleteGridItem(id: any, func?: Function): boolean {
        this.scheduleEventGridData = reject(this.scheduleEventGridData, {
            id: id,
        });
        this.scheduleEventGridData = sortBy(this.scheduleEventGridData, [
            "sort",
            "at",
        ]);
        // setTimeout(() => {
        if (func) {
            return func();
        }
        this.gridData = {
            columns: this.gridData.columns,
            data: this.scheduleEventGridData,
        };
        // });
        return false;
    }

    public makeScheduleGridData() {
        if (!this.gridData.columns || !this.gridData.columns.length) return;
        this.scheduleEventGridData = sortBy(this.scheduleEventGridData, [
            "sort",
            "at",
        ]);
        this.formatDateForOn();
        this.gridData = {
            columns: this.gridData.columns,
            data: this.scheduleEventGridData,
        };
        this.detectChanges();
        // if (this._api) {
        //     this._api.sizeColumnsToFit();
        // }
    }

    private formatDateForOn() {
        for (let item of this.scheduleEventGridData) {
            item.on = this.dateFormatter(item.on);
        }
    }

    public onGridReadyHandle(api) {
        this._api = api;
        // this._api.sizeColumnsToFit();
    }

    public callExpandNodeByData(ons: Array<any>, isAll?: boolean) {
        setTimeout(() => {
            this._api.forEachNode(function (node) {
                if (isAll) {
                    node.setExpanded(true);
                } else {
                    for (let on of ons) {
                        if (on instanceof Date) {
                            if (
                                Uti.joinDateToNumber(on, "yyyyMMdd") ===
                                Uti.joinDateToNumber(
                                    new Date(node.key),
                                    "yyyyMMdd"
                                )
                            ) {
                                node.setExpanded(true);
                                break;
                            }
                        } else if (on == node.key) {
                            node.setExpanded(true);
                            break;
                        }
                    }
                }
            });
        }, 1000);
    }

    // public buildContextMenuItems() {
    //     return [
    //         'copy',
    //         'copyWithHeaders',
    //         {
    //             name: 'Copy row',
    //             action: (event) => { this._api.copySelectedRowsToClipboard(false); },
    //             cssClasses: [''],
    //             icon: `<i class="fa  fa-clipboard  blue-color  ag-context-icon"/>`
    //         },
    //         {
    //             name: 'Copy row with Headers',
    //             action: (event) => { this._api.copySelectedRowsToClipboard(true); },
    //             cssClasses: [''],
    //             icon: `<i class="fa  fa-clipboard  blue-color  ag-context-icon"/>`
    //         },
    //         'paste',
    //         'separator',
    //         'export',
    //         {
    //             name: 'Fit width columns',
    //             action: (event) => {
    //                 this.sizeColumnsToFit();
    //                 // setTimeout(() => {
    //                 //     this.updateColumnState();
    //                 // }, 500);
    //             },
    //             cssClasses: [''],
    //             icon: `<i class="fa  fa-arrows  ag-context-icon"/>`
    //         }
    //     ];
    // }

    public onRowDoubleClicked(rowData: any) {
        this.onRowDoubleClickedAction.emit(rowData);
    }

    public updateRowData(rowData: any) {
        this._api.updateRowData({ update: [rowData] });
    }

    public cellValueChangedHandle(rowData: any) {
        this.onGridEditedAction.emit(rowData);
        this.detectChanges();
    }

    public onCheckAllCheckedHandle(status: any) {
        this.onCheckAllCheckedAction.emit(status);
        this.detectChanges();
    }

    /**
     * sizeColumnsToFit
     **/
    // public sizeColumnsToFit() {
    //     setTimeout(() => {
    //         if (this._api) {
    //             this._api.sizeColumnsToFit();
    //         }
    //     }, 200);
    // }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private loadColumnSetting() {
        this._globalSettingService
            .getAllGlobalSettings("-1")
            .subscribe((data: any) => {
                this._appErrorHandler.executeAction(() => {
                    if (!data || !data.length) return;
                    let currentColumnLayoutData = data.find(
                        (x) => x.globalName == this.gridId
                    );
                    setTimeout(() => {
                        this.showGrid = true;
                    });
                    if (
                        !currentColumnLayoutData ||
                        !currentColumnLayoutData.jsonSettings
                    )
                        return;
                    this.columnsLayoutSettings = Uti.tryParseJson(
                        currentColumnLayoutData.jsonSettings
                    );
                });
            });
    }

    /**
     * Update comlumn state after there are some actions occur on col (Resize, Show/Hide Col)
     **/
    // private updateColumnState($event?) {
    //     if (!this.isDirtyFromUserAction()) return;
    //     const settings = this.getColumnLayout();
    //     const sortState = this.api ? this.api.getSortModel() : null;
    //     if (this.columnsLayoutSettings) {
    //         this.columnsLayoutSettings.settings = settings && settings.length ? settings : this.columnsLayoutSettings.settings;
    //         this.columnsLayoutSettings.sortState = sortState;
    //     }
    //     const outputData = {
    //         columnState: this.getColumnLayout(),
    //         sortState: sortState,
    //         source: $event ? $event.source : null,
    //         type: $event ? $event.type : null
    //     };
    //     this.changeColumnLayout.emit(outputData);
    //     this.isColumnsLayoutChanged = true;
    //     this.saveColumnsLayoutItSelf();

    //     this.changeColumnLayoutMasterDetail();
    // }

    /**
     * initGrid
     * */
    // private initGrid() {
    //     if (this.gridOptions) {
    //         this.gridOptions = null;
    //     }
    //     this.gridOptions = <GridOptions>{
    //         onFirstDataRendered: (params) => {
    //             params.api.sizeColumnsToFit();
    //         },
    //         context: {
    //             componentParent: this
    //         }
    //     };
    // }

    // private buildTooltip(params: TooltipParams) {
    //     if (!params || !params.context || !params.data || !params.context.componentParent) return null;
    //     if (params.context.componentParent.customTooltip) {
    //         return params.context.componentParent.customTooltip.preText + params.data[params.context.componentParent.customTooltip.fieldName];
    //     }

    //     if (typeof params.data[params.colDef.field] !== 'object') {
    //         return params.data[params.colDef.field];
    //     } else if (params.data[params.colDef.field] && params.data[params.colDef.field].hasOwnProperty('key')) {
    //         return params.data[params.colDef.field].value;
    //     }

    //     return null;
    // }

    private createColumns() {
        let columns: any = [
            {
                title: "startDate",
                data: "startDate",
                setting: {
                    DataType: "datetime",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                                Hidden: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "stopDate",
                data: "stopDate",
                setting: {
                    DataType: "datetime",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                                Hidden: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "sort",
                data: "sort",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                                Hidden: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "On",
                data: "on",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                                AutoGroupColumnDef: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "At",
                data: "at",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Email",
                data: "email",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Parameter",
                data: "parameter",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Note",
                data: "note",
                setting: {
                    DataType: "nvarchar",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                data: "activeSchedule",
                readOnly: false,
                title: "Active",
                visible: true,
                setting: {
                    DataType: "Boolean",
                    Setting: [
                        {
                            ControlType: {
                                Type: "checkbox",
                            },
                        },
                    ],
                },
            },
            {
                data: "Delete",
                readOnly: false,
                title: "",
                visible: true,
                setting: {
                    DataType: "button",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
        ];

        if (
            this.currentRowData.IdRepAppSystemScheduleServiceName ==
            SystemScheduleServiceName.CallStoreProcedureService
        ) {
            columns.push({
                data: "RunSchedule",
                readOnly: false,
                title: "",
                visible: true,
                setting: {
                    DataType: "button",
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            });
        }
        return columns;
    }

    // private createColumns(): Array<any> {
    //     let columns: Array<any> = [{
    //         headerName: 'On',
    //         showRowGroup: "on",
    //         cellRenderer: "agGroupCellRenderer",
    //         filterValueGetter: function(params) {
    //           return params.data ? params.data.on : null;
    //         }
    //     },
    //     {
    //         field: 'on',
    //         rowGroup: true,
    //         hide: true,
    //         valueFormatter: this.dateFormatter.bind(this)
    //     },
    //     {
    //         field: 'startDate',
    //         hide: true
    //     },
    //     {
    //         field: 'stopDate',
    //         hide: true
    //     },
    //     {
    //         headerName: 'At',
    //         field: 'at'
    //     },
    //     {
    //         headerName: 'Email',
    //         field: 'email',
    //         tooltip: this.buildTooltip.bind(this)
    //     },
    //     {
    //         headerName: 'Parameter',
    //         field: 'parameter',
    //         tooltip: this.buildTooltip.bind(this)
    //     },
    //     {
    //         headerName: 'Note',
    //         field: 'note',
    //         tooltip: this.buildTooltip.bind(this)
    //     },
    //     {
    //         headerName: 'Delete',
    //         field: 'delete',
    //         cellRendererFramework: TemplateCellRenderer,
    //         editable: false,
    //         cellRendererParams: {
    //             ngTemplate: this.deleteButton
    //         }
    //     }];
    //     if (this.currentRowData.IdRepAppSystemScheduleServiceName == SystemScheduleServiceName.CallStoreProcedureService) {
    //         columns.push({
    //             headerName: 'Run',
    //             field: 'run',
    //             cellRendererFramework: TemplateCellRenderer,
    //             editable: false,
    //             cellRendererParams: {
    //                 ngTemplate: this.runButton
    //             }
    //         });
    //     }
    //     return columns;
    // }

    private dateFormatter(value) {
        try {
            if (typeof (value * 1) === "number" && !isNaN(value * 1)) {
                return value;
            }
            if (value instanceof Date) {
                return format(value, this.globalDateFormat);
            }
            let date: any = new Date(value);
            if (date == "Invalid Date") {
                return value;
            }
            return format(date, this.globalDateFormat);
        } catch {}
        return value;
    }

    private detectChanges() {
        setTimeout(() => {
            this._ref.markForCheck();
            this._ref.detectChanges();
            if (!this.scheduleEventGrid) return;
            this.scheduleEventGrid.detectChanges();
        }, 100);
    }
}
