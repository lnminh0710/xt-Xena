import { TabSummaryInfoModel } from './tab-summary-info.model';
import { TabSummaryDataModel } from './tab-summary-data.model';
import { AccessRightModel } from '../access-right.model';

export class TabSummaryModel {
  public tabSummaryInfor: TabSummaryInfoModel = new TabSummaryInfoModel();
  public tabSummaryData: TabSummaryDataModel[] = [];
  public tabSummaryMenu: TabSummaryDataModel[] = [];
  public active: boolean = false;
  public disabled: boolean = false;
  public visible: boolean = true;
  public accessRight?: AccessRightModel;
  public showAsOtherTab: boolean = false;

  public constructor(init?: Partial<TabSummaryModel>) {
    Object.assign(this, init);
  }
}
