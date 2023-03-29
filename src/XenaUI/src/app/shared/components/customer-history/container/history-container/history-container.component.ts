import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  CustomerHistory,
  HistoryHeaderInfo,
  HistoryBodyInfo,
  HistoryFooterInfo,
  HistoryHeaderMenu,
  ApiResultResponse,
  FieldFilter,
} from 'app/models';
import { ApiMethodResultId } from 'app/app.constants';
import { Subscription } from 'rxjs/Subscription';

import { PersonService, AppErrorHandler } from 'app/services';
import groupBy from 'lodash-es/groupBy';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Uti } from 'app/utilities';
import { BaseWidget } from 'app/pages/private/base';
import { HistoryListComponent } from '../../components/history-list';
import cloneDeep from 'lodash-es/cloneDeep';
import { Object } from 'core-js';

@Component({
  selector: 'history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.scss'],
})
export class HistoryContainerComponent
  extends BaseWidget
  implements OnInit, OnDestroy, AfterViewInit
{
  private pageSize = 4;
  private pageIndex = 0;
  private key: string;
  private isKeepPageIndex: boolean;
  private personServiceSubscription: Subscription;
  private singleMode: boolean;
  private _fieldFilters: Array<FieldFilter>;

  perfectScrollbarConfig: any = {};
  rawCustomerHistories: Array<Array<CustomerHistory>>;
  customerHistories: Array<Array<CustomerHistory>>;
  selectedCustomerHistory: Array<CustomerHistory>;
  isLoading: boolean;

  @Input() resizeInfo: string;
  @Input() set idPerson(data: string) {
    if (!data) {
      return;
    }
    this.pageIndex = 0;
    this.customerHistories = [];
    this.rawCustomerHistories = [];
    this.key = data;
    this.getCustomerHistory(this.key);
  }

  @Input() set fieldFilters(fieldFilters: Array<FieldFilter>) {
    if (!fieldFilters || !fieldFilters.length) {
      return;
    }
    this._fieldFilters = fieldFilters;
    this.customerHistories.forEach((historyGroup: Array<CustomerHistory>) => {
      historyGroup.forEach((customerHistory: CustomerHistory) => {
        const field = fieldFilters.find(
          (p) => p.fieldName == customerHistory.header.content.text
        );
        if (field) {
          // Visible
          customerHistory.isHidden = false;
          if (!field.selected) {
            // Hidden
            customerHistory.isHidden = true;
          }
        }
      });
      this.historyListComponents.forEach((historyListComponent) => {
        if (historyListComponent.customerHistories == historyGroup) {
          historyListComponent.buildAgGridDataSource(historyGroup);
        }
      });
    });

    this.emitCompletedRenderEvent();
  }

  /**
   * changeToMultipleRowMode
   * */
  public changeToMultipleRowMode() {
    this.singleMode = false;
    if (this.rawCustomerHistories) {
      this.customerHistories = Object.assign([], this.rawCustomerHistories);
      setTimeout(() => {
        if (this.directiveScroll) {
          this.directiveScroll.update();
          this.emitCompletedRenderEvent();
        }
      }, 200);
    }
  }

  /**
   * changeToSingleRowMode
   * */
  public changeToSingleRowMode() {
    this.singleMode = true;
    if (this.customerHistories) {
      if (this.selectedCustomerHistory) {
        this.customerHistories.forEach((customerHistory) => {
          if (customerHistory == this.selectedCustomerHistory) {
            this.customerHistories = [this.selectedCustomerHistory];
          }
        });
      } else {
        this.customerHistories = [this.customerHistories[0]];
      }
      setTimeout(() => {
        this.directiveScroll.update();
        this.emitCompletedRenderEvent();
      }, 200);
    }
  }

  @Output() onHeaderColsUpdated = new EventEmitter<Array<any>>();

  @ViewChild(PerfectScrollbarDirective)
  directiveScroll: PerfectScrollbarDirective;
  @ViewChildren(HistoryListComponent)
  private historyListComponents: QueryList<HistoryListComponent>;

  constructor(
    private personService: PersonService,
    private appErrorHandler: AppErrorHandler,
    private _eref: ElementRef
  ) {
    super();
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {}

  /**
   * getCustomerHistory
   * @param idPerson
   */
  private getCustomerHistory(idPerson: string) {
    this.isLoading = true;
    this.personServiceSubscription = this.personService
      .getCustomerHistory(idPerson, this.pageIndex, this.pageSize)
      .finally(() => {
        this.isLoading = false;
        setTimeout(() => {
          this.directiveScroll.update();
        }, 200);
        this.emitCompletedRenderEvent();
      })
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (response.statusCode != ApiMethodResultId.Success) {
            return;
          }

          let item = response.item;
          if (!item || (item && item.data && !item.data.length)) {
            this.isKeepPageIndex = true;
            return;
          }

          this.isKeepPageIndex = false;
          let headerCols = {};
          let historyObj = groupBy(item.data[0], 'IdSalesOrder');
          Object.keys(historyObj).forEach((key, index, arr) => {
            let historyList: Array<any> = historyObj[key];
            let customerHistories: Array<CustomerHistory> = [];
            historyList.forEach((item) => {
              let header: HistoryHeaderInfo = this.processHeader(item.Header);
              let body: HistoryBodyInfo = this.processBody(item.Body);
              let footer: HistoryFooterInfo = this.processFooter(item.Footer);
              let customerHistory: CustomerHistory = new CustomerHistory({
                header: header,
                body: body,
                footer: footer,
                isHidden: false,
              });
              if (this._fieldFilters && this._fieldFilters.length) {
                const field = this._fieldFilters.find(
                  (p) => p.fieldName == customerHistory.header.content.text
                );
                if (field) {
                  // Visible
                  customerHistory.isHidden = false;
                  if (!field.selected) {
                    customerHistory.isHidden = true;
                  }
                }
              }
              customerHistories.push(customerHistory);
              headerCols[header.content.text] = 1;
            });
            this.customerHistories.push(customerHistories);
          });
          this.rawCustomerHistories = Object.assign([], this.customerHistories);
          if (this.singleMode) {
            this.changeToSingleRowMode();
          }
          this.onHeaderColsUpdated.emit(
            Object.keys(headerCols).map((x) => {
              return {
                fieldName: x,
                fieldDisplayName: x,
              };
            })
          );
        });
      });
  }

  /**
   * processHeader
   */
  private processHeader(rawData: string) {
    let headerObj = JSON.parse(rawData);
    let historyHeaderInfo: HistoryHeaderInfo = headerObj.header;
    return historyHeaderInfo;
  }

  /**
   * processBody
   * @param rawData
   */
  private processBody(rawData: string) {
    let historyBodyInfo: HistoryBodyInfo = new HistoryBodyInfo({});
    try {
      let bodyObj = JSON.parse(rawData);
      historyBodyInfo = bodyObj.body;
    } catch (ex) {
      // console.log(ex);
    } finally {
      return historyBodyInfo;
    }
  }

  /**
   * processFooter
   * @param rawData
   */
  private processFooter(rawData: string) {
    let footerObj = JSON.parse(rawData);
    let historyFooterInfo: HistoryFooterInfo = footerObj.footer;
    return historyFooterInfo;
  }

  public next() {
    if (!this.isKeepPageIndex) {
      this.pageIndex += 1;
    }
    this.getCustomerHistory(this.key);
  }

  public handleScroll(event: any) {
    if (event.isReachingBottom) {
      this.next();
    }
  }

  public selectHistoryItem(event: Array<CustomerHistory>) {
    this.selectedCustomerHistory = event;

    this.historyListComponents.forEach((historyListComponent) => {
      if (
        historyListComponent.customerHistories != this.selectedCustomerHistory
      ) {
        historyListComponent.clearGridSelection();
      }
    });
  }
}
