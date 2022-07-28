import { ControlBase } from './control-base';

export class DropdownControl extends ControlBase<any> {
    public controlType: string = 'dropdown';
    public displayValue: string = '';
    public options: { key: string, value: string, payload?: string }[] = [];
    public identificationKey: any = null;
    public type: string = '';

    public constructor(init?: Partial<DropdownControl>) {
        super(init);
        Object.assign(this, init);
    }
}
