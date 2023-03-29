import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { ArticlesInvoiceQuantity } from 'app/app.constants';
import { WidgetFieldService } from 'app/services';

@Component({
  selector: 'quantity-defect-renderer',
  templateUrl: './quantity-defect-renderer.html',
  styleUrls: ['./quantity-defect-renderer.scss'],
})
export class QuantityDefectRendererComponent
  extends BaseAgGridCellComponent<string>
  implements ICellRendererAngularComp, AfterViewInit
{
  @ViewChild('input', { read: ViewContainerRef }) public input;
  public isActive = true;

  constructor(private _widgetFieldService: WidgetFieldService) {
    super();
    this.subscribe();
  }

  refresh(params: any): boolean {
    return false;
  }

  /**
   * getCustomParam
   * @param params
   */
  protected getCustomParam(params: any) {
    this.isActive = this.getIsActiveValue(params);
    this.params.api.removeEventListener(
      'cellFocused',
      this.onCellFocused.bind(this)
    );
    this.params.api.addEventListener(
      'cellFocused',
      this.onCellFocused.bind(this)
    );
  }

  /**
   * onCellFocused
   * @param params
   */
  public onCellFocused(params) {
    if (!params.column) {
      return;
    }
    const colDef = params.column.colDef;
    if (this.componentParent) {
      if (
        params.rowIndex === this.params.node.rowIndex &&
        colDef.colId === ArticlesInvoiceQuantity.QtyDefect
      ) {
        if (this.input && this.input.element) {
          setTimeout(() => {
            if (!this.isActive) return;
            this.input.element.nativeElement.focus();
          }, 200);
        }
      }
    }
  }

  private subscribe() {
    this._widgetFieldService.changeQuantityActicleInvoiceAction.subscribe(
      () => {
        this.isActive = this.getIsActiveValue(this.params);
      }
    );
  }

  private getIsActiveValue(params) {
    try {
      return params.node.data['IsActive'];
    } catch (e) {
      return true;
    }
  }

  /**
   * getValue
   * */
  getValue(): any {
    return this.value;
  }

  handleQuantityDefect() {
    if (this.params && this.params.node) {
      this.componentParent.quantityArticleInvoiceChange(
        this.params.node.data,
        ArticlesInvoiceQuantity.QtyDefect
      );
    }
  }

  onChangeQuantityDefect($event) {
    this.params.data[ArticlesInvoiceQuantity.QtyDefect] = $event.target.value;
    this.componentParent.quantityInputChange(this.params.data, $event);
  }

  ngAfterViewInit(): void {}
}
