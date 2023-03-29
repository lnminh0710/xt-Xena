import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { DragulaModule } from 'ng2-dragula';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'primeng/primeng';
import { ResizableModule } from 'angular-resizable-element';
import { DndModule } from 'ng2-dnd';
import { XnSharedModule } from 'app/shared';
import { StateManagementModule } from 'app/state-management';
import { AngularSplitModule } from 'angular-split';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppErrorHandler } from 'app/services';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { PrivateRoutingModule } from './private.routes';
import { PrivateComponent } from './private.component';
import { WIDGETS_COMPONENTS } from './';
import { APP_SERVICES } from 'app/services';
import { PrivateLoadResolve } from './private-load.resolve';
import { QueryBuilderModule } from 'app/shared/components/xn-control/query-builder';
import { GlobalSearchModule } from 'app/shared/components/global-search/global-search.module';
import { ParkedItemModule } from 'app/shared/components/parked-item/parked-item.module';
import { XnWorkingModulesModule } from 'app/shared/components/xn-working-modules/xn-working-modules.module';
import { PropertyPanelModule } from 'app/shared/components/property-panel/property-panel.module';
import { ModuleWelcomeModule } from 'app/shared/components/module-welcome/module-welcome.module';
import { AppHeaderModule } from 'app/shared/components/layout';
import { ControlSidebarModule } from 'app/shared/components/layout';
import { EffectsModule } from '@ngrx/effects';
import {
  MainModuleEffects,
  ParkedItemEffects,
  TabSummaryEffects,
  WidgetTemplateSettingEffects,
  ModuleSettingEffects,
  XnCommonEffects,
  HotkeySettingEffects,
  GlobalSearchEffects,
  WidgetContentDetailEffects,
} from 'app/state-management/effects';
import { XnMessageModalModule } from 'app/shared/components/xn-control/xn-message-modal';
import { XnFileModule } from '../../shared/components/xn-file/XnFileModule';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';

let modules = [
  ModalModule.forRoot(),
  CommonModule,
  FormsModule,
  HttpModule,
  RouterModule,
  ToasterModule,
  DragulaModule,
  PerfectScrollbarModule.forRoot(),
  GlobalSearchModule,
  SharedModule,
  ResizableModule,
  DndModule.forRoot(),
  AngularSplitModule,
  XnSharedModule,
  StateManagementModule,
  HotkeyModule.forRoot(),
  QueryBuilderModule,
  ParkedItemModule,
  PropertyPanelModule,
  XnWorkingModulesModule,
  ModuleWelcomeModule,
  AppHeaderModule,
  ControlSidebarModule,
  XnMessageModalModule,
  XnResourceTranslationModule,
  LabelTranslationModule,
];

@NgModule({
  bootstrap: [PrivateComponent],
  declarations: [PrivateComponent, ...WIDGETS_COMPONENTS],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    ...modules,
    EffectsModule.forRoot([
      MainModuleEffects,
      ParkedItemEffects,
      TabSummaryEffects,
      WidgetTemplateSettingEffects,
      ModuleSettingEffects,
      XnCommonEffects,
      HotkeySettingEffects,
      GlobalSearchEffects,
      WidgetContentDetailEffects,
    ]),
  ],
  exports: [PrivateComponent, ...WIDGETS_COMPONENTS],
  providers: [
    ...APP_SERVICES,
    { provide: ErrorHandler, useClass: AppErrorHandler },
    PrivateLoadResolve,
  ],
})
export class PrivateModule {}
