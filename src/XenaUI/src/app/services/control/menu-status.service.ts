import { Injectable } from "@angular/core";
import { WidgetMenuStatusModel, WidgetType, WidgetDetail } from "app/models";
import { RepWidgetAppIdEnum } from "app/app.constants";

@Injectable()
export class MenuStatusService {
    constructor() {}

    public buildMenuStatusSettings(
        settings: WidgetMenuStatusModel,
        data: WidgetDetail,
        isSwitchedFromGridToForm: boolean
    ) {
        if (!settings) return;

        //console.log('buildMenuStatusSettings', new Date().getTime());

        const idRepWidgetType: number = data.idRepWidgetType;
        const idRepWidgetApp: number = data.idRepWidgetApp;

        //[Menu Button Settings]
        //Menu Button Settings for Grid
        if (
            settings.hasRightSettingButton &&
            idRepWidgetApp !== RepWidgetAppIdEnum.RepositoryDetail &&
            !isSwitchedFromGridToForm &&
            idRepWidgetType >= WidgetType.DataGrid &&
            idRepWidgetType <= WidgetType.EditableTable &&
            !this.hideBtnSetting(idRepWidgetType)
        )
            settings.btnSettingGrid.enable = true;
        else settings.btnSettingGrid.enable = false;

        //Menu Button Settings for Form
        if (
            settings.hasRightSettingButton &&
            (isSwitchedFromGridToForm ||
                idRepWidgetType <= WidgetType.FieldSet ||
                idRepWidgetType > WidgetType.Combination) &&
            !this.hideBtnSetting(idRepWidgetType)
        )
            settings.btnSettingForm.enable = true;
        else settings.btnSettingForm.enable = false;

        //Menu Button Settings for Grid and Form
        if (
            settings.hasRightSettingButton &&
            idRepWidgetType === WidgetType.Combination
        )
            settings.btnSettingGridAndForm.enable = true;
        else settings.btnSettingGridAndForm.enable = false;

        //[Menu Toolbar Button]
        const isSupportWidgetSetting =
            this.isSupportWidgetSetting(idRepWidgetType);
        const isShowToogleButton = this.isShowToogleButton(idRepWidgetType);
        settings.btnToolbar.enable =
            settings.hasRightToolbarButton &&
            (isSupportWidgetSetting || isShowToogleButton);
        settings.btnRefresh.enable =
            isSupportWidgetSetting || isShowToogleButton;
        settings.btnBackToWidget.enable = true;

        settings.btnEditForm.enable = settings.hasRightEdit;
        settings.btnEditWidgetOptions.enable =
            idRepWidgetType !== WidgetType.EditableRoleTreeGrid;

        settings.btnEditCountryWidget.enable = settings.hasRightEdit;
        settings.btnEditTreeViewWidget.enable = settings.hasRightEdit;

        settings.btnWidgetTranslation.enable =
            settings.hasRightToolbarButton_TranslateButton &&
            (idRepWidgetType >= WidgetType.FieldSet ||
                idRepWidgetType === WidgetType.FileExplorer ||
                idRepWidgetType === WidgetType.EditableRoleTreeGrid ||
                idRepWidgetType === WidgetType.ReturnRefund ||
                idRepWidgetType === WidgetType.FileExplorerWithLabel ||
                idRepWidgetType === WidgetType.CombinationCreditCard ||
                idRepWidgetType === WidgetType.Combination ||
                idRepWidgetType === WidgetType.NoteForm);
        settings.btnWidgetTranslationOptions.enable =
            idRepWidgetType == WidgetType.DataGrid ||
            idRepWidgetType === WidgetType.EditableGrid ||
            idRepWidgetType === WidgetType.Combination;

        settings.btnGoToNextcolumnOrRow.enable =
            idRepWidgetType === WidgetType.DataGrid ||
            idRepWidgetType === WidgetType.EditableGrid ||
            idRepWidgetType === WidgetType.TableWithFilter ||
            idRepWidgetType === WidgetType.ReturnRefund;

        //btnEditTemplate
        settings.btnEditTemplate.enable =
            settings.hasRightToolbarButton_EditTemplateButton &&
            (idRepWidgetApp === RepWidgetAppIdEnum.MailingParameters ||
                idRepWidgetApp === RepWidgetAppIdEnum.ProductParameter ||
                idRepWidgetApp === RepWidgetAppIdEnum.GlobalParameter ||
                idRepWidgetApp === RepWidgetAppIdEnum.PostShippingCosts ||
                idRepWidgetApp === RepWidgetAppIdEnum.PrinterControl);

        settings.btnTableFieldsTranslate.enable =
            settings.hasRightToolbarButton_FieldTranslateButton &&
            idRepWidgetType >= WidgetType.FieldSet;

        settings.txtFilterTable.enable =
            idRepWidgetType === WidgetType.DataGrid ||
            idRepWidgetType === WidgetType.EditableGrid ||
            idRepWidgetType === WidgetType.TableWithFilter ||
            idRepWidgetType === WidgetType.EditableRoleTreeGrid;

        settings.btnSaveSettings.enable =
            idRepWidgetApp !== RepWidgetAppIdEnum.RepositoryDetail;

        settings.btnOpenUserRoleDialog.enable =
            idRepWidgetApp === RepWidgetAppIdEnum.UserList;

        settings.btnOpenTranslateForCombineWidget.enable =
            settings.hasRightToolbarButton_TranslateButton &&
            idRepWidgetType == WidgetType.Combination;

        settings.btnArticleNameTranslation.enable =
            settings.hasRightToolbarButton_TranslateButton;
        settings.btnPrintWidget.enable =
            settings.hasRightToolbarButton_PrintButton &&
            this.isSupportPrint(idRepWidgetType);
        settings.btnSupportSearch.enable =
            this.isSupportSearch(idRepWidgetType);
        settings.btnSupportExcelExport.enable =
            this.isSupportExcelExport(idRepWidgetType);
        settings.btnAddRowForEditableTableWidget.enable = settings.hasRightEdit;
        settings.btnAddNoteForm.enable = true;
        settings.btnAddPerson.enable =
            idRepWidgetApp === RepWidgetAppIdEnum.CustomerDoublette;
        settings.btnEditEditableTable.enable = settings.hasRightEdit;
        settings.btnResetWidget.enable = true;
        settings.btnSaveEditableTableWidget.enable = true;
        settings.btnSaveFileExplorerWidget.enable = true;
        settings.btnSaveWidgetForm.enable = true;
        settings.btnSaveTreeViewWidget.enable = true;
        settings.btnSaveCountryWidget.enable =
            settings.hasRightEdit || settings.hasRightDelete;
        settings.btnSaveNoteForm.enable = true;
        settings.btnUploadFileWidget.enable = settings.hasRightEdit;
        settings.btnSaveDesignColumnLayout.enable = true;
        settings.btnMaximizeWidget.enable = true;
        settings.btnOpenNewWindow.enable = true;
    }

