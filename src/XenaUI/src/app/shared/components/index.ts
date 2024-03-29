import * as xnTab from './xn-tab';
import { XnMediacodeDialogComponent } from './xn-mediacode-dialog';
import * as xnAdditionalInformation from './xn-additional-information';
import * as xnCentralPageView from './xn-central-page';
import * as widget from './widget';
import * as xnForm from './form';
import * as xnControl from './xn-control';
import * as xnFile from './xn-file';
import * as Wijmo from './wijmo';
import {
  OrderDataEntryTabComponent,
  OrderDataEntryTabPlusComponent,
} from './order-data-entry';

export const WIDGETS_COMPONENTS = [
  xnTab.XnTabComponent,
  xnTab.XnTabButtonComponent,
  xnTab.XnTabContentComponent,
  xnTab.XnTabContentNewMainTabComponent,
  xnTab.XnTabContentNewOtherTabComponent,
  xnTab.XnTabHeaderComponent,
  xnTab.XnTabHeaderSubFormComponent,
  xnTab.XnTabHeaderMenuComponent,
  xnTab.XnTabContentSimpleTabsComponent,
  xnAdditionalInformation.XnAdditionalInformationMainComponent,
  xnAdditionalInformation.XnAdditionalInformationPageComponent,
  xnAdditionalInformation.XnAdditionalInformationTabComponent,
  xnAdditionalInformation.XnAdditionalInformationTabPlusComponent,
  xnAdditionalInformation.XnAdditionalInformationTabContentComponent,
  xnCentralPageView.XnTabPageViewComponent,
  xnCentralPageView.XnSinglePageViewComponent,
  xnCentralPageView.XnDoublePageViewComponent,
  xnCentralPageView.XnDoublePageViewHorizontalComponent,
  xnCentralPageView.XnDoublePageViewVerticalComponent,
  widget.WidgetContainerComponent,
  widget.WidgetModuleComponent,
  // widget.WidgetTranslateComponent,
  widget.InlineEditComponent,
  widget.WidgetFormComponent,
  widget.WfColumnComponent,
  widget.WfPanelComponent,
  widget.WfLineBreakComponent,
  widget.WfFieldComponent,
  widget.MenuSettingFormComponent,
  widget.SettingDialogComponent,
  widget.FilterMenuComponent,
  widget.WidgetDataEntryInfoComponent,
  // widget.WidgetModuleInfoTranslationComponent,
  widget.EditDropdownComponent,
  widget.EditTranslateDropdownComponent,
  widget.WidgetEditDialogComponent,
  widget.WidgetCommunicationDialogComponent,
  widget.WidgetTranslationComponent,
  widget.PaperworkComponent,
  widget.ArrowAnimationComponent,
  widget.XnWidgetMenuStatusComponent,
  widget.WidgetUserEditingListComponent,
  widget.WidgetReloadMessageComponent,
  widget.WidgetSubtitleComponent,
  widget.WidgetArticleTranslationComponent,
  widget.WidgetArticleTranslationDialogComponent,
  widget.WidgetRoleTreeGridComponent,
  widget.WidgetBlankComponent,
  widget.DialogAddWidgetTemplateComponent,
  widget.DialogAddCustomerDoubletComponent,
  widget.ArticleTemplateImageUploadComponent,
  widget.ArticleUploadStatusComponent,
  widget.NewLotDialogComponent,
  widget.WidgetProfileSavingComponent,
  widget.WidgetProfileSelectComponent,
  widget.DialogUserRoleComponent,
  widget.DoubletteGroupComponent,
  widget.SelectionExportDataDialogComponent,
  widget.WidgetExportBlockedComponent,
  widget.DialogResourceTranslationComponent,
  widget.ResourceTranslationFormComponent,
  widget.WidgetNoteFormComponent,
  widget.EmailNoteComponent,
  XnMediacodeDialogComponent,
  xnFile.XnUploadTemplateFileComponent,
  OrderDataEntryTabComponent,
  OrderDataEntryTabPlusComponent,
  Wijmo.BooleanCellTemplateDirective,
  Wijmo.BooleanColHeaderTemplateDirective,
  xnForm.AdContactMainFieldComponent,
  xnForm.SearchMediaCodeComponent,
  xnForm.XnFormFgAddressComponent,
  xnForm.AdministrationFormComponent,
  xnForm.AdMainFieldComponent,
  xnForm.CustContactFormComponent,
  xnForm.CustomerFormComponent,
  xnForm.AdContactFormComponent,
  xnForm.AdChequesPRNComponent,
  xnForm.AdCashProviderPRNFormComponent,
  xnForm.AdCashProviderProviderCostFormComponent,
  xnForm.PaymentAccountFormComponent,
  xnForm.ArticleFormComponent,
  xnForm.ArticleSetCompositionFormComponent,
  xnForm.ArticlePurchasingFormComponent,
  xnForm.MediaCodeT2FormComponent,
  xnForm.CampaignInterReTakesFormComponent,
  xnForm.CampaignArticleFormComponent,
  xnForm.CampaignCountryT1FormComponent,
  xnForm.BusinessCostFormComponent,
  xnForm.CampaignCountryT1BFormComponent,
  xnForm.EditCheckBoxComponent,
  xnForm.BusinessCostHeaderFormComponent,
  xnForm.BusinessCostRowFormComponent,
  xnForm.CampaignCombineFormComponent,
  xnForm.PaymentTypeComponent,
  xnForm.DataEntryOrderSummaryComponent,
  xnForm.CashPaymentTypeComponent,
  xnForm.PaymentTypeSelectComponent,
  xnForm.CheckPaymentTypeComponent,
  xnForm.CreditCardPaymentTypeComponent,
  xnForm.InvoicePaymentTypeComponent,
  xnForm.ArticleGridComponent,
  xnForm.ArticleGridCampaignComponent,
  xnForm.DataEntryOrderTotalSummaryComponent,
  xnForm.DataEntryCustomerAddressComponent,
  xnForm.OrderDataEntryFormComponent,
  xnForm.CustomerDataEntryFormComponent,
  xnForm.CustomerStatusDataEntryComponent,
  xnForm.OpenInvoiceStatusDataEntryComponent,
  xnForm.NoteFormDataEntryComponent,
  xnForm.CustomerOrderDataEntryComponent,
  xnForm.CommunicationDataEntryComponent,
  xnForm.ReferenceInformationComponent,
  xnForm.SummaryCommandComponent,
  xnForm.WidgetManageFormComponent,
  xnForm.DataEntryNumberOrderSummaryComponent,
  xnForm.DataEntryOrderListSummaryComponent,
  xnForm.DataEntryScanningStatusComponent,
  xnForm.DataEntryPaymentTypeComponent,
  xnForm.DataEntryPaymentTypeItemComponent,
  xnForm.DataEntryEditPaymentTypeComponent,
  xnForm.ScanItemCommentComponent,
  xnForm.SearchCustomerDialogComponent,
  xnForm.DispatcherFromStep1Component,
  xnForm.DispatcherFromStep2Component,
  xnForm.DispatcherFromCombineComponent,
  xnForm.ScanAssignmentStep1Component,
  xnForm.ScanAssignmentStep2Component,
  xnForm.ScanAssignmentStep3Component,
  xnForm.ScanAssignmentMainComponent,
  xnForm.ToolContainerComponent,
  xnForm.SmartWizzardComponent,
  xnForm.DoubletCheckCombineComponent,
  xnForm.DoubletCheckMainComponent,
  xnForm.ElasticSearchSyncGridComponent,
  xnForm.ElasticSearchSyncMainComponent,
  xnForm.ElasticSearchSyncTabComponent,
  xnForm.ElasticSearchSyncTreeComponent,
  xnForm.ElasticSearchSyncCommandComponent,
  xnForm.MatchingDataComponent,
  xnForm.MailingReturnComponent,
  xnForm.SavLetterTemplateComponent,
  xnForm.ImportDataMatrixComponent,
  xnForm.ImportInvoicePaymentComponent,
  xnForm.DoubletCheckArchiveComponent,
  xnForm.XnFormQuillEditorToolbarComponent,
  xnForm.ReturnRefundInvoiceComponent,
  xnForm.ArticleOrdersComponent,
  xnForm.ArticleSearchDialogComponent,
  xnForm.ArticleSearchComponent,
  xnForm.ArticleCampaignSearchComponent,
  xnForm.RefundPaymentFormComponent,
  xnForm.EmailSettingPopupComponent,
  xnForm.ReturnPaymentComponent,
  xnForm.ReturnRefundInvoiceNumberComponent,
  xnForm.SortingGoodsEditFormComponent,
  xnForm.WarehouseMovementSelectArticleComponent,
  xnForm.WarehouseMovementUpdatingFormComponent,
  xnForm.StockCorrectionComponent,
  xnForm.InventoryComponent,
  xnForm.WarehouseMovementCostComponent,
  xnForm.EmailSettingComponent,
  xnForm.ModuleSearchDialogComponent,
  xnForm.PrinterFormDialogComponent,
  xnForm.PurchaseFormCombineComponent,
  xnForm.PurchaseFormHeaderComponent,
  xnForm.PurchaseFormArticleComponent,
  xnForm.FeedbackCombineComponent,
  xnForm.FeedbackPopupComponent,
  xnForm.FeedbackFormComponent,
  xnForm.FeedbackImageReviewComponent,
  xnForm.XnFeedbackIconComponent,
  xnForm.MatchingCustomerDataDialogComponent,
  xnForm.NewProjectFormComponent,
  xnForm.SendLetterDialogComponent,
  xnForm.SendLetterFormComponent,
  xnControl.XnCommunicationTableComponent,
  xnControl.XnCountryCheckListComponent,
  xnControl.CountryCheckListEditingComponent,
  xnControl.XnCreditCardComponent,
  xnControl.XnUsedCountryComponent,
  xnControl.XnNumbericTextboxComponent,
  xnControl.ScheduleSettingComponent,
  xnControl.ScheduleSettingFormComponent,
  xnControl.ScheduleSettingGridComponent,
  xnControl.ScheduleSettingRunImmediatelyComponent,
  xnControl.DateFilterComponent,

  xnControl.XnContextMenuComponent,
  xnControl.XnTreeViewComponent,
  xnControl.XnTreeViewLeftComponent,
  xnControl.XnTreeViewRightComponent,
  xnControl.XnFormStepProgessComponent,
  xnControl.SupportWijmoInputDateComponent,
  xnControl.ListBoxComponent,
  xnControl.CaptureLine,
  xnControl.CaptureItem,
  xnControl.CaptureItemList,
  xnControl.NoteControlComponent,
];
