import { Component, OnInit, OnDestroy, Input } from "@angular/core";

@Component({
    selector: "parked-item-project-status",
    styleUrls: ["./parked-item-project-status.component.scss"],
    templateUrl: "./parked-item-project-status.component.html",
})
export class ParkedItemProjectStatusComponent implements OnInit, OnDestroy {
    public circleOption: any = {
        percent: 85,
        radius: 37,
        outerStrokeWidth: 5,
        innerStrokeWidth: 5,
        space: -5,
    };

    private _showInHeader: boolean = false;
    @Input()
    set showInHeader(value) {
        this._showInHeader = value;
        if (value) {
            this.circleOption = {
                percent: 85,
                radius: 21,
                outerStrokeWidth: 2,
                innerStrokeWidth: 2,
                space: -2,
            };
        } else {
            this.circleOption = {
                percent: 85,
                radius: 37,
                outerStrokeWidth: 5,
                innerStrokeWidth: 5,
                space: -5,
            };
        }
    }

    @Input() selectedEntity: any;

    get showInHeader() {
        return this._showInHeader;
    }

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {}
}
