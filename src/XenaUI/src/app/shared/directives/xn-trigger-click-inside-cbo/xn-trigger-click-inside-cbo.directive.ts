import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { DatePickerComponent } from 'app/shared/components/xn-control';
import * as wjcInput from 'wijmo/wijmo.input';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
@Directive({
  selector: '[xn-trigger-click-inside-cbo]',
})
export class TriggerClickInsideCboDirective {
  private expanded: boolean = false;
  @Input('xn-trigger-click-inside-cbo') control: any;
  @Input() triggerClickAction: string = '';
  @HostListener('click', ['$event.target'])
  onClick(btn) {
    if (!this.control) return;

    this.expanded = !this.expanded;
    if (this.control instanceof DatePickerComponent) {
      const ctr = <DatePickerComponent>this.control;
      ctr.openCalendarFromOutSide();
      return;
    }

    if (this.control instanceof AngularMultiSelect) {
      //$(this.control.hostElement.querySelector('.bt-down')).trigger('mousedown');
      //$(this.control.hostElement).focus();
      this.control.ignoreClickOutside = true;
      this.control.openDropdown();
      setTimeout(() => {
        this.control.ignoreClickOutside = false;
      }, 500);
      return;
    }
    if (this.control instanceof wjcInput.MultiSelect) {
      $(this.control.hostElement.querySelector('button')).trigger('mousedown');
      $(this.control.hostElement).focus();
      this.control.isDroppedDown = true;
      return;
    }

    if (this.triggerClickAction) {
      window.open(this.triggerClickAction, '_blank');
    }
  }
  constructor(private elementRef: ElementRef) {
    // UI
    this.elementRef.nativeElement.classList.add('control-message-clickable');
    // Business
  }
}
