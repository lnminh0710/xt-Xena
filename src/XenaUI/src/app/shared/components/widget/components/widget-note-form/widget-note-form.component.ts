import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { ReducerManagerDispatcher, Store } from '@ngrx/store';
import { SearchResultItemModel, User } from 'app/models';
import {
  Note,
  NoteActionEnum,
  NoteFormDataAction,
} from 'app/models/note.model';
import { BaseComponent } from 'app/pages/private/base';
import { AppState } from 'app/state-management/store';
import { CustomAction } from 'app/state-management/store/actions';
import { Uti } from 'app/utilities';
import { Observable } from 'rxjs';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { RepWidgetAppIdEnum } from 'app/app.constants';

const DATE_FORMAT_SAVE = 'dd-MM-yyyy';

@Component({
  selector: 'widget-note-form',
  templateUrl: './widget-note-form.component.html',
  styleUrls: ['./widget-note-form.component.scss'],
})
export class WidgetNoteFormComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // private service: DocumentService | InvoiceApprovalService;

  notes = this.fb.control([] as Note[]);
  formFocusing: { form: FormControl; id: string } = null;

  currentUser: User = new User();
  idDocument: number = null;
  idForm: number = null;

  inited: boolean = false;
  isShowEmailBox: boolean;

  settingModel: Partial<{
    formName: string;
    idName: string;
    bgHeaderColor: string;
    hideActionButtons: boolean;
  }> = {};

  private _selectedSearchResultState$: Observable<SearchResultItemModel>;

  private _dataSource: any;
  @Input() set dataSource(data: any) {
    if (!data) return;
    this._dataSource = data;

    this.notes.patchValue([]);
    const notes: Note[] = data.map(
      (d) => new Note({ ...d, [this.settingModel.formName]: this.idForm })
    );
    this.notes.patchValue(notes || []);
  }
  get dataSource() {
    return this._dataSource;
  }
  @Input() widgetApp: RepWidgetAppIdEnum;
  @Input() noteFormDataAction: NoteFormDataAction;
  @Input() idPerson: string;
  @Input() globalProperties: any[] = [];
  @Input() properties;

  @Output() callSaveAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() upadteEditingWidgetAction: EventEmitter<any> =
    new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private uti: Uti,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private action$: Actions,
    // private administrationDocSelectors: AdministrationDocumentSelectors,
    // private administrationActions: AdministrationDocumentActions,
    private injector: Injector,
    private dispatcher: ReducerManagerDispatcher
  ) {
    super(router);
    this._selectedSearchResultState$ = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedSearchResult
    );
  }

  ngOnInit() {
    this.settingModel = {
      formName: 'idFormsReport',
      idName: 'IdSharingNotes',
    };
    this.currentUser = this.uti.getUserInfo();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  ngAfterViewInit() {}

  reset() {
    this.notes.setValue([]);
  }

  refresh() {
    this.notes.setValue([]);
  }

  getDataSave(): { [key: string]: any } {
    if (!this.notes.value.filter((note: Note) => note.Notes.trim()).length) {
      return;
    }

    const data = this.notes.value.map((note: Note) => {
      return {
        ...this.transformDataForSave(note),
        [this.settingModel.formName.charAt(0).toUpperCase() +
        this.settingModel.formName.slice(1)]: this.idForm || null,
      };
    });

    const result = !!data && !!data.length ? [data[0]] : null;
    return result;
  }

  onRemove(event) {
    const action = { ...this.noteFormDataAction };
    action.action = NoteActionEnum.SAVE;
    action.data = event;
    this.callSaveAction.emit(action);
  }

  validateBeforeSave(): boolean {
    return this.notes.valid;
  }

  validateForm(): any {
    // FormStatus
    return <any>{
      isValid: true,
      formTitle: 'Note',
      errorMessages: [],
    };
  }

  setFocusOCRScan(event: { form: FormControl; id: string }) {
    this.formFocusing = event;

    // const formFocus = {
    //     fieldOnFocus: event.id,
    //     formOnFocus: new FormGroup({ [event.id]: new FormControl() }),
    //     documentFormName: '',
    //     isFieldImageCrop: false,
    //     fieldConfig: {
    //         type: MaterialControlType.INPUT
    //     }
    // };
    // this.store.dispatch(this.administrationActions.setFieldFormOnFocus(formFocus as any));
  }

  shareForm(event) {
    setTimeout(() => {
      this.isShowEmailBox = true;
      event.callback();
    }, 200);
  }

  downloadForm(event) {
    // this.service.getPdfFile(this.idDocument)
    //     .finalize(() => {
    //         event.callback();
    //     })
    //     .subscribe((response: any) => {
    //         const blobUrl = URL.createObjectURL(response);
    //         const a = document.createElement('a');
    //         a.href = blobUrl;
    //         a.download = `ReportNotes_${this.datePipe.transform(new Date(), DATE_FORMAT_SAVE)}`;
    //         document.body.appendChild(a);
    //         a.click();
    //         setTimeout(() => {
    //             a.remove();
    //         }, 200);
    //     });
  }

  printForm(event) {
    // this.service.getPdfFile(this.idDocument)
    //     .finalize(() => {
    //         event.callback();
    //     })
    //     .subscribe((response: any) => {
    //         const blobUrl = URL.createObjectURL(response);
    //         const iframe = document.createElement('iframe');
    //         iframe.style.display = 'none';
    //         iframe.src = blobUrl;
    //         document.body.appendChild(iframe);
    //         iframe.contentWindow.print();
    //     });
  }

  private transformDataForSave(data: Note): { [key: string]: any } {
    const dataSave = {} as any;
    Object.keys(data).forEach((k: string) => {
      if (k === 'date') {
        dataSave.Date = this.datePipe.transform(data[k], DATE_FORMAT_SAVE);
        return;
      }
      dataSave[k.charAt(0).toUpperCase() + k.slice(1)] = data[k];
    });
    return dataSave;
  }

  public onUpadteEditingWidget(event) {
    this.upadteEditingWidgetAction.emit(event);
  }
}
