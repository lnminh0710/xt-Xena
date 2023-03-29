import { Component, Input } from '@angular/core';

@Component({
  selector: 'check-payment-type',
  templateUrl: './check-payment-type.component.html',
  styleUrls: ['./check-payment-type.component.scss'],
})
export class CheckPaymentTypeComponent {
  @Input() currencyList: Array<any>;

  dayMask = [/\d/, /\d/];
  yearMask = [/\d/, /\d/, /\d/, /\d/];
}
