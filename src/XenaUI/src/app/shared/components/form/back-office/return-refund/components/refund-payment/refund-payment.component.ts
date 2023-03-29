import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Configuration, ComboBoxTypeConstant } from 'app/app.constants';
import { FormGroupChild, FormOutputModel, ApiResultResponse } from 'app/models';
import { Uti } from 'app/utilities';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { ReturnRefundState } from 'app/state-management/store/reducer';
import {
  ReturnRefundActions,
  CustomAction,
} from 'app/state-management/store/actions';
import {
  AppErrorHandler,
  BackOfficeService,
  CommonService,
} from 'app/services';
import {
  ControlFocusComponent,
  DataEntryPaymentTypeItemComponent,
} from 'app/shared/components/form';
import * as returnRefundReducer from 'app/state-management/store/reducer/return-refund';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
  selector: 'back-office-refund-payment',
  styleUrls: ['./refund-payment.component.scss'],
  templateUrl: './refund-payment.component.html',
})
export class RefundPaymentFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public refundPaymentForm: FormGroup;
  public maxCharactersNotes = this.consts.noteLengthDefault;
  public paymentTypeFormData: {
    data: any;
    listComboBox: any;
    parentFormGroup: FormGroup;
    formConfig: any;
  };
  public paymentTypeData: any = {
    paymentId: 1,
    active: true,
    headerText: '',
    isRemove: false,
    paymentTypes: [...this.createFakePaymentTypeData()],
  };
  public isDontRefund = false;

  private formChangeSubscription: Subscription;
  private outputModel: FormOutputModel;
  private resetAllEditableFormSubscription: Subscription;
  private shadowCurrencyList: Array<any> = [];

  @ViewChild('focusControl') focusControl: ControlFocusComponent;
  @ViewChild('paymentItem') paymentItem: DataEntryPaymentTypeItemComponent;

  @Output() outputData: EventEmitter<any> = new EventEmitter();
  constructor(
    private consts: Configuration,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private backOfficeService: BackOfficeService,
    private appErrorHandler: AppErrorHandler,
    private returnRefundActions: ReturnRefundActions,
    private dispatcher: ReducerManagerDispatcher,
    private commonService: CommonService,
    protected router: Router
  ) {
    super(router);
  }

  public onInitFormGroup(formGroupChild: FormGroupChild) {
    formGroupChild.form.setParent(this.refundPaymentForm);
    this.refundPaymentForm.addControl(formGroupChild.name, formGroupChild.form);
  }

  public ngOnInit() {
    this.initEmptyData();
    this.subcribeResetAllEditableFormState();
  }

  public ngOnDestroy() {
    this.store.dispatch(
      this.returnRefundActions.clearRefundPayment(this.ofModule)
    );

    Uti.unsubscribe(this);
  }

  public changePaymentType($event: any) {
    setTimeout(() => {
      this.focusControl.initControl(true);
    }, this.consts.valueChangeDeboundTimeDefault);
  }

  public paymentTypeFormOutputData($event: any) {
    // TODO: will update set data output
  }

  public updateData($event: any) {
    // let a = this.data;
    // TODO: will update data
  }

  public dontRefundChanged() {
    if (
      !this.refundPaymentForm ||
      !this.refundPaymentForm.value ||
      !this.refundPaymentForm.controls ||
      !this.paymentItem
    )
      return;
    if (this.refundPaymentForm.value['dontRefund']) {
      Uti.resetValueForForm(
        this.refundPaymentForm,
        ['dontRefund', 'reason'],
        ['leftCharacters']
      );
      this.paymentItem.resetForm();
      this.isDontRefund = true;
      this.setOutputData(null);
    } else {
      this.isDontRefund = false;
    }
  }

  /********************************************************************************************/
  /********************************** PRIVATE METHODS ******************************************/
  /********************************************************************************************/

  private subcribeResetAllEditableFormState() {
    this.resetAllEditableFormSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ReturnRefundActions.RESET_ALL_EDITABLE_FORM &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          Uti.resetValueForForm(this.refundPaymentForm);
          this.paymentItem.resetForm();
        });
      });
  }

  private onSubmit() {
    this.refundPaymentForm['submitted'] = true;
    try {
      if (!this.checkFormValid()) {
        this.setOutputData(null);
        return false;
      }

      // this.createRefundPayment();
    } catch (ex) {
      this.refundPaymentForm['submitted'] = true;
      return false;
    }

    return false;
  }

  private initEmptyData() {
    this.refundPaymentForm = this.formBuilder.group({
      dontRefund: false,
      reason: '',
    });
    this.refundPaymentForm['leftCharacters'] = this.consts.noteLengthDefault;
    this.refundPaymentForm['submitted'] = false;
    this.initDataForForm();
  }

  private initDataForForm() {
    this.initDataForPaymentType();
    this.updateFormValue();
    this.getListComboBox();
  }

  private updateFormValue() {
    setTimeout(() => {
      if (!this.refundPaymentForm.controls['paymentTypeForm']) {
        this.updateFormValue();
        return;
      }
      this.subcribeFormValueChange();
    }, 300);
  }

  private subcribeFormValueChange() {
    this.formChangeSubscription = this.refundPaymentForm.valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (!this.refundPaymentForm.pristine) {
            this.setOutputData(null);
          }
        });
      });
  }

  private initDataForPaymentType() {
    setTimeout(() => {
      this.paymentTypeFormData = {
        parentFormGroup: this.refundPaymentForm,
        formConfig: {},
        data: {},
        listComboBox: {},
      };
    }, 500);
  }

  private checkFormValid(): boolean {
    // this.refundPaymentForm.updateValueAndValidity();
    return this.paymentTypeData.valid;
  }

  private checkFormDirty(): boolean {
    this.refundPaymentForm.updateValueAndValidity();

    return this.refundPaymentForm.dirty;
  }

  // private createRefundPayment() {
  //     this.backOfficeService.createRefundPayment(this.prepareSubmitCreateData())
  //     .subscribe (
  //     this.appErrorHandler.executeAction(() => {
  //         (data) => {
  //             this.setOutputData(false, {
  //                 submitResult: true,
  //                 formValue: this.refundPaymentForm.value,
  //                 isValid: true,
  //                 isDirty: false,
  //                 returnID: data.returnValue });
  //             Uti.resetValueForForm(this.refundPaymentForm);
  //         },
  //         (err) => {
  //             this.setOutputData(false);
  //         }
  //     });
  // }

  private setOutputData(submitResult: any, data?: any) {
    if (typeof data !== 'undefined') {
      this.outputModel = data;
    } else {
      this.outputModel = new FormOutputModel({
        submitResult: submitResult,
        formValue: this.buildOutputData(),
        isValid: this.checkFormValid(),
        isDirty: this.checkFormDirty(),
      });
    }
    this.outputData.emit(this.outputModel);
    this.store.dispatch(
      this.returnRefundActions.setRefundPayment(this.outputModel, this.ofModule)
    );
  }

  private buildOutputData(): any {
    let result: any = this.paymentTypeData.formValue || {};
    result['reason'] = this.refundPaymentForm.value['reason'];
    result['dontRefund'] = this.refundPaymentForm.value['dontRefund'];
    return result;
  }

  // private prepareSubmitCreateData() {
  //     this.refundPaymentForm.updateValueAndValidity();
  //     const model = this.refundPaymentForm.value;
  //     return {};
  // }

  public updateLeftCharacters(event) {
    setTimeout(() => {
      this.refundPaymentForm['leftCharacters'] =
        this.consts.noteLengthDefault - event.target.value.length;
    });
  }

  private getListComboBox() {
    if (this.shadowCurrencyList && this.shadowCurrencyList.length) {
      this.paymentTypeData['currencyList'] = this.shadowCurrencyList;
      this.paymentTypeData = cloneDeep(this.paymentTypeData);
      return;
    }
    this.commonService
      .getListComboBox('' + ComboBoxTypeConstant.currency)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || !response.item || !response.item.currency)
            return null;
          this.shadowCurrencyList = response.item.currency;
          this.paymentTypeData['currencyList'] = this.shadowCurrencyList;
          this.paymentTypeData = cloneDeep(this.paymentTypeData);
        });
      });
  }

  /**
   * createFakePaymentTypeData
   * Create fake data for dropdown payment type
   */
  private createFakePaymentTypeData(): Array<any> {
    return this.consts.paymentTypeData;
  }
}
