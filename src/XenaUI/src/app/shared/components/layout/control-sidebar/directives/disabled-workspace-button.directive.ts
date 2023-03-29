import {
  Directive,
  OnInit,
  OnDestroy,
  Input,
  ElementRef,
  Renderer,
  OnChanges,
} from '@angular/core';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { Uti } from 'app/utilities';

@Directive({
  selector: '[DisabledWorkspaceButton]',
})
export class DisabledWorkspaceButtonDirective
  implements OnInit, OnDestroy, OnChanges
{
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private uti: Uti
  ) {}

  @Input() selectedWorkspace: any;
  @Input() checkOwner: boolean;

  ngOnInit() {}

  ngOnDestroy() {}

  ngOnChanges() {
    setTimeout(() => {
      let disabled = false;
      if (!this.checkOwner) {
        disabled = !this.selectedWorkspace;
      } else {
        disabled =
          !this.selectedWorkspace ||
          (this.selectedWorkspace &&
            (this.selectedWorkspace['IdLogin'] != this.uti.getUserInfo().id ||
              this.selectedWorkspace['IsSystem'] === true ||
              this.selectedWorkspace['IsUserDefault'] === true));
      }

      if (disabled) {
        this.renderer.setElementAttribute(
          this.el.nativeElement,
          'disabled',
          'true'
        );
      } else {
        this.renderer.setElementAttribute(
          this.el.nativeElement,
          'disabled',
          null
        );
      }
    }, 200);
  }
}
