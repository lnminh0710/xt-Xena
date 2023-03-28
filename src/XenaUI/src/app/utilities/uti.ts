import { Injectable } from "@angular/core";
import { SerializationHelper } from "./serializationHelper";
import { UserAuthentication } from "app/models/user-auth";
import { User } from "app/models/user";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isNil from "lodash-es/isNil";
import camelCase from "lodash-es/camelCase";
import { FormGroup, Validators } from "@angular/forms";
import {
    ControlGridModel,
    Module,
    RawFieldEntity,
    FieldEntity,
    StyleFormatFieldEntity,
    ApiResultResponse,
    BrowserInfoModel,
} from "app/models";
import {
    ComboBoxTypeConstant,
    Configuration,
    ApiMethodResultId,
    UploadFileMode,
    ServiceUrl,
    RepWidgetAppIdEnum,
    LocalSettingKey,
} from "app/app.constants";
import { Subscription } from "rxjs/Subscription";
import { FormControl } from "@angular/forms";
import { parse, format } from "date-fns/esm";
import {
    de,
    it,
    frCH,
    fr,
    es,
    pt,
    nl,
    enUS,
    ja,
    vi,
} from "date-fns/esm/locale";
import { LocalStorageHelper } from "./localstorage.helper";
import { SessionStorageProvider } from "./infra";

const locales = { de, it, frCH, fr, es, pt, nl, enUS, ja, vi };

@Injectable()
export class Uti {
    static dontShowSuccessMessage: boolean = false;
    static isFieldMenuClicked: boolean = false;
    protected consts: Configuration;
    static _consts: Configuration = new Configuration();
    static _serviceUrl: ServiceUrl = new ServiceUrl();
    constructor() {
        this.consts = Uti._consts;
    }

    //#region Login
    public checkLogin() {
        return this.getUserCached(this.consts.localStorageCurrentUser);
    }

    public checkLoginWithExpire() {
        return this.getUserCached(this.consts.localStorageCurrentUserExpire);
    }

    public getUserInfo(): User {
        return this.getUserLoginInfo(this.consts.localStorageCurrentUser);
    }

    public getUserExpireInfo(): User {
        return this.getUserLoginInfo(this.consts.localStorageCurrentUserExpire);
    }

    public static executeFunctionWithTimeout(
        callBack: Function,
        condition: Function,
        waitUntilTo?: number
    ) {
        const counterName = this.guid();
        const timeoutName = this.guid();
        this[counterName] = 0;
        this[timeoutName] = null;
        this._executeFunctionWithTimeout(
            callBack,
            condition,
            counterName,
            timeoutName,
            waitUntilTo
        );
    }

    private static _executeFunctionWithTimeout(
        callBack: Function,
        condition: Function,
        counterName: string,
        timeoutName: string,
        waitUntilTo?: number
    ) {
        if (this[counterName] > (waitUntilTo ? waitUntilTo : 1000)) return;

        this[timeoutName] = setTimeout(() => {
            clearTimeout(this[timeoutName]);
            this[timeoutName] = null;
            if (!condition()) {
                this[counterName]++;
                this._executeFunctionWithTimeout(
                    callBack,
                    condition,
                    counterName,
                    timeoutName,
                    waitUntilTo
                );
                return;
            }
            callBack();
            this[counterName] = 0;
        });
    }

    public getUserLoginInfo(type: string): User {
        const accessToken = this.getAccessToken(type);
        if (!accessToken || !accessToken.access_token) {
            return new User({
                loginMessage: accessToken.message,
            });
        }
        const userFullInfo = this.parseJwt(accessToken.access_token);
        if (!userFullInfo || !userFullInfo.appinfo) {
            return new User({
                loginMessage: accessToken.message,
            });
        }
        const userDrapInfo = JSON.parse(userFullInfo.appinfo);
        if (userDrapInfo && userDrapInfo.LoginName) {
            this.storeLastUserPicture(userDrapInfo);
            return new User({
                id: userDrapInfo.IdLogin,
                loginName: userDrapInfo.LoginName || "",
                fullName: userDrapInfo.FullName || "",
                email: userDrapInfo.Email || "",
                preferredLang: userDrapInfo.Language || null,
                loginPicture: userDrapInfo.LoginPicture || "",
                lastLoginDate: accessToken.login_date,
                loginMessage: accessToken.message,
                nickName: userDrapInfo.NickName,
            });
        }
        return new User();
    }

