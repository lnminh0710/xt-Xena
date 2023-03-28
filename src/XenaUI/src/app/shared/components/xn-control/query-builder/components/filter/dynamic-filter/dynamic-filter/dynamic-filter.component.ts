import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import {
    ControlBase,
    TextboxControl,
    DropdownControl,
    RangeControl,
} from "app/models";
import { CommonService } from "app/services";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DynamicFilterBase } from "../base";

@Component({
    selector: "dynamic-filter",
    templateUrl: "./dynamic-filter.component.html",
    styleUrls: ["./dynamic-filter.component.scss"],
})
export class DynamicFilterComponent
    extends DynamicFilterBase
    implements OnInit, OnDestroy, AfterViewInit
{
    private _controlList: Array<ControlBase<any>> = [];

    @Input() isRoot: boolean = true;

    @Input() set controlList(data: Array<ControlBase<any>>) {
        this._controlList = data;
    }

    @Input() form: FormGroup;

    get controlList() {
        return this._controlList;
    }

    constructor(
        private _eref: ElementRef,
        private commonService: CommonService
    ) {
        super();
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {}

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {}

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    /**
     * onUpdateValue
     */
    public onUpdateValue(control: ControlBase<any>) {
        // Visible combo box change selected option, find valid others to display
        if (control.controlType === "dropdown" && !control.isHidden) {
            let key = control.key;
            let value = control.value;
            //let targetControl = this.findDropdownControlByCondition(key, this.controlList, 'key');
            let targetControl = control;
            if (
                targetControl &&
                targetControl.children &&
                targetControl.children.length
            ) {
                // Set all hidden
                this.setHidden(targetControl.children);

                // Set visible for valid children
                targetControl.children.forEach((child) => {
                    let isValid = this.isValidChildForVisible(value, child);
                    if (isValid) {
                        child.isHidden = false;
                        // Recursive to display children of the current control
                        this.onUpdateValue(child);
                    }
                });
            }
        }
    }

    /**
     * isValidChildForVisible
     * @param key
     * @param child
     */
    private isValidChildForVisible(key, child: ControlBase<any>) {
        let isValid = false;
        let keys = child.fromOption.split(";");
        keys.forEach((k) => {
            if (k == key) {
                isValid = true;
            }
        });
        return isValid;
    }
}
