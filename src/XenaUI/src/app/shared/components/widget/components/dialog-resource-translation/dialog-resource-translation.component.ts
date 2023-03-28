import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from "@angular/core";
import {
    GlobalSettingService,
    AppErrorHandler,
    DatatableService,
    ModalService,
} from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { ResourceTranslationFormComponent } from "app/shared/components/widget";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { ModalActions } from "app/state-management/store/actions";

@Component({
    selector: "dialog-resource-translation",
    styleUrls: ["./dialog-resource-translation.component.scss"],
    templateUrl: "./dialog-resource-translation.component.html",
})
export class DialogResourceTranslationComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private translateData: any = [];
    public isDirty = false;

    public showDialog = false;
    public keyword = "";
    public defaultValue = "";

    @Output() onSave = new EventEmitter();
    @Output() onClose = new EventEmitter();
    @Output() onSuccessSaved = new EventEmitter();

    @ViewChild("resourceTranslationFormComponent")
    public resourceTranslationFormComponent: ResourceTranslationFormComponent;

    constructor(
        private globalSettingService: GlobalSettingService,
        private appErrorHandler: AppErrorHandler,
        private store: Store<AppState>,
        private modalActions: ModalActions,
        private _toasterService: ToasterService,
        private modalService: ModalService
    ) {}

    public ngOnInit() {}

    public ngOnDestroy() {}

    ngAfterViewInit() {}

    public open() {}

    public save() {
        this.saveTranslateData();
    }

    public cancel() {
        if (!this.isDirty) {
            this.showDialog = false;
            this.onClose.emit();
            this.store.dispatch(
                this.modalActions.modalSetHasTranslatePopup(false)
            );
            return;
        }
        this.store.dispatch(this.modalActions.modalSetHasTranslatePopup(true));
        this.modalService.unsavedWarningMessageDefault({
            headerText: "Saving Changes",
            onModalSaveAndExit: () => {
                this.saveTranslateData();
            },
            onModalExit: () => {
                this.showDialog = false;
                this.store.dispatch(
                    this.modalActions.modalSetHasTranslatePopup(false)
                );
                this.onClose.emit();
            },
        });
    }

    public close() {
        this.showDialog = false;
        this.store.dispatch(this.modalActions.modalSetHasTranslatePopup(false));
        this.onClose.emit();
    }

    public outputDataHandler(translateData: any) {
        this.isDirty = true;
        this.translateData = translateData;
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private saveTranslateData() {
        this.resourceTranslationFormComponent.stopEditing();
        setTimeout(() => {
            this.globalSettingService
                .saveTranslateLabelText(this.prepareDataForSaving())
                .subscribe((response) => {
                    this.appErrorHandler.executeAction(() => {
                        if (response && response.eventType === "Successfully") {
                            this._toasterService.pop(
                                "success",
                                "Success",
                                "Data is saved successful"
                            );
                            this.isDirty = false;
                            this.showDialog = false;
                            this.onSuccessSaved.emit();
                        }
                    });
                });
        }, 500);
    }

    private prepareDataForSaving(): any {
        if (!this.translateData || !this.translateData.length) return [];
        return {
            Translations: this.translateData.map((x) => {
                return {
                    IdRepTranslateModuleType: 5,
                    IdRepLanguage: x.IdRepLanguage,
                    OriginalText: this.keyword,
                    TranslatedText: x.TranslateText || "",
                    IdTranslateLabelText: x.IdTranslateLabelText || null,
                };
            }),
        };
    }
}
