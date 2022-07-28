/**
 * DynamicRulesType
 */
export class DynamicRulesType {
    public id: string;
    public value: string;
    public config: any;
    public dropdownKey: string;
    public filterRules: string;

    public constructor(init?: Partial<DynamicRulesType>) {
        Object.assign(this, init);
    }
}
