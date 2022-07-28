import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    AdditionalInfromationMainModel,
    GlobalSettingModel,
    Module
} from 'app/models';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
    AdditionalInformationActions,
    GridActions,
    LayoutInfoActions
} from 'app/state-management/store/actions';
import { Observable } from 'rxjs/Observable';
import { PageSize } from 'app/app.constants';
import { EditingWidget } from 'app/state-management/store/reducer/widget-content-detail';
import { Subscription } from 'rxjs/Subscription';
import { GlobalSettingService } from 'app/services';
import { GlobalSettingConstant } from 'app/app.constants';
import { AppErrorHandler } from 'app/services';
import * as uti from 'app/utilities';
import { XnAdditionalInformationTabComponent } from '../xn-ai-tab';
import { BaseComponent } from 'app/pages/private/base';
import * as additionalInformationReducer from 'app/state-management/store/reducer/additional-information';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import { Uti } from 'app/utilities';

@Component({
    selector: 'app-xn-ai-main',
    styleUrls: ['./xn-ai-main.component.scss'],
    templateUrl: './xn-ai-main.component.html'
})
export class XnAdditionalInformationMainComponent extends BaseComponent implements OnInit, OnDestroy {

    public additionalInformation: AdditionalInfromationMainModel;
    public additionalInformationOn = false;
    private localConfig: any;
    private currentWidth: any = { left: 0, right: 0, spliter: 0 };
    private editingWidgetsState: Observable<Array<EditingWidget>>;
    private editingWidgetsStateSubscription: Subscription;
    private getGlobalSettingSubcirbe: Subscription;
    public editingWidgetStatus = false;
    private currentGlobalSettingModel: any;
    private showAIPaneState: Observable<any>;
    private showAIPaneStateSubscription: Subscription;
    private isStoredSessionSize = false;
    public collapseExpandStyle: any;

    @Input()
    set data(data: AdditionalInfromationMainModel) {
        this.additionalInformation = data;
    }
    @Input()
    set config(data: any) {
        this.localConfig = data;
    }
    @Input()
    set configWidth(data: any) {
        this.currentWidth = data;
    }

    @ViewChild(XnAdditionalInformationTabComponent) xnAdditionalInformationTabComponent: XnAdditionalInformationTabComponent;

