import { Injectable } from "@angular/core";
import {
    WidgetTemplateSettingModel,
    PageSetting,
    WidgetDetail,
    WidgetDetailPage,
    WidgetType,
    WidgetKeyType,
    IWidgetDataTypeValues,
    IWidgetTargetRender,
    Module,
    TabSummaryModel,
    SimpleTabModel,
    LightWidgetDetail,
    LayoutPageInfoModel,
    WidgetPropertyModel,
} from "app/models";
import { Uti } from "app/utilities";
import {
    ReplaceString,
    MenuModuleId,
    RepWidgetAppIdEnum,
    DefaultWidgetItemConfiguration,
} from "app/app.constants";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import upperFirst from "lodash-es/upperFirst";
import toSafeInteger from "lodash-es/toSafeInteger";
import { XnWidgetMenuStatusComponent } from "../components";
import { format } from "date-fns/esm";
import { ModuleList } from "app/pages/private/base";
import { NgGridItemConfig } from "../../grid-stack";

@Injectable()
export class WidgetUtils {
    public static widgetDataTypeValues: IWidgetDataTypeValues = {};

    private excludeContextMenuModule = [24, "24"];

    constructor() {}

    /**
     * updateWidgetDataTypeValues
     * @param key
     * @param value
     * @param widgetKeyType
     * @param srcWidgetId -- used in Sub case to define parent widget
     */
    public updateWidgetDataTypeValues(
        moduleId: string,
        key: string,
        value: string,
        widgetKeyType?: WidgetKeyType,
        srcWWidgetDetail?: WidgetDetail,
        pageId?: string
    ) {
        if (!widgetKeyType) {
            widgetKeyType = WidgetKeyType.Sub;
        }

        if (!WidgetUtils.widgetDataTypeValues[moduleId]) {
            WidgetUtils.widgetDataTypeValues[moduleId] = {};
        }

        // Main case
        if (widgetKeyType == WidgetKeyType.Main) {
            if (WidgetUtils.widgetDataTypeValues[moduleId][key]) {
                const obj: any =
                    WidgetUtils.widgetDataTypeValues[moduleId][key];
                obj[WidgetKeyType[widgetKeyType]] = value;
                WidgetUtils.widgetDataTypeValues[moduleId][key] = obj;
            } else {
                const obj: any = {};
                obj[WidgetKeyType[widgetKeyType]] = value;
                WidgetUtils.widgetDataTypeValues[moduleId][key] = obj;
            }
        }
        // Sub case
        else {
            if (
                !WidgetUtils.widgetDataTypeValues[moduleId][key] ||
                (WidgetUtils.widgetDataTypeValues[moduleId][key] &&
                    !WidgetUtils.widgetDataTypeValues[moduleId][key][
                        WidgetKeyType[widgetKeyType]
                    ])
            ) {
                const obj: any = {};
                const subArr = [
                    {
                        value: value,
                        srcWidgetId: srcWWidgetDetail.id,
                        title: srcWWidgetDetail.title,
                        pageId: pageId,
                        item: this.getWidgetDataContentDetailItem(
                            srcWWidgetDetail,
                            key,
                            value
                        ),
                    },
                ];
                obj[WidgetKeyType[widgetKeyType]] = subArr;

                if (!WidgetUtils.widgetDataTypeValues[moduleId][key]) {
                    WidgetUtils.widgetDataTypeValues[moduleId][key] = obj;
                } else {
                    WidgetUtils.widgetDataTypeValues[moduleId][key][
                        WidgetKeyType[widgetKeyType]
                    ] = subArr;
                }
            } else {
                let subKeyArray: Array<any> =
                    WidgetUtils.widgetDataTypeValues[moduleId][key][
                        WidgetKeyType[widgetKeyType]
                    ];
                let iRet = false;
                subKeyArray.forEach((subKey) => {
                    if (subKey.srcWidgetId == srcWWidgetDetail.id) {
                        subKey.value = value;
                        iRet = true;
                        subKey.item = this.getWidgetDataContentDetailItem(
                            srcWWidgetDetail,
                            key,
                            value
                        );
                    }
                });
                if (!iRet) {
                    subKeyArray.push({
                        value: value,
                        srcWidgetId: srcWWidgetDetail.id,
                        title: srcWWidgetDetail.title,
                        pageId: pageId,
                        item: this.getWidgetDataContentDetailItem(
                            srcWWidgetDetail,
                            key,
                            value
                        ),
                    });
                }
            }
        }
    }

    private getWidgetDataContentDetailItem(
        srcWidgetDetail: WidgetDetail,
        key: string,
        value: string
    ) {
        if (
            srcWidgetDetail &&
            srcWidgetDetail.contentDetail &&
            srcWidgetDetail.contentDetail.collectionData &&
            srcWidgetDetail.contentDetail.collectionData.length &&
            key &&
            value
        ) {
            const array: Array<any> =
                srcWidgetDetail.contentDetail.collectionData;
            return array.find((item) => item[key] == value);
        }

        return null;
    }

    /**
     * updateWidgetTitleDataTypeValues
     * @param srcWWidgetDetail
     */
    public updateWidgetTitleDataTypeValues(
        moduleId: string,
        srcWWidgetDetail: WidgetDetail
    ) {
        Object.keys(WidgetUtils.widgetDataTypeValues[moduleId]).forEach(
            (listenKey) => {
                if (
                    WidgetUtils.widgetDataTypeValues[moduleId][listenKey] &&
                    WidgetUtils.widgetDataTypeValues[moduleId][listenKey][
                        "Sub"
                    ] &&
                    WidgetUtils.widgetDataTypeValues[moduleId][listenKey]["Sub"]
                        .length
                ) {
                    let subs: Array<any> =
                        WidgetUtils.widgetDataTypeValues[moduleId][listenKey][
                            "Sub"
                        ];
                    subs.forEach((sub) => {
                        if (sub.srcWidgetId == srcWWidgetDetail.id) {
                            sub.title = srcWWidgetDetail.title;
                        }
                    });
                }
            }
        );
    }

    /**
     * Clear All
     * clearWidgetDataTypeValues
     */
    public clearWidgetDataTypeValues() {
        WidgetUtils.widgetDataTypeValues = {};
    }

    /**
     * Clear by Page Id
     * clearWidgetDataTypeValuesByPageId
     */
    public clearWidgetDataTypeValuesByPageId(moduleId: string, pageId: string) {
        if (
            WidgetUtils.widgetDataTypeValues &&
            WidgetUtils.widgetDataTypeValues[moduleId]
        ) {
            Object.keys(WidgetUtils.widgetDataTypeValues[moduleId]).forEach(
                (key) => {
                    if (WidgetUtils.widgetDataTypeValues[moduleId][key]) {
                        let subArr: Array<any> =
                            WidgetUtils.widgetDataTypeValues[moduleId][key][
                                WidgetKeyType[WidgetKeyType.Sub]
                            ];
                        if (subArr && subArr.length) {
                            subArr = subArr.filter((p) => p.pageId != pageId);
                            WidgetUtils.widgetDataTypeValues[moduleId][key][
                                WidgetKeyType[WidgetKeyType.Sub]
                            ] = subArr;
                        }
                    }
                }
            );
        }
    }

