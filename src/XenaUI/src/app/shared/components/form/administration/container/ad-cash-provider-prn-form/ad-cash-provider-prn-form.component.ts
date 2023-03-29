import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService, PersonService, AppErrorHandler } from 'app/services';
import {
  Configuration,
  ComboBoxTypeConstant,
  PaymentMethod,
} from 'app/app.constants';

import { Uti } from 'app/utilities';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormGroupChild, ApiResultResponse } from 'app/models';
import { XnCreditCardComponent } from 'app/shared/components/xn-control';
import { AdChequesPRNComponent } from '../../components/ad-cheques-prn';
import cloneDeep from 'lodash-es/cloneDeep';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ProcessDataActions } from 'app/state-management/store/actions/process-data';
import { CustomAction } from 'app/state-management/store/actions/base';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-ad-cash-provider-prn-form',
  templateUrl: './ad-cash-provider-prn-form.component.html',
})
export class AdCashProviderPRNFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private listComboBox: any;
  public idPerson;
  public isRederCreditCard = false;

  public chequesPRNData: any;
  private creditCardData: any;
  private selectedCreditCardData: any;

  public adCashProviderPRNFormGroup: FormGroup;

  private adCashProviderPRNFormGroupValueChangesSubscription: Subscription;
  private comServiceSubscription: Subscription;
  private personServiceSubscription: Subscription;

  private chequesPRNConfig = {
    commonConfig: {},
  };
  private creditCardConfig = {
    headerText: 'Credit card',
  };

  private selectedEntityState: Observable<any>;

  private selectedEntityStateSubscription: Subscription;
  private dispatcherSubscription: Subscription;

  @ViewChild('xnCreditCard') xnCreditCard: XnCreditCardComponent;
  @ViewChild('adChequesPrn') adChequesPrn: AdChequesPRNComponent;

  private outputModel: {
    submitResult?: boolean;
    formValue: any;
    isValid?: boolean;
    isDirty?: boolean;
    returnID?: string;
  };
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  constructor(
    private consts: Configuration,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private comService: CommonService,
    private personService: PersonService,
    private dispatcher: ReducerManagerDispatcher,
    private toasterService: ToasterService,
    protected router: Router,
    private appErrorHandler: AppErrorHandler
  ) {
    super(router);

    this.selectDataFromState();
  }

  public ngOnInit() {
    this.getDropdownlistData();
    this.initEmptyData();
    this.subcribeData();
  }
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private selectDataFromState() {
    this.selectedEntityState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
  }

  public onInitFormGroup(formGroupChild: FormGroupChild) {
    formGroupChild.form.setParent(this.adCashProviderPRNFormGroup);
    this.adCashProviderPRNFormGroup.addControl(
      formGroupChild.name,
      formGroupChild.form
    );
  }

  public selectedCreditCards(data: any) {
    this.selectedCreditCardData = data.filter((x) => x.select);
    this.setOutputData(false, {
      submitResult: null,
      formValue: this.adCashProviderPRNFormGroup.value,
      isValid: true,
      isDirty: true,
      returnID: data.idPerson,
    });
  }

  private initEmptyData() {
    this.adCashProviderPRNFormGroup = this.formBuilder.group({ empty: '' });
    this.adCashProviderPRNFormGroup['submitted'] = false;
    this.setUpDataForChequesPRN();
    this.updateFormMainValue();
  }

  private updateFormMainValue() {
    setTimeout(() => {
      if (this.adCashProviderPRNFormGroupValueChangesSubscription)
        this.adCashProviderPRNFormGroupValueChangesSubscription.unsubscribe();

      this.adCashProviderPRNFormGroupValueChangesSubscription =
        this.adCashProviderPRNFormGroup.valueChanges
          .debounceTime(this.consts.valueChangeDeboundTimeDefault)
          .subscribe((data) => {
            this.appErrorHandler.executeAction(() => {
              if (!this.adCashProviderPRNFormGroup.pristine) {
                this.setOutputData(null);
              }
            });
          });
    });
  }

  private subcribeData() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (selectedEntityState && selectedEntityState.id) {
            this.idPerson = selectedEntityState.id;
          }
        });
      }
    );

    this.dispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.onSubmit();
        });
      });
  }

  private getDropdownlistData() {
    this.comServiceSubscription = this.comService
      .getListComboBox(ComboBoxTypeConstant.creditCardType.toString())
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !Uti.isResquestSuccess(response) ||
            !response.item.creditCardType
          ) {
            return;
          }
          this.listComboBox = response.item;
          this.setUpDataForCreditCard();
        });
      });
  }

  public onSubmit(event?: any) {
    this.adCashProviderPRNFormGroup['submitted'] = true;
    this.adCashProviderPRNFormGroup.updateValueAndValidity();
    try {
      if (!this.adCashProviderPRNFormGroup.valid) {
        this.adCashProviderPRNFormGroup.value.creditCard = this.creditCardData;
        this.setOutputData(false);
        //this.toasterService.pop('warning', 'Validation Fail', 'There are some fields do not pass validation.');
        return false;
      }
      this.createCashProviderPRN();
    } catch (ex) {
      this.adCashProviderPRNFormGroup['submitted'] = false;
      return false;
    }
    return false;
  }

  private createCashProviderPRN() {
    this.personServiceSubscription = this.personService
      .createCCPRN(this.prepareSubmitCreateData())
      .subscribe(
        (data) => {
          this.appErrorHandler.executeAction(() => {
            this.setOutputData(false, {
              submitResult: true,
              formValue: this.adCashProviderPRNFormGroup.value,
              isValid: true,
              isDirty: false,
              returnID: data.returnID,
            });
            if (data.returnID) this.resetForm();
          });
        },
        (err) => {
          this.setOutputData(false);
        }
      );
  }

  private resetForm() {
    Uti.resetValueForForm(this.adCashProviderPRNFormGroup);
    if (this.adChequesPrn) {
      this.adChequesPrn.resetForm();
    }

    if (this.xnCreditCard) this.xnCreditCard.resetCreditCardComponent();
  }

  private setOutputData(submitResult: any, data?: any) {
    if (typeof data !== 'undefined') {
      this.outputModel = data;
    } else {
      this.outputModel = {
        submitResult: submitResult,
        formValue: this.adCashProviderPRNFormGroup.value,
        isValid: this.adCashProviderPRNFormGroup.valid,
        isDirty: this.adCashProviderPRNFormGroup.dirty,
      };
    }
    this.outputData.emit(this.outputModel);
  }

  private prepareSubmitCreateData() {
    const model = (<any>(
      (<any>this.adCashProviderPRNFormGroup.controls).adChequesPRNFormGroup
    )).value;
    return {
      CashProviderContract: {
        ContractNr: model.prn,
        IdPerson: this.idPerson,
        IdRepIsoCountryCode: model.country,
        IdRepPaymentsMethods: model.paymentMethod,
        IsActive: model.isActive,
      },
      CashProviderContractCreditcardTypeContainer:
        this.createDataForCreditCard(),
      CashProviderContractCurrencyContainer: {
        IdRepCurrencyCode: model.currency,
        IsActive: model.isActive,
      },
      CashProviderContractPerson: {
        IdPersonMandant: model.mandant,
        IdPersonPrincipal: model.principal,
        IsActive: model.isActive,
      },
    };
  }

  private createDataForCreditCard() {
    if (!this.selectedCreditCardData) {
      return null;
    }
    return this.selectedCreditCardData.map(function (x) {
      return { IdRepCreditCardType: x.idValue };
    });
  }

  private setUpDataForCreditCard() {
    if (
      this.isRederCreditCard ||
      !this.listComboBox ||
      !this.listComboBox.creditCardType
    ) {
      return;
    }
    this.creditCardData = {
      data: cloneDeep(this.listComboBox.creditCardType),
      config: this.creditCardConfig,
    };
    //this.isRederCreditCard = true;
  }
  private setUpDataForChequesPRN() {
    this.chequesPRNData = {
      parentFormGroup: this.adCashProviderPRNFormGroup,
      formConfig: this.chequesPRNConfig,
    };
  }

  public onPaymentMethodChanged(selectedPaymentMethod) {
    this.isRederCreditCard =
      selectedPaymentMethod &&
      selectedPaymentMethod == PaymentMethod.CREDIT_CARD;
  }
}
