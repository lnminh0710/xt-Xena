import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
  OnDestroy,
  Injector,
  AfterViewInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService, ArticleService, PersonService } from 'app/services';
import { ComboBoxTypeConstant } from 'app/app.constants';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { ApiResultResponse, FormOutputModel } from 'app/models';
import { FormBase } from 'app/shared/components/form/form-base';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'article-form',
  styleUrls: ['./article-form.component.scss'],
  templateUrl: './article-form.component.html',
})
export class ArticleFormComponent
  extends FormBase
  implements OnInit, OnDestroy, AfterViewInit
{
  public listComboBox: any;
  public articleStatusIcon: string;
  public articleStatusIconStyle: string;
  public isArticleTypeCheck = false;
  public isRegistComboboxValueChange = false;
  public data: any;
  public isSearching: boolean = false;
  public currentArticleNr: string = '';
  public disableResetArticleTypeButton: boolean = true;

  private dispatcherSubscription: Subscription;

  @Output() outputData: EventEmitter<any> = new EventEmitter();

  @ViewChild('articleStatusControl')
  articleStatusCombobox: AngularMultiSelect;

  constructor(
    private comService: CommonService,
    private articleService: ArticleService,
    private store: Store<AppState>,
    private toasterService: ToasterService,
    private ref: ChangeDetectorRef,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    private personServ: PersonService,
    protected injector: Injector
  ) {
    super(injector, router);
    this.isAutoBuildMandatoryField = true;

    this.formEditModeState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditMode
    );
    this.formEditDataState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditData
    );
  }

  public ngOnInit() {
    this.subscribeFormEditModeState();
    this.getArticleEmptyData();
    this.initEmptyData();
    this.getDropdownlistData();
    this.subcribeRequestSaveState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngAfterViewInit() {
    this.afterViewInit();
  }

  public resetAllArticleType() {
    this.setValueDisableValue(
      [
        'isWarehouseControl',
        'isSetArticle',
        'isVirtual',
        'isPrintProduct',
        'isService',
      ],
      false,
      false
    );
    this.disableResetArticleTypeButton = true;
  }

  private subcribeRequestSaveState() {
    this.dispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private getArticleEmptyData() {
    this.personServ
      .getMandatoryField('Article')
      .subscribe((response1: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          var mandatoryParameter = Uti.getMandatoryData(response1);
          if (!isEmpty(mandatoryParameter)) {
            this.makeMadatoryField(mandatoryParameter);
            Uti.setValidatorForForm(this.formGroup, this.mandatoryData);
          }
          this.articleService
            .getArticleById('')
            .subscribe((response: ApiResultResponse) => {
              this.appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response)) {
                  return;
                }
                this.data = response.item;
                this.initDataForForm();
                this.setDefaultDataForForm();
                this.ref.markForCheck();
              });
            });
        });
      });
  }

  private getDropdownlistData() {
    this.comService
      .getListComboBox(
        ComboBoxTypeConstant.countryCode +
          ',' +
          ComboBoxTypeConstant.articleStatus
      )
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !Uti.isResquestSuccess(response) ||
            !response.item.articleStatus
          ) {
            return;
          }
          this.listComboBox = response.item;
          this.initDataForForm();
          this.ref.markForCheck();
        });
      });
  }

  private initDataForForm() {
    if (!this.data || !this.listComboBox || this.isRenderForm) {
      return;
    }
    // TODO: will remove when have correct data
    this.createFakeModelData();
    this.isRenderForm = true;
    this.updateFormValue();
    this.ref.markForCheck();
  }

  private updateFormValue() {
    setTimeout(() => {
      this.registComboboxValueChange();
      this.articleStatusCombobox.showDropdownWhenFocus = true;
      this.articleStatusCombobox.focusText(true);
    });
  }

  private formGroupSubscriptionIdRepArticleStatus: Subscription;
  private formGroupSubscriptionIdRepIsoCountryCode: Subscription;

  private registComboboxValueChange() {
    if (this.isRegistComboboxValueChange) {
      return;
    }

    if (this.formGroupSubscriptionIdRepArticleStatus)
      this.formGroupSubscriptionIdRepArticleStatus.unsubscribe();
    if (this.formGroupSubscriptionIdRepIsoCountryCode)
      this.formGroupSubscriptionIdRepIsoCountryCode.unsubscribe();

    this.formGroupSubscriptionIdRepArticleStatus = Uti.updateFormComboboxValue(
      this.formGroup,
      this.listComboBox.articleStatus,
      this.formGroup,
      'idRepArticleStatus',
      'articleStatusText'
    );

    this.formGroupSubscriptionIdRepIsoCountryCode = Uti.updateFormComboboxValue(
      this.formGroup,
      this.listComboBox.countryCode,
      this.formGroup,
      'idRepIsoCountryCode',
      'idRepIsoCountryCodeText'
    );

    this.isRegistComboboxValueChange = true;
  }

  public updateLeftCharacters(event) {
    setTimeout(() => {
      this.formGroup['leftCharacters'] =
        this.maxCharactersNotes - event.target.value.length;
    });
  }

  private initEmptyData() {
    this.initForm(
      {
        idRepArticleStatus: '',
        articleStatusText: null,
        articleNr: new FormControl(
          null,
          null,
          this.validateArticleNr.bind(this)
        ),
        articleNameShort: null,
        idArticleDescription: null,
        idArticleName: null,
        idRepIsoCountryCode: '',
        idRepIsoCountryCodeText: null,
        articleDescriptionShort: null,
        isWarehouseControl: null,
        isSetArticle: null,
        isVirtual: null,
        isPrintProduct: null,
        isService: null,
        notes: null,
      },
      true
    );
    Uti.registerFormControlType(this.formGroup, {
      dropdown: 'idRepArticleStatus;idRepIsoCountryCode',
    });
  }

  private validateArticleNr(control: FormControl) {
    this.isSearching = true;
    return this.articleService
      .checkArticleNr(control.value, this.currentArticleNr)
      .finally(() => {
        this.isSearching = false;
      });
  }

  public submit(event?: any) {
    this.formGroup['submitted'] = true;
    try {
      this.formGroup.updateValueAndValidity();

      if (!this.formGroup.valid) {
        this.setOutputData(false);
        return false;
      }

      this.setIsArticleTypeCheck();
      if (!this.isArticleTypeCheck) {
        this.setOutputData(false, null, false);
        return false;
      }

      this.createArticle();
    } catch (ex) {
      this.formGroup['submitted'] = true;
      return false;
    }

    return false;
  }

  public isValid(): boolean {
    this.setIsArticleTypeCheck();
    return this.isArticleTypeCheck && this.formGroup.valid;
  }

  public isDirty(): boolean {
    return true;
  }

  private setOutputData(submitResult: any, data?: any, isValid?, isDirty?) {
    if (!isNil(data)) {
      this.outputModel = data;
    } else {
      this.outputModel = new FormOutputModel({
        submitResult: submitResult,
        formValue: this.formGroup.value,
        isValid: !isNil(isValid) ? isValid : this.formGroup.valid,
        isDirty: !isNil(isDirty) ? isDirty : this.formGroup.dirty,
      });
    }
    this.outputData.emit(this.outputModel);
  }

  private createArticle() {
    this.articleService[this.mainId ? 'updateArticle' : 'createArticle'](
      this.prepareSubmitData()
    ).subscribe(
      (data) => {
        this.appErrorHandler.executeAction(() => {
          this.setOutputData(false, {
            submitResult: true,
            formValue: this.formGroup.value,
            isValid: true,
            isDirty: false,
            returnID: data.item.returnID,
          });
          Uti.resetValueForForm(this.formGroup);
          this.setValueDisableValue(
            [
              'isWarehouseControl',
              'isSetArticle',
              'isVirtual',
              'isPrintProduct',
              'isService',
            ],
            false,
            false
          );
        });
      },
      (err) => {
        this.setOutputData(false);
      }
    );
  }

  public prepareSubmitData() {
    this.formGroup.updateValueAndValidity();
    const model = this.formGroup.value;
    return {
      Article: {
        IdArticle: this.getUnEmptyValue(this.mainId),
        IdRepArticleStatus: model.idRepArticleStatus,
        IdRepIsoCountryCode: model.idRepIsoCountryCode,
        ArticleNr: model.articleNr,
        ArticleManufacturersNr: '123',
        IsSetArticle: !!model.isSetArticle,
        IsActive: true,
        IsWarehouseControl: !!model.isWarehouseControl,
        IsVirtual: !!model.isVirtual,
        IsPrintProduct: !!model.isPrintProduct,
        IsService: !!model.isService,
        Notes: model.notes,
      },
      ArticleName: {
        IdArticleName: this.getUnEmptyValue(model['idArticleName']),
        ArticleNameShort: model.articleNameShort,
        ArticleNameLong: model.idArticleName,
        IsAdditionalName: false,
        IsActive: true,
      },
      ArticleDescription: {
        IdArticleDescription: this.getUnEmptyValue(
          model['idArticleDescription']
        ),
        ArticleDescriptionShort: model.articleDescriptionShort,
        ArticleDescriptionLong: model.idArticleDescription,
        IsActive: true,
      },
    };
  }

  private getUnEmptyValue(value) {
    return value === '' ? null : value;
  }

  private iconStatusMap: any = {
    '1': 'thumbs-up',
    '2': 'lightbulb-o',
    '3': 'lock',
    '4': 'thumbs-down',
  };

  private iconStatusStyleMap: any = {
    '1': 'active',
    '2': 'planned',
    '3': 'locked',
    '4': 'sold-out',
  };

  public onChangeArticleStatus($event: any) {
    if (
      !this.articleStatusCombobox ||
      !this.articleStatusCombobox.selectedValue
    ) {
      return;
    }
    this.articleStatusIcon =
      this.iconStatusMap[this.articleStatusCombobox.selectedValue];
    this.articleStatusIconStyle =
      this.iconStatusStyleMap[this.articleStatusCombobox.selectedValue];
  }

  public isArticleTypeChange() {
    setTimeout(() => {
      this.formGroup.updateValueAndValidity();
      this.setIsArticleTypeCheck();
      const isWarehouseControl = this.formGroup.value.isWarehouseControl;
      const isSetArticle = this.formGroup.value.isSetArticle;
      const isVirtual = this.formGroup.value.isVirtual;
      const isPrintProduct = this.formGroup.value.isPrintProduct;
      const isService = this.formGroup.value.isService;
      this.disableResetArticleTypeButton = !(
        isWarehouseControl ||
        isSetArticle ||
        isVirtual ||
        isPrintProduct ||
        isService
      );

      if (
        !isWarehouseControl &&
        !isSetArticle &&
        !isVirtual &&
        !isPrintProduct &&
        !isService
      ) {
        this.setValueDisableValue(
          [
            'isWarehouseControl',
            'isSetArticle',
            'isVirtual',
            'isPrintProduct',
            'isService',
          ],
          false,
          false
        );
        return;
      }

      if (isWarehouseControl || isPrintProduct) {
        this.setValueDisableValue(
          ['isSetArticle', 'isService', 'isVirtual'],
          false,
          true
        );
        return;
      }

      if (isSetArticle) {
        this.setValueDisableValue(
          ['isWarehouseControl', 'isService', 'isVirtual', 'isPrintProduct'],
          false,
          true
        );
        return;
      }

      if (isService) {
        this.setValueDisableValue(
          ['isWarehouseControl', 'isSetArticle', 'isPrintProduct', 'isVirtual'],
          false,
          true
        );
        return;
      }

      if (isVirtual) {
        this.setValueDisableValue(
          ['isWarehouseControl', 'isSetArticle', 'isPrintProduct', 'isService'],
          false,
          true
        );
      }
    }, 100);
  }

  private setValueDisableValue(
    formControlNames: Array<string>,
    value: boolean,
    disable: boolean
  ) {
    for (let item of formControlNames) {
      this.formGroup.controls[item].setValue(value);
      if (disable) {
        this.formGroup.controls[item].disable();
      } else {
        this.formGroup.controls[item].enable();
        this.formGroup.controls[item].clearValidators();
        this.formGroup.controls[item].setErrors(null);
        this.formGroup.controls[item].markAsPristine();
      }
    }
  }

  private setIsArticleTypeCheck() {
    this.isArticleTypeCheck =
      this.formGroup.controls['isWarehouseControl'].value ||
      this.formGroup.controls['isSetArticle'].value ||
      this.formGroup.controls['isVirtual'].value ||
      this.formGroup.controls['isPrintProduct'].value ||
      this.formGroup.controls['isService'].value;
  }

  private createFakeModelData() {
    this.data.idArticle.displayValue = 'Article status';
    this.data.idArticleName.displayValue = 'Added art #';
  }

  // #region [Edit Form]

  private subscribeFormEditModeState() {
    this.formEditModeStateSubscription = this.formEditModeState.subscribe(
      (formEditModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.formEditMode = formEditModeState;
        });
      }
    );

    this.formEditDataStateSubscription = this.formEditDataState.subscribe(
      (formEditDataState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.formEditData = formEditDataState;
        });
      }
    );
  }

  protected getEditData() {
    setTimeout(() => {
      if (!this.isRenderForm) {
        this.getEditData();
        return;
      }
      this.articleService
        .getArticleById(this.mainId)
        .subscribe((response: ApiResultResponse) => {
          this.appErrorHandler.executeAction(() => {
            if (!Uti.isResquestSuccess(response)) return;
            this.mapRightDataForArticleForm(response.item);
            const editingData = Uti.mapObjectValueToGeneralObject(
              response.item
            );
            this.currentArticleNr = editingData.articleNr;
            Uti.setValueForFormWithStraightObject(this.formGroup, editingData, {
              isWarehouseControl: 'boolean',
              isPrintProduct: 'boolean',
              isService: 'boolean',
              isSetArticle: 'boolean',
              isVirtual: 'boolean',
            });
            this.isArticleTypeChange();
            this.setOutputData(null);
          });
        });
    }, 400);
  }

  private mapRightDataForArticleForm(data: any): any {
    for (let prop in data) {
      if (prop === 'idRepIsoCountryCode') {
        const idRepIsoCountryCode = this.listComboBox.countryCode.find(
          (x) => x.textValue === data[prop].value
        );
        if (idRepIsoCountryCode && idRepIsoCountryCode.idValue) {
          data[prop].value = idRepIsoCountryCode.idValue;
        }
      } else if (prop === 'idRepArticleStatus') {
        const articleStatus = this.listComboBox.articleStatus.find(
          (x) => x.textValue === data[prop].value
        );
        if (articleStatus && articleStatus.idValue) {
          data[prop].value = articleStatus.idValue;
        }
      }
    }
  }
  // #endregion
}
