import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { DataEntryActions } from 'app/state-management/store/actions';
import {
  FormModel,
  FieldFilter,
  FormOutputModel,
  OrderDataEntryCustomerModel,
} from 'app/models';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { Router } from '@angular/router';
import { Uti } from 'app/utilities';
import { AppErrorHandler, DataEntryProcess } from 'app/services';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { CustomerFormComponent } from 'app/shared/components/form/customer/container/customer-form';
import { OrderFailedDataEnum } from 'app/app.constants';

@Component({
  selector: 'app-customer-data-entry-form',
  styleUrls: ['./customer-data-entry.component.scss'],
  templateUrl: './customer-data-entry.component.html',
})
export class CustomerDataEntryFormComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy
{
  private dataEntryCustomerState: Observable<FormModel>;
  private dataEntryStateCustomerSubscription: Subscription;

  private orderFailedRequestDataState: Observable<any>;
  private orderFailedRequestDataStateSubcription: Subscription;
  private cachedFailedDataState: Observable<any>;
  private cachedFailedDataStateSubcription: Subscription;

  private widgetFields: Array<any> = [];
  public customerData: any;
  public formFields: FieldFilter[] = [];

  @Output() outputWidgetFields: EventEmitter<any> = new EventEmitter();
  @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();

  @Input()
  set formFieldsData(formFields: FieldFilter[]) {
    if (formFields && formFields.length && formFields != this.formFields) {
      this.formFields = formFields;
    }
  }
  @Input() tabID: string;
  @ViewChild('customerForm') customerForm: CustomerFormComponent;

  constructor(
    private store: Store<AppState>,
    private dataEntryActions: DataEntryActions,
    private appErrorHandler: AppErrorHandler,
    protected router: Router,
    private dataEntryProcess: DataEntryProcess
  ) {
    super(router, {
      defaultTranslateText: 'customerFormData',
      emptyData: new OrderDataEntryCustomerModel(),
    });

    this.dataEntryCustomerState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).customerData
    );
    this.orderFailedRequestDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .orderFailedRequestData
    );
    this.cachedFailedDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).cachedFailedData
    );
  }

  public ngOnInit() {
    this.subscribeDataEntrySate();
    this.subscribeOrderFailed();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);

    this.customerData = null;
  }

  private subscribeDataEntrySate() {
    this.dataEntryStateCustomerSubscription =
      this.dataEntryCustomerState.subscribe((response: FormModel) => {
        this.appErrorHandler.executeAction(() => {
          if (response == null) {
            this.customerData = null;
            if (this.customerForm && this.customerForm.isRenderForm) {
              this.customerForm.executeData(null);
            }
          } else if (response && response.rawData) {
            this.customerData = Object.assign({}, response.rawData);
          }
        });
      });
  }

  private subscribeOrderFailed() {
    this.orderFailedRequestDataStateSubcription =
      this.orderFailedRequestDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.isNotify) {
            this.store.dispatch(
              this.dataEntryActions.orderFailedReceiveData(
                {
                  key: OrderFailedDataEnum.CustomerData,
                  data: this.customerData,
                },
                this.tabID
              )
            );
          }
        });
      });

    this.cachedFailedDataStateSubcription =
      this.cachedFailedDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.customerData) {
            this.customerData = response.customerData;

            if (this.customerForm && this.customerForm.isRenderForm) {
              this.customerForm.markAsPristineForm();
            }
          }
        });
      });
  }

  public outputDataCustomerForm(evenData) {
    if (evenData.customData) {
      this.store.dispatch(
        this.dataEntryActions.dataEntryCustomerDataChanged(
          evenData.customData,
          this.tabID
        )
      );
    }

    this.outputData.emit(evenData);
  }

  public buildWidgetContentDetail(formFields: FieldFilter[]) {
    if (formFields && formFields.length && !this.widgetFields.length) {
      formFields.forEach((field) => {
        this.widgetFields.push({
          ColumnName: field.fieldDisplayName,
          OriginalColumnName: field.fieldName,
          Setting: [],
          Value: null,
        });
      });

      this.outputWidgetFields.emit(this.widgetFields);
    }
  }

  public rebuildTranslateText() {
    this.rebuildTranslateTextSelf();
  }

  public isBlockUI() {
    return (
      this.tabID == this.dataEntryProcess.selectedODETab.TabID &&
      this.dataEntryProcess.mediaCodeDoesnotExist
    );
  }
}
