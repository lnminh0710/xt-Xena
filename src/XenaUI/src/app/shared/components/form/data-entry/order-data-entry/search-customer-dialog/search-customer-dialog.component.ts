import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewChild,
} from "@angular/core";
import { Configuration } from "app/app.constants";
import { EsSearchResult } from "app/models";

import { DatatableService, SearchService, AppErrorHandler } from "app/services";
import { IPageChangedEvent } from "app/shared/components/xn-pager/xn-pagination.component";
import { WijmoGridComponent } from "app/shared/components/wijmo";
import isNil from "lodash-es/isNil";
import { Subscription } from "rxjs/Subscription";
import { Uti } from "app/utilities";

@Component({
    selector: "search-customer-dialog",
    styleUrls: ["./search-customer-dialog.component.scss"],
    templateUrl: "./search-customer-dialog.component.html",
})
export class SearchCustomerDialogComponent implements OnInit, OnDestroy {
    @Input() searchText: string;
    @Output() selectedData: EventEmitter<any> = new EventEmitter();

    public showDialog = false;
    public dataSourceTable: any;
    private selectedRow: any;
    private COLUMN_SETTING_INDEX = Configuration.pageIndex;
    private pageIndex = Configuration.pageIndex;
    private pageSize = Configuration.pageSize;
    public keyword = "";
    private searchServiceSubscription: Subscription;

    @ViewChild("wjgridCustomerSearching") wjCustSearching: WijmoGridComponent;

    constructor(
        private datatableService: DatatableService,
        private consts: Configuration,
        private searchService: SearchService,
        private appErrorHandler: AppErrorHandler
    ) {}

    ngOnInit() {}

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onTableSearch(keyword: any) {
        this.pageIndex = 1;
        this.search(keyword);
    }

    public customerTableRowClick(data) {
        this.selectedRow = data;
    }

    public onRowDoubleClick(data) {
        this.selectedRow = data;
        this.onClose();
    }

    public onClose() {
        this.selectedData.emit(this.selectedRow);
        this.close();
    }

    public onCancel() {
        this.close();
    }

    public open() {
        this.showDialog = true;
        if (this.searchText === this.keyword) return;

        if (this.dataSourceTable && this.dataSourceTable.columns) {
            this.dataSourceTable = Object.assign({}, this.dataSourceTable, {
                data: [],
                totalResults: 0,
            });
        }
        if (this.wjCustSearching) {
            if (!this.searchText || !this.searchText.length) {
                this.wjCustSearching.doSearch("");
                this.wjCustSearching.isSearching = false;
            } else {
                this.wjCustSearching.doSearch(this.searchText);
            }
        } else {
            if (!this.searchText || !this.searchText.length) this.search("");
            else {
                this.search(this.searchText);
            }
        }
    }

    public close() {
        this.showDialog = false;
    }

    public onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        this.search(null);
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber;
    }

    private buildDatatable(response: EsSearchResult) {
        if (!response) return;

        this.dataSourceTable =
            this.datatableService.buildDataSourceFromEsSearchResult(
                response,
                this.COLUMN_SETTING_INDEX
            );
        setTimeout(() => {
            if (this.wjCustSearching) {
                this.wjCustSearching.doSearch(this.keyword);
            }
            this.wjCustSearching.isSearching = false;
        }, 300);
    }

    private search(keyword) {
        if (keyword && keyword === this.keyword) return;

        if (isNil(keyword)) {
            if (this.keyword.length > 0) keyword = this.keyword;
        } else {
            this.keyword = keyword;
        }

        this.searchServiceSubscription = this.searchService
            .search("customer", keyword, 2, this.pageIndex, this.pageSize)
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.buildDatatable(response.item);
                });
            });
    }
}
