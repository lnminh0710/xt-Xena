export class Module {
    public idSettingsGUI?: number = null;
    public idSettingsGUIParent?: number = null;
    public moduleName?: string = '';
    public moduleNameTrim?: string = '';
    public iconName?: string = '';
    public iconNameOver?: string = '';
    public isCanNew?: boolean = false;
    public isCanSearch?: boolean = false;
    public toDisplay?: string = '';
    public isClickable?: boolean = false;
    public searchIndexKey?: string = '';
    public searchKeyword?: string = '';
    public isChecked?: boolean = false;
    public children?: Module[] = null;
    public accessRight?: any;
    public numberValue?: any;

    public constructor(init?: Partial<Module>) {
        Object.assign(this, init);
        this.moduleNameTrim = this.moduleName ? this.moduleName.replace(/\s/g, "").replace(/\&/g, "") : '';
    }
}
