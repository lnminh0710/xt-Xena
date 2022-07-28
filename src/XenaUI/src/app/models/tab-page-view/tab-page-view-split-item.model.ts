import { TabPageViewSplitPageModel } from './tab-page-view-split-page.model';

export class TabPageViewSplitItemModel {
    public ContentSize: any = '';
    public Page: TabPageViewSplitPageModel = null;

    public constructor(init?: Partial<TabPageViewSplitItemModel>) {
        Object.assign(this, init);
    }
}
