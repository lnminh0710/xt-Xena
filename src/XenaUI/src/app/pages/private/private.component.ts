import { Component, OnInit, ViewChild, OnDestroy, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterConfig, ToasterService } from 'angular2-toaster/angular2-toaster';
import {
    AuthenticationService,
    AppErrorHandler,
    BaseService,
    PropertyPanelService,
    AccessRightsService
} from 'app/services';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from 'app/state-management/store';
import { SubLayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import {
    PropertyPanelActions,
    AdditionalInformationActions,
    TabButtonActions,
    CustomAction,
    XnCommonActions
} from 'app/state-management/store/actions';
import { ModalDirective } from 'ngx-bootstrap';
import {Configuration, AccessRightTypeEnum, DefaultWidgetItemConfiguration} from 'app/app.constants';
import {
    WidgetPropertyModel, Module
} from 'app/models';
import * as uti from 'app/utilities';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { BaseComponent, ModuleList } from 'app/pages/private/base';

import * as wjcGrid from 'wijmo/wijmo.grid';
import { FeedbackCombineComponent } from 'app/shared/components/form';
import {WidgetUtils} from '../../shared/components/widget/utils';

@Component({
    selector: 'app-root',
    templateUrl: './private.component.html',
    providers: [WidgetUtils],
    styleUrls: ['./private.component.scss']
})
export class PrivateComponent extends BaseComponent implements OnInit, OnDestroy {
    public contentStyle: Object = {};
    public consts: Configuration;
    public toastrConfig: ToasterConfig;
    private isShowingCountDownClock: boolean = false;
    public countDownClock: number;
    private intervalCountDownClock: any;
    public countDownClockModalStyle: any;
    public isExpand: boolean = false;
    public isGlobal: boolean = false;
    public propertiesParentData: any;
    public properties: WidgetPropertyModel[] = [];
    public ofModuleLocal: Module;
    public layoutInfo: SubLayoutInfoState;
    public showLoading = false;
    public makeSpaceForTabButton = false;

    private layoutInfoModel: Observable<SubLayoutInfoState>;
    private isExpandState: Observable<boolean>;
    private isGlobalState: Observable<boolean>;
    private propertiesParentDataState: Observable<any>;
    private propertiesState: Observable<WidgetPropertyModel[]>;
    private toggleDashboardLoadingState: Observable<any>;

    private layoutInfoModelSubscription: Subscription;
    private isExpandStateSubscription: Subscription;
    private isGlobalStateSubscription: Subscription;
    private propertiesParentDataStateSubscription: Subscription;
    private propertiesStateSubscription: Subscription;
    private showFeedbackClickedStateSubscription: Subscription;
    private feedbackClickedDataStateSubscription: Subscription;
    private toggleDashboardLoadingStateSubscription: Subscription;

    @ViewChild('feedbackCombine') feedbackCombine: FeedbackCombineComponent;
    @ViewChild('modal') modal: ModalDirective;

    @HostListener('document:mousemove.out-zone', [])
    onMousemove() {
        this.resetCountDownClock(null);
    }

    constructor(
        protected router: Router,
        public widgetUtils: WidgetUtils,
        private authenticationService: AuthenticationService,
        private accessRightsService: AccessRightsService,
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelActions: PropertyPanelActions,
        private additionalInformationActions: AdditionalInformationActions,
        private tabButtonActions: TabButtonActions,
        private ref: ChangeDetectorRef,
        private dispatcher: ReducerManagerDispatcher,
        private toasterService: ToasterService,
        private propertyPanelService: PropertyPanelService,
        private zone: NgZone
    ) {
        super(router);

        this.ofModuleLocal = this.ofModule;

        this.toastrConfig = new ToasterConfig({
            newestOnTop: true,
            showCloseButton: true,
            tapToDismiss: true,
            limit: 1,
            positionClass: 'toast-top-center'
        });
        BaseService.toasterService = this.toasterService;

        this.layoutInfoModel = this.store.select(state => layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim));
        this.isExpandState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.ofModule.moduleNameTrim).isExpand);
        this.isGlobalState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.ofModule.moduleNameTrim).isGlobal);
        this.propertiesParentDataState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.ofModule.moduleNameTrim).propertiesParentData);
        this.propertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.ofModule.moduleNameTrim).properties);
        this.toggleDashboardLoadingState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).toggleDashboardLoading);

        this.consts = new Configuration();
        this.countDownClock = this.consts.defaultCountDownTime * 60 + this.consts.remainCountDownTime;

        zone.runOutsideAngular(() => {
            this.intervalCountDownClock = setInterval(() => { this.startCountDownClock(); }, 10000);
        });
    }

    onRouteChanged() {
        this.buildModuleFromRoute();
        this.ofModuleLocal = this.ofModule;

        this.accessRightsService.checkAccessRight(this.ofModuleLocal);
    }

    private resetCountDownClock(event) {
        if (!this.isShowingCountDownClock)
            this.countDownClock = this.consts.defaultCountDownTime * 60;
    }

    private startCountDownClock() {
        if (this.countDownClock <= 0) {
            // clear interval
            clearInterval(this.intervalCountDownClock);
            // do logout
            this.authenticationService.logout();
            // redirect to login page
            this.router.navigate([this.consts.loginUrl]);
            this.ref.detectChanges();
            return;
        }
        this.countDownClock -= 1;
        if (this.countDownClock == this.consts.remainCountDownTime + 1) {
            this.isShowingCountDownClock = true;
            let windowH = $(document).height();
            this.countDownClockModalStyle = {
                'margin-top': `${(windowH - 300) / 2}px`
            }
            this.modal.show();
            this.ref.detectChanges();
        }
    }

    public closeChildModal() {
        this.countDownClock = this.consts.defaultCountDownTime * 3600;
        this.isShowingCountDownClock = false;
        this.modal.hide();
    }

    public ngOnInit() {
        $('#page-loading').remove();

        //  sedding the resize event, for AdminLTE to place the height
        let ie = this.detectIE();
        if (!ie) {
            window.dispatchEvent(new Event('resize'));
        } else {
            // solution for IE from @hakonamatata
            let event = document.createEvent('Event');
            event.initEvent('resize', false, true);
            window.dispatchEvent(event);
        }

        this.subscribe();

        wjcGrid.HitTestInfo._SZEDGE[0] = 10;
    }

    ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    private subscribe() {
        this.subscribeLayoutInfoModel();
        this.subscribeIsExpandState();
        this.subscribeIsGlobalState();
        this.subscribePropertiesParentDataState();
        this.subscribePropertiesState();
        this.subscribeShowFeedbackClickedState();
        this.subscribeToggleDashboardLoadingState();
    }

    private subscribeLayoutInfoModel() {
        this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe((layoutInfoState: SubLayoutInfoState) => {
            this.appErrorHandler.executeAction(() => {
                this.layoutInfo = layoutInfoState;

                this.makeSpaceForTabButton = layoutInfoState.makeSpaceForTabButton.isActive;
                this.updateContentStyle(this.layoutInfo);
            });
        });
    }

    private subscribeIsExpandState() {
        this.isExpandStateSubscription = this.isExpandState.subscribe((isExpandState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                this.isExpand = isExpandState;

                this.updateContentStyle(this.layoutInfo);
            });
        });
    }

    private subscribeIsGlobalState() {
        this.isGlobalStateSubscription = this.isGlobalState.subscribe((isGlobalState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                this.isGlobal = isGlobalState;
            });
        });
    }

    private subscribePropertiesParentDataState() {
        this.propertiesParentDataStateSubscription = this.propertiesParentDataState.subscribe((propertiesParentDataState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.propertiesParentData = propertiesParentDataState || {};
            });
        });
    }

    private subscribePropertiesState() {
        this.propertiesStateSubscription = this.propertiesState.subscribe((propertiesState: WidgetPropertyModel[]) => {
            this.appErrorHandler.executeAction(() => {
                if (propertiesState) {
                    if (propertiesState['moduleName']) return this.properties;
                    setTimeout(() => {
                        this.properties = this.isGlobal ? propertiesState : this.widgetUtils.mapProperty(propertiesState);
                    });
                } else {
                    this.properties = [];
                }
            });
        });
    }

    private subscribeShowFeedbackClickedState() {
        this.showFeedbackClickedStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === XnCommonActions.SHOW_FEEDBACK;
        }).map((action: CustomAction) => {
            return action.payload;
        }).subscribe((showFeedback) => {
            this.appErrorHandler.executeAction(() => {
                if (showFeedback) {
                    this.feedbackCombine.showFeedback();
                }
            });
        });

        this.feedbackClickedDataStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === XnCommonActions.STORE_FEEDBACK_DATA;
        }).map((action: CustomAction) => {
            return action.payload;
        }).subscribe((feedbackData) => {
            this.appErrorHandler.executeAction(() => {
                this.feedbackCombine.feedbackStoreData = feedbackData;
            });
        });
    }

    private subscribeToggleDashboardLoadingState() {
        this.toggleDashboardLoadingStateSubscription = this.toggleDashboardLoadingState.subscribe((toggleDashboardLoadingState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (toggleDashboardLoadingState) {
                    this.showLoading = toggleDashboardLoadingState.show;
                }
            });
        });
    }

    protected detectIE(): any {
        let ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // IE 12 / Spartan
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // Edge (IE 12+)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
        // Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        let msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        let trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            let rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        let edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

    public onPropertyPanelClose(event) {
        this.store.dispatch(this.propertyPanelActions.togglePanel(this.ofModule, false));
        this.store.dispatch(this.additionalInformationActions.backToPreviousState(this.ofModule));
    }

    public onPropertyPanelSave(event) {
        if (!this.isGlobal) {
            this.store.dispatch(this.propertyPanelActions.requestSave(event, this.ofModule));
        } else {
            this.store.dispatch(this.propertyPanelActions.requestSaveGlobal(this.properties, ModuleList.Base));
        }

        this.isExpand = false;
    }

    public onPropertyPanelChange(event) {
        if (event && this.isGlobal) {
            this.propertyPanelService.globalProperties = event.widgetProperties;
            this.store.dispatch(this.propertyPanelActions.requestUpdateGlobalProperty(event.widgetProperties, ModuleList.Base));
        }
        this.store.dispatch(this.propertyPanelActions.updateProperties(event, this.ofModule));
    }

    public onPropertyPanelApply(event) {
        this.store.dispatch(this.propertyPanelActions.requestApply(event, this.ofModule));
    }

    public handleToggleWidgetTemplate(event) {
        this.store.dispatch(this.tabButtonActions.toggle(!event, this.ofModule))
    }

    private updateContentStyle(layoutInfo: SubLayoutInfoState) {
        let contentStyle = `calc(100vw - ${(this.ofModule && this.ofModule.idSettingsGUI != -1) ? layoutInfo.parkedItemWidth : 0}px - ${layoutInfo.rightMenuWidth}px`;
        if (this.isExpand) {
            contentStyle += ` - ${layoutInfo.rightPropertyPanelWidth}px`;
        }

        if (this.makeSpaceForTabButton) {
            contentStyle += ` - 25px`;
        }

        contentStyle += `)`;

        this.contentStyle = {
            'max-width': contentStyle,
            'min-width': contentStyle
        };
    }
}
