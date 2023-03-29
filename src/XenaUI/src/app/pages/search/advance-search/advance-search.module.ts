import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppErrorHandler,
  CanActivateGuard,
  UserService,
  AuthenticationService,
  CommonService,
  ModalService,
  ModuleService,
  AccessRightsService,
  ParkedItemService,
  GlobalSettingService,
  ModuleSettingService,
  TabService,
  WidgetTemplateSettingService,
  PersonService,
  ObservableShareService,
  ArticleService,
  CampaignService,
  DatatableService,
  DataEntryService,
  ProjectService,
  GlobalSearchService,
  PropertyPanelService,
  SearchService,
  DeviceDetectorService,
} from 'app/services';
import { StateManagementModule } from 'app/state-management';
import {
  GlobalSettingConstant,
  GlobalSearchConstant,
  PageSize,
} from 'app/app.constants';
import { TabsetConfig } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { EffectsModule } from '@ngrx/effects';
import { GlobalSearchEffects } from 'app/state-management/effects';
import { AdvanceSearchRoutingModule } from './advance-search.routes';
import { AdvanceSearchComponent } from './advance-search.component';
import { AdvanceSearchBuilderModule } from 'app/shared/components/advance-search-builder/advance-search-builder.module';
import { AdvanceSearchProfileModule } from 'app/shared/components/advance-search-profile';
import { MaterialModule } from 'app/shared/components/xn-control/light-material-ui/material.module';
import { XnMessageModalModule } from 'app/shared/components/xn-control/xn-message-modal';
import { TooltipModule } from 'ngx-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { AngularSplitModule } from 'angular-split';
import { FormsModule } from '@angular/forms';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  bootstrap: [AdvanceSearchComponent],
  declarations: [AdvanceSearchComponent],
  imports: [
    CommonModule,
    StateManagementModule,
    AdvanceSearchRoutingModule,
    AdvanceSearchBuilderModule,
    AdvanceSearchProfileModule,
    MaterialModule,
    FormsModule,
    TooltipModule.forRoot(),
    PerfectScrollbarModule,
    ToasterModule,
    AngularSplitModule,
    XnMessageModalModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
  ],
  exports: [AdvanceSearchComponent],
  providers: [
    CanActivateGuard,
    UserService,
    ModuleSettingService,
    PropertyPanelService,
    GlobalSettingService,
    AuthenticationService,
    CommonService,
    ModalService,
    SearchService,
    AppErrorHandler,
    GlobalSettingService,
    GlobalSettingConstant,
    ToasterService,
    DeviceDetectorService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
})
export class AdvanceSearchModule {}
