import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppErrorHandler, DataEntryService, ObservableShareService, PersonService, DataEntryProcess, CommonService } from 'app/services';
import cloneDeep from 'lodash-es/cloneDeep';
import { DataEntryActions } from 'app/state-management/store/actions';
import { Uti } from 'app/utilities';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { Router } from '@angular/router';
import { OrderDataEntryScaningStatusModel } from 'app/models';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { ComboBoxTypeConstant } from 'app/app.constants';
import * as wjcCore from 'wijmo/wijmo';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'data-entry-scanning-status',
    templateUrl: './scanning-status.component.html',
    styleUrls: ['./scanning-status.component.scss'],

})
export class DataEntryScanningStatusComponent extends DataEntryFormBase implements OnInit, OnDestroy {
    private scanningStatusDataState: Observable<any>;
    private scanningStatusDataStateSubscription: Subscription;
    private scanningStatusDataStateCallReload: Observable<any>;
    private scanningStatusDataStateCallReloadSubscription: Subscription;
    private scanningStatusDataStateCallSkip: Observable<any>;
    private scanningStatusDataStateCallSkipSubscription: Subscription;
    private scanningStatusDataStateCallDelete: Observable<any>;
    private scanningStatusDataStateCallDeleteSubscription: Subscription;

    public itemFormatterLotName = this.customItemFormatterLotName.bind(this);
    private currentScanningData = [];

    public data = {
        totalData: {
            lotName: '',
            qtyCapture: 0,
            remaningOrder: 0,
            sendToAdmin: 0,
            skipped: 0,
            totalOrder: 0
        },
        bodyData: []
    };

    public perfectScrollbarConfig: any = {};
    public tempImageUrl = '';

    @Input() tabID: string;

    public lotNames = [];
    @ViewChild('lotNameCtl') lotNameCtl: AngularMultiSelect;

