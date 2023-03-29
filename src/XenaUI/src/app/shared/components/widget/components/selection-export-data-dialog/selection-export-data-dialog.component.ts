import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Uti } from 'app/utilities';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { Subscription, Observable } from 'rxjs';
import { AppErrorHandler, ModalService } from 'app/services';
import isString from 'lodash-es/isString';
import isObject from 'lodash-es/isObject';

@Component({
  selector: 'selection-export-data-dialog',
  styleUrls: ['./selection-export-data-dialog.component.scss'],
  templateUrl: './selection-export-data-dialog.component.html',
})
export class SelectionExportDataDialogComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public BUTTON_STATE = {
    exportAll: {
      loading: false,
    },
    exportMediacode: {
      loading: false,
    },
    exportSelectionData: {
      loading: false,
    },
  };

  public EXPORT_FILE_TYPES = [
    {
      idValue: 'xls',
      textValue: 'Excel 97-2003 Workbook (*.xls)',
    },
    {
      idValue: 'xlsx',
      textValue: 'Microsoft Excel format (*.xlsx)',
    },
    {
      idValue: 'csv',
      textValue: 'Comma-separated values format (*.csv)',
    },
  ];

  public formGroup: FormGroup;
  public submitted = false;
  public showDialog = false;
  public emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  private formValuesChangeSubscription: Subscription;

  private exportSelectionDataResultStateSubscription: Subscription;

  @Output() onClose = new EventEmitter();

  constructor(
    protected router: Router,
    private store: Store<AppState>,
    private processDataActions: ProcessDataActions,
    private uti: Uti,
    private dispatcher: ReducerManagerDispatcher,
    private appErrorHandler: AppErrorHandler,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: ModalService
  ) {
    super(router);
  }

  public ngOnInit() {
    this.createForm();
    this.registerFormValueChange();

    this.subscribeExportSelectionDataResultState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  ngAfterViewInit() {}

  private createForm() {
    this.formGroup = new FormGroup({
      email: new FormControl(
        [this.uti.getUserInfo().email],
        [Validators.required]
      ),
      exportFileType: new FormControl('', Validators.required),
      csvDelimiter: new FormControl(';'),
    });
    this.changeDetectorRef.detectChanges();
  }

  private registerFormValueChange() {
    this.formValuesChangeSubscription = this.formGroup.valueChanges
      .debounceTime(200)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (!this.formGroup.pristine) {
            this.changeDetectorRef.detectChanges();
          }
        });
      });
  }

  public open() {
    this.showDialog = true;
    this.changeDetectorRef.detectChanges();
  }

  public cancel() {
    this.showDialog = false;
    this.onClose.emit();
    this.changeDetectorRef.detectChanges();
  }

  public exportFileTypeChanged(exportFileTypeCombobox) {
    if (exportFileTypeCombobox && exportFileTypeCombobox.selectedItem) {
      this.formGroup.controls.exportFileType.setValue(
        exportFileTypeCombobox.selectedItem.idValue
      );

      if (exportFileTypeCombobox.selectedItem.idValue === 'csv') {
        this.formGroup.controls.csvDelimiter.setValue(';');
      } else {
        this.formGroup.controls.csvDelimiter.setValue('');
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  public exportSelectionData(type) {
    if (!this.formGroup.value.email) {
      this.formGroup.controls.email.setValue(this.uti.getUserInfo().email);
    }

    this.formGroup.updateValueAndValidity();
    this.submitted = true;
    try {
      if (!this.formGroup.valid) {
        return;
      }

      if (type === 'mediacode') {
        this.BUTTON_STATE.exportMediacode.loading = true;
      } else if (type === 'data') {
        this.BUTTON_STATE.exportSelectionData.loading = true;
      } else if (type === 'all') {
        this.BUTTON_STATE.exportAll.loading = true;
      }

      this.store.dispatch(
        this.processDataActions.requestExportSelectionData(
          type,
          this.ofModule,
          this.formGroup.value.email.join(','),
          this.formGroup.value.exportFileType,
          this.formGroup.value.csvDelimiter
        )
      );
      this.changeDetectorRef.detectChanges();
    } catch (ex) {
      this.submitted = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
  }

  private subscribeExportSelectionDataResultState() {
    this.exportSelectionDataResultStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.EXPORT_SELECTION_DATA_RESULT &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((action: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (action.payload.exportType === 'mediacode') {
            this.BUTTON_STATE.exportMediacode.loading = false;
          } else if (action.payload.exportType === 'data') {
            this.BUTTON_STATE.exportSelectionData.loading = false;
          } else if (action.payload.exportType === 'all') {
            this.BUTTON_STATE.exportAll.loading = false;
          }

          if (action.payload.isSuccess) {
            this.cancel();

            const emailList = this.formGroup.value.email.map((email) => {
              return `<li>${email}</li>`;
            });
            this.modalService.successMessage(
              {
                message: [
                  { key: '<p>' },
                  {
                    key: 'Modal_Message__Export_Data_Has_Been_Sent_To_Your_Email_Address',
                  },
                  { key: '</p><ul>' },
                  { key: emailList },
                  { key: '</ul>' },
                ],
              },
              true
            );
          }

          this.changeDetectorRef.detectChanges();
        });
      });
  }
}
