import { TabPageViewSplitItemModel } from './tab-page-view-split-item.model';

export class TabPageViewSplitModel {
  public SplitType: string = '';
  public Items: TabPageViewSplitItemModel[] = null;

  public constructor(init?: Partial<TabPageViewSplitModel>) {
    Object.assign(this, init);
  }
}
