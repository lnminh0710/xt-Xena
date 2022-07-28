import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { SubLayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
    GlobalSettingService, AppErrorHandler
} from 'app/services';
import {
    GlobalSettingModel,
    Module,
    HotKey
} from 'app/models';
import { GlobalSettingConstant,
    RequestSavingMode,
    Configuration } from 'app/app.constants';
import {
    XnCommonActions,
    ProcessDataActions,
    ModuleSettingActions,
    HotKeySettingActions,
    TabSummaryActions,
    CustomAction,
    LayoutSettingActions,
    TabButtonActions,

    DataEntryActions
} from 'app/state-management/store/actions';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { LayoutInfoActions } from 'app/state-management/store/actions';
import cloneDeep from 'lodash-es/cloneDeep';
import { Uti, String } from 'app/utilities';

@Component({
    selector: 'order-data-entry-tab',
    templateUrl: './order-data-entry-tab.component.html',
    styleUrls: ['./order-data-entry-tab.component.scss'],
    host: {
        '(mousemove)': 'onMouseEnter()'
    }
})

export class OrderDataEntryTabComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    public isHotKeyActive: boolean = false;
    public tabContainerStyle: Object = {};
    public tabs: any[] = [];
    public config: any = {
        left: 68,
        right: 32
    };
    public configWidth: any = { left: 0, right: 0, spliter: 0 };
    public perfectScrollbarConfigForAI: any = {
        suppressScrollX: true,
        suppressScrollY: true
    };
    public setting: any;
    public showAddTabButton = true;
    private tabListSettings: any;
    private globalSettingName = '';
    private willChangeTab: any;
    private willRemoveTab: any;
    private editLayout: boolean = false;

    private consts: Configuration = new Configuration();
    private keyBuffer: Array<any> = [];
    private keyBufferKeep: Array<any> = [];
    private timeoutKeyup: any;

    private layoutInfoStateSubscription: Subscription;
    private layoutInfoState: Observable<SubLayoutInfoState>;
    private globalSettingServiceSubscription: Subscription;
    private hotKeyState: Observable<any>;
    private hotKeyStateSubscription: Subscription;
    private okToChangeTabSubscription: Subscription;
    private okToRemoveTabSubscription: Subscription;

    private requestEditLayoutStateSubscription: Subscription;
    private requestChangeTabStateSubscription: Subscription;

    private contentDisplayModeState: Observable<string>;

    @Input() set tabSetting(tabSetting: any) {
        this.setting = tabSetting;

        setTimeout(() => {
            this.getTabListFromGlobalSetting();
        }, 200);
    }

    private keyDownStatus = false;

    @HostListener('document:keyup.out-zone', ['$event'])
    onKeyUp(event) {
        const e = <KeyboardEvent>event;
        if (e.keyCode == 34) return; // Pagedown to save data
        this.removeKeyUpIntoBuffer(e.keyCode);
    }

    // Support to be able to press double key press for Hotkey feature
    @HostListener('document:keydown.out-zone', ['$event'])
    onKeyDown(event) {
        const e = <KeyboardEvent>event;
        this.pushKeyDownIntoBuffer(e.keyCode);
        // Uti.disabledEventPropagation(event, true, false);
        this.setHotKeyActiveValue(e);
    }

    constructor(
        private store: Store<AppState>,
        private elmRef: ElementRef,
        private tabSummaryActions: TabSummaryActions,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private commonActions: XnCommonActions,
        private processDataActions: ProcessDataActions,
        private moduleSettingActions: ModuleSettingActions,
        private hotKeySettingActions: HotKeySettingActions,
        private dispatcher: ReducerManagerDispatcher,
        private layoutInfoActions: LayoutInfoActions,
        protected router: Router,
        private appErrorHandler: AppErrorHandler,
        private tabButtonActions: TabButtonActions
    ) {
        super(router);

        this.layoutInfoState = store.select(state => layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim));
        this.hotKeyState = this.store.select(state => commonReducer.getCommonState(state, this.ofModule.moduleNameTrim).hotKey);
        this.contentDisplayModeState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).contentDisplayMode);
    }

    ngOnInit() {
        this.subcribeLayoutInfoState();
        this.subscribeHotkeyState();
        this.subcribeOkToChangeTabState();
        this.subcribeOkToRemoveTabState();
        this.subcribeRequestChangeTabState();
        this.getModule();
        this.store.dispatch(this.hotKeySettingActions.loadHotKeySetting(this.ofModule));
    }

    ngAfterViewInit() {
        window.addEventListener('blur', () => {
            this.keyBuffer = [];
        });
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }    

    private subcribeOkToChangeTabState() {
        this.okToChangeTabSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.OK_TO_CHANGE_TAB && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                if (this.willChangeTab) {
                    const activeTabs = this.tabs.filter(p => p.active);
                    activeTabs.forEach(_tab => {
                        _tab.active = false;
                    });
                    this.willChangeTab.active = true;
                    this.willChangeTab.loaded = true;

                    this.store.dispatch(this.moduleSettingActions.selectToolbarSetting(this.willChangeTab.Toolbar, this.ofModule));
                    this.store.dispatch(this.tabSummaryActions.selectODETab(this.willChangeTab, ModuleList.OrderDataEntry));

                    this.reloadAndSaveTabsConfig();

                    this.willChangeTab = null;

                    this.store.dispatch(this.tabSummaryActions.toggleTabButton(true, this.ofModule));
                }
            });
        });
    }

    private subcribeOkToRemoveTabState() {
        this.okToChangeTabSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.OK_TO_REMOVE_TAB && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                if (this.willRemoveTab) {
                    if (!this.tabs.length || this.tabs.length === 1) {
                        return;
                    }

                    this.willRemoveTab['visible'] = false;
                    this.willRemoveTab['active'] = false;

                    this.selectFirstVisibleTab(this.tabs);
                    this.showAddTabButton = !this.isAllTabsVisible(this.tabs);

                    this.reloadAndSaveTabsConfig();

                    this.willRemoveTab = null;
                }
            });
        });
    }

    selectTab(tab: any) {
        this.willChangeTab = tab;

        this.store.dispatch(this.processDataActions.requestChangeTab(null, ModuleList.OrderDataEntry));
    }

    selectFirstVisibleTab(tabs) {
        if (!tabs || !tabs.length) {
            return true;
        }

        for (const tab of tabs) {
            if (tab['visible']) {
                this.selectTab(tab);
                return;
            }
        }
    }

    removeTab(tab: any) {
        if (tab) {
            this.willRemoveTab = tab;

            this.store.dispatch(this.processDataActions.requestRemoveTab(null, ModuleList.OrderDataEntry));
        }
    }

    private getModule() {
        this.globalSettingName = String.Format('{0}_{1}',
            this.globalSettingConstant.orderDataEntryTabList,
            String.hardTrimBlank(this.ofModule.moduleName));
    }

    private getTabListFromGlobalSetting() {
        this.globalSettingServiceSubscription = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                this.tabs = this.buildTabs(this.setting);

                this.tabs = this.buildTabsFromGlobalSetting(this.tabs, data);

                this.showAddTabButton = !this.isAllTabsVisible(this.tabs);

                let activeTab = this.tabs.find(x => x.active);
                if (activeTab) {
                    this.selectTab(activeTab);
                }
            });
        });
    }

    private buildTabsFromGlobalSetting(tabs: any[], data: GlobalSettingModel[]): any[] {
        if (!data || !data.length || !Array.isArray(data)) {
            return tabs;
        }
        this.tabListSettings = data.find(x => x.globalName === this.globalSettingName);
        if (!this.tabListSettings || !this.tabListSettings.idSettingsGlobal) {
            return tabs;
        }
        const tabShowSetting = JSON.parse(this.tabListSettings.jsonSettings) as Array<any>;
        if (!tabShowSetting || !tabShowSetting.length) {
            return tabs;
        }

        tabs.forEach(tab => {
            tab.visible = false;
            tab.active = false;
        });

        for (const tab of tabs) {
            for (const settingTab of tabShowSetting) {
                if (tab.TabID === settingTab.tabID) {
                    tab.visible = true;
                    tab.active = settingTab.active;
                }
            }
        }

        return tabs;
    }

    private buildTabs(tabSetting) {
        if (!tabSetting || !tabSetting.Content || !tabSetting.Content.CustomTabs) {
            return [];
        }

        const result = tabSetting.Content.CustomTabs;
        for (let i = 0; i < result.length; i++) {
            result[i]['active'] = i === 0;
            result[i]['visible'] = i === 0;
        }

        return result;
    }

    private isAllTabsVisible(tabs) {
        if (!tabs || !tabs.length) {
            return true;
        }

        for (const tab of tabs) {
            if (!tab['visible']) {
                return false;
            }
        }

        return true;
    }

    private isAllTabsInactive(tabs) {
        if (!tabs || !tabs.length) {
            return true;
        }

        for (const tab of tabs) {
            if (tab['active']) {
                return false;
            }
        }

        return true;
    }

    private subcribeLayoutInfoState() {
        this.layoutInfoStateSubscription = this.layoutInfoState.subscribe((layoutInfo: SubLayoutInfoState) => {
            this.appErrorHandler.executeAction(() => {
                this.tabContainerStyle = {
                    // 'height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.smallTabHeaderHeight}px - ${layoutInfo.smallHeaderLineHeight}px - ${layoutInfo.dashboardPaddingTop}px)`
                    'height': `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.smallTabHeaderHeight}px - ${layoutInfo.smallHeaderLineHeight}px - ${layoutInfo.dashboardPaddingTop}px)`
                };
            });
        });

        this.requestEditLayoutStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === LayoutSettingActions.REQUEST_TOGGLE_PANEL && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).map((action: CustomAction) => {
            return action.payload;
        }).subscribe((isShow: any) => {
            this.appErrorHandler.executeAction(() => {
                this.editLayout = isShow;
            });
        });
    }

    private subcribeRequestChangeTabState() {
        this.requestChangeTabStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === DataEntryActions.DATA_ENTRY_REQUEST_CHANGE_TAB;
        }).map((action: CustomAction) => {
            return action.payload;
        }).subscribe((tabId: any) => {
            this.appErrorHandler.executeAction(() => {
                if (tabId) {
                    let selectTab = this.tabs.find(x => x.TabID == tabId);
                    if (selectTab) {
                        this.selectTab(selectTab);
                    }
                }
            });
        });
    }

    /**
     * subscribeHotkeyState
     */
    private subscribeHotkeyState() {
        this.hotKeyStateSubscription = this.hotKeyState.subscribe((hotkey: HotKey) => {
            this.appErrorHandler.executeAction(() => {
                if (hotkey) {
                    this.isHotKeyActive = hotkey.altKey;
                }
            });
        });
    }

    public dragStart() {
        Uti.handleWhenSpliterResize();
    }

    public dragEnd(event: any) {
        setTimeout(() => {
            const leftSize = $('.xn__tab-content__split', this.elmRef.nativeElement).innerWidth();
            const rightSize = $('.additional-information__split', this.elmRef.nativeElement).innerWidth();
            const spliters = $('split-gutter', this.elmRef.nativeElement);
            const lastSpliter = $(spliters[spliters.length - 1]);
            const splitSize = lastSpliter.innerWidth();
            const totalSize = leftSize + rightSize + splitSize;

            if (!lastSpliter.is(':visible')) { return; }
            this.configWidth.left = ((leftSize + splitSize / 2) * 100) / totalSize;
            this.configWidth.right = ((rightSize + splitSize / 2) * 100) / totalSize;
            this.configWidth.spliter = splitSize;
            this.store.dispatch(this.layoutInfoActions.resizeSplitter(this.ofModule));
        }, 200);
    }

    public dropdownItemClickedHandler(tab) {
        const clickedTab = this.tabs.find(t => t.TabID === tab.TabID);
        if (clickedTab) {
            clickedTab['visible'] = true;

            if (this.isAllTabsInactive(this.tabs)) {
                clickedTab['active'] = true
            }

            this.showAddTabButton = !this.isAllTabsVisible(this.tabs);

            this.reloadAndSaveTabsConfig();
        }
    }

    public onMouseEnter() {
        this.store.dispatch(this.tabSummaryActions.toggleTabButton(true, this.ofModule));
    }

    private reloadAndSaveTabsConfig() {
        this.globalSettingServiceSubscription = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                this.saveTabsConfig(data);
            });
        });
    }
    private saveTabsConfig(data: GlobalSettingModel[]) {
        if (!data || !data.length || !Array.isArray(data)) return;

        this.tabListSettings = data.find(x => x.globalName === this.globalSettingName);
        if (!this.tabListSettings || !this.tabListSettings.idSettingsGlobal || !this.tabListSettings.globalName) {
            this.tabListSettings = new GlobalSettingModel({
                globalName: this.globalSettingName,
                description: 'Order Data Entry Tab List',
                globalType: this.globalSettingConstant.orderDataEntryTabList
            });
        }
        this.tabListSettings.idSettingsGUI = this.ofModule.idSettingsGUI;
        const visibleTabs = this.tabs.filter(t => t.visible === true);
        this.tabListSettings.jsonSettings = JSON.stringify(this.getShowTabsNameToList(visibleTabs));
        this.tabListSettings.isActive = true;

        this.globalSettingServiceSubscription = this.globalSettingService.saveGlobalSetting(this.tabListSettings).subscribe(
            _data => this.saveTabsConfigSuccess(_data),
            error => this.saveTabsConfigError(error));
    }

    private getShowTabsNameToList(tabs: any[]): Array<string> {
        const result: Array<any> = [];
        for (const item of tabs) {
            result.push({
                tabID: item.TabID,
                active: item.active
            });
        }
        return result;
    }

    private saveTabsConfigSuccess(data: any) {
        this.globalSettingService.saveUpdateCache(this.ofModule.idSettingsGUI, this.tabListSettings, data);
    }

    private saveTabsConfigError(error) {
        Uti.logError(error);
    }

    private pushKeyDownIntoBuffer(keyCode: any) {
        if (!this.keyBuffer.length) {
            this.keyBufferKeep.length = 0;
        }
        if (this.keyBuffer && this.keyBuffer.indexOf(keyCode) === -1 &&
                ((keyCode > 64 && keyCode < 91) ||  // from A -> Z
                (keyCode > 15 && keyCode < 19) ||  // Ctr + Shift + Alt
                (keyCode > 47 && keyCode < 58))) { // 0 -> 9
            this.keyBuffer.push(keyCode);
        }
        // if (this.keyBuffer.length > 1) {
            this.keyBufferKeep = cloneDeep(this.keyBuffer);
            this.buildKeyName();
        // }
    }

    private removeKeyUpIntoBuffer(keyCode: any) {
        if (this.keyBuffer && this.keyBuffer.indexOf(keyCode) > -1) {
            this.keyBuffer = this.keyBuffer.filter(x => x !== keyCode);
        }
        if (this.timeoutKeyup) {
            clearTimeout(this.timeoutKeyup);
            this.timeoutKeyup = null;
        }
        this.timeoutKeyup = setImmediate(() => {
            if (this.keyBuffer.length === 0) return;
            this.buildKeyName();
        }, 300);
    }

    private buildKeyName() {
        if (this.keyBufferKeep.length === 0) {
            this.store.dispatch(this.commonActions.addHotKey(new HotKey({
                altKey: this.isHotKeyActive,
                keyCombineCode: null
            }), this.ofModule));
            return;
        }
        this.keyBufferKeep = this.keyBufferKeep.sort((a, b) => a - b);
        let displayText = '';
        for (let i = 0; i < this.keyBufferKeep.length; i++) {
            displayText += this.consts.keyCode[this.keyBufferKeep[i]];
            if (i < this.keyBufferKeep.length - 1) { 
                displayText += '+';
            }
        }

        this.store.dispatch(this.commonActions.addHotKey(new HotKey({
            altKey: this.isHotKeyActive,
            keyCombineCode: displayText
        }), this.ofModule));
        // console.log(displayText);
    }

    private setHotKeyActiveValue(e: any) {
        if (e.keyCode !== 18 || this.keyBufferKeep.length > 1) { // Alt key: 18
            return;
        }

        this.store.dispatch(this.commonActions.addHotKey(new HotKey({
            altKey: !this.isHotKeyActive,
            keyCombineCode: null
        }), this.ofModule));
        $('input').each(function () { $(this).blur(); });
        e.preventDefault();
    }

}
