import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import toNumber from 'lodash-es/toNumber';
import { ControlBase, TextboxControl, DropdownControl, RangeControl } from 'app/models';
import { WjComboBox, WjInputDate, WjInputNumber } from 'wijmo/wijmo.angular2.input';

@Component({
    selector: 'range-control',
    templateUrl: './range-control.component.html',
    styleUrls: ['./range-control.component.scss']
})
export class RangeControlComponent implements OnInit, OnDestroy, AfterViewInit {
    private _control: ControlBase<any>;
    public fromValue: any = null;
    public toValue: any = null;

    @Input() set control(data: ControlBase<any>) {
        if (data.value) {
            this.fromValue = data.value.fromValue;
            this.toValue = data.value.toValue;
        }
        this._control = data;
    }

    get control() {
        return this._control;
    }

    @ViewChild('fromDateControl') fromDateControl: WjInputDate;
    @ViewChild('toDateControl') toDateControl: WjInputDate;
    @ViewChild('fromNumberControl') fromNumberControl: ElementRef;
    @ViewChild('toNumberControl') toNumberControl: ElementRef;
    @Output() public onUpdateValue: EventEmitter<any> = new EventEmitter();

    public today = new Date();

    constructor(private _eref: ElementRef) {

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
    ngAfterViewInit() {
    }

    /**
     * setMinMaxValueForControls
     */
    public setMinMaxValueForControls() {
        let fromValue;
        let toValue;
        if ((this.control as RangeControl).type == 'dates') {
            if (this.fromDateControl) {
                fromValue = this.fromDateControl.value;
                this.fromDateControl.max = !this.toDateControl.value ? this.today : this.toDateControl.value;
            }
            if (this.toDateControl) {
                toValue = this.toDateControl.value;
                this.toDateControl.min = !this.fromDateControl.value ? null : this.fromDateControl.value;
                this.toDateControl.max = this.today;
            }
        } else {
            if (this.fromNumberControl) {
                fromValue = this.fromNumberControl.nativeElement.value;
                fromValue = toNumber(fromValue);
            }
            if (this.toNumberControl) {
                toValue = this.toNumberControl.nativeElement.value;
                toValue = toNumber(toValue);
                if (fromValue && toValue) {
                    if (fromValue > toValue) {
                        toValue = null;
                        this.toNumberControl.nativeElement.value = null;
                    }
                }
            }

            /*if (this.fromNumberControl) {
                this.fromNumberControl.max = !toValue ? null : toValue;
                this.fromNumberControl.min = 0;
            }

            if (this.toNumberControl) {
                this.toNumberControl.min = !fromValue ? 0 : fromValue;
            }*/

        }

        this.onUpdateValue.emit({
            fromValue: fromValue,
            toValue: toValue
        });
    }
}
