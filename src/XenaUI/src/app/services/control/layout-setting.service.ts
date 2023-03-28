import { Injectable } from "@angular/core";
import { GoldenLayoutService } from "./golden-layout.service";
import { GuidHelper } from "app/utilities/guild.helper";

@Injectable()
export class LayoutSettingService {
    private layoutMappingArray: Array<any> = [];
    private selector = ".edit-layout-setting-stage";
    private currentLayout: any = null;

    public turnOffFullScreenWidget: boolean = false;

    constructor() {}

    //#region public
    public destroy() {
        if (this.currentLayout) {
            this.currentLayout.goldenLayout.destroyLayout();
            this.currentLayout = null;
        }
    }

    //This method is called when clicking on each Tab
    public createLayoutWithLayoutContent(tabId): any {
        if (this.currentLayout) {
            this.currentLayout.goldenLayout.destroyLayout();
            this.currentLayout = null;
        }

        this.currentLayout =
            this.layoutMappingArray.find((item) => item.tabID === tabId) || {};
        if (!this.currentLayout.goldenLayout) {
            //New GoldenLayout
            this.currentLayout.goldenLayout = new GoldenLayoutService(
                this.selector
            );
        }

        return this.currentLayout;
    }

    public isTranslateXenaLayoutToGoldenLayout(): boolean {
        return this.layoutMappingArray.length ? true : false;
    }

    //This method is called when store state change
    public translateLayoutSetting2GoldenLayoutSetting(
        layoutSetting: any,
        editMode?: boolean
    ) {
        console.log("Before Translating:", layoutSetting);

        const layoutSettingContent = layoutSetting.Content;
        this.layoutMappingArray = [];
        for (let tab of layoutSettingContent.CustomTabs) {
            let layoutObj: any = this.createLayoutMappingObj(
                tab,
                layoutSetting.ModuleID,
                editMode
            );
            this.layoutMappingArray.push(layoutObj);
        }

        console.log("After Translating:", this.layoutMappingArray);
    }

    //After dragging to choose Items, we will convert to XenaJson to save it into DB
    public convertGoldenLayoutContent2PageLayoutContent() {
        let xenaContent: any;

        if (this.currentLayout && this.currentLayout.goldenLayout) {
            let configContent =
                this.currentLayout.goldenLayout.getConfigContent();
            if (configContent && configContent.length) {
                xenaContent = {};
                let rootConfigContent = configContent[0];
                console.log("goldenContent", rootConfigContent);

                if (
                    rootConfigContent.content.length == 1 &&
                    (rootConfigContent.type == "row" ||
                        rootConfigContent.type == "column")
                ) {
                    rootConfigContent = rootConfigContent.content[0];
                }

                xenaContent = this.createXenaItem(rootConfigContent);
            }
        }
        //if there is no content -> create default page
        if (!xenaContent) {
            xenaContent = this.createPage(null, null, null, null, null);
        }
        return xenaContent;
    }
    //#endregion

    //#region Xena layout to Convert Golden Layout

    private createLayoutMappingObj(tabData, moduleID, editMode?: boolean): any {
        const cacheKeyRoot = "GoldenModuleSetting:" + moduleID;

        let tabContent: any = tabData["TabContent"] || {};
        tabContent = editMode ? tabContent["EditMode"] : tabContent["ViewMode"];

        //Process for Old Way
        if (!tabContent) tabContent = tabData || {};

        return {
            cacheKeyRoot: cacheKeyRoot, // Xena CacheKey Root
            tabID: tabData["TabID"], // Xena TabId
            tabName: tabData["TabName"], // Xena TabName
            id: tabData["ID"], // Xena ID
            xenaContent: tabData, // Xena Tab Json Object
            goldenContent:
                this.convertPageLayoutContent2GoldenLayoutContent(tabContent), // Translate Golden Content Object from Xena Tab Json Object -> orignial Data
        };
    }

