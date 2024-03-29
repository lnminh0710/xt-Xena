import { Component, ViewEncapsulation, TemplateRef } from '@angular/core';
import {
  ICellRendererAngularComp,
  ICellEditorAngularComp,
  IHeaderAngularComp,
} from 'ag-grid-angular';
import { BaseAgGridCellComponent } from '../../../shared/base-ag-grid-cell-component';

@Component({
  selector: 'template-header-cell-renderer',
  templateUrl: './template-header-cell-renderer.html',
  styleUrls: ['./template-header-cell-renderer.scss'],
})
export class TemplateHeaderCellRenderer
  extends BaseAgGridCellComponent<any>
  implements IHeaderAngularComp
{
  public template: TemplateRef<any>;
  public templateContext: { $implicit: any; params: any };

  constructor() {
    super();
  }

  public getCustomParam() {
    this.template = this.params['ngTemplate'];
    this.templateContext = {
      $implicit: this.params['customParam'],
      params: this.params,
    };
  }
}
