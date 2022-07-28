import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ControlBase, ApiResultResponse } from 'app/models';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import toSafeInteger from 'lodash-es/toSafeInteger';
import max from 'lodash-es/max';
import isNil from 'lodash-es/isNil';
import orderBy from 'lodash-es/orderBy';
import { RuleService, AppErrorHandler, DatatableService } from "app/services";
import { Uti } from "app/utilities";
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'dynamic-control',
    templateUrl: './dynamic-control.component.html',
    styleUrls: ['./dynamic-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DynamicControlComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DynamicControlComponent),
            multi: true
        }],
})
export class DynamicControlComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, AfterViewInit {
    private _control: ControlBase<any>;
    public value: any;
    public onChange: any = Function.prototype;
    public onTouched: any = Function.prototype;
    public priorities: any[] = [];

    @Input() set control(data: ControlBase<any>) {
        this._control = data;
    }

    get control() {
        return this._control;
    }

    @Output() public onUpdateValue: EventEmitter<ControlBase<any>> = new EventEmitter();

    @ViewChild('combobox') comboboxControl: AngularMultiSelect;
    @ViewChild('multiselect') multiselectControl: wjcInput.MultiSelect;

    set setValue(v: any) {
        if (v !== this.value) {
            this.value = v;
            this.control.value = v;
            // update the form
            this.onChange(v);
            this.onTouched(v);
        }
    }

    constructor(
        private _eref: ElementRef,
        private ruleService: RuleService,
        private appErrorHandler: AppErrorHandler,
        private datatableService: DatatableService
    ) {
        this.headerFormatter = this.headerFormatter.bind(this);
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {
        if (this.multiselectControl) {
            this.initPriorityList();
        }
    }

    // Required for ControlValueAccessor interface
    writeValue(value: any) {
        this.value = value;
    }

    // Required forControlValueAccessor interface
    public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

    // Required forControlValueAccessor interface
    public registerOnTouched(fn: () => {}): void { this.onTouched = fn; };

    // validates the form, returns null when valid else the validation object
    public validate(c: FormControl) {
        return null;
    }

    /**
     * selectedIndexChanged
     * @param event
     */
    public selectedIndexChanged(event) {
        this.valueChange(this.comboboxControl.selectedValue);
    }

    /**
     * valueChange
     * @param value
     */
    public valueChange(value: any) {
        this.setValue = value;
        this.onUpdateValue.emit(this.control);
    }

    public initPriorityData() {
        this.ruleService.getOrdersGroups()
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.length || isNil(response.item[1])) {
                        return;
                    }

                    let tableData: any = this.datatableService.formatDataTableFromRawData(response.item);
                    tableData = this.datatableService.buildDataSource(tableData);
                    tableData = this.datatableService.appendRowId(tableData);
                    this.control.options = tableData.data.map(dt => {
                        return {
                            key: dt.IdSharingTreeGroups,
                            value: dt.GroupName,
                            priority: null
                        }
                    });

                    this.multiselectControl.refresh();
                });
            });
    }

    public initRichCombo() {
        this.multiselectControl.formatItem.addHandler((s, event: any) => {
            const newContent = `
                <div class="col-xs-12 py-1">
                    <div class="col-xs-1 px-0 text-center" >{priority}</div>
                    <div class="col-xs-1 px-0"><i class="fa fa-{icon}"></i></div>
                    <div class="col-xs-10 px-0" data-key="{key}">{value}</div>                    
                </div>`;
            event.item.innerHTML = wjcCore.format(newContent, event.data);
            event.item.addEventListener('click', (e) => {
                e.preventDefault();
                let itemKey = e.currentTarget.querySelector('div[data-key]').dataset.key;
                let item = this.multiselectControl.itemsSource.find(item => item.key == itemKey);
                if (item) {
                    this.updatePriority(item);
                }

                this.valueChange(this.buildValue());
            });
            event.item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                let itemKey = e.currentTarget.querySelector('div[data-key]').dataset.key;
                let item = this.multiselectControl.itemsSource.find(item => item.key == itemKey);
                if (item) {
                    this.deletePriority(item);
                }

                this.valueChange(this.buildValue());
            });
        });

        this.multiselectControl.collectionView.refresh();
    }

    private buildValue() {
        let value = [];
        this.multiselectControl.itemsSource.forEach(item => {
            if (item.priority) {
                value.push({
                    key: item.key,
                    value: item.priority
                });
            }
        });

        if (!value.length) {
            return '';
        }

        return JSON.stringify(value);
    }

    private initPriorityList() {
        this.priorities = [];
        const priorityList = this.multiselectControl.itemsSource.map(o => o['priority']);
        if (priorityList && priorityList.length) {
            const maxValue = Math.max.apply(Math, priorityList);
            for (let i = 0; i < maxValue; i++) {
                this.priorities.push({
                    label: i + 1,
                    value: i + 1
                });
            }
        }

        this.multiselectControl.refresh();
    }

    private updatePriority(item) {
        if (item.hasOwnProperty('priority')) {
            const priority = item['priority'];
            if (!priority) {
                let data = this.multiselectControl.itemsSource;
                const maxLength = data.length;
                const arr = data.map(p => toSafeInteger(p['priority']));
                const maxValue = max(arr);
                if (maxValue < maxLength) {
                    item['priority'] = maxValue + 1;
                }
                else {
                    let validPriority = maxValue;
                    let rs;
                    do {
                        validPriority -= 1;
                        rs = data.find(p => p['priority'] == validPriority);
                    } while (rs);
                    item['priority'] = validPriority;
                }
                this.initPriorityList();
            }
        }
    }

    private deletePriority(item) {
        if (item) {
            const priorityDeleted = item['priority'];
            if (priorityDeleted) {
                const data = this.multiselectControl.itemsSource;
                data.forEach(item => {
                    if (item['priority'] > priorityDeleted && item['priority'] > 1) {
                        item['priority'] -= 1;
                    }
                });
            }
            item['priority'] = '';
            this.initPriorityList();
        }
    }

    public headerFormatter() {
        if (this.multiselectControl) {
            let checkedItems = this.multiselectControl.checkedItems;
            checkedItems = orderBy(checkedItems, ['priority'], ['asc']);
            return checkedItems.map(item => item.value).join(', ');
        }


        return null;
    }
}
