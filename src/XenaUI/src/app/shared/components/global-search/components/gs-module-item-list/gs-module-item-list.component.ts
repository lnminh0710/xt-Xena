import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { GlobalSearchModuleModel } from 'app/models/global-seach-module.model';
import { Configuration, GlobalSearchConstant, MenuModuleId } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import { TabModel } from 'app/models/tab.model';
import { Module } from 'app/models/module';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from 'app/state-management/store';
import {
    TabSummaryActions,
    ModuleActions,
    GlobalSearchActions,
    CustomAction
} from 'app/state-management/store/actions';
import { GlobalSearchService, ModuleService, AppErrorHandler } from 'app/services';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'gs-module-item-list',
    templateUrl: './gs-module-item-list.component.html'
})
export class GlobalSeachModuleItemListComponent implements OnInit, OnDestroy {
    items: Array<string> = [];
    tabList: TabModel[];
    isWithStarStatus: boolean;
    model: any = {};
    globalSearchConfig: any = {};
    globalSearchModuleModels: Array<GlobalSearchModuleModel> = [];
    private searchingModuleState: Observable<Module>;
    private searchingModuleStateSubcription: Subscription;

    @Input() set tabs(tabs: TabModel[]) {
        this.tabList = tabs;
    }
    @Input() set isWithStar(isWithStar: boolean) {
        this.isWithStarStatus = isWithStar;
    }
    @Input() set globalItems(globalItems: Array<GlobalSearchModuleModel>) {
        //console.log(globalItems);
        this.globalSearchModuleModels = globalItems;
        this.changeDetectorRef();
    }
    @Input() set towWayConfig(towWayConfig: Array<GlobalSearchModuleModel>) {
        this.globalSearchConfig = towWayConfig;
    }
    @Input() set globalSearchItemClicked(towWayConfig: Array<GlobalSearchModuleModel>) {
        this.globalSearchConfig = towWayConfig;
    }

    @Input() mainModules: Module[] = [];
    @Input() subModules: Module[] = [];
    @Input() activeModule: Module = null;
    @Input() activeSubModule: Module = null;

    @Output() onGlobalSearchItemClicked: EventEmitter<any> = new EventEmitter();
    @Output() onGlobalSearchItemDoubleClicked: EventEmitter<any> = new EventEmitter();

    constructor(
        private globalSearchConsts: GlobalSearchConstant,
        private store: Store<AppState>,
        private moduleActions: ModuleActions,
        private tabSummaryActions: TabSummaryActions,
        private globalSearchService: GlobalSearchService,
        private moduleService: ModuleService,
        private globalSearchActions: GlobalSearchActions,
        private dispatcher: ReducerManagerDispatcher,
        private _changeDetectorRef: ChangeDetectorRef,
        private appErrorHandler: AppErrorHandler
    ) {
        this.searchingModuleState = store.select(state => state.mainModule.searchingModule);
    }

    public ngOnInit() {
        this.subscribeData();
        // this.subscribeChangeItemLocalStorageState();
    }

    public subscribeData() {
        this.searchingModuleStateSubcription = this.searchingModuleState.subscribe((searchModule: Module) => {
            this.appErrorHandler.executeAction(() => {
                if (searchModule && searchModule.searchKeyword) {
                    setTimeout(() => {
                        const rs = this.globalSearchModuleModels.filter(p => p.idSettingsGUI === searchModule.idSettingsGUI);
                        if (rs.length) {
                            const globalItem = rs[0];
                            this._globalItemDoubleClicked(globalItem, searchModule.searchKeyword);
                        }
                    });
                }
            });
        });
    }

    /**
     * subscribeChangeItemLocalStorageState
     */
    //private subscribeChangeItemLocalStorageState() {
    //    if (!Configuration.PublicSettings.enableGSNewWindow) return;

    //    this.dispatcher.filter((action: CustomAction) => {
    //        return action.type === GlobalSearchActions.CHANGE_MODULE_TAB_STORAGE;
    //    }).subscribe((data: CustomAction) => {
    //        this.appErrorHandler.executeAction(() => {
    //            this.globalItemDoubleClicked(data.payload, true);
    //        });
    //    });
    //}


    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public globalItemClicked(globalItem: GlobalSearchModuleModel) {
        for (const item of this.globalSearchModuleModels) {
            item.isClicked = false;
            if (globalItem.moduleName === item.moduleName) {
                item.isClicked = true;
            }
        }

        this.globalSearchConfig.isAdministrationClicked = (globalItem.moduleName === this.globalSearchConsts.searchAdministration);

        // Used for Selection Modules
        switch (globalItem.idSettingsGUI) {
            case MenuModuleId.selectionBroker:
            //case MenuModuleId.selectionCampaign:
            case MenuModuleId.selectionCollect:
                this.globalSearchConfig.isAdministrationClicked = true;
                break;
        }
        this.onGlobalSearchItemClicked.emit(globalItem);
    }

    public globalItemDoubleClicked(globalItem: GlobalSearchModuleModel, fromLocalStorage?) {
        this._globalItemDoubleClicked(globalItem, null);
        if (Configuration.PublicSettings.enableGSNewWindow && !fromLocalStorage) {
            this.store.dispatch(this.globalSearchActions.changeModuleTab(globalItem));
            this.store.dispatch(this.globalSearchActions.updateTab(this.tabList));
        }
    }

    private _globalItemDoubleClicked(globalItem: GlobalSearchModuleModel, searchKeyword) {
        this.globalSearchService.setAllTabActive(false, this.tabList);
        //
        let title = globalItem.moduleName;
        switch (globalItem.idSettingsGUI) {
            case MenuModuleId.selectionBroker:
            //case MenuModuleId.selectionCampaign:
            case MenuModuleId.selectionCollect:
                title = this.getChildrenTabName(globalItem);
                break;
        }

        if (!this.globalSearchService.checkTabExists(title, this.tabList)) {
            this.tabList.push({
                id: globalItem.gridId,
                title: title,
                active: true,
                removable: true,
                textSearch: searchKeyword ? searchKeyword : this.tabList[0].textSearch,
                module: new Module(Object.assign({}, globalItem)),
                searchIndex: this.makeSearchIndexKey(globalItem),
                isWithStar: this.isWithStar,
                histories: []
            });
        } else {
            if (!searchKeyword) {
                searchKeyword = this.tabList[0].textSearch;
            }
            this.globalSearchService.setTabActive(title, true, this.tabList, searchKeyword);
        }

        setTimeout(() => {
            let a = this.tabList;
        }, 2000);

        this.updateModuleToStore(globalItem);
        this.onGlobalSearchItemDoubleClicked.emit(globalItem);
    }

    private makeSearchIndexKey(globalItem: any) {
        if (!globalItem.children || !globalItem.children.length) {
            return globalItem.searchIndexKey;
        }
        return globalItem.children.map(p => p.searchIndexKey).join(',');
    }

    private getChildrenTabName(currentGlobalItem: any): string {
        if (this.mainModules) {
            const currentMainModule = this.mainModules.find(x => x.idSettingsGUI === currentGlobalItem.idSettingsGUIParent);
            if (currentMainModule) {
                return currentMainModule.moduleName + ' - ' + currentGlobalItem.moduleName;
            }
        }
        return '';
    }

    private updateModuleToStore(globalItem) {
        const selectedModule = new Module(globalItem);
        this.moduleService.loadContentDetailBySelectedModule(selectedModule, this.activeModule, this.activeSubModule, this.mainModules);
    }

    public itemsTrackBy(index, item) {
        return item ? item.idSettingsGUI : undefined;
    }

    private changeDetectorRef() {
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        }, 300);
    }
}
