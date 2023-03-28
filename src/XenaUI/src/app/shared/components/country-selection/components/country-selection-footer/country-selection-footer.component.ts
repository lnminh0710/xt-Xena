import {
    Component,
    Output,
    Input,
    OnInit,
    OnDestroy,
    EventEmitter,
} from "@angular/core";
import { GlobalSettingService, AppErrorHandler } from "app/services";

@Component({
    selector: "sel-country-selection-footer",
    styleUrls: ["./country-selection-footer.component.scss"],
    templateUrl: "./country-selection-footer.component.html",
})
export class SelCountrySelectionFooterComponent implements OnInit, OnDestroy {
    public _isEdit: boolean;
    public columnsLayoutSettings: any = {};

    @Input() isEdit: boolean = false;
    @Input() selectedCountryData: any;
    @Input() globalProperties: any;
    @Input() gridId: string;

    @Output() onItemEdited: EventEmitter<any> = new EventEmitter();

    constructor(
        private globalSettingService: GlobalSettingService,
        private appErrorHandler: AppErrorHandler
    ) {}

    public ngOnInit() {
        this.loadColumnLayoutSettings();
    }

    public ngOnDestroy() {}

    public onTableEditSuccess($event: any) {
        this.onItemEdited.emit($event);
    }

    private loadColumnLayoutSettings() {
        this.globalSettingService
            .getAllGlobalSettings(-1)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (data && data.length) {
                        let gridColLayoutSettings = data.filter(
                            (p) => p.globalType == "GridColLayout"
                        );
                        if (
                            gridColLayoutSettings &&
                            gridColLayoutSettings.length
                        ) {
                            gridColLayoutSettings.forEach((setting) => {
                                this.columnsLayoutSettings[setting.globalName] =
                                    JSON.parse(setting.jsonSettings);
                            });
                        }
                    }
                });
            });
    }
}
