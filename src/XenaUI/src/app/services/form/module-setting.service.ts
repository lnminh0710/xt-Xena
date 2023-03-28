import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import {
    TabSummaryModel,
    ModuleSettingModel,
    SimpleTabModel,
    Module,
    PageModel,
} from "app/models";
import { BaseService } from "../base.service";
import isNil from "lodash-es/isNil";

@Injectable()
export class ModuleSettingService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }

    public getModuleSetting(
        objectParam?: string,
        idSettingsModule?: string,
        objectNr?: string,
        moduleType?: string,
        idLogin?: string
    ): Observable<any> {
        const param = {
            objectParam: objectParam,
            idSettingsModule: idSettingsModule,
            objectNr: objectNr,
            moduleType: moduleType,
            idLogin: idLogin,
        };

        return this.get<any>(this.serUrl.getSettingModule, param, null, null);
    }

    public isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    public getValidJsonSetting(moduleSetting: ModuleSettingModel[]) {
        for (const setting of moduleSetting) {
            if (this.isJson(setting.jsonSettings)) {
                return setting;
            }
        }

        return null;
    }

    insertNewJsonSetting(
        moduleSetting: ModuleSettingModel[],
        newJsonSetting: any
    ) {
        for (const setting of moduleSetting) {
            if (this.isJson(setting.jsonSettings)) {
                setting.jsonSettings = JSON.stringify(newJsonSetting);
            }
        }

        return moduleSetting;
    }

    insertNewOtherTabSetting(
        newJsonSettings,
        selectedTab: TabSummaryModel,
        contentDisplayMode
    ) {
        if (newJsonSettings.AdditionalInfo) {
            delete newJsonSettings.AdditionalInfo;
        }

        for (const customTab of newJsonSettings.Content.CustomTabs) {
            if (customTab.TabID === selectedTab.tabSummaryInfor.tabID) {
                if (customTab.TabContent[contentDisplayMode].Split) {
                    delete customTab.TabContent[contentDisplayMode].Split;
                }

                customTab.TabContent[contentDisplayMode].Page = {};
            }
        }

        return newJsonSettings;
    }

    insertNewSimpleTabSetting(
        newJsonSettings,
        selectedTab: TabSummaryModel,
        selectedSimpleTab: SimpleTabModel,
        contentDisplayMode
    ) {
        if (newJsonSettings.AdditionalInfo) {
            delete newJsonSettings.AdditionalInfo;
        }

        for (const customTab of newJsonSettings.Content.CustomTabs) {
            if (customTab.TabID === selectedTab.tabSummaryInfor.tabID) {
                let simpleTabs: SimpleTabModel[] = [];
                if (
                    customTab.TabContent[contentDisplayMode].Split &&
                    customTab.TabContent[contentDisplayMode].Split.Items
                ) {
                    for (const item of customTab.TabContent[contentDisplayMode]
                        .Split.Items) {
                        if (
                            !isNil(
                                item.TabContent[contentDisplayMode].SimpleTabs
                            )
                        ) {
                            simpleTabs =
                                item.TabContent[contentDisplayMode].SimpleTabs;
                            break;
                        }
                    }
                    delete customTab.TabContent[contentDisplayMode].Split;
                } else if (
                    customTab.TabContent[contentDisplayMode].SimpleTabs
                ) {
                    simpleTabs =
                        customTab.TabContent[contentDisplayMode].SimpleTabs;
                }

                for (const simpleTab of simpleTabs) {
                    simpleTab.Active =
                        simpleTab.TabID === selectedSimpleTab.TabID;
                    simpleTab.Disabled =
                        simpleTab.TabID !== selectedSimpleTab.TabID;
                    simpleTab.Page = {};
                }

                delete customTab.TabContent[contentDisplayMode].Page;
                delete customTab.Toolbar;

                customTab.TabContent[contentDisplayMode].SimpleTabs =
                    simpleTabs;
            }
        }

        return newJsonSettings;
    }

    updateSettingsModule(data): Observable<any> {
        return this.post<any>(
            this.serUrl.serviceUpdateSettingsModuleUrl,
            JSON.stringify(data)
        ).map((result: any) => {
            return result.item;
        });
    }

    mergeUserModuleLayoutSetting(
        userModuleLayoutSetting,
        defaultModuleLayoutSetting,
        contentDisplayMode
    ) {
        let mergedSetting = defaultModuleLayoutSetting;

        if (
            userModuleLayoutSetting &&
            userModuleLayoutSetting.AdditionalInfo &&
            userModuleLayoutSetting.AdditionalInfo.SimpleTabs &&
            mergedSetting &&
            mergedSetting.AdditionalInfo &&
            mergedSetting.AdditionalInfo.SimpleTabs
        ) {
            mergedSetting.AdditionalInfo.SimpleTabs.forEach((defaultTab) => {
                let found =
                    userModuleLayoutSetting.AdditionalInfo.SimpleTabs.find(
                        (t) => t.TabID === defaultTab.TabID
                    );
                if (found) {
                    if (
                        defaultTab.hasOwnProperty("Split") &&
                        found.hasOwnProperty("Split")
                    ) {
                        defaultTab.Split = found.Split;
                    }

                    if (
                        defaultTab.hasOwnProperty("SimpleTabs") &&
                        found.hasOwnProperty("SimpleTabs")
                    ) {
                        defaultTab.SimpleTabs = found.SimpleTabs;
                    }

                    if (
                        defaultTab.hasOwnProperty("Page") &&
                        found.hasOwnProperty("Page")
                    ) {
                        defaultTab.Page = found.Page;
                    }
                }
            });
        }

        if (
            userModuleLayoutSetting &&
            userModuleLayoutSetting.Content &&
            userModuleLayoutSetting.Content.CustomTabs &&
            mergedSetting &&
            mergedSetting.Content &&
            mergedSetting.Content.CustomTabs
        ) {
            mergedSetting.Content.CustomTabs.forEach((defaultTab) => {
                let found = userModuleLayoutSetting.Content.CustomTabs.find(
                    (t) => t.TabID === defaultTab.TabID
                );
                if (found) {
                    if (
                        defaultTab.TabContent[
                            contentDisplayMode
                        ].hasOwnProperty("Split") &&
                        found.TabContent[contentDisplayMode].hasOwnProperty(
                            "Split"
                        )
                    ) {
                        defaultTab.TabContent.Split = found.TabContent.Split;
                    }

                    if (
                        defaultTab.TabContent[
                            contentDisplayMode
                        ].hasOwnProperty("SimpleTabs") &&
                        found.TabContent[contentDisplayMode].hasOwnProperty(
                            "SimpleTabs"
                        )
                    ) {
                        defaultTab.TabContent[contentDisplayMode].SimpleTabs =
                            found.TabContent[contentDisplayMode].SimpleTabs;
                    }

                    if (
                        defaultTab.TabContent[
                            contentDisplayMode
                        ].hasOwnProperty("Page") &&
                        found.TabContent[contentDisplayMode].hasOwnProperty(
                            "Page"
                        )
                    ) {
                        defaultTab.TabContent[contentDisplayMode].Page =
                            found.TabContent[contentDisplayMode].Page;
                    }
                }
            });
        }

        return mergedSetting;
    }
}
