import { Directive, HostListener, Input } from '@angular/core';
import { Uti } from 'app/utilities';

@Directive({
  selector: '[XnOnlyNumber]',
})
export class XnOnlyNumberDirective {
  constructor() {}

  @Input() XnOnlyNumber: boolean;
  @Input() allowCharacters: Array<string> = [];

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (this.XnOnlyNumber) {
      if (Uti.allowControlKey(e) || this.allowCharacters.indexOf(e.key) > -1) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
}
