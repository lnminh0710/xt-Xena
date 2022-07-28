import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Uti } from 'app/utilities';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'payment-type-select',
    templateUrl: './payment-type-select.component.html'

})
export class PaymentTypeSelectComponent {

    public paymentTypeForm: FormGroup;
    public selectedKey: number;

    @Input() paymentTypeList: Array<any>;
    @Input() currencyList: Array<any>;
    @Input() creditCardList: Array<any>;

    @Output() changePaymentType: EventEmitter<any> = new EventEmitter();

    @ViewChild('paymentType') paymentTypeCombobox: AngularMultiSelect;

    constructor(
    ) {
        this.paymentTypeForm = new FormGroup({
            paymentType: new FormControl('', Validators.required)
        });
        Uti.registerFormControlType(this.paymentTypeForm, {
            dropdown: 'paymentType'
        });
    }

    public onChangeValue() {
        if (this.paymentTypeCombobox && this.paymentTypeCombobox.selectedValue) {
            const key = this.paymentTypeCombobox.selectedValue;
            this.selectedKey = key;
            const option = this.paymentTypeList.find(p => p.key == key);
            this.changePaymentType.emit(option);
        }
    }

}
