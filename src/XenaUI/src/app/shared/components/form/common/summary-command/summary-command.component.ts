import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-summary-command",
    styleUrls: ["./summary-command.component.scss"],
    templateUrl: "./summary-command.component.html",
})
export class SummaryCommandComponent implements OnInit {
    @Input() data: any;
    @Output() commandClicked: EventEmitter<any> = new EventEmitter();

    constructor() {}

    public ngOnInit() {}

    public summaryClick($event) {
        this.commandClicked.emit($event);
    }
}
