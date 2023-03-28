import {
    Component,
    OnInit,
    Input,
    ViewChildren,
    ElementRef,
    QueryList,
    OnDestroy,
    AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { TabPageViewSplitItemModel } from "app/models/tab-page-view";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import {
    GridActions,
    LayoutInfoActions,
} from "app/state-management/store/actions";
import isUndefined from "lodash-es/isUndefined";
import { PerfectScrollbarDirective } from "ngx-perfect-scrollbar";

import { SubLayoutInfoState } from "app/state-management/store/reducer/layout-info";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Uti, String } from "app/utilities";
import {
    SplitterService,
    AppErrorHandler,
    GlobalSettingService,
} from "app/services";
import { GlobalSettingModel } from "app/models";
import {
    GlobalSettingConstant,
    SplitterDirectionMode,
} from "app/app.constants";
import { BaseComponent } from "app/pages/private/base";
import * as layoutInfoReducer from "app/state-management/store/reducer/layout-info";

@Component({
    selector: "app-xn-double-page-view-vertical",
    styleUrls: ["./xn-double-page-view-vertical.component.scss"],
    templateUrl: "./xn-double-page-view-vertical.component.html",
})
export class XnDoublePageViewVerticalComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private isRender = false;
    public pageItems: TabPageViewSplitItemModel[];
    @Input()
    set data(data: TabPageViewSplitItemModel[]) {
        this.pageItems = data;
        this.setSplitValue();
    }

    @Input() isOrderDataEntry?: boolean;
    @Input() isActivated;
    @Input() tabID: string;

    @ViewChildren(PerfectScrollbarDirective)
    perfectScrollbarDirectives: QueryList<PerfectScrollbarDirective>;

    public containerStyle: any = {};
    public contentHeight = 0;
    public perfectScrollbarConfig: any = {};
    private globalSettingName = "";

    private layoutInfoModel: Observable<SubLayoutInfoState>;

    private layoutInfoModelSubscription: Subscription;

    private globalSettingServiceSubscription: Subscription;
    private globalSettingItem: GlobalSettingModel = null;

    constructor(
        private store: Store<AppState>,
        private layoutInfoActions: LayoutInfoActions,
        private gridActions: GridActions,
        private elmRef: ElementRef,
        private splitter: SplitterService,
        private appErrorHandler: AppErrorHandler,
        private globalSettingConstant: GlobalSettingConstant,
        private globalSettingService: GlobalSettingService,
        protected router: Router
    ) {
        super(router);

        this.layoutInfoModel = store.select((state) =>
            layoutInfoReducer.getLayoutInfoState(
                state,
                this.ofModule.moduleNameTrim
            )
        );

        this.perfectScrollbarConfig = {
            suppressScrollX: true,
            suppressScrollY: true,
        };
    }

    ngOnInit() {
        this.subscribe();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.perfectScrollbarDirectives) {
                this.perfectScrollbarDirectives.forEach(
                    (perfectScrollbarDirective) => {
                        perfectScrollbarDirective.update();
                    }
                );
            }
        }, 1000);
    }

    subscribe() {
        this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe(
            (layoutInfo: SubLayoutInfoState) => {
                this.appErrorHandler.executeAction(() => {
                    const tabHeaderHeight = this.isOrderDataEntry
                        ? layoutInfo.tabHeaderHeightOrderDataEntry
                        : layoutInfo.tabHeaderHeight;
                    //this.containerStyle = {
                    //    'height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${tabHeaderHeight}px - ${layoutInfo.smallHeaderLineHeight}px - ${layoutInfo.dashboardPaddingTop}px)`
                    //};

                    this.contentHeight =
                        window.innerHeight -
                        parseInt(layoutInfo.headerHeight, null) -
                        parseInt(tabHeaderHeight, null) -
                        parseInt(layoutInfo.smallHeaderLineHeight, null) -
                        parseInt(layoutInfo.dashboardPaddingTop, null) -
                        1;

                    setTimeout(() => {
                        const children = $(
                            ".xn__double-page-view__vertical",
                            this.elmRef.nativeElement
                        ).children();
                        if (children.length) {
                            for (let i = 0; i < children.length; i++) {
                                if (
                                    children[i].className ===
                                    "ps-scrollbar-y-rail"
                                ) {
                                    $(children[i]).css("opacity", 0.6);

                                    if ($(children[i]).is(":visible")) {
                                        this.containerStyle["padding-right"] =
                                            "15px";
                                    } else {
                                        this.containerStyle["padding-right"] =
                                            "0";
                                    }
                                }
                            }
                        }
                    });
                });
            }
        );
    }

    public dragEnd(splittersSize: any, pageItems: Array<any>) {
        this.storeSplitterState(splittersSize, pageItems);

        this.store.dispatch(
            this.layoutInfoActions.resizeSplitter(
                this.ofModule,
                SplitterDirectionMode.Vertical
            )
        );
        this.store.dispatch(this.gridActions.requestRefresh(this.ofModule));
    }

    public dragStart() {
        Uti.handleWhenSpliterResize();
    }

    private storeSplitterState(splittersSize: any, pageItems: any): void {
        this.globalSettingServiceSubscription = this.globalSettingService
            .getAllGlobalSettings(this.ofModule.idSettingsGUI)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.globalSettingName = String.Format(
                        "{0}_{1}",
                        this.globalSettingConstant.moduleLayoutSetting,
                        String.hardTrimBlank(this.ofModule.moduleName)
                    );
                    this.globalSettingItem = data.find(
                        (x) =>
                            x.globalName &&
                            x.idSettingsGlobal &&
                            x.globalName === this.globalSettingName
                    );
                    if (!this.globalSettingItem)
                        this.globalSettingItem = data.find(
                            (x) => x.globalName === this.globalSettingName
                        );

                    //#region Parse  ModuleSetting
                    let moduleSetting: any = null;
                    if (
                        this.globalSettingItem &&
                        this.globalSettingItem.jsonSettings
                    ) {
                        moduleSetting = JSON.parse(
                            this.globalSettingItem.jsonSettings
                        );
                        if (!moduleSetting.item) return;

                        moduleSetting.item[0].jsonSettings = JSON.parse(
                            moduleSetting.item[0].jsonSettings
                        );
                    }
                    //#endregion

                    this.splitter.updateSplitterState(
                        moduleSetting,
                        splittersSize,
                        pageItems
                    );

                    if (
                        !this.globalSettingItem ||
                        !this.globalSettingItem.idSettingsGlobal ||
                        !this.globalSettingItem.globalName
                    ) {
                        this.globalSettingItem = new GlobalSettingModel({
                            globalName: this.globalSettingName,
                            description: "Module Layout Setting",
                            globalType:
                                this.globalSettingConstant.moduleLayoutSetting,
                            idSettingsGUI: this.ofModule.idSettingsGUI,
                            isActive: true,
                            objectNr: this.ofModule.idSettingsGUI.toString(),
                        });
                    }
                    this.globalSettingItem.jsonSettings =
                        JSON.stringify(moduleSetting);
                    this.globalSettingItem.idSettingsGUI =
                        this.ofModule.idSettingsGUI;

                    this.globalSettingServiceSubscription =
                        this.globalSettingService
                            .saveGlobalSetting(this.globalSettingItem)
                            .subscribe(
                                (response) => this.saveGlobalSuccess(response),
                                (error) => this.saveGlobalError(error)
                            );
                });
            });
    }

    private saveGlobalSuccess(data: any) {
        this.globalSettingService.saveUpdateCache(
            this.ofModule.idSettingsGUI,
            this.globalSettingItem,
            data
        );
    }

    private saveGlobalError(error) {
        Uti.logError(error);
    }

    public refreshPerfectScrollbar(event) {
        if (event) {
            if (this.perfectScrollbarDirectives) {
                setTimeout(() => {
                    this.perfectScrollbarDirectives.forEach(
                        (perfectScrollbarDirective) => {
                            perfectScrollbarDirective.update();
                        }
                    );
                });
            }
        }
    }

    private setSplitValue() {
        if (!this.pageItems || !this.pageItems.length) {
            this.isRender = true;
            return;
        }
        this.pageItems.forEach((x) => {
            x.ContentSize = Uti.parFloatFromObject(x.ContentSize, 50, "%");
            x["perfectScrollbarConfig"] = {
                suppressScrollX: !isUndefined(x["Split"]),
                suppressScrollY: !isUndefined(x["Split"]),
            };
        });
        this.isRender = true;
    }
}
