import {
    FilterModeEnum,
    WidgetLayoutSettingModeEnum,
    WidgetFormTypeEnum,
} from "app/app.constants";

export class FilterMode {
    public mode: FilterModeEnum = FilterModeEnum.ShowAll;
    public value: string = "";
    public selected: boolean = false;
    public isSub: boolean = false;

    public constructor(init?: Partial<FilterMode>) {
        Object.assign(this, init);
    }
}

export class FieldFilter {
    public fieldDisplayName: string = "";
    public fieldName: string = "";
    public dataType?: string = "";
    public selected: boolean = false;
    public isHidden: boolean = false;
    public isEditable: boolean = true;
    public isTableField: boolean = false;

    public constructor(init?: Partial<FieldFilter>) {
        Object.assign(this, init);
    }
}

export class ColumnLayoutSetting {
    public isFitWidthColumn: boolean = false;
    public columnLayout: any = null;

    public constructor(init?: Partial<ColumnLayoutSetting>) {
        Object.assign(this, init);
    }
}

export class RowSetting {
    public showTotalRow: boolean = false;
    public positionTotalRow: string = "";
    public backgroundTotalRow: string = "";
    public colorTextTotalRow: string = "";

    public constructor(init?: Partial<RowSetting>) {
        Object.assign(this, init);
    }
}

export class WidgetLayoutSettingMode {
    public widgetLayoutSettingMode: WidgetLayoutSettingModeEnum = null;
    public selected: boolean = false;
    public label: string = "";

    public constructor(init?: Partial<WidgetLayoutSettingMode>) {
        Object.assign(this, init);
    }
}

export class WidgetFormType {
    public widgetFormType: WidgetFormTypeEnum = null;
    public selected: boolean = false;
    public label: string = "";

    public constructor(init?: Partial<WidgetFormType>) {
        Object.assign(this, init);
    }
}