    constructor(
        private store: Store<AppState>,
        private pageSize: PageSize,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private appErrorHandler: AppErrorHandler,
        private gridActions: GridActions,
        private additionalInformationActions: AdditionalInformationActions,
        private layoutInfoActions: LayoutInfoActions,
        protected router: Router
    ) {
        super(router);

        this.editingWidgetsState = store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.ofModule.moduleNameTrim).editingWidgets);
        this.showAIPaneState = store.select(state => additionalInformationReducer.getAdditionalInformationState(state, this.ofModule.moduleNameTrim).showAIPane);
    }

    ngOnInit() {
        this.setCollapseExpandStyle(0);
        this.setAISessionSize();
        this.subscription();
        setTimeout(() => {
            this.getExpandCollapse();
        }, 200);
    }

    ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    private setCollapseExpandStyle(opactiy: any) {
        this.collapseExpandStyle = {
            'opacity': opactiy
        };
    }

    private subscription() {
        this.subscribeWidgetState();
        this.subscribeShowAIPaneState();
    }

    private subscribeWidgetState() {
        this.editingWidgetsStateSubscription = this.editingWidgetsState.subscribe((editingWidgets: Array<EditingWidget>) => {
            this.appErrorHandler.executeAction(() => {
                if (editingWidgets && this.additionalInformation) {
                    this.editingWidgetStatus = false;
                    this.additionalInformation.SimpleTabs.forEach(tab => {
                        if (tab.TabContent.Page) {
                            const rs = editingWidgets.filter(p => p.pageId === tab.TabContent.Page.PageId);
                            if (rs && rs.length > 0) {
                                this.editingWidgetStatus = true;
                            }
                        }                        
                    });
                }
            });
        });
    }

    private setAISessionSize() {
        setTimeout(() => {
            const spliters = $('split-gutter');
            const lastSpliter = $(spliters[spliters.length - 1]);
            if (!lastSpliter || !lastSpliter.length) {
                this.setAISessionSize();
                return;
            }
            const leftSize = $('.xn__tab-content__split').innerWidth();
            const rightSize = $('.additional-information__split').innerWidth();
            const splitSize = lastSpliter.innerWidth();
            this.currentWidth.spliter = splitSize;
            const totalSize = leftSize + rightSize + splitSize;
            this.currentWidth.left = ((leftSize + splitSize / 2) * 100) / totalSize;
            this.currentWidth.right = ((rightSize + splitSize / 2) * 100) / totalSize;
            lastSpliter.dblclick(() => { this.showPanelClick(this.additionalInformationOn); });
            this.isStoredSessionSize = true;
        }, 50);
    }

    private subscribeShowAIPaneState() {
        this.showAIPaneStateSubscription = this.showAIPaneState.subscribe((showAIPaneState: any) => {
            this.appErrorHandler.executeAction(() => {
                // tslint:disable-next-line:triple-equals
                if (showAIPaneState && this.additionalInformationOn != showAIPaneState.showPanel) {
                    this.showPanelClick(null);
                }
            });
        });
    }

    private getExpandCollapse() {
        this.getGlobalSettingSubcirbe = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe(
            data => this.getAllGlobalSettingSuccess(data),
            error => this.serviceError(error)
        );
    }

    private getAllGlobalSettingSuccess(data: GlobalSettingModel[]) {
        if (!data || !data.length) {
            this.setCollapseExpandStyle(1);
            this.showPane(true);
            return;
        }
        const additionalInformationOn = this.getCurrentExpandCollapse(data);
        this.showPane(!additionalInformationOn);
    }
    private serviceError(error) {
        Uti.logError(error);
    }

    private getCurrentExpandCollapse(data: GlobalSettingModel[]): boolean {
        this.currentGlobalSettingModel = data.find(x => x.globalName === this.getSettingAIExpandCollapseName());
        if (!this.currentGlobalSettingModel || !this.currentGlobalSettingModel.idSettingsGlobal) {
            return this.additionalInformationOn;
        }
        const sessionShowSetting = JSON.parse(this.currentGlobalSettingModel.jsonSettings);
        return (sessionShowSetting && sessionShowSetting.IsExpand);
    }

    private reloadAndSaveExpandConfig() {
        this.getGlobalSettingSubcirbe = this.globalSettingService.getAllGlobalSettings(this.ofModule.idSettingsGUI).subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                this.saveExpandConfig(data);
            });
        });
    }
    private saveExpandConfig(data: GlobalSettingModel[]) {
        if (!this.currentGlobalSettingModel || !this.currentGlobalSettingModel.idSettingsGlobal || !this.currentGlobalSettingModel.globalName) {
            this.currentGlobalSettingModel = new GlobalSettingModel({
                globalName: this.getSettingAIExpandCollapseName(),
                description: 'Additional Information Session Show',
                globalType: this.globalSettingConstant.additionalInformationSessionShow
            });
        }
        this.currentGlobalSettingModel.idSettingsGUI = this.ofModule.idSettingsGUI
        this.currentGlobalSettingModel.jsonSettings = JSON.stringify({ IsExpand: this.additionalInformationOn });
        this.currentGlobalSettingModel.isActive = true;

        this.getGlobalSettingSubcirbe = this.globalSettingService.saveGlobalSetting(this.currentGlobalSettingModel).subscribe(
            _data => this.saveExpandConfigSuccess(_data),
            error => this.serviceError(error));
    }

    private saveExpandConfigSuccess(data: any) {
        this.globalSettingService.saveUpdateCache(this.ofModule.idSettingsGUI, this.currentGlobalSettingModel, data);
    }

    private getSettingAIExpandCollapseName() {
        return uti.String.Format('{0}_{1}',
            this.globalSettingConstant.additionalInformationSessionShow,
            uti.String.hardTrimBlank(this.ofModule.moduleName));
    }

    public showPanelClick(event: any) {
        this.reCalculateSize(this.additionalInformationOn);
        this.reloadAndSaveExpandConfig();
        this.store.dispatch(this.gridActions.requestRefresh(this.ofModule));
        // this.store.dispatch(this.layoutInfoActions.resizeSplitter());
    }

    // private getTabStored: Observable<any>;
    public showPane(additionalInformationOn: boolean) {
        setTimeout(() => {
            this.reCalculateSize(additionalInformationOn);
        }, 50);
    }

    public reCalculateSize(additionalInformationOn?: any) {
        additionalInformationOn = (typeof additionalInformationOn) === 'boolean' ? additionalInformationOn : false;
        const spliters = $('split-gutter');
        const lastSpliter = $(spliters[spliters.length - 1]);
        if (!lastSpliter || !lastSpliter.length || !this.isStoredSessionSize) {
            this.showPane(additionalInformationOn);
            return;
        }
        this.additionalInformationOn = !additionalInformationOn;
        const left = $('.xn__tab-content__split');
        const right = $('.additional-information__split');
        if (this.additionalInformationOn) {
            left.css('flex-basis', 'calc(' + this.currentWidth.left + '% - ' + this.currentWidth.spliter / 2 + 'px)');
            right.css('flex-basis', 'calc(' + this.currentWidth.right + '% - ' + this.currentWidth.spliter / 2 + 'px)');
            lastSpliter.show();

            setTimeout(() => {
                if (this.xnAdditionalInformationTabComponent) {
                    this.xnAdditionalInformationTabComponent.adjustScrollingArea();
                }
            }, 200);
        } else {
            left.css('flex-basis', 'calc(100% - ' + this.pageSize.AdditionalInformationSize + 'px)');
            right.css('flex-basis', '29px');
            lastSpliter.hide();
        }
        this.setCollapseExpandStyle(1);
        this.store.dispatch(this.layoutInfoActions.resizeSplitter(this.ofModule));

        this.store.dispatch(this.additionalInformationActions.setCurrentState(this.additionalInformationOn, this.ofModule));
    }
}
