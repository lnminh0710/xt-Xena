import { Injectable, Injector } from '@angular/core';
import { Uti } from 'app/utilities';

@Injectable()
export class DataEntryProcess {
  private uti: Uti;
  public selectedODETab: any = {};
  public preventShowDialogConfirmPrice: boolean;
  public isLoadFromBuffer: boolean;
  public ignoreProcessForSubcribeScanningStatusData: boolean;
  public mediaCodeDoesnotExist: boolean;
  public isProcessForOrderFailed: boolean;
  public currentScanningLotId?: number;

  public paymentTypeData: any = {};
  public notApprovedPaymentsMethods: any;
  public isProcessingLoadEditOrder: boolean = false;

  constructor(protected injector: Injector) {
    this.uti = this.injector.get(Uti);
  }

  public reset() {
    this.preventShowDialogConfirmPrice = false;
    this.isLoadFromBuffer = false;
    this.ignoreProcessForSubcribeScanningStatusData = false;
    this.mediaCodeDoesnotExist = false;
    this.isProcessForOrderFailed = false;
    this.currentScanningLotId = null;
    this.paymentTypeData = {};
    this.notApprovedPaymentsMethods = null;
    this.isProcessingLoadEditOrder = false;
  }

  //#region Edit Order
  private buildPaymentTypesEditOrder(payments: any) {
    let result = [];

    if (payments) {
      payments = payments[0] || {};
      if (payments.Cash) {
        const jsonCash = JSON.parse(payments.Cash);
        if (jsonCash && jsonCash.Cash) {
          //Merge the second array into the first one
          Array.prototype.push.apply(result, jsonCash.Cash);
        }
      }
      if (payments.Cheque) {
        const jsonCheque = JSON.parse(payments.Cheque);
        if (jsonCheque && jsonCheque.Cheque) {
          Array.prototype.push.apply(result, jsonCheque.Cheque);
        }
      }
      if (payments.CreditCard) {
        const jsonCreditCard = JSON.parse(payments.CreditCard);
        if (jsonCreditCard && jsonCreditCard.CreditCard) {
          Array.prototype.push.apply(result, jsonCreditCard.CreditCard);
        }
      }
    }

    return result;
  }

  public buildEditOrderModel(
    data: Array<any>,
    mainCurrency,
    mainPaymenTypeList
  ) {
    if (!data || data.length <= 2) return;

    //1. Order, 2. Payments, 3. Articles
    let editOrderData = {
      mainCurrency: mainCurrency,
      mainPaymenTypeList: mainPaymenTypeList,
      order: {},
      totalSummaryData: {
        isFreeShipping: false,
      },
      paymentType: [],
      articleData: [],
    };

    //1. Order
    const order = data[0][0];
    const orderDate = Uti.parseDateFromDB(order.OrderDate);
    editOrderData.order = {
      barcode: null,
      idSalesCampaignMediaCode: null,
      idSalesCampaignWizard: null,
      isDisplayBarCode: true,
      isDisplayCustomer: true,
      isDisplayMediaCode: true,
      campaignNumber: order.CampaignNr,
      customer: order.CustomerNr,
      customerId: order.CustomerNr,
      mediacode: order.MediaCode,
      orderType: order.IdRepSalesOrderType,
      orderBy: order.IdRepSalesOrderProvenanceType,
      orderDate: orderDate,
      orderDay: this.uti.formatLocale(orderDate, 'dd'),
      orderMonth: this.uti.formatLocale(orderDate, 'MM'),
      orderYear: this.uti.formatLocale(orderDate, 'yyyy'),
      packageNr: order.PackageNr,
      idRepSalesOrderShipper: order.IdRepSalesOrderShipper,
    };
    editOrderData.totalSummaryData.isFreeShipping =
      order.IsFreeShipping || false;

    //2. Payments
    const payments = data[1];
    editOrderData.paymentType = this.buildPaymentTypesEditOrder(payments);

    //3. Articles
    const articles = data[2];
    if (articles && articles.length) {
      editOrderData.totalSummaryData.isFreeShipping =
        articles[0].IsFreeOfCharge || false;

      articles.forEach((item) => {
        editOrderData.articleData.push({
          IdArticle: item.IdArticle,
          ArticleNr: item.ArticleNr,
          ArticleNameShort: item.ArticleNameShort,
          Quantity: item.Quantity,
          SalesPrice: item.SellingPrice,
          TotalPrice: item.SalesAmount,
          IsAllArticle: false,
        });
      });
    }
    return editOrderData;
  }

  public loadOrderFinished(callback: Function, count?: number) {
    count = count || 1;
    if (count > 30) return; //retry 30 times, each time 500ms -> 15s

    if (!this.isProcessingLoadEditOrder) {
      setTimeout(() => {
        this.loadOrderFinished(callback, ++count);
      }, 500);
    } else {
      this.isProcessingLoadEditOrder = false;
      callback();
    }
  }
  //#endregion
}
