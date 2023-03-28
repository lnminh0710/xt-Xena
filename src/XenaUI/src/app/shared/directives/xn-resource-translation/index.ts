import { NgModule } from "@angular/core";
import { ResourceTranslationDirective } from "app/shared/directives/xn-resource-translation/xn-resource-translation.directive";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";

@NgModule({
    imports: [LabelTranslationModule],
    declarations: [ResourceTranslationDirective],
    exports: [ResourceTranslationDirective],
    providers: [],
})
export class XnResourceTranslationModule {}
