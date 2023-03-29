import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppErrorHandler, ModalService } from 'app/services';
import {
  ModuleSettingActions,
  ProcessDataActions,
  CustomAction,
  TabSummaryActions,
} from 'app/state-management/store/actions';
import { RequestSavingMode } from 'app/app.constants';
import {
  BusinessCostHeaderFormComponent,
  BusinessCostRowFormComponent,
} from 'app/shared/components/form';
import { Uti } from 'app/utilities';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-business-cost-form',
  styleUrls: ['./business-cost-form.component.scss'],
  templateUrl: './business-cost-form.component.html',
})
export class BusinessCostFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private _progressStatus;

  set progressStatus(value) {
    this._progressStatus = value;
    if (this.toolbarSetting) {
      this.toolbarSetting.SaveNext = this._progressStatus == 1 ? '1' : '0';
    }
    this.store.dispatch(
      this.moduleSettingActions.selectToolbarSetting(
        this.toolbarSetting,
        this.ofModule
      )
    );
  }

  get progressStatus() {
    return this._progressStatus;
  }

  public showBusinessCostHeaderForm = true;
  public idSalesCampaignWizard: any;
  public globalProperties: any;

  private willGoToStep1 = false;
  private willChangeBusinessCostRow = false;
  private willGoToStep2 = false;
  // private outPutFormHeader: any;
  // private outPutFormRow: any;
  // private headerFormHasChangeValue = false;
  // private rowFormHasChangeValue = false;
  private headerFormSaveCallback = false;
  // private rowFormSaveCallback = false;
  private saveAndChangeStep = false;
  private businessCostHeaderSubmitted = false;
  private businessCostRowSubmitted = false;
  private formEditMode = false;
  private formEditData = null;
  private toolbarSetting: any;
  private currentSavingMode: RequestSavingMode;

  private formEditModeState: Observable<boolean>;
  private formEditDataState: Observable<any>;
  private toolbarSettingState: Observable<any>;
  private formEditModeStateSubscription: Subscription;
  private formEditDataStateSubscription: Subscription;
  private toolbarSettingStateSubscription: Subscription;
  private requestSaveSubscription: Subscription;
  private requestNewInEditSubscription: Subscription;
  private okToGoToFirstStepSubscription: Subscription;
  private okToGoToSecondStepSubscription: Subscription;
  private okToChangeBusinessCostRowSubscription: Subscription;
  private step1ClickSubscription: Subscription;
  private step2ClickSubscription: Subscription;
  private globalPropertiesStateSubscription: Subscription;
  private globalPropertiesState: Observable<any>;

  @ViewChild('businessCostHeader')
  businessCostHeader: BusinessCostHeaderFormComponent;
  @ViewChild('businessCostRow') businessCostRow: BusinessCostRowFormComponent;

  @Input() gridId: string;
  @Input() switchForm: string;
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  constructor(
    private store: Store<AppState>,
    private appErrorHandler: AppErrorHandler,
    private modalService: ModalService,
    private moduleSettingActions: ModuleSettingActions,
    private tabSummaryActions: TabSummaryActions,
    private processDataActions: ProcessDataActions,
    private dispatcher: ReducerManagerDispatcher,
    private toasterService: ToasterService,
    protected router: Router
  ) {
    super(router);

    this.formEditModeState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditMode
    );
    this.formEditDataState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditData
    );
    this.toolbarSettingState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).toolbarSetting
    );
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
  }

  /**
   * subcribeToolbarSettingState
   */
  private subcribeToolbarSettingState() {
    this.toolbarSettingStateSubscription = this.toolbarSettingState.subscribe(
      (toolbarSettingState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.toolbarSetting = toolbarSettingState;
        });
      }
    );
  }

  public ngOnInit() {
    this.subscription();
    this.subcribeToolbarSettingState();
    this.setActiveForm();
    this.subscribeStep1Click();
    this.subscribeStep2Click();
    this.subscribeGlobalProperties();
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    if (this.formEditMode) {
      this.idSalesCampaignWizard = +this.formEditData.id;
    }

    this.progressStatus = this.showBusinessCostHeaderForm ? 1 : 2;
    this.store.dispatch(
      this.tabSummaryActions.setFormEditTextDataSubTab(
        {
          main: 'Main',
          detail: 'Country Detail',
        },
        this.ofModule
      )
    );
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalProperties = globalProperties;
          }
        });
      });
  }

  private setActiveForm() {
    this.setShowHeaderForm(this.switchForm === 'header');
  }

  private setShowHeaderForm(value: boolean) {
    this.showBusinessCostHeaderForm = value;
    this.store.dispatch(
      this.tabSummaryActions.setFormEditDataActiveSubTab(
        this.showBusinessCostHeaderForm,
        this.ofModule
      )
    );
  }

  /**
   * subscribeFormEditModeState
   */
  private subscription() {
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

    this.requestSaveSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return {
          savingMode: action.payload,
        };
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.currentSavingMode = RequestSavingMode.SaveOnly;
          if (requestSaveState.savingMode) {
            this.currentSavingMode = requestSaveState.savingMode;
          }
          this.onSubmit(this.showBusinessCostHeaderForm);
        });
      });

    // this.requestNewInEditSubscription = this.dispatcher.filter((action: CustomAction) => {
    //     return action.type === ProcessDataActions.REQUEST_NEW_IN_EDIT && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
    // }).subscribe((requestSaveState: any) => {
    //     this.appErrorHandler.executeAction(() => {
    //         if (this.businessCostRow) {
    //             this.businessCostRow.onAddNew();
    //         }
    //     });
    // });

    this.okToGoToFirstStepSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_GO_TO_FIRST_STEP &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (this.willGoToStep1) {
            this.processGoToStep1();
          }
        });
      });

    this.okToGoToSecondStepSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_GO_TO_SECOND_STEP &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (this.willGoToStep2) {
            this.processGoToStep2();
          }
        });
      });

    this.okToChangeBusinessCostRowSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_BUSINESS_COST_ROW &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (this.willChangeBusinessCostRow) {
            this.processChangeBusinessCostRow();
          }
        });
      });
  }

  private onSubmit(showBusinessCostHeaderForm: boolean, saveOnly?: boolean) {
    if (saveOnly) {
      this.currentSavingMode = RequestSavingMode.SaveOnly;
    }
    if (showBusinessCostHeaderForm) {
      if (this.businessCostHeader) this.businessCostHeader.onSubmit();
      this.businessCostHeaderSubmitted = true;
    } else {
      if (this.businessCostRow) this.businessCostRow.onSubmit();
      this.businessCostRowSubmitted = true;
    }
  }

  public headerFormDataChange($event) {
    // this.outPutFormHeader = $event;
    this.outputData.emit($event);
    // this.headerFormHasChangeValue = true;
  }

  public headerFormSaveDataChange($event) {
    // this.outPutFormHeader = $event;
    if (!$event || !$event.submitResult || !$event.returnID) return;

    $event['savingMode'] = this.currentSavingMode;
    this.outputData.emit($event);
    switch (this.currentSavingMode) {
      case RequestSavingMode.SaveAndNext: {
        this.progressStatus = 2;
        this.setShowHeaderForm(false);
        this.idSalesCampaignWizard = $event.returnID;
        break;
      }
      case RequestSavingMode.SaveOnly: {
        this.idSalesCampaignWizard = $event.returnID;
        break;
      }
      default:
        break;
    }
    this.changeStep(true);
    // setTimeout(() => {
    // 	this.headerFormHasChangeValue = false;
    // }, 1000);
  }

  public rowFormDataChange($event) {
    // this.outPutFormRow = $event;
    $event['savingMode'] = this.currentSavingMode;
    // if (!_.isNil($event.submitResult) && $event.submitResult) {
    // 	$event['returnID'] = this.idSalesCampaignWizard;
    // }

    this.outputData.emit($event);
    // this.rowFormHasChangeValue = true;
  }

  public rowFormSaveDataChange($event) {
    // this.outPutFormRow = $event;
    // if (!$event || !$event.submitResult || !$event.returnID) return;
    // this.setShowHeaderForm(false);
    // setTimeout(() => {
    // this.rowFormHasChangeValue = false;
    // }, 1000);
    // if (this.rowFormSaveCallback) {
    // 	this.progressStatus = 1;
    // 	this.setShowHeaderForm(true);
    // 	this.rowFormSaveCallback = false;
    // 	return;
    // }
    // this.changeStep(true);
    $event['savingMode'] = this.currentSavingMode;
    this.outputData.emit($event);
    // this.outputData.emit({
    // 	submitResult: true,
    // 	formValue: $event.formValue,
    // 	isValid: true,
    // 	isDirty: false,
    // 	returnID: $event.returnID,
    // 	savingMode: this.currentSavingMode
    // });
  }
  private subscribeStep1Click() {
    this.step1ClickSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabSummaryActions.SET_FORM_EDIT_SUB_TAB_1_CLICK &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.step1Click(null);
        });
      });
  }
  private subscribeStep2Click() {
    this.step2ClickSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabSummaryActions.SET_FORM_EDIT_SUB_TAB_2_CLICK &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((requestSaveState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.step2Click(null);
        });
      });
  }

  public step1Click(event) {
    this.willGoToStep1 = true;
    this.store.dispatch(
      this.processDataActions.requestGoToFirstStep(this.ofModule)
    );
  }

  public saveBusinessCostRowData($event: any) {
    this.willChangeBusinessCostRow = true;
    this.store.dispatch(
      this.processDataActions.requestChangeBusinessCostRow(this.ofModule)
    );
  }

  private processChangeBusinessCostRow() {
    this.willChangeBusinessCostRow = false;
    // this.businessCostRow.reSelectGridRow();
  }

  private processGoToStep1() {
    this.gotoStep1();
    this.willGoToStep1 = false;
  }

  private gotoStep1() {
    this.progressStatus = 1;
    this.setShowHeaderForm(true);
    this.updateFormDirty();
  }

  public step2Click(event) {
    if (!this.idSalesCampaignWizard) return;

    this.willGoToStep2 = true;
    this.store.dispatch(
      this.processDataActions.requestGoToSecondStep(this.ofModule)
    );
  }

  private processGoToStep2() {
    this.gotoStep2();
    this.willGoToStep2 = false;
  }

  private gotoStep2() {
    this.progressStatus = 2;
    this.setShowHeaderForm(false);
    this.updateFormDirty();
  }

  private changeStep(toStep2: boolean) {
    if (!this.saveAndChangeStep) {
      return;
    }

    this.saveAndChangeStep = false;
    if (toStep2) this.gotoStep2();
    else this.gotoStep1();
  }
  private updateFormDirty() {
    this.outputData.emit({
      submitResult: null,
      formValue: null,
      isValid: true,
      isDirty: false,
      returnID: null,
      savingMode: this.currentSavingMode,
    });
  }

  // public confirmSavingWhenChangeStatus(showBusinessCostHeaderForm: boolean) {
  // 	this.modalService.unsavedWarningMessageDefault({
  // 		headerText: 'Saving Changes',
  // 		onModalSaveAndExit: () => { this.saveDataWhenChangeStatus(showBusinessCostHeaderForm); },
  // 		onModalExit: () => {
  // 			this.headerFormHasChangeValue = false;
  // 			this.rowFormHasChangeValue = false;
  // 			if (this.showBusinessCostHeaderForm) this.gotoStep2();
  // 			else this.gotoStep1();
  // 		}
  // 	}, this.ofModule);
  // }

  // private saveDataWhenChangeStatus(showBusinessCostHeaderForm: boolean) {
  // 	this.saveAndChangeStep = true;
  // 	this.headerFormSaveCallback = showBusinessCostHeaderForm;
  // 	this.rowFormSaveCallback = !showBusinessCostHeaderForm;

  // 	this.onSubmit(showBusinessCostHeaderForm, true);
  // }
}
