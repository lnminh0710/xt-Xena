import {
    Component, Input, Output, EventEmitter, OnInit,
    OnDestroy, AfterViewInit, ElementRef, ViewChild, TemplateRef
} from "@angular/core";
import { ColumnApi, GridApi, GridOptions } from "ag-grid-community";
import {
    CustomerHistory,
    HistoryHeaderInfo,
    HistoryBodyInfo,
    HistoryFooterInfo,
    HistoryHeaderMenu
} from 'app/models';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as Ps from 'perfect-scrollbar';
import {
    ScrollUtils,
    DomHandler
} from 'app/services';
import { IAgGridData } from 'app/shared/components/xn-control/xn-ag-grid/shared/ag-grid.service';
import { TemplateHeaderCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/header-cell-renderer/template-header-cell-renderer/template-header-cell-renderer.component';
import { TemplateCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/template-cell-renderer/template-cell-renderer.component';

@Component({
    selector: 'history-list',
    templateUrl: './history-list.component.html',
    styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {

    // Core API of Ag Grid
    private api: GridApi;
    private columnApi: ColumnApi;
    public gridOptions: GridOptions;


    public customerHistories : Array<CustomerHistory>;

    @Input() set data(customerHistories: Array<CustomerHistory>) {
        this.customerHistories = customerHistories;
        this.buildAgGridDataSource(customerHistories);
    };

    @Input() set resizeInfo(resizeInfo: string) {
        this.turnOnStartResizeMode();
    }


    // @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('headerCell') headerCellTemplateRef: TemplateRef<any>;
    @ViewChild('bodyCell') bodyCellTemplateRef: TemplateRef<any>;
    
    public dataSource: {
        columns: Array<any>,
        data: Array<any>
    };

    public showLeftIconScroll: boolean;
    public showRightIconScroll: boolean;

    private _scrollUtils: ScrollUtils;
    private get scrollUtils() {
        if (!this._scrollUtils) {
            this._scrollUtils = new ScrollUtils(this.scrollBodyContainer, this.domHandler);
        }
        return this._scrollUtils;
    }

    constructor(private _eref: ElementRef, private domHandler: DomHandler) {
        this.initGrid();
        this.dataSource = {
            columns: [],
            data: []
        };
    }

    /**
     * scrollBodyContainer of widget
     */
    private get scrollBodyContainer() {
        //const elm = $('div[wj-part=\'root\']', this.flex.hostElement);
        //if (elm.length) {
        //    return elm[0];
        //}
        return null;
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        if (this.gridOptions) {
            this.gridOptions.columnDefs = null;
            this.gridOptions.rowData = null;
            this.gridOptions = null;            
        }
        if (this.api) {
            this.api.destroy();
        }
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        //if (this.flex) {
        //    this.addPerfectScrollbar();
        //}
    }

    /**
     * initGrid
     * */
    private initGrid() {
        if (this.gridOptions) {
            this.gridOptions = null;
        }
        this.gridOptions = <GridOptions>{
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            },
            context: {
                componentParent: this
            },
            rowHeight: 150
        };
    }

    /**
     * onReady
     * @param params
     */
    public onReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }


    /**
     * Update Perfect Scroll
     */
    private addPerfectScrollbar() {
        //setTimeout(() => {
        //    let flex = $('div[wj-part="root"]', this.flex.hostElement).get(0);
        //    if (flex) {
        //        Ps.initialize(flex);

        //        setTimeout(() => {
        //            Ps.update(flex);
        //            this.showLeftIconScroll = this.scrollUtils.canScrollToLeft;
        //            this.showRightIconScroll = this.scrollUtils.canScrollToRight;
        //        }, 200);
        //    }

        //    this.flex.rows.defaultSize = 200;
        //}, 500);
        //this.flex.rowHeaders.columns[0].width = 150;
        //this.flex.rowHeaders.rows[0].height = 200;
    }

    /**
     * Scroll to lelft or right
     * @param mode
     */
    scrollToPosition(mode) {
        this.scrollUtils.scrollToPosition(mode);
        setTimeout(() => {
            this.showLeftIconScroll = this.scrollUtils.canScrollToLeft;
            this.showRightIconScroll = this.scrollUtils.canScrollToRight;
        }, 600);
    }

    /**
     * Auto width of wijmo grid
     */
    private turnOnStartResizeMode() {
        //for (let i = 0; i < this.flex.columns.length; i++) {
        //    this.flex.columns[i].width = '*';
        //}
        if (this.api) {
            this.api.sizeColumnsToFit();
        }
        //this.showLeftIconScroll = this.scrollUtils.canScrollToLeft;
        //this.showRightIconScroll = this.scrollUtils.canScrollToRight;
    }

    /**
     * Build history customer datasource 
     */
    //public buildDataSource(customerHistories: Array<CustomerHistory>) {
    //    let data: any = {};
    //    this.dataSource.columns = [];
    //    this.dataSource.data = [];
    //    customerHistories.forEach((customerHistory: CustomerHistory) => {
    //        this.dataSource.columns.push({
    //            key: customerHistory.id,
    //            value: customerHistory.header,
    //            visible: customerHistory.isHidden ? false : true
    //        });
    //        data[customerHistory.id] = {
    //            body: customerHistory.body,
    //            footer: customerHistory.footer
    //        };
    //    });
    //    this.dataSource.data = [data];
    //}

    /**
     * buildAgGridDataSource
     * @param customerHistories
     */
    public buildAgGridDataSource(customerHistories: Array<CustomerHistory>) {
        if (!customerHistories) {
            this.gridOptions.columnDefs = [];
            this.gridOptions.rowData = [];
            return;
        }
        let data: any = {};
        const dataSource: IAgGridData = {
            rowData: [],
            columnDefs: []
        };

        dataSource.columnDefs.push({
            field: 'mailing',
            headerName: '',
            editable: false,
            hide: false,
            autoHeight: true,
            cellClass: 'text-center lock-pinned',
            pinned: "left",
            lockPinned: true,
            minWidth: 250,
            maxWidth: 250,
            suppressResize: true
        });
        data['mailing'] = 'Mailing';

        customerHistories.forEach((customerHistory: CustomerHistory) => {
            dataSource.columnDefs.push({
                field: customerHistory.id,
                headerName: '',
                editable: false,
                hide: customerHistory.isHidden,
                autoHeight: true,
                minWidth: 150,
                headerComponentFramework: TemplateHeaderCellRenderer,
                headerComponentParams: {
                    ngTemplate: this.headerCellTemplateRef,
                    customParam: customerHistory.header
                },
                cellRendererFramework: TemplateCellRenderer,
                cellRendererParams: {
                    ngTemplate: this.bodyCellTemplateRef,
                    customParam: {
                        body: customerHistory.body,
                        footer: customerHistory.footer
                    }                    
                }
            });
            data[customerHistory.id] = '';
        });
        dataSource.rowData = [data];
        this.gridOptions.columnDefs = dataSource.columnDefs;
        this.gridOptions.rowData = dataSource.rowData;

        setTimeout(() => {
            if (this.api) {
                this.api.sizeColumnsToFit();
            }
        });
    }

    /**
     * clearGridSelection
     **/
    public clearGridSelection() {
        if (this.api) {
            this.api.deselectAll();
            this.api.clearFocusedCell();
        }
        //if (this.flex) {
        //    this.flex.select(-1, -1);
        //}
    }
}
