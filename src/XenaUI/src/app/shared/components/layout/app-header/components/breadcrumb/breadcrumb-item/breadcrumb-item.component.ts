import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { BreadcrumbModel } from "app/models";

@Component({
    selector: "breadcrumb-item",
    styleUrls: ["./breadcrumb-item.component.scss"],
    templateUrl: "./breadcrumb-item.component.html",
})
export class BreadcrumbItemComponent implements OnInit, OnDestroy {
    @Input() data: BreadcrumbModel = null;

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {}
}
