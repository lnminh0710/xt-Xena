import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Renderer,
} from "@angular/core";
import { Router } from "@angular/router";
import { ModuleSearchDialogComponent } from "app/shared/components/form";
import {
    ControlGridModel,
    ControlGridColumnModel,
    ArticleOrder,
    EsSearchResult,
    FormOutputModel,
    ReturnRefundInvoiceNumberModel,
    SimpleTabModel,
    MessageModel,
    Module,
} from "app/models";
import toNumber from "lodash-es/toNumber";
import cloneDeep from "lodash-es/cloneDeep";
import toSafeInteger from "lodash-es/toSafeInteger";
import { Subscription } from "rxjs/Subscription";
import {
    ReturnRefundActions,
    CustomAction,
} from "app/state-management/store/actions";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import {
    AppErrorHandler,
    ModalService,
    SearchService,
    ArticleService,
    DomHandler,
} from "app/services";
import { Observable } from "rxjs/Observable";
import { MenuModuleId, MessageModal } from "app/app.constants";
import * as Ps from "perfect-scrollbar";
import { ArticleCampaignSearchComponent } from "./";
import { Uti } from "app/utilities";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
import * as returnRefundReducer from "app/state-management/store/reducer/return-refund";
import { BaseComponent } from "app/pages/private/base";

