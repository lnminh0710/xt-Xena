import { ControlBase, TextboxControl, DropdownControl, RangeControl } from 'app/models';

/**
 * DynamicFilterBase
 */
export class DynamicFilterBase {

    constructor() {
    }
     
    /**
     * findDropdownControlByCondition
     * @param key
     */
    protected findDropdownControlByCondition(value, controlList: Array<ControlBase<any>>, condition: string): DropdownControl {
        let targetControl: any = null;
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];
            if (control[condition] == value) {
                targetControl = control;
                break;
            }
            if (control.children && control.children.length) {
                targetControl = this.findDropdownControlByCondition(value, control.children, condition);
                if (targetControl) {
                    break;
                }
            }
        }
        return targetControl;
    }

    /**
     * getIdentificationKeyList
     */
    protected getIdentificationKeyList(identificationKeyList: Array<string>, controlList: Array<ControlBase<any>>) {
        for (let i = 0; i < controlList.length; i++) {
            let control = controlList[i];
            if (control.controlType === 'dropdown' && (control as DropdownControl).identificationKey) {
                identificationKeyList.push((control as DropdownControl).identificationKey);
            }
            if (control.children && control.children.length) {
                this.getIdentificationKeyList(identificationKeyList, control.children);
            }
        }
    }

    /**
     * setHidden
     * @param controlList
     */
    protected setHidden(controlList: Array<ControlBase<any>>) {
        controlList.forEach((control) => {
            control.isHidden = true;
            if (control.children && control.children.length) {
                this.setHidden(control.children);
            }
        });
    }
}