    private getUserCached(type: string) {
        return localStorage.getItem(type);
    }
    public getAccessToken(type: string): UserAuthentication {
        const currentUserJson = this.getUserCached(type);
        return SerializationHelper.toInstance(
            new UserAuthentication(),
            currentUserJson
        );
    }
    private parseJwt(token: string) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    }

    private urlBase64Decode(str: string) {
        var output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += "==";
                break;
            }
            case 3: {
                output += "=";
                break;
            }
            default: {
                return null;
            }
        }
        return decodeURIComponent(encodeURI(window.atob(output)));
    }

    private storeLastUserPicture(userInfo: any) {
        localStorage.setItem(
            this.consts.localStorageLastUserPicture,
            userInfo && userInfo.LoginPicture ? userInfo.LoginPicture : ""
        );
    }

    // store user details and jwt token in local storage to keep user logged in between page refreshes
    public storeUserAuthentication(
        userAuthentication: UserAuthentication
    ): void {
        if (
            userAuthentication &&
            userAuthentication.access_token &&
            userAuthentication.expires_in
        ) {
            userAuthentication.login_date = new Date();
            localStorage.setItem(
                this.consts.localStorageCurrentUser,
                JSON.stringify(userAuthentication)
            );
            localStorage.setItem(
                this.consts.localStorageAccessToken,
                userAuthentication.access_token
            );
            localStorage.setItem(
                this.consts.localStorageRefreshToken,
                userAuthentication.refresh_token
            );
            localStorage.setItem(
                this.consts.localStorageExpiresIn,
                userAuthentication.expires_in
            );
        }
    }

    public decodeAccessToken() {
        const token = localStorage.getItem(this.consts.localStorageAccessToken);
        var parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }

        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    }

    // store user details and jwt token in local storage to keep user logged in between page refreshes
    public storeDefaultRole(defaultRoleId: any): void {
        if (defaultRoleId && defaultRoleId != "null")
            localStorage.setItem(
                this.consts.localStorageDefaultRole,
                defaultRoleId
            );
    }
    public getDefaultRole(): any {
        let defaultRoleId =
            localStorage.getItem(this.consts.localStorageDefaultRole) || "";
        if (
            isNil(defaultRoleId) ||
            defaultRoleId == "null" ||
            defaultRoleId == ""
        ) {
            //fix for null
            defaultRoleId = "-1";
            localStorage.setItem(
                this.consts.localStorageDefaultRole,
                defaultRoleId
            );
        }
        return defaultRoleId + "";
    }
    //#endregion

    //#region Form
    public resetValueForForm(formGroup: FormGroup) {
        Uti.resetFormValue(formGroup);
    }

    public static resetValueForForm(
        formGroup: FormGroup,
        keepFormValue?: Array<string>,
        keepFormExtValue?: Array<string>
    ) {
        if (!formGroup || !formGroup.controls) {
            return;
        }
        const keepFormValueObj = this.keepFormValue(formGroup, keepFormValue);
        const keepFormExtValueObj = this.keepFormValue(
            formGroup,
            keepFormExtValue,
            true
        );
        this.resetFormValue(formGroup);
        try {
            formGroup.reset();
        } catch (ex) {}
        this.manualResetForm(formGroup);
        formGroup.markAsPristine();
        formGroup.markAsUntouched();
        this.reUpdateFormValueAfterReset(formGroup, keepFormValueObj);
        this.reUpdateFormValueAfterReset(formGroup, keepFormExtValueObj, true);
        this.keepIsActiveIsTrue(formGroup);
    }

    // Need properties name of values object are same with form controls name
    public static setValueForForm(formGroup: FormGroup, values: any) {
        for (let controlName in values) {
            if (!formGroup.controls[controlName]) continue;

            if (formGroup.controls[controlName] instanceof FormGroup) {
                this.setValueForForm(
                    <FormGroup>formGroup.controls[controlName],
                    values[controlName]
                );
                continue;
            }

            formGroup.controls[controlName].setValue(values[controlName]);
        }
    }

    // Need properties name of values object are same with form controls name, with data is straight object that doesn't contain child object
    public static setValueForFormWithStraightObject(
        formGroup: FormGroup,
        values: any,
        formatCondition?: any
    ) {
        for (let controlName in values) {
            if (formGroup.controls[controlName]) {
                formGroup.controls[controlName].setValue(
                    this.getRigthValueForFormControl(
                        controlName,
                        values[controlName],
                        formatCondition
                    )
                );
            } else {
                for (let controlChildName in formGroup.controls) {
                    if (
                        formGroup.controls[controlChildName] instanceof
                        FormGroup
                    ) {
                        this.setValueForFormWithStraightObject(
                            <FormGroup>formGroup.controls[controlChildName],
                            JSON.parse(
                                this.getMapRigthValue(
                                    controlName,
                                    values[controlName]
                                )
                            ),
                            formatCondition
                        );
                    }
                }
            }
        }
    }

    private static getMapRigthValue(name: string, value: any): string {
        if (value === undefined) {
            return '{"' + name + '": undefined}';
        }
        if (typeof value === "number") {
            return '{"' + name + '": ' + value + "}";
        }
        if (typeof value === "string") {
            return '{"' + name + '": "' + value + '"}';
        }
        // if typeof is 'object' will update later, don't need now
        return '{"' + name + '": null}';
    }

    private static getRigthValueForFormControl(
        name: string,
        value: any,
        formatCondition?: any
    ): any {
        if (!formatCondition || !formatCondition[name]) return value;
        switch (formatCondition[name]) {
            case "datetime":
                return value
                    ? parse(
                          value,
                          formatCondition["dateFormatString"],
                          new Date()
                      )
                    : null;
            case "boolean":
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return false;
                }
        }
    }

    private static keepIsActiveIsTrue(formGroup: FormGroup): boolean {
        if (formGroup.controls["isActive"] !== undefined) {
            formGroup.controls["isActive"].setValue(true);
            return true;
        }
        for (const item in formGroup.controls) {
            if (formGroup.controls[item] instanceof FormGroup) {
                if (
                    this.keepIsActiveIsTrue(<FormGroup>formGroup.controls[item])
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private static keepFormValue(
        formGroup: FormGroup,
        keepValue?: Array<string>,
        isExt?: boolean
    ): any {
        if (!formGroup.value || !keepValue || !keepValue.length) return null;
        let keepFormValueObj = {};
        for (const item of keepValue) {
            keepFormValueObj[item] = isExt
                ? formGroup[item]
                : formGroup.value[item];
        }
        return keepFormValueObj;
    }

    private static reUpdateFormValueAfterReset(
        formGroup: FormGroup,
        keepValue?: any,
        isExt?: boolean
    ) {
        if (!keepValue || isEmpty(keepValue)) return;
        for (const item in keepValue) {
            if (isExt) {
                formGroup[item] = keepValue[item];
            } else {
                if (!formGroup.controls[item]) continue;
                formGroup.controls[item].setValue(keepValue[item]);
            }
        }
    }

    private static manualResetForm(formGroup: any) {
        for (const controlName in formGroup.controls) {
            if (
                typeof formGroup.controls[controlName]["controls"] === "object"
            ) {
                this.manualResetForm(formGroup.controls[controlName]);
            } else {
                if (formGroup.controls[controlName]["xnControlType"]) {
                    switch (formGroup.controls[controlName]["xnControlType"]) {
                        case "number":
                        case "dropdown":
                        case "datetime": {
                            formGroup.controls[controlName].setValue("");
                            break;
                        }
                        case "multiple": {
                            formGroup.controls[controlName].setValue([]);
                            setTimeout(() => {
                                formGroup.controls[
                                    controlName
                                ].markAsPristine();
                            });
                        }
                    }
                } else {
                    formGroup.controls[controlName].setValue(null);
                }
            }
        }
    }

    static registerFormControlType(formGroup: FormGroup, controlList: any) {
        for (const property in controlList) {
            if (!controlList[property]) continue;
            const controlNames = controlList[property].split(";");
            if (!controlNames.length) continue;
            for (const controlName of controlNames) {
                if (!controlName) continue;
                formGroup.controls[controlName]["xnControlType"] = property;
            }
        }
    }

    private static resetFormValue(formGroup: FormGroup) {
        this.setValueForFormControl(formGroup, "submitted", false);
        this.setValueForFormControl(formGroup, "leftCharacters", 500);
        this.setValueForFormControl(formGroup, "countryCheckListData", {});
    }

    private static setValueForFormControl(
        formGroup: FormGroup,
        control: string,
        data: any
    ) {
        if (formGroup[control]) {
            formGroup[control] = data;
        }
    }

    public static setNullValueForBooleanWhenFalse(formGroup: FormGroup) {
        if (!formGroup.controls) return;
        for (let item in formGroup.controls) {
            if (formGroup.controls[item].value === false)
                formGroup.controls[item].setValue(null);
        }
    }

    public static setValueForMultipleFormControl(
        formGroup: FormGroup,
        controls: Array<string>,
        value: any
    ) {
        if (!controls.length) return;
        for (let item of controls) {
            this.setValueForFormControl(formGroup, item, value);
        }
    }

    public static setValueForArray(
        arr: Array<any>,
        itemName: string,
        value: any,
        childrenName?: string
    ) {
        if (!arr || !arr.length) return;
        for (let item of arr) {
            if (!item) continue;
            item[itemName] = value;
            this.setValueForArray(
                item[childrenName ? childrenName : "children"],
                itemName,
                value,
                childrenName
            );
        }
    }

    public static setEnableForMultipleFormControl(
        formGroup: FormGroup,
        controls: Array<string>,
        enable: boolean
    ) {
        if (!controls.length) return;
        for (let item of controls) {
            if (enable) {
                formGroup.controls[item].enable();
            } else {
                formGroup.controls[item].disable();
            }
        }
    }

    public static setRequireForFormControl(
        formGroup: FormGroup,
        controlName: string
    ) {
        this.setValidateForFormControl(formGroup, controlName, "required");
    }

    public static setValidateForFormControl(
        formGroup: FormGroup,
        controlName: string,
        validate: string
    ) {
        if (
            !formGroup.controls[controlName] ||
            formGroup.value[controlName] ||
            formGroup.controls[controlName].hasError(validate)
        )
            return;
        formGroup.controls[controlName].setValidators(
            CustomValidators[validate]
        );
        formGroup.controls[controlName].setErrors(
            JSON.parse('{"' + validate + '": true }')
        );
    }

    public static clearRequireForFormControl(
        formGroup: FormGroup,
        controlName: string
    ) {
        if (!formGroup.controls[controlName]) return;
        formGroup.controls[controlName].clearValidators();
        formGroup.controls[controlName].setErrors(null);
    }

    private static buildOriginalFormKey(formValues: any) {
        const orgFormValues: any = {};
        const keys = Object.keys(formValues);
        for (const key of keys) {
            const vals = key.split("_");
            let orgKey: string = vals[0];
            if (vals.length > 0) {
                orgKey = vals[1];
            }
            orgFormValues[orgKey] = formValues[key];
        }
        return orgFormValues;
    }

    public static getUpdateKeyValue(
        formValues: any,
        listenKeyRequest: { [key: string]: any }
    ) {
        const orgFormValues = this.buildOriginalFormKey(formValues);
        const key = Object.keys(listenKeyRequest)[0];
        return orgFormValues[key];
    }

    public getDefaultMainTabId(activeModule: Module): string {
        return activeModule.idSettingsGUI == 4
            ? "T1"
            : this.consts.defaultMainTabId;
    }

    public getDefaultMainTabName(activeModule: Module): string {
        return activeModule.idSettingsGUI == 4
            ? "T1"
            : this.consts.defaultMainTabName;
    }

    /**
     * styleFormatFieldsetData
     * @param rawData
     */
    static styleFormatFieldsetData(rawData: Array<any>) {
        let rawDataArray: Array<RawFieldEntity> = [];
        rawData.forEach((item) => {
            rawDataArray.push(new RawFieldEntity(item));
        });
        let fieldEntities: Array<StyleFormatFieldEntity> = [];
        rawDataArray.forEach((rawItem) => {
            const field: StyleFormatFieldEntity =
                rawItem.toStyleFormatFieldEntity();
            fieldEntities.push(field);
        });
        return fieldEntities;
    }

    /**
     * formatFieldsetData
     * @param rawData
     */
    static formatFieldsetData(rawData: Array<any>) {
        let rawDataArray: Array<RawFieldEntity> = [];
        rawData.forEach((item) => {
            rawDataArray.push(new RawFieldEntity(item));
        });
        let fieldEntities: Array<FieldEntity> = [];
        rawDataArray.forEach((rawItem) => {
            const field: FieldEntity = rawItem.toFieldEntity();
            fieldEntities.push(field);
        });
        return fieldEntities;
    }

    static popupMaximize(popupComponent: any, size: any): any {
        if (popupComponent) {
            size.preDialogW =
                popupComponent.containerViewChild.nativeElement.style.width;
            size.preDialogH =
                popupComponent.containerViewChild.nativeElement.style.height;
            size.preDialogLeft =
                popupComponent.containerViewChild.nativeElement.style.left;
            size.preDialogTop =
                popupComponent.containerViewChild.nativeElement.style.top;

            popupComponent.containerViewChild.nativeElement.style.width =
                $(document).width() + "px";
            popupComponent.containerViewChild.nativeElement.style.height =
                $(document).height() + "px";
            popupComponent.containerViewChild.nativeElement.style.top = "0px";
            popupComponent.containerViewChild.nativeElement.style.left = "0px";
        }
        return (
            this._consts.popupResizeClassName +
            "  " +
            this._consts.popupFullViewClassName
        );
    }

    static popuprestore(popupComponent: any, size: any): any {
        if (popupComponent) {
            popupComponent.containerViewChild.nativeElement.style.width =
                size.preDialogW;
            popupComponent.containerViewChild.nativeElement.style.height =
                size.preDialogH;
            popupComponent.containerViewChild.nativeElement.style.top =
                size.preDialogTop;
            popupComponent.containerViewChild.nativeElement.style.left =
                size.preDialogLeft;
        }
        return this._consts.popupResizeClassName;
    }

    static popupMinimize(popupComponent: any, size: any): any {
        if (popupComponent) {
            size.preDialogW =
                popupComponent.containerViewChild.nativeElement.style.width;
            size.preDialogH =
                popupComponent.containerViewChild.nativeElement.style.height;
            size.preDialogLeft =
                popupComponent.containerViewChild.nativeElement.style.left;
            size.preDialogTop =
                popupComponent.containerViewChild.nativeElement.style.top;

            popupComponent.containerViewChild.nativeElement.style.height = 0;
            $(".ui-dialog-footer").hide();
        }
        return this._consts.popupResizeClassName;
    }

    static popupRestoreMinimize(popupComponent: any, size: any): any {
        if (popupComponent) {
            popupComponent.containerViewChild.nativeElement.style.height =
                size.preDialogH;
            $(".ui-dialog-footer").show();
        }
        return this._consts.popupResizeClassName;
    }

    static setValidatorForForm(formGroup: FormGroup, mandatoryData: any) {
        if (!mandatoryData || !formGroup) {
            mandatoryData = {};
            return;
        }

        for (const item in mandatoryData) {
            if (mandatoryData[item] && formGroup.controls[item]) {
                formGroup.controls[item].setValidators(
                    formGroup.controls[item]["isTextBox"]
                        ? CustomValidators.required
                        : Validators.required
                );
                formGroup.controls[item].setErrors({ required: true });
                formGroup.controls[item]["isRequired"] = true;
                formGroup.controls[item].updateValueAndValidity();
            }
        }
    }

    static setValidatorRegularExpresionForForm(
        formGroup: FormGroup,
        regularExpressionData: any
    ) {
        if (!regularExpressionData || !formGroup) {
            regularExpressionData = {};
            return;
        }

        for (const item in regularExpressionData) {
            if (regularExpressionData[item] && formGroup.controls[item]) {
                formGroup.controls[item].setValidators(
                    CustomValidators.regularExpression
                );
                formGroup.controls[item]["regularExpression"] =
                    regularExpressionData[item]["regularExpression"];
                formGroup.controls[item]["regularExpressionMessage"] =
                    regularExpressionData[item]["message"];
                formGroup.controls[item].updateValueAndValidity();
            }
        }
    }

    static setIsTextBoxForFormControl(
        formGroup: FormGroup,
        textboxControls: Array<string>
    ) {
        if (!textboxControls || !textboxControls.length) return;
        for (let item of textboxControls) {
            formGroup.controls[item]["isTextBox"] = true;
        }
    }

    static hasMandatoryData(response: any) {
        return (
            this.isResquestSuccess(response) &&
            response.item.data &&
            response.item.data.length &&
            response.item.data[0].length &&
            response.item.data[0][0] &&
            response.item.data[0][0]["GetMandatoryField"]
        );
    }

    static getMandatoryData(response: any) {
        try {
            if (this.hasMandatoryData(response)) {
                let data = this.tryParseJson(
                    response.item.data[0][0]["GetMandatoryField"]
                );
                return data["MandatoryParameter"];
            }
        } catch (ex) {
            return null;
        }
    }

    static getRegularExpressionData(response: any) {
        try {
            let result = {};
            for (const item in response) {
                if (!response[item] || !response[item]["setting"]) continue;
                const setting = this.parseSetting(response[item]["setting"]);
                if (!this.hasReg(setting)) continue;
                result[item] = {};
                result[item]["regularExpression"] =
                    setting[0].Validation.RegularExpression.Reg;
                result[item]["message"] =
                    setting[0].Validation.RegularExpression.Message;
            }
            return result;
        } catch (ex) {
            return null;
        }
    }

    private static parseSetting(str: string) {
        try {
            return JSON.parse(str);
        } catch (ex) {
            return [];
        }
    }

    private static hasReg(obj: any) {
        try {
            return !!obj[0].Validation.RegularExpression.Reg;
        } catch (ex) {
            return false;
        }
    }

    static hasChanges(changes) {
        return (
            changes &&
            changes.hasOwnProperty("currentValue") &&
            changes.hasOwnProperty("previousValue")
        );
    }
    //#endregion

    //#region Gird
    static mapGirdDataToView(
        gridData: any,
        comboboxData: any,
        columnName: string
    ) {
        for (const item of gridData) {
            item[columnName] = this.mapGridDataValueToText(
                comboboxData,
                item[columnName]
            );
        }
    }
    static mapGirdDataToSave(
        gridData: any,
        comboboxData: any,
        columnName: string
    ) {
        const result = cloneDeep(gridData);
        for (const item of result) {
            item[columnName] = this.mapGridDataTextToValue(
                comboboxData,
                item[columnName]
            );
        }
        return result;
    }
    static mapGridDataValueToText(comboboxData: any, idValue: string): string {
        const comboboxItems = comboboxData.filter((x) => x.idValue === idValue);
        if (comboboxItems.length <= 0) {
            return "";
        }
        return comboboxItems[0].textValue;
    }
    static mapGridDataTextToValue(comboboxData: any, text: string): string {
        const comboboxItems = comboboxData.filter((x) => x.textValue === text);
        if (comboboxItems.length <= 0) {
            return "";
        }
        return comboboxItems[0].idValue;
    }

    static cloneDataForGridItems(
        controlGridModel: ControlGridModel
    ): ControlGridModel {
        let temp = cloneDeep(controlGridModel);
        controlGridModel = null;
        controlGridModel = {
            data: cloneDeep(temp.data),
            columns: temp.columns,
        };
        temp = null;
        return controlGridModel;
    }

    static mergeWijmoGridData(dataSourceTable, wijmoGridData) {
        if (!dataSourceTable || !wijmoGridData) {
            return dataSourceTable;
        }
        const _dataSourceTable = cloneDeep(dataSourceTable);

        if (wijmoGridData.itemsAdded.length) {
            _dataSourceTable.data = (
                _dataSourceTable.data as Array<any>
            ).filter(
                (item) =>
                    !isNil(item.DT_RowId) &&
                    item.DT_RowId.indexOf("newrow_") < 0
            );
            for (let i = 0; i < wijmoGridData.itemsAdded.length; i++) {
                const addedItem = cloneDeep(wijmoGridData.itemsAdded[i]);
                addedItem["isNew"] = true;
                _dataSourceTable.data.push(addedItem);
            }
        }

        if (wijmoGridData.itemsRemoved.length) {
            for (let i = 0; i < wijmoGridData.itemsRemoved.length; i++) {
                const _item = cloneDeep(wijmoGridData.itemsRemoved[i]);
                _item["isDeleted"] = true;
                // _dataSourceTable.data.push(_item);
            }
        }

        if (wijmoGridData.itemsEdited.length) {
            for (let i = 0; i < _dataSourceTable.data.length; i++) {
                for (let j = 0; j < wijmoGridData.itemsEdited.length; j++) {
                    if (
                        !isNil(wijmoGridData.itemsEdited[j]["DT_RowId"]) &&
                        wijmoGridData.itemsEdited[j]["DT_RowId"].indexOf(
                            "newrow_"
                        ) < 0 &&
                        !_dataSourceTable.data[i]["isNew"] &&
                        !_dataSourceTable.data[i]["isDeleted"] &&
                        wijmoGridData.itemsEdited[j]["DT_RowId"] ==
                            _dataSourceTable.data[i]["DT_RowId"]
                    ) {
                        _dataSourceTable.data[i] = this.mergeComboboxData(
                            _dataSourceTable.data[i],
                            wijmoGridData.itemsEdited[j]
                        );
                        _dataSourceTable.data[i]["isEdited"] = true;
                    }
                }
            }
        }

        return _dataSourceTable;
    }

    static mergeWijmoGridDataAll(dataSourceTable, wijmoGridData) {
        const _dataSourceTable = cloneDeep(dataSourceTable);

        if (wijmoGridData.items && wijmoGridData.items.length) {
            for (let i = 0; i < wijmoGridData.items.length; i++) {
                _dataSourceTable.data.push(cloneDeep(wijmoGridData.items[i]));
            }
        }

        return _dataSourceTable;
    }

    static rebuildColumnHeaderForGrid(grid: any, transferTranslate: any) {
        if (
            !grid ||
            !grid.columns ||
            !grid.columns.length ||
            !transferTranslate ||
            !transferTranslate.length
        )
            return;
        for (let col of grid.columns) {
            col["title"] =
                Uti.getTranslateTitle(transferTranslate, col["data"]) ||
                col["title"];
        }
    }

    static getItemsExistItems(
        itemMaster: any,
        itemCondition: any,
        columnName: string
    ): any {
        return itemMaster.filter(
            (x) => !!itemCondition.find((y) => y[columnName] == x[columnName])
        );
    }
    static getItemsDontExistItems(
        itemMaster: any,
        itemCondition: any,
        columnName: string
    ): any {
        return itemMaster.filter(
            (x) => !itemCondition.find((y) => y[columnName] == x[columnName])
        );
    }

    static getItemByPropertyInTree(
        treeData: any,
        propName: string,
        value: any
    ): any {
        if (!treeData || !treeData.length) return null;
        for (let item of treeData) {
            if (item[propName] == value) {
                return item;
            }
            let treeItem = this.getItemByPropertyInTree(
                item.children,
                propName,
                value
            );
            if (treeItem && treeItem[propName]) return treeItem;
        }
        return null;
    }

    /**
     *   Use widget form when design layout
     * @param settingProperties
     */
    static filterValueInProperties(settingProperties) {
        return (
            settingProperties &&
            settingProperties.children
                .map((v) => {
                    if (
                        v.value ||
                        (typeof v.value === "boolean" && v.value === false)
                    ) {
                        return { [v.id]: v.value };
                    }
                })
                .filter(Boolean)
        );
    }

    /**
     * Use in widget form
     * adjust property have value to map into general property
     * @param general
     * @param item
     */
    static adjustPropertyForPanelSetting(general, item) {
        return general.children.map((value) => {
            for (let index in item) {
                if (
                    value.id === Object.keys(item[index])[0] &&
                    item.hasOwnProperty(index)
                ) {
                    value.value = item[index][value.id];
                }
            }
            return value;
        });
    }

    /**
     * Function common adjust property have value to map into general property
     * @param general
     * @param item
     */
    static adjustPropertyCommon(general, item) {
        if (!item || !item.length) return;
        for (let i = 0; i < general.length; i++) {
            this.handleTemplate(general[i], item);
            if (general[i].children) {
                this.adjustPropertyCommon(general[i].children, item);
            }
        }
        return general;
    }

    static handleTemplate(element, item) {
        for (let i = 0; i < item.length; i++) {
            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "DisplayField"
            ) {
                element.options = item[i][element.id];
                return;
            }

            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "ShowDropDownOfField"
            ) {
                element.options = item[i][element.id];
                return;
            }
            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "PdfColumn"
            ) {
                element.options = item[i][element.id];
                element.value = item[i].value;
                return;
            }
            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "Display"
            ) {
                element.value = item[i][element.id];
                return;
            }
            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "SAVListenKey"
            ) {
                element.options = item[i][element.id];
                element.value = item[i].value;
                return;
            }
            if (
                Object.keys(item[i])[0] === element.id &&
                Object.keys(item[i])[0] === "WidgetBackgroundStyleGradientColor"
            ) {
                element.options = item[i][element.id];
                element.value = item[i].valueGradient;
                element.typeGradient = item[i].typeGradient;
                element.directionGradient = item[i].directionGradient;
                return;
            }
            if (Object.keys(item[i])[0] === element.id) {
                element.value = item[i][element.id];
            }
        }
    }
    /* End function common */

    /**
     * adjust property before save
     * @param settingProperties
     */
    static filterValueWhenSaveWidget(settingProperties) {
        if (!settingProperties || !settingProperties.length) return;
        const total = [];
        for (let i = 0; i < settingProperties.length; i++) {
            this.panelPropertyRecursive(settingProperties[i].children, total);
        }
        return total;
    }

    static panelPropertyRecursive(properties, total) {
        for (let i = 0; i < properties.length; i++) {
            if (properties[i].id === "DisplayField") {
                total.push({ [properties[i].id]: properties[i].options });
            }

            if (properties[i].id === "ShowDropDownOfField") {
                total.push({ [properties[i].id]: properties[i].options });
            }
            if (properties[i].id === "PdfColumn") {
                total.push({
                    [properties[i].id]: properties[i].options,
                    value: properties[i].value,
                });
            }

            if (properties[i].id === "SAVListenKey") {
                total.push({
                    [properties[i].id]: properties[i].options,
                    value: properties[i].value,
                });
            }
            if (
                properties[i].id === "WidgetBackgroundStyleGradientColor" &&
                properties[i].options &&
                properties[i].options.length > 0
            ) {
                total.push({
                    [properties[i].id]: properties[i].options,
                    valueGradient: properties[i].value,
                    typeGradient: properties[i].typeGradient,
                    directionGradient: properties[i].directionGradient,
                });
            }
            if (
                (properties[i].id !== "WidgetBackgroundStyleGradientColor" &&
                    properties[i].value) ||
                (typeof properties[i].value === "boolean" &&
                    properties[i].value === false)
            ) {
                total.push({ [properties[i].id]: properties[i].value });
            }
            if (properties[i].children) {
                this.panelPropertyRecursive(properties[i].children, total);
            }
        }
    }
    /* end function recursive to adjust property before save */

    static getItemRecursive(itemList, value, keyName = "id") {
        if (!itemList || !itemList.length) return;
        for (let i = 0; i < itemList.length; i++) {
            if (itemList[i][keyName] === value) {
                return itemList[i];
            }
            const found = this.getItemRecursive(
                itemList[i].children,
                value,
                keyName
            );
            if (found) return found;
        }
    }

    static getValueFromPropertyCombobox(propety) {
        try {
            for (let item of propety.options) {
                if (item["key"] != propety.value) continue;
                return item;
            }
            return {};
        } catch (e) {
            return {};
        }
    }

    static makeDeleteGridData(gridData: any, columnName: string): Array<any> {
        if (!gridData || !gridData.length) return [];
        const deleteData = gridData.filter((x) => x.deleted || x.IsDeleted);
        if (!deleteData || !deleteData.length) return [];
        return Uti.mapDeleteData(deleteData, columnName);
    }

    static makeDeleteData(
        item1: any,
        item2: any,
        columnName: string
    ): Array<any> {
        const deleteData = Uti.getItemsDontExistItems(item1, item2, columnName);
        if (!deleteData || !deleteData.length) {
            return [];
        }
        return Uti.mapDeleteData(deleteData, columnName);
    }

    static mapDeleteData(mapData: Array<any>, columnName: string): Array<any> {
        const result: Array<any> = [];
        if (!mapData || !mapData.length) {
            return result;
        }
        for (const item of mapData) {
            const strObj =
                `{"IsDeleted":1,"` + columnName + `":` + item[columnName] + `}`;
            const jsonObj = JSON.parse(strObj);
            result.push(jsonObj);
        }
        return result;
    }

    static makeGridColumnsWithDeleteColumn(gridColumn: Array<any>): Array<any> {
        return gridColumn;
    }

    static makeWidgetDataToFormData(
        widgetData: Array<any>,
        setValue: any
    ): any {
        try {
            if (!widgetData || !widgetData.length) return {};
            let result = {};
            let originalColumnName = "";
            for (let item of widgetData) {
                originalColumnName = this.lowerCaseFirstLetter(
                    this.getColumnNameFromDatabaseColumnName(
                        item["OriginalColumnName"]
                    )
                );
                result[originalColumnName] = {
                    displayValue: item["ColumnName"],
                    originalComlumnName: originalColumnName,
                    value: item["Value"],
                };
                for (let value in setValue) {
                    if (value == originalColumnName) {
                        result[originalColumnName]["value"] = setValue[value];
                        break;
                    }
                }
            }
            return result;
        } catch (e) {
            return {};
        }
    }

    static makeParkedItemObjectFromStraightObject(
        straightObject: any,
        idName: string
    ): any {
        try {
            let result: any = {};
            for (let item in straightObject) {
                result[item] = {
                    displayValue: this.upperCaseFirstLetter(item),
                    originalComlumnName: this.upperCaseFirstLetter(item),
                    value: straightObject[item],
                };
            }
            if (idName) {
                result["id"] = {
                    displayValue: this.upperCaseFirstLetter(idName),
                    originalComlumnName: this.upperCaseFirstLetter(idName),
                    value: straightObject[idName],
                };
            }
            return result;
        } catch (e) {
            return {};
        }
    }

    // The column name like "B00Article_UpdateDate" we want to result is "UpdateDate"
    private static getColumnNameFromDatabaseColumnName(
        databaseColName: string
    ): string {
        if (isEmpty(databaseColName)) return "";
        let arr = databaseColName.split("_");
        if (arr.length === 1) {
            return databaseColName;
        }
        return arr[1];
    }
    //#endregion

    //#region DataTable

    static convertDataFromEditableToSource(
        dataTable: Array<any>,
        dataSource: Array<any>
    ): any {
        dataSource = dataSource || [];
        const temData = [];
        dataTable.forEach((row, index) => {
            let newRow = {};
            if (dataSource[index]) {
                Object.assign(newRow, dataSource[index]);
            } else {
                newRow = dataSource[0] ? cloneDeep<any>(dataSource[0]) : {};
            }
            const keys = Object.keys(row);
            keys.forEach((key) => {
                if (key.toLowerCase() === "isdeleted") {
                    newRow["IsDeleted"] = true;
                } else if (
                    key.toLowerCase() === "isedited" ||
                    key.toLowerCase() === "isnewrow"
                ) {
                    newRow["isEdited"] = true;
                } else if (key.toLowerCase() === "isnew") {
                    newRow["isNew"] = true;
                } else {
                    newRow[key] = row[key];
                }
            });
            temData.push(newRow);
        });
        return temData;
    }

    static updateDataSource(
        updateData: Array<any>,
        dataSource: Array<any>
    ): any {
        updateData.forEach((row, index) => {
            let newRow = {};
            let isDeleted = false;
            if (dataSource[index]) {
                Object.assign(newRow, dataSource[index]);
            } else {
                newRow = cloneDeep<any>(dataSource[0]);
            }
            const keys = Object.keys(row);
            keys.forEach((key) => {
                if (newRow[key]) {
                    newRow[key] = row[key];
                }
                if (key.toLowerCase() === "isdeleted") {
                    isDeleted = true;
                }
            });

            if (dataSource.length > index) {
                // delete the row if it was deleted
                if (isDeleted) {
                    delete dataSource[index];
                } else {
                    dataSource[index] = newRow;
                }
            } else if (!isDeleted) {
                // do not add if the row was deleted
                dataSource.push(newRow);
            }
        });
        return dataSource;
    }

    static updateFormComboboxValue(
        formMain: FormGroup,
        comboData: any,
        formGroup: FormGroup,
        formControlValue: string,
        formValue: string
    ) {
        return formGroup.controls[formControlValue].valueChanges
            .debounceTime(this._consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                if (formGroup.controls[formControlValue].dirty) {
                    setTimeout(() => {
                        if (
                            !comboData ||
                            !formGroup.controls[formControlValue] ||
                            isNil(formGroup.controls[formControlValue].value) ||
                            !formGroup.controls[formControlValue].value.length
                        ) {
                            return;
                        }

                        const filterItem = comboData.find(
                            (x) =>
                                x.idValue ===
                                formGroup.controls[formControlValue].value
                        );
                        if (filterItem) {
                            formGroup.controls[formValue].setValue(
                                filterItem.textValue
                            );
                            formMain.updateValueAndValidity();
                        }
                    });
                }
            });
    }

    static IGNOR_KEYS = [
        "DT_RowId",
        "deleted",
        "mediaCodeButton",
        "isReadOnlyColumn",
    ];
    static mapDataSourceToDataUpdateByColumnSetting(
        dataSource: any,
        additonalKey?: string,
        additonalValue?: string,
        selectedTemplate?: any,
        widgetDetail?: any
    ): any {
        const colData = [];
        dataSource.collectionData.forEach((item) => {
            if (
                item["DT_RowId"] &&
                item["DT_RowId"].indexOf("newrow") !== -1 &&
                item["deleted"] == true
            ) {
                return;
            }
            const keys = Object.keys(item);
            const dataItem = {};

            let isCustomerDoubletteWidget: boolean;
            if (widgetDetail) {
                isCustomerDoubletteWidget =
                    widgetDetail.idRepWidgetApp ==
                        RepWidgetAppIdEnum.CustomerDoublette ||
                    widgetDetail.idRepWidgetApp ==
                        RepWidgetAppIdEnum.CountryCustomerDoublette;
            }

            let isAddToUpdateList =
                isCustomerDoubletteWidget ||
                (selectedTemplate && !selectedTemplate.editing)
                    ? true
                    : false;

            keys.forEach((key) => {
                if (this.IGNOR_KEYS.indexOf(key) > -1) {
                    return;
                }

                if (selectedTemplate && selectedTemplate.editing) {
                    dataItem["IsSetAsDefault"] = 1;
                    dataItem["DefaultName"] = selectedTemplate.textValue;
                    if (selectedTemplate.idValue != -1) {
                        dataItem["IdRepSalesCampaignAddOnTemplate"] =
                            selectedTemplate.idValue;
                    }
                } else if (dataItem["IdRepSalesCampaignAddOnTemplate"]) {
                    dataItem["IdRepSalesCampaignAddOnTemplate"] = null;
                }

                // if (key.toLowerCase() === 'isedited' || key.toLowerCase() === 'isnew') {
                if (this.isAddOrUpdateRow(key, dataItem, widgetDetail)) {
                    isAddToUpdateList = true;
                } else if (key.toLowerCase() === "isdeleted") {
                    dataItem["IsDeleted"] = 1;
                    isAddToUpdateList = true;
                } else {
                    if (dataSource.columnSettings[key]) {
                        let columnName =
                            dataSource.columnSettings[
                                key
                            ].OriginalColumnName.split("_");
                        columnName = columnName[columnName.length - 1];

                        const setting =
                            dataSource.columnSettings[key].Setting[0];
                        if (
                            isNil(setting) ||
                            isNil(setting.DisplayField) ||
                            isNil(setting.DisplayField.Hidden) ||
                            (!isNil(item[key]) &&
                                item[key].toString().length > 0)
                        ) {
                            dataItem[columnName] = item[key];
                        }

                        if (additonalKey && additonalValue) {
                            dataItem[additonalKey] = additonalValue;
                        }
                    }
                }
            });
            if (isAddToUpdateList) {
                colData.push(dataItem);
            }
        });
        return colData;
    }

    private static isAddOrUpdateRow(
        key: string,
        dataItem: any,
        widgetDetail?: any
    ): boolean {
        if (key.toLowerCase() === "isedited" || key.toLowerCase() === "isnew") {
            return true;
        }
        if (!widgetDetail || !dataItem) {
            return false;
        }

        // This is define special for Customer Doublette widget
        // Always return the master row for updating.
        //return (widgetDetail.idRepWidgetApp == RepWidgetAppIdEnum.CustomerDoublette && dataItem['IsMatchMaster']);
    }

    public getTableRowByWidgetId(rowsData: any, widgetId) {
        for (let i = 0; i < rowsData.length; i++) {
            const widget = rowsData[i];
            if (!widget) continue;
            if (widget.widgetDetailId == widgetId) {
                return widget.rowData;
            }
        }

        return null;
    }
    //#endregion

    //#region Array
    static getCloumnSettings(settingArray: Array<any>): any {
        const setting = {};
        for (let i = 0; i < settingArray.length; i++) {
            if (settingArray[i].DisplayField) {
                setting["DisplayField"] = settingArray[i].DisplayField;
            }
            if (settingArray[i].ControlType) {
                setting["ControlType"] = settingArray[i].ControlType;
            }
            if (settingArray[i].Validation) {
                setting["Validation"] = settingArray[i].Validation;
            }
        }
        return setting;
    }

    /**
     * @static
     * @param {any[]} array Array data use to check
     * @param {*} value The value use to check
     * @param {string} keyName Property name use to check
     * @param {*} [outPutData] That is an output data
     * @returns boolean with check item existing in Array
     * @memberof Uti
     */
    static isExistItemInArray(
        array: any[],
        value: any,
        keyName: string,
        outPutData?: any
    ) {
        const currentItem = array.find((x) => {
            return x[keyName] === value;
        });
        outPutData.data = currentItem;
        return currentItem && currentItem[keyName];
    }
    static removeItemInArray(array: any[], item: any, keyName: string) {
        if (isEmpty(item) || isEmpty(array) || !keyName) {
            return;
        }
        const index = array.map((x) => x[keyName]).indexOf(item[keyName]);
        if (index < 0) {
            return;
        }
        array.splice(index, 1);
        item = {};
    }
    static existItemInArray(array: any[], item: any, keyName: string) {
        if (isEmpty(item) || isEmpty(array) || !keyName) {
            return false;
        }
        const index = array.map((x) => x[keyName]).indexOf(item[keyName]);
        return index > -1;
    }

    static removeItemInTreeArray(
        treeArray: any[],
        item: any,
        keyName: string,
        childName: string,
        conditionFucn?: Function
    ) {
        if (isEmpty(item) || isEmpty(treeArray)) {
            return;
        }
        if (this.removeItemInTreeNodeValue(treeArray, item, keyName)) return;
        for (const parentTreeNode of treeArray) {
            if (conditionFucn && !conditionFucn(parentTreeNode)) continue;
            const result = this.removeInChildren(
                parentTreeNode,
                item,
                keyName,
                childName
            );
            if (result) return;
        }
    }
    static removeItemOfArrayAtIndex(array, index) {
        array.splice(index, 1);
    }

    static getNumberOdd(number) {
        return number % 2 !== 0;
    }
    static insertArrayAt(array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    }

    private static removeInChildren(
        childrenNode: any[],
        item: any,
        keyName: string,
        childName: string
    ): boolean {
        if (
            !childrenNode ||
            !childrenNode[childName] ||
            !childrenNode[childName].length
        )
            return false;
        if (
            this.removeItemInTreeNodeValue(
                childrenNode[childName],
                item,
                keyName
            )
        )
            return true;
        for (const childNode of childrenNode[childName]) {
            const result = this.removeInChildren(
                childNode,
                item,
                keyName,
                childName
            );
            if (result) return result;
        }
        return false;
    }

    private static removeItemInTreeNodeValue(
        treeNodeValue: any,
        item: any,
        keyName: string
    ): boolean {
        const currentParentTreeNode = treeNodeValue.find(
            (x) => x[keyName] === item[keyName]
        );
        if (currentParentTreeNode && currentParentTreeNode[keyName]) {
            Uti.removeItemInArray(
                treeNodeValue,
                currentParentTreeNode,
                keyName
            );
            return true;
        }
        return false;
    }

    static getPrimaryValueFromKey(data: any) {
        if (
            !data ||
            !data.data ||
            !data.data.length ||
            !data.widgetDetail ||
            !data.widgetDetail.widgetDataType ||
            !data.widgetDetail.widgetDataType.primaryKey
        ) {
            return [];
        }
        const primayIdValueCells = [];
        const rowInfo = data.data;
        const ids: Array<string> =
            data.widgetDetail.widgetDataType.primaryKey.split(",");

        if (ids.length > 0) {
            rowInfo.forEach((cell) => {
                ids.forEach((id) => {
                    if (
                        cell.key &&
                        cell.key.toLowerCase() === id.toLowerCase()
                    ) {
                        cell.key = id;
                        primayIdValueCells.push(cell);
                    }
                });
            });
        }
        return primayIdValueCells;
    }

    static makeGridColumn(
        data: any,
        columnName: string,
        visible: boolean,
        isEdited?: boolean,
        control?: any
    ): any {
        const fixColumns = ["country", "language"];
        const title =
            data.collectionData.length && data.collectionData.length
                ? data.collectionData[0][columnName].displayValue
                : columnName;
        return {
            title: title,
            data:
                fixColumns.indexOf(columnName) > -1
                    ? columnName
                    : Uti.lowerCaseFirstLetter(
                          Uti.subStringFromCharacter(
                              data.columnSettings[columnName]
                                  .OriginalColumnName,
                              "_"
                          )
                      ),
            // visible: visible,
            options: control && control.option ? control.option : [],
            dataType:
                data.columnSettings[columnName].DataType === "bit"
                    ? "Boolean"
                    : data.columnSettings[columnName].DataType,
            setting: {
                DataLength: data.columnSettings[columnName].DataLength,
                DataType: isEdited
                    ? "nvarchar"
                    : data.columnSettings[columnName].DataType,
                OriginalColumnName:
                    data.columnSettings[columnName].OriginalColumnName,
                Setting: [
                    {
                        ControlType: {
                            Type:
                                control && control.type
                                    ? control.type
                                    : "Textbox",
                        },
                        DisplayField: {
                            ReadOnly: isEdited ? "0" : "1",
                            Hidden: visible ? "0" : "1",
                        },
                    },
                ],
            },
        };
    }

    static checkExistArticleItem(articleNr: any, rightData: any): boolean {
        const articleItem = rightData.data.find(
            (x) => x.articleNr === articleNr
        );
        return articleItem && articleItem.articleNr;
    }

    static getValueFromWidgetRowDataArrayByKey(array: any, key: any): any {
        if (!array) return null;
        if (array.length === undefined) {
            return array[key];
        }
        for (let arr of array) {
            if (
                !arr ||
                !arr.rowData ||
                !arr.rowData.length ||
                !this.checkKeynameExistInArray(arr.rowData, "key", key)
            )
                continue;
            const item = arr.rowData.find((x) => x.key === key);
            if (item && item.value) {
                return item.value;
            }
            return null;
        }
        return null;
    }

    static getValueFromArrayByKey(array: any, key: any): any {
        if (!array) return null;
        if (array.length === undefined) {
            return array[key];
        }
        const item = array.find((x) => x.key === key);
        if (item && item.value) {
            return item.value;
        }
        return null;
    }

    static mapArrayKeyValueToGeneralObject(arr: any): any {
        if (!arr || !arr.length) return {};
        let result = {};
        for (let item of arr) {
            result[item.key] = item.value;
        }
        return result;
    }

    static mapObjectValueToGeneralObject(obj: any): any {
        if (!obj || isEmpty(obj)) return {};
        let result = {};
        for (let item in obj) {
            result[item] = obj[item] ? obj[item].value : null;
        }
        return result;
    }

    static mapObjectGeneralObjectToKeyValueArray(
        obj: any,
        isUpperCaseFirstLetter?: boolean
    ): any {
        if (!obj || isEmpty(obj)) return {};
        let result: Array<any> = [];
        for (let item in obj) {
            result.push({
                key: this.upperCaseFirstLetter(item),
                value: obj[item],
            });
        }
        return result;
    }

    static getItemFromArrayByProperty(
        array: any,
        prop: string,
        condition: any
    ): any {
        if (!array || !array.length) return null;
        const item = array.find((x) => x[prop] == condition);
        if (item && item[prop]) {
            return item;
        }
        return null;
    }

    private static mergeComboboxData(desData, srcData) {
        for (const propDes in desData) {
            if (desData.hasOwnProperty(propDes)) {
                for (const propSrc in srcData) {
                    if (propDes == propSrc) {
                        if (
                            srcData[propSrc] &&
                            typeof srcData[propSrc] == "object" &&
                            srcData[propSrc].hasOwnProperty("key")
                        ) {
                            desData[propDes] = srcData[propSrc]["key"];
                        } else {
                            desData[propDes] = srcData[propSrc];
                        }
                    }
                }
            }
        }

        return desData;
    }

    /**
     * getValidCombobox
     * @param listComboBox
     * @param identificationKey
     * @param filterBy
     * @param mapFunc
     */
    static getValidCombobox(
        listComboBox: any,
        identificationKey: any,
        filterBy?: string,
        mapFunc?: any
    ) {
        const keys = Object.keys(ComboBoxTypeConstant);
        let idx: string;
        keys.forEach((key) => {
            if (ComboBoxTypeConstant[key] == identificationKey) {
                idx = key;
            }
        });

        let options: Array<any> = listComboBox[idx];
        if (filterBy) options = listComboBox[idx + "_" + filterBy];

        if (!options) {
            return null;
        }

        let rs: any;
        if (mapFunc) {
            rs = mapFunc(options);
        } else {
            rs = options.map((p) => {
                return {
                    key: +p.idValue,
                    value: p.textValue,
                };
            });
        }
        return rs;
    }

    static setValueFromNewObjToNewObj(newObj: any, oldObj: any) {
        for (const prop in newObj) {
            if (newObj.hasOwnProperty(prop)) {
                oldObj[prop] = newObj[prop];
            }
        }
    }

    static setValueForArrayByProperty(
        arr: Array<any>,
        prop: string,
        value: any
    ): Array<any> {
        for (let item of arr) {
            item[prop] = value;
        }
        return arr;
    }

    static setValueForArrayByKey(
        arr: Array<any>,
        prop: string,
        value: any,
        key: string,
        keyValue: any
    ): Array<any> {
        for (let item of arr) {
            if (item[key] != keyValue) continue;
            item[prop] = value;
            break;
        }
        return arr;
    }

    static setValueForArrayByProperties(
        arr: Array<any>,
        props: Array<string>,
        values: Array<any>
    ): Array<any> {
        for (let item of arr) {
            for (let i = 0; i < props.length; i++) {
                item[props[i]] = values[i];
            }
        }
        return arr;
    }

    static registerWijmoButtonShowDropDownMenu(
        formClass: string,
        controlName: string
    ) {
        setTimeout(() => {
            const btn = $(
                "." +
                    formClass +
                    " " +
                    controlName +
                    " button.wj-btn.wj-btn-default"
            );
            if (!btn.length) {
                this.registerWijmoButtonShowDropDownMenu(
                    formClass,
                    controlName
                );
            }
            btn.click(() => {
                setTimeout(() => {
                    const drop = $(
                        ".wj-content.wj-dropdown-panel.wj-control.wj-listbox.wj-content"
                    );
                    if (drop.length) drop.css("display", "block");
                }, 100);
            });
        }, 100);
    }

    static addItemToArrayAtIndex(array: any, item: any, index: number) {
        array.splice(index, 0, item);
    }
    //#endregion

    //#region Scroll
    static addHorizontalPerfectScrollEvent(
        $element,
        gridScrollBars,
        hasScrollbars
    ) {
        $element
            .on("ps-scroll-left", () => {
                if (gridScrollBars.right) {
                    gridScrollBars.reachRight = false;
                    hasScrollbars.emit({
                        top: null,
                        left: true,
                        right: true,
                        bottom: null,
                    });
                }
            })
            .on("ps-scroll-right", () => {
                if (gridScrollBars.right && !gridScrollBars.reachRight) {
                    hasScrollbars.emit({
                        top: null,
                        left: true,
                        right: true,
                        bottom: null,
                    });
                }
            })
            .on("ps-x-reach-end", () => {
                if (gridScrollBars.right) {
                    gridScrollBars.reachRight = true;
                    hasScrollbars.emit({
                        top: null,
                        left: true,
                        right: false,
                        bottom: null,
                    });
                }
            })
            .on("ps-x-reach-start", () => {
                if (gridScrollBars.right) {
                    hasScrollbars.emit({
                        top: null,
                        left: false,
                        right: true,
                        bottom: null,
                    });
                }
            });
    }

    static removeHorizontalPerfectScrollEvent($element) {
        $element.off("ps-scroll-left");
        $element.off("ps-scroll-right");
        $element.off("ps-x-reach-end");
        $element.off("ps-x-reach-start");
    }

    static addVerticalPerfectScrollEvent(
        $element,
        gridScrollBars,
        hasScrollbars
    ) {
        $element
            .on("ps-scroll-up", () => {
                if (gridScrollBars.bottom) {
                    gridScrollBars.reachBottom = false;
                    hasScrollbars.emit({
                        top: true,
                        left: null,
                        right: null,
                        bottom: true,
                    });
                }
            })
            .on("ps-scroll-down", () => {
                if (gridScrollBars.bottom && !gridScrollBars.reachBottom) {
                    hasScrollbars.emit({
                        top: true,
                        left: null,
                        right: null,
                        bottom: true,
                    });
                }
            })
            .on("ps-y-reach-end", () => {
                if (gridScrollBars.bottom) {
                    gridScrollBars.reachBottom = true;
                    hasScrollbars.emit({
                        top: true,
                        left: null,
                        right: null,
                        bottom: false,
                    });
                }
            })
            .on("ps-y-reach-start", () => {
                if (gridScrollBars.bottom) {
                    hasScrollbars.emit({
                        top: false,
                        left: null,
                        right: null,
                        bottom: true,
                    });
                }
            });
    }

    static removeVerticalPerfectScrollEvent($element) {
        $element.off("ps-scroll-up");
        $element.off("ps-scroll-down");
        $element.off("ps-y-reach-end");
        $element.off("ps-y-reach-start");
    }
    //#endregion

    //#region Localizer
    static filterDistinct(value, index, self) {
        return self.indexOf(value) === index;
    }

    static buildLocalizer(localizer: any, translatedSource: Array<any>) {
        const newLocalizer = {};
        for (let prop in localizer) {
            const property = camelCase(prop);
            for (let i = 0; i < translatedSource.length; i++) {
                const item = translatedSource[i];
                const prop = item["ColumnName"];
                if (prop) {
                    if (property === camelCase(prop)) {
                        newLocalizer[property] = item["Value"];
                    }
                }
            }
        }
        return newLocalizer;
    }

    static mergeLocalizer(
        oldTranslatedSource: Array<any>,
        newTranslatedSource: Array<any>
    ) {
        for (var i = 0; i < oldTranslatedSource.length; i++) {
            for (var j = 0; j < newTranslatedSource.length; j++) {
                if (
                    camelCase(oldTranslatedSource[i]["ColumnName"]) ===
                    camelCase(newTranslatedSource[j]["ColumnName"])
                ) {
                    oldTranslatedSource[i] = Object.assign(
                        {},
                        oldTranslatedSource[i],
                        newTranslatedSource[j]
                    );
                    break;
                }
            }
        }
        return oldTranslatedSource;
    }

    static getTranslateTitle(tableColumns: Array<any>, columnName: string) {
        for (let col of tableColumns) {
            if (col["data"] === camelCase(columnName)) {
                return col["title"];
            }
        }
        return "";
    }
    //#endregion

    //#region Helpers
    static handleWhenSpliterResize() {
        $("#txt-header-global-search").focus();
    }
    static subStringFromToByString(source: string, key: string): string {
        const preIndex = source.indexOf(key);
        const nextIndex =
            preIndex +
            1 +
            source.substring(preIndex + key.length).indexOf(key) +
            key.length;
        const result = source.substr(
            preIndex,
            nextIndex + key.length - (preIndex + 1)
        );
        return result;
    }

    static removeAllString(value: any, replaceFrom: any) {
        if (value.indexOf(replaceFrom) === -1) {
            return value;
        }
        return Uti.replaceAll(value, replaceFrom, "");
    }
    static replaceAll(value: any, replaceFrom: any, replaceTo: any) {
        if (value.indexOf(replaceFrom) === -1) {
            return value;
        }
        value = value.replace(replaceFrom, replaceTo);
        return Uti.replaceAll(value, replaceFrom, replaceTo);
    }
    static arraysEqual(a: any[], b: any[]) {
        return !(a < b || b < a);
    }
    static lowerCaseFirstLetter(a: string) {
        return a.charAt(0).toLowerCase() + a.slice(1);
    }
    static upperCaseFirstLetter(a: string) {
        return a.charAt(0).toUpperCase() + a.slice(1);
    }
    static subStringFromCharacter(a: string, b: string) {
        return a.split(b)[1];
    }
    static strValObj(object: any): any {
        try {
            const item = object.toString();
            if (item.toLowerCase() === "true") {
                return true;
            }
            if (item.toLowerCase() === "false") {
                return false;
            }
            if (isEmpty(object) && item === "[object Object]") {
                return "";
            }
            return object;
        } catch (ex) {
            return "";
        }
    }

    static sortBy(a, b, valueName): any {
        const nameA =
            typeof a[valueName] === "string"
                ? a[valueName].toUpperCase()
                : a[valueName]; // ignore upper and lowercase
        const nameB =
            typeof b[valueName] === "string"
                ? b[valueName].toUpperCase()
                : b[valueName]; // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    }

    static isDifferentDataBetweenTwoObject(obj1: any, obj2: any): boolean {
        for (const item in obj1) {
            if (obj1[item] != obj2[item]) return true;
        }
        return false;
    }

    static isNilE(obj: any) {
        return isNil(obj) || obj === "";
    }

    static isNullUndefinedEmptyObject(obj: any) {
        return isNil(obj) || this.isEmptyObject(obj);
    }

    static isEmptyObject(obj: any) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    static isNullOrEmptyOfAllValueOfArray(
        arr: any[],
        valuePropertyName: string
    ) {
        try {
            for (let item of arr) {
                if (!!item[valuePropertyName]) return false;
            }
            return true;
        } catch (ex) {
            return true;
        }
    }

    static hasNotValue(obj: any) {
        if (typeof obj === "object") {
            if (isEmpty(obj)) return true;
            if (!obj.value) return true;
        } else {
            return !obj;
        }
        return true;
    }

    static isAllPropertiesEmpty(obj: any) {
        try {
            if (!obj) return true;
            for (let pro in obj) {
                if (!!obj[pro]) return false;
            }
            return true;
        } catch (e) {
            return true;
        }
    }

    static checkKeynameExistInArray(
        arr: any,
        keyName: string,
        keyNameToCheck: string
    ): boolean {
        for (const item of arr) {
            if (item[keyName] === keyNameToCheck) return true;
        }
        return false;
    }

    static tryParseJson(jsonString: any, defaultValue?: any): any {
        try {
            return JSON.parse(jsonString);
        } catch (ex) {
            if (defaultValue) {
                return defaultValue;
            }
            return {};
        }
    }

    static parseJsonString(jsonString: string) {
        try {
            const item = JSON.parse(jsonString);
            if (item !== null && typeof item === "object") {
                return item;
            }
        } catch {}

        return false;
    }

    static getValueFromObjectJsonString(
        stringData: string,
        propertyName: string,
        defaultData?: any
    ): any {
        try {
            let _jsonData = Uti.parseJsonString(stringData);
            return _jsonData[propertyName];
        } catch (e) {
            return defaultData || null;
        }
    }

    static isJsonString(jsonString: string) {
        let item;
        try {
            item = JSON.parse(jsonString);
        } catch (ex) {
            return false;
        }
        if (typeof item === "object" && item !== null) {
            return true;
        }
        return false;
    }

    static getValueOfObjectByKey(entityObj, keyArray) {
        const rs = keyArray.split(",");
        if (rs.length > 0) {
            const entityObjKeys: Array<string> = Object.keys(entityObj);
            for (const key of rs) {
                const entityObjKey = entityObjKeys.filter(
                    (p) => p.toLowerCase() === key.toLowerCase()
                );
                if (entityObjKey.length > 0) {
                    let value = null;
                    if (
                        entityObj[entityObjKey[0]] &&
                        entityObj[entityObjKey[0]].value
                    ) {
                        value = entityObj[entityObjKey[0]].value;
                    } else if (
                        entityObj[entityObjKey[0]] &&
                        !entityObj[entityObjKey[0]].value
                    ) {
                        value = entityObj[entityObjKey[0]];
                    }
                    return value;
                }
            }
        }
    }

    static parFloatFromObject(
        obj: any,
        defaultValue: any,
        removeStr?: string
    ): any {
        try {
            if (obj === undefined || obj === null || obj === "")
                return defaultValue;
            removeStr = removeStr || "";
            obj = obj.toString().replace(removeStr, "");
            return isNaN(parseFloat(obj)) ? defaultValue : parseFloat(obj);
        } catch (ex) {
            return defaultValue;
        }
    }

    static isInt(n) {
        if (!n && n !== 0) return false;
        return Number(n) === n && n % 1 === 0;
    }

    static isFloat(n) {
        if (!n && n !== 0) return false;
        return Number(n) === n && n % 1 !== 0;
    }

    static calculateExchange(
        formatExchange: string,
        valueFrom: any,
        exchangeProportion: any
    ): any {
        if (!formatExchange || !exchangeProportion) return;
        const arr = formatExchange.split(",");
        const exchangeValue = exchangeProportion[arr[0].toLowerCase()];
        const result = {};
        result[arr[0].toLowerCase()] = valueFrom;
        result[arr[1].toLowerCase()] = valueFrom / exchangeValue;
        return result;
    }

    private static getValueFromExchangeObject(
        exchangeValue: any,
        currencyName: any
    ): any {
        if (isEmpty(exchangeValue)) return 1;
        return exchangeValue[currencyName];
    }

    static fixToDigit(data: any, digitNumber: number): any {
        try {
            const value = this.parFloatFromObject(data, 0);
            return (value as number).toFixed(digitNumber);
        } catch (ex) {
            return 0;
        }
    }

    static isResquestSuccess(response: ApiResultResponse): boolean {
        return (
            response &&
            response.statusCode === ApiMethodResultId.Success &&
            response.item
        );
    }

    static getBrowserInfo(
        browserInfoModel?: BrowserInfoModel
    ): BrowserInfoModel {
        browserInfoModel = browserInfoModel || new BrowserInfoModel();
        let unknown = "-",
            width,
            height;

        // screen
        let screenSize = "";
        if (screen.width) {
            width = screen.width ? screen.width : "";
            height = screen.height ? screen.height : "";
            screenSize += "" + width + " x " + height;
        }

        // browser
        let nVer = navigator.appVersion;
        let nAgt = navigator.userAgent;
        let browser = navigator.appName;
        let version = "" + parseFloat(navigator.appVersion);
        let majorVersion = parseInt(navigator.appVersion, 10);
        let nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browser = "Opera";
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf("OPR")) != -1) {
            browser = "Opera";
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            browser = "Microsoft Edge";
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browser = "Microsoft Internet Explorer";
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browser = "Chrome";
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browser = "Safari";
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browser = "Firefox";
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf("Trident/") != -1) {
            browser = "Microsoft Internet Explorer";
            version = nAgt.substring(nAgt.indexOf("rv:") + 3);
        }
        // Other browsers
        else if (
            (nameOffset = nAgt.lastIndexOf(" ") + 1) <
            (verOffset = nAgt.lastIndexOf("/"))
        ) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(";")) != -1)
            version = version.substring(0, ix);
        if ((ix = version.indexOf(" ")) != -1)
            version = version.substring(0, ix);
        if ((ix = version.indexOf(")")) != -1)
            version = version.substring(0, ix);

        majorVersion = parseInt("" + version, 10);
        if (isNaN(majorVersion)) {
            version = "" + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        let mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        let cookieEnabled = navigator.cookieEnabled ? true : false;

        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
            document.cookie = "testcookie";
            cookieEnabled =
                document.cookie.indexOf("testcookie") != -1 ? true : false;
        }

        // system
        let os = unknown;
        let clientStrings = [
            { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
            { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
            { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
            { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
            { s: "Windows Vista", r: /Windows NT 6.0/ },
            { s: "Windows Server 2003", r: /Windows NT 5.2/ },
            { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
            { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
            { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
            { s: "Windows 98", r: /(Windows 98|Win98)/ },
            { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
            {
                s: "Windows NT 4.0",
                r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
            },
            { s: "Windows CE", r: /Windows CE/ },
            { s: "Windows 3.11", r: /Win16/ },
            { s: "Android", r: /Android/ },
            { s: "Open BSD", r: /OpenBSD/ },
            { s: "Sun OS", r: /SunOS/ },
            { s: "Linux", r: /(Linux|X11)/ },
            { s: "iOS", r: /(iPhone|iPad|iPod)/ },
            { s: "Mac OS X", r: /Mac OS X/ },
            { s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
            { s: "QNX", r: /QNX/ },
            { s: "UNIX", r: /UNIX/ },
            { s: "BeOS", r: /BeOS/ },
            { s: "OS/2", r: /OS\/2/ },
            {
                s: "Search Bot",
                r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
            },
        ];
        for (let id in clientStrings) {
            let cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        let osVersion: any = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = "Windows";
        }

        switch (os) {
            case "Mac OS X":
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case "Android":
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case "iOS":
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion =
                    osVersion[1] +
                    "." +
                    osVersion[2] +
                    "." +
                    (osVersion[3] | 0);
                break;
        }

        browserInfoModel.Screen = screenSize;
        browserInfoModel.Browser = browser;
        browserInfoModel.BrowserVersion = version;
        browserInfoModel.BrowserMajorVersion = majorVersion.toString();
        browserInfoModel.Mobile = mobile.toString();
        browserInfoModel.Os = os;
        browserInfoModel.OsVersion = osVersion;
        browserInfoModel.Cookies = cookieEnabled.toString();
        browserInfoModel.IP = Configuration.PublicSettings.clientIpAddress;
        return browserInfoModel;
    }

    static mergeModuleSetting(defaultModule, adjustedModule) {
        if (!adjustedModule || !adjustedModule.length) return defaultModule;
        const jsonSettingDefault = JSON.parse(defaultModule[0].jsonSettings);
        const defaultCustomTabs = jsonSettingDefault.Content.CustomTabs;
        const jsonSetting = JSON.parse(adjustedModule[0].jsonSettings).Content
            .CustomTabs;
        for (let i = 0; i < defaultCustomTabs.length; i++) {
            if (!jsonSetting[i] || !jsonSetting[i].TabContent) {
                defaultModule[0].jsonSettings =
                    JSON.stringify(jsonSettingDefault);
                return defaultModule;
            } else {
                defaultCustomTabs[i].TabContent = jsonSetting[i].TabContent;
            }
        }
        defaultModule[0].jsonSettings = JSON.stringify(jsonSettingDefault);
        return defaultModule;
    }

    static castToString(o: any, regex?: string) {
        try {
            if (!o) return "";
            if (typeof o.getMonth === "function" && !!regex) {
                return format(o, regex);
            } else {
                return o.toString();
            }
        } catch (ex) {
            return "";
        }
    }

    /**
     * isValidRegExp
     * @param pattern
     */
    static isValidRegExp(pattern: string) {
        let isValid = true;
        try {
            new RegExp(pattern);
        } catch (e) {
            isValid = false;
        }
        return isValid;
    }

    static convertDataEmptyToNull(obj: any): any {
        if (obj !== null && typeof obj === "object") {
            for (let item in obj) {
                if (obj !== null && typeof obj === "object") {
                    obj[item] = this.convertDataEmptyToNull(obj[item]);
                }
                if (item === "DateOfBirth") {
                    continue;
                }
                if (obj[item] === "") {
                    obj[item] = null;
                }
            }
        }
        return obj;
    }

    static unsubscribe(context: any) {
        for (let itemName in context) {
            try {
                if (!context[itemName]) continue;

                if (context[itemName] instanceof Subscription)
                    context[itemName].unsubscribe();
                else if (context[itemName].source == "setInterval") {
                    clearInterval(context[itemName]);
                    context[itemName] = null;
                } else if (context[itemName].source == "setTimeout") {
                    clearTimeout(context[itemName]);
                    context[itemName] = null;
                }
            } catch (ex) {
                console.log("unsubscribe-property", ex);
            }
        } //for
    }

    static formatBytes(bytes: number, decimals?: number) {
        if (!bytes) return "0 Bytes";
        var k = 1024,
            dm = decimals || 2,
            sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    }
    static formatBytesToMb(bytes: number, decimals?: number) {
        if (!bytes) return "0 MB";
        var k = 1024,
            dm = decimals || 2;
        return parseFloat((bytes / k / k).toFixed(dm)) + " MB";
    }

    static bytesToSize(bytes: number) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "n/a";
        const i = parseInt(
            String(Math.floor(Math.log(bytes) / Math.log(1024))),
            10
        );
        if (i === 0) return `${bytes} ${sizes[i]}`;
        return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    }
    //#endregion

    //#region Generate Data
    static getTempId(): number {
        return Math.round(Math.random() * 100000000000000000) * -1;
    }

    static logError(error) {
        console.error(
            JSON.stringify(error, ["message", "arguments", "type", "name"])
        );
    }

    static getTempId2(): number {
        const length: number = 8;
        let timestamp: number = +new Date();

        let _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const ts = timestamp.toString();
        let parts = ts.split("").reverse();
        let id = "";

        for (let i = 0; i < length; ++i) {
            let index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return Number(id) * -1;
    }

    public getEmptyGuid(): string {
        return this.consts.emptyGuid;
    }

    static guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (
            s4() +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            "-" +
            s4() +
            s4() +
            s4()
        );
    }

    static randomPassword(length) {
        let chars =
            "abcdefghijklmnopqrstuvwxyz!@#$ABCDEFGHIJKLMNOP!@#$1234567890!@#$";
        let pass = "";
        for (let x = 0; x < length; x++) {
            let i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }

    static randomText(numberOfWord: number) {
        let result = "";
        let textArray =
            'Publishing his final article online, Ms Attiah said This column perfectly captures his commitment and passion for freedom in the Arab world The journalist wrote that people in other Arab countries "are either uninformed or misinformed" so are unable to address matters affecting their lives'.split(
                " "
            );
        let randomNumber = 0;
        for (let i = 0; i < numberOfWord; i++) {
            randomNumber = Math.floor(Math.random() * textArray.length);
            result += textArray[randomNumber] + " ";
        }
        return result;
    }
    //#endregion

    //#region Url

    //Case 1:   /       -> root
    //Case 2:   /module -> private root
    //Case 3:   /auth   -> public  root
    static isRootUrl(url: string): boolean {
        return (
            url === "/" ||
            url === Configuration.rootPrivateUrl ||
            url === Configuration.rootPublicUrl
        );
    }

    //   /module/customer -> /customer
    static getPrivateUrlWithoutPrefixRoute(url: string): string {
        //has config route
        if (Configuration.rootPrivateUrl) {
            url = url.replace(Configuration.rootPrivateUrl, "");
        }
        return url;
    }

    //   /module/customer       -> /customer        -> ['customer']
    //   /module/customer/sub1  -> /customer/sub1   -> ['customer','sub1']
    static getModuleNamesFromUrl(url: string): string[] {
        url = Uti.getPrivateUrlWithoutPrefixRoute(url);
        if (url.length && url[0] === "/") {
            url = url.substring(1, url.length);
        }

        return url.split("/");
    }

    // customer -> /module/customer
    static getPrivateUrlWithModuleName(moduleName: string): string {
        let rootPrivateUrl: string = Configuration.rootPrivateUrl;
        if (
            rootPrivateUrl &&
            rootPrivateUrl[rootPrivateUrl.length - 1] != "/"
        ) {
            rootPrivateUrl += "/";
        }
        return rootPrivateUrl + moduleName;
    }

    static isSearchUrl(): boolean {
        return location.pathname == "/search";
    }
    //#endregion

    //#region Date
    static isDateValid(dateStr: any): boolean {
        try {
            if (typeof dateStr.getMonth === "function") return true;
            const items = dateStr.split("/");
            const date = new Date(items[2], items[0] - 1, items[1]);
            return (
                date &&
                date.getMonth() + 1 == items[0] &&
                date.getFullYear() > 1900
            );
        } catch (ex) {
            return false;
        }
    }

    static getUTCDate(date?: Date): Date {
        date = date || new Date();
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            )
        );
    }

    static getUTCDateWithoutHour(date?: Date): Date {
        date = date || new Date();
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                0,
                0,
                0
            )
        );
    }

    public formatDateCommon(date, formatDate) {
        let dateObj: any = date;
        if (!dateObj || dateObj.toString() === "Invalid Date") return "";

        if (!(date instanceof Date)) {
            dateObj = parse(dateObj, "MM/dd/yyyy", new Date());
            if (dateObj.toString() === "Invalid Date") {
                dateObj = parse(dateObj, "dd/MM/yyyy", new Date());
                if (dateObj.toString() === "Invalid Date") {
                    dateObj = parse(dateObj, "yyyy/MM/dd", new Date());
                    if (dateObj.toString() === "Invalid Date") {
                        return dateObj;
                    }
                }
            }
        }
        return this.formatLocale(dateObj, formatDate);
    }

    public formatLocale(date, formatStr) {
        if (!date || date.toString() === "Invalid Date" || !date.getFullYear) {
            return format(new Date(), formatStr, {
                awareOfUnicodeTokens: true,
            });
        }

        let sessionLang = LocalStorageHelper.toInstance(
            SessionStorageProvider
        ).getItem(LocalSettingKey.LANGUAGE);
        if (sessionLang) {
            let result = format(date, formatStr, {
                awareOfUnicodeTokens: true,
                locale: locales[sessionLang.flag],
            });
            return result;
        }

        let user = this.getUserInfo();
        if (user) {
            let locale = this.getLocale(user);

            return format(date, formatStr, {
                awareOfUnicodeTokens: true,
                locale: locales[locale],
            });
        }

        return format(date, formatStr, {
            awareOfUnicodeTokens: true,
        });
    }

    static callParseToCalendar = 0;
    static parseToCalendar(formSelector: string) {
        setTimeout(() => {
            const calendarInputs = $(
                "#" + formSelector + " .ui-calendar input.ui-inputtext"
            );
            if (calendarInputs.length <= 0 && this.callParseToCalendar < 10) {
                this.callParseToCalendar++;
                this.parseToCalendar(formSelector);
                return;
            }
            for (let i = 0; i < calendarInputs.length; i++) {
                ($(calendarInputs[i]) as any).mask("00/00/0000", {
                    placeholder: "mm/dd/yyyy",
                });
            }
        }, 200);
    }

    public getBirthdayYearRange(): string {
        return "1900:" + new Date().getFullYear().toString();
    }

    static wait(ms) {
        const start = new Date().getTime();
        let end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    static getCurrentDate(separate?: string) {
        let today: any = new Date();
        let dd: any = today.getDate();
        let mm: any = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = "0" + dd;
        }

        if (mm < 10) {
            mm = "0" + mm;
        }
        return mm + (separate || "/") + dd + (separate || "/") + yyyy;
    }

    static parseDateFromDB(dateData: any): any {
        if (!dateData) return null;

        try {
            return parse(dateData, "dd.MM.yyyy", new Date());
        } catch (ex) {
            return null;
        }
    }

    static parseDate(dateData: any, format: string): any {
        if (!dateData) return null;

        try {
            return parse(dateData, format, new Date());
        } catch (ex) {
            return null;
        }
    }

    static parseStrDateToRealDate(strDate: any): any {
        if (!strDate) return null;

        try {
            const date: any = new Date(strDate);
            if (
                date.toString() === "Invalid Date" ||
                (strDate.indexOf("2001") < 0 && date.getFullYear() === 2001)
            ) {
                return null;
            }
            return date;
        } catch (ex) {
            return null;
        }
    }
    static joinDateToNumber(dateData: Date, formatStr: string): any {
        if (!dateData) return 0;
        try {
            if (typeof dateData === "string") {
                dateData = new Date(dateData);
            }
            return format(dateData, formatStr);
        } catch (ex) {
            return 0;
        }
    }

    static parseToRightDate(value: any) {
        try {
            let date = new Date(value);
            date.setHours(7);
            return date;
        } catch (e) {
            return null;
        }
    }

    //Convert DateString to Date: '2010-03-04 10:47:05Z' --> 'Thu Mar 04 2010 10:47:05 GMT+0700 (Indochina Time)'
    static parseISODateToDate(value: any): Date {
        if (!value) return null;

        const dateString =
            value[value.length - 1] === "Z"
                ? value.substring(0, value.length - 1)
                : value;
        const date = new Date(dateString);
        return date;
    }

    static parseDateToDBString(date: Date): any {
        try {
            return (
                date.getUTCFullYear() +
                "." +
                (date.getMonth() + 1) +
                "." +
                date.getDate()
            );
        } catch {
            return date;
        }
    }
    //#endregion

    static getTrueScreenSize(): any {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
        };
    }
    static getTextWidth(text, font) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        canvas.remove();
        return metrics.width + 10;
    }
    static mapArrayToObject(data: any, isNotCamel?: boolean): any {
        let model: any = {};
        let prop: string = "";
        data.forEach((item) => {
            prop = isNotCamel ? item.key : camelCase(item.key);
            model[prop] = item.value;
        });
        return model;
    }
    static mapObjectToCamel(data: any): any {
        if (!data) return {};

        let model: any = {};
        Object.keys(data).forEach((key) => {
            model[camelCase(key)] = data[key];
        });
        return model;
    }
    static mapArrayToObjectWithSelfPropertyName(
        array: Array<any>,
        propertyName: string
    ): any {
        if (!array || !array.length) {
            return {};
        }
        let model: any = {};
        for (let item of array) {
            model[item[propertyName]] = item[propertyName];
        }
        return model;
    }
    static getIndexOfItemInArray(arr: Array<any>, item: any, id: string) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][id] == item[id]) {
                return i;
            }
        }
        return -1;
    }
    static registerKeyPressForControl(
        $control: any,
        func: Function,
        key: number
    ) {
        if (!$control || !$control.length) return;
        $control.unbind("keyup");
        $control.keyup(($event) => {
            if (!($event.which === key || $event.keyCode === key)) return;
            if (!func) return;
            func();
        });
    }
    static toLowerCase(obj: any) {
        try {
            return obj.trim().toLowerCase();
        } catch (ex) {
            return "";
        }
    }
    static getStringValue(obj: any) {
        try {
            if (isEmpty(obj)) return "";
            return obj + "";
        } catch (ex) {
            return "";
        }
    }
    static isEmptyOrFalse(obj): boolean {
        if (!obj) return false;
        if (typeof obj === "object" && JSON.stringify(obj) === "{}") {
            return false;
        }
        return true;
    }
    static convertDateToString(dateValue: any) {
        if (typeof dateValue === "object") {
            dateValue = format(dateValue, "MM/dd/yyyy");
        } else {
            let dateObj = parse(dateValue, "dd.MM.yyyy", new Date());
            if (!isNaN(dateObj.getMonth())) {
                dateValue = format(dateObj, "MM/dd/yyyy");
            }
        }

        return dateValue;
    }
    static replaceSpecialCharacterOfFile(filename: string): string {
        if (!filename) return "";
        return filename.replace(/[/\\?%*:|"<>]/g, "-");
    }

    public getLocale(user: any) {
        let locale = "enUS";
        switch (user.preferredLang) {
            case "1":
                locale = "de";
                break;
            case "2":
                locale = "it";
                break;
            case "3":
                locale = "frCH";
                break;
            case "4":
                locale = "enUS";
                break;
            case "5":
                locale = "es";
                break;
            case "6":
                locale = "pt";
                break;
            case "7":
                locale = "nl";
                break;
            case "8":
                locale = "ja";
                break;
            case "9":
                locale = "vi";
                break;
            default:
                locale = "enUS";
                break;
        }

        return locale;
    }
    static buildKeyValueArrayForObject(data: any) {
        if (!data || isEmpty(data) || typeof data !== "object") return [];
        let result = [];
        for (let prop in data) {
            result.push({
                key: prop,
                value: data[prop],
            });
        }
        return result;
    }

    //#region FileManager
    static checkFilesExtension(acceptExtensionFiles: any, files: Array<any>) {
        if (!files || !files.length) return false;
        for (let file of files) {
            if (!this.checkFileExtension(acceptExtensionFiles, file.name)) {
                return false;
            }
        }
        return true;
    }

    static checkFileExtension(acceptExtensionFiles: any, fileName: string) {
        if (!fileName) return false;
        const arrName = fileName.split(".");
        if (arrName.length < 2) return false;

        if (!acceptExtensionFiles || acceptExtensionFiles.trim() === "*")
            return true;
        const extesion = arrName[arrName.length - 1] || "";
        return acceptExtensionFiles.indexOf(extesion.toLowerCase()) > -1;
    }
    static isDuplicateFile(uploader: any, file: any): boolean {
        if (!uploader || !uploader.queue.length) return false;
        for (let item of uploader.queue) {
            if (
                item.file.name &&
                file.name &&
                item.file.name.toLowerCase() == file.name.toLowerCase()
            ) {
                return true;
            }
        }
        return false;
    }
    static getFileUrl(
        name: string,
        mode?: UploadFileMode,
        returnName?: string,
        subFolder?: string
    ): string {
        let url = Uti._serviceUrl.getFile + "?";
        if (name) url += "name=" + name;
        if (returnName) url += "&returnName=" + returnName;
        if (mode) url += "&mode=" + mode;
        if (subFolder) url += "&subFolder=" + subFolder;
        return url;
    }
    static getUploadFileUrl(
        mode?: UploadFileMode,
        subFolder?: string,
        saveFileName?: string
    ): string {
        let url = Uti._serviceUrl.uploadFile + "?";
        if (mode == UploadFileMode.ArticleMediaZipImport) {
            url = Uti._serviceUrl.importArticleMediaZip + "?";
        }
        if (mode) url += "&mode=" + mode;
        if (subFolder) url += "&subFolder=" + subFolder;

        // saveFileName: That will include extension, example: test.docx
        if (saveFileName) url += "&saveFileName=" + saveFileName;
        return url;
    }
    static getCheckFileExistedUrl(
        name: string,
        mode?: UploadFileMode,
        subFolder?: string
    ): string {
        let url = Uti._serviceUrl.checkFileExisted + "?";
        if (name) url += "name=" + name;
        if (mode) url += "&mode=" + mode;
        if (subFolder) url += "&subFolder=" + subFolder;
        return url;
    }
    static getDataOfFirstProperty(obj: any, defaultData?: any) {
        if (!obj) return defaultData || null;
        for (let pro in obj) {
            return obj[pro] ? obj[pro] : defaultData || null;
        }
        return defaultData || null;
    }
    static isNotCharacterKey(keyCode: any): boolean {
        return (
            [
                13, 16, 17, 18, 19, 20, 27, 35, 36, 37, 38, 39, 40, 91, 93, 224,
            ].indexOf(keyCode) > -1
        );
    }
    //#endregion

    static addMorePropertyToArray(arr: any, propertyName: string, data: any) {
        if (!arr || !arr.length || !propertyName) return arr;
        for (let item of arr) {
            item[propertyName] = data;
        }
        return arr;
    }

    static mapEmptyToStringEmpty(data: any): string {
        if (!data || isEmpty(data) || !data.length) {
            return "";
        }
        return data;
    }
    static toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                try {
                    callback(
                        "data:image/png;" + (<any>reader.result).split(";")[1]
                    );
                } catch (e) {}
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    static replaceExtension(fileName: string, ext: string): string {
        const arr = fileName.split(".");
        if (!arr || !arr.length) return "";
        if (arr.length === 1) {
            return fileName + "." + ext;
        }
        let result = "";
        for (let i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) break;
            result += arr[i];
        }
        result += "." + ext;
        return result;
    }

    static getDateFormatFromIsoCode(isoCode) {
        switch (isoCode) {
            case "AL":
            case "BA":
            case "CA":
            case "SE":
                return "yyyy-MM-dd";

            case "AU":
            case "BE":
            case "CO":
            case "ES":
            case "GT":
            case "MX":
            case "NZ":
                return "dd/MM/yyyy";

            case "AT":
            case "CH":
            case "DE":
            case "HR":
            case "LU":
            case "NO":
            case "PL":
            case "RO":
            case "RU":
            case "TR":
            case "UA":
                return "dd.MM.yyyy";

            case "BG":
            case "CN":
                return "yyyy-MM-dd";

            case "BY":
            case "CZ":
            case "FI":
            case "IS":
            case "MK":
            case "ME":
            case "RS":
            case "SK":
            case "SI":
                return "dd.MM.yyyy";

            case "BO":
            case "CL":
            case "DK":
            case "PT":
                return "dd-MM-yyyy";

            case "PH":
            case "SG":
            case "US":
                return "MM/dd/yyyy";

            case "JP":
            case "ZA":
                return "yyyy/MM/dd";

            default:
                return "dd/MM/yyyy";
        }
    }

    static secondsToString(seconds: number) {
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor(
            (((seconds % 31536000) % 86400) % 3600) / 60
        );
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        return (
            (numyears ? numyears + " years " : "") +
            (numdays ? numdays + " days " : "") +
            (numhours ? numhours + " hours " : "") +
            (numminutes ? numminutes + " minutes " : "") +
            (numseconds ? numseconds + " seconds " : "")
        );
    }

    static randLetter() {
        const letters = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
        ];
        const index = Math.floor(Math.random() * letters.length);
        const letter = letters[index];
        return letter;
    }

    static disabledEventPropagation(
        e,
        dontPreventDefault?: boolean,
        dontStopPropagation?: boolean
    ) {
        if (e) {
            if (e.stopPropagation) {
                if (!dontPreventDefault) e.preventDefault();
                if (!dontStopPropagation) e.stopPropagation();
            }

            // if (window.event) {
            //     window.event.cancelBubble = true;
            // }
        }
    }

    static isValidEmail(email) {
        const re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static defineBrowserTabId(isForceNewId?: boolean) {
        const key = "BrowserTabId";
        let iPageTabID = sessionStorage.getItem(key);
        // if it is the first time that this page is loaded
        if (iPageTabID == null || isForceNewId) {
            const randNum = Math.round(Math.random() * 10000);
            iPageTabID = new Date().getTime() + randNum + "";
            sessionStorage.setItem(key, iPageTabID);
        }
        return iPageTabID;
    }

    static openPopupCenter(url, title, w, h) {
        w = w || 800;
        h = h || 800;
        title = title || document.title;

        // Fixes dual-screen position: Most browsers, Firefox
        const dualScreenLeft =
            window.screenLeft != undefined ? window.screenLeft : window.screenX;
        const dualScreenTop =
            window.screenTop != undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth
            ? window.innerWidth
            : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : screen.width;
        const height = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : screen.height;

        let systemZoom = width / window.screen.availWidth;
        let left = (width - w) / 2 / systemZoom + dualScreenLeft;
        let top = (height - h) / 2 / systemZoom + dualScreenTop;
        systemZoom = systemZoom <= 0 ? 1 : systemZoom;
        const newWindow = window.open(
            url,
            title,
            "scrollbars=yes, width=" +
                w / systemZoom +
                ", height=" +
                h / systemZoom +
                ", top=" +
                top +
                ", left=" +
                left
        );

        // Puts focus on the newWindow
        if (window.focus && newWindow) {
            newWindow.moveTo(left, top);
            newWindow.focus();
        }

        return newWindow;
    }

    //#region Convert
    static toBoolean(value: any) {
        switch (value) {
            case true:
            case "true":
            case "True":
            case 1:
            case "1":
            case "TRUE":
                return true;
            default:
                return false;
        }
    }
    //#endregion

    public static allowControlKey(e: any): boolean {
        return (
            [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: key "."
            e.key == "." ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode == 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)
        );
    }
}

interface ValidationResult {
    [key: string]: boolean;
}

@Injectable()
export class CustomValidators {
    static required(control: FormControl): ValidationResult {
        return typeof control.value == "string" && control.value.trim() !== ""
            ? null
            : { required: true };
    }

    static regularExpression(control: FormControl): ValidationResult {
        if (!control.value && control["isRequired"]) {
            return { required: true };
        }
        if (
            !control.value ||
            typeof control.value != "string" ||
            control.value.match(new RegExp(control["regularExpression"]))
        ) {
            return null;
        }
        return { expressionError: true };
    }
}
