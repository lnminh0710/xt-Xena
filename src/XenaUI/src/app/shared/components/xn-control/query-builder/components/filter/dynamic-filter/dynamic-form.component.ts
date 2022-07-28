import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import { ControlBase, TextboxControl, DropdownControl, RangeControl, DynamicRulesType, PriorityControl, ApiResultResponse } from 'app/models';
import { CommonService, RuleService, AppErrorHandler, DatatableService } from 'app/services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFilterBase } from './base';
import isNil from 'lodash-es/isNil';
import orderBy from 'lodash-es/orderBy';
import { ControlType } from "app/app.constants";
import { Uti } from "app/utilities";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent extends DynamicFilterBase implements OnInit, OnDestroy, AfterViewInit {
    private formValueChangesSubscription: Subscription;
    private _controlList: Array<ControlBase<any>> = [];
    public form: FormGroup;
    private ruleData: any;

    @Input() dynamicRulesType: Array<DynamicRulesType>;

    @Input() set template(value: string) {
        if (value) {
            let controlList = JSON.parse(value).ruleItem;
            this.buildConfig(controlList);
            this.setDefaultHidden(controlList, false);
            this.controlList = controlList;
        }
    }

    @Input() set controlList(data: Array<ControlBase<any>>) {
        this._controlList = data;
        this.createFormGroup();
        // this.loadComboBoxData();
        this.subscribeFormValueChange();
    }

    get controlList() {
        return this._controlList;
    }

    @Input()
    set data(rule: any) {
        this.ruleData = rule
        this.buildRule(rule);
    }

    @Output() outputData: EventEmitter<any> = new EventEmitter();


    constructor(
        private _eref: ElementRef,
        private commonService: CommonService,
        private ruleService: RuleService,
        private appErrorHandler: AppErrorHandler,
        private datatableService: DatatableService
    ) {
        super();
    }

    /**
     * buildConfig
     */
    public buildConfig(controlList: Array<ControlBase<any>>) {
        if (this.dynamicRulesType && this.dynamicRulesType.length) {
            controlList.forEach((control: ControlBase<any>) => {
                this.buildControlTemplate(control);
            });
            //Find & merge duplicate children
            this.mergeDuplicateConfigControl(controlList);
        }
    }

    private buildRule(rule) {
        if (rule) {
            let item = rule.value;
            if (item) {
                if (!isNil(item['fromValue']) && !isNil(item['toValue'])) {
                    item['range_value'] = {
                        fromValue: item['fromValue'],
                        toValue: item['toValue']
                    };
                }
                item['condition'] = rule.condition;
                Object.keys(item).forEach(key => {
                    this.setVisibleByKey(this.controlList, key, item[key], item);
                });
                delete item['range_value'];
                delete item['condition'];
            }
        }
    }

    /**
     * mergeDuplicateConfigControl
     * @param controlList
     */
    private mergeDuplicateConfigControl(controlList: Array<ControlBase<any>>) {
        for (let i = 0; i < controlList.length - 1; i++) {
            let control = controlList[i];
            if (control.fromOption && !control['deleted']) {
                for (let j = i + 1; j < controlList.length; j++) {
                    let nextControl = controlList[j];
                    if (control.controlType == nextControl.controlType
                        && control.key == nextControl.key
                        && control.label == nextControl.label) {
                        if (control.controlType == 'range') {
                            if (control['type'] == nextControl['type']) {
                                control.fromOption += ";" + nextControl.fromOption
                                nextControl['deleted'] = true;
                            }
                        }
                        else {
                            control.fromOption += ";" + nextControl.fromOption
                            nextControl['deleted'] = true;
                        }
                    }
                }
            }
        }

        let i = controlList.length;
        while (i--) {
            if (controlList[i]['deleted']) {
                controlList.splice(i, 1);
            }
        }

        controlList.forEach(control => {
            if (control.children && control.children.length) {
                this.mergeDuplicateConfigControl(control.children);
            }
        });
    }

    /**
     * buildControlTemplate
     * @param control
     */
    private buildControlTemplate(control: ControlBase<any>) {
        if (control.controlType == 'dropdown' || control.controlType == 'priority') {
            let buildControl: any;

            switch (control.controlType) {
                case 'dropdown':
                    buildControl = (control as DropdownControl);
                    break;

                case 'priority':
                    buildControl = (control as PriorityControl);
                    break;

                default:
                    return;
            }

            const dropdownKey = buildControl.identificationKey;
            if (dropdownKey) {
                buildControl.children = [];

                let options = [];
                if (control.controlType === 'priority') {
                    this.ruleService.getOrdersGroups()
                        .subscribe((response: ApiResultResponse) => {
                            this.appErrorHandler.executeAction(() => {
                                if (!Uti.isResquestSuccess(response) || !response.item.length || isNil(response.item[1])) {
                                    return;
                                }

                                let tableData: any = this.datatableService.formatDataTableFromRawData(response.item);
                                tableData = this.datatableService.buildDataSource(tableData);
                                tableData = this.datatableService.appendRowId(tableData);

                                options = tableData.data.map(dt => {
                                    return {
                                        key: dt.IdSharingTreeGroups,
                                        value: dt.GroupName,
                                        priority: null,
                                        icon: dt.IconName
                                    }
                                });

                                this.continueToBuildControl(buildControl, options);

                                this.buildRule(this.ruleData);
                            });
                        });
                } else {
                    options = this.dynamicRulesType.filter(p => p.dropdownKey == dropdownKey);
                    if (buildControl.fromOption == 'Extend') {
                        options = orderBy(options, ['value'], ['asc']);
                    }                    
                    this.continueToBuildControl(buildControl, options);
                }
            }
        }
    }

    private continueToBuildControl(buildControl, options) {
        if (options && options.length) {
            buildControl.options = options.map(option => {
                return {
                    key: buildControl.controlType === 'priority' ? option.key : option.value,
                    value: option.value,
                    selected: false,
                    payload: option.filterRules,
                    priority: null,
                    icon: option.icon
                }
            });
            if (buildControl.controlType !== 'priority')
                buildControl.value = options[0].value;

            options.forEach(option => {
                if (option.config && option.config.length) {
                    const configArray: Array<any> = option.config;

                    configArray.forEach(config => {
                        let controlBase: ControlBase<any>;
                        switch (config.controlType) {
                            case 'dropdown':
                                controlBase = new DropdownControl({
                                    key: config.id,
                                    label: config.label,
                                    fromOption: '' + option.value,
                                    identificationKey: config.dropdownKey,
                                    options: [],
                                    children: [],
                                    value: '',
                                    alias: config.alias
                                });
                                break;
                            case 'range':
                                controlBase = new RangeControl({
                                    key: config.id,
                                    fromOption: '' + option.value,
                                    type: config.type ? config.type : null,
                                    alias: config.alias
                                });
                                break;
                            case 'priority':
                                controlBase = new PriorityControl({
                                    key: config.id,
                                    label: config.label,
                                    fromOption: '' + option.value,
                                    identificationKey: config.dropdownKey,
                                    options: [],
                                    children: [],
                                    value: '',
                                    alias: config.alias
                                });
                                break;
                            default:
                                controlBase = new TextboxControl({
                                    key: config.id,
                                    fromOption: '' + option.value,
                                    label: config.label,
                                    alias: config.alias
                                });
                                break;
                        }
                        buildControl.children.push(controlBase);
                        if (controlBase.controlType == 'dropdown' || controlBase.controlType == 'priority') {
                            this.buildControlTemplate(controlBase);
                        }
                    });
                }
            });
        }
    }

    /**
     * setVisibleByKey
     * @param controlList
     * @param key
     */
    private setVisibleByKey(controlList: Array<ControlBase<any>>, key, value, data) {
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];

            // key can be setting in 3 cases:
            // + Case 1: key of control
            // + Case 2: alias of control
            // + Case 3: an option of dropdown control
            // If control is dropdown , then check if any option of dropdown that have payload = key

            let isValidToDiplay: boolean;
            // Check case 1 and 2
            if (control.key == key || control.alias == key) {
                isValidToDiplay = true;
            }
            // Check case 3 if not found
            if (!isValidToDiplay) {
                if (control.controlType == 'dropdown') {
                    let dropdownControl = control as DropdownControl;
                    if (dropdownControl.options && dropdownControl.options.length) {
                        const option = dropdownControl.options.find(p => p.payload == key);
                        if (option) {
                            isValidToDiplay = true;
                        }
                    }
                }
            }

            // Set visible control if we find valid key from data object.
            if (isValidToDiplay) {
                // User can config multiple keys with the same key belongs to diffrent parents in DB,
                // we need to find control that have a key belong to parent exactly in data object.
                let parentControlList: Array<ControlBase<any>> = [];
                this.findParentControlFromKey(this.controlList, control.key, null, parentControlList);
                if (parentControlList && parentControlList.length) {
                    // Loop to find a valid parent need to display
                    parentControlList.forEach(parent => {
                        let isValidParentForChecking: boolean;
                        let payload: string;
                        // Need to check in 3 cases:
                        // Check case 1
                        if (data[parent.key]) {
                            payload = parent.key;
                            isValidParentForChecking = true;
                        }
                        // Check case 2
                        else if (data[parent.alias]) {
                            payload = parent.alias;
                            isValidParentForChecking = true;
                        }
                        // Check case 3
                        else {
                            if (parent.controlType == 'dropdown') {
                                let dropdownControl = parent as DropdownControl;
                                if (dropdownControl.options && dropdownControl.options.length) {
                                    const option = dropdownControl.options.find(p => p.payload && data[p.payload]);
                                    if (option) {
                                        payload = option.payload;
                                        isValidParentForChecking = true;
                                    }
                                }
                            }
                        }
                        if (isValidParentForChecking) {
                            let fromOption: Array<string> = control.fromOption.split(';');
                            let validParent = fromOption.find(p => p == data[payload]);
                            if (validParent) {
                                // Set visible control
                                control.isHidden = false;
                                control.value = value;
                                if (control.controlType == 'priority') {
                                    this.setPriorityForControl(control, value);
                                }
                            }
                        }
                    });
                }
                else {
                    control.isHidden = false;
                    control.value = value;
                    if (control.controlType == 'priority') {
                        this.setPriorityForControl(control, value);
                    }
                }
            }
            if (control.children && control.children.length) {
                this.setVisibleByKey(control.children, key, value, data);
            }
        }
    }

    private setPriorityForControl(control, value) {
        let valueArr = JSON.parse(value);
        control.options.forEach(option => {
            let found = valueArr.find(item => item.key == option.key)
            if (found) {
                option.priority = found.value;
            }
        })
    }

    /**
     * findParentControlFromKey
     * @param controlList
     * @param key
     * @param parentControl
     */
    private findParentControlFromKey(controlList: Array<ControlBase<any>>, key: string, parentControl: ControlBase<any>, parentControlList: Array<ControlBase<any>>) {
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];
            if (control.key == key && parentControl) {
                parentControlList.push(parentControl);
                // return parentControl;
            }
            if (control.children && control.children.length) {
                this.findParentControlFromKey(control.children, key, control, parentControlList);
                // let rs = this.findParentControlFromKey(control.children, key, control);
                //if (rs) {
                //    return rs;
                //}
            }
        }
        // return null;
    }

    /**
     * setDefaultHidden
     * @param controlList
     */
    private setDefaultHidden(controlList: Array<ControlBase<any>>, hidden: boolean) {
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];
            control.isHidden = hidden;
            if (control.children && control.children.length) {
                this.setDefaultHidden(control.children, true);
            }
        }
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
        if (this.formValueChangesSubscription) {
            this.formValueChangesSubscription.unsubscribe();
        }
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {
    }

    /**
     * createFormGroup
     */
    private createFormGroup() {
        let group: any = {};
        this.createGroupControl(this.controlList, group);
        this.form = new FormGroup(group);
    }

    /**
     * createGroupControl
     * @param controlList
     * @param group
     */
    private createGroupControl(controlList: Array<ControlBase<any>>, group: any) {
        controlList.forEach((control) => {
            group[control.key] = new FormControl(control.value || '', [Validators.required]);
            if (control.children && control.children.length) {
                this.createGroupControl(control.children, group);
            }
        });
    }

    /**
     * loadComboBoxData
     */
    private loadComboBoxData() {
        let identificationKeyList: Array<string> = [];
        this.getIdentificationKeyList(identificationKeyList, this.controlList);
        if (identificationKeyList && identificationKeyList.length) {
            this.commonService.getListComboBox(identificationKeyList.join(',')).subscribe(data => {
                for (let i = 0; i < identificationKeyList.length; i++) {
                    const comboOptions: Array<any> = data.item[identificationKeyList[i]];
                    let options: Array<any> = [];
                    if (comboOptions) {
                        options = comboOptions.map(p => ({
                            key: p.idValue,
                            value: p.textValue
                        }));
                        let targetControl = this.findDropdownControlByCondition(identificationKeyList[i], this.controlList, 'identificationKey');
                        if (targetControl) {
                            targetControl.options = options;
                        }
                    }
                }
            });
        }
    }


    /**
     * subscribeFormValueChange
     */
    private subscribeFormValueChange() {
        this.formValueChangesSubscription = this.form.valueChanges
            .debounceTime(500)
            .subscribe((data) => {
                let validData = {};
                this.filterValidData(this.controlList, validData);
                this.outputData.emit(validData);
                // form has changed
                if (!this.form.pristine) {

                }
            });
    }

    /**
     * filterValidData
     * @param controlList
     * @param data
     */
    private filterValidData(controlList: Array<ControlBase<any>>, data: any) {
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];
            // Visible
            if (!control.isHidden) {
                let key = control.key;
                if (control.alias) {
                    key = control.alias;
                }
                data[key] = control.value;
                if (control.controlType == 'dropdown') {
                    const dropDownControl = (control as DropdownControl);
                    const value = dropDownControl.value;
                    if (dropDownControl.options && dropDownControl.options.length) {
                        const option = dropDownControl.options.find(p => p.key == value);
                        if (option && option.payload) {
                            delete data[key];
                            key = option.payload;
                        }
                        data[key] = value;
                    }
                }
                if (control.value && typeof control.value === 'object') {
                    Object.keys(control.value).forEach(k => {
                        data[k] = control.value[k];
                    });
                    delete data[key];
                }
            }
            if (control.children && control.children.length) {
                this.filterValidData(control.children, data);
            }
        }
    }

    /**
     * updateValueAndValidity
     */
    public updateValueAndValidity() {
        this.form['submitted'] = true;
        this.form.updateValueAndValidity();
    }
}
