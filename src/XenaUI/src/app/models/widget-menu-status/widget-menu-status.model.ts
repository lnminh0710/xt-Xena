import { AccessRightWidgetCommandButtonEnum } from "app/app.constants";

export class WidgetMenuStatusModel {
    private accessRight: any = {};
    public enable: boolean = false;
    public style: any = {};
    public class: WidgetMenuStatusClassModel = new WidgetMenuStatusClassModel();

    //Settings for Grid
    public btnSettingGrid: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    //Settings for Form
    public btnSettingForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    //Settings for Grid and Form
    public btnSettingGridAndForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnToolbar: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnRefresh: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnBackToWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel(); //Back to Widget
    public btnEditForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnEditEditableTable: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnEditWidgetOptions: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnEditCountryWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnEditTreeViewWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnUploadFileWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnWidgetTranslation: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnWidgetTranslationOptions: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnAddPerson: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnAddRowForEditableTableWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnAddNoteForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnPrintWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnArticleNameTranslation: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnGoToNextcolumnOrRow: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnEditTemplate: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnTableFieldsTranslate: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveSettings: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnOpenUserRoleDialog: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnOpenTranslateForCombineWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnOpenNewWindow: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnResetWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnSaveCountryWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveTreeViewWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveWidgetForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveFileExplorerWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveEditableTableWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveDesignColumnLayout: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSaveNoteForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnPrintAndConfirm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnSupportSearch: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnSupportExcelExport: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();
    public btnMaximizeWidget: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel(); //Toggle: true: maximize, false: restore

    public btnSavePaymentTypeForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public btnSaveSAVTemplateForm: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    //Textbox/ Input
    public txtFilterTable: WidgetMenuStatusPropertyModel =
        new WidgetMenuStatusPropertyModel();

    public constructor(init?: Partial<WidgetMenuStatusModel>) {
        Object.assign(this, init);
    }

    //#region AccessRight
    public hasRightEdit: boolean = false;
    public hasRightDelete: boolean = false;
    public hasRightSettingButton: boolean = false;
    public hasRightToolbarButton: boolean = false;
    public hasRightToolbarButton_TranslateButton: boolean = false;
    public hasRightToolbarButton_PrintButton: boolean = false;
    public hasRightToolbarButton_EditTemplateButton: boolean = false;
    public hasRightToolbarButton_FieldTranslateButton: boolean = false;

    public getAccessRightForCommandButton(buttonName: string): boolean {
        if (this.accessRight && this.accessRight["orderDataEntry"]) return true;

        if (
            !this.accessRight ||
            !this.accessRight[AccessRightWidgetCommandButtonEnum[buttonName]]
        )
            return false;

        return this.accessRight[AccessRightWidgetCommandButtonEnum[buttonName]][
            "read"
        ];
    }

    public getAccessRight(commandName: string): boolean {
        if (this.accessRight && this.accessRight["orderDataEntry"]) return true;

        return this.accessRight[commandName];
    }

    public setAccessRight(accessRight: any) {
        this.accessRight = accessRight;

        this.hasRightEdit = this.getAccessRight("edit");
        this.hasRightDelete = this.getAccessRight("delete");

        this.hasRightSettingButton =
            this.getAccessRightForCommandButton("SettingButton");
        this.hasRightToolbarButton =
            this.getAccessRightForCommandButton("ToolbarButton");
        this.hasRightToolbarButton_TranslateButton =
            this.getAccessRightForCommandButton(
                "ToolbarButton__TranslateButton"
            );
        this.hasRightToolbarButton_PrintButton =
            this.getAccessRightForCommandButton("ToolbarButton__PrintButton");
        this.hasRightToolbarButton_EditTemplateButton =
            this.getAccessRightForCommandButton(
                "ToolbarButton__EditTemplateButton"
            );
        this.hasRightToolbarButton_FieldTranslateButton =
            this.getAccessRightForCommandButton(
                "ToolbarButton__FieldTranslateButton"
            );
    }
    //#endregion
}

export class WidgetMenuStatusPropertyModel {
    public enable: boolean = false;
    public class: any = {};
    public style: any = {};
    public events: any = {};
    public data: any = {};

    public constructor(init?: Partial<WidgetMenuStatusPropertyModel>) {
        Object.assign(this, init);
    }
}

export class WidgetMenuStatusClassModel {
    public editTemplateMode: boolean = false;

    // Show/Hide the box which contains the 'tool buttons': Edit, Save, Print, Translate, Go to Next Column/Row,...
    // True: show, False: hide
    public showToolButtons: boolean = false;

    // Show/Hide the box which contains the 'setting buttons': Toolbar, Setting, Refressh
    //True: hide, False: show
    public visibilityHiddenFront: boolean = false;

    //moveUp = True -> The 'move-up' class will help hidden the box Reset/ Back button When the box 'setting buttons' showing
    //moveUp = False when the 'tool buttons' showing
    public moveUp: boolean = true;

    public constructor(init?: Partial<WidgetMenuStatusClassModel>) {
        Object.assign(this, init);
    }
}