    /**
     * removeListenKeyFromWidgetDataTypeValues
     * @param srcWidgetId
     */
    public removeListenKeyFromWidgetDataTypeValues(
        moduleId: string,
        srcWidgetId: string
    ) {
        if (
            WidgetUtils.widgetDataTypeValues &&
            WidgetUtils.widgetDataTypeValues[moduleId]
        ) {
            Object.keys(WidgetUtils.widgetDataTypeValues[moduleId]).forEach(
                (listenKey) => {
                    if (
                        WidgetUtils.widgetDataTypeValues[moduleId][listenKey] &&
                        WidgetUtils.widgetDataTypeValues[moduleId][listenKey][
                            "Sub"
                        ] &&
                        WidgetUtils.widgetDataTypeValues[moduleId][listenKey][
                            "Sub"
                        ].length
                    ) {
                        let subs: Array<any> =
                            WidgetUtils.widgetDataTypeValues[moduleId][
                                listenKey
                            ]["Sub"];
                        WidgetUtils.widgetDataTypeValues[moduleId][listenKey][
                            "Sub"
                        ] = subs.filter((p) => p.srcWidgetId != srcWidgetId);
                    }
                }
            );
            if (
                WidgetUtils.widgetDataTypeValues[moduleId].renderFor &&
                WidgetUtils.widgetDataTypeValues[moduleId].renderFor.length
            ) {
                WidgetUtils.widgetDataTypeValues[moduleId].renderFor =
                    WidgetUtils.widgetDataTypeValues[moduleId].renderFor.filter(
                        (p) => p.srcWidgetId != srcWidgetId
                    );
            }
        }
    }

    /**
     * getWidgetStateKey
     * @param entityObj
     * @param keyArray
     */
    public getWidgetStateKey(entityObj, keyArrayString) {
        if (!keyArrayString) return;

        let stateKey = "";
        const rs = keyArrayString.split(",");
        if (rs.length > 0) {
            const entityObjKeys: Array<string> = Object.keys(entityObj);
            for (const key of rs) {
                const entityObjKey = entityObjKeys.filter(
                    (p) => p.toLowerCase() === key.toLowerCase()
                );
                if (entityObjKey.length > 0) {
                    let value = null;
                    if (entityObj[entityObjKey[0]]) {
                        value = entityObj[entityObjKey[0]];
                        stateKey += "_" + value;
                    }
                }
            }
        }
        return keyArrayString + stateKey;
    }

    /**
     * updateWidgetDataTypeValuesFromSelectedParkItem
     * @param parkedItem
     */
    public updateWidgetDataTypeValuesFromSelectedEntity(
        moduleId: string,
        entityObj,
        keyArray
    ) {
        if (!keyArray) return;
        const rs = keyArray.split(",");
        if (rs.length > 0) {
            const entityObjKeys: Array<string> = Object.keys(entityObj);
            for (const key of rs) {
                const entityObjKey = entityObjKeys.filter(
                    (p) => p.toLowerCase() === key.toLowerCase()
                );
                if (entityObjKey.length > 0) {
                    let value = null;
                    if (entityObj[entityObjKey[0]]) {
                        value = entityObj[entityObjKey[0]];
                    }
                    this.updateWidgetDataTypeValues(
                        moduleId,
                        upperFirst(key),
                        value,
                        WidgetKeyType.Main
                    );
                }
            }
        }

        WidgetUtils.widgetDataTypeValues[moduleId].renderFor = null;
    }

    /**
     * getWidgetKeyTypeFromWidgetDetail
     * @param widgetDetail
     */
    public getWidgetKeyTypeFromWidgetDetail(
        widgetDetail: WidgetDetail
    ): WidgetKeyType {
        if (widgetDetail.isMainArea) {
            return WidgetKeyType.Main;
        }
        return WidgetKeyType.Sub;
    }

