import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import {Uti} from 'app/utilities';
import {ModalService} from 'app/services';
import {Module} from 'app/models';

@Component({
    selector: 'property-background-gradient',
    styleUrls: ['./property-background-gradient.component.scss'],
    templateUrl: './property-background-gradient.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyBackgroundGradientComponent implements OnInit, OnDestroy {

    public showDialog = false;
    private isPropertyChanged = false;
    perfectScrollbarConfig: any;
    private backgroundGradient: string;
    private typeGradient: string;
    private directionGradient: string;

    @Input() usingModule: Module;

    @Input()  propertiesGradient: any

    @Output() onApply = new EventEmitter<any>();

    constructor(
        private _modalService: ModalService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.initPerfectScroll();
    }


    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }


    public open(item) {
        this.showDialog = true;
        this.changeDetectorRef.markForCheck();
    }

    public close() {
        if (!this.isPropertyChanged) {
            this.onModalExit();
            return;
        }
        this._modalService.unsavedWarningMessageDefault({
            headerText: 'Save Data',
            onModalSaveAndExit: this.apply.bind(this),
            onModalExit: this.onModalExit.bind(this)
        });
        this.changeDetectorRef.markForCheck();
    }

    private onModalExit() {
        this.isPropertyChanged = false;
        this.showDialog = false;
    }


    applyGradientColor($event) {
        this.backgroundGradient = $event && $event.background;
        this.typeGradient = $event && $event.type;
        this.directionGradient = $event && $event.direction;
    }

    changeGradientColor($event) {
        this.isPropertyChanged = true;
        this.backgroundGradient = $event && $event.background;
        this.typeGradient = $event && $event.type;
        this.directionGradient = $event && $event.direction;
    }

    public apply() {
        this.onModalExit();
        this.onApply.emit({
            background: this.backgroundGradient,
            type: this.typeGradient,
            direction: this.directionGradient
        });
    }
}
