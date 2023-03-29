import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { Uti } from 'app/utilities';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import {
  CommonService,
  AppErrorHandler,
  ProjectService,
  PropertyPanelService,
} from 'app/services';
import { ApiResultResponse, FormOutputModel } from 'app/models';
import * as wjcCore from 'wijmo/wijmo';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReducerManagerDispatcher } from '@ngrx/store';
import { WjComboBox } from 'public/assets/lib/wijmo/wijmo-commonjs-min/wijmo.angular2.input';

@Component({
  selector: 'app-new-project-form',
  styleUrls: ['./new-project-form.component.scss'],
  templateUrl: './new-project-form.component.html',
})
export class NewProjectFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public formGroup: FormGroup;
  public campaigns: wjcCore.CollectionView = null;
  public globalDateFormat: string = null;
  public submitted = false;
  public consts: Configuration;

  private requestSaveSubscription: Subscription;
  private formValuesChangeSubscription: Subscription;

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this.propertyPanelService.buildGlobalDateFormatFromProperties(
        globalProperties
      );
  }

  @Output() outputData: EventEmitter<any> = new EventEmitter();

  @ViewChild('campaignNrCombobox') campaignNrCombobox: WjComboBox;

  constructor(
    private commonService: CommonService,
    private appErrorHandler: AppErrorHandler,
    protected router: Router,
    private dispatcher: ReducerManagerDispatcher,
    private projectService: ProjectService,
    private propertyPanelService: PropertyPanelService,
    private uti: Uti
  ) {
    super(router);

    this.consts = new Configuration();
  }

  public ngOnInit() {
    this.createForm();
    this.subscribeFormValueChange();
    this.getCampaign();
    this.subcribeRequestSaveState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private subcribeRequestSaveState() {
    this.requestSaveSubscription = this.dispatcher
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

  public submit() {
    this.formGroup.updateValueAndValidity();
    this.submitted = true;
    try {
      if (!this.formGroup.valid) {
        this.setOutputData(false);
        return;
      }

      this.createProject();
    } catch (ex) {
      this.submitted = true;
      return;
    }
  }

  private setOutputData(submitResult: any, returnID?: any) {
    this.outputData.emit(this.setValueForOutputModel(submitResult, returnID));
  }

  private setValueForOutputModel(submitResult: any, returnID?: any) {
    return new FormOutputModel({
      submitResult: submitResult,
      formValue: this.formGroup.value,
      isValid: this.formGroup.valid,
      isDirty: this.formGroup.dirty,
      returnID: returnID,
    });
  }

  private createForm() {
    this.formGroup = new FormGroup({
      createDate: new FormControl(new Date()),
      campaignNr: new FormControl('', [
        Validators.required,
        this.validateCampaignNr.bind(this),
      ]),
      isActive: new FormControl(true),
      notes: new FormControl(''),
      name: new FormControl('', Validators.required),
    });
  }

  private validateCampaignNr(control: AbstractControl) {
    if (
      control.value &&
      this.campaigns &&
      this.campaigns.items.find(
        (item) => item.idValue == control.value && item.isExists == 1
      )
    ) {
      return { validCampaignNr: true };
    }

    return null;
  }

  protected subscribeFormValueChange() {
    if (this.formValuesChangeSubscription)
      this.formValuesChangeSubscription.unsubscribe();

    this.formValuesChangeSubscription = this.formGroup.valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (this.formGroup.pristine && this.formGroup.untouched) return;
          this.setOutputData(null);
        });
      });
  }

  private getCampaign() {
    this.commonService
      .getListComboBox(ComboBoxTypeConstant.campaign)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }

          response.item.campaign = response.item.campaign.map((camp) => {
            return {
              ...camp,
              textValue:
                camp.textValue +
                (camp.isExists == '1' ? ' (' + camp.existCampaignNr + ')' : ''),
            };
          });
          this.campaigns = new wjcCore.CollectionView(response.item.campaign, {
            currentItem: null,
          });

          this.formGroup.controls.campaignNr.markAsPristine();
        });
      });
  }

  private createProject() {
    let saveData = {
      IdSalesCampaignWizard: this.formGroup.controls.campaignNr.value,
      Notes: this.formGroup.controls.notes.value,
      ProjectName: this.formGroup.controls.name.value,
      IsActive: this.formGroup.controls.isActive.value,
      IdRepSelectionProjectType: this.ofModule.idSettingsGUI,
    };

    this.projectService.saveProject([saveData]).subscribe(
      (response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }

          this.outputData.emit({
            submitResult: true,
            formValue: this.formGroup.value,
            isDirty: false,
            isValid: true,
            returnID: response.item.returnID,
          });
          if (response.item.returnID) Uti.resetValueForForm(this.formGroup);
        });
      },
      (err) => {
        this.setOutputData(false);
      }
    );
  }

  formatDate(data: any, formatPattern: string) {
    const result = !data
      ? ''
      : this.uti.formatLocale(new Date(data), formatPattern);
    return result;
  }

  public campaignChanged(campaignNrComponent) {
    if (campaignNrComponent && campaignNrComponent.selectedItem) {
      if (campaignNrComponent.selectedItem.isExists != '1') {
        this.formGroup.controls.name.setValue(
          campaignNrComponent.selectedItem.textValue
        );
      } else {
        this.formGroup.controls.name.setValue('');
      }

      this.setOutputData(false);
    }
  }
}
