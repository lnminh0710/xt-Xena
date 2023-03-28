import {
    Component,
    Input,
    Output,
    OnInit,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    ViewChild,
} from "@angular/core";

import { ControlGridModel, ApiResultResponse } from "app/models";
import {
    AppErrorHandler,
    SearchService,
    DatatableService,
    CampaignService,
    ModalService,
} from "app/services";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { WijmoGridComponent } from "app/shared/components/wijmo";
import { Uti } from "app/utilities";
import camelCase from "lodash-es/camelCase";
import cloneDeep from "lodash-es/cloneDeep";

@Component({
    selector: "purchase-form-article",
    styleUrls: ["./purchase-form-article.component.scss"],
    templateUrl: "./purchase-form-article.component.html",
})
export class PurchaseFormArticleComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() reloadData: EventEmitter<any> = new EventEmitter();

    @ViewChild("compositionGridLeft")
    private compositionGridLeft: WijmoGridComponent;
    @ViewChild("compositionGridRight")
    private compositionGridRight: WijmoGridComponent;

    private selectItem: any;
    private selectItems: Array<any> = [];

    public compositionDataLeft: ControlGridModel;
    public compositionDataRight: ControlGridModel;

    private articlesSubscription: Subscription;
    private searchArticleSubscription: Subscription;

    constructor(
        private campaignService: CampaignService,
        private appErrorHandler: AppErrorHandler,
        private searchService: SearchService,
        private datatableService: DatatableService
    ) {}

    public ngOnInit() {
        this.initData();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    private initData(): void {
        this.compositionDataLeft = {
            data: [],
            columns: [],
        };
        this.compositionDataRight = {
            data: [],
            columns: [],
        };
        this.getArticle();
    }

    private getArticle(): void {
        this.articlesSubscription = this.campaignService
            .getCampaignArticle(null)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    let rawData =
                        this.datatableService.formatDataTableFromRawData(
                            response.item.data
                        );
                    let dataSource =
                        this.datatableService.buildDataSource(rawData);
                    this.compositionDataLeft = null;
                    this.compositionDataRight = null;
                    this.compositionDataLeft = dataSource;
                    this.compositionDataRight = dataSource;
                });
            });
    }

    private onSearchArticleComplete(response: ApiResultResponse): void {
        const results: Array<any> = response.item.results;
        const notExistColumns = [
            "articlemanufacturersnr",
            "idsalescampaignarticle",
            "quantityset",
            "idsalescampaignwizard",
        ];
        const newData: Array<any> = [];
        for (const res of results) {
            const dataObj: any = {};
            for (const col of this.compositionDataLeft.columns) {
                if (
                    notExistColumns.indexOf(col.data.toString().toLowerCase()) >
                    -1
                ) {
                    dataObj[col.data] =
                        col.data.substring(0, 2) === "id"
                            ? Uti.getTempId()
                            : "";
                } else {
                    dataObj[col.data] = res[camelCase(col.data)];
                }
            }
            newData.push(dataObj);
        }

        this.compositionDataLeft.data = newData;
        let leftData = {
            data: newData,
            columns: this.compositionDataLeft.columns,
        };
        leftData = this.datatableService.appendRowId(leftData);
        this.compositionDataLeft = leftData;
        this.compositionGridLeft.isSearching = false;
    }

    private addArticleItem(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        controlGridModel.data.push(cloneDeep(this.selectItem));
        return Uti.cloneDataForGridItems(controlGridModel);
    }
    public removeArticleItem(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        Uti.removeItemInArray(
            controlGridModel.data,
            this.selectItem,
            "IdArticle"
        );
        this.resetSelectedItem();
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private resetSelectedItem() {
        this.selectItems = [];
        this.selectItem = {};
    }

    private resetRowIdForGrid() {
        this.compositionDataLeft = this.datatableService.appendRowId(
            this.compositionDataLeft
        );
        this.compositionDataRight = this.datatableService.appendRowId(
            this.compositionDataRight
        );
        //this.ref.detectChanges();
    }

    public addComposition(event?: any): void {
        this.compositionDataRight = this.addArticleItem(
            this.compositionDataRight
        );
        this.compositionDataLeft = this.removeArticleItem(
            this.compositionDataLeft
        );
        this.resetRowIdForGrid();
    }

    private addAllArticleItem(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        controlGridModel.data = controlGridModel.data.concat(
            cloneDeep(this.selectItems)
        );
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private removeAllArticleItem(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        for (const item of this.selectItems) {
            Uti.removeItemInArray(controlGridModel.data, item, "IdArticle");
        }
        this.resetSelectedItem();
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    public addAllComposition(event?: any): void {
        this.compositionDataRight = this.addAllArticleItem(
            this.compositionDataRight
        );
        this.compositionDataLeft = this.removeAllArticleItem(
            this.compositionDataLeft
        );
        this.resetRowIdForGrid();
    }

    public removeComposition(event?: any): void {
        this.compositionDataLeft = this.addArticleItem(
            this.compositionDataLeft
        );
        this.compositionDataRight = this.removeArticleItem(
            this.compositionDataRight
        );
        this.resetRowIdForGrid();
    }

    public removeAllComposition(event?: any): void {
        this.compositionDataLeft = this.addAllArticleItem(
            this.compositionDataLeft
        );
        this.compositionDataRight = this.removeAllArticleItem(
            this.compositionDataRight
        );
        this.resetRowIdForGrid();
    }

    public compositionDataLeftRowClick($event?: any): void {}

    public compositionDataLeftRowDoubleClick($event?: any): void {}

    public compositionDataRightRowClick($event?: any): void {}

    public compositionDataRightRowDoubleClick($event: any): void {}

    public onLeftTableSearch($event?: any): void {
        this.searchArticleSubscription = this.searchService
            .search("article", $event, null, 1, 9999)
            .subscribe(this.onSearchArticleComplete);
    }
}