    public buildMenuStatusSettingsWhenSwitchedFromGridToForm(
        settings: WidgetMenuStatusModel,
        data: WidgetDetail,
        isSwitchedFromGridToForm: boolean
    ) {
        if (!settings) return;

        //console.log('buildMenuStatusSettingsWhenSwitchedFromGridToForm', new Date().getTime());

        const idRepWidgetType: number = data.idRepWidgetType;

        //Menu Button Settings for Grid
        if (
            settings.hasRightSettingButton &&
            !isSwitchedFromGridToForm &&
            idRepWidgetType >= WidgetType.DataGrid &&
            idRepWidgetType <= WidgetType.EditableTable &&
            !this.hideBtnSetting(idRepWidgetType)
        )
            settings.btnSettingGrid.enable = true;
        else settings.btnSettingGrid.enable = false;

        //Menu Button Settings for Form
        if (
            settings.hasRightSettingButton &&
            (isSwitchedFromGridToForm ||
                idRepWidgetType <= WidgetType.FieldSet ||
                idRepWidgetType > WidgetType.Combination) &&
            !this.hideBtnSetting(idRepWidgetType)
        )
            settings.btnSettingForm.enable = true;
        else settings.btnSettingForm.enable = false;
    }

    public isSupportWidgetSetting(idRepWidgetType: number) {
        switch (idRepWidgetType) {
            case WidgetType.CustomerHistory:
            case WidgetType.OrderDataEntry:
            case WidgetType.FileExplorer:
            case WidgetType.ToolFileTemplate:
            case WidgetType.FileExplorerWithLabel:
                return false;
        }
        return true;
    }

    public isShowToogleButton(idRepWidgetType: number) {
        switch (idRepWidgetType) {
            case WidgetType.FileExplorer:
            case WidgetType.ToolFileTemplate:
            case WidgetType.FileExplorerWithLabel:
            case WidgetType.FileTemplate:
                return true;
        }
        return false;
    }

    public isSupportPrint(idRepWidgetType: number) {
        let supportPrint = false;
        switch (idRepWidgetType) {
            case WidgetType.FieldSet:
            case WidgetType.FieldSetReadonly:
            case WidgetType.EditableGrid:
            case WidgetType.EditableRoleTreeGrid:
            case WidgetType.DataGrid:
            case WidgetType.Combination:
            case WidgetType.CombinationCreditCard:
            case WidgetType.Country:
            case WidgetType.TreeView:
            case WidgetType.TableWithFilter:
            case WidgetType.Chart:
            case WidgetType.NoteForm:
                supportPrint = true;
                break;
        }
        return supportPrint;
    }

    public isSupportSearch(idRepWidgetType: number) {
        let support = false;
        switch (idRepWidgetType) {
            case WidgetType.ExportBlockedCustomer:
                support = true;
                break;
        }
        return support;
    }

    public isSupportExcelExport(idRepWidgetType: number) {
        let support = false;
        switch (idRepWidgetType) {
            case WidgetType.ExportBlockedCustomer:
                support = true;
                break;
        }
        return support;
    }

    public hideBtnSetting(idRepWidgetType: number) {
        switch (idRepWidgetType) {
            case WidgetType.PdfViewer:
            case WidgetType.SAVLetter:
            case WidgetType.SAVSendLetter:
                return true;
        }
        return false;
    }
}
