import {
  OnInit,
  OnDestroy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormGroupChild } from 'app/models';
import { Uti } from 'app/utilities';
import { defaultLanguage } from 'app/app.resource';

@Component({
  selector: 'ad-main-field',
  styleUrls: ['./ad-main-field.component.scss'],
  templateUrl: './ad-main-field.component.html',
})
export class AdMainFieldComponent implements OnInit, OnDestroy {
  private mandatoryCheckData: any = {};
  private regularExpressionData: any = {};
  private adMainFieldForm: FormGroup;
  private parentFormGroup: FormGroup;
  private formFieldConfig: any;
  private commonConfig: any;
  public isRenderForm = false;
  private isCompanyRequired = false;

  private administrationMainFieldData: any = {};
  private listComboBox: any;

  @Input() mandatoryCheckColor = {};
  @Input() hiddenFields = {};
  @Input() set initInformation(information: any) {
    this.administrationMainFieldData = information.data;

    if (
      information &&
      information.data &&
      information.listComboBox &&
      information.parentFormGroup &&
      information.formConfig
    ) {
      this.mandatoryCheckData = information.mandatoryData || {};
      this.regularExpressionData = information.regularExpressionData || {};
      this.administrationMainFieldData = information.data;
      this.formFieldConfig = information.formConfig['formFieldConfig'];
      this.commonConfig = information.formConfig['commonConfig'];
      this.appendDefaultValueToTranslateResource();
      this.parentFormGroup = information.parentFormGroup;
      this.listComboBox = information.listComboBox;
      this.isRenderForm = true;
      if (!information.parentFormGroup.contains('adMainFieldForm'))
        information.parentFormGroup.addControl(
          'adMainFieldForm',
          this.adMainFieldForm
        );
      else
        information.parentFormGroup.controls['adMainFieldForm'] =
          this.adMainFieldForm;

      // TODO: replace this by real data
      this.adMainFieldForm.controls['principal']['label'] = 'Principal';
      this.adMainFieldForm.controls['title']['label'] = 'Title';
      this.adMainFieldForm.controls['idRepTitleOfCourtesy']['label'] =
        'Title Of Courtesy';
      this.initFormGroup.emit({
        form: this.adMainFieldForm,
        name: 'adMainFieldForm',
      });
      this.addValidation();
    }
  }
  @Output() initFormGroup: EventEmitter<FormGroupChild> = new EventEmitter();

  constructor(private forBuilder: FormBuilder) {
    this.initEmptyData();
  }

  private appendDefaultValueToTranslateResource() {
    defaultLanguage['Ad_Main__' + this.commonConfig['headerText']] =
      this.commonConfig['headerText'];
  }

  public ngOnInit() {}

  public ngOnDestroy() {}

  private initEmptyData() {
    this.adMainFieldForm = this.forBuilder.group({
      isActive: true,
      principal: '',
      company: '',
      idRepTitle: '',
      title: '',
      lastName: '',
      firstName: '',
      additionalName: '',
      middlename: '',
      suffixName: '',
      idRepTitleOfCourtesy: '',
    });
    Uti.setIsTextBoxForFormControl(this.adMainFieldForm, [
      'company',
      'lastName',
      'firstName',
      'additionalName',
      'middlename',
      'suffixName',
    ]);
    Uti.registerFormControlType(this.adMainFieldForm, {
      dropdown: 'principal;idRepTitle;idRepTitleOfCourtesy',
    });
  }

  private addValidation() {
    Uti.setValidatorForForm(this.adMainFieldForm, this.mandatoryCheckData);
    Uti.setValidatorRegularExpresionForForm(
      this.adMainFieldForm,
      this.regularExpressionData
    );
    if (!this.formFieldConfig['principal']) {
      this.adMainFieldForm.controls['principal'].clearValidators();
      this.adMainFieldForm.controls['principal'].updateValueAndValidity();
    }
  }
}