@Component({
    selector: "article-search",
    templateUrl: "./article-search.component.html",
    styleUrls: ["./article-search.component.scss"],
})
export class ArticleSearchComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public that: any;
    public module = new Module({
        idSettingsGUI: MenuModuleId.article,
    });
    public searchIndex = "article";
    articleNumber: string;
    quantity: number;
    dataSource: ControlGridModel;
    description: string;
    amount: number = 0;
    allArticlesChecked: boolean;
    mediaCode: string;

    @Input() parentInstance: any = null;
    @Input() articleGridId: string;
    @Input() articleCampaignSearchGridId: string;

    @Output() outputDataAction: EventEmitter<any> = new EventEmitter();

    @ViewChild("articleSearchDialog")
    articleSearchDialog: ModuleSearchDialogComponent;

    @ViewChild("articleCampaignSearch")
    articleCampaignSearch: ArticleCampaignSearchComponent;

    private articleOrdersState: Observable<Array<ArticleOrder>>;
    private articleOrdersStateSubscription: Subscription;
    private updatedLayoutHandlerTimer;
    private updatedLayoutHandlerInterval = 1000;
    private invoiceNewData: FormOutputModel;
    private invoiceNumberDataState: Observable<ReturnRefundInvoiceNumberModel>;
    private invoiceNumberDataStateSubscription: Subscription;
    private idCountrylanguage: string;
    private selectedSimpleTabState: Observable<SimpleTabModel>;
    private selectedSimpleTabStateSubscription: Subscription;
    private invoiceNewDataState: Observable<FormOutputModel>;
    private invoiceNewDataStateSubscription: Subscription;
    private resetAllSubscription: Subscription;

    constructor(
        private _eref: ElementRef,
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private returnRefundActions: ReturnRefundActions,
        private modalService: ModalService,
        private searchService: SearchService,
        private articleService: ArticleService,
        private renderer: Renderer,
        private dispatcher: ReducerManagerDispatcher,
        private domHandler: DomHandler,
        protected router: Router
    ) {
        super(router);
        this.that = this;

        this.articleOrdersState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).keepArticleOrders
        );
        this.invoiceNumberDataState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).invoiceNumberData
        );
        this.selectedSimpleTabState = store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedSimpleTab
        );
        this.invoiceNewDataState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).invoiceNewData
        );
    }

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.initEmptyDataForGrid();
        this.subscribeArticleOrdersState();
        this.subscribeResetAllState();
        this.subscribeInvoiceNumberDataState();
        this.subscribeSelectedSimpleTabState();
        this.subscribeInvoiceNewDataState();
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {}

    public makeContextMenu(data?: any) {
        if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
            return [];
        }
        return this.parentInstance.makeContextMenu(data);
    }

    /**
     * subscribeResetAllState
     */
    private subscribeResetAllState() {
        this.resetAllSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ReturnRefundActions.RESET_ALL_EDITABLE_FORM &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.reset();
                });
            });
    }

    /**
     * subscribeInvoiceNumberDataState
     */
    private subscribeInvoiceNumberDataState() {
        this.invoiceNumberDataStateSubscription =
            this.invoiceNumberDataState.subscribe(
                (data: ReturnRefundInvoiceNumberModel) => {
                    this.appErrorHandler.executeAction(() => {
                        if (data) {
                            this.mediaCode = data.mediaCode;
                            this.idCountrylanguage = data.idCountrylanguage;
                        }
                    });
                }
            );
    }

    /**
     * subscribeInvoiceNewDataState
     */
    private subscribeInvoiceNewDataState() {
        this.invoiceNewDataStateSubscription =
            this.invoiceNewDataState.subscribe((data: FormOutputModel) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        data &&
                        JSON.stringify(data) !=
                            JSON.stringify(this.invoiceNewData)
                    ) {
                        this.invoiceNewData = data;
                        this.updateInvoiceNewDataState();
                    }
                });
            });
    }

    /**
     * subscribeSelectedSimpleTabState
     */
    private subscribeSelectedSimpleTabState() {
        this.selectedSimpleTabStateSubscription =
            this.selectedSimpleTabState.subscribe(
                (selectedSimpleTabState: SimpleTabModel) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!selectedSimpleTabState) {
                            return;
                        }
                        setTimeout(() => {
                            let parent = this.domHandler.findParent(
                                this._eref.nativeElement,
                                "#" + selectedSimpleTabState.TabID
                            );
                            // If this is rendered under this SimpleTab, redraw grid when changing TAB.
                            // if (parent && parent.length) {
                            //     if (this.articleCampaignSearch && this.articleCampaignSearch.grid) {
                            //         this.articleCampaignSearch.grid.sizeColumnsToFit();
                            //     }
                            // }
                        });
                    });
                }
            );
    }

    /**
     * reset
     */
    reset() {
        this.clearFormAfterAddingArticle();
        this.initEmptyDataForGrid();
        if (
            this.dataSource &&
            this.dataSource.data &&
            this.dataSource.data.length
        ) {
            this.dataSource.data = [];
        }
        if (this.articleCampaignSearch) {
            this.articleCampaignSearch.reset();
        }
    }

    /**
     * subscribeArticleOrdersState
     */
    private subscribeArticleOrdersState() {
        this.articleOrdersStateSubscription = this.articleOrdersState.subscribe(
            (articleOrders: Array<ArticleOrder>) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !this.dataSource ||
                        !articleOrders ||
                        !articleOrders.length
                    )
                        return;

                    let data = this.dataSource.data;
                    articleOrders = articleOrders.filter((x) => !!x.keep);
                    // Add Keep Orders into current grid
                    if (!articleOrders || !articleOrders.length) return;
                    for (const item of articleOrders) {
                        if (!item) return;
                        if (
                            Uti.existItemInArray(
                                data,
                                { ArticleNr: item.articleNumber },
                                "ArticleNr"
                            )
                        )
                            continue;
                        // Uti.removeItemInArray(data, {'ArticleNr': item.articleNumber}, 'ArticleNr');
                        data.push({
                            Id: Uti.guid(),
                            ArticleNr: item.articleNumber,
                            ArticleNameShort: item.description,
                            Quantity: toSafeInteger(item.quantity),
                            SalesPrice: toSafeInteger(item.price),
                            TotalPrice:
                                toSafeInteger(item.price) *
                                toSafeInteger(item.quantity),
                            Keep: true,
                        });
                    }
                    // Check & remove invalid Keep Orders from current grid.
                    data = data.filter((p) => {
                        if (!p.Keep) {
                            return true;
                        } else {
                            if (!articleOrders) {
                                return false;
                            }
                            let rs = articleOrders.filter(
                                (o) => o && o.articleNumber == p.ArticleNr
                            );
                            return rs.length > 0;
                        }
                    });

                    this.dataSource = {
                        columns: this.dataSource.columns,
                        data: data,
                    };
                    this.updateInvoiceNewDataState();
                });
            }
        );
    }

    /**
     * searchArticle
     */
    searchArticle() {
        this.articleSearchDialog.open();
    }

    /**
     * onArticleSelect
     * @param data
     */
    onArticleSelect(data) {
        this.articleNumber = data["articleNr"];
        this.description = data["articleNameShort"];
    }

    /**
     * Add new article to grid
     */
    addArticle() {
        if (!this.articleNumber) {
            this.modalService.warningMessage([
                { key: "Modal_Message__Article_Search_Input_Article_Number" },
            ]);
            return;
        }
        if (!this.quantity) {
            this.modalService.warningMessage([
                { key: "Modal_Message__Article_Search_Input_Quantity" },
            ]);
            return;
        }

        if (!this.allArticlesChecked) {
            if (
                this.articleCampaignSearch &&
                this.articleCampaignSearch.dataSource &&
                this.articleCampaignSearch.dataSource.data &&
                this.articleCampaignSearch.dataSource.data.length
            ) {
                const rs = this.articleCampaignSearch.dataSource.data.filter(
                    (p) => p.ArticleNr == this.articleNumber
                );
                if (rs.length) {
                    this.addArticleFromArticleCampaign(rs[0], this.quantity);
                } else {
                    this.modalService.warningMessage([
                        { key: "Modal_Message__Article_Number" },
                        { key: " " + this.articleNumber + " " },
                        { key: "Modal_Message__Does_Not_Exists" },
                    ]);
                }
            } else {
                this.modalService.warningMessage([
                    { key: "Modal_Message__Article_Number" },
                    { key: " " + this.articleNumber + " " },
                    { key: "Modal_Message__Does_Not_Exists" },
                ]);
            }
        } else {
            if (this.idCountrylanguage) {
                this.searchAllArticleCampaign(
                    this.articleNumber,
                    this.idCountrylanguage
                );
            }
        }
    }

    /**
     * updateInvoiceNewDataState
     */
    private updateInvoiceNewDataState() {
        let totalAmount = 0;
        if (
            this.invoiceNewData &&
            this.invoiceNewData.formValue &&
            this.dataSource &&
            this.dataSource.data
        ) {
            this.dataSource.data.forEach((item) => {
                totalAmount += item.TotalPrice;
            });
            this.invoiceNewData.formValue["totalAmount"] = totalAmount;
            // this.store.dispatch(this.returnRefundActions.requestUpdateInvoiceNewData(cloneDeep(this.invoiceNewData), this.ofModule));
        }
        this.outputDataAction.emit({
            totalAmount: totalAmount,
            gridData: this.dataSource.data,
        });
    }

    /**
     * clearFormAfterAddingArticle
     */
    private clearFormAfterAddingArticle() {
        this.articleNumber = null;
        this.quantity = null;
    }

    /**
     * initData
     */
    private initEmptyDataForGrid() {
        this.dataSource = {
            columns: [
                {
                    title: "Id",
                    data: "Id",
                    visible: false,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: "1",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Article Nr",
                    data: "ArticleNr",
                    visible: true,
                    readOnly: true,
                    setting: {
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
                    title: "Description",
                    data: "ArticleNameShort",
                    visible: true,
                    readOnly: true,
                    setting: {
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
                    title: "Qty",
                    data: "Quantity",
                    visible: true,
                    readOnly: false,
                    setting: {
                        DataLength: "0",
                        Setting: [
                            {
                                DisplayField: {
                                    ReadOnly: "1",
                                },
                                ControlType: {
                                    Type: "Numeric",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Price",
                    data: "SalesPrice",
                    visible: true,
                    readOnly: false,
                    setting: {
                        DataLength: "0",
                        DataType: "money",
                        Setting: [
                            {
                                DisplayField: {
                                    ReadOnly: "1",
                                },
                                ControlType: {
                                    Type: "Numeric",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Total Price",
                    data: "TotalPrice",
                    visible: true,
                    readOnly: false,
                    setting: {
                        DataLength: "0",
                        DataType: "money",
                        Setting: [
                            {
                                DisplayField: {
                                    ReadOnly: "1",
                                },
                                ControlType: {
                                    Type: "Numeric",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Keep",
                    data: "Keep",
                    visible: true,
                    readOnly: true,
                    setting: {
                        DataLength: "0",
                        DataType: "bit",
                        Setting: [
                            {
                                DisplayField: {
                                    ReadOnly: "1",
                                },
                                ControlType: {
                                    Type: "Checkbox",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "",
                    data: "Delete",
                    visible: true,
                    readOnly: true,
                    setting: {
                        DataLength: "0",
                        Setting: [
                            {
                                DisplayField: {
                                    ReadOnly: "1",
                                },
                            },
                        ],
                    },
                },
            ],
            data: [],
        };
    }

    /**
     * deleteArticle
     */
    deleteClickHandler($event) {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "Modal_Message__Are_You_Sure_To_Delete_This_Item" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    let data = cloneDeep(this.dataSource.data);
                    data = data.filter((x) => x.Id != $event.Id);
                    this.dataSource = {
                        columns: this.dataSource.columns,
                        data: data,
                    };
                    this.updateInvoiceNewDataState();
                },
            })
        );
    }

    /**
     * onCellQuantityChanged
     * @param cell
     * @param item
     */
    onCellQuantityChanged(cell, item) {
        console.log(cell);
    }

    /**
     * campaignArticleSelected
     * @param data
     */
    campaignArticleSelected(item) {
        this.addArticleFromArticleCampaign(item);
    }

    /**
     * addArticleFromArticleCampaign
     * @param item
     */
    private addArticleFromArticleCampaign(item, quantity?: number) {
        if (Uti.existItemInArray(this.dataSource.data, item, "ArticleNr")) {
            this.modalService.warningMessage([
                { key: "Modal_Message__Article_Number" },
                { key: item["ArticleNr"] },
                { key: "Modal_Message__Is_Exists" },
            ]);
            return;
        }
        let data = cloneDeep(this.dataSource.data);
        if (data) {
            item.Quantity = quantity ? quantity : item.Quantity;
            data.push({
                Id: Uti.guid(),
                ArticleNr: item.ArticleNr,
                ArticleNameShort: item.ArticleNameShort,
                Quantity: item.Quantity,
                SalesPrice: item.SalesPrice,
                TotalPrice: toNumber(item.SalesPrice) * toNumber(item.Quantity),
                Keep: true,
            });
        }
        this.dataSource = { columns: this.dataSource.columns, data: data };
        this.updateInvoiceNewDataState();
    }

    /**
     * searchAllArticleCampaign
     * @param articleNumber
     * @param idCountrylanguage
     */
    private searchAllArticleCampaign(articleNumber, idCountrylanguage) {
        this.articleService
            .searchArticleByNr("", articleNumber, idCountrylanguage)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !response ||
                        !response.item.data ||
                        !response.item.data.length ||
                        !response.item.data[1] ||
                        !response.item.data[1].length
                    ) {
                        this.modalService.warningMessage([
                            { key: "Modal_Message__Article_Number" },
                            { key: this.articleNumber },
                            { key: "Modal_Message__Does_Not_Exists" },
                        ]);
                        return;
                    }
                    this.addArticleFromArticleCampaign(
                        response.item.data[1][0],
                        this.quantity
                    );
                });
            });
    }

    /**
     * Focus to control
     * @param elm
     */
    focusControl(element) {
        if (element) {
            this.renderer.invokeElementMethod(element, "focus");
        }
    }
}
