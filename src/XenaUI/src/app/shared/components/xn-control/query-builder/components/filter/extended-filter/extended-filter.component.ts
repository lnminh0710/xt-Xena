import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";

@Component({
    selector: "extended-filter",
    templateUrl: "./extended-filter.component.html",
    styleUrls: ["./extended-filter.component.scss"],
})
export class ExtendedFilterComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public listComboBox: any = {};
    public listComboBoxRaw: any = {};
    public comparasionType: any = "";
    public maxLengthOfControl: any = "";
    public extendedForm: FormGroup;
    private isConditionFocus: boolean = false;
    private extendedFormValueChangesSubscription: Subscription;
    private isFocus = false;

    @ViewChild("typeCombobox") typeCombobox: AngularMultiSelect;
    @ViewChild("operatorCombobox") operatorCombobox: AngularMultiSelect;
    @ViewChild("logicalOperator") logicalOperator: AngularMultiSelect;

    @Input() set comboData(data: any) {
        // TODO: will remove after tested
        //if (!data || !data['Types'] || !data['Types'].length) return;
        //data['Types'].push(
        //{
        //    "DataType": "FilterName",
        //    "IdValue": "Checkbox1",
        //    "TextValue": "Checkbox1",
        //    "DATA_TYPE": "checkbox",
        //    "CHARACTER_MAXIMUM_LENGTH": 20
        //});
        //data['Types'].push(
        //{
        //    "DataType": "FilterName",
        //    "IdValue": "Number1",
        //    "TextValue": "Number1",
        //    "DATA_TYPE": "number",
        //    "CHARACTER_MAXIMUM_LENGTH": 20
        //});
        //data['Types'].push(
        //{
        //    "DataType": "FilterName",
        //    "IdValue": "Date1",
        //    "TextValue": "Date1",
        //    "DATA_TYPE": "date",
        //    "CHARACTER_MAXIMUM_LENGTH": 20
        //});
        // End tested

        this.listComboBoxRaw = data;
        if (!this.listComboBoxRaw || !this.listComboBoxRaw["Types"]) return;
        this.listComboBox["Types"] = this.listComboBoxRaw["Types"].map((x) => {
            return {
                textValue: x.TextValue,
                idValue: x.IdValue,
            };
        });

        this.listComboBox["Operatores"] = this.listComboBoxRaw[
            "Operatores"
        ].map((x) => {
            return {
                textValue: x.TextValue,
                idValue: x.TextValue,
            };
        });

        if (this.listComboBoxRaw["LogicalOperatores"]) {
            this.listComboBox["LogicalOperatores"] = this.listComboBoxRaw[
                "LogicalOperatores"
            ].map((x) => {
                return {
                    textValue: x.TextValue,
                    idValue: x.TextValue,
                };
            });
        }
    }

    @Input()
    set data(item: any) {
        if (this.extendedForm) {
            return;
        }
        const submitted = this.extendedForm && this.extendedForm["submitted"];
        if (item) {
            this.extendedForm = new FormGroup({
                filterName: new FormControl(item["filterName"], [
                    Validators.required,
                ]),
                operator: new FormControl(item["operator"], [
                    Validators.required,
                ]),
                value: new FormControl(item["value"], [Validators.required]),
            });
        } else {
            this.extendedForm = new FormGroup({
                filterName: new FormControl("", [Validators.required]),
                operator: new FormControl("", [Validators.required]),
                value: new FormControl("", [Validators.required]),
            });
        }
        this.extendedForm["submitted"] = submitted;
        this.subscribeFormValueChange();
    }
    @Input() condition = null;
    @Input() index = null;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() conditionChanged: EventEmitter<any> = new EventEmitter();

    constructor() {}

    /**
     * ngOnInit
     */
    public ngOnInit() {}

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        if (this.extendedFormValueChangesSubscription) {
            this.extendedFormValueChangesSubscription.unsubscribe();
        }
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    public onTypeFocus() {
        this.isFocus = true;
    }

    public changeType() {
        if (!this.isFocus) {
            this.changeTypeValue();
            return;
        }
        this.extendedForm.controls["value"].setValue("");
        this.changeTypeValue();
    }

    private changeTypeValue() {
        if (
            !this.typeCombobox ||
            !this.listComboBoxRaw.Types ||
            !this.listComboBoxRaw.Types.length
        )
            return;
        const currentValue = this.listComboBoxRaw.Types.find(
            (x) => x.IdValue === this.typeCombobox.selectedValue
        );
        if (!currentValue || !currentValue.IdValue) return;
        this.comparasionType = currentValue.DATA_TYPE;
        this.maxLengthOfControl = this.setMaxLength(
            this.comparasionType,
            currentValue.CHARACTER_MAXIMUM_LENGTH
        );
    }

    public changeRule() {
        // fill code for chagne Rule
    }

    public dateKeypress($event) {
        if ($event.which === 13 || $event.keyCode === 13) {
            $event.preventDefault();
        } else setTimeout(() => this.onValueChange($event));
    }

    private onValueChange($event: any) {
        // when value control change
    }

    private setMaxLength(type: string, maxLength: any) {
        if (!maxLength) return "";
        let result = "";
        if (type === "number") {
            for (let i = 0; i < maxLength; i++) {
                result += "9";
            }
            return result;
        }
        return maxLength;
    }

    /**
     * subscribeFormValueChange
     */
    private subscribeFormValueChange() {
        this.extendedFormValueChangesSubscription =
            this.extendedForm.valueChanges
                .debounceTime(500)
                .subscribe((data) => {
                    //console.log(data);
                    this.outputData.emit(data);
                });
    }

    public updateValueAndValidity() {
        this.extendedForm["submitted"] = true;
        this.extendedForm.updateValueAndValidity();
    }

    /**
     * onLogicalOperatorFocus
     */
    public onLogicalOperatorFocus() {
        this.isConditionFocus = true;
    }

    /**
     * changeLogicalOperator
     */
    public changeLogicalOperator() {
        if (!this.isConditionFocus || !this.logicalOperator) return;
        this.condition = this.logicalOperator.selectedValue;
        this.conditionChanged.emit(this.condition);
    }
}
