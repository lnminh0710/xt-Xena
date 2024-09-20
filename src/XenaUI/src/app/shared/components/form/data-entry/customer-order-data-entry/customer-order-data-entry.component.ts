import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
  KeyValueDiffers,
  DoCheck,
  ViewChild,
} from '@angular/core';
import {
  WidgetTemplateSettingService,
  AppErrorHandler,
  DatatableService,
  CommonService,
  ModalService,
} from 'app/services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import isNil from 'lodash-es/isNil';
import cloneDeep from 'lodash-es/cloneDeep';
import {
  DataEntryActions,
  BackofficeActions,
  ModuleActions,
} from 'app/state-management/store/actions';
import {
  WidgetDetail,
  MessageModel,
  OrderDataEntryCustomerOrderModel,
  FormModel,
} from 'app/models';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { Router } from '@angular/router';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { Uti } from 'app/utilities';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModuleList } from '../../../../../pages/private/base';
import {
  MenuModuleId,
  WidgetFormTypeEnum,
  Configuration,
} from '../../../../../app.constants';
import { WidgetUtils } from '../../../widget';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
@Component({
  selector: 'customer-order-data-entry',
  styleUrls: ['./customer-order-data-entry.component.scss'],
  templateUrl: './customer-order-data-entry.component.html',
})
export class CustomerOrderDataEntryComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy, DoCheck
{
  @Input() tabID: string;
  @Input() globalProperties: any;
  @Input() widgetDetail: WidgetDetail;

  @Input() gridId: string;

  @Output() onHeaderColsUpdated = new EventEmitter<Array<string>>();

  @ViewChild(XnAgGridComponent) xnAgGridComponent: XnAgGridComponent;

  private selectedOrderSummaryItemState: Observable<any>;
  private selectedOrderSummaryItemStateSubscription: Subscription;

  private widgetTemplateSettingServiceSubscription: Subscription;

  private idSalesOrder = 0;
  public datasource: any;
  public formData: any;
  private differ: any;
  public displayMode = 'grid';
  public formDisplayType: WidgetFormTypeEnum = WidgetFormTypeEnum.List;
  public renderGrid = true;
  public currentModule = ModuleList.OrderDataEntry;
  private dataEntryCustomerIdState: Observable<number>;
  private dataEntryCustomerIdStateSubscription: Subscription;
  private dataEntryCustomerState: Observable<FormModel>;
  private dataEntryStateCustomerSubscription: Subscription;
  customerId: number;

