import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderSummaryFilterConst, DateConfiguration } from 'app/app.constants';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Subscription } from 'rxjs/Subscription';
import {
  DataEntryActions,
  CustomAction,
} from 'app/state-management/store/actions';
import {
  DataEntryService,
  UserService,
  AppErrorHandler,
  PropertyPanelService,
} from 'app/services';
import * as wjcInput from 'wijmo/wijmo.input';
import { parse, format } from 'date-fns/esm';
import camelCase from 'lodash-es/camelCase';
import isNaN from 'lodash-es/isNaN';
import { Uti } from 'app/utilities';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { OrderDataEntryNumberModel, User } from 'app/models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';

@Component({
  selector: 'number-data-entry-order-summary',
  templateUrl: './number-order-summary.component.html',
  styleUrls: ['./number-order-summary.component.scss'],
})
export class DataEntryNumberOrderSummaryComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy
{
  public currentFilterType: string;
  public today = new Date();
  public uiFilterData: any[] = DateConfiguration.FILTERDATA;
  public globalDateFormat: string = '';

  private onOrderSummaryDataLoadedSubscription: Subscription;
  private selectedODETabStateSubscription: Subscription;

  private selectedODETabState: Observable<any>;

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this._propertyPanelService.buildGlobalInputDateFormatFromProperties(
        globalProperties
      );
  }
  @Input() data: any = null;
  @Input() tabID: string;

  constructor(
    private store: Store<AppState>,
    private dataEntryActions: DataEntryActions,
    protected router: Router,
    private dispatcher: ReducerManagerDispatcher,
    private dataEntryService: DataEntryService,
    private userService: UserService,
    private _propertyPanelService: PropertyPanelService,
    private appErrorHandler: AppErrorHandler,
    private uti: Uti
  ) {
    super(router, {
      defaultTranslateText: 'numberOrderSummary',
      emptyData: new OrderDataEntryNumberModel(),
    });

    this.userService.currentUser.subscribe((user: User) => {
      this.appErrorHandler.executeAction(() => {
        if (user) {
          this.buildDateDetail(user);
        }
      });
    });

    this.selectedODETabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedODETab
    );
  }

  public ngOnInit() {
    this.currentFilterType = OrderSummaryFilterConst.DAY;
    this.uiFilterData[0].loading = true;
    this.store.dispatch(
      this.dataEntryActions.dataEntrySelectSummaryFilter(
        this.currentFilterType,
        this.tabID
      )
    );

    this.dataEntryService.getTotalDataEntryByLogin().subscribe((response) => {
      this.appErrorHandler.executeAction(() => {
        if (
          !Uti.isResquestSuccess(response) ||
          !response.item.data ||
          !response.item.data[0] ||
          !response.item.data[0][0]
        ) {
          return;
        }

        this.uiFilterData[0].count = response.item.data[0][0].Day;
        this.uiFilterData[1].count = response.item.data[0][0].Week;
        this.uiFilterData[2].count = response.item.data[0][0].Month;
      });
    });

    this.subscribeOrderSummaryDataLoadedState();
    this.subscribeSelectedODETabState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public rebuildTranslateText() {
    for (let item of this.uiFilterData) {
      item.title = this.localizer[camelCase(item.type)];
    }
  }

  private buildDateDetail(user: User) {
    this.uiFilterData[0].subTitle = this.uti.formatLocale(this.today, 'cccc');
    this.uiFilterData[1].subTitle = this.uti.formatLocale(this.today, 'ww');
    this.uiFilterData[2].subTitle = this.uti.formatLocale(this.today, 'MMMM');
  }

  private subscribeOrderSummaryDataLoadedState() {
    this.onOrderSummaryDataLoadedSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            DataEntryActions.DATA_ENTRY_ORDER_SUMMARY_DATA_LOADED &&
          action.area == this.tabID
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((orderSummaryDataLoadedState: any) => {
        this.appErrorHandler.executeAction(() => {
          let filter = this.uiFilterData.find(
            (f) => f.type == orderSummaryDataLoadedState.mode
          );
          if (filter) {
            filter.count = orderSummaryDataLoadedState.dataCount;
            filter.loading = false;
          }
        });
      });
  }

  private subscribeSelectedODETabState() {
    this.selectedODETabStateSubscription = this.selectedODETabState.subscribe(
      (selectedODETabState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            selectedODETabState &&
            selectedODETabState.TabID == 'OrderSummary'
          ) {
            this.dataEntryService
              .getTotalDataEntryByLogin()
              .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                  if (
                    !Uti.isResquestSuccess(response) ||
                    !response.item.data ||
                    !response.item.data[0] ||
                    !response.item.data[0][0]
                  ) {
                    return;
                  }

                  let currentFilterTypeIndex = -1;
                  if (
                    this.uiFilterData[0].count != response.item.data[0][0].Day
                  ) {
                    this.uiFilterData[0].count = response.item.data[0][0].Day;

                    if (
                      this.currentFilterType === OrderSummaryFilterConst.DAY
                    ) {
                      currentFilterTypeIndex = 0;
                    }
                  }

                  if (
                    this.uiFilterData[1].count != response.item.data[0][0].Week
                  ) {
                    this.uiFilterData[1].count = response.item.data[0][0].Week;

                    if (
                      this.currentFilterType === OrderSummaryFilterConst.WEEK
                    ) {
                      currentFilterTypeIndex = 1;
                    }
                  }

                  if (
                    this.uiFilterData[2].count != response.item.data[0][0].Month
                  ) {
                    this.uiFilterData[2].count = response.item.data[0][0].Month;

                    if (
                      this.currentFilterType === OrderSummaryFilterConst.MONTH
                    ) {
                      currentFilterTypeIndex = 2;
                    }
                  }

                  if (
                    this.uiFilterData[4].count !=
                    response.item.data[0][0].SendToAdmin
                  ) {
                    this.uiFilterData[4].count =
                      response.item.data[0][0].SendToAdmin;

                    if (
                      this.currentFilterType ===
                      OrderSummaryFilterConst.SEND_TO_ADMIN
                    ) {
                      currentFilterTypeIndex = 4;
                    }
                  }

                  if (currentFilterTypeIndex !== -1) {
                    this.uiFilterData[currentFilterTypeIndex].loading = true;
                    this.store.dispatch(
                      this.dataEntryActions.dataEntrySelectSummaryFilter(
                        this.currentFilterType,
                        this.tabID
                      )
                    );
                  }
                });
              });
          }
        });
      }
    );
  }

  public filterTypeClicked($event, index): void {
    this.uiFilterData = this.uiFilterData.map((filter) => {
      return {
        ...filter,
        loading: false,
      };
    });
    this.currentFilterType = this.uiFilterData[index].type;

    if (this.currentFilterType) {
      switch (this.currentFilterType) {
        case OrderSummaryFilterConst.DAY:
        case OrderSummaryFilterConst.WEEK:
        case OrderSummaryFilterConst.MONTH:
          this.uiFilterData[index].loading = true;
          this.store.dispatch(
            this.dataEntryActions.dataEntrySelectSummaryFilter(
              this.currentFilterType,
              this.tabID
            )
          );
          break;

        default:
          this.store.dispatch(
            this.dataEntryActions.dataEntryClearSummaryFilterData(this.tabID)
          );
          break;
      }
    }
  }

  private sendToAdminClicked($event, index) {
    console.log($event, index);
  }

  public filterDateRangeEvent(
    $event,
    dateFromControl: wjcInput.InputDate,
    dateToControl: wjcInput.InputDate,
    isAdminFilter?: boolean
  ): void {
    let index = isAdminFilter ? 4 : 3;
    this.uiFilterData[index].loading = true;
    this.store.dispatch(
      this.dataEntryActions.dataEntrySelectSummaryFilter(
        this.currentFilterType,
        this.tabID,
        Uti.convertDateToString(dateFromControl.value),
        Uti.convertDateToString(dateToControl.value)
      )
    );
  }
}
