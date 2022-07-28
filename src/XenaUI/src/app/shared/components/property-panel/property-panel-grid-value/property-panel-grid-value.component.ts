import {
    Component,
    Input,
    Output,
    OnInit,
    OnDestroy,
    ViewChild,
    EventEmitter,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';
import * as wjInput from 'wijmo/wijmo.angular2.input';
import isNil from 'lodash-es/isNil';
import {GlobalSettingService} from 'app/services';
import {Module} from 'app/models';
import {PropertyPanelDateFormatDialogComponent} from '../property-panel-date-format-dialog';
import {PropertyPanelGridValueDialogComponent} from '../property-panel-grid-value-dialog';
import {PropertyPanelOrderFieldDialogComponent} from '../property-panel-order-field-dialog';
import {PropertyPanelGridFieldDataDialogComponent} from '../property-panel-grid-field-data-dialog';
import {PropertyPanelShowDropdownFocusComponent} from '../property-panel-show-dropdown-focus';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Uti} from 'app/utilities';
import {AngularMultiSelect} from '../../xn-control/xn-dropdown';
import {PropertyBackgroundGradientComponent} from '../property-background-gradient-dialog';
import {PropertyBackgroundImageComponent} from '../property-background-image';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: 'property-panel-grid-value',
    styleUrls: ['./property-panel-grid-value.component.scss'],
    templateUrl: './property-panel-grid-value.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PropertyPanelGridValueComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() item: any;
    @Input() usingModule: Module;

    @Output() onPropertiesChange = new EventEmitter<any>();
    @Output() onPropertiesApply = new EventEmitter<any>();
    @Output() onResetBackground = new EventEmitter<any>();

    @ViewChild(AngularMultiSelect) multiSelect: AngularMultiSelect;
    @ViewChild(wjInput.WjInputColor) wjInputColor: wjInput.WjInputColor;
    @ViewChild('propertyPanelGridValueDialog') propertyPanelGridValueDialog: PropertyPanelGridValueDialogComponent;
    @ViewChild('propertyPanelOrderFieldDialog') propertyPanelOrderFieldDialog: PropertyPanelOrderFieldDialogComponent;
    @ViewChild('propertyPanelDropdownFocusDialog') propertyPanelDropdownFocusDialog: PropertyPanelShowDropdownFocusComponent;
    @ViewChild('propertyPanelGridFieldDataDialog') propertyPanelGridFieldDataDialogComponent: PropertyPanelGridFieldDataDialogComponent;
    @ViewChild('propertyPanelDateFormatDialog') propertyPanelDateFormatDialogComponent: PropertyPanelDateFormatDialogComponent;
    @ViewChild('propertyBackgroundGradient') propertyBackgroundGradient: PropertyBackgroundGradientComponent;
    @ViewChild('propertyBackgroundImage') propertyBackgroundImage: PropertyBackgroundImageComponent;

    private multiSelectInputValue = '';

    private delayedInputChangeSubject = new Subject<any>();
    // private delayedColorChangeSubject = new Subject<any>();
    private onInputChangedSubscription: Subscription;
    // private onColorChangedSubscription: Subscription;
    private comboboxChangedSubscription: Subscription;
    constructor(
        private globalSettingService: GlobalSettingService,
        private uti: Uti,
        public changeDetectorRef: ChangeDetectorRef,
    ) {
        this.onComboboxChanged = this.onComboboxChanged.bind(this);
        // this.onColorChanged = this.onColorChanged.bind(this);
        this.itemFormatterFunc = this.itemFormatterFunc.bind(this);
    }

    ngAfterViewInit() {
        this.initComboxSelectedIndexChange(500);

        if (this.wjInputColor) {
            // this.wjInputColor.valueChanged.removeHandler(this.onColorChanged);
            // this.wjInputColor.valueChanged.addHandler(this.onColorChanged);
        }

        if (this.item.dataType === 'MultiSelect') {
            this.multiSelectInputValue = this.buildMultiSelectInputValue(this.item.options);
        }
    }

    private initComboxSelectedIndexChange(timeout: number) {
        if (!this.multiSelect) return;
        if (this.comboboxChangedSubscription) {
            this.comboboxChangedSubscription.unsubscribe();
        }
        setTimeout(() => {
            this.comboboxChangedSubscription = this.multiSelect.onSelect.subscribe(this.onComboboxChanged);
        }, timeout);
    }

    ngOnInit() {
        this.onInputChangedSubscription = this.delayedInputChangeSubject
            .debounceTime(1000)
            .subscribe(newValue => {
                if (this.item.value !== newValue) {
                    this.item.value = newValue;
                    this.item.dirty = true;
                    this.onPropertiesChange.emit(true);
                    // this.changeDetectorRef.markForCheck();
                }
            });
        // this.onColorChangedSubscription = this.delayedColorChangeSubject
        //     .debounceTime(200)
        //     .subscribe(newColor => {
        //             this.item.value = newColor;
        //             this.item.dirty = true;
        //             this.onPropertiesChange.emit(true);
        //             // this.changeDetectorRef.markForCheck();
        //     })
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    onCheckboxChanged(item) {
        item.dirty = true;
        this.onPropertiesChange.emit(true);
        this.changeDetectorRef.markForCheck();
    }

    // private comboboxChangedTimes = 0;
    onComboboxChanged(event) {
        // if (!this.comboboxChangedTimes) {
        //     this.comboboxChangedTimes++;
        //     return;
        // }
        this.item.value = event ? event.key : null; // event.selectedValue;
        this.item.dirty = true;
        // $(this.multiSelect.inputElement).addClass('prop-dirty');
        this.initComboxSelectedIndexChange(1);
        this.onPropertiesChange.emit(true);
        this.changeDetectorRef.markForCheck();
    }

    onInputChanged(newValue) {
        this.item.dirty = true;
        this.delayedInputChangeSubject.next(newValue);
    }

    // onColorChanged(event) {
    //     this.delayedColorChangeSubject.next(event.value);
    // }

    onColorTextChanged($event) {
        if (!this.wjInputColor ||
            this.item.value === this.wjInputColor._oldText ||
            (Uti.isNilE(this.item.value) && Uti.isNilE(this.wjInputColor._oldText))) {
            return;
        }
        this.item.value = this.wjInputColor._oldText;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        setTimeout(() => {
            this.onResetBackground.emit();
        });
    }

    onPropMultiSelectComboboxChanged(propMultiSelectCombobox) {
        this.item.value = propMultiSelectCombobox.checkedItems;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        this.changeDetectorRef.markForCheck();
    }

    showMultiSelectDialog(item) {
        this.propertyPanelGridValueDialog.open(item);
    }

    showOrderByFieldDialog() {
        this.propertyPanelOrderFieldDialog.open();
    }

    showDropdownFocusDialog(item) {
        this.propertyPanelDropdownFocusDialog.open(item);
    }

    showDialogBackGroundGradient(item) {
        this.propertyBackgroundGradient.open(item);
    }

    showDialogBackGroundImageGallery(item) {
        this.propertyBackgroundImage.open(item);
    }

    showFieldFormatDialog(item) {
        this.propertyPanelGridFieldDataDialogComponent.open(item);
    }

    showDateFormatDialog(item) {
        this.propertyPanelDateFormatDialogComponent.open(item);
    }

    resetBackground(data: boolean) {
        this.item.value = data;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        setTimeout(() => {
            this.onResetBackground.emit();
        });
    }

    onDateFormatDialogApply(dateFormat) {
        this.item.value = dateFormat;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        this.changeDetectorRef.markForCheck();
    }

    public onOrderNumberFieldApply(data: any) {
        this.onPropertiesChange.emit(true);
        this.onPropertiesApply.emit(true);
    }

    public onSelectImage(data) {
        this.item.value = 'api/FileManager/GetFile?' + data;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        setTimeout(() => {
            this.onResetBackground.emit();
        });
    }

    public onSelectBackgroundGradient(data) {
        if (!data.background) return;
        const regexMatchRgbGradient = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/;
        const splitDataRgb = data.background.split('rgb');
        const result = [];
        for (let i = 1; i < splitDataRgb.length; i++) {
            const rgb = 'rgb' + splitDataRgb[i];
            result.push(rgb);
        }

        this.item.options = cloneDeep(result.map(x => {
            return {
                value: regexMatchRgbGradient.exec(x)[0],
                position: x.replace(regexMatchRgbGradient, '').replace('%)', '').trim()
            }
        }));

        if (data.type) {
            this.item.typeGradient = data.type;
        }

        if (data.direction) {
            this.item.directionGradient = data.direction;
        }
        this.item.value = data.background;
        this.item.dirty = true;
        this.onPropertiesChange.emit(true);
        setTimeout(() => {
            this.onResetBackground.emit();
        });
    }

    onMultiSelectApply(data) {
        this.item.dirty = true;

        for (const opt of this.item.options) {
            opt.selected = !((isNil(opt.isEditable) || opt.isEditable === true) && (isNil(opt.isHidden) || opt.isHidden === false));
        }

        for (const opt of this.item.options) {
            if ((isNil(opt.isEditable) || opt.isEditable === true) && (isNil(opt.isHidden) || opt.isHidden === false)) {
                for (const dt of data) {
                    if (opt.value === dt.value) {
                        opt.selected = true;
                    }
                }
            }
        }

        this.multiSelectInputValue = this.buildMultiSelectInputValue(this.item.options);

        this.onPropertiesChange.emit(true);
        this.onPropertiesApply.emit(true);

        this.changeDetectorRef.markForCheck();
    }


    onSelectDropdownApply(data) {
        this.item.dirty = true;
        for (const opt of this.item.options) {
            for (const dt of data) {
                if (opt.value === dt.value && dt.selected !== null && dt.selected === true) {
                    opt.selected = true;
                } else if (opt.value === dt.value && dt.selected !== null && dt.selected === false) {
                    opt.selected = false;

                }
            }
        }
        this.onPropertiesChange.emit(true);
        this.onPropertiesApply.emit(true);

        this.changeDetectorRef.markForCheck();
    }

    /**
     * onFieldFormatApply
     * @param data
     */
    onFieldFormatApply(data) {
        this.item.value = data;
        this.onPropertiesChange.emit(true);

        this.changeDetectorRef.markForCheck();
    }

    buildMultiSelectInputValue(options) {
        if (options)
            return options.filter(i => i.selected === true && (isNil(i.isHidden) || i.isHidden === false)).length + ' items selected';
        else
            return '';
    }

    public itemFormatterFunc(index, content) {
        if (this.item.options && this.item.options[index] && this.item.options[index].isHeader) {
            return `<span class='option-header' style='pointer-events:none;display:block;margin-left:-5px;font-size:10pt;font-weight:bold'>${content.value}</span>`;
        }

        return content.value;
    }

    public onPropComboFocused($event) {
        setTimeout(() => {
            $('.option-header').closest('.wj-listbox-item').css('pointer-events', 'none');
        });
    }
}
