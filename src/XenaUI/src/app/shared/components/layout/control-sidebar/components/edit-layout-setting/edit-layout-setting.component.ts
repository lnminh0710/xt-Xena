import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
    CustomAction,
    LayoutSettingActions,
    ModuleSettingActions,
} from 'app/state-management/store/actions';
import { Uti, LocalStorageHelper, LocalStorageProvider, String } from 'app/utilities';
import {
    AppErrorHandler,
    LayoutSettingService,
    GlobalSettingService,
    SignalRService
} from 'app/services';
import {
    TabSummaryModel,
    GlobalSettingModel
} from 'app/models';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GlobalSettingConstant, SignalRActionEnum } from 'app/app.constants';

@Component({
    selector: 'app-edit-layout-setting',
    styleUrls: ['./edit-layout-setting.component.scss'],
    templateUrl: './edit-layout-setting.component.html'
})

export class EditLayoutSettingComponent extends BaseComponent implements OnInit, OnDestroy {

    private moduleSettingItem: any;//used for close and refesh layout
    private layoutObj: any;//Current Tab and it contains current Golden layout
    public itemDragSource = [
        {
            title: 'Page / Tab',
            type: 'Page',
            icon: 'fa fa-file-o'
        }
    ];

    private selectedTabState: Observable<TabSummaryModel>;
    private selectedODETabState: Observable<any>;
    private requestEditLayoutTogglePanelStateSubscription: Subscription;
    private selectedTabStateSubscription: Subscription;
    private selectedODETabStateSubscription: Subscription;
    private selectedTab: TabSummaryModel;
    private globalSettingServiceSubscription: Subscription;

    constructor(protected router: Router,
        private store: Store<AppState>,
        private dispatcher: ReducerManagerDispatcher,
        private layoutSettingActions: LayoutSettingActions,
        private layoutSettingService: LayoutSettingService,
        private appErrorHandler: AppErrorHandler,
        private toasterService: ToasterService,
        private moduleSettingActions: ModuleSettingActions,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private signalRService: SignalRService) {
        super(router);

        this.selectedTabState = store.select(state => tabSummaryReducer.getTabSummaryState(state, this.ofModule.moduleNameTrim).selectedTab);
        this.selectedODETabState = store.select(state => tabSummaryReducer.getTabSummaryState(state, this.ofModule.moduleNameTrim).selectedODETab);
    }

    ngOnInit() {
        this.subscribe();
    }

    ngOnDestroy() {
        this.layoutSettingService.destroy();
        this.sendMessageStopEditing();
        Uti.unsubscribe(this);
    }

