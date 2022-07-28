import {
    Component, Output, EventEmitter,
    ChangeDetectorRef, ViewChild, OnInit, OnDestroy, Input
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
    AppErrorHandler, SearchService,
    DatatableService, CampaignService,
    ModalService, ArticleService,
    GlobalSettingService
} from 'app/services';
import {
    ControlGridModel,
    MessageModel,
    ApiResultResponse
} from 'app/models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import cloneDeep from 'lodash-es/cloneDeep';
import camelCase from 'lodash-es/camelCase';
import uniqBy from 'lodash-es/uniqBy';
import isEmpty from 'lodash-es/isEmpty';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Uti } from 'app/utilities';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as widgetContentDetailReducer from 'app/state-management/store/reducer/widget-content-detail';

import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
    CustomAction,
    ProcessDataActions,
    WidgetDetailActions
} from 'app/state-management/store/actions';

import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {
    TranslateModeEnum,
    TranslateDataTypeEnum,
    Configuration
} from 'app/app.constants';
import { WidgetArticleTranslationDialogComponent } from 'app/shared/components/widget/components/widget-article-translation';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { IPageChangedEvent } from 'app/shared/components/xn-pager/xn-pagination.component';
import {WidgetModuleInfoTranslationComponent} from '../../../../widget/components/widget-module-info-translation';

@Component({
    selector: 'app-campaign-article-t3-form',
    styleUrls: ['./article-t3-form.component.scss'],
    templateUrl: './article-t3-form.component.html'
})
export class CampaignArticleFormComponent extends BaseComponent implements OnInit, OnDestroy {
    public isRenderCompleted = false;
    public isNewItem = false;
    public pageSize: number = Configuration.pageSize;

    private cachedCampaignDataBottom: Array<ChangingModel> = [];
    public campaignDataLeft: ControlGridModel;
    public campaignDataRight: ControlGridModel;
    public campaignDataBottom: ControlGridModel;
    public currentCampaignDataRight: ControlGridModel;
    private idSalesCampaignWizard: any;
    public perfectScrollbarConfig: any;
    private saveData: Array<any> = [];
    private articleSelectedWidget: any;

    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;

    private rowsDataState: Observable<any>;
    private rowsDataStateSubscription: Subscription;

    private searchServiceSubscription: Subscription;
    private campaignServiceSubscription: Subscription;
    private requestSubmitSubscription: Subscription;
    private translationSubscription: Subscription;
    private pageIndex: number = Configuration.pageIndex;
    private keyword = '';

    @Input() globalProperties: any[] = [];
    @Input() campaignGridLeftId: string;
    @Input() campaignGridRightId: string;
    @Input() campaignGridBottomId: string;

    @ViewChild('campaignGridLeft') private campaignGridLeft: XnAgGridComponent;
    @ViewChild('campaignGridRight') private campaignGridRight: XnAgGridComponent;
    @ViewChild('campaignGridBottom') campaignGridBottom: XnAgGridComponent;
    @ViewChild(WidgetArticleTranslationDialogComponent) widgetArticleTranslationDialogComponent: WidgetArticleTranslationDialogComponent;

    private outputModel: {
        submitResult?: boolean,
        formValue: any,
        isValid?: boolean,
        isDirty?: boolean,
        returnID?: string
    };

