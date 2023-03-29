import { Component, Input } from '@angular/core';

@Component({
  selector: 'cash-payment-type',
  templateUrl: './cash-payment-type.component.html',
})
export class CashPaymentTypeComponent {
  @Input() currencyList: Array<any>;
}
