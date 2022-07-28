import { Component, Output, Input, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'sel-select-group',
    styleUrls: ['./select-group.component.scss'],
    templateUrl: './select-group.component.html'
})
export class SelSelectGroupComponent implements OnInit, OnDestroy {
    @Input() mainList: any;
    @Input() disabledSaveChange: boolean = false;
    @Output() listCheckedChange: EventEmitter<any> = new EventEmitter();
    @Output() saveSelectCountry: EventEmitter<any> = new EventEmitter();
    @Output() addNewGroupClicked: EventEmitter<any> = new EventEmitter();

    public perfectScrollbarConfig: any = {};
    
    constructor() {
    }

    public ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    public ngOnDestroy() {
    }

    public itemChanged($event: any) {
        this.listCheckedChange.emit();
    }

    public onAddNewGroupClicked() {
        this.addNewGroupClicked.emit();
    }

    public onSaveSelectCountry() {
        this.saveSelectCountry.emit();
    }
}