    public convertPageLayoutContent2GoldenLayoutContent(
        content: any
    ): Array<any> {
        const goldenLayoutContent: Array<any> = [];

        if (content["Page"]) {
            goldenLayoutContent.push(this.createGoldenLayoutPageItem(content));
        }
        if (content["Split"]) {
            if (content["Split"]["SplitType"] === "Horizontal") {
                const row = GoldenLayoutService.createRow(
                    "Row",
                    content["TabName"],
                    content["TabID"],
                    content["ID"]
                );
                for (let i = 0; i < content["Split"].Items.length; i++) {
                    row.content.push(
                        this.createGoldenLayoutPageItem(
                            content["Split"].Items[i]
                        )
                    );
                }
                goldenLayoutContent.push(row);
            }
            if (content["Split"]["SplitType"] === "Vertical") {
                const column = GoldenLayoutService.createColumn(
                    "Column",
                    content["TabName"],
                    content["TabID"]
                );
                for (let i = 0; i < content["Split"].Items.length; i++) {
                    column.content.push(
                        this.createGoldenLayoutPageItem(
                            content["Split"].Items[i]
                        )
                    );
                }
                goldenLayoutContent.push(column);
            }
        }
        if (content["SimpleTabs"] && content["SimpleTabs"].length) {
            const stack = GoldenLayoutService.createStack(
                "Stack",
                content["TabName"],
                content["TabID"]
            );
            for (let i = 0; i < content["SimpleTabs"].length; i++) {
                stack.content.push(
                    this.createGoldenLayoutPageItem(content["SimpleTabs"][i])
                );
            }
            goldenLayoutContent.push(stack);
        }
        return goldenLayoutContent;
    }

    private createGoldenLayoutPageItem(layoutItem: any): any {
        let goldenLayoutItem = null;
        let contentSize = this.parseContentSizeToGoldenSize(
            layoutItem["ContentSize"]
        );

        if (layoutItem["Page"]) {
            goldenLayoutItem = GoldenLayoutService.createPage(
                "Page",
                layoutItem["TabName"],
                layoutItem["Page"]["PageId"],
                contentSize,
                contentSize,
                layoutItem["ID"]
            );
        }

        if (layoutItem["Split"]) {
            if (layoutItem["Split"]["SplitType"] === "Horizontal") {
                goldenLayoutItem = GoldenLayoutService.createRow(
                    "Row",
                    layoutItem["TabName"],
                    layoutItem["TabID"],
                    contentSize,
                    contentSize
                );
                for (let i = 0; i < layoutItem["Split"].Items.length; i++) {
                    goldenLayoutItem.content.push(
                        this.createGoldenLayoutPageItem(
                            layoutItem["Split"].Items[i]
                        )
                    );
                }
            }
            if (layoutItem["Split"]["SplitType"] === "Vertical") {
                goldenLayoutItem = GoldenLayoutService.createColumn(
                    "Column",
                    layoutItem["TabName"],
                    layoutItem["TabID"],
                    contentSize,
                    contentSize
                );
                for (let i = 0; i < layoutItem["Split"].Items.length; i++) {
                    goldenLayoutItem.content.push(
                        this.createGoldenLayoutPageItem(
                            layoutItem["Split"].Items[i]
                        )
                    );
                }
            }
        }

        if (layoutItem["SimpleTabs"] && layoutItem["SimpleTabs"].length) {
            goldenLayoutItem = GoldenLayoutService.createStack(
                "Stack",
                layoutItem["TabName"],
                layoutItem["TabID"]
            );
            for (let i = 0; i < layoutItem["SimpleTabs"].length; i++) {
                goldenLayoutItem.content.push(
                    this.createGoldenLayoutPageItem(layoutItem["SimpleTabs"][i])
                );
            }
        }
        return goldenLayoutItem;
    }

    private parseContentSizeToGoldenSize(size): number {
        if (size) {
            return Number(size.replace("%", ""));
        }

        return null;
    }
    //#endregion

