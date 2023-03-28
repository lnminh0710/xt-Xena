import { Injectable } from "@angular/core";

@Injectable()
export class SplitterService {
    public hasChanged: boolean = false;

    public updateSplitterState(
        moduleSetting: any,
        splittersSize: any,
        pageItems: Array<any>
    ) {
        this.hasChanged = true;

        let jsonSettings = moduleSetting.item[0].jsonSettings;
        let moduleContent = jsonSettings.Content;

        for (let i = 0; i < pageItems.length; i++) {
            this.loopRecursive(
                moduleContent.CustomTabs,
                pageItems[i].ID,
                splittersSize
            );
        }

        jsonSettings.Content = moduleContent;
        moduleSetting.item[0].jsonSettings = JSON.stringify(jsonSettings);
    }

    private loopRecursive(
        items: Array<any>,
        id: string,
        splittersSize: any
    ): void {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if (item.ID == id) {
                for (let j = 0; j < items.length; j++) {
                    items[j].ContentSize = splittersSize[j].toString() + "%";
                }
                break;
            }

            if (item.TabContent) {
                if (item.TabContent.ViewMode) {
                    if (item.TabContent.ViewMode.Split) {
                        this.loopRecursive(
                            item.TabContent.ViewMode.Split.Items,
                            id,
                            splittersSize
                        );
                    }

                    if (item.TabContent.ViewMode.SimpleTabs) {
                        this.loopRecursive(
                            item.TabContent.ViewMode.SimpleTabs,
                            id,
                            splittersSize
                        );
                    }
                }

                if (item.TabContent.EditMode) {
                    if (item.TabContent.EditMode.SimpleTabs) {
                        this.loopRecursive(
                            item.TabContent.EditMode.SimpleTabs,
                            id,
                            splittersSize
                        );
                    }

                    if (item.TabContent.EditMode.SimpleTabs) {
                        this.loopRecursive(
                            item.TabContent.EditMode.SimpleTabs,
                            id,
                            splittersSize
                        );
                    }
                }
            } else {
                if (item.Split) {
                    this.loopRecursive(item.Split.Items, id, splittersSize);
                }

                if (item.SimpleTabs) {
                    this.loopRecursive(item.SimpleTabs, id, splittersSize);
                }
            }
        }
    }
}