    private subscribe() {
        // Called when clicking on 'Design Page Layout' --> Init all Tabs
        // All data of them will be contained in layoutSettingService: layoutMappingArray
        this.requestEditLayoutTogglePanelStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === LayoutSettingActions.REQUEST_TOGGLE_PANEL && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                if (data.payload) {
                    this.prepareLayoutSetting();
                }
            });
        });

        //Only called When a Summary Tab is selected
        this.selectedTabStateSubscription = this.selectedTabState.subscribe((selectedTabState: TabSummaryModel) => {
            this.appErrorHandler.executeAction(() => {
                this.selectedTab = selectedTabState;
                if (this.selectedTab && this.selectedTab.tabSummaryInfor) {
                    this.loadGoldenLayout(this.selectedTab.tabSummaryInfor.tabID);
                }
            });
        });

        //Only called When a Order DataEntry Tab is selected
        this.selectedODETabStateSubscription = this.selectedODETabState.subscribe((selectedODETabState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.selectedTab = selectedODETabState;
                if (this.selectedTab && this.selectedTab['TabID']) {
                    this.loadGoldenLayout(this.selectedTab['TabID']);
                }
            });
        });
    }

    private prepareLayoutSetting(callback?: Function, editMode?: boolean) {
        this.globalSettingServiceSubscription = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!data || !(data instanceof Array)) return;

                const globalSettingName = String.Format('{0}_{1}', this.globalSettingConstant.moduleLayoutSetting, String.hardTrimBlank(this.ofModule.moduleName));
                let globalSettingItem = data.find(x => x.globalName && x.idSettingsGlobal && x.globalName === globalSettingName);
                if (!globalSettingItem)
                    globalSettingItem = data.find(x => x.globalName === globalSettingName);

                if (globalSettingItem && globalSettingItem.jsonSettings) {
                    let moduleSetting = JSON.parse(globalSettingItem.jsonSettings);
                    if (moduleSetting.item) {
                        const jsonSettings = JSON.parse(moduleSetting.item[0].jsonSettings);
                        this.layoutSettingService.translateLayoutSetting2GoldenLayoutSetting(jsonSettings, editMode);

                        if (callback) {
                            callback();
                        }
                    }
                }
            });
        });
    }

    private loadGoldenLayout(tabID: any) {
        let init = () => {
            this.layoutObj = this.layoutSettingService.createLayoutWithLayoutContent(tabID);
            //Tab already loaded -> init Golden Layout
            this.initGoldenLayout();
        };

        if (!this.layoutSettingService.isTranslateXenaLayoutToGoldenLayout()) {
            this.prepareLayoutSetting(init);
        }
        else {
            init();
        }
    }

    private initGoldenLayoutTimeout: any;
    //Tab already loaded -> init Golden Layout
    private initGoldenLayout() {
        clearTimeout(this.initGoldenLayoutTimeout);
        this.initGoldenLayoutTimeout = null;

        this.initGoldenLayoutTimeout = setTimeout(() => {
            if (this.layoutObj && this.layoutObj.goldenLayout) {
                let cachedConfigContent = this.layoutObj.goldenLayout.cachedConfigContent;
                let configContent = cachedConfigContent && cachedConfigContent.length ? cachedConfigContent : this.layoutObj.goldenContent;
                this.layoutObj.goldenLayout.initLayout(configContent);
            }
        }, 500);//must delay to div-Container is rendered. Because golden layout bases on this div-Container
    }

    public save($event) {
        if ($event) $event.preventDefault();

        if (!this.layoutObj) return;

        let layoutSettingContent = this.layoutSettingService.convertGoldenLayoutContent2PageLayoutContent();
        console.log('xenaLayoutSettingContent', layoutSettingContent);

        //Get Global settings from cache -> update jsonSettings -> Save Database
        this.globalSettingServiceSubscription = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                const globalSettingName = String.Format('{0}_{1}', this.globalSettingConstant.moduleLayoutSetting, String.hardTrimBlank(this.ofModule.moduleName));
                let globalSettingItem = (!data || !(data instanceof Array)) ? null : data.find(x => x.globalName === globalSettingName);

                //#region Parse  ModuleSetting
                let moduleSetting: any = null;
                let originalJsonSettingsString: string = null;
                if (globalSettingItem && globalSettingItem.jsonSettings) {
                    moduleSetting = JSON.parse(globalSettingItem.jsonSettings);
                    if (!moduleSetting.item) return;

                    originalJsonSettingsString = moduleSetting.item[0].jsonSettings;
                    moduleSetting.item[0].jsonSettings = JSON.parse(moduleSetting.item[0].jsonSettings);
                }
                //#endregion

                //#region Prepare layout Setting Content
                const editMode: boolean = false;
                let customTabs = moduleSetting.item[0].jsonSettings.Content.CustomTabs;
                for (let i = 0, length = customTabs.length; i < length; i++) {
                    let tab = customTabs[i];
                    if (tab && tab.TabID && tab.TabID == this.layoutObj.tabID) {
                        layoutSettingContent.TabID = this.layoutObj.tabID;
                        layoutSettingContent.TabName = this.layoutObj.tabName;
                        layoutSettingContent.Toolbar = tab.Toolbar;

                        let tabContent = tab.TabContent || {};
                        if (editMode) {
                            const originalId = tabContent.editMode.ID;
                            tabContent.EditMode = layoutSettingContent;
                            if (tabContent.EditMode.ID != originalId)
                                tabContent.EditMode.ID = originalId;
                        }
                        else {
                            const originalId = tabContent.ViewMode.ID;
                            tabContent.ViewMode = layoutSettingContent;
                            if (tabContent.ViewMode.ID != originalId)
                                tabContent.ViewMode.ID = originalId;
                        }

                        tab.TabContent = tabContent;
                        customTabs[i] = tab;
                        break;
                    }
                }//for
                //#endregion

                //If don't change -> do nothing
                const updateJsonSettingsString = JSON.stringify(moduleSetting.item[0].jsonSettings);
                if (originalJsonSettingsString == updateJsonSettingsString) return;

                //#region Save GlobalSetting
                if (!globalSettingItem || !globalSettingItem.idSettingsGlobal || !globalSettingItem.globalName) {
                    globalSettingItem = new GlobalSettingModel({
                        globalName: globalSettingName,
                        description: 'Module Layout Setting',
                        globalType: this.globalSettingConstant.moduleLayoutSetting,
                        idSettingsGUI: this.ofModule.idSettingsGUI,
                        isActive: true,
                        objectNr: this.ofModule.idSettingsGUI.toString()
                    });
                }

                moduleSetting.item[0].jsonSettings = updateJsonSettingsString;
                globalSettingItem.jsonSettings = JSON.stringify(moduleSetting);
                globalSettingItem.idSettingsGUI = this.ofModule.idSettingsGUI;

                //console.log('globalSettingItem for saving', globalSettingItem);
                this.globalSettingServiceSubscription = this.globalSettingService.saveGlobalSetting(globalSettingItem)
                    .subscribe((result: any) => {
                        //console.log(result)
                        if (result && result.returnValue) {
                            this.toasterService.pop('success', 'Success', 'Save settings successfully');

                            //saveUpdateCache
                            this.globalSettingService.saveUpdateCache(this.ofModule.idSettingsGUI, globalSettingItem, result);

                            this.moduleSettingItem = moduleSetting.item;

                            this.sendMessageSavedSuccessfully();
                        }
                    });
                //#endregion
            });
        });
    }

    public close($event) {
        if ($event) $event.preventDefault();

        this.layoutSettingService.turnOffFullScreenWidget = false;
        this.sendMessageStopEditing();
        if (this.layoutObj && this.layoutObj.goldenLayout) {
            this.layoutObj.goldenLayout.destroyLayout();
        }

        if (this.moduleSettingItem) {
            this.store.dispatch(this.moduleSettingActions.loadModuleSettingSuccess(this.moduleSettingItem, this.ofModule));//Refresh layout
        }

        this.store.dispatch(this.layoutSettingActions.updateEditModeStatus(false, this.ofModule));
    }

    public restore($event) {
        if ($event) $event.preventDefault();

        if (this.layoutObj && this.layoutObj.goldenLayout) {
            const xenaContent = this.layoutObj.xenaContent;
            const goldenContent = this.layoutSettingService.convertPageLayoutContent2GoldenLayoutContent(xenaContent);
            this.layoutObj.goldenContent = goldenContent;

            this.layoutObj.goldenLayout.destroyLayout();
            this.layoutObj.goldenLayout.initLayout(goldenContent);
        }
    }

    public undo($event) {
        if ($event) $event.preventDefault();

        if (this.layoutObj && this.layoutObj.goldenLayout) {
            const configContent = this.layoutObj.goldenLayout.popCacheConfigContent();
            if (configContent)
                this.layoutObj.goldenLayout.initLayout(configContent);
        }
    }

    //#region SignalR
    private sendMessageStopEditing() {
        if (!this.signalRService.designLayoutIsWorking) return;

        this.signalRService.designLayoutIsWorking = false;
        this.signalRService.sendMessageDesignLayout(SignalRActionEnum.DesignLayout_StopEditing, this.ofModule.idSettingsGUI);
    }

    private sendMessageSavedSuccessfully() {
        if (!this.signalRService.designLayoutIsWorking) return;

        this.signalRService.sendMessageDesignLayout(SignalRActionEnum.DesignLayout_SavedSuccessfully, this.ofModule.idSettingsGUI);
    }
    //#endregion
}
