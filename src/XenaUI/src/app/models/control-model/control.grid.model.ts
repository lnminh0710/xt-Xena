export class ControlGridModel {
    public data: Array<any> = [];
    public columns: ControlGridColumnModel[] = [];
    public totalResults?: number; // Used for paging , this value is total rows
    public autoGroupColumnDef?: AutoGroupColumnDefModel;
    public idSettingsGUI?: number = null;
    public funcGetData?: Function = null;

    public constructor(init?: Partial<ControlGridModel>) {
        Object.assign(this, init);
    }
}

export class ControlGridColumnModel {
    public title: any = null;
    public data: any = null;
    public visible: boolean = true;
    public readOnly: boolean = true;
    public dataType?: string;
    public setting: any = null;
    public controlType?: string;
    public minWidth?: any = null;

    public constructor(init?: Partial<ControlGridColumnModel>) {
        Object.assign(this, init);
    }
}

export class AutoGroupColumnDefModel {
    public headerName?: string = null;
    public minWidth?: number = null;
    public width?: number = null;
    public isFitColumn?: boolean;

    public constructor(init?: Partial<AutoGroupColumnDefModel>) {
        Object.assign(this, init);
    }
}
