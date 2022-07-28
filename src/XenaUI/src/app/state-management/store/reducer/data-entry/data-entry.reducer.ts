import { DataEntryActions } from 'app/state-management/store/actions';
import { FormModel, Currency, PaymentType } from 'app/models';
import { CustomAction } from 'app/state-management/store/actions/base';
import * as baseReducer from 'app/state-management/store/reducer/reducer.base';

export interface SubDataEntryState {
    articleGridData: FormModel;
    customerData: FormModel;
    orderData: FormModel;
    articleGridExportData: FormModel;
    communicationData: FormModel;
    customerId: number;
    customerMatchedData: any;
    orderTotalSummaryData: any;
    paymentTypeData: FormModel;
    deliveryCharges: number;
    articleTotal: number;
    paymentTypeCallAdd: any;
    paymentTypeCallSave: any;
    scanningStatusData: any;
    scanningStatusCallReload: any;
    scanningStatusCallSkip: any;
    scanningStatusCallDelete:any;
    callReload: any;
    orderDataWidgetMediaCode: string;
    mainCurrency: Currency;
    mainPaymentTypeList: Array<PaymentType>;
    mainCurrencyAndMainPaymentTypeList: any;
    customerMandatoryField: any;
    lockedCursorShade: any;
    selectSummaryFilter: any;
    clearSummaryFilterData: any;
    selectedCampaignNumberData: string;
    showSmallImage: any;
    requestChangeTabThenLoadData: any;//mediacode,campaignNr,customerNr,idSalesOrder
    selectedOrderSummaryItem: any;
    orderFailedRequestData: any;//{isNotify: boolean}
    orderFailedReceiveData: any;//{Key: string, data: any}
    cachedFailedData: any;
    doubletCheckRequest: any;//{isCheck: boolean, forceSaveODE: boolean}
    rejectIdPayments: any;
    editOrderData: any;
}

export const initialSubDataEntryState: SubDataEntryState = {
    articleGridData: null,
    customerData: null,
    orderData: null,
    articleGridExportData: null,
    communicationData: null,
    customerId: 0,
    customerMatchedData: null,
    orderTotalSummaryData: null,
    paymentTypeData: null,
    deliveryCharges: 0,
    articleTotal: 0,
    paymentTypeCallAdd: {},
    paymentTypeCallSave: {},
    scanningStatusData: [],
    scanningStatusCallReload: null,
    scanningStatusCallSkip: null,
    scanningStatusCallDelete: null,
    callReload: null,
    orderDataWidgetMediaCode: '',
    mainCurrency: null,
    mainPaymentTypeList: null,
    mainCurrencyAndMainPaymentTypeList: null,
    customerMandatoryField: null,
    lockedCursorShade: null,
    selectSummaryFilter: null,
    clearSummaryFilterData: null,
    selectedCampaignNumberData: null,
    showSmallImage: {
        isCollapsed: false
    },
    requestChangeTabThenLoadData: null,
    selectedOrderSummaryItem: null,
    orderFailedRequestData: null,
    orderFailedReceiveData: null,
    cachedFailedData: null,
    doubletCheckRequest: null,
    rejectIdPayments: null,
    editOrderData: null
};

export interface DataEntryState {
    features: { [id: string]: SubDataEntryState }
}

const initialState: DataEntryState = {
    features: {}
};