    /**
     * isValidWidgetForRender
     */
    public isValidWidgetForRender(
        iWidgetTargetRender: IWidgetTargetRender,
        widgetDetail: WidgetDetail
    ) {
        let isValid = false;
        if (!widgetDetail.widgetDataType) {
            return isValid;
        }
        const listenKey = widgetDetail.widgetDataType.listenKey;
        if (iWidgetTargetRender.widgetKeyType === WidgetKeyType.Sub) {
            if (listenKey.sub) {
                listenKey.sub.forEach((item) => {
                    if (item.key === iWidgetTargetRender.key) {
                        if (widgetDetail.widgetDataType.parentWidgetIds) {
                            // Check if the same srcWidgetId
                            const rs =
                                widgetDetail.widgetDataType.parentWidgetIds.filter(
                                    (p) => p == iWidgetTargetRender.srcWidgetId
                                );
                            if (rs.length) {
                                isValid = true;
                            }
                            // If not the same srcWidgetId , then check in sync widget ids
                            else {
                                if (
                                    iWidgetTargetRender.syncWidgetIds &&
                                    iWidgetTargetRender.syncWidgetIds.length
                                ) {
                                    widgetDetail.widgetDataType.parentWidgetIds.forEach(
                                        (parentWidgetId) => {
                                            const ret =
                                                iWidgetTargetRender.syncWidgetIds.filter(
                                                    (p) => p == parentWidgetId
                                                );
                                            if (ret.length) {
                                                isValid = true;
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                });
            }
        } else if (iWidgetTargetRender.widgetKeyType === WidgetKeyType.Main) {
            if (
                listenKey.main &&
                listenKey.main.key === iWidgetTargetRender.key
            ) {
                isValid = true;
            }
        }
        return isValid;
    }

    /**
     * mapWidgetDetailFromWidgetTemplateSetting
     * @param widgetTemplateSettingModel
     */
    public mapWidgetDetailFromWidgetTemplateSetting(
        widgetTemplateSettingModel: WidgetTemplateSettingModel
    ): WidgetDetail {
        let widgetDetail = new WidgetDetail({
            idRepWidgetType: widgetTemplateSettingModel.idRepWidgetType,
            idRepWidgetApp: widgetTemplateSettingModel.idRepWidgetApp,
            request: widgetTemplateSettingModel.jsonString,
            updateRequest: widgetTemplateSettingModel.updateJsonString,
            widgetDataType: widgetTemplateSettingModel.widgetDataType
                ? JSON.parse(widgetTemplateSettingModel.widgetDataType)
                : null,
            isMainArea: widgetTemplateSettingModel.isMainArea,
        });
        return widgetDetail;
    }

    /**
     * getValueFromWidgetDataTypeValues
     * @param key
     * @param isMainArea
     */
    public getValueFromWidgetDataTypeValues(
        moduleId: string,
        key: string,
        isMainArea: boolean,
        srcWidgetId?: string
    ) {
        let value = "";
        if (
            WidgetUtils.widgetDataTypeValues[moduleId] &&
            WidgetUtils.widgetDataTypeValues[moduleId][key]
        ) {
            if (isMainArea) {
                value =
                    WidgetUtils.widgetDataTypeValues[moduleId][key][
                        WidgetKeyType[WidgetKeyType.Main]
                    ];
            } else {
                const subArray: Array<any> =
                    WidgetUtils.widgetDataTypeValues[moduleId][key][
                        WidgetKeyType[WidgetKeyType.Sub]
                    ];
                if (subArray && subArray.length) {
                    subArray.forEach((subObj) => {
                        if (subObj.srcWidgetId == srcWidgetId) {
                            value = subObj.value;
                        }
                    });
                }
            }
        }
        return value;
    }

    public getWidgetTitle(widgetDetail: WidgetDetail) {
        if (widgetDetail && widgetDetail.contentDetail) {
            if (widgetDetail.idRepWidgetType === WidgetType.FieldSet) {
                if (widgetDetail.contentDetail.data.length > 0) {
                    const widgetInfo = widgetDetail.contentDetail.data;
                    return widgetInfo[0][0].WidgetTitle;
                }
            } else {
                return widgetDetail.contentDetail.widgetTitle;
            }
        }
    }

    public getKeyValueListFromFieldSetWidget(widgetDetail: WidgetDetail) {
        const keyValue = {};
        if (widgetDetail && widgetDetail.contentDetail) {
            if (widgetDetail.contentDetail.data.length > 0) {
                const widgetInfo = widgetDetail.contentDetail.data;
                const contentList: Array<any> = widgetInfo[1];
                contentList.forEach((content) => {
                    keyValue[content.OriginalColumnName] = content.Value;
                });
            }
        }
        return keyValue;
    }

    public updateFieldSetWidgetDetail(
        keyValueObj: any,
        widgetDetail: WidgetDetail
    ) {
        const relatedWidgetDetail: WidgetDetail = widgetDetail;
        if (
            relatedWidgetDetail &&
            relatedWidgetDetail.contentDetail &&
            relatedWidgetDetail.contentDetail.data
        ) {
            if (relatedWidgetDetail.contentDetail.data.length > 0) {
                const widgetInfo = relatedWidgetDetail.contentDetail.data;
                const contentList: Array<any> = widgetInfo[1];
                const keys = Object.keys(keyValueObj);

                keys.forEach((key) => {
                    const rs = contentList.filter(
                        (c) => c.OriginalColumnName === key
                    );
                    // If find out, then update its value.
                    if (rs.length > 0) {
                        rs[0].Value = keyValueObj[key];
                    }
                });
            }
        }
    }

    public findRowIndexDataGridWidgetDetail(
        widgetDetail: WidgetDetail,
        listenKeyRequest: { [key: string]: any }
    ) {
        const relatedWidgetDetail: WidgetDetail = widgetDetail;
        let rowIndex = -1;
        if (relatedWidgetDetail && relatedWidgetDetail.contentDetail) {
            const collectionData = this.getCollectionData(relatedWidgetDetail);

            if (collectionData && collectionData.length) {
                const dataRowList: Array<any> = collectionData;
                for (let i = 0; i < dataRowList.length; i++) {
                    const dataRow = dataRowList[i];
                    const objTemp = JSON.parse(
                        JSON.stringify(dataRow).toLowerCase()
                    );
                    if (listenKeyRequest) {
                        let count = 0;
                        Object.keys(listenKeyRequest).forEach((key, index) => {
                            if (
                                objTemp[key.toLowerCase()] &&
                                objTemp[key.toLowerCase()] ===
                                    listenKeyRequest[key]
                            ) {
                                count += 1;
                            }
                        });
                        if (count === Object.keys(listenKeyRequest).length) {
                            rowIndex = i;
                            break;
                        }
                    }
                }
            }
        }
        return rowIndex;
    }

    getCollectionData(relatedWidgetDetail: WidgetDetail) {
        let collectionData: WidgetDetail[] = [];
        if (relatedWidgetDetail.idRepWidgetType === WidgetType.Combination) {
            for (
                let i = 0;
                i < relatedWidgetDetail.contentDetail.data.length;
                i++
            ) {
                for (
                    let j = 0;
                    j < relatedWidgetDetail.contentDetail.data[i].length;
                    j++
                ) {
                    if (
                        Object.keys(
                            relatedWidgetDetail.contentDetail.data[i][j]
                        ).findIndex((key) => {
                            return key === "collectionData";
                        }) !== -1
                    ) {
                        collectionData =
                            relatedWidgetDetail.contentDetail.data[i][j]
                                .collectionData;
                    }
                }
            }
        } else {
            collectionData = relatedWidgetDetail.contentDetail.collectionData;
        }

        return collectionData;
    }

    /**
     * Check if table widget
     * @param widgetDetail
     */
    public isTableWidgetDataType(widgetDetail: WidgetDetail) {
        let isTableWidget: boolean;
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.DataGrid:
            case WidgetType.EditableGrid:
            // case WidgetType.EditableTable:
            case WidgetType.GroupTable:
            case WidgetType.Combination:
            case WidgetType.EditableRoleTreeGrid:
                isTableWidget = true;
                break;
            case WidgetType.ReturnRefund:
                if (widgetDetail.idRepWidgetApp == 81) {
                    isTableWidget = true;
                    break;
                }
        }
        return isTableWidget;
    }

    /**
     * isFieldsetWidget
     * @param widgetDetail
     */
    public isFieldsetWidget(widgetDetail: WidgetDetail) {
        let isFieldsetWidget: boolean;
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.FieldSet:
            case WidgetType.FieldSetReadonly:
                isFieldsetWidget = true;
                break;
        }
        return isFieldsetWidget;
    }

    public updateCustomData(
        data: string,
        replaceData: any,
        isDataChanged: boolean
    ) {
        const replaceOriginalString = Uti.subStringFromToByString(
            data,
            ReplaceString.JsonText
        );
        if (!isDataChanged) {
            return data.replace(replaceOriginalString, "");
        }
        let replaceDataStr = JSON.stringify(replaceData);
        replaceDataStr = replaceDataStr.replace(/"/g, '\\\\\\"');
        let replaceString = Uti.removeAllString(
            replaceOriginalString,
            ReplaceString.JsonText
        );
        replaceString = replaceString.replace(
            ReplaceString.SubInputParameter,
            replaceDataStr
        );
        return data.replace(replaceOriginalString, replaceString);
    }

    public checkHasSubCollectionData(data: any) {
        try {
            // try to add fake property to object check object existing
            // data.contentDetail.data[2][0].collectionData.isCheckHasData = true;
            return (
                data.contentDetail.data[3] && data.contentDetail.data[3].length
            );
        } catch (ex) {
            return false;
        }
    }

    public getNumberValueFormObject(object: any): any {
        try {
            if (isNaN(parseFloat(object))) {
                return "";
            }
            return parseFloat(object);
        } catch (ex) {
            return "";
        }
    }

    public contextMenuInEditMode(
        contextMenuData,
        accessRight: any,
        widgetDetail?: WidgetDetail,
        widgetMenuStatusComponent?: XnWidgetMenuStatusComponent,
        conditions?: any
    ) {
        if (contextMenuData.length < 11) {
            return contextMenuData;
        }

        contextMenuData[0].hidden = true; // New parked Item
        contextMenuData[1].hidden = true; // Edit parked Item
        contextMenuData[2].hidden = true; // Clone parked Item
        contextMenuData[3].hidden = true; // Separator
        contextMenuData[4].hidden = true; // Edit widget
        contextMenuData[5].hidden =
            (conditions && !conditions.isShowSaveWidget) ||
            !accessRight.edit ||
            !accessRight.ToolbarButton; //Save widget
        contextMenuData[6].hidden =
            !(widgetDetail && this.isTableWidgetDataType(widgetDetail)) ||
            !accessRight.edit ||
            !accessRight.ToolbarButton; // Add Table Row
        contextMenuData[7].hidden =
            !(conditions && conditions.isShowUploadTemplate) ||
            !accessRight.edit; // Upload Template
        contextMenuData[8].hidden =
            !(conditions && conditions.isShowDeleteTemplate) ||
            !accessRight.edit; // Delete Template
        contextMenuData[9].hidden =
            (conditions && !conditions.isShowCancelSave) ||
            !accessRight.edit ||
            !accessRight.ToolbarButton; // Cancel Edit Widget
        contextMenuData[10].hidden =
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__TranslateButton; // Translate
        contextMenuData[11].hidden =
            !(widgetDetail && widgetDetail.idRepWidgetApp == 106) ||
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__TranslateButton; // Translate Fields
        contextMenuData[12].hidden =
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__PrintButton; // Print

        contextMenuData[0].disabled = false; // New parked Item
        contextMenuData[1].disabled = false; // Edit parked Item
        contextMenuData[2].disabled = false; // Clone parked Item
        contextMenuData[3].disabled = false; // New parked Item
        contextMenuData[4].disabled = false; // Edit widget
        contextMenuData[5].disabled = false; //Save widget
        contextMenuData[6].disabled = false; // Add Table Row
        contextMenuData[7].disabled = false; // Upload Template
        contextMenuData[8].disabled = false; // Delete Template
        contextMenuData[9].disabled = false; // Cancel Edit Widget
        contextMenuData[10].disabled = false; // Translate
        contextMenuData[11].disabled = false; // Translate Fields
        contextMenuData[12].disabled = false; // Print

        return contextMenuData;
    }

    public contextMenuInViewMode(
        contextMenuData: any,
        widgetType: any,
        accessRight: any,
        currentModule?: Module,
        toolbarSetting?: any,
        selectedTabHeader?: TabSummaryModel,
        activeSubModule?: Module,
        widgetToolbarSetting?: any,
        idRepWidgetApp?: any
    ) {
        if (contextMenuData.length < 11) {
            return contextMenuData;
        }

        let contextMenuText: any = {
            name: currentModule.moduleName,
            id: currentModule.moduleName,
        };
        contextMenuText = this.getTabIDFromWidgetToolbar(
            contextMenuText,
            idRepWidgetApp,
            widgetToolbarSetting
        );

        let newEntityMenuContextTitle =
            (currentModule.idSettingsGUI ==
            ModuleList.BusinessCosts.idSettingsGUI
                ? "Add "
                : "New ") + contextMenuText.name;
        let editEntityMenuContextTitle = "Edit " + contextMenuText.name;
        let cloneEntityMenuContextTitle = "Clone " + contextMenuText.name;
        if (
            !isEmpty(selectedTabHeader) &&
            !selectedTabHeader.tabSummaryInfor.isMainTab
        ) {
            newEntityMenuContextTitle =
                (currentModule.idSettingsGUI ==
                ModuleList.BusinessCosts.idSettingsGUI
                    ? "Add "
                    : "New ") + selectedTabHeader.tabSummaryInfor.tabName;
            editEntityMenuContextTitle =
                "Edit " + selectedTabHeader.tabSummaryInfor.tabName;
            cloneEntityMenuContextTitle =
                "Clone " + selectedTabHeader.tabSummaryInfor.tabName;
        } else if (
            !isEmpty(activeSubModule) &&
            activeSubModule.idSettingsGUIParent === MenuModuleId.administration
        ) {
            newEntityMenuContextTitle =
                (currentModule.idSettingsGUI ==
                ModuleList.BusinessCosts.idSettingsGUI
                    ? "Add "
                    : "New ") + contextMenuText.name;
            editEntityMenuContextTitle = "Edit " + contextMenuText.name;
            cloneEntityMenuContextTitle = "Clone " + contextMenuText.name;
        }

        contextMenuData[0].title = newEntityMenuContextTitle;
        contextMenuData[0].key =
            currentModule.idSettingsGUI ==
            ModuleList.BusinessCosts.idSettingsGUI
                ? "Add_Entity"
                : "New_Entity";
        contextMenuData[0].params = { value: contextMenuText.name };
        contextMenuData[1].title = editEntityMenuContextTitle;
        contextMenuData[1].key = "Edit_Entity";
        contextMenuData[1].params = { value: contextMenuText.name };
        contextMenuData[2].title = cloneEntityMenuContextTitle;
        contextMenuData[2].key = "Clone_Entity";
        contextMenuData[2].params = { value: contextMenuText.name };

        let isNewEntityHidden = false;
        let isEditEntityHidden = false;
        let isCloneEntityHidden = false;
        if (
            (currentModule &&
                this.excludeContextMenuModule.indexOf(
                    currentModule.idSettingsGUI
                ) !== -1) ||
            !toolbarSetting ||
            toolbarSetting.CanNew != 1
        ) {
            isNewEntityHidden = true;
        }

        if (
            (currentModule &&
                this.excludeContextMenuModule.indexOf(
                    currentModule.idSettingsGUI
                ) !== -1) ||
            !toolbarSetting ||
            toolbarSetting.CanEdit != 1
        ) {
            isEditEntityHidden = true;
        }

        if (
            (currentModule &&
                this.excludeContextMenuModule.indexOf(
                    currentModule.idSettingsGUI
                ) !== -1) ||
            !toolbarSetting ||
            toolbarSetting.CanClone != 1
        ) {
            isCloneEntityHidden = true;
        }

        // In readonly table widget don't show Edit menu
        contextMenuData[0].hidden =
            isNewEntityHidden || !accessRight.ParkedItem_New; // New parked Item
        contextMenuData[1].hidden =
            isEditEntityHidden || !accessRight.ParkedItem_Edit; // Edit parked Item
        contextMenuData[2].hidden = isCloneEntityHidden; // Clone parked Item
        contextMenuData[3].hidden =
            contextMenuData[0].hidden &&
            contextMenuData[1].hidden &&
            contextMenuData[2].hidden; // Separator
        contextMenuData[4].hidden =
            widgetType === 2 || !accessRight.edit || !accessRight.ToolbarButton; // Edit widget
        contextMenuData[5].hidden = true; // Save widget
        contextMenuData[6].hidden = true; // Add Table Row
        contextMenuData[7].hidden = true; // Upload Template
        contextMenuData[8].hidden = true; // Delete Template
        contextMenuData[9].hidden = true; // Cancel Edit Widget
        contextMenuData[10].hidden =
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__TranslateButton; // Translate
        contextMenuData[11].hidden =
            !(idRepWidgetApp == 106) ||
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__TranslateButton; // Translate Fields
        contextMenuData[12].hidden =
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__PrintButton; // Print

        contextMenuData[0].disabled = false; // New parked Item
        contextMenuData[1].disabled = false; // Edit parked Item
        contextMenuData[2].disabled = false; // Clone parked Item
        contextMenuData[3].disabled = false; // New parked Item
        contextMenuData[4].disabled = false; // Edit widget
        contextMenuData[5].disabled = true; // Save widget
        contextMenuData[6].disabled = true; // Add Table Row
        contextMenuData[7].disabled = true; // Upload Template
        contextMenuData[8].disabled = true; // Delete Template
        contextMenuData[9].disabled = true; // Cancel Edit Widget
        contextMenuData[10].disabled = false; // Translate
        contextMenuData[11].disabled = false; // Translate Fields
        contextMenuData[12].disabled = false; // Print

        return contextMenuData;
    }

    public rebuildContextMenuWhenChangeSimpleTab(
        contextMenuData: any[],
        simpleTab: SimpleTabModel,
        accessRight: any,
        currentModule?: Module
    ) {
        if (
            !simpleTab ||
            !simpleTab.Toolbar ||
            !contextMenuData ||
            !contextMenuData.length
        )
            return;

        let isNewEntityHidden = simpleTab.Toolbar.CanNew != 1;
        let isEditEntityHidden = simpleTab.Toolbar.CanEdit != 1;
        let isCloneEntityHidden = simpleTab.Toolbar.CanClone != 1;

        contextMenuData[0].hidden =
            isNewEntityHidden || !accessRight.ParkedItem_New; // New
        contextMenuData[0].title =
            (currentModule.idSettingsGUI ==
            ModuleList.BusinessCosts.idSettingsGUI
                ? "Add "
                : "New ") + simpleTab.TabName;
        contextMenuData[0].key =
            currentModule.idSettingsGUI ==
            ModuleList.BusinessCosts.idSettingsGUI
                ? "Add_Entity"
                : "New_Entity";
        contextMenuData[0].params = { value: simpleTab.TabName };

        contextMenuData[1].hidden =
            isEditEntityHidden || !accessRight.ParkedItem_Edit; // Edit Item
        contextMenuData[1].title = "Edit " + simpleTab.TabName;
        contextMenuData[1].key = "Edit_Entity";
        contextMenuData[1].params = { value: simpleTab.TabName };

        contextMenuData[2].hidden = isCloneEntityHidden; // Clone Item
        contextMenuData[2].title = "Clone " + simpleTab.TabName;
        contextMenuData[2].key = "Clone_Entity";
        contextMenuData[2].params = { value: simpleTab.TabName };

        contextMenuData[3].hidden =
            contextMenuData[0].hidden &&
            contextMenuData[1].hidden &&
            contextMenuData[2].hidden; // Separator
    }

    public contextMenuInTranslateMode(
        contextMenuData,
        widgetType: any,
        accessRight: any,
        idRepWidgetApp?: any
    ) {
        if (contextMenuData.length < 11) {
            return contextMenuData;
        }

        // In readonly table widget don't show Edit menu
        contextMenuData[0].hidden = true; // New parked Item
        contextMenuData[1].hidden = true; // Edit parked Item
        contextMenuData[2].hidden = true; // Clone parked Item
        contextMenuData[3].hidden = true; // Separator
        contextMenuData[4].hidden =
            widgetType === 2 || !accessRight.edit || !accessRight.ToolbarButton; // Edit widget
        contextMenuData[5].hidden =
            !accessRight.edit || !accessRight.ToolbarButton; // Save widget
        contextMenuData[6].hidden = true; // Add Table Row
        contextMenuData[7].hidden = true; // Upload Template
        contextMenuData[8].hidden = true; // Delete Template
        contextMenuData[9].hidden =
            !accessRight.edit || !accessRight.ToolbarButton; // Cancel Edit Widget
        contextMenuData[10].hidden = true; // Translate
        contextMenuData[11].hidden =
            !(idRepWidgetApp == 106) ||
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__TranslateButton; // Translate Fields
        contextMenuData[12].hidden =
            !accessRight.ToolbarButton ||
            !accessRight.ToolbarButton__PrintButton; // Print

        contextMenuData[0].disabled = false; // New parked Item
        contextMenuData[1].disabled = false; // Edit parked Item
        contextMenuData[2].disabled = false; // Clone parked Item
        contextMenuData[3].disabled = false; // New parked Item
        contextMenuData[4].disabled = true; // Edit widget
        contextMenuData[5].disabled = false; //Save widget
        contextMenuData[6].disabled = false; // Add Table Row
        contextMenuData[7].disabled = true; // Upload Template
        contextMenuData[8].disabled = true; // Delete Template
        contextMenuData[9].disabled = false; // Cancel Edit Widget
        contextMenuData[10].disabled = false; // Translate
        contextMenuData[11].disabled = false; // Translate Fields
        contextMenuData[12].disabled = false; // Print

        return contextMenuData;
    }

    public buildNewEditEntityTooltip(
        currentModule: Module,
        toolbarSetting: any,
        selectedTabHeader?: TabSummaryModel,
        activeSubModule?: Module
    ) {
        let newEntityTooltip =
            (currentModule.idSettingsGUI ==
            ModuleList.BusinessCosts.idSettingsGUI
                ? "Add "
                : "New ") + currentModule.moduleName;
        let editEntityTooltip = "Edit " + currentModule.moduleName;
        if (
            !isEmpty(selectedTabHeader) &&
            !selectedTabHeader.tabSummaryInfor.isMainTab
        ) {
            newEntityTooltip =
                (currentModule.idSettingsGUI ==
                ModuleList.BusinessCosts.idSettingsGUI
                    ? "Add "
                    : "New ") + selectedTabHeader.tabSummaryInfor.tabName;
            editEntityTooltip =
                "Edit " + selectedTabHeader.tabSummaryInfor.tabName;
        } else if (
            !isEmpty(activeSubModule) &&
            activeSubModule.idSettingsGUIParent === MenuModuleId.administration
        ) {
            newEntityTooltip =
                (currentModule.idSettingsGUI ==
                ModuleList.BusinessCosts.idSettingsGUI
                    ? "Add "
                    : "New ") + activeSubModule.moduleName;
            editEntityTooltip = "Edit " + activeSubModule.moduleName;
        }

        let isNewEntityHidden = false;
        let isEditEntityHidden = false;
        if (
            (currentModule &&
                this.excludeContextMenuModule.indexOf(
                    currentModule.idSettingsGUI
                ) !== -1) ||
            !toolbarSetting ||
            toolbarSetting.CanNew != 1
        ) {
            isNewEntityHidden = true;
        }
        if (
            (currentModule &&
                this.excludeContextMenuModule.indexOf(
                    currentModule.idSettingsGUI
                ) !== -1) ||
            !toolbarSetting ||
            toolbarSetting.CanEdit != 1
        ) {
            isEditEntityHidden = true;
        }

        return {
            newTooltip: newEntityTooltip,
            editTooltip: editEntityTooltip,
            showNew: !isNewEntityHidden,
            showEdit: !isEditEntityHidden,
        };
    }

    public replaceEditModeForTreeView(data: any) {
        if (data.idRepWidgetType === WidgetType.TreeView) {
            data.request = data.request.replace(
                "<<ModeParameter>>",
                '\\"Mode\\" : \\"\\"'
            );
        }
    }

    /**
     * sortWidgetDetails
     * @param widgetDetailPages
     */
    public sortWidgetDetails(
        widgetDetailPages: Array<WidgetDetailPage>
    ): Array<WidgetDetailPage> {
        // Filter to remove duplicate widget Id.
        widgetDetailPages = widgetDetailPages.filter((obj, pos, arr) => {
            return (
                arr
                    .map((mapObj) => mapObj["widgetDetail"]["id"])
                    .indexOf(obj["widgetDetail"]["id"]) === pos
            );
        });

        const sort_by = function (fields) {
            const n_fields = fields.length;

            return function (A, B) {
                let a, b, field, key, reverse, result;
                for (let i = 0, l = n_fields; i < l; i++) {
                    result = 0;
                    field = fields[i];

                    key = typeof field === "string" ? field : field.name;

                    a = A.config[key];
                    b = B.config[key];

                    if (typeof field.primer !== "undefined") {
                        a = field.primer(a);
                        b = field.primer(b);
                    }

                    reverse = field.reverse ? -1 : 1;

                    if (a < b) result = reverse * -1;
                    if (a > b) result = reverse * 1;
                    if (result !== 0) break;
                }
                return result;
            };
        };

        widgetDetailPages.forEach((item) => {
            delete item["sortStatus"];
        });

        widgetDetailPages = widgetDetailPages.sort(
            sort_by([
                {
                    name: "col",
                    primer: parseInt,
                    reverse: false,
                },
                {
                    name: "row",
                    primer: parseInt,
                    reverse: false,
                },
            ])
        );

        let rs = [];
        widgetDetailPages.forEach((widgetDetailPage) => {
            let item = this.getNextValidWidgetBox(widgetDetailPages);
            if (item) {
                rs.push(item);
            }
        });

        return rs;
    }

    public getNextValidWidgetBox(items: Array<{ config: NgGridItemConfig }>) {
        let target;
        for (let i = 0; i < items.length; i++) {
            if (!items[i]["sortStatus"]) {
                let itemSrc = items[i];
                let isValid = true;
                for (let j = 0; j < items.length; j++) {
                    if (i == j) {
                        continue;
                    }
                    let itemCpr = items[j];

                    let itemCprRowStart = itemCpr.config.row;
                    let itemCprColStart = itemCpr.config.col;
                    let itemCprRowEnd = itemCprRowStart + itemCpr.config.sizey;
                    let itemCprColEnd =
                        itemCpr.config.col + itemCpr.config.sizex;

                    let itemSrcRowStart = itemSrc.config.row;
                    let itemSrcColStart = itemSrc.config.col;
                    let itemSrcColEnd =
                        itemSrc.config.col + itemSrc.config.sizex;

                    // Check if upper widget has intersect
                    if (
                        itemCprRowEnd == itemSrcRowStart &&
                        ((itemSrcColStart <= itemCprColStart &&
                            itemSrcColEnd >= itemCprColStart) ||
                            (itemSrcColStart >= itemCprColStart &&
                                itemSrcColStart <= itemCprColEnd))
                    ) {
                        if (!itemCpr["sortStatus"]) {
                            isValid = false;
                        }
                        break;
                    }
                }
                if (isValid) {
                    itemSrc["sortStatus"] = true;
                    target = itemSrc;
                    break;
                }
            }
        }
        return target;
    }

    public mapProperty(
        property: any,
        widgetType?: number
    ): WidgetPropertyModel[] {
        if (
            widgetType === WidgetType.OrderDataEntry &&
            property &&
            property.properties &&
            property.properties.length > 0
        )
            return property;
        if (!property || !property.length) return;
        if (property[0].children) return property;
        const totalControl: WidgetPropertyModel[] = [];
        switch (widgetType) {
            case WidgetType.FieldSet:
            case WidgetType.FieldSetReadonly: {
                const widgetForm = JSON.parse(
                    DefaultWidgetItemConfiguration.WidgetForm
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(widgetForm, property)
                );
                break;
            }
            case WidgetType.DataGrid: {
                const widgetTable = JSON.parse(
                    DefaultWidgetItemConfiguration.WidgetTable
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(widgetTable, property)
                );
                break;
            }
            case WidgetType.EditableGrid: {
                const widgetEditTable = JSON.parse(
                    DefaultWidgetItemConfiguration.WidgetEditTable
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(widgetEditTable, property)
                );
                break;
            }
            case WidgetType.ToolFileTemplate:
            case WidgetType.FileTemplate:
            case WidgetType.Combination: {
                const combination = JSON.parse(
                    DefaultWidgetItemConfiguration.Combination
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(combination, property)
                );
                break;
            }
            case WidgetType.CombinationCreditCard: {
                const combinationCreditCard = JSON.parse(
                    DefaultWidgetItemConfiguration.CombinationCreditCard
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(combinationCreditCard, property)
                );
                break;
            }
            case WidgetType.SynchronizeElasticsSearch: {
                const synchronizeElasticsSearch = JSON.parse(
                    DefaultWidgetItemConfiguration.SynchronizeElasticsSearch
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(
                        synchronizeElasticsSearch,
                        property
                    )
                );
                break;
            }
            case WidgetType.Chart: {
                const chart = JSON.parse(DefaultWidgetItemConfiguration.Chart);
                totalControl.push(Uti.adjustPropertyCommon(chart, property));
                break;
            }
            case WidgetType.PdfViewer: {
                const pdfViewer = JSON.parse(
                    DefaultWidgetItemConfiguration.PdfViewer
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(pdfViewer, property)
                );
                break;
            }
            case WidgetType.SAVSendLetter: {
                const pdfViewer = JSON.parse(
                    DefaultWidgetItemConfiguration.SAVSendLetter
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(pdfViewer, property)
                );
                break;
            }
            case WidgetType.Upload:
            case WidgetType.TreeView:
            case WidgetType.FileExplorer:
            case WidgetType.FieldSetReadonly:
            case WidgetType.Country: {
                const CountryAndUploadTreeView = JSON.parse(
                    DefaultWidgetItemConfiguration.CountryAndUploadTreeView
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(CountryAndUploadTreeView, property)
                );
                break;
            }
            case WidgetType.OrderDataEntry: {
                const orderDataEntry = JSON.parse(
                    DefaultWidgetItemConfiguration.OrderDataEntry
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(orderDataEntry, property)
                );
                break;
            }
            case WidgetType.EditableRoleTreeGrid: {
                const editableRoleTreeGrid = JSON.parse(
                    DefaultWidgetItemConfiguration.EditableRoleTreeGrid
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(editableRoleTreeGrid, property)
                );
                break;
            }
            case WidgetType.Doublette: {
                const doublette = JSON.parse(
                    DefaultWidgetItemConfiguration.Doublette
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(doublette, property)
                );
                break;
            }
            case WidgetType.FileExplorerWithLabel: {
                const fileExplorerWithLabel = JSON.parse(
                    DefaultWidgetItemConfiguration.FileExplorerWithLabel
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(fileExplorerWithLabel, property)
                );
                break;
            }
            case WidgetType.ReturnRefund: {
                const returnRefund = JSON.parse(
                    DefaultWidgetItemConfiguration.ReturnRefund
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(returnRefund, property)
                );
                break;
            }
            case WidgetType.TableWithFilter: {
                const tableWithFilter = JSON.parse(
                    DefaultWidgetItemConfiguration.TableWithFilter
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(tableWithFilter, property)
                );
                break;
            }
            case WidgetType.GroupTable:
            case WidgetType.CustomerHistory:
            case WidgetType.Translation: {
                const widgetTable = JSON.parse(
                    DefaultWidgetItemConfiguration.Translation
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(widgetTable, property)
                );
                break;
            }

            case WidgetType.NoteForm: {
                const noteFormProperties = JSON.parse(
                    DefaultWidgetItemConfiguration.NoteForm
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(noteFormProperties, property)
                );
                break;
            }

            default:
                const blankWidget = JSON.parse(
                    DefaultWidgetItemConfiguration.BlankWidget
                );
                totalControl.push(
                    Uti.adjustPropertyCommon(blankWidget, property)
                );
                break;
        }
        return [].concat.apply([], totalControl);
    }

    /**
     * buildPageSettingData
     * @param rawData
     */
    public buildPageSettingData(rawData: Array<any>): PageSetting {
        let pageSetting: PageSetting;
        const pageSettingIndex = 0;
        const widgetSettingIndex = 1;

        if (!rawData) {
            return;
        }

        // Page Setting Data only has 1 item, so get first item.
        const pageSettingData = rawData[pageSettingIndex][0];

        // Widgets have the list of config
        const widgetSettingDataArray: Array<any> = rawData[widgetSettingIndex];

        pageSetting = new PageSetting({
            idSettingsPage: pageSettingData.IdSettingsPage,
            objectNr: pageSettingData.ObjectNr,
            jsonSettings: pageSettingData.JsonSettings,
            widgets: [],
        });

        const widgets: Array<WidgetDetailPage> = [];

        widgetSettingDataArray.forEach((widgetSettingData) => {
            const idRepWidgetApp = toSafeInteger(
                widgetSettingData.IdRepWidgetApp
            );
            const widgetType = toSafeInteger(widgetSettingData.WidgetType);
            if (idRepWidgetApp && widgetType) {
                const widgetConfig = JSON.parse(widgetSettingData.JsonSettings);
                const widgetDetailPage: WidgetDetailPage = new WidgetDetailPage(
                    {
                        widgetDetail: widgetConfig.widgetDetail,
                        defaultValue: widgetConfig.defaultValue,
                        description: widgetConfig.description,
                        filterData: widgetConfig.filterData,
                        properties: this.mapProperty(
                            widgetConfig.properties,
                            widgetType
                        ),
                        columnsLayoutSettings:
                            widgetConfig.columnsLayoutSettings || {
                                settings: "",
                            },
                        config: widgetConfig.config,
                    }
                );

                widgetDetailPage.widgetDetail = Object.assign(
                    widgetDetailPage.widgetDetail,
                    {
                        idSettingsWidget: widgetSettingData.IdSettingsWidget,
                        idRepWidgetApp: idRepWidgetApp,
                        idRepWidgetType: widgetType,
                        title: widgetSettingData.WidgetName,
                    }
                );

                widgets.push(widgetDetailPage);
            }
        });
        pageSetting.widgets = widgets;
        return pageSetting;
    }

    /**
     * buildListenKeyConfigForWidgetDetail
     * @param srcWidgetDetail
     * @param isMain
     */
    public buildListenKeyConfigForWidgetDetail(
        srcWidgetDetail: WidgetDetail,
        isMain: boolean
    ) {
        if (isMain) {
            srcWidgetDetail.widgetDataType.listenKey.sub = null;
            srcWidgetDetail.widgetDataType.listenKey.main = {
                key: srcWidgetDetail.widgetDataType.listenKey.key,
                filterKey:
                    srcWidgetDetail.widgetDataType.filterKey ||
                    srcWidgetDetail.widgetDataType.listenKey.key,
            };
        } else {
            srcWidgetDetail.widgetDataType.listenKey.main = null;
            srcWidgetDetail.widgetDataType.listenKey.sub = [];
            const listenKey = srcWidgetDetail.widgetDataType.listenKey.key;
            const listenKeyArr = listenKey.split(",");
            const filterKey = srcWidgetDetail.widgetDataType.filterKey;
            const filterKeyArr = filterKey.split(",");
            listenKeyArr.forEach((lsKey: string, index: number) => {
                // If there is not any filterKey in config, then we get listenKey as default filter Key.
                const filterKeyVal = filterKeyArr[index]
                    ? filterKeyArr[index]
                    : lsKey;
                srcWidgetDetail.widgetDataType.listenKey.sub.push({
                    key: lsKey,
                    filterKey: filterKeyVal,
                });
            });
        }
    }

    /**
     * getWidgetDetailKeyForObservable
     * @param widgetDetail
     * @param moduleName
     */
    public getWidgetDetailKeyForObservable(
        widgetDetail: WidgetDetail,
        moduleName: string
    ) {
        let key = "";
        try {
            let filterParam =
                widgetDetail.widgetDataType.listenKeyRequest(moduleName);
            key =
                widgetDetail.idRepWidgetApp +
                "_" +
                widgetDetail.idRepWidgetType +
                "_" +
                JSON.stringify(filterParam);
        } catch {}
        return key;
    }

    /**
     * isReloadForParentAfterUpdating
     * @param widgetDetail
     */
    public isReloadForParentAfterUpdating(widgetDetail: WidgetDetail) {
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.FieldSet:
            case WidgetType.FieldSetReadonly:
            case WidgetType.Combination:
            case WidgetType.CombinationCreditCard:
                return true;
            case WidgetType.EditableGrid:
                return (
                    widgetDetail.idRepWidgetApp ==
                    RepWidgetAppIdEnum.CountryCustomerDoublette
                );
        }
        return false;
    }

    /**
     * isIgnoreDetachWidget
     * @param widgetDetail
     */
    public isIgnoreDetachWidget(widgetDetail: WidgetDetail) {
        let isIgnore: boolean = false;
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.Doublette:
            case WidgetType.ReturnRefund:
            case WidgetType.SAVLetter:
            case WidgetType.SAVSendLetter:
                isIgnore = true;
                break;

            // This is ignore for Block Orders grid when the ButtonAndCheckbox column is visible
            // case WidgetType.DataGrid:
            //     isIgnore = (widgetDetail.idRepWidgetApp == RepWidgetAppIdEnum.BlockOder);
            //     break;
        }
        return isIgnore;
    }

    /**
     * isSupportLinkWidget
     * @param widgetDetail
     */
    public isSupportLinkWidget(widgetDetail: WidgetDetail) {
        let supportLink = true;
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.Translation:
                supportLink = false;
                break;
        }
        return supportLink;
    }

    /**
     * isSameTypeWidgetCanSync
     * Check if widget with the same type can be synced.
     */
    public isSameTypeWidgetCanSync(widgetType) {
        let allowSync: boolean;
        switch (widgetType) {
            case WidgetType.DataGrid:
            case WidgetType.EditableGrid:
            // case WidgetType.EditableTable:
            case WidgetType.TableWithFilter:
                allowSync = true;
                break;
        }
        return allowSync;
    }

    /**
     * isGroupTable
     * @param widgetDetail
     */
    public isGroupTable(widgetDetail: WidgetDetail) {
        let isGroup = false;
        if (widgetDetail && widgetDetail.contentDetail) {
            const data = widgetDetail.contentDetail;
            if (
                data.columnSettings &&
                Object.keys(data.columnSettings).length
            ) {
                const ret = Object.keys(data.columnSettings).filter((key) => {
                    const columnSetting = data.columnSettings[key];
                    if (
                        columnSetting["Setting"] &&
                        columnSetting["Setting"] instanceof Array &&
                        columnSetting["Setting"].length
                    ) {
                        const settingArr: Array<any> = columnSetting[
                            "Setting"
                        ] as Array<any>;
                        const rs = settingArr.filter((s) => {
                            return (
                                s["DisplayField"] &&
                                s["DisplayField"]["IsGrouped"] == "1"
                            );
                        });
                        return rs.length;
                    }
                    return false;
                });
                isGroup = ret.length ? true : false;
            }
        }
        return isGroup;
    }

    /**
     * getTranslatedTitle
     * @param widgetDetail
     */
    public getTranslatedTitle(widgetDetail: WidgetDetail) {
        let title = "";
        if (widgetDetail && widgetDetail.idRepWidgetType) {
            if (this.isFieldsetWidget(widgetDetail)) {
                const item = widgetDetail.contentDetail;
                if (item && item.data && item.data[0]) {
                    title = item.data[0][0].WidgetTitle;
                }
            } else {
                // Do Later
            }
        }
        return title;
    }

    public getTabIDFromWidgetToolbar(
        currentName: any,
        idRepWidgetApp,
        widgetToolbar: any[]
    ) {
        if (!widgetToolbar || !widgetToolbar.length) {
            return currentName;
        }

        for (let i = 0; i < widgetToolbar.length; i++) {
            for (let j = 0; j < widgetToolbar[i]["Widgets"].length; j++) {
                if (
                    widgetToolbar[i]["Widgets"][j].IdRepWidgetApp ==
                        idRepWidgetApp &&
                    !isNil(widgetToolbar[i]["Widgets"][j].TabInfo)
                ) {
                    currentName.name =
                        widgetToolbar[i]["Widgets"][j].TabInfo.TabName;
                    currentName.id =
                        widgetToolbar[i]["Widgets"][j].TabInfo.TabID;
                    return currentName;
                }
            }
        }

        return currentName;
    }

    /**
     * isValidWidgetToConnectOfChild
     * From child widget then find parent widgets that can be communicated
     * @param childWidgetDetail
     * @param parentWidgetDetail
     */
    public isValidWidgetToConnectOfChild(
        childWidgetDetail: WidgetDetail,
        parentWidgetDetail: WidgetDetail
    ) {
        let isValid = false;
        do {
            if (
                !childWidgetDetail.widgetDataType ||
                !parentWidgetDetail.widgetDataType
            ) {
                break;
            }
            if (!childWidgetDetail.widgetDataType.listenKey) {
                break;
            }
            if (
                childWidgetDetail.idRepWidgetApp ==
                    parentWidgetDetail.idRepWidgetApp &&
                childWidgetDetail.idRepWidgetType ==
                    parentWidgetDetail.idRepWidgetType
            ) {
                break;
            }
            const key = childWidgetDetail.widgetDataType.listenKey.key;

            if (!parentWidgetDetail.widgetDataType.primaryKey) {
                break;
            }

            const keyArr = key.split(",");
            const primaryKeys =
                parentWidgetDetail.widgetDataType.primaryKey.split(",");

            let count = 0;

            keyArr.forEach((key: string) => {
                for (let primaryKey of primaryKeys) {
                    if (key == primaryKey) {
                        count += 1;
                    }
                }
            });

            if (count == keyArr.length) {
                isValid = true;
            }

            break;
        } while (true);
        return isValid;
    }

    /**
     * isValidWidgetToConnectOfParent
     * From parent widget then find children widgets that can be communicated
     * @param parentWidgetDetail : parent widget
     * @param childWidgetDetail : child widget
     **/
    public isValidWidgetToConnectOfParent(
        parentWidgetDetail: WidgetDetail | LightWidgetDetail,
        childWidgetDetail: WidgetDetail | LightWidgetDetail
    ) {
        let isValid = false;
        do {
            if (
                !parentWidgetDetail.widgetDataType ||
                !childWidgetDetail.widgetDataType
            ) {
                break;
            }
            if (!parentWidgetDetail.widgetDataType.primaryKey) {
                break;
            }
            if (!childWidgetDetail.widgetDataType.listenKey) {
                break;
            }
            if (
                parentWidgetDetail.idRepWidgetType ==
                    childWidgetDetail.idRepWidgetType &&
                parentWidgetDetail.idRepWidgetApp ==
                    childWidgetDetail.idRepWidgetApp
            ) {
                break;
            }

            const key = childWidgetDetail.widgetDataType.listenKey.key;
            const keyArr = key.split(",");
            const primaryKeys =
                parentWidgetDetail.widgetDataType.primaryKey.split(",");

            let count = 0;

            keyArr.forEach((key: string) => {
                for (let primaryKey of primaryKeys) {
                    if (key == primaryKey) {
                        count += 1;
                    }
                }
            });

            if (count == keyArr.length) {
                isValid = true;
            }

            break;
        } while (true);
        return isValid;
    }

    /**
     * isValidChartWidgetToConnectTable or PdfViewer
     * @param srcWidgetDetail
     * @param value
     */
    public isValidChartWidgetToConnectTable(
        srcWidgetDetail: WidgetDetail,
        value: WidgetDetail
    ) {
        let isValid = false;
        do {
            if (
                srcWidgetDetail.idRepWidgetType == WidgetType.Chart ||
                srcWidgetDetail.idRepWidgetType == WidgetType.PdfViewer
            ) {
                if (
                    value.idRepWidgetType === WidgetType.DataGrid ||
                    value.idRepWidgetType === WidgetType.EditableGrid ||
                    value.idRepWidgetType === WidgetType.SAVLetter
                ) {
                    isValid = true;
                }
            }
            break;
        } while (true);
        return isValid;
    }
    /**
     * isValidTableWidgetToConnect
     * Check if the same table and same type widget to connect
     * @param srcWidgetDetail
     * @param data
     */
    public isValidTableWidgetToConnect(
        srcWidgetDetail: WidgetDetail,
        data: WidgetDetail
    ) {
        let isValid = false;
        do {
            if (srcWidgetDetail.id == data.id) {
                break;
            }
            const allowSrcSync = this.isSameTypeWidgetCanSync(
                srcWidgetDetail.idRepWidgetType
            );
            if (!allowSrcSync) {
                break;
            }

            const allowDestSync = this.isSameTypeWidgetCanSync(
                data.idRepWidgetType
            );
            if (!allowDestSync) {
                break;
            }

            if (srcWidgetDetail.idRepWidgetApp == data.idRepWidgetApp) {
                isValid = true;
            }
            break;
        } while (true);
        return isValid;
    }

    /**
     * isValidWidgetToConnect
     * @param srcWidgetDetail
     * @param targetWidgetDetail
     */
    public isValidWidgetToConnect(
        srcWidgetDetail: WidgetDetail,
        targetWidgetDetail: WidgetDetail
    ) {
        let connected: boolean;
        let mode = "child->parent";
        let isValid = this.isValidWidgetToConnectOfChild(
            srcWidgetDetail,
            targetWidgetDetail
        );
        if (!isValid) {
            mode = "parent->child";
            isValid = this.isValidWidgetToConnectOfParent(
                srcWidgetDetail,
                targetWidgetDetail
            );
        }
        if (!isValid) {
            mode = "same-widget";
            isValid = this.isValidTableWidgetToConnect(
                srcWidgetDetail,
                targetWidgetDetail
            );
        }
        if (!isValid) {
            mode = "chart-table";
            isValid = this.isValidChartWidgetToConnectTable(
                srcWidgetDetail,
                targetWidgetDetail
            );
        }
        let child, parent;
        switch (mode) {
            case "child->parent":
                child = srcWidgetDetail;
                parent = targetWidgetDetail;
                if (child.widgetDataType.parentWidgetIds) {
                    const iRet = child.widgetDataType.parentWidgetIds.find(
                        (p) => p == parent.id
                    );
                    if (iRet) {
                        connected = true;
                    }
                }
                break;
            case "parent->child":
                parent = srcWidgetDetail;
                child = targetWidgetDetail;
                if (child.widgetDataType.parentWidgetIds) {
                    const iRet = child.widgetDataType.parentWidgetIds.find(
                        (p) => p == parent.id
                    );
                    if (iRet) {
                        connected = true;
                    }
                }
                break;
            case "same-widget":
                if (srcWidgetDetail.syncWidgetIds) {
                    const iRet = srcWidgetDetail.syncWidgetIds.find(
                        (p) => p == targetWidgetDetail.id
                    );
                    if (iRet) {
                        connected = true;
                    }
                }
                break;
            case "chart-table":
                if (srcWidgetDetail.syncWidgetIds) {
                    const iRet = srcWidgetDetail.syncWidgetIds.find(
                        (p) => p == targetWidgetDetail.id
                    );
                    if (iRet) {
                        connected = true;
                    }
                }
                break;
        }
        return {
            isValid,
            connected,
            mode,
        };
    }

    public buildReadonlyGridFormColumns(columnSettings, columns) {
        for (let key in columnSettings) {
            if (columnSettings.hasOwnProperty(key)) {
                let columnSettingValue = columnSettings[key];

                if (
                    columnSettingValue["DataType"] === "bit" &&
                    isEmpty(columnSettingValue["Setting"])
                ) {
                    columnSettingValue["Setting"] = [
                        { ControlType: { Type: "Checkbox" } },
                    ];
                }

                if (typeof columnSettingValue["Setting"] !== "string") {
                    columnSettingValue["Setting"] = JSON.stringify(
                        columnSettingValue["Setting"]
                    );
                }

                columns.push(columnSettingValue);
            }
        }

        return columns;
    }

    public buildReadonlyGridFormColumnsValue(collectionData, columns) {
        for (let i = 0; i < columns.length; i++) {
            for (let j = 0; j < collectionData.length; j++) {
                let collectionDataColumnValue =
                    collectionData[j][columns[i]["ColumnName"]];
                if (!isNil(collectionDataColumnValue)) {
                    if (collectionDataColumnValue.getFullYear) {
                        collectionDataColumnValue = format(
                            collectionDataColumnValue,
                            "dd.MM.yyyy"
                        );
                    } else if (
                        typeof collectionDataColumnValue === "object" &&
                        isEmpty(collectionDataColumnValue)
                    ) {
                        collectionDataColumnValue = "";
                    } else if (typeof collectionDataColumnValue === "string") {
                        let jsonData = Uti.tryParseJson(
                            collectionDataColumnValue
                        );
                        if (
                            typeof jsonData === "object" &&
                            !isEmpty(jsonData)
                        ) {
                            collectionDataColumnValue = jsonData["value"];
                        }
                    }

                    columns[i]["Value"] = collectionDataColumnValue;
                }
            }
        }

        return columns;
    }

    /**
     * Check if Template widget
     * @param widgetDetail
     */
    public isTemplateWidget(widgetDetail: WidgetDetail | LightWidgetDetail) {
        let isTemplate: boolean = false;
        switch (widgetDetail.idRepWidgetApp) {
            case RepWidgetAppIdEnum.MailingParameters:
            case RepWidgetAppIdEnum.ProductParameter:
            case RepWidgetAppIdEnum.GlobalParameter:
            case RepWidgetAppIdEnum.PostShippingCosts:
            case RepWidgetAppIdEnum.PrinterControl:
                isTemplate = true;
                break;
        }
        return isTemplate;
    }

    /**
     * Find widget detail by id in all containers
     * @param layoutPageInfo
     */
    public getWidgetDetailById(layoutPageInfo: Array<LayoutPageInfoModel>, id) {
        let widgetDetail = null;
        let iFound = false;
        if (layoutPageInfo && layoutPageInfo.length) {
            for (let i = 0; i < layoutPageInfo.length; i++) {
                if (
                    layoutPageInfo[i].widgetboxesTitle &&
                    layoutPageInfo[i].widgetboxesTitle.length
                ) {
                    for (
                        let j = 0;
                        j < layoutPageInfo[i].widgetboxesTitle.length;
                        j++
                    ) {
                        const widgetBox = layoutPageInfo[i].widgetboxesTitle[j];
                        if (id == widgetBox.widgetDetail.id) {
                            widgetDetail = widgetBox.widgetDetail;
                            iFound = true;
                            break;
                        }
                    }
                    if (iFound) {
                        break;
                    }
                }
            }
        }
        return widgetDetail;
    }
}
