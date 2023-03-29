import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonService, AppErrorHandler } from 'app/services';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import { Subscription } from 'rxjs/Subscription';
import {
  ReturnRefundActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from 'app/state-management/store';
import { Uti } from 'app/utilities';
import { ApiResultResponse } from 'app/models';
import * as returnRefundReducer from 'app/state-management/store/reducer/return-refund';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'return-payment',
  styleUrls: ['./return-payment.component.scss'],
  templateUrl: './return-payment.component.html',
})
export class ReturnPaymentComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public isRenderForm: boolean;
  public listComboBox: any;
  public returnPaymentForm: FormGroup;

  private _defaultReasonTextSelection = 'regular';
  private formChangeSubscription: Subscription;
  private resetAllEditableFormState: Observable<boolean>;
  private resetAllEditableFormStateSubscription: Subscription;
  private comServiceSubscription: Subscription;
  private resetAllEditableFormSubscription: Subscription;
  @ViewChild('returnReason') returnReason: AngularMultiSelect;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private consts: Configuration,
    private comService: CommonService,
    private appErrorHandler: AppErrorHandler,
    private returnRefundActions: ReturnRefundActions,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router
  ) {
    super(router);
  }

  public ngOnInit() {
    this.initForm();
    this.getInitDropdownlistData();
    this.subcribeFormValueChange();
    this.subcribeResetAllEditableFormState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private getInitDropdownlistData() {
    this.comServiceSubscription = this.comService
      .getListComboBox('ReturnReason')
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response) || !response.item.ReturnReason) {
            return;
          }
          this.listComboBox = response.item;
          this.isRenderForm = true;
          this.selectDefaultReason();
        });
      });
  }

  private selectDefaultReason() {
    setTimeout(() => {
      if (
        !this.returnReason ||
        !this.listComboBox ||
        !this.listComboBox.ReturnReason ||
        !this.listComboBox.ReturnReason.length
      )
        return;
      for (let i = 0; i < this.listComboBox.ReturnReason.length; i++) {
        if (
          Uti.toLowerCase(this.listComboBox.ReturnReason[i]['textValue']) !=
          this._defaultReasonTextSelection
        )
          continue;
        this.returnReason.selectedIndex = i;
        break;
      }
    }, 300);
  }

  private initForm() {
    this.returnPaymentForm = this.formBuilder.group({
      returnReason: '',
      returnNotes: '',
    });
    this.returnPaymentForm['submitted'] = false;
  }

  private subcribeFormValueChange() {
    this.formChangeSubscription = this.returnPaymentForm.valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (!this.returnPaymentForm.pristine) {
            this.store.dispatch(
              this.returnRefundActions.setReturnPayment(data, this.ofModule)
            );
          }
        });
      });
  }

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
          Uti.resetValueForForm(this.returnPaymentForm);
          this.selectDefaultReason();
        });
      });
  }
}
