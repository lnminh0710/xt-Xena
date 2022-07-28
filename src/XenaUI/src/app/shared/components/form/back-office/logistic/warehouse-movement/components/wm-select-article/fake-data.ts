// TODO: will remove this file when has service
import { ControlGridModel } from 'app/models';

export class WarehuoseMovementEditFormFakeData {
    public createArriveArticleData(): ControlGridModel {
        return new ControlGridModel({
            columns: [
                // {
                //     title: 'Article Id',
                //     data: 'articleId',
                //     visible: false,
                //     readOnly: true,
                //     setting: {
                //         Setting: [
                //             {
                //                 DisplayField: {
                //                     Hidden: '1'
                //                 }
                //             }
                //         ]
                //     }
                // },
                // {
                //     title: 'Article #',
                //     data: 'articleNumber',
                //     visible: true,
                //     readOnly: true,
                //     setting: {}
                // },
                // {
                //     title: 'Article name',
                //     data: 'articleName',
                //     visible: true,
                //     readOnly: true,
                //     setting: {}
                // },
                // {
                //     title: 'OnStock',
                //     data: 'onStock',
                //     visible: true,
                //     readOnly: true,
                //     setting: {}
                // },
                // {
                //     title: 'Available',
                //     data: 'available',
                //     visible: true,
                //     readOnly: true,
                //     setting: {}
                // }

                {
                    title: 'IdWarehouseMovementGoodsIssue',
                    data: 'idWarehouseMovementGoodsIssue',
                    visible: false,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
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
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
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
                                    ReadOnly: '1'
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Add to Art #',
                    data: 'addToArticleNumber',
                    visible: true,
                    readOnly: false,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
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
                                    ReadOnly: '1'
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Qty',
                    data: 'quantity',
                    visible: true,
                    readOnly: false,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Fake price',
                    data: 'fakePrice',
                    visible: true,
                    readOnly: false,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'Purchasing Price',
                    data: 'purchasingPrice',
                    visible: true,
                    readOnly: false,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
                },
                {
                    title: 'OnStock',
                    data: 'onStock',
                    visible: true,
                    readOnly: true,
                    setting: {}
                },
                {
                    title: 'Available',
                    data: 'available',
                    visible: true,
                    readOnly: true,
                    setting: {}
                },
                {
                    title: 'Is Active',
                    data: 'IsActive',
                    visible: true,
                    readOnly: false,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: '1'
                                }
                            }
                        ]
                    }
                }
            ]
        });
    }
}

