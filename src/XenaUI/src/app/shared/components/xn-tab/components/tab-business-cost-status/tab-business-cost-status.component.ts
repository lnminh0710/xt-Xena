import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-tab-business-cost-status",
    styleUrls: ["./tab-business-cost-status.component.scss"],
    templateUrl: "./tab-business-cost-status.component.html",
})
export class TabBusinessCostStatusComponent implements OnInit {
    @Input() status = "good";
    @Input() mainTabActive = false;

    constructor() {}

    public ngOnInit() {}
}
