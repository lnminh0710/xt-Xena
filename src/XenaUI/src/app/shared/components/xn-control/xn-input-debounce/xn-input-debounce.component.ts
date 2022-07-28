import { Component, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy, ViewChild, Renderer2, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Uti } from 'app/utilities';

@Component({
    selector: 'app-xn-input-debounce',
    templateUrl: './xn-input-debounce.component.html',
    styleUrls: ['./xn-input-debounce.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputDebounceComponent),
            multi: true,
        }
    ],
})
export class InputDebounceComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
    public onChange: any = (_: any) => { };

    private delayTime = 500;
    private timer: any = null;
    private valueString: string = '';
    private isInsideForm: boolean = false;
    public isWithStar: boolean = false;
    private onPasting = false;
    private isKeyPressed: boolean = false;

    @Input() id: string = Uti.guid();
    @Input() readonly: boolean = false;
    @Input() placeholder: string;
    @Input() set delayTimer(data: any) {
        this.delayTime = data;
    }
    @Input() value: string = '';
    @Input() cssClass: string
    @Input() isLoading = false;
    @Input() hasIndicator = true;
    @Input() hasSearchButton = true;
    @Input() hasValidation = false;
    @Input() isDisabled = false;
    // @Input() hasSearchButton = true;

    @Output() onValueChanged: EventEmitter<string> = new EventEmitter();
    @Output() onSearchButtonClicked: EventEmitter<string> = new EventEmitter();
    @Output() keyup: EventEmitter<any> = new EventEmitter();

    @ViewChild('inputControl') inputControl;

    constructor(private renderer: Renderer2,
        private elementRef: ElementRef) {
    }

    writeValue(value: any): void {
        const input = this.inputControl.nativeElement;
        this.value = this.value || value;
        this.renderer.setProperty(input, 'value', value);
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {

    }

    setDisabledState?(isDisabled: boolean): void {

    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        this.isInsideForm = this.elementRef.nativeElement['attributes']['formcontrolname'] ? true : false;
        this.registerPasteEvent();
    }

    public onKeyPress($event) {
        //press enter || combo ctrl key || paste event
        if (//$event.keyCode == 13
            // $event.keyCode == 16
            // || $event.keyCode == 17
            // || $event.keyCode == 18
            // || $event.ctrlKey
            this.onPasting)
            return;

        this.isKeyPressed = true;
        clearTimeout(this.timer);
        this.timer = null;
        this.timer = setTimeout(() => {
            if ($event.target.value.trim() === this.valueString) {
                return;
            }
            this.valueString = $event.target.value.trim();
            if (this.valueString || this.hasValidation) {
                this.onChange(this.valueString);
                this.onValueChanged.emit(this.valueString);
            }
            else {
                this.isLoading = false;
            }
            this.keyup.emit($event);
        }, this.delayTime);
    }

    public onKeyUp($event) {
        if (this.isKeyPressed || this.onPasting) {
            this.isKeyPressed = false;
            return;
        }
        if ($event.target.value.trim() != this.valueString) {
            this.onKeyPress($event);
        }
    }

    private registerPasteEvent() {
        var that = this;
        $("#" + this.id, this.elementRef.nativeElement).bind('paste', function (e) {
            let ctrl = this;
            that.onPasting = true;
            setTimeout(function () {
                that.onPasting = false;
                that.valueString = (<any>ctrl).value;
                if (that.valueString != that.value) {
                    that.onChange(that.valueString);
                    that.onValueChanged.emit(that.valueString);
                }
            }, 100);
        });
    }

    public searchClicked($event) {
        this.valueString = this.value;
        this.onSearchButtonClicked.emit(this.valueString);
    }

    public focusInput() {
        if (this.inputControl && this.inputControl.nativeElement) this.inputControl.nativeElement.focus();
    }
}
