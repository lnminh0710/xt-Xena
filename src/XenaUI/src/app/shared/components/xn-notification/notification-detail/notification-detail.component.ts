
import {
    Component,
    OnInit,
    Input,
    Output,
    OnDestroy,
    EventEmitter
} from '@angular/core';
import {
    BaseComponent
} from 'app/pages/private/base';
import {
    Router
} from '@angular/router';
import { DownloadFileService, ModalService } from 'app/services';
import { Uti } from 'app/utilities';

@Component({
    selector: 'notification-detail',
    styleUrls: ['./notification-detail.component.scss'],
    templateUrl: './notification-detail.component.html'
})
export class NotificationDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    public perfectScrollbarConfig: any;

    @Input() data: any = {};

    constructor(
        private _downloadFileService: DownloadFileService,
        private _modalService: ModalService,
        router ? : Router) {
        super(router);
    }
    public ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }
    public ngOnDestroy() {
    }

    public downloadPDFClicked() {
        this._downloadFileService.makeDownloadFile(this.data.PicturePath, this.data.PicturePath.split(/[\\ ]+/).pop(), this._modalService);
    }
    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/
}
