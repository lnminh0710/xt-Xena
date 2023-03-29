import { ControlBase } from './control-base';

export class PriorityControl extends ControlBase<any> {
  public controlType: string = 'priority';
  public displayValue: string = '';
  public options: {
    key: string;
    value: string;
    payload?: string;
    selected: boolean;
    priority: number;
  }[] = [];
  public identificationKey: any = null;
  public type: string = '';

  public constructor(init?: Partial<PriorityControl>) {
    super(init);
    Object.assign(this, init);
  }
}
