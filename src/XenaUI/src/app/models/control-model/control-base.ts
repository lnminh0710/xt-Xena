export class ControlBase<T> {
    public value: T;
    public originalValue: T;
    public key: string = "";
    public label: string = "";
    public required: boolean = false;
    public order: number = 1;
    public controlType: string = "";
    public readOnly: boolean = false;
    public isHidden: boolean = false;
    public isFocusing: boolean = false;
    public icon?: any = false;
    public pattern: any = "";
    public messageReg?: string = "";
    public filterBy: string = "";
    // Value align
    public align: string = "";
    // Label align
    public labelAlign: string = "";
    public maxLength: number = 500;
    public children?: Array<ControlBase<T>> = null;
    public fromOption?: string;
    public alias?: string;
    public type?: string;
    public identificationKey?: string;
    public hasJustUpdated: boolean = false;
    public options: Array<any> = [];
    public config: string = "[]";

    public constructor(init?: Partial<ControlBase<T>>) {
        Object.assign(this, init);
    }
}
