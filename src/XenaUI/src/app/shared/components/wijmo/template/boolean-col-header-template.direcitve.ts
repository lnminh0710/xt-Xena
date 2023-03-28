import { Directive, Input, TemplateRef } from "@angular/core";

@Directive({ selector: "[booleanColHeaderTemplate]" })
export class BooleanColHeaderTemplateDirective {
    constructor(public template: TemplateRef<any>) {}
}
