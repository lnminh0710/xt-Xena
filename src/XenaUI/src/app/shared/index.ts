import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WIDGETS_COMPONENTS } from './components';
import { XnDropdownModule } from './directives/xn-dropdown/xn-dropdown.directive.module';
import { XnImageLoaderModule } from './directives/xn-image-loader/xn-image-loader.module';
import { XnOnlyNumberModule } from './directives/xn-only-number/xn-only-number.module';
import { XnDetectScrollModule } from './directives/xn-scroll-event/xn-scroll-event.module';
import { XnClickOutsideModule } from './directives/xn-click-outside/xn-click-outside.module';
import { XnTriggerClickInsideCboDirectiveModule } from './directives/xn-trigger-click-inside-cbo/xn-trigger-click-inside-cbo.module';
import { XnAppendStyleModule } from './directives/xn-append-style/xn-append-style.module';
import { XnWjDropdownHelperModule } from './directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module';
import { RlTagInputModule } from 'angular2-tag-input';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { ResizableModule } from 'angular-resizable-element';
import * as primengModule from 'primeng/primeng';
import { AngularSplitModule } from 'angular-split';
import { NgGridModule } from './components/grid-stack';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { XnFileUploadModule } from './components/xn-file';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';
import { TextMaskModule } from 'angular2-text-mask';
// import { APP_PIPES } from 'app/pipes';
import * as widget from './components/widget';
import * as customerHistory from './components/customer-history';
import { QuillModule } from 'ngx-quill';
import { NgxMyDatePickerModule } from 'app/shared/components/xn-control/xn-date-picker/ngx-my-date-picker/ngx-my-date-picker.module';
import { TabsModule } from 'ngx-bootstrap/tabs/tabs.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { XnDatePickerModule } from 'app/shared/components/xn-control/xn-date-picker';
import { XnInputDebounceModule } from './components/xn-control/xn-input-debounce/xn-input-debounce.module';
import { XnPagerModule } from 'app/shared/components/xn-pager/xn-pagination.module';
import { AgGridModule } from 'ag-grid-angular';
import { TemplateHeaderCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/header-cell-renderer/template-header-cell-renderer/template-header-cell-renderer.component';
import { TemplateCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/template-cell-renderer/template-cell-renderer.component';
import { TemplateEditCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/template-edit-cell-renderer/template-edit-cell-renderer.component';

import { GlobalSearchModule } from './components/global-search/global-search.module';
import { MaterialModule } from './components/xn-control/light-material-ui/material.module';
import { ExtendedFilterGridModule } from './components/extended-filter-grid/extended-filter-grid.module';
import { WijmoGridSelectionModule } from './components/wijmo/wijmo-grid-selection/wijmo-grid-selection.module';
import { FrequencyGridModule } from './components/frequency-grid/frequency-grid.module';
import { GroupPriorityGridModule } from './components/group-priority-grid/group-priority-grid.module';
import { ImageZoomerModule } from './components/image-zoomer/image-zoomer.module';
import { MediacodePricingGridModule } from './components/mediacode-pricing-grid/mediacode-pricing-grid.module';
import { NotificationBoxModule } from './components/notification-box/notification-box.module';
import { ParkedItemModule } from './components/parked-item/parked-item.module';
import { AgeFilterGridModule } from './components/age-filter-grid/age-filter-grid.module';
import { CountryBlacklistModule } from './components/country-blacklist';
import { XnContextMenuModule } from './directives/xn-context-menu/xn-context-menu.module';
import { XnDragDropModule } from './directives/xn-dragable/xn-dragable.module';
import { ControlSidebarModule } from './components/layout';
import { XnMenuBarModule } from './components/xn-menu-bar/xn-menu-bar.module';
import { XnGalleriaModule } from './components/xn-control/xn-galleria/xn-galleria.module';
import { ClearTextModule } from './components/xn-control/clear-text/clear-text.module';
import * as controlModule from './components/xn-control';
import { FileUploadModule } from './components/xn-file';
import { TabBusinessCostStatusModule } from './components/xn-tab';
import { FormSupportModule, UserManagementModule } from './components/form';
import { CountrySelectionModule } from './components/country-selection';
import { CustomerHistoryModule } from './components/customer-history';
import { WijmoGridModule } from './components/wijmo';
import { DatabaseCombineGridModule } from './components/database-combine-grid';
import { WidgetChartModule } from './components/widget/components/widget-chart/widget-chart.module';
import { WidgetPdfModule } from './components/widget/components/widget-pdf';
import { ProcessSelectionExportModule } from './components/widget/directives/process-selection-export.module';
import { DelayContentModule } from './components/widget/directives/delay-content.module';
import { SelectionProjectDetailModule } from './components/selection-project-detail/selection-project-detail.module';
import { PropertyPanelModule } from 'app/shared/components/property-panel/property-panel.module';
import { XnPipeModule } from 'app/shared/components/xn-control/xn-pipe';
import { AngularMultiSelectModule } from 'app/shared/components/xn-control/xn-dropdown';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';
import { XnGridTranslationModule } from 'app/shared/directives/xn-grid-translation';
import { XnFileModule } from './components/xn-file/XnFileModule';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { WidgetInfoTranslationModule } from './components/widget/components/widget-module-info-translation/widget-info-translation.module';
import { SavSendLetterModule } from './components/widget/components/sav-send-letter';
import { TooltipModule } from 'ngx-bootstrap';
import { MatFormFieldModule } from './components/xn-control/light-material-ui/form-field';
import { MatInputModule } from './components/xn-control/light-material-ui/input';
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        XnDropdownModule,
        XnContextMenuModule,
        XnImageLoaderModule,
        XnOnlyNumberModule,
        XnTooltipModule,
        TooltipModule.forRoot(),
        XnDragDropModule,
        XnDetectScrollModule,
        XnClickOutsideModule,
        XnTriggerClickInsideCboDirectiveModule,
        XnAppendStyleModule,
        XnWjDropdownHelperModule,
        ProcessSelectionExportModule,
        DragulaModule,
        PerfectScrollbarModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        CollapseModule.forRoot(),
        PopoverModule.forRoot(),
        ResizableModule,
        DndModule.forRoot(),
        AngularSplitModule,
        NgGridModule,
        primengModule.DialogModule,
        SlimLoadingBarModule.forRoot(),
        XnFileUploadModule,
        WjCoreModule,
        WjGridModule,
        WjInputModule,
        WjGridFilterModule,
        WjGridDetailModule,
        WjNavModule,
        TextMaskModule,
        QuillModule,
        NgxMyDatePickerModule.forRoot(),
        MaterialModule,
        XnDatePickerModule,
        XnAgGridModule,
        XnInputDebounceModule,
        XnPagerModule,
        AgGridModule.withComponents([
            TemplateHeaderCellRenderer,
            TemplateCellRenderer,
            TemplateEditCellRenderer
        ]),
        RlTagInputModule,
        // Split into module
        GlobalSearchModule,
        ProgressbarModule.forRoot(),
        WijmoGridSelectionModule,
        AgeFilterGridModule,
        CountryBlacklistModule,
        ExtendedFilterGridModule,
        FrequencyGridModule,
        GroupPriorityGridModule,
        ImageZoomerModule,
        MediacodePricingGridModule,
        NotificationBoxModule,
        ParkedItemModule,
        ControlSidebarModule,
        XnMenuBarModule,
        XnGalleriaModule,
        ClearTextModule,
        controlModule.ArticleMediaManagerModule,
        FileUploadModule,
        UserManagementModule,
        CountrySelectionModule,
        CustomerHistoryModule,
        WidgetChartModule,
        WidgetPdfModule,
        SavSendLetterModule,
        XnFileModule,
        DelayContentModule,
        SelectionProjectDetailModule,
        // region [Common Modules]
        TabBusinessCostStatusModule,
        FormSupportModule,
        controlModule.SelCountryCheckListModule,
        WijmoGridModule,
        DatabaseCombineGridModule,
        XnPipeModule,
        // endregion [Common Modules]
        PropertyPanelModule,
        AngularMultiSelectModule,
        XnInputNumericModule,
        XnGridTranslationModule,
        WidgetInfoTranslationModule,
        XnResourceTranslationModule,
        LabelTranslationModule,
        // MatFormFieldModule,
        MatInputModule,
    ],
    declarations: [
        ...WIDGETS_COMPONENTS
    ],
    entryComponents: [widget.PaperworkComponent,
    widget.DialogUserRoleComponent,
    customerHistory.HistoryDialogComponent,
    widget.DialogResourceTranslationComponent,
    widget.ResourceTranslationFormComponent],
    exports: [
        CommonModule,
        ...WIDGETS_COMPONENTS,
        XnDropdownModule,
        XnContextMenuModule,
        XnImageLoaderModule,
        XnOnlyNumberModule,
        XnTooltipModule,
        XnClickOutsideModule,
        XnWjDropdownHelperModule,
        ProcessSelectionExportModule,
        XnInputNumericModule,
        XnGridTranslationModule,
        XnResourceTranslationModule,
        LabelTranslationModule
    ],
    providers: [
        DatePipe
    ]
})
export class XnSharedModule { }
