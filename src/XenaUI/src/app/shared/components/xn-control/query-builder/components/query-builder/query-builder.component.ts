import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { QueryOperatorDirective } from './query-operator.directive';
import { QueryFieldDirective } from './query-field.directive';
import { QuerySwitchGroupDirective } from './query-switch-group.directive';
import { QueryButtonGroupDirective } from './query-button-group.directive';
import { QueryInputDirective } from './query-input.directive';
import { QueryRemoveButtonDirective } from './query-remove-button.directive';
import {
    ButtonGroupContext,
    Field,
    FieldContext,
    InputContext,
    LocalRuleMeta,
    OperatorContext,
    RemoveButtonContext,
    Option,
    QueryBuilderConfig,
    Rule,
    RuleSet,
} from './query-builder.interfaces';
import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    forwardRef,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnInit,
    AfterViewInit,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { ModalService } from 'app/services';
import { MessageModel } from 'app/models';
import { MessageModal } from 'app/app.constants';
import { AgeFilterComponent } from '../filter/age-filter';
import { ExtendedFilterComponent } from '../filter/extended-filter';
import { DynamicFormComponent } from '../filter/dynamic-filter';
import { XnFormFocusDirective } from 'app/shared/directives/xn-form-focus/xn-form-focus.directive';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

export const CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QueryBuilderComponent),
    multi: true
};

@Component({
    selector: 'query-builder',
    templateUrl: './query-builder.component.html',
    styleUrls: ['./query-builder.component.scss'],
    providers: [CONTROL_VALUE_ACCESSOR]
})
export class QueryBuilderComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor, Validator {
    public showDialog = false;
    public disabled: boolean;
    public fields: Field[];
    public listComboBoxRaw: any = {};
    public listComboBox: any = {};
    public focusHandleStart: boolean = false;
    public defaultClassNames: { [key: string]: string } = {
        removeIcon: 'q-icon q-remove-icon',
        addIcon: 'q-icon q-add-icon',
        button: 'q-button',
        buttonGroup: 'q-button-group',
        switchGroup: 'q-switch-group',
        queryTree: 'q-tree',
        queryItem: 'q-item',
        queryRule: 'q-rule',
        queryRuleSet: 'q-ruleset',
        invalidRuleset: 'q-invalid-ruleset',
        emptyWarning: 'q-empty-warning',
        fieldControl: 'q-field-control',
        operatorControl: 'q-operator-control',
        inputControl: 'q-input-control'
    };
    public defaultOperatorMap: { [key: string]: string[] } = {
        string: ['=', '!=', 'contains', 'like'],
        number: ['=', '!=', '>', '>=', '<', '<='],
        time: ['=', '!=', '>', '>=', '<', '<='],
        date: ['=', '!=', '>', '>=', '<', '<='],
        category: ['=', '!='],
        boolean: ['=']
    };
    @Input() set comboData(data: any) {
        this.listComboBoxRaw = data;
        if (!this.listComboBoxRaw || !this.listComboBoxRaw['LogicalOperatores']) return;
        this.listComboBox['LogicalOperatores'] = this.listComboBoxRaw['LogicalOperatores'].map(x => {
            return {
                textValue: x.TextValue,
                idValue: x.TextValue
            };
        });
    }
    @Input() isReadOnly: boolean = false;
    @Input() allowRuleset: boolean = true;
    @Input() classNames: { [key: string]: string };
    @Input() operatorMap: { [key: string]: string[] };
    @Input() data: RuleSet = { condition: 'AND', rules: [] };
    @Input() parentData: RuleSet;
    @Input() config: QueryBuilderConfig = { fields: {} };
    @Input() parentInputTemplates: QueryList<QueryInputDirective>;
    @Input() parentOperatorTemplate: QueryOperatorDirective;
    @Input() parentFieldTemplate: QueryFieldDirective;
    @Input() parentSwitchGroupTemplate: QuerySwitchGroupDirective;
    @Input() parentButtonGroupTemplate: QueryButtonGroupDirective;
    @Input() parentRemoveButtonTemplate: QueryRemoveButtonDirective;
    @Input() isRoot = true;
    @Input() template: string;

    @Output() onChanged = new EventEmitter<any>();

    @ContentChild(QueryButtonGroupDirective) buttonGroupTemplate: QueryButtonGroupDirective;
    @ContentChild(QuerySwitchGroupDirective) switchGroupTemplate: QuerySwitchGroupDirective;
    @ContentChild(QueryFieldDirective) fieldTemplate: QueryFieldDirective;
    @ContentChild(QueryOperatorDirective) operatorTemplate: QueryOperatorDirective;
    @ContentChild(QueryRemoveButtonDirective) removeButtonTemplate: QueryRemoveButtonDirective;
    @ContentChildren(QueryInputDirective) inputTemplates: QueryList<QueryInputDirective>;

