import {
    Component, OnInit, OnChanges, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy,
    EventEmitter, SimpleChanges, OnDestroy, ViewChild
} from '@angular/core';
import { Module, TabModel, ControlGridModel } from 'app/models';
import { SearchService, DatatableService, PropertyPanelService, AppErrorHandler, ModalService } from 'app/services';
import { IPageChangedEvent } from 'app/shared/components/xn-pager/xn-pagination.component';
import camelCase from 'lodash-es/camelCase';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    Store,
    ReducerManagerDispatcher
} from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { ModuleList } from 'app/pages/private/base';
import {
    ProcessDataActions,
    CustomAction,
    GlobalSearchActions
} from 'app/state-management/store/actions';
import * as uti from 'app/utilities';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { Configuration, MenuModuleId, LocalStorageKey } from 'app/app.constants';
import { Uti } from 'app/utilities';
import { WidgetModuleInfoTranslationComponent } from '../../../widget/components/widget-module-info-translation';

@Component({
    selector: 'gs-result',
    templateUrl: './gs-result.component.html',
    styleUrls: ['./gs-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '(mouserelease)': 'rightClicked($event)' }
})
export class GlobalSearchResultComponent implements OnInit, OnChanges, OnDestroy {
    public menuModuleId = MenuModuleId;
    @Input() parentInstance: any = null;

    @Input() treeViewMode = false;
    @Input() preventSearch = false;
    @Input() serverPaging = true;
    @Input() allowMasterDetail: boolean;
    @Input() keyword: string;
    @Input() isWithStar: boolean = false;
    @Input() searchIndex: string; // Used for elasticsearch
    @Input() allowDrag: any = {
        value: false
    };
    @Input() gridContextMenuData: any;
    @Input() activeModule: Module = null;
    @Input() activeSubModule: Module = null;
    @Input() set module(module: Module) {
        this.moduleLocal = module;
        if (this.moduleLocal && this.moduleLocal.iconName) {
            const icon = this.moduleLocal.iconName;
            this.customDragContent = {
                dragIcon: `<span class='text-center' style='font-size: 35px'><i aria-hidden='true' class='fa ` + icon + `'></i></span>`,
                data: module
            }

            if (!this.preventSearch) {
                //this.allowMasterDetail = this.moduleLocal.idSettingsGUI == MenuModuleId.customer;
                this.treeViewMode = this.moduleLocal.idSettingsGUI == MenuModuleId.customer;
            }
        }
    }
    @Input() isGlobalSearch = false;
    @Input() dontAllowSearchWhenInit: boolean = false;
    @Input() gridId: string;

    private _tab;
    @Input() set tab(data: TabModel) {
        this._tab = data;
        if (this._tab && this._tab.payload && this._tab.payload.pageIndex) {
            this.pageIndex = this.tab.payload.pageIndex;
            this.pageSize = this.tab.payload.pageSize;
            this.paginationFromPopup = Object.assign({}, this.tab.payload);
        }
        this.updateStateForTabData();
    }

    get tab() {
        return this._tab;
    }

    @Input() tabs: TabModel[];
    @Input() cssClass: string

    @Output() onRowClicked: EventEmitter<any> = new EventEmitter();
    @Output() onRowDoubleClicked: EventEmitter<any> = new EventEmitter();
    @Output() searchItemRightClick: EventEmitter<any> = new EventEmitter();
    @Output() onSearchCompleted: EventEmitter<any> = new EventEmitter();
    @Output() pagingChanged: EventEmitter<any> = new EventEmitter();
    @Output() addToHistoryAction: EventEmitter<any> = new EventEmitter();
    @Output() onPinGroupTranslateClick: EventEmitter<any> = new EventEmitter();

    public globalNumberFormat = '';
    public that: any;
    public totalResults: number = 0;
    public numberOfEntries: number = 0;
    private resuleSelectTimer;
    private resuleSelectInterval = 200;
    @Input() dataResult: any;
    public customDragContent: any;
    public pageIndex: number = Configuration.pageIndex;
    public pageSize: number = Configuration.pageSize;
    public hightlightKeywords: string;
    public isRenderWidgetInfoTranslation: boolean;
    public combinationTranslateMode: any;

    private COLUMN_SETTING_INDEX: number = Configuration.pageIndex;
    private searchServiceSubscription: Subscription;
    public moduleLocal: Module;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private okToChangeSearchResultStateSubscription: Subscription;
    private willChangeCell: any;
    public globalProperties: any;
    public paginationFromPopup: any;
    private lastKeyword: string;
    private rowClickTimer = null;

    //public allowMasterDetail: boolean;
    private advancedSearchCondition: any;
    private advanceSearchSubscription: Subscription;

    @ViewChild(XnAgGridComponent) public agGridComponent: XnAgGridComponent;
    @ViewChild('widgetInfoTranslation') widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;

    constructor(
        private searchService: SearchService,
        private _changeDetectorRef: ChangeDetectorRef,
        private datatableService: DatatableService,
        private propertyPanelService: PropertyPanelService,
        private appErrorHandler: AppErrorHandler,
        private store: Store<AppState>,
        private processDataActions: ProcessDataActions,
        private globalSearchActions: GlobalSearchActions,
        private dispatcher: ReducerManagerDispatcher,
        private modalService: ModalService,
        private toasterService: ToasterService
    ) {
        this.that = this;
    }

    ngOnInit() {
        this.globalPropertiesState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
        this.subscribeGlobalProperties();
        this.subscribeOkToChangeSearchResultState();
        this.subscribeAdvanceSearchState();
    }

    public makeContextMenu(data?: any) {
        if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
            return [];
        }
        return this.parentInstance.makeContextMenu(data);
    }

    public ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.dontAllowSearchWhenInit) {
            this.dontAllowSearchWhenInit = false;
            this.searchData('');
            return;
        }

        if (!changes['keyword']) return;

        const hasChanges = this.hasChanges(changes['keyword']);
        if (hasChanges && this.lastKeyword != this.keyword) {
            this.search();
        }
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.globalProperties = globalProperties;
                    this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
                }
            });
        });
    }

    private subscribeOkToChangeSearchResultState() {
        this.okToChangeSearchResultStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            if (action.type === ProcessDataActions.OK_TO_CHANGE_SEARCH_RESULT) {
                let module = this.moduleLocal;
                if (module.idSettingsGUIParent == ModuleList.Administration.idSettingsGUI) {
                    module = ModuleList.Administration;
                }

                return action.module.idSettingsGUI == module.idSettingsGUI;
            }

            return false;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                if (this.willChangeCell) {
                    this.willChangeCell = null;
                }
            });
        });
    }

    private hasChanges(changes) {
        return changes && changes.hasOwnProperty('currentValue') && changes.hasOwnProperty('previousValue');
    }

    public sizeColumnsToFit() {
        if (this.agGridComponent) {
            this.agGridComponent.sizeColumnsToFit();
        }
    }

    public search(): void {
        this.searchData(this.keyword);
        this.changeDetectorRef();
    }

    private searchDataTimeout: any;
    public searchData(keyword: string): void {
        if (this.preventSearch) return;

        if (this.searchDataTimeout) {
            clearTimeout(this.searchDataTimeout);
            this.searchDataTimeout = null;
        }
        this.searchDataTimeout = setTimeout(() => {
            if (this.modalService.isStopSearchWhenEmptySize(this.pageSize, this.pageIndex)) {
                this.onSearchCompleted.emit();
                return;
            }

            if (this.agGridComponent) {
                this.agGridComponent.isSearching = true;
            }
            this.hightlightKeywords = this.keyword;

            this.lastKeyword = keyword;
            const pageSize = this.pageSize;
            this.searchServiceSubscription = this.searchService.search(this.searchIndex, keyword, this.moduleLocal.idSettingsGUI, this.pageIndex, pageSize, null, null, null, this.isWithStar)
                .finally(() => {
                    this.changeDetectorRef();
                })
                .subscribe((response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        response = response.item;
                        this.dataResult = this.datatableService.buildDataSourceFromEsSearchResult(response, this.COLUMN_SETTING_INDEX);
                        this.buildDataResultForModules();
                        this.totalResults = response.total;
                        this.numberOfEntries = response && response.results ? response.results.length : 0;
                        this.onSearchCompleted.emit();
                        if (this.agGridComponent && pageSize) {
                            this.agGridComponent.isSearching = false;
                            this.agGridComponent.refresh();
                            this.changeDetectorRef();
                        }
                        this.addToHistory(keyword, this.totalResults);
                    });
                }, (err) => {
                    //reset data on grid
                    this.dataResult = {
                        'data': [],
                        'columns': this.dataResult && this.dataResult.columns ? this.dataResult.columns : [],
                        'totalResults': 0,
                        idSettingsGUI: this.moduleLocal.idSettingsGUI
                    };
                    this.totalResults = 0;
                    this.numberOfEntries = 0;
                    this.onSearchCompleted.emit();
                    //show error
                    this.toasterService.pop('error', 'Error', 'Search failed please try again');
                    if (this.agGridComponent) {
                        this.agGridComponent.isSearching = false;
                        this.changeDetectorRef();
                    }
                });
        });
    }

    onRowDoubleClick(data: any) {
        if (!data)
            return;
        let model: any = {};
        Object.keys(data).forEach(key => {
            model[camelCase(key)] = data[key];
        });
        this.onRowClicked.emit(model);
        this.onRowDoubleClicked.emit(model);
        this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
    }

    onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        if (!this.tab || (this.tab && !this.tab.activeAdvanceSearchStatus)) {
            this.search();
        }
        else {
            if (this.advancedSearchCondition) {
                this.searchAdvanceData(this.advancedSearchCondition);
            }
        }
        this.updateStateForTabData();
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber ? pageNumber : Configuration.pageSize;
        this.search();
        this.updateStateForTabData();
    }

    private gridItemRightClick($event: any) {
        this.searchItemRightClick.emit($event);
    }

    public onSelectionChangingHandler(e) {
        this.willChangeCell = cloneDeep(e);

        let module = this.moduleLocal;
        if (module.idSettingsGUIParent == ModuleList.Administration.idSettingsGUI) {
            module = ModuleList.Administration;
        }
        this.store.dispatch(this.processDataActions.requestChangeSearchResult(module));
    }

    // #region [Grid mouse up/down]
    private isMouseDown: boolean;
    private deferResultSelect: any;

    /**
     * gridMouseDown
     **/
    public gridMouseDown($event) {
        this.isMouseDown = true;
    }

    public gridKeyDown($event) {
        if ((this.moduleLocal && this.activeModule) && this.moduleLocal.idSettingsGUI !== this.activeModule.idSettingsGUI) {
            return;
        }

        this.isMouseDown = false;
    }
    /**
     * gridMouseUp
     **/
    public gridMouseUp($event) {
        if (this.moduleLocal && this.activeModule) {
            if (this.activeModule.idSettingsGUI != 5) {
                if (this.moduleLocal.idSettingsGUI !== this.activeModule.idSettingsGUI) {
                    return;
                }
            } else {
                if (this.activeSubModule && this.activeSubModule.idSettingsGUI && this.moduleLocal.idSettingsGUI !== this.activeSubModule.idSettingsGUI) {
                    return;
                }
            }
        }

        this.isMouseDown = false;

        switch ($event.which) {
            // Left mouse click
            case 1:
            case 2:
                if (this.deferResultSelect) {
                    this.onResultSelect(this.deferResultSelect);
                    this.deferResultSelect = null;
                }
                break;
            // Right mouse click
            case 3:
                this.deferResultSelect = null;
                break;
        }
    }

    public isDeselectAllRowMaster: boolean = false;
    public isDeselectAllRowDetail: boolean = false;
    public rowGrouping = false;

    handleRowGroupPanel(data) {
        this.agGridComponent.rowGrouping = data;
    }

    onResultSelect(data: Array<any>, isDeselectAllRowMaster?: boolean, isDeselectAllRowDetail?: boolean) {
        this.isDeselectAllRowMaster = isDeselectAllRowMaster;
        this.isDeselectAllRowDetail = isDeselectAllRowDetail;
        clearTimeout(this.rowClickTimer);
        this.rowClickTimer = setTimeout(() => {
            if (!this.isMouseDown) {
                const model: any = {};
                data.forEach(item => {
                    model[camelCase(item.key)] = item.value;
                });
                this.onRowClicked.emit(model);
            } else {
                this.deferResultSelect = data;
            }
        }, 500);
    }
    // #endregion [Grid mouse up/down]

    /**
     * updateStateForTabData
     **/
    private updateStateForTabData() {
        if (!Configuration.PublicSettings.enableGSNewWindow)
            return;

        if (this.tab) {
            if (!this.tab.payload) {
                this.tab.payload = {};
            }
            this.tab.payload.pageSize = this.pageSize;
            this.tab.payload.pageIndex = this.pageIndex;
            this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
        }
    }

    private changeDetectorRef() {
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        }, 300);
    }

    private addToHistory(keyword: string, numberOfResult: number) {
        this.addToHistoryAction.emit({
            keyword: keyword,
            numberOfResult: numberOfResult
        })
    }

    public searchAdvance(formData) {
        const pageSize = this.pageSize;
        this.searchServiceSubscription = this.searchService.searchAdvance(this.searchIndex, this.moduleLocal.idSettingsGUI, this.pageIndex, pageSize, formData)
            .finally(() => {
                if (this.tab) {
                    this.tab.activeAdvanceSearchStatus = true;
                }
                this.changeDetectorRef();
            })
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    response = response.item;
                    this.dataResult = this.datatableService.buildDataSourceFromEsSearchResult(response, this.COLUMN_SETTING_INDEX);
                    this.buildDataResultForModules();
                    this.totalResults = response.total;
                    this.numberOfEntries = response && response.results ? response.results.length : 0;
                    this.onSearchCompleted.emit();
                    if (this.agGridComponent && pageSize) {
                        this.agGridComponent.isSearching = false;
                        this.changeDetectorRef();
                    }
                });
            }, (err) => {
                //reset data on grid
                this.dataResult = {
                    'data': [],
                    'columns': this.dataResult && this.dataResult.columns ? this.dataResult.columns : [],
                    'totalResults': 0,
                    idSettingsGUI: this.moduleLocal.idSettingsGUI
                };
                this.totalResults = 0;
                this.numberOfEntries = 0;
                this.onSearchCompleted.emit();
                //show error
                this.toasterService.pop('error', 'Error', 'Search failed please try again');
                if (this.agGridComponent) {
                    this.agGridComponent.isSearching = false;
                    this.changeDetectorRef();
                }
            });
    }

    private browserTabId: string = Uti.defineBrowserTabId();
    public subscribeAdvanceSearchState() {

        const localStorageGSFieldCondition = LocalStorageKey.buildKey(LocalStorageKey.LocalStorageGSFieldCondition, this.browserTabId);
        this.advanceSearchSubscription = Observable.fromEvent<StorageEvent>(window, 'storage').filter((evt) => {
            return evt.key == localStorageGSFieldCondition && evt.newValue !== null && evt.newValue != 'undefined';
        }).subscribe(evt => {
            if (evt.newValue) {
                this.advancedSearchCondition = JSON.parse(evt.newValue);
                this.searchAdvanceData(this.advancedSearchCondition);
            }
        });
    }

    public reattach() {
        this._changeDetectorRef.reattach();
    }

    onHiddenWidgetInfoTranslation(event?: any) {
        this.isRenderWidgetInfoTranslation = false;
        this.dataResult = [];
        this.search();
    }

    public openTranslateDialog(event) {
        let translateInDialog = true;
        if (event && event.mode == 'row') {
            translateInDialog = false;
        }
        if (translateInDialog) {
            this.isRenderWidgetInfoTranslation = true;
            this.dataResult.fieldsTranslating = false;
            this.combinationTranslateMode = event ? event.mode : null;
            setTimeout(() => {
                if (this.widgetModuleInfoTranslationComponent)
                    this.widgetModuleInfoTranslationComponent.showDialog = true;
                this._changeDetectorRef.detectChanges();
                this.onPinGroupTranslateClick.emit(true);
            }, 250);
        }
    }

    private searchAdvanceData(advancedSearchCondition) {
        if (advancedSearchCondition.browserTabId && advancedSearchCondition.browserTabId != this.browserTabId)
            return;
        if (advancedSearchCondition.moduleId == this.moduleLocal.idSettingsGUI) {
            if (advancedSearchCondition.formData && advancedSearchCondition.formData.length) {
                this.searchAdvance(advancedSearchCondition.formData);
                let value = '';
                (advancedSearchCondition.formData as Array<any>).forEach(p => {
                    value += p.value + ' ';
                });
                this.hightlightKeywords = value;
            }
        }
    }

    public changeColumnLayoutMasterDetailData: any;
    public changeColumnLayoutMasterDetail($event) {
        this.changeColumnLayoutMasterDetailData = $event;
    }

    //#region FoundIn
    public foundInModalWidth = 0;
    public foundInModalHeight = 0;
    public foundInBodyHeight: any;
    public foundInDataResult: any;
    public foundInPageSize: number = 1000;

    public foundInShowDialog: boolean = false;
    public foundInOnIconClick($event) {
        //console.log($event);
        if (!$event || !$event.data || !$event.data.IdPerson) return;

        this.foundInModalWidth = window.screen.width - 200;
        this.foundInModalHeight = window.screen.height - 300;
        this.foundInBodyHeight = { 'height': (this.foundInModalHeight - 76) + 'px' };
        this.foundInShowDialog = true;

        const fieldName: Array<string> = ['idPerson'];
        const fieldValue: Array<string> = [$event.data.IdPerson];

        let searchIndex = '';
        switch ($event.type) {
            case 'Contact':
                searchIndex = $event.data.FoundIn.type;//customercontact, customerfootcontact
                break;
        }

        if (!searchIndex) return;
        this.searchService.search(searchIndex, this.keyword, this.moduleLocal.idSettingsGUI, 1, this.foundInPageSize, null, fieldName, fieldValue, true)
            .finally(() => {
                this.changeDetectorRef();
            })
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    response = response.item;
                    this.foundInDataResult = this.datatableService.buildDataSourceFromEsSearchResult(response, 1);
                });
            }, (err) => {
                //show error
                this.toasterService.pop('error', 'Error', 'Search Contact failed please try again');
                console.log(err);
            });
    }

    public foundInCloseDialog() {
        this.foundInShowDialog = false;
        this.foundInDataResult = false;
    }
    //#endregion

    private buildDataResultForModules() {
        if (!this.dataResult) return;

        this.dataResult.idSettingsGUI = this.moduleLocal.idSettingsGUI;
        switch (this.moduleLocal.idSettingsGUI) {
            case MenuModuleId.customer:
                this.dataResult.funcGetData = this.searchCustomerFoot.bind(this);
                break;
        }
    }

    private searchCustomerFoot(params) {
        //https://www.ag-grid.com/javascript-grid-server-side-model-tree-data/
        //console.log(params);
        if (params && params.parentNode && params.parentNode.data && params.parentNode.data.MatchingGroup) {
            const data = params.parentNode.data;
            this.searchService.searchCustomerFoot(data.MatchingGroup, this.lastKeyword)
                .subscribe((response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        response = response.item;
                        const model = this.datatableService.buildDataSourceFromEsSearchResult(response, 1);
                        if (model.data) {
                            model.data = model.data.filter(n => n.IdPerson != data.IdPerson);
                            params.successCallback(model.data, model.data.length);
                        }
                    });
                });
        }
    }
}
