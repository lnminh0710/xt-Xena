export class FakeData {
  public createGridColumns() {
    return [
      {
        title: 'Id',
        data: 'id',
        setting: {
          DataType: 'number',
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
        title: 'Text',
        data: 'text',
        setting: {
          DataType: 'nvarchar',
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
        title: 'IsoCode',
        data: 'isoCode',
        setting: {
          DataType: 'nvarchar',
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
        title: '',
        data: 'selected',
        setting: {
          DataType: 'tinyint',
          Setting: [
            {
              ControlType: {
                Type: 'Checkbox',
              },
              DisplayField: {
                ReadOnly: '0',
                Hidden: '0',
              },
            },
          ],
        },
      },
      {
        title: 'Country',
        data: 'country',
        setting: {
          DataType: 'nvarchar',
          Setting: [
            {
              ControlType: {
                Type: 'countryflag',
              },
              DisplayField: {
                ReadOnly: '0',
              },
            },
          ],
        },
      },
      {
        title: 'Status',
        data: 'status',
        setting: {
          DataType: 'nvarchar',
          Setting: [
            {
              DisplayField: {
                ReadOnly: '1',
              },
              ControlType: {
                Type: 'Icon',
              },
            },
          ],
        },
      },
      {
        title: 'Duration',
        data: 'duration',
        setting: {
          DataType: 'nvarchar',
          Setting: [
            {
              DisplayField: {
                ReadOnly: '1',
              },
            },
          ],
        },
      },
    ];
  }
}
