import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormBase } from 'app/shared/components/form/form-base';
import { Subscription } from 'rxjs/Subscription';
import isNil from 'lodash-es/isNil';
import { Observable } from 'rxjs/Observable';
import { SubCommonState } from 'app/state-management/store/reducer/xn-common';
import { FormOutputModel, WidgetPropertyModel } from 'app/models';
import { Uti } from 'app/utilities';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { ModuleList } from 'app/pages/private/base';
import { PropertyPanelService } from 'app/services';

@Injectable()
export abstract class CustomerFormBase extends FormBase {
  public dobDateFormat = 'MM/dd/yyyy';

  protected propertyPanelReducer = propertyPanelReducer;
  protected moduleList = ModuleList;
  protected supportDOBCountryFormat: boolean = false;
  protected globalPropertiesState: Observable<any>;
  protected globalPropertiesStateSubscription: Subscription;
  protected communicationDataChangeSubscription: Subscription;
  protected forceDirty: boolean = false;
  protected moduleToPersonTypeStateSubcription: Subscription;
  protected moduleToPersonTypeState: Observable<any>;
  protected xnComStateSubcription: Subscription;
  protected xnComState: Observable<SubCommonState>;
  protected mapMenuIdToPersonTypeId: any;
  protected addressFGData: any;
  protected isCommValid = true;
  protected commOutputData: any;
  protected isRenderedAddressFG = false;
  protected lastDayOfThisYear = new Date(new Date().getFullYear(), 11, 31);
  protected listComboBox: any; //OnDestroy event: you cannot release it, because it is referenced in cache and is commonly used
  protected commInputputData: any;

  constructor(
    protected injector: Injector,
    protected propertyPanelService: PropertyPanelService,
    protected router: Router
  ) {
    super(injector, router);
  }

  protected updateCommunicationData() {
    if (!this.formGroup.contains('communicationData')) return;

    if (this.communicationDataChangeSubscription)
      this.communicationDataChangeSubscription.unsubscribe();

    this.communicationDataChangeSubscription = this.formGroup.controls[
      'communicationData'
    ].valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          this.commInputputData = [];
        });
      });
  }

  protected checkFormValid(): boolean {
    this.formGroup.updateValueAndValidity();
    return this.formGroup.valid && this.isCommValid;
  }

  protected checkFormDirty(): boolean {
    this.formGroup.updateValueAndValidity();
    return (
      this.forceDirty ||
      this.formGroup.dirty ||
      (!isNil(this.commOutputData) && this.commOutputData.length > 0)
    );
  }

  protected initDataForAddressFG(
    model: any,
    updateData?: any,
    isMarkAsPristineForm?: boolean
  ) {
    Uti.setValidatorForForm(this.formGroup, this.mandatoryData);
    Uti.setValidatorRegularExpresionForForm(
      this.formGroup,
      this.regularExpressionData
    );

    this.addressFGData = {
      data: model,
      updateData: updateData,
      mode: 1,
      listComboBox: this.listComboBox,
      parentFG: this.formGroup,
      mandatoryData: this.mandatoryData,
      regularExpressionData: this.regularExpressionData,
    };
    this.isRenderedAddressFG = true;
    setTimeout(() => {
      this.setDefaultDataForForm();

      if (isMarkAsPristineForm) {
        this.formGroup.markAsPristine();
        this.formGroup.markAsUntouched();
      }
    }, 400);
  }

  protected setValueForOutputModel(submitResult: any, returnID?: any) {
    this.outputModel = new FormOutputModel({
      submitResult: submitResult,
      formValue: this.formGroup.value,
      isValid: this.checkFormValid(),
      isDirty: this.checkFormDirty(),
      returnID: returnID,
    });
  }

  protected subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.dontShowCalendarWhenFocus =
              this.propertyPanelService.getValueDropdownFromGlobalProperties(
                globalProperties
              );
            this.globalDateFormat =
              this.propertyPanelService.buildGlobalDateFormatFromProperties(
                globalProperties
              );
            let propDOBFormatByCountry: WidgetPropertyModel =
              this.propertyPanelService.getItemRecursive(
                globalProperties,
                'DOBFormatByCountry'
              );
            if (propDOBFormatByCountry) {
              this.supportDOBCountryFormat = propDOBFormatByCountry.value;
              this.buildDateOfBirthFormat();
            }
          }
        });
      });
  }

  /**
   * buildDateOfBirthFormat
   **/
  protected buildDateOfBirthFormat() {
    this.dobDateFormat = 'MM/dd/yyyy';
    if (!this.countrySelectedItem) return;
    if (this.supportDOBCountryFormat) {
      this.dobDateFormat = Uti.getDateFormatFromIsoCode(
        this.countrySelectedItem.isoCode
      );
    }
  }
}
