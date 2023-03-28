import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
    ArticleService,
    AppErrorHandler,
    SearchService,
    DatatableService,
    PropertyPanelService,
    ModalService,
} from "app/services";
import {
    ControlGridModel,
    EsSearchResult,
    ApiResultResponse,
    MessageModel,
} from "app/models";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { ArticleSetCompositionFakeData } from "./article-set-composition-form.fakedata";
import reject from "lodash-es/reject";
import cloneDeep from "lodash-es/cloneDeep";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Uti } from "app/utilities";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import {
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { Configuration } from "app/app.constants";
import { IPageChangedEvent } from "app/shared/components/xn-pager/xn-pagination.component";

@Component({
    selector: "app-article-set-composition-form",
    styleUrls: ["./article-set-composition-form.component.scss"],
    templateUrl: "./article-set-composition-form.component.html",
})
export class ArticleSetCompositionFormComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    public isRenderForm = false;
    public globalNumberFormat: string = "";
    public showDialog = false;
    public compositionModel: any = { quantity: "" };
    public isContinueClicked = false;
    public quantityValid = true;
    public pageSize: number = Configuration.pageSize;
    public globalProps: any[] = [];
    public rowLeftGrouping: boolean;
    public rowRightGrouping: boolean;

    private compositionDataLeft: ControlGridModel;
    private compositionDataRight: ControlGridModel;
    private currentCompositionDataRight: ControlGridModel;
    private formValid: boolean;
    private selectLeftItem: any = null;
    private selectRightItem: any = null;
    private isLeftSelect = false;
    private isRightSelect = false;
    private selectItems: any = [];
    private fakeData: ArticleSetCompositionFakeData =
        new ArticleSetCompositionFakeData();
    private articleId: any;
    private currentArticleNumber: any;
    private addMultiItem = false;
    private articleSetCompositionForm: FormGroup;
    private cachedRemoveItemsFromRight: any[] = [];
    private cachedHasNumberImtesOfLeft: any = {};
    private pageIndex: number = Configuration.pageIndex;
    private keyword: string = "*";
    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private articleServiceSubscription: Subscription;
    private searchServiceSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private outputModel: {
        submitResult?: any;
        formValue: any;
        isValid?: boolean;
        isDirty?: boolean;
        returnID?: string;
    };

    @ViewChild("compositionGridLeft")
    private compositionGridLeft: XnAgGridComponent;
    @ViewChild("compositionGridRight")
    private compositionGridRight: XnAgGridComponent;

    @Input() set globalProperties(data: any[]) {
        this.execGlobalProperties(data);
    }
    @Input() compositionGridLeftId: string;
    @Input() compositionGridRightId: string;
    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private articleService: ArticleService,
        private ref: ChangeDetectorRef,
        private appErrorHandler: AppErrorHandler,
        private searchService: SearchService,
        private propertyPanelService: PropertyPanelService,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        private modalService: ModalService,
        private toasterService: ToasterService,
        protected router: Router
    ) {
        super(router);

        this.selectedEntityState = this.store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.onSearchComplete = this.onSearchComplete.bind(this);
    }

    public ngOnInit() {
        this.subcribtion();
        this.initData();
    }
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public handleRowLeftGrouping(data) {
        this.rowLeftGrouping = data;
    }

    public handleRowRightGrouping(data) {
        this.rowRightGrouping = data;
    }

    public compositionDataLeftRowClick($event: any) {
        this.selectLeftItem = this.setItemSelectedWhenClick(
            this.compositionDataLeft,
            $event
        );
        this.setIsSelectGrid();
    }
    public compositionDataRightRowClick($event: any) {
        this.selectRightItem = this.setItemSelectedWhenClick(
            this.compositionDataRight,
            $event
        );
        this.setIsSelectGrid();
    }
    public compositionDataLeftRowDoubleClick($event: any) {
        this.selectLeftItem = this.setItemSelectedWhenDoubleClick(
            this.compositionDataLeft,
            $event
        );
        this.removeItemFromCachedRemoveItemsFromRight();
        this.setIsSelectGrid();
        this.addComposition();
    }
    public compositionDataRightRowDoubleClick($event: any) {
        this.selectRightItem = this.setItemSelectedWhenDoubleClick(
            this.compositionDataRight,
            $event
        );
        // this.addToCachedRemoveItemsFromRight(this.selectRightItem);
        this.setIsSelectGrid();
        this.removeComposition($event);
    }

    public addComposition(event?: any) {
        if (!this.isLeftSelect) {
            return;
        }
        this.compositionGridLeft.stopEditing();
        this.showDialogConfimation(
            this.addCompositionAfterConfirmation.bind(this)
        );
    }

    // public addAllComposition(event?: any) {
    //     this.selectItems = [];

    //     for (var i = 0; i < this.compositionDataLeft.data.length; i++) {
    //         const item = this.compositionDataLeft.data[i];
    //         if (item.quantityItems) this.selectItems.push(item);
    //     }
    //     if (this.selectItems.length > 0) {
    //         this.compositionDataRight.data = [...this.compositionDataRight.data, ...this.selectItems];
    //         this.compositionDataRight = Uti.cloneDataForGridItems(this.compositionDataRight);

    //         for (var i = 0; i < this.selectItems.length; i++) {
    //             this.compositionDataLeft.data = reject(this.compositionDataLeft.data, { 'DT_RowId': this.selectItems[i].DT_RowId });
    //         }

    //         this.compositionDataLeft = Uti.cloneDataForGridItems(this.compositionDataLeft);
    //         this.isLeftSelect = false;
    //         this.selectLeftItem = null;
    //     }
    // }

    public addCompositionAfterConfirmation() {
        if (!this.isLeftSelect) {
            return;
        }
        let currentSeletedItemLeft = this.selectLeftItem;
        currentSeletedItemLeft = this.getRightItem(currentSeletedItemLeft);
        this.compositionDataRight = this.addItemComposition(
            this.compositionDataRight,
            currentSeletedItemLeft
        );
        this.compositionDataLeft = this.removeItemComposition(
            this.compositionDataLeft,
            this.selectLeftItem,
            this.compositionGridLeft
        );
        this.isLeftSelect = false;
        this.removeItemFromCachedRemoveItemsFromRight();
        this.selectLeftItem = null;
        this.resetRowIdForGrid();
        this.resetColumnsHeader(this.compositionGridLeft);
        this.resetColumnsHeader(this.compositionGridRight);
    }

    public removeComposition($event: any) {
        if (!this.isRightSelect) {
            return;
        }
        this.compositionGridRight.stopEditing();
        // this.compositionDataLeft = this.addItemComposition(this.compositionDataLeft, this.selectRightItem);
        this.addToCachedRemoveItemsFromRight(this.selectRightItem);
        this.compositionDataRight = this.removeItemComposition(
            this.compositionDataRight,
            this.selectRightItem,
            this.compositionGridRight
        );
        this.isRightSelect = false;
        this.selectRightItem = null;
        this.resetRowIdForGrid();
        this.resetColumnsHeader(this.compositionGridRight);
        this.search();
    }

    public removeAllComposition($event: any) {
        if (!this.compositionDataRight.data.length) return;
        this.compositionGridRight.stopEditing();
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Are_You_Sure_You_Want_To_Remove_All_Article",
                    },
                    { key: "</p>" },
                ],
                callBack1: () => {
                    this.removeAllArticleAfterConfirm();
                },
            })
        );
    }

    public onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        this.search();
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber;
    }

    public onLeftTableSearch(keyword) {
        this.pageIndex = 1;
        this.keyword = keyword;
        this.search();
    }

    public quantityChange($event: any) {
        setTimeout(() => {
            this.quantityValid = this.compositionModel.quantity <= 9999999;
        });
    }

    public continueSetQuantity() {
        this.isContinueClicked = true;
        if (!this.compositionModel.quantity) {
            this.focusQuantityTextbox();
            this.ref.detectChanges();
            return;
        }
        if (this.compositionModel.quantity > 9999999) {
            this.quantityValid = false;
            this.focusQuantityTextbox();
            return;
        }
        this.quantityValid = true;
        this.selectLeftItem.quantityItems = this.compositionModel.quantity;
        if (this.addMultiItem) {
            this.addAllCompositionAfterConfirmation();
        } else {
            this.addCompositionAfterConfirmation();
        }
        this.addMultiItem = false;
        this.showDialog = false;
        this.isContinueClicked = false;
        this.ref.detectChanges();
    }

    public cancelSetQuantity() {
        this.compositionModel.quantity = "";
        this.showDialog = false;
        this.isContinueClicked = false;
        this.quantityValid = true;
        this.ref.detectChanges();
    }

    public onSubmit(event?: any) {
        this.articleSetCompositionForm["submitted"] = true;
        try {
            if (!this.formValid) {
                this.outputModel = {
                    submitResult: false,
                    formValue: {
                        left: this.compositionDataLeft,
                        right: this.compositionDataRight,
                    },
                    isValid: true,
                    isDirty: false,
                };
                this.outputData.emit(this.outputModel);
                //this.toasterService.pop('warning', 'Validation Fail', 'There are some fields do not pass validation.');
                return false;
            }
            const updateData = [
                ...this.makeInsertData(),
                ...this.makeUpdateData(),
                ...this.makeDeleteData(),
            ];
            if (!updateData || !updateData.length) {
                this.formValid = false;
                this.outputModel = {
                    submitResult: null,
                    formValue: {
                        left: this.compositionDataLeft,
                        right: this.compositionDataRight,
                    },
                    isValid: false,
                    isDirty: false,
                };
                this.outputData.emit(this.outputModel);
                this.toasterService.pop(
                    "warning",
                    "Validation Fail",
                    "No entry data for saving!"
                );
                return false;
            }
            this.udpateArticleSetComposition(updateData);
        } catch (ex) {
            return false;
        }
        return false;
    }

    public onCompositionGridRightEnd() {
        this.setFormDirty();
    }

    public onCompositionGridLeftEnd() {
        this.cachedHasNumberImtesOfLeft = {};
        for (let item of this.compositionDataLeft.data) {
            if (!item.quantityItems) continue;
            this.cachedHasNumberImtesOfLeft[item.idArticleItems.toString()] =
                item.quantityItems;
        }
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/
    /********************************************************************************************/

    private addMultilItemToCache() {
        for (let item of this.compositionDataRight.data) {
            this.addToCachedRemoveItemsFromRight(item);
        }
    }

    private addToCachedRemoveItemsFromRight(addItem: any) {
        let isExisted: boolean = false;
        for (let item of this.cachedRemoveItemsFromRight) {
            if (item.articleNr !== addItem.articleNr) continue;
            item.quantityItems = addItem.quantityItems;
            isExisted = true;
            break;
        }
        if (isExisted) return;
        this.cachedRemoveItemsFromRight.push(addItem);
    }

    private removeItemFromCachedRemoveItemsFromRight() {
        Uti.removeItemInArray(
            this.cachedRemoveItemsFromRight,
            this.selectLeftItem,
            "idArticleItems"
        );
    }

    private search() {
        if (
            this.modalService.isStopSearchWhenEmptySize(
                this.pageSize,
                this.pageIndex
            )
        )
            return;
        this.compositionGridLeft.isSearching = true;
        this.searchServiceSubscription = this.searchService
            .search(
                "article",
                this.keyword,
                null,
                this.pageIndex,
                this.pageSize
            )
            .finally(() => {
                this.ref.detectChanges();
            })
            .subscribe(this.onSearchComplete);
    }

    private removeAllArticleAfterConfirm() {
        // if (!this.isRightSelect) { return; }
        // this.compositionDataLeft = this.addAllItemComposition(this.compositionDataRight, this.compositionDataLeft);
        this.addMultilItemToCache();
        this.compositionDataRight = this.removeAllItemComposition(
            this.compositionDataRight
        );
        this.isRightSelect = false;
        this.selectRightItem = null;
        this.resetRowIdForGrid();
        this.resetColumnsHeader(this.compositionGridRight);
        this.search();
    }

    private setItemSelectedWhenClick(
        controlGridModel: ControlGridModel,
        event: any
    ) {
        return controlGridModel.data.find(
            (x) => x.DT_RowId === Uti.getValueFromArrayByKey(event, "DT_RowId")
        );
    }

    private setItemSelectedWhenDoubleClick(
        controlGridModel: ControlGridModel,
        event: any
    ) {
        return controlGridModel.data.find(
            (x) => x.DT_RowId === Uti.getValueFromArrayByKey(event, "DT_RowId")
        );
    }

    private resetRowIdForGrid() {
        this.compositionDataLeft = this.datatableService.appendRowId(
            this.compositionDataLeft
        );
        this.compositionDataRight = this.datatableService.appendRowId(
            this.compositionDataRight
        );
        this.ref.detectChanges();
    }

    private addItemComposition(
        controlGridModel: ControlGridModel,
        selectedItem: any
    ): ControlGridModel {
        controlGridModel.data.push(cloneDeep(selectedItem));
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private addAllItemComposition(
        source: ControlGridModel,
        dest: ControlGridModel
    ): ControlGridModel {
        dest.data = dest.data.concat(cloneDeep(source.data));
        return Uti.cloneDataForGridItems(dest);
    }

    private removeItemComposition(
        controlGridModel: ControlGridModel,
        selectedItem: any,
        gridComponent: XnAgGridComponent
    ): ControlGridModel {
        Uti.removeItemInArray(
            controlGridModel.data,
            selectedItem,
            "idArticleItems"
        );
        this.resetSelectedItem();
        // gridComponent.selectCell(-1, -1);
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private removeAllItemComposition(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        controlGridModel.data = [];
        this.resetSelectedItem();
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private resetSelectedItem() {
        this.selectItems = [];
        this.setFormDirty();
    }

    private setFormDirty() {
        this.formValid = true;
        this.setOutputData(null, {
            submitResult: null,
            formValue: {
                left: this.compositionDataLeft,
                right: this.compositionDataRight,
            },
            isValid: true,
            isDirty: true,
            returnID: null,
        });
    }

    private udpateArticleSetComposition(updateData: any) {
        this.articleServiceSubscription = this.articleService
            .updateArticleSetComposition(updateData)
            .subscribe(
                (data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false, {
                            submitResult: true,
                            formValue: {
                                left: this.compositionDataLeft,
                                right: this.compositionDataRight,
                            },
                            isValid: true,
                            isDirty: false,
                            returnID: data.item.returnID,
                        });
                        this.currentCompositionDataRight = cloneDeep(
                            this.compositionDataRight
                        );
                        Uti.resetValueForForm(this.articleSetCompositionForm);
                    });
                },
                (err) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false);
                    });
                }
            );
    }

    private execGlobalProperties(data: any[]) {
        this.globalProps = data;
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                data
            );
    }

    private initData() {
        this.createForm();
        this.compositionDataLeft = {
            data: [],
            columns: [],
        };
        this.getArticleSetComposition();
        this.articleSetCompositionForm["submitted"] = false;
        this.registerPressEnterForQuantityTextBox();
    }

    private subcribtion() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (selectedEntityState && selectedEntityState.id) {
                        this.articleId = selectedEntityState.id;
                        if (
                            !selectedEntityState.selectedParkedItem ||
                            !selectedEntityState.selectedParkedItem.articleNr
                        )
                            return;
                        this.currentArticleNumber =
                            selectedEntityState.selectedParkedItem.articleNr.value;
                    }
                });
            });

        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.onSubmit();
                });
            });
    }

    private createForm() {
        this.articleSetCompositionForm = this.formBuilder.group({});
    }

    private getArticleSetComposition() {
        this.articleServiceSubscription = this.articleService
            .getArticleSetComposition(this.articleId)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    this.isRenderForm = true;
                    this.compositionDataRight = {
                        data: this.checkEmptyCompositionData(data.item)
                            ? []
                            : this.mapGridData(data.item),
                        columns: this.mapGridColumns(data.item),
                    };
                    this.compositionDataLeft.columns = cloneDeep(
                        this.compositionDataRight.columns
                    );
                    this.currentCompositionDataRight = cloneDeep(
                        this.compositionDataRight
                    );
                    this.resetRowIdForGrid();
                    this.resetColumnsHeader(this.compositionGridLeft);
                    this.resetColumnsHeader(this.compositionGridRight);
                });
            });
    }

    private checkEmptyCompositionData(data: any) {
        return (
            !data ||
            !data.collectionData ||
            !data.collectionData.length ||
            !data.collectionData[0].idArticleItems.value
        );
    }

    private mapGridData(data: any) {
        return data.collectionData.map((x) => {
            return {
                idArticleItems: x.idArticleItems.value,
                articleNr: x.articleNr.value,
                articleNameShort: x.articleNameShort.value,
                isWarehouseControl: !!x.isWarehouseControl.value,
                quantityItems: x.quantityItems.value,
                idArticleSet: x.idArticleSet.value,
            };
        });
    }

    private mapGridColumns(data: any) {
        if (
            !data ||
            !data.columnSettings ||
            !data.columnSettings.idArticleItems
        ) {
            return this.fakeData.createGridColumns();
        }
        return [
            Uti.makeGridColumn(data, "idArticleItems", false),
            Uti.makeGridColumn(data, "articleNr", true),
            Uti.makeGridColumn(data, "articleNameShort", true),
            Uti.makeGridColumn(data, "isWarehouseControl", true, false, {
                type: "Checkbox",
            }),
            Uti.makeGridColumn(data, "quantityItems", true, true),
            Uti.makeGridColumn(data, "idArticleSet", false),
        ];
    }

    private setIsSelectGrid() {
        this.isLeftSelect = this.selectLeftItem != null;
        this.isRightSelect = this.selectRightItem != null;
    }

    private getRightItem(leftSelectItem: any): any {
        let cachedItem = this.currentCompositionDataRight.data.find(
            (x) => x.CampaignNr == leftSelectItem.CampaignNr
        );
        if (cachedItem && cachedItem.CampaignNr) {
            return cachedItem;
        }
        return leftSelectItem;
    }

    private addAllCompositionAfterConfirmation() {
        // if (!this.isLeftSelect) { return; }
        // this.compositionDataRight = this.addAllItemComposition(this.compositionDataRight);
        // this.compositionDataLeft = this.removeAllItemComposition(this.compositionDataLeft);
        // this.resetRowIdForGrid();
    }

    private setOutputData(submitResult: any, data?: any) {
        if (typeof data !== "undefined") {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: submitResult,
                formValue: this.articleSetCompositionForm.value,
                isValid: this.articleSetCompositionForm.valid,
                isDirty: this.articleSetCompositionForm.dirty,
            };
        }
        this.outputData.emit(this.outputModel);
    }

    private makeInsertData(): Array<any> {
        const insertData = this.compositionDataRight.data.filter(
            (x) =>
                !this.currentCompositionDataRight.data.find(
                    (y) => y.idArticleItems === x.idArticleItems
                )
        );
        if (!insertData || !insertData.length) {
            return [];
        }
        return this.mapUpdateData(insertData, 0);
    }

    private makeUpdateData(): Array<any> {
        let updateData: any[] = [];
        let currentItem: any;
        for (let item of this.compositionDataRight.data) {
            currentItem = this.currentCompositionDataRight.data.find(
                (x) => x.idArticleItems === item.idArticleItems
            );
            if (!currentItem || !currentItem.idArticleItems) continue;
            if (currentItem.quantityItems !== item.quantityItems) {
                updateData.push(item);
            }
        }
        return this.mapUpdateData(updateData, 1);
    }

    private makeDeleteData(): Array<any> {
        const deleteData = this.currentCompositionDataRight.data.filter(
            (x) =>
                !this.compositionDataRight.data.find(
                    (y) => y.idArticleItems === x.idArticleItems
                )
        );
        if (!deleteData || !deleteData.length) {
            return [];
        }
        return this.mapUpdateData(deleteData, 2);
    }

    // mode: is a number that will be set for data save mode
    //      0: insert
    //      1: update
    //      2: delete
    private mapUpdateData(mapData: Array<any>, mode: number): Array<any> {
        let updateItem: any;
        const result: Array<any> = [];
        if (!mapData || !mapData.length) {
            return result;
        }
        for (const item of mapData) {
            updateItem = {
                IdArticleMaster: this.articleId,
                IdArticleItems: item.idArticleItems,
                QuantityItems: item.quantityItems,
            };
            if (mode !== 0) {
                updateItem.IdArticleSet = item.idArticleSet;
            }
            if (mode === 2) {
                updateItem.IsDeleted = "1";
            }
            result.push(updateItem);
        }
        return result;
    }

    private isPropExist(propName, obj) {
        for (const prop in obj) {
            if (prop === propName) {
                return true;
            }
        }
        return false;
    }

    private onSearchComplete(response: ApiResultResponse) {
        const results: Array<any> = response.item.results;
        if (!results || !results.length) {
            this.compositionDataLeft = {
                columns: this.compositionDataLeft.columns,
                data: [],
                totalResults: 0,
            };
            this.compositionGridLeft.isSearching = false;
            return;
        }
        const newData: any[] = this.makeNewRowItems(results);
        this.keepEnterNumberInLeftGrid(newData);
        this.compositionDataLeft.data = newData;
        let leftData = {
            data: newData,
            columns: this.compositionDataLeft.columns,
            totalResults: response.item.total,
        };
        leftData = this.datatableService.appendRowId(leftData);
        // this.compositionGridLeft.selectCell(-1, -1);
        this.compositionDataLeft = leftData;
        this.compositionGridLeft.isSearching = false;
        this.resetColumnsHeader(this.compositionGridLeft);
    }

    private resetColumnsHeader(grid: XnAgGridComponent) {
        // cheating for the xn-ag-grid.component, it seems the processing is working wrong in core.
        // because when refresh the data the grid doesn't keep css class in header as them are initted.
        // this cheating fixes for losting editing color in grid header when re-bind data for left-side grid.
        setTimeout(() => {
            if (!grid) return;
            grid.updateHeaderCellEditable(true);
        }, 200);
    }

    private makeNewRowItems(results: any[]): any[] {
        const newData: Array<any> = [];
        for (const res of results) {
            const dataObj: any = {};
            if (
                (res.articleNr &&
                    res.articleNr.toLowerCase() ==
                        (this.currentArticleNumber || "").toLowerCase()) ||
                this.checkExistArticleItem(res["idArticle"]) ||
                this.checkExistCachedRemoveItemsFromRight(res["idArticle"])
            ) {
                continue;
            }
            for (const col of this.compositionDataLeft.columns) {
                if (this.isPropExist(col.data, res)) {
                    dataObj[col.data] = res[col.data];
                } else if (col.data.toString() === "idArticleItems") {
                    dataObj[col.data] = res["idArticle"];
                } else if (col.data.toString() === "idArticleSet") {
                    dataObj[col.data] = res["idArticle"];
                } else if (col.data.toString() === "quantityItems") {
                    dataObj[col.data] = "";
                }
            }
            newData.push(dataObj);
        }
        return [...this.cachedRemoveItemsFromRight, ...newData];
    }

    private keepEnterNumberInLeftGrid(data: any[]) {
        for (let item of data) {
            item.quantityItems =
                this.cachedHasNumberImtesOfLeft[
                    item.idArticleItems.toString()
                ] || item.quantityItems;
        }
    }

    private checkExistArticleItem(idArticle: any): boolean {
        if (!this.compositionDataRight.data.length) return false;
        const articleItem = this.compositionDataRight.data.find(
            (x) => x.idArticleItems == idArticle
        );
        return articleItem && articleItem.idArticleItems;
    }

    private checkExistCachedRemoveItemsFromRight(idArticle: any): boolean {
        if (!this.cachedRemoveItemsFromRight.length) return false;
        const articleItem = this.cachedRemoveItemsFromRight.find(
            (x) => x.idArticleItems == idArticle
        );
        return articleItem && articleItem.idArticleItems;
    }

    private showDialogConfimation(func: any) {
        if (!this.selectLeftItem.quantityItems) {
            this.showDialog = true;
            this.focusQuantityTextbox();
            this.compositionModel.quantity = "";
            this.ref.detectChanges();
            return;
        }
        func();
    }

    private registerPressEnterForQuantityTextBox() {
        $("#txt-composition-quantity:input").keydown(($event) => {
            if (!this.quantityValid) return;
            if (!($event.which === 13 || $event.keyCode === 13)) {
                return;
            }
            setTimeout(() => {
                $("#btn-continue-set-quantity").focus();
                setTimeout(() => {
                    this.continueSetQuantity();
                }, 200);
            });
        });
    }

    private focusQuantityTextbox() {
        setTimeout(() => {
            $("#txt-composition-quantity:input").focus();
        }, 100);
    }
}
