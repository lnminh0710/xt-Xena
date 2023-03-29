import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  Renderer,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { ControlBase, DateControl, DropdownControl } from 'app/models';
import isNil from 'lodash-es/isNil';
import { Uti } from 'app/utilities';
import { PropertyPanelService } from 'app/services';
import { parse } from 'date-fns/esm';
import { MatCheckbox } from 'app/shared/components/xn-control/light-material-ui/checkbox';
import { PaymentMethod } from 'app/app.constants';

@Component({
  selector: 'inline-edit',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineEditComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InlineEditComponent),
      multi: true,
    },
  ],
  styleUrls: ['./inline-edit.component.scss'],
  templateUrl: './inline-edit.component.html',
})
export class InlineEditComponent
  implements ControlValueAccessor, Validator, OnDestroy
{
  @ViewChild('inlineEditControl') inlineEditControl;
  @Output() public onEditField: EventEmitter<any> = new EventEmitter();
  @Output() public onEnterKeyPress: EventEmitter<any> = new EventEmitter();
  @Output() public onUpdateValue: EventEmitter<any> = new EventEmitter();
  @Output() public onCancelEditField: EventEmitter<any> = new EventEmitter();
  @Output() public onDoubleClickEditAction: EventEmitter<any> =
    new EventEmitter();

  @Input() form: FormGroup;
  @Input() isDateOfBirth: boolean = false;
  @Input() control: ControlBase<any>;
  @Input() set editing(_editing: boolean) {
    this._editing = _editing;
    if (_editing) {
      const containerHeight = $(this.element.nativeElement).parent().height();
      if (this.controlHeight < containerHeight)
        this.controlHeight = containerHeight - 6;
      const controlWidth = $(this.element.nativeElement).parent().width();
      if (this.controlWidth < controlWidth) this.controlWidth = controlWidth;
    }
  }
  get editing() {
    return this._editing;
  }
  @Input() isDialogMode: boolean;
  @Input() isSAVLetter: boolean;
  @Input() alignVerticalTop: boolean;
  @Input() alignVerticalBottom: boolean;
  @Input() alignVerticalCenter: boolean;
  @Input() isShowWhenFocus: boolean;
  @Input() inputControlWidth = 0;
  @Input() dataStyle: any = {};
  @Input() justifyContent: any = {};
  @Input() set globalProperties(globalProperties: any[]) {
    this.dontShowCalendarWhenFocus =
      this.propertyPanelService.getValueDropdownFromGlobalProperties(
        globalProperties
      );
    if (this.control && this.control.controlType == 'date') {
      this.globalDateFormat =
        this.propertyPanelService.buildGlobalDateFormatFromProperties(
          globalProperties
        );
    }
    if (this.control && this.control.controlType == 'numberbox')
      this.globalFormatNumber =
        this.propertyPanelService.buildGlobalNumberFormatFromProperties(
          globalProperties
        );

    if (
      this.control &&
      this.control.key == 'B00CashProviderContract_IdRepPaymentsMethods'
    ) {
      this.control.options = this.control.options.filter(
        (v) =>
          v.key == PaymentMethod.CHECK || v.key == PaymentMethod.CREDIT_CARD
      );
    }
  }
  @Input() set widgetProperties(widgetProperties: any[]) {
    this.widgetPropertiesLocal = widgetProperties;
    this.propertiesAutoSwitchToDetail =
      this.propertyPanelService.getAutoSwitchToDetail(widgetProperties);
    this.updateProperties();
    this.applyOnWidget =
      this.propertyPanelService.getValueDropdownApplyOnWidgetFromProperties(
        this.widgetPropertiesLocal
      );
  }
  @Input() isEditingLayout: any;
  @Input() errorShow: boolean;
  @Input() isRow: boolean;
  public _height: string;
  @Input() set height(value) {
    this._height = value ? `{value}px` : '';
  }

  public isShowDropdownWhenFocusCombobox = false;
  public applyOnWidget = false;

  private controlHeight = 26;
  private controlWidth = 100;
  private _editing = false;
  public preValue: any;
  private randomId: string = Uti.guid();
  private keyupTimeout: any = null;
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;
  public value: any;
  public tempValue: any;
  public perfectScrollbarConfig = {
    suppressScrollX: true,
    suppressScrollY: false,
  };
  public globalDateFormat: string = null;
  public globalFormatNumber: string;
  public dontShowCalendarWhenFocus: boolean;
  public defaultMaxWidth = 400;
  public userEditingPostion = {
    top: 0,
    left: 0,
  };
  public userEditingListId = Uti.guid();
  public editingClass = '';
  public propertiesAutoSwitchToDetail: boolean;
  private widgetPropertiesLocal: any[] = [];

  private subject: Subject<any> = new Subject();
  private subscription: Subscription;

  set setValue(v: any) {
    this.tempValue = v;
    if (v !== this.value) {
      this.value = v;
      this.control.value = v;
    }
    this.onChange(v);
    // update the form
    this.onTouched(v);
  }

  set setValueWithoutUpdateValue(v: any) {
    if (v !== this.tempValue) {
      this.control.value = v;
      this.tempValue = v;
    }
    this.onChange(v);
    // update the form
    this.onTouched(v);
  }

  get errorMessage(): string {
    if (this.form.controls[this.control.key].hasError('required')) {
      return this.control.label + ' is required ';
    } else if (this.form.controls[this.control.key].hasError('pattern')) {
      return this.control.messageReg;
    }
  }

  constructor(
    private element: ElementRef,
    private _renderer: Renderer,
    private propertyPanelService: PropertyPanelService,
    private uti: Uti
  ) {
    this.subscription = this.subject.debounceTime(150).subscribe((event) => {
      this.onChangeValue(event);
    });

    this.updateProperties();

    setTimeout(() => {
      this.setThreeDotsForValue();
    }, 200);
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  // Required for ControlValueAccessor interface
  writeValue(value: any) {
    //if (this.control.controlType === 'date') {
    //    if (!value || value === '') {
    //        value = null;
    //    } else if (!(value instanceof Date) && value.indexOf('.') !== -1)
    //        value = parse(value, 'dd.MM.yyyy', new Date());
    //}
    if (
      this.isSAVLetter &&
      this.control.key === 'B00SharingTreeMedia_MediaSize'
    ) {
      this.value = value ? Uti.bytesToSize(value) : value;
      this.tempValue = value ? Uti.bytesToSize(value) : value;
      return;
    }
    this.value = value;
    this.tempValue = value;
    this.preValue = value;
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  // validates the form, returns null when valid else the validation object
  public validate(c: FormControl) {
    return null;
  }

  edit(value, nativeEle) {
    if (this.propertiesAutoSwitchToDetail) return;
    if (this.control.readOnly || this.isEditingLayout) return;

    const controlHeight = $('label', $(nativeEle)).height();
    if (this.controlHeight < controlHeight)
      this.controlHeight = controlHeight - 6;
    this.preValue = value;
    this.tempValue = value;
    this.editing = true;
    this.onDoubleClickEditAction.emit(this.editing);
    this.focus();
    this.onEditField.emit({
      isEditing: this.editing,
      id: this.randomId,
      control: null,
    });
  }

  focus() {
    setTimeout((_) => {
      if (!this.inlineEditControl) {
        return;
      }
      switch (this.control.controlType) {
        case 'checkbox':
          this._renderer.invokeElementMethod(
            (this.inlineEditControl as MatCheckbox)._inputElement.nativeElement,
            'focus',
            []
          );
          break;
        // case 'numberbox':
        case 'date':
        case 'textboxMask':
          this._renderer.invokeElementMethod(
            this.inlineEditControl.hostElement,
            'focus',
            []
          );
          break;
        case 'dropdown':
          this.inlineEditControl.focus();
          break;
        default:
          this._renderer.invokeElementMethod(
            this.inlineEditControl.nativeElement,
            'focus',
            []
          );
          break;
      }
    });
  }

  keypress($event) {
    if ($event.which === 13 || $event.keyCode === 13) {
      $event.preventDefault();
      setTimeout(() => {
        this.onEnterKeyPress.emit(this.control);
      }, 100);
    } else {
      this.subject.next($event);
      // setTimeout(() => this.onChangeValue($event));
    }
  }

  keyup($event) {
    // detect for backspace key
    if (
      $event.which === 8 ||
      $event.keyCode === 8 ||
      $event.which === 46 ||
      $event.keyCode === 46
    ) {
      this.subject.next($event);
      // this.onChangeValue($event);
    }
  }

  // Just detect combobox search field only
  comboboxKeyup($event) {
    clearTimeout(this.keyupTimeout);
    this.keyupTimeout = null;
    this.keyupTimeout = setTimeout(() => {
      if ($event.which === 13 || $event.keyCode === 13) {
        $event.preventDefault();
        this.onEnterKeyPress.emit(this.control);
      }
    }, 200);
  }

  focusout(event) {
    if (event) {
      $(event.target, this.element.nativeElement).html(this.tempValue);
    }
    this.value = this.tempValue;
  }

  cancel() {
    this.reset(!this.isDialogMode);
    this.setThreeDotsForValue();
    this.onCancelEditField.emit({ element: this.element.nativeElement });
  }

  reset(isResetEditing?: boolean) {
    this.setValue = this.preValue;
    if (this.control.controlType === 'dropdown') {
      let displayValue = '';
      if (
        <DropdownControl>this.control &&
        (<DropdownControl>this.control).options
      ) {
        (<DropdownControl>this.control).options.forEach((option) => {
          if (option.key === this.preValue) {
            displayValue = option.value;
          }
        });
      }
      (<DropdownControl>this.control).displayValue = displayValue;
    }
    if (isNil(isResetEditing) || isResetEditing) {
      this.editing = false;
      this.onDoubleClickEditAction.emit(this.editing);
    }
    this.onEditField.emit({
      isEditing: false,
      id: this.randomId,
      control: null,
    });
  }

  updatePrevalue() {
    this.preValue = this.value;
  }

  public updateProperties() {
    setTimeout(() => {
      const propertyDropdownForm =
        this.propertyPanelService.getValueDropdownFromProperties(
          this.widgetPropertiesLocal
        );
      if (propertyDropdownForm) {
        propertyDropdownForm.forEach((v) => {
          if (
            this.control &&
            (this.control.controlType == 'dropdown' ||
              this.control.controlType == 'date')
          ) {
            let controlKey = this.control.identificationKey;
            let label = this.control.label;
            if (!controlKey || !isNaN(parseInt(controlKey))) {
              controlKey = this.control.key.split('_')[1];
            }
            const isMatched = controlKey === v.value || label == v.value;

            if (isMatched && !v.selected) {
              this.isShowDropdownWhenFocusCombobox = false;
            } else if (isMatched && v.selected) {
              this.isShowDropdownWhenFocusCombobox = true;
            } else if (isMatched && v.selected === null) {
              this.isShowDropdownWhenFocusCombobox =
                this.dontShowCalendarWhenFocus;
            }
          }
        });
      }
    });
  }

  public onNumberValueChanged($event): void {
    setTimeout(() => this.subject.next($event));
  }

  private onChangeValue(event) {
    if (this.control.controlType === 'dropdown') {
      if (this.inlineEditControl) {
        this.setValue = this.inlineEditControl.selectedValue || '';
        this.onUpdateValue.emit(this.control);
        let displayValue = this.control.value;
        if (this.control['options'] && this.control['options'].length) {
          const rs = this.control['options'].find(
            (i) => i.key === this.control.value
          );
          if (rs) {
            displayValue = rs.value;
          }
        }
        this.control['displayValue'] = displayValue;
      }
    } else if (
      this.control.controlType === 'date' ||
      this.control.controlType === 'numberbox'
    ) {
      let valueKeypress = event && event.target && event.target.value;
      if (valueKeypress === '') {
        valueKeypress = null;
        this.control.value = valueKeypress;
        this.onChange(valueKeypress);
        this.onTouched(valueKeypress);
        return;
      }
      if (this.value) {
        this.control.value = this.value;
        this.onChange(this.value);
        this.onTouched(this.value);
      }
    } else if (this.control.controlType === 'textboxMask') {
      // this.setValue = this.inlineEditControl.rawValue || '';
      this.setValueWithoutUpdateValue = this.inlineEditControl.rawValue || '';
    } else {
      if (event && event.target) {
        if (!isNil(event.target.textContent)) {
          //this.setValue = event.target.textContent;
          this.setValueWithoutUpdateValue = event.target.textContent;
        } else {
          const newValue = event.target.value;
          this.setValue = newValue;
        }
      }
    }
    this.onEditField.emit({
      isEditing: this.editing,
      id: this.randomId,
      control: this.control,
    });
  }

  private onCheckboxChange(event) {
    // const newValue = this.value;
    const newValue = event.checked;
    this.setValue = newValue;
    this.onUpdateValue.emit(this.control);
  }

  mouseenter(pop) {
    if (
      !this.form.controls[this.control.key].valid &&
      this.form.controls[this.control.key].touched
    ) {
      pop.tooltip = this.errorMessage;
      pop.show();
    } else {
      pop.hide();
    }
  }

  mouseleave(pop) {
    pop.hide();
  }

  onSelectDate(date) {
    this.setValue = date;
  }

  public formartDateString = 'MM/dd/yyyy';

  public formatDate(date) {
    const formatDate = (this.control as DateControl).format;
    return this.uti.formatLocale(
      date,
      formatDate ? formatDate : this.globalDateFormat
    );
  }

  public getDateFormatForDOB() {
    const formatDate = (this.control as DateControl).format;
    return (formatDate ? formatDate : this.globalDateFormat) || 'MM/dd/yyyy';
  }

  public appendDataStyle(data) {
    data = data || {};
    return Object.assign({}, this.dataStyle, data);
  }

  public buildDatePickerDropdownShowWhenFocus() {
    if (!isNil(this.isShowDropdownWhenFocusCombobox)) {
      return this.isShowDropdownWhenFocusCombobox;
    } else {
      return !this.dontShowCalendarWhenFocus;
    }
  }

  public divId = 'div-value-wrapper';
  public labelId = 'label-value-wrraper';
  private counterSetText = 0;
  public setThreeDotsForValue() {
    const label = $('#' + this.labelId, this.element.nativeElement);
    if (!label || !label.length) return;
    label.text(this.getRightText());
    label.removeClass('v-l-i');
    if (this.isRow || !this._height) return;
    setTimeout(() => {
      const div = $('#' + this.divId, this.element.nativeElement);
      if (label.outerWidth() < div.width()) return;
      this.counterSetText = 0;
      let _text = '';
      if (label.outerHeight() < div.height()) {
        if (label.outerWidth() > div.width()) {
          label.text((index, text) => {
            _text = text;
            return text.replace(/\W*\s(\S)*$/, '...');
          });
        }
        this.setEllipsisForLabel(label, _text);
        return;
      }
      while (label.outerHeight() >= div.height()) {
        if (this.counterSetText > 100 || _text === label.text()) break;
        label.text((index, text) => {
          this.counterSetText++;
          _text = text;
          return text.replace(/\W*\s(\S)*$/, '...');
        });
        if (label.outerWidth() < div.width()) break;
      }
      this.setEllipsisForLabel(label, _text);
    }, 300);
  }

  private setEllipsisForLabel(label: JQuery<HTMLElement>, _text: string) {
    if (label.text().indexOf(' ') < 0) {
      label.text(_text || label.text());
      label.addClass('v-l-i');
    }
  }

  private getRightText(): string {
    switch (this.control.controlType) {
      case 'dropdown':
        return this.control['displayValue'];
      case 'date':
        return this.formatDate(this.value);
      default:
        return this.value || this.tempValue;
    }
  }
}