    public isRenderWidgetInfoTranslation: boolean;
    public combinationTranslateMode: any;
    public dataResult: any;
    public rowLeftGrouping: any;
    public rowRightGrouping: any;
    public rowBottomGrouping: any;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @ViewChild('widgetInfoTranslation') widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private ref: ChangeDetectorRef,
        private appErrorHandler: AppErrorHandler,
        private searchService: SearchService,
        private datatableService: DatatableService,
        private campaignService: CampaignService,
        private modalService: ModalService,
        private dispatcher: ReducerManagerDispatcher,
        private toasterService: ToasterService,
        private articleService: ArticleService,
        private globalSettingService: GlobalSettingService,
        protected router: Router,
        protected widgetDetailActions: WidgetDetailActions
    ) {
        super(router);

        this.selectedEntityState = this.store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).selectedEntity);
        this.rowsDataState = this.store.select(state => widgetContentDetailReducer.getWidgetContentDetailState(state, this.ofModule.moduleNameTrim).rowsData);

        this.onSearchComplete = this.onSearchComplete.bind(this);
    }
    public ngOnInit() {
        this.subscription();
        this.initData();
        this.initPerfectScroll();
    }
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public campaignDataRightRowClick($event: any) {
        setTimeout(() => {
            this.getDetailGrid($event);
        }, 100);
    }

    public campaignDataLeftRowDoubleClick($event: any) {
        this.addCampaign();
    }

    public campaignDataRightRowDoubleClick($event: any) {
        if (!this.isRenderCompleted) return;
        this.removeCampaign();
    }

    handleRowLeftGroupPanel(data) {
        this.rowLeftGrouping = data;
    }

    handleRowRightGroupPanel(data) {
        this.rowRightGrouping = data;
    }

    handleRowBottomGroupPanel(data) {
        this.rowBottomGrouping = data;
    }


    public addCampaign() {
        if (!this.isRenderCompleted) return;
        if (isEmpty(this.currentSelectedItemLeft())) return;
        this.isRenderCompleted = false;
        this.campaignDataRight = this.addCampaignItem(this.campaignDataRight, this.getRightItem());
        this.campaignDataLeft = this.removeCampaignItem(this.campaignDataLeft, this.currentSelectedItemLeft());
        this.focusRightLastItem();
    }

    public removeCampaign() {
        if (isEmpty(this.currentSelectedItemRight())) {
            return;
        }
        this.isRenderCompleted = false;
        this.removeItemInCached();
        // this.campaignDataLeft = this.addCampaignItem(this.campaignDataLeft, this.currentSelectedItemRight());
        this.campaignDataRight = this.removeCampaignItem(this.campaignDataRight, this.currentSelectedItemRight());
        this.focusRightLastItem();
        this.search();
    }

    public removeAllCampaign() {
        if (!this.campaignDataRight.data.length) return;
        this.modalService.confirmMessageHtmlContent(new MessageModel({
            message: [{key: '<p>'}, {key: 'Modal_Message__Are_You_Sure_You_Want_To_Remove_All_Article'},
                {key: '</p>'}],
            callBack1: () => { this.removeAllCampaignAfterConfirm(); }
        }));
    }

    public onLeftTableSearch(keyword) {
        this.pageIndex = 1;
        this.keyword = keyword;
        this.search();
    }

    public onBottomCellEditEndedHandler(eventData: any) {
        this.onGridItemChanged(eventData.data);
    }

    public onBottomRowEditEndedHandler(eventData: any) {
        this.onGridItemChanged(eventData);
    }

    public dragStart() {
        Uti.handleWhenSpliterResize();
    }

    public onCheckAllCheckedHandler(eventData: any) {
        this.onGridItemChanged(eventData);
    }

    public onCheckAllChecked(isCheckAll: boolean) {
        if ((typeof isCheckAll === 'boolean')) {
            isCheckAll = true;
            this.onGridItemChanged(null, isCheckAll);
        }
    }

    public onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        this.search();
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber;
    }

    /******************************************************************************************/
    /**********************PRIVATE METHODS*****************************************************/

    private search() {
        if (this.modalService.isStopSearchWhenEmptySize(this.pageSize, this.pageIndex)) return;
        this.campaignGridLeft.isSearching = true;
        this.searchServiceSubscription = this.searchService.search('article', this.keyword, null, this.pageIndex, this.pageSize)
            .finally(() => {
                this.ref.detectChanges();
            })
            .subscribe(this.onSearchComplete);
    }

    private getRightItem(): any {
        const leftSelectItem = this.currentSelectedItemLeft();
        const cachedItem = this.currentCampaignDataRight.data.find(x => x.IdArticle == leftSelectItem.IdArticle);
        if (cachedItem && cachedItem.IdSalesCampaignArticle) {
            return cachedItem;
        }
        return leftSelectItem;
    }

    private onTableEditSuccess($event) {
        this.onGridItemChanged($event);
    }

    private onGridItemChanged(rightSelectedItem?: any, isCheckAll?: boolean) {
        this.setOutputData(null, {
            submitResult: null,
            formValue: {},
            isValid: true,
            isDirty: true
        });
        this.updateIsChangedDataForBottomCachedItem(rightSelectedItem, isCheckAll);
    }

    private addCampaignItem(controlGridModel: ControlGridModel, selectItem: any): ControlGridModel {
        controlGridModel.data.push(selectItem);
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private removeCampaignItem(controlGridModel: ControlGridModel, selectItem: any): ControlGridModel {
        Uti.removeItemInArray(controlGridModel.data, selectItem, 'IdSalesCampaignArticle');
        this.setDirtyWhenMoveItem();
        this.resetBottomGrid();
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private removeAllCampaignAfterConfirm() {
        this.isRenderCompleted = false;
        // this.campaignDataLeft = {
        //     data: [...this.campaignDataLeft.data, ...this.campaignDataRight.data],
        //     columns: this.campaignDataLeft.columns
        // };
        this.campaignDataRight = {
            data: [],
            columns: this.campaignDataRight.columns
        };
        this.campaignDataBottom = {
            data: [],
            columns: this.campaignDataBottom.columns
        }
        this.cachedCampaignDataBottom = [];
        this.focusRightLastItem();
        this.setDirtyWhenMoveItem();
        this.ref.detectChanges();
        this.search();
    }

    private focusRightLastItem() {
        if (!this.campaignDataRight.data.length) {
            this.isRenderCompleted = true;
        }
        // Select the last item
        setTimeout(() => {
            if (this.campaignGridRight) {
                this.campaignGridRight.selectRowIndex(this.campaignDataRight.data.length - 1, true);
            }
        }, 1000);
    }

    private resetBottomGrid() {
        this.campaignDataBottom = Uti.cloneDataForGridItems({
            data: [],
            columns: this.campaignDataBottom.columns
        });
    }

    private makeTempIdForBottomGrid() {
        for (const item of this.campaignDataBottom.data) {
            item.idSalesCampaignArticlePrice = item.idSalesCampaignArticlePrice ? item.idSalesCampaignArticlePrice : Uti.getTempId();
        }
    }

    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }
    private initData() {
        this.initEmptyDataForGrid();
        this.getArticleSetCampaignForRight();
        this.getArticleSetCampaignForBottom('');
    }

    private initEmptyDataForGrid() {
        this.campaignDataLeft = {
            data: [],
            columns: []
        };
        this.campaignDataRight = {
            data: [],
            columns: []
        };
        this.campaignDataBottom = {
            data: [],
            columns: []
        };
    }

    private subscription() {
        this.selectedEntityStateSubscription = this.selectedEntityState.subscribe((selectedEntityState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (selectedEntityState && selectedEntityState['idSalesCampaignWizard']) {
                    this.idSalesCampaignWizard = selectedEntityState['idSalesCampaignWizard'];
                }
            });
        });

        this.requestSubmitSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.submit();
            });
        });

        this.translationSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.OPEN_TRANSLATION_DIALOG && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.openArticleTranslate();
            });
        });

        this.rowsDataStateSubscription = this.rowsDataState.subscribe((rowsData: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!rowsData || !rowsData.length) return;
                this.setSelectedRow(rowsData);
            });
        });
    }

    private setSelectedRow(rowsData: any) {
        for (let i = 0; i < rowsData.length; i++) {
            const widget = rowsData[i];
            if (!widget) continue;
            if (widget.widgetDetailId == 47) {
                const rowData = widget.rowData;
                if (!rowData || !rowData.length) continue;
                const selectedRow = {};
                for (let j = 0; j < rowData.length; j++) {
                    selectedRow[rowData[j].key] = rowData[j].value;
                }
                if (this.campaignGridRight)
                    this.campaignGridRight.setSelectedRow(selectedRow);
                this.articleSelectedWidget = widget;
            }
        }
    }

    private getArticleSetCampaignForRight() {
        this.campaignServiceSubscription = this.campaignService.getCampaignArticle(this.idSalesCampaignWizard)
            .subscribe(
                (response) => {
                    this.appErrorHandler.executeAction(() => {
                        response = this.datatableService.formatDataTableFromRawData(response.item.data);
                        this.campaignDataRight = this.datatableService.buildDataSource(response);
                        this.campaignDataLeft = {
                            data: [],
                            columns: [...this.campaignDataRight.columns]
                        };
                        this.currentCampaignDataRight = cloneDeep(this.campaignDataRight);
                        this.isRenderCompleted = !!this.campaignDataRight.columns.length;
                        if (this.campaignGridLeft && this.campaignGridRight) {
                            this.campaignGridLeft.refresh();
                            this.campaignGridRight.refresh();
                        }

                    });
                });
    }

    private getArticleSetCampaignForBottom(idArticle: any) {
        this.isRenderCompleted = false;
        if (this.isDataCachedAndReGetCachedData()) {
            setTimeout(() => {
                this.isRenderCompleted = true;
            }, 200);
            return;
        }
        this.campaignServiceSubscription = this.campaignService.getCampaignArticleCountries(idArticle, this.idSalesCampaignWizard)
            .subscribe(
                (response) => {
                    this.appErrorHandler.executeAction(() => {
                        response = this.datatableService.formatDataTableFromRawData(response.item.data);
                        response = this.datatableService.buildDataSource(response);
                        // response = this.datatableService.appendRowId(response);
                        this.campaignDataBottom = response;
                        this.makeTempIdForBottomGrid();
                        if (idArticle) this.addBottomCachedItem();
                        this.isRenderCompleted = !!this.campaignDataBottom.columns.length;
                        if (this.campaignGridBottom)
                            this.campaignGridBottom.refresh();
                    });
                });
    }

    private isDataCachedAndReGetCachedData(): boolean {
        const currentItem = this.cachedCampaignDataBottom.find(x => x.idSalesCampaignArticle === this.currentSelectedItemRight()['IdSalesCampaignArticle']);
        if (currentItem && currentItem.idSalesCampaignArticle) {
            this.campaignDataBottom = currentItem.data;
            this.isNewItem = currentItem.isNew;
            return true;
        }
        return false;
    }

    private addBottomCachedItem() {
        this.isNewItem = this.currentSelectedItemRight()['IdSalesCampaignArticle'] < 0;
        this.cachedCampaignDataBottom.push({
            idSalesCampaignArticle: this.currentSelectedItemRight()['IdSalesCampaignArticle'],
            isNew: this.isNewItem,
            isChanged: false,
            data: this.campaignDataBottom
        });
    }

    private setDirtyWhenMoveItem() {
        const isDirty = this.checkDirtyAndGetSaveData();
        this.setOutputData(null, {
            submitResult: null,
            formValue: {},
            isValid: isDirty,
            isDirty: isDirty,
            returnID: null
        });
    }

    private removeItemInCached() {
        Uti.removeItemInArray(this.cachedCampaignDataBottom, {
            idSalesCampaignArticle: this.currentSelectedItemRight()['IdSalesCampaignArticle']
        }, 'idSalesCampaignArticle')
    }

    private submit() {
        setTimeout(() => {
            if (!this.checkDirtyAndGetSaveData()) {
                this.setOutputData(null, {
                    submitResult: false,
                    formValue: {},
                    isValid: true,
                    isDirty: false
                });
                return false;
            }
            this.saveColTranslation();
            this.udpateCampaign();
        }, 300);
    }

    private checkDirtyAndGetSaveData(): boolean {
        const addItem = this.getAddedRightItems();
        this.saveData = [...this.makeDeleteData(), ...this.makeAddedAndEdittedBottomData()];
        return !!this.saveData.length || !!addItem.length;
    }

    private makeAddedAndEdittedBottomData(): Array<any> {
        const addAndEditBottomData = this.cachedCampaignDataBottom.filter(x => (x.isNew || x.isChanged));
        if (!addAndEditBottomData.length) return [];
        let result = new Array<any>();
        for (const item of addAndEditBottomData) {
            result = [...result, ...this.makeAddedAndEdittedBottomDataEachItem(item)];
        }
        return result;
    }

    private makeAddedAndEdittedBottomDataEachItem(savingItem: ChangingModel): Array<any> {
        const result = [];
        let editItem: any;
        for (const item of savingItem.data.data) {
            if (!item.isEdited && savingItem.idSalesCampaignArticle > 0 && !savingItem.checkAll) continue;
            editItem = {
                'IdSalesCampaignWizard': item.IdSalesCampaignWizard,
                'IdSalesCampaignArticle': item.IdSalesCampaignArticle,
                'IdSalesCampaignWizardItems': item.IdSalesCampaignWizardItems,
                'IdArticle': item.IdArticle,
                'SalesCampaignArticle_IsActive': true,
                'IdSalesCampaignWizardItemsCurrency': item.IdSalesCampaignWizardItemsCurrency,
                'SalesPrice': item.SalesPrice,
                'Quantity': 0,
                'Description': item.ArticleNameShort,
                'IsGift': true,
                'IsActive': this.getActiveValue(item.IsActive),
            };

            if (parseFloat(item.IdSalesCampaignArticlePrice) > 0) {
                editItem.IdSalesCampaignArticlePrice = item.IdSalesCampaignArticlePrice;
            }
            result.push(editItem);
        }
        return result;
    }

    private getActiveValue(item: any) {
        if (typeof item === 'string') {
            return (item.toLowerCase() === 'true');
        }
        return !!item;
    }

    private udpateCampaign() {
        this.campaignServiceSubscription = this.campaignService.createCampaignArticle(this.saveData)
            .subscribe(
                (data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(null, {
                            submitResult: true,
                            formValue: {},
                            isValid: true,
                            isDirty: false,
                            returnID: data.item.returnID
                        });
                    });
                },
                (err) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false);
                    });
                });
    }

    private setOutputData(submitResult: any, data?: any) {
        if ((typeof data) !== 'undefined') {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: submitResult,
                formValue: {},
                isValid: false,
                isDirty: false
            };
        }
        this.outputData.emit(this.outputModel);
    }

    private makeDeleteData(): Array<any> {
        const deleteData = this.getDeleteRightItems();
        if (!deleteData || !deleteData.length) { return []; }
        const result: Array<any> = [];
        if (!deleteData || !deleteData.length) { return result; }
        for (const item of deleteData) {
            result.push({
                IsDeleted: '1',
                IdSalesCampaignArticle: item.IdSalesCampaignArticle
            });
        }
        return result;
    }

    private getDeleteRightItems(): any {
        return this.currentCampaignDataRight.data.filter(x =>
            !this.campaignDataRight.data.find(y => y.IdSalesCampaignArticle === x.IdSalesCampaignArticle));
    }

    private getAddedRightItems(): any {
        return this.campaignDataRight.data.filter(x =>
            !this.currentCampaignDataRight.data.find(y => y.IdSalesCampaignArticle === x.IdSalesCampaignArticle));
    }

    private mapAddedData(mapData: Array<any>): Array<any> {
        const result: Array<any> = [];
        if (!mapData || !mapData.length) { return result; }
        for (const item of mapData) {
            result.push({
                IdSalesCampaignWizard: this.idSalesCampaignWizard,
                IdArticle: item.IdArticle
            });
        }
        return result;
    }

    private updateIsChangedDataForBottomCachedItem(bottomEditedItem: any, isCheckAll?: boolean) {
        if (bottomEditedItem) {
                bottomEditedItem['isEdited'] = true;

            if (this.campaignDataBottom && this.campaignDataBottom.data && this.campaignDataBottom.data.length) {
                const colTranslate = 'ArticleNameShort';
                const translateValue = bottomEditedItem[colTranslate];
                const salesPrice = bottomEditedItem.SalesPrice;

                const collectionItems: Array<any> = this.campaignDataBottom.data;
                collectionItems.forEach(item => {
                    if (item.IdRepLanguage && item.IdRepLanguage == bottomEditedItem.IdRepLanguage) {
                        if (!item.ArticleNameShort) {
                            item.ArticleNameShort = translateValue;
                            item['isEdited'] = true;
                        }
                    }
                    if (item.CurrencyCode && item.CurrencyCode == bottomEditedItem.CurrencyCode) {
                        if (!item.SalesPrice) {
                            item.SalesPrice = salesPrice;
                            item['isEdited'] = true;
                        }
                    }
                });

                // this.campaignGridBottom.refresh();
            }
        }

        const currentItem = this.cachedCampaignDataBottom.find(x => x.idSalesCampaignArticle === this.currentSelectedItemRight()['IdSalesCampaignArticle']);
        if (!currentItem || !currentItem.idSalesCampaignArticle) return;
        if (isCheckAll) {
            currentItem.checkAll = isCheckAll;
        }
        currentItem.isChanged = true;
    }

    private onSearchComplete(response: ApiResultResponse) {
        const results: Array<any> = response.item.results;
        if (!results || !results.length) {
            this.campaignDataLeft = {
                columns: this.campaignDataLeft.columns,
                data: [],
                totalResults: 0
            };
            this.campaignGridLeft.isSearching = false;
            return;
        }
        const notExistColumns = ['articlemanufacturersnr', 'quantityset', 'idsalescampaignwizard'];
        const newData: Array<any> = [];
        for (const res of results) {
            const dataObj: any = {};
            if (this.checkExistPrimaryItem(res.idArticle)) {
                continue;
            }
            for (const col of this.campaignDataLeft.columns) {
                if (notExistColumns.indexOf(col.data.toString().toLowerCase()) > -1) {
                    dataObj[col.data] = '';
                } else {
                    dataObj[col.data] = res[camelCase(col.data)];
                }

                if (col.data.toLowerCase() === 'idsalescampaignarticle') {
                    dataObj[col.data] = Uti.getTempId();
                }
            }
            newData.push(dataObj);
        }

        this.campaignDataLeft.data = newData;
        const leftData = {
            data: newData,
            columns: this.campaignDataLeft.columns,
            totalResults: response.item.total
        };
        // leftData = this.datatableService.appendRowId(leftData);
        this.campaignDataLeft = leftData;
        this.campaignGridLeft.isSearching = false;
    }

    private checkExistPrimaryItem(idArticle: any): boolean {
        const articleItem = this.campaignDataRight.data.find(x => x.IdArticle == idArticle);
        return (articleItem && articleItem.IdArticle);
    }

    private getDetailGrid($event: any) {
        if (!$event) return;
        this.getArticleSetCampaignForBottom(Uti.getValueFromArrayByKey($event, 'IdArticle'));

        if (this.articleSelectedWidget)
            this.articleSelectedWidget.rowData = $event;
        //this.store.dispatch(this.widgetDetailActions.loadWidgetTableDataRows(this.articleSelectedWidget,this.ofModule));
    }

    private currentSelectedItemLeft(): any {
        return Uti.mapArrayToObject((this.campaignGridLeft.selectedItem() || []), true);
    }

    private currentSelectedItemRight(): any {
        return Uti.mapArrayToObject((this.campaignGridRight.selectedItem() || []), true);
    }


    /**
     * getOriginalArticleNameValue
     * @param idArticle
     */
    private getOriginalArticleNameValue(idArticle): Observable<string> {
        return this.articleService.getArticleById(idArticle, '-1').map((response: ApiResultResponse) => {
            let orgValue = '';
            if (Uti.isResquestSuccess(response)) {
                const item = response.item;
                if (item && item.articleNameShort) {
                    orgValue = item.articleNameShort.value
                }
            }
            return orgValue;
        });
    }

    /**
     * getEditedBottomGridForColTranslation
     */
    private getEditedBottomGridForColTranslation(): Array<Array<any>> {
        const editedItems: Array<Array<any>> = [];
        if (this.cachedCampaignDataBottom && this.cachedCampaignDataBottom.length) {
            const editBottomDataArray = this.cachedCampaignDataBottom.filter(x => (x.isChanged));
            if (editBottomDataArray.length) {
                editBottomDataArray.forEach(editBottomData => {
                    const items = editBottomData.data.data.filter(p => p['isEdited']);
                    if (items.length) {
                        // editedItems = [...editedItems, ...items];
                        editedItems.push(items);
                    }
                });
            }
        }
        return editedItems;
    }

    /**
     * prepareDataForColTranslateSaving
     */
    private prepareDataForColTranslateSaving(translateEditedData: Array<any>): Observable<any> {
        // const translateEditedData = this.getEditedBottomGridForColTranslation();
        const result = [];
        const items: Array<any> = translateEditedData.map(p => {
            return {
                IdTranslateLabelText: p.IdTranslateLabelText,
                IdArticle: p.IdArticle,
                ArticleNameShort: p.ArticleNameShort,
                IdRepLanguage: p.IdRepLanguage,
                IdCountryLanguage: p.IdCountryLanguage
            }
        });

        const editData = uniqBy(items, 'IdRepLanguage');
        if (editData && editData.length) {
            const idArticle = editData[0].IdArticle;
            return this.getOriginalArticleNameValue(idArticle).map(originalValue => {
                (editData as Array<any>).forEach((item) => {
                    const isDeleted = isEmpty(item.ArticleNameShort);
                    if (!(isDeleted && !item.IdTranslateLabelText)) {
                        const isModeAll = TranslateModeEnum.All;
                        const idTable = item.IdArticle;
                        result.push({
                            'IdTranslateLabelText': item.IdTranslateLabelText > 0 ? item.IdTranslateLabelText : null,
                            'IdRepTranslateModuleType': TranslateDataTypeEnum.Data,
                            'IdRepLanguage': item.IdRepLanguage,
                            'IdCountryLanguage': item.IdCountryLanguage,
                            'WidgetMainID': null,
                            'WidgetCloneID': null,
                            'OriginalText': originalValue,
                            'TranslatedText': item.ArticleNameShort,
                            'IsDeleted': isDeleted ? '1' : null,
                            'IdTable': idTable,
                            'FieldName': 'ArticleNameShort',
                            'TableName': 'B00ArticleName'
                        });
                    }
                });
                return { 'Translations': result };
            });
        }
        return Observable.of(null);
    }

    /**
     * saveColTranslation
     */
    private saveColTranslation() {
        return new Promise<any>((resolve, reject) => {
            const translateEditedDatas: Array<Array<any>> = this.getEditedBottomGridForColTranslation();
            if (translateEditedDatas && !translateEditedDatas.length) {
                resolve(true);
            }
            else {
                translateEditedDatas.forEach((translateEditedData: Array<any>) => {
                    this.prepareDataForColTranslateSaving(translateEditedData).subscribe(saveData => {
                        this.appErrorHandler.executeAction(() => {
                            if (!saveData || !saveData.Translations || !saveData.Translations.length) {
                                resolve(true);
                            }
                            this.globalSettingService.saveTranslateLabelText(saveData).finally(() => {
                                resolve(true);
                            }).subscribe(
                                (response) => { }
                            );
                        });
                    });
                });
            }
        });
    }

    /**
     * openArticleTranslate
     */
    public openArticleTranslate() {
        if (this.widgetArticleTranslationDialogComponent) {
            if (this.campaignGridRight) {
                const selectedItem = Uti.mapArrayToObject((this.campaignGridRight.selectedItem() || []), true);
                if (selectedItem) {
                    this.widgetArticleTranslationDialogComponent.translatedDataGrid = this.campaignDataBottom;
                    this.widgetArticleTranslationDialogComponent.idArticle = selectedItem['IdArticle'];
                    this.widgetArticleTranslationDialogComponent.open();
                }
            }
        }
    }

    private onHiddenWidgetInfoTranslation(event?: any) {
        this.isRenderWidgetInfoTranslation = false;
        this.initData();
    }

    private reattach() {
        this.ref.reattach();
    }

    private openTranslateDialog(event) {
        let translateInDialog = true;
        if (event && event.mode == 'row') {
            translateInDialog = false;
        }
        if (translateInDialog) {
            this.dataResult = this.currentCampaignDataRight;
            this.combinationTranslateMode = event ? event.mode : null;
            this.isRenderWidgetInfoTranslation = true;
            setTimeout(() => {
                if (this.widgetModuleInfoTranslationComponent)
                    this.widgetModuleInfoTranslationComponent.showDialog = true;
            }, 250);
        }
    }

    private openTranslateDialogBottom(event) {
        let translateInDialog = true;
        if (event && event.mode == 'row') {
            translateInDialog = false;
        }
        if (translateInDialog) {
            this.isRenderWidgetInfoTranslation = true;
            this.dataResult = this.campaignDataBottom;
            this.combinationTranslateMode = event ? event.mode : null;
            setTimeout(() => {
                if (this.widgetModuleInfoTranslationComponent)
                    this.widgetModuleInfoTranslationComponent.showDialog = true;
            }, 250);
        }
    }

    /**
     * onItemsEditedTranslateData
     * @param $event
     */
    public onItemsEditedTranslateData(items: Array<any>) {
        let isEdited: boolean;
        if (items && items.length) {
            items.forEach(editedItem => {
                if (this.campaignDataBottom && this.campaignDataBottom.data &&
                    this.campaignDataBottom.data.length) {
                    const collectionItems: Array<any> = this.campaignDataBottom.data;
                    collectionItems.forEach(item => {
                        if (item.IdRepLanguage && item.IdRepLanguage == editedItem.IdRepLanguage) {
                            item.ArticleNameShort = editedItem.TranslateText;
                            item['isEdited'] = true;
                            isEdited = true;
                            this.onGridItemChanged(item);
                        }
                    });
                }
            });
        }
        if (isEdited) {
            this.setOutputData(null, {
                submitResult: null,
                formValue: {},
                isValid: true,
                isDirty: true
            });
            this.campaignGridBottom.refresh();
        }
    }
}

export class ChangingModel {
    isNew: boolean;
    isChanged: boolean;
    checkAll?: boolean;
    idSalesCampaignArticle: any = {};
    data: {
        columns: Array<any>,
        data: Array<any>
    };
    constructor(init?: Partial<ChangingModel>) {
        Object.assign(this, init);
    }
}
