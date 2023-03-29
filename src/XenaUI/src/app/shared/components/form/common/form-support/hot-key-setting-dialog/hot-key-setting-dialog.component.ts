import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { HotKeySettingActions } from 'app/state-management/store/actions';
import { HotKeySetting, GlobalSettingModel } from 'app/models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppErrorHandler, GlobalSettingService } from 'app/services';
import { BaseComponent } from 'app/pages/private/base';
import { Configuration, GlobalSettingConstant } from 'app/app.constants';
import { Uti, String } from 'app/utilities';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
  selector: 'hot-key-setting-dialog',
  templateUrl: './hot-key-setting-dialog.component.html',
  styleUrls: ['./hot-key-setting-dialog.component.scss'],
})
export class HotKeySettingDialogComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public hotKeySettingForm: FormGroup;
  public hasHandlerKey: boolean = false;
  public hasLetterKey: boolean = false;
  public hotKeySettingState: Observable<HotKeySetting>;

  private hotKeySetting: HotKeySetting;
  private hotKeySettingStateSubscription: Subscription;
  private currentGlobalSettingModel: any;
  private consts: Configuration = new Configuration();
  private keyBuffer: Array<any> = [];
  private keyBufferKeep: Array<any> = [];
  private timeoutKeyUp: any;

  @Input()
  controlKey: string = '';

  @Input()
  hotKey: string = '';

  @Input() showDialog = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onUpdated: EventEmitter<any> = new EventEmitter();
  @ViewChild('hotKeytxt') hotKeyInput;

  @HostListener('document:keydown.out-zone', ['$event'])
  onKeyDown($event) {
    this.pushKeyDownIntoBuffer($event.keyCode);
    Uti.disabledEventPropagation($event);
  }

  @HostListener('document:keyup.out-zone', ['$event'])
  onKeyUp($event) {
    this.removeKeyUpIntoBuffer($event.keyCode);
    // Uti.disabledEventPropagation($event);
  }

  constructor(
    private store: Store<AppState>,
    private hotKeySettingActions: HotKeySettingActions,
    private globalSettingService: GlobalSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private appErrorHandler: AppErrorHandler,
    protected router: Router
  ) {
    super(router);
    this.hotKeySettingState = store.select(
      (state) => state.hotKeySettingtState.hotKeySetting
    );
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.getHotKeySetting();
    this.subscribeHotKeySettingState();
    this.hotKeySettingForm = new FormGroup({
      hotKey: new FormControl(this.hotKey, [
        this.isValidHotkey(this.hotKeySetting, this.controlKey),
      ]),
    });
  }

  private isValidHotkey(hotKeySetting: HotKeySetting, controlKey: string) {
    return (input: FormControl) => {
      let isValid: boolean = true;
      Object.keys(hotKeySetting).forEach((key) => {
        if (hotKeySetting[key] && input.value) {
          if (
            hotKeySetting[key].toString().toLowerCase() ==
              input.value.toString().toLowerCase() &&
            controlKey != key
          ) {
            isValid = false;
          }
        }
      });
      return isValid ? null : { exists: true };
    };
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.hotKeyInput) {
        this.hotKeyInput.nativeElement.focus();
      }
    });

    window.addEventListener('blur', () => {
      this.keyBuffer = [];
    });
  }

  /**
   * subscribeHotKeySettingState
   */
  subscribeHotKeySettingState() {
    if (this.hotKeySettingStateSubscription)
      this.hotKeySettingStateSubscription.unsubscribe();

    this.hotKeySettingStateSubscription = this.hotKeySettingState.subscribe(
      (hotKeySetting) => {
        this.appErrorHandler.executeAction(() => {
          this.hotKeySetting = hotKeySetting;
        });
      }
    );
  }

  /**
   * getHotKeySetting
   */
  private getHotKeySetting() {
    this.globalSettingService
      .getAllGlobalSettings(this.ofModule.idSettingsGUI)
      .subscribe((data) => this.getAllGlobalSettingSuccess(data));
  }

  /**
   * saveHotKeyConfig
   * @param data
   */
  private saveHotKeyConfig(data: GlobalSettingModel[]) {
    if (
      !this.currentGlobalSettingModel ||
      !this.currentGlobalSettingModel.idSettingsGlobal ||
      !this.currentGlobalSettingModel.globalName
    ) {
      this.currentGlobalSettingModel = new GlobalSettingModel({
        globalName: this.getHotkeySettingName(),
        description: 'Hotkey Setting',
        globalType: this.globalSettingConstant.hotkeySetting,
      });
    }
    this.currentGlobalSettingModel.idSettingsGUI = this.ofModule.idSettingsGUI;
    this.currentGlobalSettingModel.jsonSettings = JSON.stringify(
      this.hotKeySetting
    );
    this.currentGlobalSettingModel.isActive = true;

    this.globalSettingService
      .saveGlobalSetting(this.currentGlobalSettingModel)
      .subscribe((_data) => this.saveHotKeyConfigSuccess(_data));
  }

  /**
   * saveHotKeyConfigSuccess
   * @param data
   */
  private saveHotKeyConfigSuccess(data: any) {
    this.globalSettingService.saveUpdateCache(
      this.ofModule.idSettingsGUI,
      this.currentGlobalSettingModel,
      data
    );
    this.store.dispatch(
      this.hotKeySettingActions.addHotKeySetting(this.controlKey, this.hotKey)
    );
    this.close();
  }

  /**
   * getAllGlobalSettingSuccess
   * @param data
   */
  private getAllGlobalSettingSuccess(data: GlobalSettingModel[]) {
    if (!data || !data.length) {
      return;
    }
    this.currentGlobalSettingModel = data.find(
      (x) => x.globalName === this.getHotkeySettingName()
    );
  }

  /**
   * getHotkeySettingName
   */
  private getHotkeySettingName() {
    return String.Format(
      '{0}_{1}',
      this.globalSettingConstant.hotkeySetting,
      this.ofModule ? String.hardTrimBlank(this.ofModule.moduleName) : ''
    );
  }

  /**
   * open
   */
  open() {
    this.showDialog = true;
  }

  /**
   * Close
   */
  close() {
    this.showDialog = false;
    this.onClose.emit();
  }

  /**
   * Save
   */
  save() {
    if (this.hotKeySettingForm.valid) {
      this.hotKey = this.hotKeySettingForm.controls['hotKey'].value;
      this.hotKeySetting[this.controlKey] = this.hotKey;
      this.saveHotKeyConfig(this.currentGlobalSettingModel);
    }
  }

  private pushKeyDownIntoBuffer(keyCode) {
    if (!this.keyBuffer.length) {
      this.keyBufferKeep.length = 0;
    }
    if (
      this.keyBuffer &&
      this.keyBuffer.indexOf(keyCode) === -1 &&
      ((keyCode > 64 && keyCode < 91) || // from A -> Z
        (keyCode > 15 && keyCode < 19) || // Ctr + Shift + Alt
        (keyCode > 47 && keyCode < 58))
    ) {
      // 0 -> 9
      this.keyBuffer.push(keyCode);
    }
    // if (this.keyBuffer.length > 1) {
    this.keyBufferKeep = cloneDeep(this.keyBuffer);
    this.buildKeyNameToTextBox();
    // }
  }

  private removeKeyUpIntoBuffer(keyCode) {
    if (this.keyBuffer && this.keyBuffer.indexOf(keyCode) > -1) {
      this.keyBuffer = this.keyBuffer.filter((x) => x !== keyCode);
    }
    if (this.timeoutKeyUp) {
      clearTimeout(this.timeoutKeyUp);
      this.timeoutKeyUp = null;
    }
    this.timeoutKeyUp = setImmediate(() => {
      if (this.keyBuffer.length === 0) return;
      this.buildKeyNameToTextBox();
    }, 300);
  }

  private buildKeyNameToTextBox() {
    this.hotKeySettingForm['submitted'] = true;
    if (this.keyBufferKeep.length === 0) {
      this.hotKeySettingForm.controls['hotKey'].setValue('');
      return;
    }
    this.keyBufferKeep = this.keyBufferKeep.sort((a, b) => a - b);
    let displayText = '';
    for (let i = 0; i < this.keyBufferKeep.length; i++) {
      displayText += this.consts.keyCode[this.keyBufferKeep[i]];
      if (i < this.keyBufferKeep.length - 1) {
        displayText += '+';
      }
    }
    // console.log(displayText);
    this.hotKeySettingForm.controls['hotKey'].setValue(displayText);
    this.checkLetterKeyInArray();
  }

  private checkLetterKeyInArray() {
    this.hasLetterKey = this.hasHandlerKey = false;
    for (let keyCode of this.keyBufferKeep) {
      if (
        (keyCode > 64 && keyCode < 91) || // from A -> Z
        (keyCode > 47 && keyCode < 58)
      ) {
        // 0 -> 9
        this.hasLetterKey = true;
      }
      if (keyCode > 15 && keyCode < 19) {
        // Ctr + Shift + Alt
        this.hasHandlerKey = true;
      }
    }
  }
}
