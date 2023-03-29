import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import * as primengModule from 'primeng/primeng';
import { MaterialModule } from '../xn-control/light-material-ui/material.module';
import { DragulaModule } from 'ng2-dragula';
import { ResizableModule } from 'angular-resizable-element';
import { CollapseModule, PopoverModule } from 'ngx-bootstrap';
import { XnClickOutsideModule } from 'app/shared/directives/xn-click-outside/xn-click-outside.module';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { XnWjDropdownHelperModule } from 'app/shared/directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module';
import { XnPipeModule } from 'app/shared/components/xn-control/xn-pipe';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';
import { AngularMultiSelectModule } from '../xn-control/xn-dropdown';

import { XnFileExplorerComponent } from '../xn-file/xn-file-explorer';
import {
  FileTreeViewComponent,
  FileUploadModule,
  FileUploadPopupComponent,
  ListTemplateOfFileComponent,
  XnFileUploadModule,
  XnTableUploadedFilesComponent,
} from './index';
import { ArticleMediaManagerModule } from '../xn-control/article-media-manager';
import { AngularSplitModule } from 'angular-split';
import { XnTriggerClickInsideCboDirectiveModule } from '../../directives/xn-trigger-click-inside-cbo/xn-trigger-click-inside-cbo.module';
import { XnAgGridModule } from '../xn-control/xn-ag-grid';
import { XnContextMenuModule } from '../../directives/xn-context-menu/xn-context-menu.module';
import { FormSupportModule } from '../form/common/form-support';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfectScrollbarModule.forRoot(),
    primengModule.DialogModule,
    MaterialModule,
    DragulaModule,
    ResizableModule,
    AngularSplitModule,
    CollapseModule.forRoot(),
    PopoverModule.forRoot(),
    XnClickOutsideModule,
    WjInputModule,
    WjNavModule,
    AngularMultiSelectModule,
    XnWjDropdownHelperModule,
    XnTriggerClickInsideCboDirectiveModule,
    XnPipeModule,
    XnTooltipModule,
    XnAgGridModule,
    XnContextMenuModule,
    XnFileUploadModule,
    FormSupportModule,
    FileUploadModule,
    ArticleMediaManagerModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    XnInputNumericModule,
  ],
  declarations: [
    XnFileExplorerComponent,
    FileUploadPopupComponent,
    ListTemplateOfFileComponent,
    XnTableUploadedFilesComponent,
    FileTreeViewComponent,
  ],
  exports: [
    XnFileExplorerComponent,
    FileUploadPopupComponent,
    ListTemplateOfFileComponent,
    XnTableUploadedFilesComponent,
    FileTreeViewComponent,
  ],
})
export class XnFileModule {}
