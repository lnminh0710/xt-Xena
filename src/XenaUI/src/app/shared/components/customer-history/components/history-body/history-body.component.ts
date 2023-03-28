import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    ChangeDetectionStrategy,
} from "@angular/core";
import { HistoryBodyInfo } from "app/models";
import isBoolean from "lodash-es/isBoolean";

@Component({
    selector: "history-body",
    templateUrl: "./history-body.component.html",
    styleUrls: ["./history-body.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryBodyComponent implements OnInit, OnDestroy, AfterViewInit {
    tableDataSource: {
        header?: Array<{
            key: string;
            value: string;
        }>;
        body?: Array<Array<string>>;
    };

    private _data: HistoryBodyInfo;
    @Input() public set data(historyBodyInfo: HistoryBodyInfo) {
        this._data = historyBodyInfo;
        this.processData(historyBodyInfo);
    }

    public get data() {
        return this._data;
    }

    constructor(private _eref: ElementRef) {}

    /**
     * ngOnInit
     */
    public ngOnInit() {}

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {}

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {}

    /**
     * processData
     * @param historyBodyInfo
     */
    private processData(historyBodyInfo: HistoryBodyInfo) {
        switch (historyBodyInfo.type) {
            case 1:
            case 2:
                break;
            // Table case
            case 3:
                this.buildTableSource(historyBodyInfo);
                break;
        }
    }

    /**
     * Build table source for body's type 3
     * @param historyBodyInfo
     */
    private buildTableSource(historyBodyInfo: HistoryBodyInfo) {
        if (historyBodyInfo.content) {
            this.tableDataSource = {
                header: [],
                body: [],
            };
            let header = historyBodyInfo.content.header;
            let rows: Array<any> = historyBodyInfo.content.rows;
            Object.keys(header).forEach((key) => {
                const colName = header[key];
                this.tableDataSource.header.push({
                    key: key,
                    value: colName,
                });
            });
            if (rows && rows.length) {
                rows.forEach((rowObj) => {
                    let dataRow: Array<string> = [];
                    this.tableDataSource.header.forEach((col) => {
                        Object.keys(rowObj).forEach((key) => {
                            if (col.key.toLowerCase() == key.toLowerCase()) {
                                if (isBoolean(rowObj[key])) {
                                    if (rowObj[key] == true) {
                                        dataRow.push("&#9745;");
                                    } else {
                                        dataRow.push("&#9744;");
                                    }
                                } else {
                                    dataRow.push(rowObj[key]);
                                }
                            }
                        });
                    });
                    this.tableDataSource.body.push(dataRow);
                });
            }
        }
    }
}