    @ViewChild('logicalOperator') logicalOperator: AngularMultiSelect;
    @ViewChildren(AgeFilterComponent) private ageFilterComponents: QueryList<AgeFilterComponent>;
    @ViewChildren(ExtendedFilterComponent) private extendedFilterComponents: QueryList<ExtendedFilterComponent>;
    @ViewChildren(DynamicFormComponent) private dynamicFormComponents: QueryList<DynamicFormComponent>;
    @ViewChild(XnFormFocusDirective) formFocusDirective: XnFormFocusDirective;

    private defaultTemplateTypes: string[] = [
        'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
    private defaultEmptyList: any[] = [];
    private operatorsCache: { [key: string]: string[] };
    private inputContextCache = new Map<Rule, InputContext>();
    private operatorContextCache = new Map<Rule, OperatorContext>();
    private fieldContextCache = new Map<Rule, FieldContext>();
    private removeButtonContextCache = new Map<Rule, RemoveButtonContext>();
    private buttonGroupContext: ButtonGroupContext;
    private isFocus = false;

    // For ControlValueAccessor interface
    private onChangeCallback: (value: any) => void;
    private onTouchedCallback: () => any;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: ModalService
    ) { }

    // ----------OnInit Implementation----------

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.initFocusControl();
        this.emitData();
        this.registerEnterFocus();
    }

    // ----------OnChanges Implementation----------

    ngOnChanges(changes: SimpleChanges) {
        const config = this.config;
        const type = typeof config;
        if (type === 'object') {
            this.fields = Object.keys(config.fields).map((value) => {
                const field = config.fields[value];
                field.value = field.value || value;
                return field;
            });
            this.operatorsCache = {};
        } else {
            throw new Error(`Expected 'config' must be a valid object, got ${type} instead.`);
        }
    }

    // ----------Validator Implementation----------

    validate(control: AbstractControl): ValidationErrors | null {
        const query: RuleSet = control.value;
        const errors: { [key: string]: any } = {};
        const ruleErrorStore = [];
        let hasErrors = false;

        if (!this.config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(query)) {
            errors['empty'] = 'Empty rulesets are not allowed.';
            hasErrors = true;
        }

        this.validateRulesInRuleset(query, ruleErrorStore);

        if (ruleErrorStore.length) {
            errors['rules'] = ruleErrorStore;
            hasErrors = true;
        }
        return hasErrors ? errors : null;
    }

    // ----------ControlValueAccessor Implementation----------

    get value(): RuleSet {
        return this.data;
    }

    set value(value: RuleSet) {
        // When component is initialized without a formControl, null is passed to value
        this.data = value;
        this.changeDetectorRef.markForCheck();
        if (this.onChangeCallback) {
            this.onChangeCallback(value);
        }
    }

    writeValue(obj: any): void {
        if (!obj || !obj.rules || !obj.rules.length) return;
        //obj.rules[0].sub_condition = 'AND';
        //obj.rules[0].condition = 'AND';
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ----------END----------

    findTemplateForRule(rule: Rule): TemplateRef<any> {
        const type = this.getInputType(rule.field, rule.operator);
        if (type) {
            const queryInput = this.findQueryInput(type);
            if (queryInput) {
                return queryInput.template;
            } else {
                if (this.defaultTemplateTypes.indexOf(type) === -1) {
                    console.warn(`Could not find template for field with type: ${type}`);
                }
                return null;
            }
        }
    }

    findQueryInput(type: string): QueryInputDirective {
        const templates = this.parentInputTemplates || this.inputTemplates;
        return templates.find((item) => item.queryInputType === type);
    }

    getOperators(field: string): string[] {
        if (this.operatorsCache[field]) {
            return this.operatorsCache[field];
        }
        let operators = this.defaultEmptyList;
        if (this.config.getOperators) {
            operators = this.config.getOperators(field);
        }
        const fieldObject = this.config.fields[field];
        const type = fieldObject.type;

        if (fieldObject && fieldObject.operators) {
            operators = fieldObject.operators;
        } else if (type) {
            operators = (this.operatorMap && this.operatorMap[type]) || this.defaultOperatorMap[type] || this.defaultEmptyList;
            if (operators.length === 0) {
                console.warn(
                    `No operators found for field '${field}' with type ${fieldObject.type}. ` +
                    `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
            }
        } else {
            console.warn(`No 'type' property found on field: '${field}'`);
        }

        if (fieldObject.options) {
            operators = operators.concat(['in', 'not in']);
        }
        if (fieldObject.nullable) {
            operators = operators.concat(['is null', 'is not null']);
        }
        // Cache reference to array object, so it won't be computed next time and trigger a rerender.
        this.operatorsCache[field] = operators;
        return operators;
    }

    getInputType(field: string, operator: string): string {
        if (this.config.getInputType) {
            return this.config.getInputType(field, operator);
        }
        const type = this.config.fields[field].type;
        switch (operator) {
            case 'is null':
            case 'is not null':
                return null;  // No displayed component
            case 'in':
            case 'not in':
                return 'multiselect';
            default:
                return type;
        }
    }

    getOptions(field: string): Option[] {
        if (this.config.getOptions) {
            return this.config.getOptions(field);
        }
        return this.config.fields[field].options || this.defaultEmptyList;
    }

    getClassName(id: string) {
        const cls = this.classNames ? this.classNames[id] : null;
        return cls != null ? cls : this.defaultClassNames[id];
    }

    getDefaultOperator(field: Field) {
        if (field && field.defaultOperator !== undefined) {
            return this.getDefaultValue(field.defaultOperator);
        } else {
            const operators = this.getOperators(field.value)[0];
            if (operators && operators.length) {
                return operators[0];
            } else {
                console.warn(`No operators found for field '${field.value}'. ` +
                    `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
                return null;
            }
        }
    }

    addRule(parent?: RuleSet): void {
        parent = parent || this.data;
        if (this.config.addRule) {
            this.config.addRule(parent);
        } else {
            const field = this.fields[0];
            parent.rules = parent.rules.concat([
                {
                    // sub_condition: parent.condition,
                    // condition: 'AND',
                    field: field.value,
                    //operator: this.getDefaultOperator(field)
                }
            ]);
        }

        this.submitForm();
        this.initFocusControl();
        this.emitData();
        this.registerEnterFocus();
    }

    removeRule(rule: Rule, parent?: RuleSet): void {
        this.showRemoveConfirmationDialog(this.processRemoveRule.bind(this), { rule: rule, parent: parent });
    }

    public ageFilterDataChanged() {
        this.initFocusControl();
    }

    /** FOCUS **/
    private controlList: Array<any> = [];
    private formControlName = ['ageForm', 'extendedForm'];
    private initFocusControl() {
        setTimeout(() => {
            this.unbindKeyDownEvent();
            for (let item of this.formControlName) {
                this.addControlList(item);
            }
            this.setKeyPressForControl();
        }, 300);
    }
    private addControlList(formControlName) {
        const formList = $('*[id*=' + formControlName + ']:visible');

        if (!formList || formList.length <= 0 || (formList[0] as any).length <= 0 || ((formList[0] as any)[0]).length <= 0) {
            return;
        }
        for (const form of (formList as any)) {
            for (const item of (form as any)) {
                const $item = $(item);
                if ($item.hasClass('xn-input') ||
                    $item.hasClass('xn-input--no-icon') ||
                    $item.hasClass('xn-select') ||
                    $item.hasClass('xn-select--no-icon') ||
                    ($item.closest('wj-combo-box.xn-select').length && $item.get(0).tagName != 'BUTTON') ||
                    ($item.closest('wj-auto-complete.xn-auto-complete').length && $item.get(0).tagName != 'BUTTON') ||
                    ($item.closest('wj-input-date.xn-input').length && $item.get(0).tagName == 'INPUT') ||
                    $item.attr('type') === 'checkbox' || $item.attr('type') === 'radio' ||
                    ($item.attr('wj-part') === 'input' && $item.hasClass('wj-numeric')) ||
                    ($item.attr('pinputtext') === '' && $item.attr('placeholder') === 'mm/dd/yyyy')) {
                    this.controlList.push($item);
                }
            }
        }
    }

    private setKeyPressForControl() {
        if (!this.controlList || this.controlList.length <= 0) {
            return;
        }
        for (let i = 0; i < this.controlList.length; i++) {
            $(this.controlList[i]).keydown(($event) => {
                if (!($event.which === 13 || $event.keyCode === 13)) {
                    return;
                }
                // stop move to other control when control is textArea
                if ($event.target.toString().indexOf('TextArea') > -1) {
                    return;
                }
                if (i === this.controlList.length - 1) {
                    $event.preventDefault();
                    setTimeout(() => {
                        $(this.controlList[0]).focus();
                    }, 200);
                    return;
                }
                $event.preventDefault();
                for (let j = i + 1; j < this.controlList.length; j++) {
                    const condition1 = $(this.controlList[j]).length;
                    const condition2 = $(this.controlList[j]).is(':visible');
                    if (condition1 && condition2) {
                        setTimeout(() => {
                            $(this.controlList[j]).focus();
                        }, 200);
                        return;
                    }
                }
            });
        }
    }

    private unbindKeyDownEvent() {
        if (!this.controlList || this.controlList.length <= 0) {
            return;
        }
        for (let i = 0; i <= this.controlList.length; i++) {
            try {
                $(this.controlList[i]).unbind('keydown');
            } catch (e) { }
        }
        this.controlList = [];
    }
    /** END FOCUS **/

    private processRemoveRule(rule: Rule, parent?: RuleSet) {
        parent = parent || this.data;
        if (this.config.removeRule) {
            this.config.removeRule(rule, parent);
        } else {
            parent.rules = parent.rules.filter((r) => r !== rule);
        }
        this.inputContextCache.delete(rule);
        this.operatorContextCache.delete(rule);
        this.fieldContextCache.delete(rule);
        this.removeButtonContextCache.delete(rule);

        this.emitData();
        this.registerEnterFocus();
    }

    addRuleSet(parent?: RuleSet): void {
        parent = parent || this.data;
        if (this.config.addRuleSet) {
            this.config.addRuleSet(parent);
        } else {
            parent.rules = parent.rules.concat([
                {
                    condition: 'AND',
                    // sub_condition: parent.condition,
                    rules: []
                }
            ]);
        }

        this.submitForm();
        this.initFocusControl();
        this.emitData();
        this.registerEnterFocus();
    }

    removeRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
        this.showRemoveConfirmationDialog(this.processRemoveRuleSet.bind(this), { rule: ruleset, parent: parent });
    }

    private submitForm() {
        setTimeout(() => {
            this.ageFilterComponents.forEach((ageFilterComponent) => {
                ageFilterComponent.updateValueAndValidity();
            });
            this.extendedFilterComponents.forEach((extendedFilterComponent) => {
                extendedFilterComponent.updateValueAndValidity();
            });
            this.dynamicFormComponents.forEach((dynamicFormComponent) => {
                dynamicFormComponent.updateValueAndValidity();
            });
        }, 200);
    }

    private processRemoveRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
        ruleset = ruleset || this.data;
        parent = parent || this.parentData;
        if (this.config.removeRuleSet) {
            this.config.removeRuleSet(ruleset, parent);
        } else {
            parent.rules = parent.rules.filter((r) => r !== ruleset);
        }

        this.emitData(parent);
        this.registerEnterFocus();
    }

    private showRemoveConfirmationDialog(callBack, callBackData) {
        this.modalService.confirmMessageHtmlContent(new MessageModel({
            headerText: 'Delete Rule',
            messageType: MessageModal.MessageType.error,
            message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Rule'},
                {key: '</p>'}],
            buttonType1: MessageModal.ButtonType.danger,
            callBack1: () => { callBack(callBackData.rule, callBackData.parent); }
        }));
    }

    changeField(fieldValue: string, rule: Rule): void {
        const field: Field = this.config.fields[fieldValue];

        if (field && field.defaultValue !== undefined) {
            rule.value = this.getDefaultValue(field.defaultValue);
        } else {
            delete rule.value;
        }

        //rule.operator = this.getDefaultOperator(field);

        // Create new context objects so templates will automatically update
        this.inputContextCache.delete(rule);
        this.operatorContextCache.delete(rule);
        this.fieldContextCache.delete(rule);
        this.getInputContext(rule);
        this.getFieldContext(rule);
        this.getOperatorContext(rule);
    }

    getDefaultValue(defaultValue: any): any {
        switch (typeof defaultValue) {
            case 'function':
                return defaultValue();
            default:
                return defaultValue;
        }
    }

    getOperatorTemplate(): TemplateRef<any> {
        const t = this.parentOperatorTemplate || this.operatorTemplate;
        return t ? t.template : null;
    }

    getFieldTemplate(): TemplateRef<any> {
        const t = this.parentFieldTemplate || this.fieldTemplate;
        return t ? t.template : null;
    }

    getButtonGroupTemplate(): TemplateRef<any> {
        const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
        return t ? t.template : null;
    }

    getSwitchGroupTemplate(): TemplateRef<any> {
        const t = this.parentSwitchGroupTemplate || this.switchGroupTemplate;
        return t ? t.template : null;
    }

    getRemoveButtonTemplate(): TemplateRef<any> {
        const t = this.parentRemoveButtonTemplate || this.removeButtonTemplate;
        return t ? t.template : null;
    }

    getQueryItemClassName(local: LocalRuleMeta): string {
        let cls = this.getClassName('queryItem');
        cls += ' ' + this.getClassName(local.ruleset ? 'queryRuleSet' : 'queryRule');
        if (local.invalid) {
            cls += ' ' + this.getClassName('invalidRuleset');
        }
        return cls;
    }

    getButtonGroupContext(): ButtonGroupContext {
        if (!this.buttonGroupContext) {
            this.buttonGroupContext = {
                addRule: this.addRule.bind(this),
                addRuleSet: this.addRuleSet.bind(this),
                removeRuleSet: this.removeRuleSet.bind(this),
                $implicit: this.data
            };
        }
        return this.buttonGroupContext;
    }

    getRemoveButtonContext(rule: Rule): RemoveButtonContext {
        if (!this.removeButtonContextCache.has(rule)) {
            this.removeButtonContextCache.set(rule, {
                removeRule: this.removeRule.bind(this),
                $implicit: rule
            });
        }
        return this.removeButtonContextCache.get(rule);
    }

    getFieldContext(rule: Rule): FieldContext {
        if (!this.fieldContextCache.has(rule)) {
            this.fieldContextCache.set(rule, {
                changeField: this.changeField.bind(this),
                fields: this.fields,
                $implicit: rule
            });
        }
        return this.fieldContextCache.get(rule);
    }

    getOperatorContext(rule: Rule): OperatorContext {
        if (!this.operatorContextCache.has(rule)) {
            this.operatorContextCache.set(rule, {
                operators: this.getOperators(rule.field),
                $implicit: rule
            });
        }
        return this.operatorContextCache.get(rule);
    }

    getInputContext(rule: Rule): InputContext {
        if (!this.inputContextCache.has(rule)) {
            this.inputContextCache.set(rule, {
                options: this.getOptions(rule.field),
                field: this.config.fields[rule.field],
                $implicit: rule
            });
        }
        return this.inputContextCache.get(rule);
    }

    updateValue(data, rule: Rule) {
        rule.value = data;
        if (data.condition) {
            rule.condition = data.condition;
            delete data['condition'];
        }
        this.emitData();
    }

    openInfo() {
        this.showDialog = true;
    }

    public changeLogicalOperator() {
        if (!this.isFocus || !this.logicalOperator) return;
        this.data.condition = this.logicalOperator.selectedValue;
        this.setSubConditionForChildren(this.logicalOperator.selectedValue);
        this.emitData();
    }

    /**
     * conditionChanged
     * @param $event
     * @param rule
     */
    public conditionChanged($event, rule) {
        rule.condition = $event;
    }

    private setSubConditionForChildren(newValue: any) {
        if (!this.data || !this.data.rules || !this.data.rules.length) return;
        for (let item of this.data.rules) {
            // item.sub_condition = newValue;
            item.condition = newValue;
        }
    }

    public onLogicalOperatorFocus() {
        this.isFocus = true;
    }

    private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
        if (ruleset.rules.length === 0) {
            return false;
        } else {
            return ruleset.rules.every((item: RuleSet) => {
                if (item.rules) {
                    return this.checkEmptyRuleInRuleset(item);
                } else {
                    return true;
                }
            });
        }
    }

    private validateRulesInRuleset(ruleset: RuleSet, errorStore: any[]) {
        if (ruleset.rules.length > 0) {
            ruleset.rules.forEach((item) => {
                if ((item as RuleSet).rules) {
                    return this.validateRulesInRuleset(item as RuleSet, errorStore);
                } else if ((item as Rule).field) {
                    const field = this.config.fields[(item as Rule).field];
                    if (field && field.validator && field.validator.apply) {
                        const error = field.validator(item as Rule, ruleset);
                        if (error != null) {
                            errorStore.push(error);
                        }
                    }
                }
            });
        }
    }

    private emitData(data?) {
        this.onChanged.emit(data ? data : this.data);
    }

    public onQueryBuilderChanged($event) {
        this.onChanged.emit($event);
    }

    //private updateSingleTypeValue(data): any {
    //    if (!data || !data.rules || !data.rules.length) {
    //        return data;
    //    }
    //    for (let item of data.rules) {
    //        if (!item.value || _.isEmpty(item.value)) continue;
    //        if (item.value.groupType === 'Single') {
    //            item.value.groupOperators = '';
    //            item.value.groupQuantity = '';
    //        }
    //    }
    //    return data;
    //}

    private registerEnterFocus() {
        if (this.formFocusDirective) {
            this.formFocusDirective.focusHandleStart = true;
        }
    }

}
