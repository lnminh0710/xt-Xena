// TODO: will remove this file when has service
import { DropdownListModel, ControlGridModel } from "app/models";

export class WarehuoseMovementEditFormFakeData {
    public createClosingReason(): Array<DropdownListModel> {
        return [
            {
                textValue: "Reason 1",
                idValue: 1,
            },
            {
                textValue: "Reason 2",
                idValue: 2,
            },
            {
                textValue: "Reason 3",
                idValue: 3,
            },
        ];
    }

    public createArrivedArticleData(): ControlGridModel {
        return new ControlGridModel({
            columns: [
                {
                    title: "Article Id",
                    data: "articleId",
                    visible: false,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: "1",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "IdWarehouseMovementGoodsIssue",
                    data: "IdWarehouseMovementGoodsIssue",
                    visible: false,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: "1",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Article #",
                    data: "articleNumber",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Description",
                    data: "description",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "quantity",
                    data: "quantity",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "confirm",
                    data: "confirm",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Not conf.",
                    data: "notConfiguration",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
            ],
        });
    }

    public createStockedArticleData(): ControlGridModel {
        return new ControlGridModel({
            columns: [
                {
                    title: "Article Id",
                    data: "articleId",
                    visible: false,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: "1",
                                },
                            },
                        ],
                    },
                },
                {
                    title: "Article #",
                    data: "articleNumber",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "quantity",
                    data: "quantity",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Division",
                    data: "division",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Coordinates",
                    data: "coordinate",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Expiry date",
                    data: "expiryDate",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Closing reason",
                    data: "closingReasonText",
                    visible: true,
                    readOnly: true,
                    setting: {},
                },
                {
                    title: "Closing reason Id",
                    data: "closingReasonId",
                    visible: true,
                    readOnly: true,
                    setting: {
                        Setting: [
                            {
                                DisplayField: {
                                    Hidden: "1",
                                },
                            },
                        ],
                    },
                },
            ],
        });
    }
}
