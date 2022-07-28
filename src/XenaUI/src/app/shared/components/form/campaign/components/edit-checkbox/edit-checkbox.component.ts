import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'edit-checkbox-component',
    templateUrl: './edit-checkbox.component.html',
    styleUrls: ['./edit-checkbox.component.scss'],

})
export class EditCheckBoxComponent {
    @Input()
    cbStatus: boolean;

    @Input()
    value: string;

    @Input()
    defaultText: string;

    @Output()
    cbStatusChange = new EventEmitter<boolean>();

    @Output()
    valueChange = new EventEmitter<string>();

    onCheckboxChange() {
        this.cbStatusChange.emit(this.cbStatus);
    }

    onValueChanged() {
        this.valueChange.emit(this.value);
    }

    onFocus() {
        if (!this.value) {
            this.value = this.defaultText;
            this.valueChange.emit(this.value);
        }
    }

    /**
     * numberKeyPress
     * @param evt
     */
    public numberKeyPress(evt) {
        if (evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    }
}
