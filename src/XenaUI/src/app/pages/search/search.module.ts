import { NgModule, ErrorHandler } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import { GlobalSearchModule } from 'app/shared/components/global-search/global-search.module';
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
import { SearchRoutingModule } from './search.routes';
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

@NgModule({
  bootstrap: [SearchComponent],
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    StateManagementModule,
    SearchRoutingModule,
    GlobalSearchModule,
    EffectsModule.forRoot([GlobalSearchEffects]),
  ],
  exports: [SearchComponent],
  providers: [
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
    GlobalSettingConstant,
    GlobalSearchConstant,
    PageSize,
    AppErrorHandler,
    TabsetConfig,
    GlobalSearchService,
    PropertyPanelService,
    SearchService,
    ToasterService,
    DeviceDetectorService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
})
export class SearchModule {}
