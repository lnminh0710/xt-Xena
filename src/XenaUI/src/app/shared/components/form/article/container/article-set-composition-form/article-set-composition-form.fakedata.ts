export class ArticleSetCompositionFakeData {
  public createGridColumns() {
    const result: any = [];
    result.push({
      title: 'Id',
      data: 'idArticleItems',
      visible: true,
    });
    result.push({
      title: 'Article #',
      data: 'articleNr',
      visible: true,
    });
    result.push({
      title: 'Description',
      data: 'articleNameShort',
      visible: true,
    });
    result.push({
      title: 'Is WH',
      data: 'isWarehouseControl',
      dataType: 'bit',
      visible: true,
    });
    result.push({
      title: 'Quantity',
      data: 'quantityItems',
      visible: true,
    });
    result.push({
      title: 'Article Set',
      data: 'idArticleSet',
      visible: false,
    });

    return result;
  }
}
