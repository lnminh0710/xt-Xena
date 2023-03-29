import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ICellRendererAngularComp,
  ICellEditorAngularComp,
} from 'ag-grid-angular';
import {
  DatatableService,
  CommonService,
  AppErrorHandler,
  PropertyPanelService,
} from 'app/services';
import { ApiResultResponse } from 'app/models';
import { Uti } from 'app/utilities/uti';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'language-cell-renderer',
  templateUrl: './language-cell-renderer.html',
  styleUrls: ['./language-cell-renderer.scss'],
})
export class LanguageCellRenderer
  extends BaseAgGridCellComponent<any>
  implements ICellRendererAngularComp, ICellEditorAngularComp
{
  @ViewChild('input', { read: ViewContainerRef }) public input;
  public key: string;
  public displayValue: string;

  constructor(
    private datatableService: DatatableService,
    private propertyPanelService: PropertyPanelService,
    private commonService: CommonService,
    private appErrorHandler: AppErrorHandler
  ) {
    super();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    });
  }

  /**
   * getCustomParam
   * @param params
   */
  protected getCustomParam(params: any) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.cellStartedEdit = this.params.cellStartedEdit;
    if (this.value) {
      this.key = this.value.key;
      this.displayValue = this.value.value;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

  /**
   * getValue
   * */
  getValue(): any {
    if (!this.key && !this.displayValue) {
      return null;
    }
    return {
      key: this.key,
      value: this.displayValue,
    };
  }
}