  constructor(
    private store: Store<AppState>,
    private widgetTemplateSettingService: WidgetTemplateSettingService,
    private datatableService: DatatableService,
    private appErrorHandler: AppErrorHandler,
    protected router: Router,
    private toasterService: ToasterService,
    private commonService: CommonService,
    private modalService: ModalService,
    private backofficeActions: BackofficeActions,
    private moduleActions: ModuleActions,
    private differs: KeyValueDiffers,
    private widgetUtils: WidgetUtils
  ) {
    super(router, {
      defaultTranslateText: 'customerOrderData',
      emptyData: new OrderDataEntryCustomerOrderModel(),
    });

    this.selectedOrderSummaryItemState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .selectedOrderSummaryItem
    );
    this.dataEntryCustomerState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).customerData
    );
    this.differ = this.differs.find({}).create();
  }

  public ngOnInit() {
    this.subscribeCustomerChanged();
    this.subscribeSelectedOrderSummaryItemState();
  }

  private subscribeCustomerChanged() {
    this.dataEntryCustomerIdState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).customerId
    );

    this.dataEntryStateCustomerSubscription =
      this.dataEntryCustomerState.subscribe((response: FormModel) => {
        this.appErrorHandler.executeAction(() => {
          if (response == null) {
            this.customerId = null;
          } else if (response && response.formValue) {
            this.customerId = response.formValue.idPerson;
          }
          this.getOrderDetailByIdSalesOrder();
        });
      });
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item) => {
        if (item.key == 'transferTranslate') {
          Uti.rebuildColumnHeaderForGrid(
            this.datasource,
            this.transferTranslate
          );
        }
      });
    }
  }

  private subscribeSelectedOrderSummaryItemState() {
    if (this.selectedOrderSummaryItemStateSubscription)
      this.selectedOrderSummaryItemStateSubscription.unsubscribe();

    // this.selectedOrderSummaryItemStateSubscription =
    //   this.selectedOrderSummaryItemState.subscribe(
    //     (selectedOrderSummaryItemState: any) => {
    //       this.appErrorHandler.executeAction(() => {
    //         if (
    //           !selectedOrderSummaryItemState ||
    //           !selectedOrderSummaryItemState.IdSalesOrder
    //         ) {
    //           return;
    //         }

    //         if (
    //           this.idSalesOrder != selectedOrderSummaryItemState.IdSalesOrder
    //         ) {
    //           this.idSalesOrder = selectedOrderSummaryItemState.IdSalesOrder;
    //         }
    //         this.getOrderDetailByIdSalesOrder();
    //       });
    //     }
    //   );
  }

  private getOrderDetailByIdSalesOrder() {
    if (!this.customerId) {
      this.datasource = null;
      return;
    }

    this.widgetTemplateSettingService
      .getWidgetDetailByRequestString(this.widgetDetail, {
        IdPerson: this.customerId,
      })

      .subscribe((response: WidgetDetail) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || !response.contentDetail) return;

          this.datasource = this.datatableService.buildDataSource(
            response.contentDetail
          );

          this.buildFormData(response);

          this.onHeaderColsUpdated.emit(
            Object['values'](response.contentDetail.columnSettings).map((x) => {
              return {
                fieldName: x.OriginalColumnName,
                fieldDisplayName: x.ColumnHeader,
              };
            })
          );
        });
      });
  }

  public rebuildTranslateText() {
    this.rebuildTranslateTextSelf();
  }

  public onPdfColumnClick($event) {
    let fileName =
      $event.InvoicePDF ||
      $event.PDF ||
      $event.invoicePDF ||
      $event.invoicePdf ||
      $event.pdf;
    let pdfUrl = '/api/FileManager/GetScanFile?name=';
    if (fileName && Configuration.PublicSettings.fileShareUrl) {
      if (fileName.indexOf(Configuration.PublicSettings.fileShareUrl) !== -1) {
        pdfUrl += fileName;
      } else {
        pdfUrl += Configuration.PublicSettings.fileShareUrl + fileName;
      }

      var a = document.createElement('a');
      a.href =
        pdfUrl +
        '&returnName=' +
        `[` +
        $event.PaimentType +
        `]-` +
        `[` +
        $event.MEDIACODE +
        `]-` +
        `[` +
        $event.CampaignNr +
        `]-` +
        `[` +
        $event.InvoiceNr +
        `]` +
        `.pdf`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        a.remove();
      }, 200);

      return;
    }

    this.toasterService.pop('warning', 'Warning', 'PDF file is not existed');
  }

  public onTrackingColumnClick($event) {
    let showError = false;
    if (!$event) {
      showError = true;
    } else {
      let trackingUrl = $event.Tracking || $event.track;
      if (!trackingUrl) {
        showError = true;
      }
    }

    if (showError) {
      this.toasterService.pop('error', 'Failed', 'No tracking information');
      return;
    }

    window.open($event.Tracking);
  }

  public onReturnRefundColumnClick($event) {
    if (!$event) {
      this.toasterService.pop(
        'warning',
        'Warning',
        'Please choose an order to get return and refund information'
      );
      return;
    }

    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Confirmation',
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Go_To_Return_Refund_Page',
          },
          { key: '</p>' },
        ],
        callBack1: () => {
          this.store.dispatch(
            this.backofficeActions.storeSelectedEntity(
              ModuleList.Backoffice,
              $event
            )
          );
          this.store.dispatch(
            this.moduleActions.requestChangeSubModule(
              MenuModuleId.backoffice,
              MenuModuleId.returnRefund
            )
          );
        },
      })
    );
  }

  private buildFormData(response) {
    if (!response || !response.contentDetail) return;

    setTimeout(() => {
      if (
        response.contentDetail &&
        this.xnAgGridComponent &&
        this.xnAgGridComponent.gridOptions.rowData.length <= 1
      ) {
        this.formData = cloneDeep(response);
        this.formData.contentDetail = { data: [[[]], []] };
        this.formData.contentDetail.data[1] =
          this.widgetUtils.buildReadonlyGridFormColumns(
            response.contentDetail.columnSettings,
            this.formData.contentDetail.data[1]
          );
        this.formData.contentDetail.data[1] =
          this.widgetUtils.buildReadonlyGridFormColumnsValue(
            this.xnAgGridComponent.gridOptions.rowData,
            this.formData.contentDetail.data[1]
          );
      }
    }, 500);
  }
}
