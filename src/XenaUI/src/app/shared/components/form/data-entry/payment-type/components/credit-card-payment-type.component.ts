import { Component, Input } from '@angular/core';

@Component({
  selector: 'credit-card-payment-type',
  templateUrl: './credit-card-payment-type.component.html',
  styleUrls: ['./credit-card-payment-type.component.scss'],
})
export class CreditCardPaymentTypeComponent {
  @Input() currencyList: Array<any>;
  @Input() creditCardList: Array<any>;

  dayMask = [/\d/, /\d/];
  yearMask = [/\d/, /\d/, /\d/, /\d/];
}
