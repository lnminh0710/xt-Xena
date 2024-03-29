import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { Uti } from 'app/utilities';

@Component({
  selector: 'elastic-search-sync-grid',
  styleUrls: ['./elastic-search-sync-grid.component.scss'],
  templateUrl: './elastic-search-sync-grid.component.html',
})
export class ElasticSearchSyncGridComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public dataSource: any;

  @Input() isGettingData: boolean;
  @Input() gridId: string;
  @Input() gettingDataMessage: string;
  @Input() set data(data: any) {
    this.executeData(data);
  }
  @Input() rowBackground: any;
  @Input() rowBackgroundGlobal: any;
  @Input() borderRow: any;
  @Input() backgroundImage: any;
  @Input() background: any;
  @Input() gridStyle: any;

  @ViewChild('syncGrid') syncGrid: XnAgGridComponent;

  constructor(router?: Router) {
    super(router);
  }

  public ngOnInit() {}

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public updateRowData(rowData: any) {
    this.syncGrid.updateRowData(rowData);
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private executeData(data: any) {
    this.dataSource = data;
  }
}
