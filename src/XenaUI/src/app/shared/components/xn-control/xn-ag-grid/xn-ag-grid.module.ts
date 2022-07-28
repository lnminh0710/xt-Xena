import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { XnAgGridComponent } from './pages/ag-grid-container/xn-ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import {
    CheckboxReadOnlyCellRenderer,
    CheckboxEditableCellRenderer,
    ControlCheckboxCellRenderer,
    DropdownCellRenderer,
    PriorityDropdownCellRenderer,
    CheckboxHeaderCellRenderer,
    ButtonAndCheckboxHeaderCellRenderer,
    DeleteCheckboxHeaderCellRenderer,
    NumericEditableCellRenderer,
    TemplateButtonCellRenderer,
    CountryFlagCellRenderer,
    IconCellRenderer,
    DateCellRenderer,
    CustomPinnedRowRenderer,
    CustomHeaderCellRenderer,
    TranslationToolPanelRenderer,
    CreditCardCellRenderer,
    SelectAllCheckboxHeaderCellRenderer,
    XnAgGridHeaderComponent,
    TemplateHeaderCellRenderer,
    TemplateCellRenderer,
    TemplateEditCellRenderer,
    BaseHeaderCellRenderer,
    RefTextboxCellRenderer,
    MasterUnmergeCheckboxCellRenderer,
    AutoCompleteCellRenderer,
    DetailCellRenderer,
    LanguageCellRenderer,
    ButtonAndCheckboxCellRenderer
} from './components';
import { XnDatePickerModule } from '../xn-date-picker';
import { LicenseManager } from 'ag-grid-enterprise';
import { XnInputDebounceModule } from '../xn-input-debounce/xn-input-debounce.module';
import { XnPagerModule } from 'app/shared/components/xn-pager/xn-pagination.module';
import { MatCheckboxModule } from '../light-material-ui/checkbox';
import { MatButtonModule } from '../light-material-ui/button';
import { XnDragDropModule } from 'app/shared/directives/xn-dragable/xn-dragable.module';
import { XnWjDropdownHelperModule } from 'app/shared/directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module';
import { AngularMultiSelectModule } from 'app/shared/components/xn-control/xn-dropdown';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
import {QuantityKeepRendererComponent} from './components/quantity-keep-renderer/quantity-keep-renderer.component';
import {QuantityBackToWareHouseRendererComponent} from './components/quantity-back-to-ware-house-renderer/quantity-back-to-ware-house-renderer.component';
import {QuantityDefectRendererComponent} from './components/quantity-defect-renderer/quantity-defect-renderer.component';
LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_Valid_Until26_January_2019__MTU0ODQ2MDgwMDAwMA==21a7453ae27248a2d469f10e8f54b791');

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        XnInputDebounceModule,
        AgGridModule.withComponents([
            CheckboxReadOnlyCellRenderer,
            CheckboxEditableCellRenderer,
            ControlCheckboxCellRenderer,
            DropdownCellRenderer,
            PriorityDropdownCellRenderer,
            CheckboxHeaderCellRenderer,
            DeleteCheckboxHeaderCellRenderer,
            SelectAllCheckboxHeaderCellRenderer,
            NumericEditableCellRenderer,
            TemplateButtonCellRenderer,
            CountryFlagCellRenderer,
            IconCellRenderer,
            DateCellRenderer,
            CustomPinnedRowRenderer,
            CustomHeaderCellRenderer,
            TranslationToolPanelRenderer,
            CreditCardCellRenderer,
            TemplateHeaderCellRenderer,
            TemplateCellRenderer,
            TemplateEditCellRenderer,
            RefTextboxCellRenderer,
            MasterUnmergeCheckboxCellRenderer,
            AutoCompleteCellRenderer,
            DetailCellRenderer,
            LanguageCellRenderer,
            QuantityKeepRendererComponent,
            QuantityBackToWareHouseRendererComponent,
            QuantityDefectRendererComponent,
            ButtonAndCheckboxHeaderCellRenderer,
            ButtonAndCheckboxCellRenderer
        ]),
        WjCoreModule,
        WjInputModule,
        MatCheckboxModule,
        MatButtonModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        XnDatePickerModule,
        XnDragDropModule,
        XnPagerModule,
        XnWjDropdownHelperModule,
        AngularMultiSelectModule,
        XnTooltipModule,
        XnInputNumericModule
    ],
    declarations: [
        XnAgGridComponent,
        CheckboxReadOnlyCellRenderer,
        CheckboxEditableCellRenderer,
        ControlCheckboxCellRenderer,
        DropdownCellRenderer,
        PriorityDropdownCellRenderer,
        CheckboxHeaderCellRenderer,
        DeleteCheckboxHeaderCellRenderer,
        SelectAllCheckboxHeaderCellRenderer,
        NumericEditableCellRenderer,
        TemplateButtonCellRenderer,
        CountryFlagCellRenderer,
        IconCellRenderer,
        DateCellRenderer,
        CustomPinnedRowRenderer,
        CustomHeaderCellRenderer,
        TranslationToolPanelRenderer,
        CreditCardCellRenderer,
        XnAgGridHeaderComponent,
        TemplateHeaderCellRenderer,
        TemplateCellRenderer,
        TemplateEditCellRenderer,
        BaseHeaderCellRenderer,
        RefTextboxCellRenderer,
        MasterUnmergeCheckboxCellRenderer,
        AutoCompleteCellRenderer,
        DetailCellRenderer,
        LanguageCellRenderer,
        QuantityKeepRendererComponent,
        QuantityBackToWareHouseRendererComponent,
        QuantityDefectRendererComponent,
        ButtonAndCheckboxHeaderCellRenderer,
        ButtonAndCheckboxCellRenderer
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [XnAgGridComponent]
})
export class XnAgGridModule { }
