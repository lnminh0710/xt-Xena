import { Injectable } from "@angular/core";
import { FormModel, Currency, PaymentType } from "app/models";
import { CustomAction } from "app/state-management/store/actions/base";
import { Module } from "app/models";

@Injectable()
export class DataEntryActions {
    static DATA_ENTRY_ORDER_DATA_CHANGED = "[DATA_ENTRY] Order Data Changed";
    dataEntryOrderDataChanged(data: FormModel, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ORDER_DATA_CHANGED,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_CUSTOMER_DATA_CHANGED =
        "[DATA_ENTRY] Customer Data Changed";
    dataEntryCustomerDataChanged(data: FormModel, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CUSTOMER_DATA_CHANGED,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_COMMUNICATION_DATA_CHANGED =
        "[DATA_ENTRY] Communication Data Changed";
    dataEntryCommunicationDataChanged(
        data: FormModel,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_COMMUNICATION_DATA_CHANGED,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_ARTICLE_GRID_DATA = "[DATA_ENTRY] Article Grid Data";
    dataEntrySetArticleGridData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ARTICLE_GRID_DATA,
            payload: data,
            area: area,
        };
    }
    static DATA_ENTRY_ARTICLE_GRID_EXPORT_DATA =
        "[DATA_ENTRY] Article Grid Export Data";
    dataEntrySetArticleGridExportData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ARTICLE_GRID_EXPORT_DATA,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SCANNING_STATUS = "[DATA_ENTRY] Scanning Status";
    dataEntryScanningStatusSummary(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SCANNING_STATUS,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SCANNING_STATUS_CALL_RELOAD =
        "[DATA_ENTRY] Scanning Status Call Reload";
    dataEntryScanningStatusCallReload(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_RELOAD,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SCANNING_STATUS_CALL_SKIP =
        "[DATA_ENTRY] Scanning Status Call Skip";
    dataEntryScanningStatusCallSkip(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_SKIP,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SCANNING_STATUS_CALL_DELETE =
        "[DATA_ENTRY] Scanning Status Call Delete";
    dataEntryScanningStatusCallDelete(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_DELETE,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_CALL_RELOAD = "[DATA_ENTRY] Call Reload";
    dataEntryCallReload(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CALL_RELOAD,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_PAYMENT_TYPE_CALL_ADD =
        "[DATA_ENTRY] Payment Type Call Add";
    dataEntryPaymentCallAddType(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_PAYMENT_TYPE_CALL_ADD,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_PAYMENT_TYPE_CALL_SAVE =
        "[DATA_ENTRY] Payment Type Call Save";
    dataEntryPaymentTypeCallSave(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_PAYMENT_TYPE_CALL_SAVE,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_ORDER_DATA_MEDIA_CODE =
        "[DATA_ENTRY] Set Order Data Media Code";
    dataEntrySetOrderDataMediaCode(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_ORDER_DATA_MEDIA_CODE,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_ORDER_DATA_PAYMENT_TYPE =
        "[DATA_ENTRY] Set Order Data Payment Type";
    dataEntrySetOrderDataPaymnetType(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_ORDER_DATA_PAYMENT_TYPE,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_DELIVERY_CHARGES =
        "[DATA_ENTRY] Set Order Data Delivery Charges";
    dataEntrySetDeliveryCharges(data: number, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_DELIVERY_CHARGES,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_ARTICLE_TOTAL =
        "[DATA_ENTRY] Set Order Data Article Total";
    dataEntrySetArticleTotal(data: number, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_ARTICLE_TOTAL,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_ORDER_TOTAL_SUMMARY =
        "[DATA_ENTRY] Set Order Total Summary";
    dataEntrySetOrderTotalSummary(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_ORDER_TOTAL_SUMMARY,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_RESET_ALL_FORM_DATA = "[DATA_ENTRY] RESET ALL FORM DATA";
    dataEntryResetAllFormData(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_RESET_ALL_FORM_DATA,
            area: area,
        };
    }

    static DATA_ENTRY_SET_MAIN_CURRENCY = "[DATA_ENTRY] Set Main Currency";
    dataEntrySetMainCurrency(data: Currency, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_MAIN_CURRENCY,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_MAIN_PAYMENT_TYPE_LIST =
        "[DATA_ENTRY] Set Main Payment Type List";
    dataEntrySetMainPaymentTypeList(
        data: Array<PaymentType>,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_MAIN_PAYMENT_TYPE_LIST,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SET_MAIN_CURRENCY_AND_PAYMENT_TYPE_LIST =
        "[DATA_ENTRY] Set Main Currency And Payment Type List";
    dataEntrySetMainCurrencyAndPaymentTypeList(
        mainCurrency: Currency,
        paymentTypeList: Array<PaymentType>,
        area: string
    ): CustomAction {
        const mainCurrencyAndMainPaymentTypeList = {
            mainCurrency: mainCurrency,
            mainPaymentTypeList: paymentTypeList,
        };
        return {
            type: DataEntryActions.DATA_ENTRY_SET_MAIN_CURRENCY_AND_PAYMENT_TYPE_LIST,
            payload: {
                mainCurrency: mainCurrency,
                mainPaymentTypeList: paymentTypeList,
                mainCurrencyAndMainPaymentTypeList:
                    mainCurrencyAndMainPaymentTypeList,
            },
            area: area,
        };
    }

    static DATA_ENTRY_SET_CUSTOMER_MANDATORY_FIELD =
        "[DATA_ENTRY] SET CUSTOMER MANDATORY FIELD";
    dataEntrySetCustomerMandatoryField(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SET_CUSTOMER_MANDATORY_FIELD,
            payload: data,
            area: area,
        };
    }

    static LOCK_CURSOR_SHADE = "[DATA_ENTRY] Lock Cursor Shade";
    lockCursorShade(cursorShare: any, area: string): CustomAction {
        return {
            type: DataEntryActions.LOCK_CURSOR_SHADE,
            payload: cursorShare,
            area: area,
        };
    }

    static UNLOCK_CURSOR_SHADE = "[DATA_ENTRY] Unlock Cursor Shade";
    unlockCursorShade(area: string): CustomAction {
        return {
            type: DataEntryActions.UNLOCK_CURSOR_SHADE,
            area: area,
        };
    }

    static TOGGLE_SMALL_IMAGE = "[DATA_ENTRY] Toggle Small Image";
    toggleSmallImage(isCollapsed, area: string): CustomAction {
        return {
            type: DataEntryActions.TOGGLE_SMALL_IMAGE,
            payload: isCollapsed,
            area: area,
        };
    }

    static DATA_ENTRY_SELECT_SUMMARY_FILTER =
        "[DATA_ENTRY] SELECT SUMMARY FILTER";
    dataEntrySelectSummaryFilter(
        mode: string,
        area: string,
        dateFrom?: string,
        dateTo?: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SELECT_SUMMARY_FILTER,
            payload: {
                mode,
                dateFrom,
                dateTo,
            },
            area: area,
        };
    }

    static DATA_ENTRY_CLEAR_SUMMARY_FILTER_DATA =
        "[DATA_ENTRY] CLEAR SUMMARY FILTER DATA";
    dataEntryClearSummaryFilterData(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CLEAR_SUMMARY_FILTER_DATA,
            area: area,
        };
    }

    static DATA_ENTRY_ORDER_SUMMARY_DATA_LOADED =
        "[DATA_ENTRY] ORDER SUMMARY DATA LOADED";
    orderSummaryDataLoaded(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ORDER_SUMMARY_DATA_LOADED,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_SELECTED_CAMPAIGN_NUMBER_DATA =
        "[DATA_ENTRY] SELECTED CAMPAIGN NUMBER DATA";
    dataEntrySelectedCampaignNumberData(
        campaignNumber: string,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SELECTED_CAMPAIGN_NUMBER_DATA,
            payload: campaignNumber,
            area: area,
        };
    }

    static DATA_ENTRY_PRINT = "[DATA_ENTRY] PRINT";
    dataEntryPrint(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_PRINT,
            area: area,
        };
    }

    static DATA_ENTRY_DISABLED_SAVE_BUTTON =
        "[DATA_ENTRY] DISABLED SAVE BUTTON";
    dataEntryDisabledSaveButton(
        isValid: boolean,
        orderType: any,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_DISABLED_SAVE_BUTTON,
            payload: { status: isValid, orderType },
            area: area,
        };
    }

    static DATA_ENTRY_CUSTOMER_ID_CHANGED = "[DATA_ENTRY] CUSTOMER_ID_CHANGED";
    dataEntryCustomerIdChanged(customerId: number, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CUSTOMER_ID_CHANGED,
            payload: customerId,
            area: area,
        };
    }

    static DATA_ENTRY_CUSTOMER_MATCHED_DATA_CHANGED =
        "[DATA_ENTRY] CUSTOMER_MATCHED_DATA_CHANGED";
    dataEntryCustomerMatchedDataChanged(
        customerMatchedData: any,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CUSTOMER_MATCHED_DATA_CHANGED,
            payload: customerMatchedData,
            area: area,
        };
    }

    static DATA_ENTRY_SAVE_RESULT = "[DATA_ENTRY] SAVE RESULT";
    dataEntrySaveResult(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SAVE_RESULT,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_REQUEST_DOWNLOAD_SCANNING_IMAGE =
        "[DATA_ENTRY] REQUEST DOWNLOAD SCANNING IMAGE";
    requestDownloadScanningImage(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_REQUEST_DOWNLOAD_SCANNING_IMAGE,
            area: area,
        };
    }

    static DATA_ENTRY_ACTIVE_TAB_IN_LIST_PAYMENT_TAB =
        "[DATA_ENTRY] DATA_ENTRY_ACTIVE_TAB_IN_LIST_PAYMENT_TAB";
    activeTabInListPaymentTab(
        tabId: string,
        module: Module,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ACTIVE_TAB_IN_LIST_PAYMENT_TAB,
            payload: tabId,
            module: module,
            area: area,
        };
    }

    static DATA_ENTRY_REQUEST_CHANGE_TAB = "[DATA_ENTRY] REQUEST CHANGE TAB";
    requestChangeTab(tabId: any): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_REQUEST_CHANGE_TAB,
            payload: tabId,
        };
    }

    static DATA_ENTRY_REQUEST_CHANGE_TAB_THEN_LOAD_DATA =
        "[DATA_ENTRY] REQUEST CHANGE TAB THEN LOAD DATA";
    requestChangeTabThenLoadData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_REQUEST_CHANGE_TAB_THEN_LOAD_DATA,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_CLEAR_REQUEST_CHANGE_TAB_THEN_LOAD_DATA =
        "[DATA_ENTRY] CLEAR REQUEST CHANGE TAB THEN LOAD DATA";
    clearRequestChangeTabThenLoadData(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CLEAR_REQUEST_CHANGE_TAB_THEN_LOAD_DATA,
            area: area,
        };
    }

    static DATA_ENTRY_SELECT_ORDER_SUMMARY_ITEM =
        "[DATA_ENTRY] SELECT ORDER SUMMARY ITEM";
    selectOrderSummaryItem(selectedItem: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_SELECT_ORDER_SUMMARY_ITEM,
            payload: selectedItem,
            area: area,
        };
    }

    static DATA_ENTRY_CLEAR_SELECTED_ORDER_SUMMARY_ITEM =
        "[DATA_ENTRY] CLEAR SELECTED ORDER SUMMARY ITEM";
    clearSelectedOrderSummaryItem(area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CLEAR_SELECTED_ORDER_SUMMARY_ITEM,
            area: area,
        };
    }

    static DATA_ENTRY_ORDER_FAILED_REQUEST_DATA =
        "[DATA_ENTRY] Order Failed Request Data";
    orderFailedRequestData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ORDER_FAILED_REQUEST_DATA,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_ORDER_FAILED_RECEIVE_DATA =
        "[DATA_ENTRY] Order Failed Receive Data";
    orderFailedReceiveData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ORDER_FAILED_RECEIVE_DATA,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_CACHED_FAILED_DATA =
        "[DATA_ENTRY] Order Cached Failed Data";
    cachedFailedData(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_CACHED_FAILED_DATA,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_ADD_ARTICLE_DATA_FROM_ARTICLE_CAMPAIGN_GRID =
        "[DATA_ENTRY] Add article data from article campaign grid";
    addArticleDataFromArticleCampaignGrid(
        data: any,
        area: string
    ): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ADD_ARTICLE_DATA_FROM_ARTICLE_CAMPAIGN_GRID,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_ORDER_DOUBLET_CHECK_REQUEST =
        "[DATA_ENTRY] Order Doublet Check Request";
    callDoubletCheck(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_ORDER_DOUBLET_CHECK_REQUEST,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_REJECT_ID_PAYMENTS = "[DATA_ENTRY] Reject Id Payments";
    rejectIdPayments(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_REJECT_ID_PAYMENTS,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_EDIT_ORDER = "[DATA_ENTRY] Edit Order";
    editOrder(data: any, area: string): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_EDIT_ORDER,
            payload: data,
            area: area,
        };
    }

    static DATA_ENTRY_UPDATE_IS_CANCEL_SAV =
        "[DATA_ENTRY] Update Is Cancel SAV";
    updateIsCancelSAV(data: any, area: string, module: Module): CustomAction {
        return {
            type: DataEntryActions.DATA_ENTRY_UPDATE_IS_CANCEL_SAV,
            area: area,
            module: module,
            payload: data,
        };
    }
}
