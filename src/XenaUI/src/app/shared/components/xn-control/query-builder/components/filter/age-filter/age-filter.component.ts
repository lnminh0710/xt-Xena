import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
} from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators,
} from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { WjInputDate, WjInputNumber } from "wijmo/wijmo.angular2.input";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";

@Component({
    selector: "age-filter",
    templateUrl: "./age-filter.component.html",
    styleUrls: ["./age-filter.component.scss"],
})
export class AgeFilterComponent implements OnInit, OnDestroy, AfterViewInit {
    public listComboBox: any = {};
    public listComboBoxRaw: any = {};
    public ageForm: FormGroup;
    public comparasionType: any = "";
    private isFocus = false;
    private isConditionFocus: boolean = false;
    public today = new Date();
    public isSingle = false;
    private ageFormValueChangesSubscription: Subscription;
    @ViewChild("typeCombobox") typeCombobox: AngularMultiSelect;
    @ViewChild("operatorCombobox") operatorCombobox: AngularMultiSelect;
    @ViewChild("rangeCombobox") rangeCombobox: AngularMultiSelect;
    @ViewChild("fromDate") fromDateControl: WjInputDate;
    @ViewChild("toDate") toDateControl: WjInputDate;
    @ViewChild("fromNumber") fromNumberControl: ElementRef;
    @ViewChild("toNumber") toNumberControl: ElementRef;
    @ViewChild("logicalOperator") logicalOperator: AngularMultiSelect;
    public fromNumberMax: number;
    public fromNumberMin: number = 0;
    public toNumberMin: number = 0;

    public ranges = [
        {
            key: "days",
            value: "Days",
        },
        {
            key: "months",
            value: "Months",
        },
        {
            key: "dates",
            value: "Dates",
        },
    ];

    @Input() set comboData(data: any) {
        this.listComboBoxRaw = data;
        if (!this.listComboBoxRaw || !this.listComboBoxRaw["Types"]) return;
        this.listComboBox["Types"] = this.listComboBoxRaw["Types"].map((x) => {
            return {
                textValue: x.TextValue,
                idValue: x.TextValue,
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
        const submitted = this.ageForm && this.ageForm["submitted"];
        if (item) {
            this.ageForm = new FormGroup({
                range: new FormControl(item["range"], [Validators.required]),
                fromValue: new FormControl(item["fromValue"], [
                    Validators.required,
                ]),
                toValue: new FormControl(item["toValue"], [
                    Validators.required,
                ]),
                groupType: new FormControl(item["groupType"], [
                    Validators.required,
                ]),
                groupOperators: new FormControl(item["groupOperators"], [
                    Validators.required,
                ]),
                groupQuantity: new FormControl(item["groupQuantity"], [
                    Validators.required,
                ]),
            });
        } else {
            this.ageForm = new FormGroup({
                range: new FormControl("days", [Validators.required]),
                fromValue: new FormControl("", [Validators.required]),
                toValue: new FormControl("", [Validators.required]),
                groupType: new FormControl("", [Validators.required]),
                groupOperators: new FormControl("", [Validators.required]),
                groupQuantity: new FormControl("", [Validators.required]),
            });
        }
        this.ageForm["submitted"] = submitted;
        this.subscribeFormValueChange();
    }
    @Input() condition = null;
    @Input() index = null;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() dataChange: EventEmitter<any> = new EventEmitter();
    @Output() conditionChanged: EventEmitter<any> = new EventEmitter();

    constructor(private formBuilder: FormBuilder) {}

    /**
     * ngOnInit
     */
    public ngOnInit() {}

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        if (this.ageFormValueChangesSubscription) {
            this.ageFormValueChangesSubscription.unsubscribe();
        }
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

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
        //if (!this.isConditionFocus || !this.logicalOperator)
        //    return;
        if (!this.logicalOperator) return;
        this.condition = this.logicalOperator.selectedValue;
        this.conditionChanged.emit(this.condition);
    }

    public onTypeFocus() {
        this.isFocus = true;
        this.dataChange.emit();
    }

    public changeRange() {
        if (!this.isFocus) {
            return;
        }
        this.ageForm.controls["fromValue"].setValue("");
        this.ageForm.controls["toValue"].setValue("");

        this.setMinMaxValueForControls();
    }

    public setMinMaxValueForControls() {
        if (this.ageForm.value["range"] == "dates") {
            if (this.fromDateControl) {
                this.fromDateControl.max = !this.ageForm.value["toValue"]
                    ? this.today
                    : this.ageForm.value["toValue"];
            }
            if (this.toDateControl) {
                this.toDateControl.min = !this.ageForm.value["fromValue"]
                    ? null
                    : this.ageForm.value["fromValue"];
                this.toDateControl.max = this.today;
            }
        } else {
            if (this.fromNumberControl) {
                this.fromNumberMax = !this.ageForm.value["toValue"]
                    ? null
                    : this.ageForm.value["toValue"];
                this.fromNumberMin = 0;
            }
            if (this.toNumberControl) {
                this.toNumberMin = !this.ageForm.value["fromValue"]
                    ? 0
                    : this.ageForm.value["fromValue"];
            }
        }
    }

    public changeType() {
        this.isSingle = this.typeCombobox.selectedValue === "Single";
        this.dataChange.emit();
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

    /**
     * subscribeFormValueChange
     */
    private subscribeFormValueChange() {
        this.ageFormValueChangesSubscription = this.ageForm.valueChanges
            .debounceTime(500)
            .subscribe((data) => {
                this.outputData.emit(data);

                if (!this.ageForm.pristine) {
                    this.updateFieldValidatorOnValueChange();
                }
            });
    }

    public updateValueAndValidity() {
        this.ageForm["submitted"] = true;
        this.ageForm.updateValueAndValidity();
    }

    public updateFieldValidatorOnValueChange() {
        if (this.ageForm.value["groupType"] == "Single") {
            this.ageForm.controls["groupOperators"].clearValidators();
            this.ageForm.controls["groupOperators"].setErrors(null);
            this.ageForm.controls["groupQuantity"].clearValidators();
            this.ageForm.controls["groupQuantity"].setErrors(null);
        } else {
            this.ageForm.controls["groupOperators"].setValidators(
                Validators.required
            );
            this.ageForm.controls["groupQuantity"].setValidators(
                Validators.required
            );

            if (this.ageForm["submitted"]) {
                this.ageForm.controls["groupOperators"].setErrors({
                    required: true,
                });
                this.ageForm.controls["groupQuantity"].setErrors({
                    required: true,
                });
            }
        }
    }
}