export function dataEntryReducer(state = initialState, action: CustomAction): DataEntryState {
    let feature = baseReducer.getFeatureFromArea(action, state, initialSubDataEntryState);

    switch (action.type) {
        case DataEntryActions.DATA_ENTRY_ARTICLE_GRID_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                articleGridData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_ARTICLE_GRID_EXPORT_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                articleGridExportData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_ORDER_DATA_CHANGED: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                orderData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CUSTOMER_DATA_CHANGED: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                customerData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_COMMUNICATION_DATA_CHANGED: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                communicationData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SCANNING_STATUS: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                scanningStatusData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_RELOAD: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                scanningStatusCallReload: {
                    reload: action.payload,
                },
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_SKIP: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                scanningStatusCallSkip: {
                    skip: action.payload,
                },
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SCANNING_STATUS_CALL_DELETE: {
          state = baseReducer.updateStateDataFromArea(action, feature, state, {
              scanningStatusCallDelete: {
                  delete: action.payload,
              },
          });
          return Object.assign({}, state);
      }
        case DataEntryActions.DATA_ENTRY_CALL_RELOAD: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                callReload: {
                    reload: action.payload,
                },
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_PAYMENT_TYPE_CALL_ADD: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                add: action.payload,
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_PAYMENT_TYPE_CALL_SAVE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                paymentTypeCallSave: {
                    save: action.payload,
                },
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_ORDER_DATA_MEDIA_CODE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                orderDataWidgetMediaCode: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_ORDER_DATA_PAYMENT_TYPE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                paymentTypeData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_DELIVERY_CHARGES: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                deliveryCharges: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_ARTICLE_TOTAL: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                articleTotal: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_ORDER_TOTAL_SUMMARY: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                orderTotalSummaryData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_RESET_ALL_FORM_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                articleGridData: null,
                articleGridExportData: null,
                orderData: null,
                customerData: null,
                communicationData: null,
                //scanningStatusData: null,
                //orderDataWidgetMediaCode: null,
                deliveryCharges: 0,
                articleTotal: 0,
                orderTotalSummaryData: null,
                mainCurrency: null,
                mainPaymentTypeList: null,
                mainCurrencyAndMainPaymentTypeList: null,
                customerId: null,
                customerMatchedData: null,
                //requestChangeTabThenLoadData: null,//don't clear this here
                paymentTypeData: null,
                orderFailedRequestData: null,
                cachedFailedData: null,
                doubletCheckRequest: null,
                rejectIdPayments: null,
                editOrderData: null,
                customerMandatoryField: null,
                selectedCampaignNumberData: null
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_MAIN_CURRENCY: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                mainCurrency: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_MAIN_PAYMENT_TYPE_LIST: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                mainPaymentTypeList: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_MAIN_CURRENCY_AND_PAYMENT_TYPE_LIST: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, action.payload);
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SET_CUSTOMER_MANDATORY_FIELD: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                customerMandatoryField: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.LOCK_CURSOR_SHADE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                lockedCursorShade: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.UNLOCK_CURSOR_SHADE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                lockedCursorShade: null
            });
            return Object.assign({}, state);
        }

        case DataEntryActions.TOGGLE_SMALL_IMAGE: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                showSmallImage: {
                    isCollapsed: action.payload
                }
            });
        }
        case DataEntryActions.DATA_ENTRY_SELECT_SUMMARY_FILTER: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                selectSummaryFilter: {
                    mode: action.payload.mode,
                    dateFrom: action.payload.dateFrom,
                    dateTo: action.payload.dateTo
                }
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CLEAR_SUMMARY_FILTER_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                clearSummaryFilterData: {}
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SELECTED_CAMPAIGN_NUMBER_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                selectedCampaignNumberData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CUSTOMER_ID_CHANGED: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                customerId: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CUSTOMER_MATCHED_DATA_CHANGED: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                customerMatchedData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_REQUEST_CHANGE_TAB_THEN_LOAD_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                requestChangeTabThenLoadData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CLEAR_REQUEST_CHANGE_TAB_THEN_LOAD_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                requestChangeTabThenLoadData: null
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_SELECT_ORDER_SUMMARY_ITEM: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                selectedOrderSummaryItem: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CLEAR_SELECTED_ORDER_SUMMARY_ITEM: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                selectedOrderSummaryItem: null
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_ORDER_FAILED_REQUEST_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                orderFailedRequestData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_ORDER_FAILED_RECEIVE_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                orderFailedReceiveData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_CACHED_FAILED_DATA: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                cachedFailedData: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_ORDER_DOUBLET_CHECK_REQUEST: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                doubletCheckRequest: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_REJECT_ID_PAYMENTS: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                rejectIdPayments: action.payload
            });
            return Object.assign({}, state);
        }
        case DataEntryActions.DATA_ENTRY_EDIT_ORDER: {
            state = baseReducer.updateStateDataFromArea(action, feature, state, {
                editOrderData: action.payload
            });
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
}
