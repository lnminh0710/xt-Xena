import { Component, Output, Input, EventEmitter, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Uti } from 'app/utilities';
import { SelCountryCheckListComponent } from 'app/shared/components/xn-control';
import camelCase from 'lodash-es/camelCase';
import cloneDeep from 'lodash-es/cloneDeep';
import union from 'lodash-es/union';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {
    CountrySelectionService,
    AppErrorHandler
} from 'app/services';
import {
    ApiResultResponse
} from 'app/models';
import { Subscription } from 'rxjs/Subscription';
import { MenuModuleId } from 'app/app.constants';

@Component({
    selector: 'sel-country-selection-header',
    styleUrls: ['./country-selection-header.component.scss'],
    templateUrl: './country-selection-header.component.html'
})
export class SelCountrySelectionHeaderComponent implements OnInit, OnDestroy {
    public splitter0: any;
    public splitter1: any;
    public isLoading = false;
    public showDialog = false;
    public disabledSaveChange = true;
    public isLeftCollapse = false;
    public isRightCollapse = false;
    public textSearch = '';
    public newGroupName = '';
    public groupList = [];
    public countrySelectedList = [];
    public showRequired = false;
    public requiredMessage = 'required';
    public documentMode: any;
    public countryCheckListClass: any = 0;
    public collapsePanelLeftClass = 'panel-show';
    public collapsePanelRightClass = 'panel-show';
    public selectedCountryClass: any = 0;
    public perfectScrollbarConfig: any = {};
    public countryData: any = {};
    public tempCountryCheckListData: any = {};
    public moduleId: any = {
        Campaign: MenuModuleId.selectionCampaign,
        Broker: MenuModuleId.selectionBroker
    };

    private isSearching = false;
    private currentEntity: any;
    private currentSelectCountry: any;
    private originalSelectedGroupData: any = {
        groupId: null,
        checkedCountries: []
    };
    private currentWidth: any = {};
    private showPanelWidth = 10;

    private countrySelectionServiceSubscription: Subscription;

    @Input() set countryCheckListData(data: any) {
        this.resetForm();
        this.tempCountryCheckListData = cloneDeep(data);
        this.countryData = data;
    };
    @Input() widgetListenKey: string = null;
    @Input() set selectedEntity(selectedEntity: any) {
        this.currentEntity = selectedEntity;
        this.getGroupList();
    };

    // We have two mode
    // 1. Campaign
    // 2. Broker
    @Input() set mode(data: any) {
        this.documentMode = data;
        this.selectedCountryClass = (data === MenuModuleId.selectionBroker) ? 20 : 30;
        this.countryCheckListClass = (data === MenuModuleId.selectionBroker) ? 60 : 70;
        this.isRightCollapse = (data !== MenuModuleId.selectionBroker);
    }
    @Output() selectedCountriesOutput: EventEmitter<any> = new EventEmitter();
    @Output() formChange: EventEmitter<any> = new EventEmitter();

    @ViewChild('selCountryCheckListComponent') selCountryCheckListComponent: SelCountryCheckListComponent;

    constructor(
        private elmRef: ElementRef,
        private toasterService: ToasterService,
        private countrySelectionService: CountrySelectionService,
        private appErrorHandler: AppErrorHandler
    ) {
    }

