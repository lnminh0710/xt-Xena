import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import {Uti} from 'app/utilities';
import {AppErrorHandler, ModalService, WidgetFieldService} from 'app/services';
import {Store} from '@ngrx/store';
import {AppState} from 'app/state-management/store';
import {Router} from '@angular/router';
import {BaseComponent} from 'app/pages/private/base';
import {TypeForm} from 'app/app.constants';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: 'setting-dialog',
    styleUrls: ['./setting-dialog.component.scss'],
    templateUrl: './setting-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingDialogComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    public properties = [];
    public showDialog = false;
    public displayFields: any[] = [];
    public perfectScrollbarConfig: any;
    public title: string;
    public labelName: string;
    public multiControl: any;
    public typeForm: typeof TypeForm = TypeForm;

    private _control;
    private oldSetting: any;
    private oldSettingMulti: any;
    private isPropertyChanged = false;

    @Input() set showControlDialog(data: any) {
        if (!data) return;
        this.showDialog = true;
        this.showButtonToggle.emit({isSettingDialog: true, control: this._control});
        this.changeDetectorRef.markForCheck();
    }

    @Input() set control(data: any) {
        this.execControl(data);
    }

    @Output() onChangeAction = new EventEmitter<any>();
    @Output() onApplyAction = new EventEmitter<any>();
    @Output() showButtonToggle = new EventEmitter<any>();
    @Output() showSettingDialog = new EventEmitter<any>();

    constructor(
        private store: Store<AppState>,
        protected router: Router,
        private widgetFieldService: WidgetFieldService,
        private appErrorHandler: AppErrorHandler,
        private changeDetectorRef: ChangeDetectorRef,
        private _modalService: ModalService,
    ) {
        super(router);
    }

    ngOnInit() {
        this.initPerfectScroll();
    }

    public execControl(data) {
        if (!data) return;
        if (this.multiControl && this.multiControl.length > 0 && data) {
            this.multiControl = '';
        }
        this.subscribeWidgetFormSetting();
        if (data.layoutType === TypeForm.LineBreak) {
            this.title = 'Line Break';
        }
        if (data.layoutType === TypeForm.Panel) {
            this.title = 'Panel';
        }
        if (data.layoutType === TypeForm.Column) {
            this.title = 'Column';
        }
        if (data.layoutType === TypeForm.Control) {
            this.title = 'Field';
        }
        if (!this.multiControl) {
            this.labelName = data.label;
        }
        this._control = data;
        this.oldSetting = data.config;
        this.properties = JSON.parse(data.config || '[]');
    }

    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    private subscribeWidgetFormSetting() {
        this.widgetFieldService.currentMessage.subscribe(value => {
            if (value && value.length > 0 && value[0]['checked']) {
                this.multiControl = value;
                this.oldSettingMulti = cloneDeep(value);
                return;
            }
        });
        this.widgetFieldService.panelHeight.subscribe(panelConfig => {
            this.properties = JSON.parse(panelConfig || '[]');
            return;
        });

        this.widgetFieldService.columnWidth.subscribe(columnConfig => {
            this.properties = JSON.parse(columnConfig || '[]');
            return;
        });
        this.widgetFieldService.generalFieldHeight.subscribe(generalFieldConfig => {
            this.properties = JSON.parse(generalFieldConfig || '[]');
            return;
        });

    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public close() {
        if (!this.isPropertyChanged) {
            this.onModalExit();
            return;
        }
        this._modalService.unsavedWarningMessageDefault({
            headerText: 'Save Data',
            onModalSaveAndExit: this.apply.bind(this),
            onModalExit: this.onModalExit.bind(this)
        });
    }

    public apply(event?: any) {
        if (this.multiControl && this.multiControl.length > 0) {
            this.multiControl.forEach(x => {
                const settingControl = this.getProperties(JSON.parse(x.config), this.properties);
                x.config = JSON.stringify(settingControl);
                x.checked = false;
                this.changeDetectorRef.markForCheck();
                this.onApplyAction.emit(x);
            });
        } else {
            // this._control.config = JSON.stringify(this.properties);
            // this.changeDetectorRef.markForCheck();
            this.onApplyAction.emit(this._control);
        }
        this.exit();
    }

    public getProperties(controlConfig, propertiesConfigEmitted) {
        // getProperties General
        const propGeneralBackground = Uti.getItemRecursive(controlConfig, 'IGeneralSettingBackgroundColor');
        const propEmittedGeneralBackground = Uti.getItemRecursive(propertiesConfigEmitted, 'IGeneralSettingBackgroundColor');
        if (propEmittedGeneralBackground.value && propGeneralBackground.value !== propEmittedGeneralBackground.value) {
            propGeneralBackground.value = propEmittedGeneralBackground.value;
        }
        const propGeneralVerticalAlign = Uti.getItemRecursive(controlConfig, 'IGeneralSettingVerticalAlign');
        const propEmittedGeneralVerticalAlign = Uti.getItemRecursive(propertiesConfigEmitted, 'IGeneralSettingVerticalAlign');
        if (propGeneralVerticalAlign.value !== propEmittedGeneralVerticalAlign.value) {
            propGeneralVerticalAlign.value = propEmittedGeneralVerticalAlign.value;
        }
        const propGeneralHeight = Uti.getItemRecursive(controlConfig, 'IGeneralSettingHeight');
        const propEmittedGeneralHeight = Uti.getItemRecursive(propertiesConfigEmitted, 'IGeneralSettingHeight');
        if (propGeneralHeight.value !== propEmittedGeneralHeight.value) {
            propGeneralHeight.value = propEmittedGeneralHeight.value;
        }
        const propGeneralAutoHeight = Uti.getItemRecursive(controlConfig, 'IGeneralSettingAutoHeight');
        const propEmittedGeneralAutoHeight = Uti.getItemRecursive(propertiesConfigEmitted, 'IGeneralSettingAutoHeight');
        if (propGeneralAutoHeight.value !== propEmittedGeneralAutoHeight.value) {
            propGeneralAutoHeight.value = propEmittedGeneralAutoHeight.value;
        }
        // getPropertiesLabel
        const propLabelAlign = Uti.getItemRecursive(controlConfig, 'ILabelStyleJustifyContent');
        const propConfigEmittedAlign = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleJustifyContent');
        if (propLabelAlign.value !== propConfigEmittedAlign.value) {
            propLabelAlign.value = propConfigEmittedAlign.value;
        }
        const propLabelBackground = Uti.getItemRecursive(controlConfig, 'ILabelStyleBackgroundColor');
        const propConfigEmittedBackground = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleBackgroundColor');
        if (propConfigEmittedBackground.value && propLabelBackground.value !== propConfigEmittedBackground.value) {
            propLabelBackground.value = propConfigEmittedBackground.value;
        }
        const propLabelColor = Uti.getItemRecursive(controlConfig, 'ILabelStyleColor');
        const propConfigEmittedColor = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleColor');

        if (propConfigEmittedColor.value && propLabelColor.value !== propConfigEmittedColor.value) {
            propLabelColor.value = propConfigEmittedColor.value;
        }

        const propLabelFontName = Uti.getItemRecursive(controlConfig, 'ILabelStyleFontName');
        const propConfigEmittedFontName = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleFontName');

        if (propLabelFontName.value !== propConfigEmittedFontName.value) {
            propLabelFontName.value = propConfigEmittedFontName.value;
        }
        const propLabelFontSize = Uti.getItemRecursive(controlConfig, 'ILabelStyleFontSize');
        const propConfigEmittedFontSize = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleFontSize');

        if (propLabelFontSize.value !== propConfigEmittedFontSize.value) {
            propLabelFontSize.value = propConfigEmittedFontSize.value;
        }
        const propLabelBold = Uti.getItemRecursive(controlConfig, 'ILabelStyleBold');
        const propConfigEmittedBold = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleBold');

        if (propLabelBold.value !== propConfigEmittedBold.value) {
            propLabelBold.value = propConfigEmittedBold.value;
        }
        const propLabelItalic = Uti.getItemRecursive(controlConfig, 'ILabelStyleItalic');
        const propConfigEmittedItalic = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleItalic');

        if (propLabelItalic.value !== propConfigEmittedItalic.value) {
            propLabelItalic.value = propConfigEmittedItalic.value;
        }
        const propLabelUnderline = Uti.getItemRecursive(controlConfig, 'ILabelStyleUnderline');
        const propConfigEmittedUnderline = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleUnderline');

        if (propLabelUnderline.value !== propConfigEmittedUnderline.value) {
            propLabelUnderline.value = propConfigEmittedUnderline.value;
        }
        const propLabelStyleShow = Uti.getItemRecursive(controlConfig, 'ILabelStyleShow');
        const propConfigEmittedStyleShow = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelStyleShow');
        if (propLabelStyleShow.value !== propConfigEmittedStyleShow.value) {
            propLabelStyleShow.value = propConfigEmittedStyleShow.value;
        }
        const propLabelWidth = Uti.getItemRecursive(controlConfig, 'ILabelWidth');
        const propConfigEmittedWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelWidth');
        if (propLabelWidth.value !== propConfigEmittedWidth.value) {
            propLabelWidth.value = propConfigEmittedWidth.value;
        }
        const propLabelAutoWidth = Uti.getItemRecursive(controlConfig, 'ILabelAutoWidth');
        const propConfigEmittedAutoWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelAutoWidth');
        if (propLabelAutoWidth.value !== propConfigEmittedAutoWidth.value) {
            propLabelAutoWidth.value = propConfigEmittedAutoWidth.value;
        }
        const propLabelRight = Uti.getItemRecursive(controlConfig, 'ILabelRight');
        const propConfigEmittedRight = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelRight');
        if (propLabelRight.value !== propConfigEmittedRight.value) {
            propLabelRight.value = propConfigEmittedRight.value;
        }
        const propLabelLeft = Uti.getItemRecursive(controlConfig, 'ILabelLeft');
        const propConfigEmittedLeft = Uti.getItemRecursive(propertiesConfigEmitted, 'ILabelLeft');
        if (propLabelLeft.value !== propConfigEmittedLeft.value) {
            propLabelLeft.value = propConfigEmittedLeft.value;
        }

        // getPropertiesSeparate
        const propSeparateAlign = Uti.getItemRecursive(controlConfig, 'ISeparateJustifyContent');
        const propEmittedSeparateAlign = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateJustifyContent');
        if (propSeparateAlign.value !== propEmittedSeparateAlign.value) {
            propSeparateAlign.value = propEmittedSeparateAlign.value;
        }
        const propSeparateValue = Uti.getItemRecursive(controlConfig, 'ISeparateValue');
        const propEmittedSeparateValue = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateValue');
        if (propSeparateValue.value !== propEmittedSeparateValue.value) {
            propSeparateValue.value = propEmittedSeparateValue.value;
        }
        const propSeparateBackground = Uti.getItemRecursive(controlConfig, 'ISeparateBackgroundColor');
        const propEmittedSeparateBackground = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateBackgroundColor');
        if (propEmittedSeparateBackground.value && propSeparateBackground.value !== propEmittedSeparateBackground.value) {
            propSeparateBackground.value = propEmittedSeparateBackground.value;
        }
        const propSeparateColor = Uti.getItemRecursive(controlConfig, 'ISeparateColor');
        const propEmittedSeparateColor = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateColor');
        if (propEmittedSeparateColor.value && propSeparateColor.value !== propEmittedSeparateColor.value) {
            propSeparateColor.value = propEmittedSeparateColor.value;
        }
        const propSeparateFontName = Uti.getItemRecursive(controlConfig, 'ISeparateFontName');
        const propEmittedSeparateFontName = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateFontName');
        if (propSeparateFontName.value !== propEmittedSeparateFontName.value) {
            propSeparateFontName.value = propEmittedSeparateFontName.value;
        }
        const propSeparateFontSize = Uti.getItemRecursive(controlConfig, 'ISeparateFontSize');
        const propEmittedSeparateFontSize = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateFontSize');
        if (propSeparateFontSize.value !== propEmittedSeparateFontSize.value) {
            propSeparateFontSize.value = propEmittedSeparateFontSize.value;
        }
        const propSeparateBold = Uti.getItemRecursive(controlConfig, 'ISeparateBold');
        const propEmittedSeparateBold = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateBold');
        if (propSeparateBold.value !== propEmittedSeparateBold.value) {
            propSeparateBold.value = propEmittedSeparateBold.value;
        }
        const propSeparateItalic = Uti.getItemRecursive(controlConfig, 'ISeparateItalic');
        const propEmittedSeparateItalic = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateItalic');
        if (propSeparateItalic.value !== propEmittedSeparateItalic.value) {
            propSeparateItalic.value = propEmittedSeparateItalic.value;
        }
        const propSeparateUnderline = Uti.getItemRecursive(controlConfig, 'ISeparateUnderline');
        const propEmittedSeparateUnderline = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateUnderline');
        if (propSeparateUnderline.value !== propEmittedSeparateUnderline.value) {
            propSeparateUnderline.value = propEmittedSeparateUnderline.value;
        }
        const propSeparateWidth = Uti.getItemRecursive(controlConfig, 'ISeparateWidth');
        const propEmittedSeparateWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateWidth');
        if (propSeparateWidth.value !== propEmittedSeparateWidth.value) {
            propSeparateWidth.value = propEmittedSeparateWidth.value;
        }
        const propSeparateAutoWidth = Uti.getItemRecursive(controlConfig, 'ISeparateAutoWidth');
        const propEmittedSeparateAutoWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateAutoWidth');
        if (propSeparateAutoWidth.value !== propEmittedSeparateAutoWidth.value) {
            propSeparateAutoWidth.value = propEmittedSeparateAutoWidth.value;
        }
        const propSeparatePaddingRight = Uti.getItemRecursive(controlConfig, 'ISeparateRight');
        const propEmittedSeparatePaddingRight = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateRight');
        if (propSeparatePaddingRight.value !== propEmittedSeparatePaddingRight.value) {
            propSeparatePaddingRight.value = propEmittedSeparatePaddingRight.value;
        }
        const propSeparatePaddingLeft = Uti.getItemRecursive(controlConfig, 'ISeparateLeft');
        const propEmittedSeparatePaddingLeft = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateLeft');
        if (propSeparatePaddingLeft.value !== propEmittedSeparatePaddingLeft.value) {
            propSeparatePaddingLeft.value = propEmittedSeparatePaddingLeft.value;
        }
        const propSeparateShow = Uti.getItemRecursive(controlConfig, 'ISeparateShow');
        const propEmittedSeparateShow = Uti.getItemRecursive(propertiesConfigEmitted, 'ISeparateShow');
        if (propSeparateShow.value !== propEmittedSeparateShow.value) {
            propSeparateShow.value = propEmittedSeparateShow.value;
        }

        // getPropertiesValue
        const propDataAlign = Uti.getItemRecursive(controlConfig, 'IDataStyleJustifyContent');
        const propEmittedValueAlign = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleJustifyContent');
        if (propDataAlign.value !== propEmittedValueAlign.value) {
            propDataAlign.value = propEmittedValueAlign.value;
        }
        const propDataBackground = Uti.getItemRecursive(controlConfig, 'IDataStyleAlignBackgroundColor');
        const propEmittedValueBackground = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleAlignBackgroundColor');
        if (propEmittedValueBackground.value && propDataBackground.value !== propEmittedValueBackground.value) {
            propDataBackground.value = propEmittedValueBackground.value;
        }
        const propDataColor = Uti.getItemRecursive(controlConfig, 'IDataStyleColor');
        const propEmittedValueColor = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleColor');
        if (propEmittedValueColor.value && propDataColor.value !== propEmittedValueColor.value) {
            propDataColor.value = propEmittedValueColor.value;
        }
        const propDataFontName = Uti.getItemRecursive(controlConfig, 'IDataStyleFontName');
        const propEmittedValueFontName = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleFontName');
        if (propDataFontName.value !== propEmittedValueFontName.value) {
            propDataFontName.value = propEmittedValueFontName.value;
        }
        const propDataFontSize = Uti.getItemRecursive(controlConfig, 'IDataStyleFontSize');
        const propEmittedValueFontSize = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleFontSize');
        if (propDataFontSize.value !== propEmittedValueFontSize.value) {
            propDataFontSize.value = propEmittedValueFontSize.value;
        }
        const propDataBold = Uti.getItemRecursive(controlConfig, 'IDataStyleBold');
        const propEmittedValueBold = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleBold');
        if (propDataBold.value !== propEmittedValueBold.value) {
            propDataBold.value = propEmittedValueBold.value;
        }
        const propDataItalic = Uti.getItemRecursive(controlConfig, 'IDataStyleItalic');
        const propEmittedValueItalic = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleItalic');
        if (propDataItalic.value !== propEmittedValueItalic.value) {
            propDataItalic.value = propEmittedValueItalic.value;
        }
        const propDataUnderline = Uti.getItemRecursive(controlConfig, 'IDataStyleUnderline');
        const propEmittedValueUnderline = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleUnderline');
        if (propDataUnderline.value !== propEmittedValueUnderline.value) {
            propDataUnderline.value = propEmittedValueUnderline.value;
        }
        const propDataWidth = Uti.getItemRecursive(controlConfig, 'IDataStyleWidth');
        const propEmittedValueWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleWidth');
        if (propDataWidth.value !== propEmittedValueWidth.value) {
            propDataWidth.value = propEmittedValueWidth.value;
        }
        const propDataAutoWidth = Uti.getItemRecursive(controlConfig, 'IDataStyleAutoWidth');
        const propEmittedValueAutoWidth = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleAutoWidth');
        if (propDataAutoWidth.value !== propEmittedValueAutoWidth.value) {
            propDataAutoWidth.value = propEmittedValueAutoWidth.value;
        }
        const propDataPaddingRight = Uti.getItemRecursive(controlConfig, 'IDataStyleRight');
        const propEmittedValuePaddingRight = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleRight');
        if (propDataPaddingRight.value !== propEmittedValuePaddingRight.value) {
            propDataPaddingRight.value = propEmittedValuePaddingRight.value;
        }
        const propDataPaddingLeft = Uti.getItemRecursive(controlConfig, 'IDataStyleLeft');
        const propEmittedValuePaddingLeft = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleLeft');
        if (propDataPaddingLeft.value !== propEmittedValuePaddingLeft.value) {
            propDataPaddingLeft.value = propEmittedValuePaddingLeft.value;
        }
        const propDataShow = Uti.getItemRecursive(controlConfig, 'IDataStyleShow');
        const propEmittedValueShow = Uti.getItemRecursive(propertiesConfigEmitted, 'IDataStyleShow');
        if (propDataShow.value !== propEmittedValueShow.value) {
            propDataShow.value = propEmittedValueShow.value;
        }
        return controlConfig
    }

    public propertiesChange(event: any) {
        this.isPropertyChanged = true;
        if (this.multiControl && this.multiControl.length > 0) {
            this.multiControl.forEach(x => {
                const settingControl = this.getProperties(JSON.parse(x.config), this.properties);
                x.config = JSON.stringify(settingControl);
                x.checked = false;
                this.changeDetectorRef.markForCheck();
                this.onChangeAction.emit(x);
                this.onApplyAction.emit(x);
            });
        } else {
            this._control.config = JSON.stringify(this.properties);
            this.changeDetectorRef.markForCheck();
            this.onChangeAction.emit(this._control);
        }
    }

    private onModalExit() {
        this.isPropertyChanged = false;
        if (this.multiControl && this.multiControl.length > 0) {
            for (const value of this.oldSettingMulti) {
                this.multiControl.map(v => {
                    if (v.key === value.key) {
                        v.config = value.config;
                        v.checked = false;
                        this.changeDetectorRef.markForCheck();
                        this.onChangeAction.emit(v);
                    }
                });
            }
            this.oldSettingMulti = [];
        } else {
            this._control.config = this.oldSetting;
            this.oldSetting = '[]';
            this.onChangeAction.emit(this._control);
        }
        this.exit();
    }

    private exit() {
        this.showDialog = false;
        this.multiControl = [];
        this.showButtonToggle.emit({isSettingDialog: false, control: this._control});
        this.widgetFieldService.changeMenuToggleForm(false);
        this.widgetFieldService.clearFieldDialog();
        this.widgetFieldService.clearMessages();
        this.widgetFieldService.changeDuplicatedFieldDialog(false);
        this.changeDetectorRef.markForCheck();
    }

    ngAfterViewInit(): void {
        const masks = document.getElementsByClassName('ui-dialog-mask');
        if (masks && masks.length > 0)
            (masks[masks.length - 1] as HTMLElement).style.top = '-870px';
        (masks[masks.length - 1] as HTMLElement).style.background = 'transparent';
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
}
