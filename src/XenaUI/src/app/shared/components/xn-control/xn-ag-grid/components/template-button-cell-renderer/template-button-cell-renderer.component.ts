import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { BackofficeActions } from 'app/state-management/store/actions';
import { ColHeaderKey } from '../../shared/ag-grid-constant';
import get from 'lodash-es/get';

@Component({
  selector: 'template-button-cell-renderer',
  templateUrl: './template-button-cell-renderer.html',
  styleUrls: ['./template-button-cell-renderer.scss'],
})
export class TemplateButtonCellRenderer
  extends BaseAgGridCellComponent<string>
  implements ICellRendererAngularComp
{
  public mode: string;

  constructor(
    private store: Store<AppState>,
    private backofficeActions: BackofficeActions
  ) {
    super();
  }

  refresh(params: any): boolean {
    return false;
  }

  /**
   * getCustomParam
   * @param params
   */
  protected getCustomParam(params: any) {
    if (params) {
      this.mode = params.mode;
    }
  }

  /**
   * btnClick
   **/
  public btnClick(eventData?: any) {
    switch (this.mode) {
      case 'InvoicePDF':
        this.store.dispatch(
          this.backofficeActions.requestDownloadPdf(
            this.componentParent.currentModule,
            this.params.data
          )
        );
        break;
      case 'Tracking':
        this.store.dispatch(
          this.backofficeActions.requestGoToTrackingPage(
            this.componentParent.currentModule,
            this.params.data
          )
        );
        break;
      case 'Return':
        this.store.dispatch(
          this.backofficeActions.requestOpenReturnRefundModule(
            this.componentParent.currentModule,
            this.params.data
          )
        );
        break;
      case 'Mediacode':
        this.componentParent.mediacodeClick.emit(this.params.data);
        break;
      case 'Delete':
        if (this.componentParent.redRowOnDelete) {
          this.componentParent.setDeleteCheckboxStatus(
            this.params.data,
            !this.params.data[ColHeaderKey.Delete],
            (item) => {
              this.componentParent.updateRowData([item]);
              this.componentParent.deleteRows();
            }
          );
        }
        this.componentParent.deleteClick.emit(this.params.data);
        this.componentParent.isButtonClicking = true;
        break;
      // case 'SendLetter':
      //     this.componentParent.sendLetterClick.emit(this.params.data);
      //     break;
      case 'Unblock':
        this.componentParent.unblockClick.emit(this.params.data);
        break;
      case 'StartStop':
        this.value = this.value == '1' ? '0' : '1';
        this.params.data['StartStop'] = this.value;
        this.componentParent.startStopClick.emit(this.params.data);
        break;
      case 'Run':
        this.componentParent.runClick.emit(this.params.data);
        break;
      case 'Download':
        this.componentParent.downloadClick.emit(this.params.data);
        break;
      case 'Preview':
        this.componentParent.previewClick.emit(this.params.data);
        break;
      case 'Setting':
        this.componentParent.settingClick.emit(this.params.data);
        break;
      case 'PDF':
        this.componentParent.pdfClick.emit(this.params.data);
        break;
      case 'EditRow':
        this.componentParent.editRowClick.emit(this.params.data);
        break;
      case 'Edit':
        this.componentParent.editClick.emit(this.params.data);
        break;
      case 'RunSchedule':
        this.componentParent.runScheduleClick.emit(this.params.data);
        break;
      case 'KillProcess':
        this.componentParent.killProcessClick.emit({
          data: this.params.data,
          setting: get(this.colDef, [
            'refData',
            'setting',
            'Setting',
            0,
            'StoreProcedure',
          ]),
        });
        break;
      case 'ShrinkFile':
        this.componentParent.shrinkFileClick.emit({
          data: this.params.data,
          setting: get(this.colDef, [
            'refData',
            'setting',
            'Setting',
            0,
            'StoreProcedure',
          ]),
        });
        break;
      case 'FilterExtended':
        this.componentParent.filterExtendedClick.emit(this.params.data);
        break;
      case 'rowColCheckAll':
        switch (eventData) {
          case 'horizontal':
            let allTrue =
              this.params.data.RMDelete &&
              this.params.data.RMEdit &&
              this.params.data.RMExport &&
              this.params.data.RMNew &&
              this.params.data.RMRead;
            if (allTrue) {
              this.params.data.RMDelete =
                this.params.data.RMDelete != -1 ? 0 : this.params.data.RMDelete;
              this.params.data.RMEdit =
                this.params.data.RMEdit != -1 ? 0 : this.params.data.RMEdit;
              this.params.data.RMExport =
                this.params.data.RMExport != -1 ? 0 : this.params.data.RMExport;
              this.params.data.RMNew =
                this.params.data.RMNew != -1 ? 0 : this.params.data.RMNew;
              this.params.data.RMRead =
                this.params.data.RMRead != -1 ? false : this.params.data.RMRead;
            } else {
              this.params.data.RMDelete =
                this.params.data.RMDelete != -1 ? 1 : this.params.data.RMDelete;
              this.params.data.RMEdit =
                this.params.data.RMEdit != -1 ? 1 : this.params.data.RMEdit;
              this.params.data.RMExport =
                this.params.data.RMExport != -1 ? 1 : this.params.data.RMExport;
              this.params.data.RMNew =
                this.params.data.RMNew != -1 ? 1 : this.params.data.RMNew;
              this.params.data.RMRead =
                this.params.data.RMRead != -1 ? true : this.params.data.RMRead;
            }

            this.componentParent.updateRowData([this.params.data]);
            this.componentParent.refresh();
            break;

          case 'vertical':
            this.updateRowColCheckAllRecursive(
              this.params.data.children,
              this.params.data
            );
            this.componentParent.refresh();
            break;
        }
      case 'ReportTypeTemplate':
        switch (eventData) {
          case 'download':
            this.componentParent.downloadClick.emit(this.params.data);
            break;

          case 'upload':
            this.componentParent.uploadClick.emit(this.params.data);
            break;
        }
    }
  }

  private updateRowColCheckAllRecursive(children, parentData) {
    for (let i = 0; i < children.length; i++) {
      children[i].RMDelete =
        children[i].RMDelete != -1 && parentData.RMDelete != -1
          ? parentData.RMDelete
          : children[i].RMDelete;
      children[i].RMEdit =
        children[i].RMEdit != -1 && parentData.RMEdit != -1
          ? parentData.RMEdit
          : children[i].RMEdit;
      children[i].RMExport =
        children[i].RMExport != -1 && parentData.RMExport != -1
          ? parentData.RMExport
          : children[i].RMExport;
      children[i].RMNew =
        children[i].RMNew != -1 && parentData.RMNew != -1
          ? parentData.RMNew
          : children[i].RMNew;
      children[i].RMRead =
        children[i].RMRead != -1 && parentData.RMRead != -1
          ? parentData.RMRead
          : children[i].RMRead;
      this.componentParent.updateRowData([children[i]]);

      this.updateRowColCheckAllRecursive(children[i].children, parentData);
    }
  }
}
