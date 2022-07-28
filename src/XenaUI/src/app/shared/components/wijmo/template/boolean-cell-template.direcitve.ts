import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[booleanCellTemplate]' })
export class BooleanCellTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
