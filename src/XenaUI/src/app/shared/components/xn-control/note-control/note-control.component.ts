import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'app/models';
import {
  Note,
  NoteActionEnum,
  NoteEnum,
  NoteFormDataAction,
  NoteLoading,
} from 'app/models/note.model';
import { ModalService, PropertyPanelService } from 'app/services';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FilterOptionFormatDate, ServiceUrl } from 'app/app.constants';
import { ReducerManagerDispatcher } from '@ngrx/store';
import {
  CustomAction,
  ProcessDataActions,
  WidgetDetailActions,
} from 'app/state-management/store/actions';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
@Component({
  selector: 'note-control',
  templateUrl: './note-control.component.html',
  styleUrls: ['./note-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NoteControlComponent),
      multi: true,
    },
  ],
})
export class NoteControlComponent
  extends BaseComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  readonly Object = Object;
  readonly NoteEnum = NoteEnum;
  readonly NOTE_ACTION_ENUM = NoteActionEnum;

  formArrays: FormArray = this.fb.array([] as Note[]);
  pristineFormArrays: Note[] = [];
  selectedDate: Date = new Date();
  isDisabled = false;
  bsConfig: Partial<BsDatepickerConfig>;
  perfectScrollbarConfig: any;
  addingForm: AbstractControl;
  loading: NoteLoading = {
    share: false,
    download: false,
    print: false,
  };
  public noteAction: NoteActionEnum = this.NOTE_ACTION_ENUM.VIEW_MODE;
  public globalDateFormat: string = null;
  public formatDate: string = 'HH:mm';
  private onChange: (value: Note[]) => void = () => {};
  private onTouched: Function = () => {};

  // public datepickerConfig: DatepickerMaterialControlConfig;

  @Input() currentUser: User;
  @Input() settingModel: Partial<{
    formName: string;
    idName: string;
    bgHeaderColor: string;
    hideActionButtons: boolean;
  }> = {};
  private _noteFormDataAction: NoteFormDataAction;
  @Input() set noteFormDataAction(event: NoteFormDataAction) {
    if (!event) return;

    this.noteAction = event.action;
    switch (event.action) {
      case this.NOTE_ACTION_ENUM.ADD:
        this.addNote();
        break;
      case this.NOTE_ACTION_ENUM.SAVE:
        this.saveForm(this.addingForm, NoteEnum.ZERO, false);
        break;
      case this.NOTE_ACTION_ENUM.EDIT_MODE:
        break;
      case this.NOTE_ACTION_ENUM.VIEW_MODE:
        if (this.addingForm) {
          this.removeForm(0);
        }
        break;
      default:
        break;
    }
    this._noteFormDataAction = event;
  }
  get noteFormDataAction() {
    return this._noteFormDataAction;
  }
  @Input() idPerson: string;

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this.propertyPanelService.buildGlobalDateFormatFromProperties(
        globalProperties
      );
  }
  private props: any;
  @Input() set properties(properties: any[]) {
    this.props = properties;
    this.getFormatTime();
  }

  @Output() onRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShare: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDownload: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrint: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFocusForm: EventEmitter<{ form: FormControl; id: string }> =
    new EventEmitter<{ form: FormControl; id: string }>();
  @Output() onUpadteEditingWidget: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected router: Router,
    private fb: FormBuilder,
    private modalService: ModalService,
    private propertyPanelService: PropertyPanelService,
    protected sanitizer: DomSanitizer,
    private dispatcher: ReducerManagerDispatcher
  ) {
    super(router);
  }

  ngOnInit() {
    this.setDatePickerConfig();
    this.onSubscribe();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  ngAfterViewInit() {
    this.formArrays.valueChanges
      .takeUntil(this.getUnsubscriberNotifier())
      .subscribe(() => {
        this.onTouched();
        this.onChange(this.formArrays.value);

        if (this.noteFormDataAction && this.noteFormDataAction.status) {
          // change status disable in xn-widget-menu-status
          this.noteFormDataAction.status.hasData =
            this.addingForm &&
            this.addingForm.get('Notes') &&
            this.addingForm.get('Notes').value &&
            this.addingForm.get('Notes').value.trim();

          this.onUpadteEditingWidget.emit(
            !!this.noteFormDataAction.status.hasData
          );
        }
      });
  }

  onSubscribe() {
    this.dispatcher
      .filter((action: CustomAction) => {
        const value =
          action.type === WidgetDetailActions.REQUEST_SAVE &&
          action.module &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI &&
          this.noteFormDataAction &&
          !!this.noteFormDataAction.action &&
          !!this.noteFormDataAction.status &&
          this.noteFormDataAction.action !== this.NOTE_ACTION_ENUM.VIEW_MODE;
        return value;
      })
      .takeUntil(this.getUnsubscriberNotifier())
      .subscribe(() => {
        if (
          !!this.noteFormDataAction &&
          !!this.noteFormDataAction.status &&
          !!this.noteFormDataAction.status.hasData
        )
          this.saveForm(this.addingForm, NoteEnum.ZERO);
        else if (this.addingForm) this.removeForm(0);
      });

    this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === ProcessDataActions.TURN_OFF_FORM_EDIT_MODE;
      })
      .takeUntil(this.getUnsubscriberNotifier())
      .subscribe(() => {
        if (
          !this.noteFormDataAction ||
          !this.noteFormDataAction.action ||
          !this.noteFormDataAction.status
        )
          return;

        this.noteFormDataAction.action = this.NOTE_ACTION_ENUM.VIEW_MODE;
        this.noteFormDataAction.status.isAdd = false;
        this.noteFormDataAction.status.hasData = false;
      });
  }

  writeValue(value: Note[]) {
    this.removeAllForm();
    this.pristineFormArrays = value || [];
    this.addingForm = null;

    if (!!value && value.length) {
      value.forEach((v) => {
        const form = this.fb.group(
          new Note({
            date: v.date,
            Notes: v.Notes,
            LoginName: v.LoginName,
            IdLogin: v.IdLogin,
            [this.settingModel.idName]: v[this.settingModel.idName],
            IsDeleted: v.IsDeleted,
            Editing: v.Editing,
            Removeable: v.Removeable,
            Cancelable: v.Cancelable,
            [this.settingModel.formName]: v[this.settingModel.formName],
            IsActive: v.IsActive,
          })
        );
        this.formArrays.push(form);
      });
    }
  }

  registerOnChange(fn: (args: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.isDisabled = disabled;
  }

  addNote() {
    const newForm = this.fb.group(
      new Note({
        date: new Date(),
        Notes: '',
        LoginName: '',
        IdLogin: this.currentUser.id,
        Editing: true,
        Removeable: true,
        Cancelable: false,
      })
    );
    this.formArrays.insert(0, newForm);
    this.addingForm = newForm;
  }

  changeDate(date: Date) {
    this.selectedDate = date;
  }

  editForm(form: AbstractControl, edited: boolean, indexForm: number) {
    let oldValue: Note;
    if (!edited) {
      oldValue = this.pristineFormArrays.find(
        (f) =>
          f[this.settingModel.idName] === form.value[this.settingModel.idName]
      );
      form.patchValue({
        ...oldValue,
        Editing: edited,
        Cancelable: edited,
      });
      return;
    }
    form.patchValue({ Editing: edited, Cancelable: edited });
  }

  saveForm(
    form: AbstractControl,
    isDeleted: NoteEnum,
    hasEmit: boolean = true
  ) {
    // emit form
    const callback = (): void => {
      form.patchValue({
        Editing: false,
        Cancelable: false,
        Removeable: false,
      });
      let index = this.pristineFormArrays.findIndex(
        (f) =>
          f[this.settingModel.idName] === form.value[this.settingModel.idName]
      );
      if (index > -1) {
        this.pristineFormArrays[index] = form.value;
      } else {
        this.pristineFormArrays.push(form.value);
      }
    };
    form.patchValue({
      IsDeleted: isDeleted,
      IsActive: isDeleted === NoteEnum.ZERO ? NoteEnum.ONE : NoteEnum.ZERO,
    });
    if (form === this.addingForm) {
      this.addingForm = null;
      // form["controls"]["Editing"].setValue(false);
      this.removeForm(0);
    }
    const data = form.value;
    if (hasEmit) this.onRemove.emit(data);
  }

  public showConfirmDelModal(form: AbstractControl, isDeleted: NoteEnum) {
    this.modalService.confirmDeleteMessageHtmlContent({
      headerText: 'Delete a note',
      message: [
        { key: '<p>' },
        { key: 'Modal_Message__Are_You_Sure_To_Delete_This_Item' },
        { key: '</p>' },
      ],
      callBack1: () => {
        this.saveForm(form, isDeleted);
      },
    });
  }

  onFocus(event: FocusEvent, form: FormControl) {
    const value = event.target ? event.target['id'] : null;
    this.onFocusForm.emit({ form, id: value });
  }

  removeForm(index: number) {
    if (this.formArrays.controls[index] === this.addingForm) {
      this.addingForm = null;
    }
    this.formArrays.removeAt(index);
  }

  share() {
    const callback = () => {
      this.loading.share = false;
    };
    this.loading.share = true;
    this.onShare.emit({ callback });
  }

  download() {
    const callback = () => {
      this.loading.download = false;
    };
    this.loading.download = true;
    this.onDownload.emit({ callback });
  }

  print() {
    // if (!this.idPerson) return;
    // const url = `${new ServiceUrl().donwloadReportNote}?fieldname=IdPerson&Value=${this.idPerson}`
    // printJS({ printable: url, type: 'pdf', showModal: true })
  }

  getFormatTime() {
    switch (
      this.propertyPanelService.getItemRecursive(this.props, 'Display').value
    ) {
      case FilterOptionFormatDate.DateTime:
        this.formatDate = 'HH:mm';
        break;

      case FilterOptionFormatDate.Date:
        this.formatDate = '';
        break;

      default:
        this.formatDate = 'HH:mm';
        break;
    }

    return this.formatDate;
  }

  private setDatePickerConfig() {
    // this.datepickerConfig = this.xnDynamicMaterialControlHelper.createDatepickerMaterialControlConfig(
    //     'date',
    //     '',
    //     1,
    // );

    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-default';
    this.bsConfig.showWeekNumbers = false;
    this.bsConfig.dateInputFormat = 'DD.MM.YYYY';
    this.bsConfig.maxDate = new Date();
  }

  private removeAllForm() {
    while (this.formArrays.length) {
      this.formArrays.removeAt(0);
    }
  }
}
