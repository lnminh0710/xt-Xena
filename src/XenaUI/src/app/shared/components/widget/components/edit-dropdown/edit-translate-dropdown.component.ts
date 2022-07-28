import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'edit-translate-dropdown',
    styleUrls: ['./edit-dropdown.component.scss'],
    templateUrl: './edit-translate-dropdown.component.html'
})

export class EditTranslateDropdownComponent implements OnInit, OnDestroy {

    @Input() isTable: boolean;
    @Input() isForm: boolean;

    @Output() translateHeaderClick = new EventEmitter<any>();
    @Output() translateRowClick = new EventEmitter<any>();
    @Output() translateFormClick = new EventEmitter<any>();

    constructor() { }

    ngOnInit() { }

    ngOnDestroy() { }

    public translateHeader() {
        this.translateHeaderClick.emit();
    }

    public translateRow() {
        this.translateRowClick.emit();
    }

    public translateForm() {
        this.translateFormClick.emit();
    }

}
