import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Uti } from 'app/utilities';
import { ContactModel, FormGroupChild } from 'app/models';
import { Configuration } from 'app/app.constants';
import { Subscription } from 'rxjs/Subscription';
import { WjMultiSelect } from 'wijmo/wijmo.angular2.input';

@Component({
  selector: 'ad-contact-main-field',
  templateUrl: './ad-contact-main-field.component.html',
})
export class AdContactMainFieldComponent implements OnDestroy {
  public mandatoryCheckData: any = {};

  private adminContactMainFieldForm: FormGroup;
  private data: ContactModel;
  private listComboBox: any;
  public isRenderForm = false;
  private commonConfig: any;
  public lastDayOfThisYear = new Date(new Date().getFullYear(), 11, 31);
  private consts: Configuration;
  //private adminContactMainFieldFormValueChangesSubscription: Subscription;

  @Input() mandatoryCheckColor = {};
  @Input() dateFormat;
  @Input() dontShowCalendarWhenFocus;
  @Input() hiddenFields = {};
  @Input()
  set initInformation(information: any) {
    if (
      information &&
      information.data &&
      information.listComboBox &&
      information.parentFormGroup &&
      information.formConfig
    ) {
      this.mandatoryCheckData = information.mandatoryData || {};
      this.data = information.data;
      this.commonConfig = information.formConfig['commonConfig'];
      this.listComboBox = information.listComboBox;

      if (!information.parentFormGroup.contains('adminContactMainFieldForm'))
        information.parentFormGroup.addControl(
          'adminContactMainFieldForm',
          this.adminContactMainFieldForm
        );
      else
        information.parentFormGroup.controls['adminContactMainFieldForm'] =
          this.adminContactMainFieldForm;

      this.initFormGroup.emit({
        form: this.adminContactMainFieldForm,
        name: 'adminContactMainFieldForm',
      });
      Uti.setValidatorForForm(
        this.adminContactMainFieldForm,
        this.mandatoryCheckData
      );
      this.isRenderForm = true;
    }
  }

  @Output() initFormGroup: EventEmitter<FormGroupChild> = new EventEmitter();
  @Output() contactAddressChanged: EventEmitter<FormGroupChild> =
    new EventEmitter();

  @ViewChild('idRepContactAddressType')
  idRepContactAddressTypeCombobox: WjMultiSelect;

  constructor(private forBuilder: FormBuilder) {
    this.consts = new Configuration();
    this.adminContactMainFieldForm = this.forBuilder.group({
      isActive: true,
      idRepContactAddressType: null,
      expirationDate: '',
      idRepTitle: '',
      firstName: '',
      lastName: '',
      nameAddition: '',
      middlename: '',
      suffixName: '',
      company: '',
      position: '',
      department: '',
      idRepTitleOfCourtesy: '',
      idPersonInterface: '',
      idPersonMasterData: '',
      idSharingName: '',
      idPersonTypeGw: '',
      idSharingCompany: '',
    });
    Uti.setIsTextBoxForFormControl(this.adminContactMainFieldForm, [
      'firstName',
      'lastName',
      'nameAddition',
      'middlename',
      'suffixName',
      'company',
      'position',
      'department',
    ]);
    Uti.registerFormControlType(this.adminContactMainFieldForm, {
      dropdown: 'idRepTitle;idRepTitleOfCourtesy',
      multiple: 'idRepContactAddressType',
    });
    this.adminContactMainFieldForm.controls[
      'idRepContactAddressType'
    ].markAsPristine();
    this.adminContactMainFieldForm.markAsPristine();
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  //public createContactAddressType(): Array<any> {
  //    return this.idRepContactAddressTypeCombobox.checkedItems.map(x => {
  //        return {
  //            IdRepContactAddressType: x.value
  //        };
  //    });
  //}

  public createContactAddressType(
    originalContactTypeList: Array<any>
  ): Array<any> {
    const selectedContactAddressTypeList =
      this.idRepContactAddressTypeCombobox.checkedItems.map((x) => {
        return {
          IdRepContactAddressType: x.value,
          IsDeleted: '0',
        };
      });
    let deletedContactAddressTypeList = [];
    if (
      selectedContactAddressTypeList &&
      selectedContactAddressTypeList.length
    ) {
      if (originalContactTypeList && originalContactTypeList.length) {
        originalContactTypeList.forEach((item) => {
          const rs = selectedContactAddressTypeList.find(
            (p) => p.IdRepContactAddressType == item.idValue
          );
          if (!rs) {
            deletedContactAddressTypeList.push({
              IdRepContactAddressType: item.idValue,
              IsDeleted: '1',
            });
          }
        });
      }
    }
    return [
      ...selectedContactAddressTypeList,
      ...deletedContactAddressTypeList,
    ];
  }

  public onIdRepContactAddressTypeChanged() {
    if (!this.idRepContactAddressTypeCombobox.checkedItems.length) {
      this.adminContactMainFieldForm.controls[
        'idRepContactAddressType'
      ].setValidators(Validators.required);
      this.adminContactMainFieldForm.controls[
        'idRepContactAddressType'
      ].setErrors({ required: true });
    } else {
      this.adminContactMainFieldForm.controls[
        'idRepContactAddressType'
      ].clearValidators();
      this.adminContactMainFieldForm.controls[
        'idRepContactAddressType'
      ].setErrors(null);
    }
    this.contactAddressChanged.emit();
  }
}