    public ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        }
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public ngAfterViewInit() {
        this.setCountryCheckListClass();
        this.setCurrentWidth();
        this.registerDoubleClickForSplitter();

        $(document).click();
        setTimeout(() => {
            $(this.elmRef.nativeElement).click();
        });
    }

    public reloadData() {
        this.getGroupList();
    }

    public filterCountry($event: any) {
        this.textSearch = $event;
        this.isSearching = true;
        if (!this.textSearch) {
            this.countryData = cloneDeep(this.tempCountryCheckListData);
            return;
        }
        var tempCountryData = cloneDeep(this.tempCountryCheckListData);
        tempCountryData = tempCountryData.filter(x => { return x.textValue.toLowerCase().indexOf(this.textSearch.toLowerCase()) > -1; });
        this.selCountryCheckListComponent.changeData(tempCountryData);
    }

    public cancelCreatingNewGroup() {
        this.requiredMessage = 'required';
        this.newGroupName = '';
        this.showRequired = false;
        this.showDialog = false;
    }

    public addNewGroupClicked() {
        this.showDialog = true;
    }

    public newGroupNameChanged() {
        this.showRequired = !this.newGroupName;
    }

    public createNewGroup() {
        if (!this.newGroupName) {
            this.showRequired = true;
            return;
        }
        // check exist name of group 
        if (this.checkExitsGroupName(this.newGroupName)) {
            // show message existed
            this.requiredMessage = 'The group name is existed.';
            this.showRequired = true;
            return;
        }
        this.setActiveAllGroup(false);

        let newGroupCountries = this.getSelectedCountries();
        if (newGroupCountries.length) {
            newGroupCountries = newGroupCountries.map((currentValue, index, arr) => {
                return {
                    IsActive: 1,
                    IdRepCountryLangauge: currentValue,
                    IdSelectionProject: this.currentEntity[camelCase(this.widgetListenKey)],
                    QtyToNeeded: 1
                };
            });

            this.countrySelectionServiceSubscription = this.countrySelectionService.saveCountryGroups({ groupName: this.newGroupName }, newGroupCountries)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response) || !response.item) {
                            return;
                        }
                        this.currentSelectCountry = {
                            idValue: response.item.returnID,
                            textValue: this.newGroupName,
                            isActive: true
                        };

                        this.groupList.push(this.currentSelectCountry);

                        this.disabledSaveChange = false;
                        this.newGroupName = '';
                        this.showRequired = false;
                        this.showDialog = false;
                        this.toasterService.pop('success', 'Success', 'Group name is saved successfully');
                        this.requiredMessage = 'required';
                    });
                });
        }
    }

    public countryCheckListOutputData($event: any) {
        if (this.textSearch) {
            this.updateCountryTempData($event);
        } else {
            if (this.isSearching) {
                this.isSearching = false;
                return;
            }
            this.countrySelectedList = $event;
            this.tempCountryCheckListData = cloneDeep($event);
        }
        this.setDataForGridCountrySelected();
    }

    private updateCountryTempData(processingData: any) {
        if (!processingData || !processingData.length) return;
        let addMoreItem = [];
        for (let item of processingData) {
            const currentItem = this.countrySelectedList.find(x => x.idValue === item.idValue);
            // if existing in current list to only set Active value
            if (currentItem && currentItem.idValue) {
                currentItem.isActive = item.isActive;
            } else {
                // if doesn't exist in current list to push to current list
                addMoreItem.push(item);
            }
            // update isActive for temp data
            const currentTempItem = this.tempCountryCheckListData.find(x => x.idValue === item.idValue);
            if (currentTempItem && currentTempItem.idValue) {
                currentTempItem.isActive = item.isActive;
            }
        }
        if (addMoreItem.length) {
            this.countrySelectedList = this.countrySelectedList.concat(addMoreItem);
        }
    }

    public countrySelectedChanged(idValue: any) {
        this.selCountryCheckListComponent.setActiveForItem(idValue, false);
        for (let item of this.countrySelectedList) {
            if (item.idValue === idValue) {
                item.isActive = false;
                break;
            }
        }
        this.setDataForGridCountrySelected();
    }

    public groupListCheckedChange() {
        var selectedGroup = this.groupList.filter(x => { return x.isActive; });
        if (!selectedGroup || !selectedGroup.length) {
            // uncheck all country
            this.countryData.forEach((item, index) => {
                this.selCountryCheckListComponent.setActiveForItem(item.idValue, false);
            });
            this.disabledSaveChange = true;
            this.currentSelectCountry = null;
            return;
        }
        if (selectedGroup.length === 1) {
            this.disabledSaveChange = false;
            this.currentSelectCountry = selectedGroup[0];
        } else {
            this.disabledSaveChange = true;
            this.currentSelectCountry = null;
        }

        // build check for countries
        this.buildForCountryChecked(selectedGroup);
        this.formChange.emit();
    }

    public saveSelectCountry() {
        if (!this.currentSelectCountry) {
            return;
        }

        let selectedCountries = this.getSelectedCountries();
        if (selectedCountries.length) {
            let updateGroupCountries: any[] = [];
            for (let country of selectedCountries) {
                if (this.originalSelectedGroupData.checkedCountries.indexOf(country) === -1) {
                    updateGroupCountries.push({
                        IsActive: 1,
                        IdRepCountryLangauge: country,
                        IdSelectionProject: this.currentEntity[camelCase(this.widgetListenKey)],
                        QtyToNeeded: 1
                    });
                }
            }

            for (let country of this.originalSelectedGroupData.checkedCountries) {
                if (selectedCountries.indexOf(country) === -1) {
                    updateGroupCountries.push({
                        IsDeleted: 1,
                        IdRepCountryLangauge: country
                    });
                }
            }

            this.countrySelectionServiceSubscription = this.countrySelectionService.saveCountryGroups(this.originalSelectedGroupData, updateGroupCountries)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response) || !response.item) {
                            return;
                        }

                        this.originalSelectedGroupData.checkedCountries = selectedCountries;

                        this.toasterService.pop('success', 'Success', 'Group is saved successfully');
                    });
                });
        }
    }

    public collapseLeft() {
        this.isLeftCollapse = !this.isLeftCollapse;
        if (this.isLeftCollapse) {
            this.splitter0.hide();
        } else {
            this.splitter0.show();
        }
        this.reCalculateSize();
        this.collapsePanelLeftClass = this.isLeftCollapse ? 'collapse-left-hide' : 'panel-show';
    }

    public collapseRight() {
        this.isRightCollapse = !this.isRightCollapse;
        if (this.isRightCollapse) {
            this.splitter1.hide();
        } else {
            this.splitter1.show();
        }
        this.reCalculateSize();
        this.collapsePanelRightClass = this.isRightCollapse ? 'collapse-right-hide' : 'panel-show';
    }

    public dragStart(event: any) {
        this.setCurrentWidth();

    }

    public dragEnd(event: any) {
        setTimeout(() => {
            this.setCurrentWidth();
        }, 200);
    }

    public onCountryCheckListChanged($event) {
        this.formChange.emit();
    }

    private resetForm() {
        this.textSearch = '';
        this.isSearching = false;
        this.disabledSaveChange = true;
        this.newGroupName = '';
    }

    private getGroupList() {
        if (!this.currentEntity) {
            return;
        }

        this.countrySelectionServiceSubscription = this.countrySelectionService.getCountryGroupsName(this.currentEntity[camelCase(this.widgetListenKey)])
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.length) {
                        return;
                    }

                    this.groupList = response.item[0].map((currentValue, index, arr) => {
                        return {
                            idValue: currentValue.IdRepCountryLangaugeGroupsName,
                            textValue: currentValue.GroupName
                        }
                    });
                });
            });
    }

    private registerDoubleClickForSplitter() {
        const splitters = $('split-gutter', this.elmRef.nativeElement);
        if (!splitters || !splitters.length) return;
        this.splitter0 = $(splitters[0]);
        this.splitter0.dblclick(() => { this.collapseLeft(); });
        if (splitters.length === 2) {
            this.splitter1 = $(splitters[1]);
            this.splitter1.dblclick(() => { this.collapseRight(); });
        }
    }

    private setActiveAllGroup(isActive) {
        this.groupList.forEach((item, index) => {
            item.isActive = isActive;
        });
    }

    private checkExitsGroupName(groupName: string) {
        var item = this.groupList.find(x => x.textValue === groupName);
        return (item && item.idValue);
    }

    private getSelectedCountries(): any {
        var result = [];
        this.countrySelectedList.forEach((item, index) => {
            if (item.isActive) {
                result.push(item.idValue);
            }
        });
        return result;
    }

    private setDataForGridCountrySelected() {
        switch (this.documentMode) {
            // Case for campaign
            case MenuModuleId.selectionCampaign: {
                this.selectedCountriesOutput.emit(this.countrySelectedList);
                break;
            }
            // Case for broker
            case MenuModuleId.selectionBroker: {
                const selectedCountries = this.countrySelectedList.filter(x => { return x.isActive; });
                this.selectedCountriesOutput.emit(selectedCountries);
                break;
            }
            default: break;
        }
    }

    private reCalculateSize() {
        const left = $('.sel-country-selected', this.elmRef.nativeElement);
        const middle = $('.sel-country-check-list', this.elmRef.nativeElement);
        const right = $('.sel-select-group', this.elmRef.nativeElement);
        const spacingRight = (this.documentMode == MenuModuleId.selectionBroker) ? this.showPanelWidth : 0;

        // Dont Have Left and Right
        if (this.isLeftCollapse && this.isRightCollapse) {
            left.css('flex-basis', '0%');
            middle.css('flex-basis', 'calc(100% - ' + spacingRight + 'px)');
            right.css('flex-basis', '0%');
            return;
        }
        // Have Left or Right
        if ((this.isLeftCollapse && !this.isRightCollapse) || (!this.isLeftCollapse && this.isRightCollapse)) {
            // Have Left without Right
            if (!this.isLeftCollapse && this.isRightCollapse) {
                left.css('flex-basis', 'calc(' + this.currentWidth.leftSize + '% - ' + (this.currentWidth.splitSize) + 'px)');
                middle.css('flex-basis', 'calc(' + (100 - this.currentWidth.leftSize) + '% - ' + ((this.currentWidth.splitSize) + spacingRight) + 'px)');
                right.css('flex-basis', '0%');
                return;
            }
            // Have Right without Left
            left.css('flex-basis', '0%');
            middle.css('flex-basis', 'calc(' + (100 - this.currentWidth.rightSize) + '% - ' + (this.currentWidth.splitSize) + 'px)');
            right.css('flex-basis', 'calc(' + this.currentWidth.rightSize + '% - ' + (this.currentWidth.splitSize) + 'px)');
            return;
        }
        // Have Left and Right
        if (!this.isLeftCollapse && !this.isRightCollapse) {
            left.css('flex-basis', 'calc(' + this.currentWidth.leftSize + '% - ' + (this.currentWidth.splitSize / 2) + 'px)');
            middle.css('flex-basis', 'calc(' + (100 - (this.currentWidth.leftSize + this.currentWidth.rightSize)) + '% - ' + this.currentWidth.splitSize + 'px)');
            right.css('flex-basis', 'calc(' + this.currentWidth.rightSize + '% - ' + (this.currentWidth.splitSize / 2) + 'px)');
        }
    }

    private setCurrentWidth() {
        let totalSize, leftSize, rightSize, splitSize: any;
        const total = $('.country-selection-header', this.elmRef.nativeElement);
        if (total && total.length) {
            totalSize = total.innerWidth();
        }
        const left = $('.sel-country-selected', this.elmRef.nativeElement);
        if (left && left.length) {
            leftSize = left.innerWidth();
        }
        const right = $('.sel-select-group', this.elmRef.nativeElement);
        if (right && right.length) {
            rightSize = right.innerWidth();
        }
        const splitters = $('split-gutter', this.elmRef.nativeElement);
        if (splitters && splitters.length) {
            splitSize = $(splitters[0]).innerWidth();
        }
        if (splitSize <= 10)
            this.currentWidth.splitSize = splitSize;
        if (!this.isLeftCollapse)
            this.currentWidth.leftSize = (leftSize * 100) / totalSize;
        if (!this.isRightCollapse)
            this.currentWidth.rightSize = (rightSize * 100) / totalSize;
        if (this.documentMode == MenuModuleId.selectionCampaign) return;

        // Keep the size is zero when collpase the panel
        const middle = $('.sel-country-check-list', this.elmRef.nativeElement);
        if (this.isLeftCollapse && this.isRightCollapse) {
            left.css('flex-basis', '0%');
            middle.css('flex-basis', 'calc(100% - ' + this.showPanelWidth + 'px)');
            right.css('flex-basis', '0%');
            return;
        }
        if (this.isLeftCollapse) {
            left.css('flex-basis', '0%');
            middle.css('flex-basis', 'calc(' + (100 - this.currentWidth.rightSize) + '% - ' + ((this.currentWidth.splitSize)) + 'px)');
            return;
        }
        if (this.isRightCollapse) {
            right.css('flex-basis', '0%');
            middle.css('flex-basis', 'calc(' + (100 - this.currentWidth.leftSize) + '% - ' + ((this.currentWidth.splitSize) + this.showPanelWidth) + 'px)');
        }
    }

    private setCountryCheckListClass() {
        if (this.isLeftCollapse && this.isRightCollapse) {
            this.countryCheckListClass = 100;
            return;
        }
        if ((this.isLeftCollapse && !this.isRightCollapse) || (!this.isLeftCollapse && this.isRightCollapse)) {
            this.countryCheckListClass = (this.documentMode === MenuModuleId.selectionBroker) ? 80 : 70;
            return;
        }
        if (!this.isLeftCollapse && !this.isRightCollapse) {
            this.countryCheckListClass = 60;
            return;
        }
    }
    private buildForCountryChecked(groupSelectedItems: any) {
        var checkedIdValueList = [];
        for (let group of groupSelectedItems) {
            this.countrySelectionServiceSubscription = this.countrySelectionService.getCountryGroupsList(group.idValue)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response) || !response.item.length) {
                            return;
                        }

                        checkedIdValueList = union(checkedIdValueList, response.item[0].map((currentValue, index, arr) => {
                            return currentValue.IdRepIsoCountryCode;
                        }));

                        if (groupSelectedItems.length === 1) {
                            this.originalSelectedGroupData.groupId = group.idValue;
                            this.originalSelectedGroupData.groupName = group.textValue;
                            this.originalSelectedGroupData.checkedCountries = checkedIdValueList
                        } else {
                            this.originalSelectedGroupData.groupId = null;
                            this.originalSelectedGroupData.groupName = null;
                            this.originalSelectedGroupData.checkedCountries = [];
                        }

                        for (let country of this.countryData) {
                            if (checkedIdValueList.indexOf(country.idValue) > -1) {
                                this.selCountryCheckListComponent.setActiveForItem(country.idValue, true);
                            } else {
                                this.selCountryCheckListComponent.setActiveForItem(country.idValue, false);
                            }
                        }
                    });
                });
        }
    }
}