    //#region Convert Golden Layout to Xena layout
    private createXenaItem(layoutItem) {
        let xenaItem = null;

        if (layoutItem.type == "component") {
            xenaItem = this.createPage(
                layoutItem.id,
                layoutItem.id,
                layoutItem.title,
                this.calculateContentSize(layoutItem),
                layoutItem.itemId
            );
        } else if (layoutItem.type == "stack") {
            if (layoutItem.content.length == 1) {
                let item = layoutItem.content[0];
                if (item.type == "component")
                    xenaItem = this.createPage(
                        item.id,
                        item.id,
                        item.title,
                        this.calculateContentSize(layoutItem),
                        item.itemId
                    );
                else if (item.type == "row") {
                    if (item.content.length > 1) {
                        layoutItem = item;
                    }
                    xenaItem = this.createRow(
                        layoutItem.id,
                        layoutItem.title,
                        this.calculateContentSize(layoutItem)
                    ); //Horizontal: left -> right
                } else if (item.type == "column") {
                    if (item.content.length > 1) {
                        layoutItem = item;
                    }
                    xenaItem = this.createColumn(
                        layoutItem.id,
                        layoutItem.title,
                        this.calculateContentSize(layoutItem)
                    ); //Vertical: top -> bottom
                }
            } else {
                xenaItem = this.createStack(
                    layoutItem.id,
                    layoutItem.title,
                    this.calculateContentSize(layoutItem)
                );
            }
        } else if (layoutItem.type == "row") {
            if (
                layoutItem.content.length == 1 &&
                layoutItem.content[0].type == "stack" &&
                layoutItem.content[0].content.length == 1 &&
                layoutItem.content[0].content[0].type == "row"
            ) {
                layoutItem = layoutItem.content[0].content[0];
            }
            xenaItem = this.createRow(
                layoutItem.id,
                layoutItem.title,
                this.calculateContentSize(layoutItem)
            ); //Horizontal: left -> right
        } else if (layoutItem.type == "column") {
            if (
                layoutItem.content.length == 1 &&
                layoutItem.content[0].type == "stack" &&
                layoutItem.content[0].content.length == 1 &&
                layoutItem.content[0].content[0].type == "column"
            ) {
                layoutItem = layoutItem.content[0].content[0];
            }
            xenaItem = this.createColumn(
                layoutItem.id,
                layoutItem.title,
                this.calculateContentSize(layoutItem)
            ); //Vertical: top -> bottom
        }

        if (layoutItem.content && layoutItem.content.length) {
            for (let i = 0; i < layoutItem.content.length; i++) {
                let childItem = layoutItem.content[i];
                childItem.parentType = layoutItem.type;

                if (xenaItem.Split)
                    xenaItem.Split.Items.push(this.createXenaItem(childItem));
                else if (xenaItem.SimpleTabs)
                    xenaItem.SimpleTabs.push(this.createXenaItem(childItem));
            } //for
        }

        return xenaItem;
    }

    private calculateContentSize(layoutItem) {
        let type = layoutItem.parentType || layoutItem.type;
        let size: string = undefined;
        if (type == "column") {
            size = layoutItem.height || layoutItem.width;
        } else if (type == "row") {
            size = layoutItem.width || layoutItem.height;
        } else {
            size = layoutItem.height || layoutItem.width;
        }

        return size ? size + "" + "%" : null;
    }

    //width or height
    private createContentSize(size) {
        return size ? size + "" + "%" : null;
    }

    private createPage(pageId, tabId, tabName, contentSize, id) {
        pageId = pageId || GuidHelper.generateGUID();
        tabId = tabId || GuidHelper.generateGUID();
        tabName = tabName || "Untitled";
        return {
            Page: {
                PageId: pageId,
            },
            TabID: tabId,
            TabName: tabName,
            ContentSize: contentSize,
            ID: id || GuidHelper.generateGUID(),
        };
    }

    private createRow(tabId, tabName, contentSize) {
        tabId = tabId || GuidHelper.generateGUID();
        tabName = tabName || "Untitled";
        return {
            Split: {
                Items: [], //array of Page, Tab
                SplitType: "Horizontal", //: left -> right
            },
            TabID: tabId,
            TabName: tabName,
            ContentSize: contentSize,
            ID: GuidHelper.generateGUID(),
        };
    }

    private createColumn(tabId, tabName, contentSize) {
        tabId = tabId || GuidHelper.generateGUID();
        tabName = tabName || "Untitled";
        return {
            Split: {
                Items: [], //array of Page
                SplitType: "Vertical", //: top -> bottom
            },
            TabID: tabId,
            TabName: tabName,
            ContentSize: contentSize,
            ID: GuidHelper.generateGUID(),
        };
    }

    private createStack(tabId, tabName, contentSize) {
        tabId = tabId || GuidHelper.generateGUID();
        tabName = tabName || "Untitled";
        return {
            SimpleTabs: [], //array of Tab: contains Row, Column, Page
            TabID: tabId,
            TabName: tabName,
            ContentSize: contentSize,
            ID: GuidHelper.generateGUID(),
        };
    }
    //#endregion
}