    constructor(
        private appErrorHandler: AppErrorHandler,
        private dataEntryService: DataEntryService,
        private dataEntryAction: DataEntryActions,
        private store: Store<AppState>,
        protected router: Router,
        protected obserableShareService: ObservableShareService,
        private personServ: PersonService,
        private dataEntryProcess: DataEntryProcess,
        private commonService: CommonService
    ) {
        super(router, {
            defaultTranslateText: 'scanningStatusData',
            emptyData: new OrderDataEntryScaningStatusModel()
        });

        this.scanningStatusDataState = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).scanningStatusData);
        this.scanningStatusDataStateCallReload = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).scanningStatusCallReload);
        this.scanningStatusDataStateCallSkip = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).scanningStatusCallSkip);
        this.scanningStatusDataStateCallDelete = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).scanningStatusCallDelete);
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.loadScanningLot();
        this.subscription();

        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        this.store.dispatch(this.dataEntryAction.dataEntryScanningStatusSummary([], this.tabID));
        this.store.dispatch(this.dataEntryAction.dataEntryScanningStatusCallReload(false, this.tabID));
        this.store.dispatch(this.dataEntryAction.dataEntryScanningStatusCallSkip(false, this.tabID));

        Uti.unsubscribe(this);
    }

    public rebuildTranslateText() { }

    private subscription() {
        this.scanningStatusDataStateSubscription = this.scanningStatusDataState.subscribe((response) => {
            this.appErrorHandler.executeAction(() => {
                if (!response) return;

                this.currentScanningData = response;
            });
        });

        this.scanningStatusDataStateCallReloadSubscription = this.scanningStatusDataStateCallReload.subscribe((response) => {
            this.appErrorHandler.executeAction(() => {
                if (!response || !response.reload) return;

                this.loadScanningData();

                this.preventLoadScanningData = true;
                this.loadScanningLot(true);
            });
        });
        this.scanningStatusDataStateCallSkipSubscription = this.scanningStatusDataStateCallSkip.subscribe((response) => {
            this.appErrorHandler.executeAction(() => {
                if (!response || !response.skip ||
                    !this.currentScanningData || !this.currentScanningData.length)
                    return;

                this.loadScanningData(this.currentScanningData[0].id || '', this.currentScanningData[0].idScansContainerItems || '');

                this.preventLoadScanningData = true;
                this.loadScanningLot(true);
            });
        });
        this.scanningStatusDataStateCallDeleteSubscription = this.scanningStatusDataStateCallDelete.subscribe((response) => {
          this.appErrorHandler.executeAction(() => {
            if (!response || !response.delete ||
              !this.currentScanningData || !this.currentScanningData.length)
              return;

              this.dataEntryService.deleteOrderDataEntry(this.currentScanningData[0].idScansContainerItems)
                  .subscribe((response :any)=>{
                    this.loadScanningData(this.currentScanningData[0].id || '', this.currentScanningData[0].idScansContainerItems || '');
                    this.preventLoadScanningData = false;
                    this.loadScanningLot(true);
                  })
          });
      });
    }

    private loadScanningLot(isReload?: boolean) {
        this.commonService.getListComboBox('' + ComboBoxTypeConstant.dataEntryLots, null, true)
            .subscribe((response: any) => {
                if (!response || !response.item || !response.item.dataEntryLots)
                    return null;

                this.lotNames = response.item.dataEntryLots;

                if (isReload && this.lotNameCtl.isInitialized) {
                    this.lotNameReload();
                }
            });
    }

    private loadScanningData(skipIdPreload?: any, idScansContainerItems?: any) {
        this.dataEntryProcess.ignoreProcessForSubcribeScanningStatusData = false;

        if (this.currentScanningData && this.currentScanningData.length) {
            this.processForLoadFromBuffer();
            setTimeout(() => {
                this.getPreloadOrderData(skipIdPreload, idScansContainerItems);
            }, 300);
        }
        else {
            this.getPreloadOrderData(skipIdPreload, idScansContainerItems);
        }
    }

    private getPreloadOrderData(skipIdPreload?: any, idScansContainerItems?: any) {
        const lotId: number = this.autoSelectLot ? null : this.lotNameCtl.selectedValue;

        if (!this.autoSelectLot) {
            this.lotNameCtl.isDisabled = true;
            this.lotNameCtl.refresh();
        }
        this.dataEntryService.getPreloadOrderData(skipIdPreload, idScansContainerItems, lotId)
            .finally(() => {
                //only enable when choosing Lot
                if (!this.autoSelectLot) {
                    this.lotNameCtl.isDisabled = false;
                    this.lotNameCtl.refresh();
                }
            })
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {

                    /* response is Array with:
                     * 0: ???
                     * 1: Scanning Items: 5 items
                     * 2: Summary
                     * 3: {EventType, ReturnID, StoredName}
                     */

                    if (!response || !response.data || !response.data.length || response.data.length < 4 || !response.data[1])
                        return;

                    this.loadBufferForNextItem(response.data[1]);
                    this.makeData(response.data[1]);

                    //Summary
                    if (response.data[2] && response.data[2][0]) {
                        this.data.totalData = this.makeTotalData(response.data[2][0]);
                    }
                });
            });
    }

    private processForLoadFromBuffer() {
        if (!this.currentScanningData || !this.currentScanningData.length) {
            this.dataEntryProcess.isLoadFromBuffer = false;
            return;
        }

        this.dataEntryProcess.isLoadFromBuffer = true;

        let tempData = cloneDeep(this.currentScanningData);
        // remove first Item
        tempData.shift();

        // save data to Store
        this.store.dispatch(this.dataEntryAction.dataEntryScanningStatusSummary(tempData, this.tabID));

        //set the first item is Next item
        if (tempData.length)
            tempData[0].isNext = true;

        this.data.bodyData = tempData;
        // load new image
        this.setTempImageUrl();
    }

    private makeData(data: any) {
        // create Body Data
        const newData = this.mapBodyData(data);

        if (this.dataEntryProcess.isLoadFromBuffer)
            this.dataEntryProcess.ignoreProcessForSubcribeScanningStatusData = true;

        // save data to Store
        this.store.dispatch(this.dataEntryAction.dataEntryScanningStatusSummary(newData, this.tabID));

        const tempData = cloneDeep(newData);
        // remove first Item in newdata to display in UI
        if (tempData.length)
            tempData.shift();

        //set the first item is Next item
        if (tempData.length)
            tempData[0].isNext = true;

        this.data.bodyData = tempData;
        // load new image
        this.setTempImageUrl();
    }

    private setTempImageUrl() {
        if (!this.data.bodyData || !this.data.bodyData.length) {
            this.tempImageUrl = null;
            return;
        }

        this.tempImageUrl = this.dataEntryService.buildImageFullPath(this.data.bodyData);
    }

    private mapBodyData(data: any): any {
        let result = [];
        const maxLength = data.length > 5 ? 5 : data.length;
        for (let i = 0; i < maxLength; i++) {
            const x = data[i];
            if (typeof x.CampaignNr !== 'string') {
                x.CampaignNr = '';
            }
            if (typeof x.Notes !== 'string') {
                x.Notes = '';
            }
            result.push({
                id: x.IdScansContainerItemsPreload,
                fileName: x.ScannedFilename,
                customerNr: x.CustomerNr,
                mediaCode: x.MediaCode,
                campaignNr: x.CampaignNr,
                dataInfor: x.CampaignNr,
                isNext: false,
                fileUrl: x.ScannedPath,
                numberOfImages: x.NumberOfImages,
                idScansContainerItems: x.IdScansContainerItems,
                notes: x.Notes
            });
        }//for

        return result;
    }

    private makeTotalData(data) {
        return {
            lotName: Uti.isNullUndefinedEmptyObject(data['Lot-Name']) ? '' : data['Lot-Name'],
            qtyCapture: Uti.isNullUndefinedEmptyObject(data['QtyCapture']) ? 0 : data['QtyCapture'],
            remaningOrder: Uti.isNullUndefinedEmptyObject(data['Remaning Order']) ? 0 : data['Remaning Order'],
            sendToAdmin: Uti.isNullUndefinedEmptyObject(data['Send to Admin']) ? 0 : data['Send to Admin'],
            skipped: Uti.isNullUndefinedEmptyObject(data['Skipped']) ? 0 : data['Skipped'],
            totalOrder: Uti.isNullUndefinedEmptyObject(data['Total Order']) ? 0 : data['Total Order']
        }
    }

    private loadBufferForNextItem(data: any) {
        if (!data || !data.length) return;

        this.personServ.getPersonById('').subscribe();
        this.personServ.getMandatoryField('Customer').subscribe();

        //Cache for item 0: used for case reload, will not get the item 0
        this.loadBufferForItem(data[0]);

        //Cache for item 1
        if (data.length > 1)
            this.loadBufferForItem(data[1]);

        //Cache for item 2
        if (data.length > 2)
            this.loadBufferForItem(data[2]);
    }

    private loadBufferForItem(item: any) {
        /*
        OrderDataEntry/GetCustomerData?customerNr=177142
        OrderDataEntry/GetArticleData?mediacode=0384VK280-00003-0
        OrderDataEntry/GetMainCurrencyAndPaymentType?mediacode=0384VK280-00003-0&campaignNr=
         */

        if (item.CustomerNr)
            this.dataEntryService.getCustomerDataByCustomerNr(item.CustomerNr, true, item.MediaCode).subscribe();

        if (item.MediaCode) {
            this.dataEntryService.getArticleDataByMediacodeNr(item.MediaCode, true).subscribe();
            this.dataEntryService.getMainCurrencyAndPaymentType(item.MediaCode, item.CampaignNr, true).subscribe();
        }
    }

    public resetData() {
        this.dataEntryProcess.currentScanningLotId = null;
        this.makeData([]);
        this.data.totalData = this.makeTotalData({});
    }

    //#region Lot
    private preventLoadScanningData: boolean = true;//True: prevent loading Scanning Data

    public autoSelectLot: boolean = true;
    public autoSelectLotChange() {
        this.lotNameCtl.isDisabled = this.autoSelectLot;

        this.dataEntryProcess.currentScanningLotId = null;
        this.lotNameCtl.selectedItem = null;

        if (this.autoSelectLot)
            this.loadScanningData();
        else
            this.resetData();
    }

    private getLastestLotIndex() {
        if (!this.lotNames.length || !this.dataEntryProcess.currentScanningLotId) return null;

        return this.lotNames.findIndex((item) => { return item.idValue == this.dataEntryProcess.currentScanningLotId });
    }

    private lotNameTempTemplate: string = '<div class="col-md-12 col-lg-12 xn-wj-ddl-item"><div class="col-sm-9 no-padding-left">{lotName}</div><div class="col-sm-1" style="display:none" > - </div><div class="col-sm-3 no-padding-right border-left" >{textValue}&nbsp;</div></div>';
    public customItemFormatterLotName(index, content) {
        if (this.lotNames && this.lotNames.length) {
            return wjcCore.format(this.lotNameTempTemplate, this.lotNames[index]);
        }
    }

    private lotNameReload() {
        setTimeout(() => {
            if (this.autoSelectLot) {
                this.preventLoadScanningData = false;
                return;
            }

            //if there is the lastest LotId and -> new array lotNames doesn't contain that LotId
            let lastestLotIndex: number = this.getLastestLotIndex();
            if (lastestLotIndex != null && lastestLotIndex != -1) {
                //set lastest lot
                this.lotNameCtl.selectedIndex = lastestLotIndex;
                //When call .refresh() -> the 'lotNameChanged' event fired
                //To prevent loading Scanning-Data, we set 'preventLoadScanningData = true'
                this.lotNameCtl.refresh();
            }
            else {
                this.lotNameCtl.selectedItem = null;
                this.resetData();
            }

            // set 'preventLoadScanningData = false' to allow loading Scanning-Data when lotName Changed.
            setTimeout(() => {
                this.preventLoadScanningData = false;
            }, 300);
        });
    }

    public lotNameInitialized() {
        setTimeout(() => {
            //if there is the lastest LotId -> load scanning by LotId
            let lastestLotIndex: number = this.getLastestLotIndex();
            if (lastestLotIndex != null && lastestLotIndex != -1) {
                this.autoSelectLot = false;
            }
            else {
                lastestLotIndex = -1;
                this.autoSelectLot = true;
                //load scanning data for the first load
                this.loadScanningData();
            }

            this.preventLoadScanningData = false;
            this.lotNameCtl.selectedIndex = lastestLotIndex;
            this.lotNameCtl.refresh();
        });
    }

    public lotNameDroppedDown() {
        this.lotNameCtl.isDroppedDown = !this.lotNameCtl.isDroppedDown;
        this.lotNameCtl.onIsDroppedDownChanged();
    }

    public lotNameChanged($event) {
        this.loadDataByLotId();
    }

    private loadDataByLotId() {
        const selectedValue = this.lotNameCtl.selectedValue;
        if (this.autoSelectLot || !selectedValue || this.preventLoadScanningData) return;

        this.dataEntryProcess.currentScanningLotId = Number(selectedValue);
        this.loadScanningData();
    }
    //#endregion
}
