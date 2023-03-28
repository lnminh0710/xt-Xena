import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
} from "@angular/core";
import { Uti } from "app/utilities";
import { SearchService, DatatableService, AppErrorHandler } from "app/services";
import { Module } from "app/models";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";

@Component({
    selector: "gs-customer-detail",
    styleUrls: ["./gs-customer-detail.component.scss"],
    templateUrl: "./gs-customer-detail.component.html",
})
export class GlobalSearchCustomerDetailComponent implements OnInit, OnDestroy {
    public pageIndex: number = 1;
    public pageSize: number = 100;
    public dataResult: any;

    constructor(
        private searchService: SearchService,
        private appErrorHandler: AppErrorHandler,
        private datatableService: DatatableService,
        private _changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef
    ) {}

    public ngOnInit() {}

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    @Input() renderCallback: Function;
    @Input() searchIndex: string; // Used for elasticsearch
    @Input() moduleLocal: Module;
    @Input() globalProperties: any;
    @Input() parentInstance: any = null;
    @Input() isDeselectAllRow: boolean = null;
    @Input() gridId: string;
    @Input() keyword: string;

    private _itemData;
    @Input() set itemData(val) {
        this._itemData = val;
        this.getData(val);
    }
    get itemData() {
        return this._itemData;
    }

    private parentColumnSettings: any;
    @Input() set changeColumnLayoutMasterDetail(val) {
        if (val && this.agGridComponent) {
            this.parentColumnSettings = val.columnsLayoutSettings;
            this.agGridComponent.updateColumnStateForDetailGrid(
                val.columnsLayoutSettings
            );
        }
    }

    @ViewChild(XnAgGridComponent) private agGridComponent: XnAgGridComponent;

    public getData(dataInfo) {
        //console.log(dataInfo);
        if (!dataInfo || !dataInfo.MatchingGroup) {
            //reset grid
            this.calculateGridHeight();
            return;
        }
        //const keyword = '*';
        const fieldName: Array<string> = ["matchingGroup"];
        const fieldValue: Array<string> = [dataInfo.MatchingGroup];

        const searchIndex =
            this.searchIndex == "customer" ? "customerfoot" : this.searchIndex;
        this.searchService
            .search(
                searchIndex,
                this.keyword,
                this.moduleLocal.idSettingsGUI,
                this.pageIndex,
                this.pageSize,
                null,
                fieldName,
                fieldValue,
                true
            )
            .finally(() => {
                this.changeDetectorRef();
                if (this.parentColumnSettings) {
                    setTimeout(() => {
                        this.agGridComponent.updateColumnStateForDetailGrid(
                            this.parentColumnSettings
                        );
                    }, 500);
                }
            })
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        response = response.item;
                        this.dataResult =
                            this.datatableService.buildDataSourceFromEsSearchResult(
                                response,
                                1
                            );

                        if (this.dataResult.data) {
                            this.dataResult.data = this.dataResult.data.filter(
                                (n) => n.IdPerson != dataInfo.IdPerson
                            );
                        }

                        this.calculateGridHeight();
                    });
                },
                (err) => {
                    this.resetGrid();
                    //show error
                    console.log(err);
                }
            );
    }

    private changeDetectorRef() {
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        }, 300);
    }

    private resetGrid() {
        //reset data on grid
        this.dataResult = {
            data: [],
            columns:
                this.dataResult && this.dataResult.columns
                    ? this.dataResult.columns
                    : [],
            totalResults: 0,
        };
    }

    private calculateGridHeight() {
        if (!this.renderCallback) return;

        setTimeout(() => {
            let height = 1;
            if (
                this.dataResult &&
                this.dataResult.data &&
                this.dataResult.data.length
            ) {
                height = this.dataResult.data.length * 28 + 3; //total item * height of one row
            }

            $(this.elementRef.nativeElement)
                .parent()
                .parent()
                .css("height", height + "px");

            this.renderCallback();
        });
    }

    // #region Event Grid: Click, Double Click, [Grid mouse up/down]
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() rowDoubleClicked: EventEmitter<any> = new EventEmitter();
    @Output() mousedown: EventEmitter<any> = new EventEmitter();
    @Output() mouseup: EventEmitter<any> = new EventEmitter();
    @Output() keydown: EventEmitter<any> = new EventEmitter();
    @Output() foundInOnIconClick: EventEmitter<any> = new EventEmitter();

    public gridRowClick($event) {
        this.rowClick.emit($event);
    }
    public gridRowDoubleClicked($event) {
        this.rowDoubleClicked.emit($event);
    }
    public gridMousedown($event) {
        this.mousedown.emit($event);
    }
    public gridMouseup($event) {
        this.mouseup.emit($event);
    }
    public gridKeydown($event) {
        this.keydown.emit($event);
    }
    public gridFoundInOnIconClick($event) {
        this.foundInOnIconClick.emit($event);
    }

    public makeContextMenu(data?: any) {
        if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
            return [];
        }
        return this.parentInstance.makeContextMenu(data);
    }
    // #endregion [Grid mouse up/down]
}
