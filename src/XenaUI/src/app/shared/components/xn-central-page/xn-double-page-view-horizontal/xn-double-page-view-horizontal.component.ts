import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TabPageViewSplitItemModel } from 'app/models/tab-page-view';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
  LayoutInfoActions,
  GridActions,
  ModuleSettingActions,
} from 'app/state-management/store/actions';
import isNil from 'lodash-es/isNil';
import isUndefined from 'lodash-es/isUndefined';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { SubLayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  Uti,
  LocalStorageHelper,
  LocalStorageProvider,
  String,
} from 'app/utilities';
import { XnTabContentSimpleTabsComponent } from '../../xn-tab';
import {
  SplitterService,
  AppErrorHandler,
  GlobalSettingService,
} from 'app/services';
import { Module, GlobalSettingModel } from 'app/models';
import { GlobalSettingConstant } from 'app/app.constants';
import { BaseComponent } from 'app/pages/private/base';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';

@Component({
  selector: 'app-xn-double-page-view-horizontal',
  styleUrls: ['./xn-double-page-view-horizontal.component.scss'],
  templateUrl: './xn-double-page-view-horizontal.component.html',
})
export class XnDoublePageViewHorizontalComponent
  extends BaseComponent
  implements OnInit, OnDestroy
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

  @ViewChild(PerfectScrollbarDirective)
  perfectScrollbarDirective: PerfectScrollbarDirective;
  @ViewChild(XnTabContentSimpleTabsComponent)
  xnTabContentSimpleTabsComponent: XnTabContentSimpleTabsComponent;

  public contentHeight = 0;
  private globalSettingName = '';

  private layoutInfoModel: Observable<SubLayoutInfoState>;

  private layoutInfoModelSubscription: Subscription;
  private globalSettingServiceSubscription: Subscription;
  private globalSettingItem: GlobalSettingModel = null;

  constructor(
    private store: Store<AppState>,
    private layoutInfoActions: LayoutInfoActions,
    private gridActions: GridActions,
    private splitter: SplitterService,
    private appErrorHandler: AppErrorHandler,
    private moduleSettingActions: ModuleSettingActions,
    private globalSettingConstant: GlobalSettingConstant,
    private globalSettingService: GlobalSettingService,
    protected router: Router
  ) {
    super(router);

    this.layoutInfoModel = store.select((state) =>
      layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim)
    );
  }

  ngOnInit() {
    this.subscribe();
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public dragEnd(splittersSize: any, pageItems: any) {
    this.storeSplitterState(splittersSize, pageItems);

    this.store.dispatch(this.layoutInfoActions.resizeSplitter(this.ofModule));
    this.store.dispatch(this.gridActions.requestRefresh(this.ofModule));

    if (this.xnTabContentSimpleTabsComponent) {
      this.xnTabContentSimpleTabsComponent.onWindowResize(null);
    }
  }

  private storeSplitterState(splittersSize: any, pageItems: any): void {
    this.globalSettingServiceSubscription = this.globalSettingService
      .getAllGlobalSettings(this.ofModule.idSettingsGUI)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          this.globalSettingName = String.Format(
            '{0}_{1}',
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
          if (this.globalSettingItem && this.globalSettingItem.jsonSettings) {
            moduleSetting = JSON.parse(this.globalSettingItem.jsonSettings);
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
              description: 'Module Layout Setting',
              globalType: this.globalSettingConstant.moduleLayoutSetting,
              idSettingsGUI: this.ofModule.idSettingsGUI,
              isActive: true,
              objectNr: this.ofModule.idSettingsGUI.toString(),
            });
          }

          this.globalSettingItem.jsonSettings = JSON.stringify(moduleSetting);
          this.globalSettingItem.idSettingsGUI = this.ofModule.idSettingsGUI;

          this.globalSettingServiceSubscription = this.globalSettingService
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
      if (this.perfectScrollbarDirective) {
        setTimeout(() => {
          this.perfectScrollbarDirective.update();
        });
      }
    }
  }

  public dragStart() {
    Uti.handleWhenSpliterResize();
  }

  subscribe() {
    this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe(
      (layoutInfo: SubLayoutInfoState) => {
        this.appErrorHandler.executeAction(() => {
          this.contentHeight =
            window.innerHeight -
            parseInt(layoutInfo.headerHeight, null) -
            parseInt(layoutInfo.tabHeaderHeight, null) -
            parseInt(layoutInfo.smallHeaderLineHeight, null) -
            parseInt(layoutInfo.dashboardPaddingTop, null) -
            1;
        });
      }
    );
  }

  private setSplitValue() {
    if (!this.pageItems || !this.pageItems.length) {
      this.isRender = true;
      return;
    }
    this.pageItems.forEach((x) => {
      x.ContentSize = Uti.parFloatFromObject(x.ContentSize, 50, '%');

      if (!isNil(x['SimpleTabs'])) {
        x['perfectScrollbarConfig'] = {
          suppressScrollX: true,
          suppressScrollY: true,
        };
      } else {
        x['perfectScrollbarConfig'] = {
          suppressScrollX: !isUndefined(x['Split']),
          suppressScrollY: !isUndefined(x['Split']),
        };
      }
    });
    this.isRender = true;
  }
}
