export class OrderDataEntryModel {
  public mediacode: string = '';
  public barcode: string = '';
  public campaignNumber: string = '';
  public orderType: string = '';
  public customer: string = '';
  public orderDate: string = '';
  public orderBy: string = '';
  public packageNr: string = '';
  public idRepSalesOrderShipper: string = '';

  constructor(init?: Partial<OrderDataEntryModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryCommunicationModel {
  public idSharingCommunication: string = '';
  public idRepCommunicationType: string = '';
  public commType: string = '';
  public commValue1: string = '';
  public commNotes: string = '';

  constructor(init?: Partial<OrderDataEntryCommunicationModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryPaymentTypeModel {
  public paymentType: string = '';
  public issuer: string = '';
  public creditcardNr: string = '';
  public validThru: string = '';
  public cvc: string = '';
  public codeline: string = '';
  public amount: string = '';
  public currency: string = '';
  public paymentDate: string = '';

  constructor(init?: Partial<OrderDataEntryPaymentTypeModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryScaningStatusModel {
  public lotName: string = '';
  public captured: string = '';
  public remainingOrder: string = '';
  public sendToAdmin: string = '';
  public skipped: string = '';
  public totalOrder: string = '';
  public mediaCode: string = '';

  constructor(init?: Partial<OrderDataEntryScaningStatusModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryNumberModel {
  public day: string = '';
  public week: string = '';
  public month: string = '';
  public byDate: string = '';
  public sendToAdmin: string = '';
  public fromDate: string = '';
  public toDate: string = '';
  public search: string = '';

  constructor(init?: Partial<OrderDataEntryNumberModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntrySummaryModel {
  public orderType: string = '';
  public campaignNr: string = '';
  public mediaCode: string = '';
  public lastName: string = '';
  public firstName: string = '';
  public country: string = '';
  public culture: string = '';
  public createDate: string = '';
  public orderDate: string = '';
  public loginName: string = '';

  constructor(init?: Partial<OrderDataEntrySummaryModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryCustomerModel {
  public idRepIsoCountryCode: string = '';
  public idRepLanguage: string = '';
  public idRepTitle: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public nameAddition: string = '';
  public isActive: string = '';
  public idRepPersonStatus: string = '';
  public dateOfBirth: string = '';
  public notes: string = '';
  public street: string = '';
  public streetNr: string = '';
  public streetAddition1: string = '';
  public streetAddition2: string = '';
  public idRepPoBox: string = '';
  public zip: string = '';
  public zip2: string = '';
  public place: string = '';
  public area: string = '';

  constructor(init?: Partial<OrderDataEntryCustomerModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryArticleGridModel {
  public articleNr: string = '';
  public allArticle: string = '';
  public allGift: string = '';
  public giftMale: string = '';
  public giftFemale: string = '';

  public idArticle: string = '';
  public description: string = '';
  public quantity: string = '';
  public salesPrice: string = '';
  public totalPrice: string = '';
  public articleNameShort: string = '';
  public price: string = '';
  public notes: string = '';

  constructor(init?: Partial<OrderDataEntryArticleGridModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryTotalSummaryModel {
  public totalAmount: string = '';
  public total: string = '';
  public deliveryChanges: string = '';

  constructor(init?: Partial<OrderDataEntryTotalSummaryModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryCustomerAddressModel {
  public dateOfBirth: string = '';

  constructor(init?: Partial<OrderDataEntryCustomerAddressModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryCustomerStatusModel {
  public defaultValue: string = '';
  public isActive: string = '';

  constructor(init?: Partial<OrderDataEntryCustomerStatusModel>) {
    Object.assign(this, init);
  }
}

export class OrderDataEntryCustomerOrderModel {
  public idSalesOrder: string = '';
  public defaultValue: string = '';
  public campaignNr: string = '';
  public personNr: string = '';
  public idPerson: string = '';
  public createDate: string = '';
  public mediacode: string = '';
  public article: string = '';
  public grossAmount: string = '';
  public amount: string = '';
  public openAmount: string = '';
  public paidAmount: string = '';
  public paimentType: string = '';
  public isPaid: string = '';
  public idLogin: string = '';
  public invoiceNr: string = '';
  public currencyCode: string = '';
  public isShipped: string = '';
  public isReadyForShipping: string = '';
  public doneDate: string = '';
  public notes: string = '';
  public isActive: string = '';
  public isDeleted: string = '';
  public isRejected: string = '';
  public orderInvoiceTypes: string = '';
  public isFreeShipping: string = '';
  public postageCosts: string = '';
  public shippingDate: string = '';
  public isPartialDelivery: string = '';
  public tracking: string = '';
  public orderType: string = '';
  public dunningLevel: string = '';
  public paymentMethod: string = '';
  public invoicePDF: string = '';
  public return: string = '';

  constructor(init?: Partial<OrderDataEntryCustomerOrderModel>) {
    Object.assign(this, init);
  }
}

export class ScanItemCommentModel {
  public comment: string = '';

  constructor(init?: Partial<ScanItemCommentModel>) {
    Object.assign(this, init);
  }
}
