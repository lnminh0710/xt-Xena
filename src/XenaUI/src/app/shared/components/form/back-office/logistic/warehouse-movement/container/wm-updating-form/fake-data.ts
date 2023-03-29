// TODO: will remove this file when has service
import { DropdownListModel, ControlGridModel } from 'app/models';

export class WarehuoseMovementEditFormFakeData {
  public createArrivedArticleData(): ControlGridModel {
    return new ControlGridModel({
      columns: [
        {
          title: 'IdWarehouseMovementGoodsIssue',
          data: 'idWarehouseMovementGoodsIssue',
          visible: false,
          readOnly: true,
          setting: {
            Setting: [
              {
                DisplayField: {
                  Hidden: '1',
                },
              },
            ],
          },
        },
        {
          title: 'Article Id',
          data: 'articleId',
          visible: false,
          readOnly: true,
          setting: {
            Setting: [
              {
                DisplayField: {
                  Hidden: '1',
                },
              },
            ],
          },
        },
        {
          title: 'Article #',
          data: 'articleNumber',
          visible: true,
          readOnly: true,
          setting: {
            Setting: [
              {
                DisplayField: {
                  ReadOnly: '1',
                },
              },
            ],
          },
        },
        {
          title: 'Add to Art #',
          data: 'addToArticleNumber',
          visible: true,
          readOnly: false,
          setting: {
            Setting: [
              {
                ControlType: {
                  Type: 'Textbox',
                },
                Validation: {
                  CompareWithArray: '1',
                  arrayName: 'ArrayDataToValiation',
                  propertyName: 'ArticleNr',
                },
              },
              // {
              //     ControlType: {
              //         Type: 'AutoComplete'
              //     }
              // },
              // {
              //     'Validation': {
              //         'IsRequired': '1'
              //     }
              // }
            ],
          },
        },
        {
          title: 'Add to Art Value',
          data: 'addToArticleNumberValue',
          visible: true,
          readOnly: false,
          setting: {
            Setting: [
              {
                DisplayField: {
                  Hidden: '1',
                },
              },
            ],
          },
        },
        {
          title: 'Article Name',
          data: 'articleName',
          visible: true,
          readOnly: true,
          setting: {
            Setting: [
              {
                DisplayField: {
                  ReadOnly: '1',
                },
              },
            ],
          },
        },
        {
          title: 'Qty',
          data: 'quantity',
          visible: true,
          readOnly: false,
          setting: {
            DataLength: '0',
            DataType: 'money',
            Setting: [
              {
                ControlType: {
                  Type: 'Numeric',
                },
              },
              {
                Validation: {
                  Comparison: [
                    {
                      Operator: '<=',
                      With: 'available',
                      ErrorMessage:
                        'Quantity should be less than or equal Available',
                    },
                  ],
                  // 'IsRequired': '1'
                },
              },
            ],
          },
        },
        {
          title: 'Available',
          data: 'available',
          visible: true,
          readOnly: true,
          setting: {},
        },
        {
          title: 'Fake price',
          data: 'fakePrice',
          visible: true,
          readOnly: false,
          setting: {
            DataLength: '0',
            DataType: 'money',
            Setting: [
              {
                ControlType: {
                  Type: 'Numeric',
                },
              },
            ],
          },
        },
        {
          title: 'Purchasing Price',
          data: 'purchasingPrice',
          visible: true,
          readOnly: false,
          setting: {
            DataLength: '0',
            DataType: 'money',
            Setting: [
              {
                ControlType: {
                  Type: 'Numeric',
                },
              },
            ],
          },
        },
        {
          title: 'OnStock',
          data: 'onStock',
          visible: true,
          readOnly: true,
          setting: {
            Setting: [
              {
                DisplayField: {
                  Hidden: '1',
                },
              },
            ],
          },
        },
      ],
    });
  }
}
