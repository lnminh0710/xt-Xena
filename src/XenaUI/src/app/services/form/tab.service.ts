import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';
import { AccessRightsService } from 'app/services';
import {
  TabSummaryModel,
  Module,
  SimpleTabModel,
  ApiResultResponse,
} from 'app/models';

import toSafeInteger from 'lodash-es/toSafeInteger';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import { AccessRightTypeEnum } from 'app/app.constants';

@Injectable()
export class TabService extends BaseService {
  constructor(
    injector: Injector,
    @Inject(forwardRef(() => AccessRightsService))
    private accessRightsService: AccessRightsService
  ) {
    super(injector);
  }

  public getTabSummaryInfor(param: any): Observable<ApiResultResponse> {
    let getParam = {
      moduleName: param.module.idSettingsGUI,
      idObject: param.idObject,
    };
    return this.get<ApiResultResponse>(
      this.serUrl.getTabSummaryInfor,
      getParam,
      null,
      null
    ).map((result: any) => {
      //Set accessRight for tab summary
      this.accessRightsService.SetAccessRightsForTabSummary(
        param.module,
        result.item
      );

      return result;
    });
  }

  /**
   * getMainTabHeader
   * Find main tab in tab list.
   * Case 1: If any, then set visible = true
   * Case 2: If not, create empty TabSummaryModel object and set visible = false.
   * @param tabs
   */
  getMainTabHeader(tabs: TabSummaryModel[]) {
    let mainTab = tabs.find((t) => t.tabSummaryInfor.isMainTab);
    if (mainTab) {
      mainTab.visible = true;
    } else {
      mainTab = new TabSummaryModel({ visible: false });
    }
    return mainTab;
  }

  /**
   * getOtherTabsHeader
   * @param tabs
   */
  getOtherTabsHeader(tabs: TabSummaryModel[]) {
    return tabs.filter((t) => !t.tabSummaryInfor.isMainTab) || [];
  }

  /**
   * getMainTabContent
   * @param tabs
   * @param tabSummaries
   */
  getMainTabContent(tabs: Array<any>, tabSummaries: TabSummaryModel[]) {
    let mainTabContent: any = { visible: false };
    const mainTabHeader = tabSummaries.filter(
      (t) => t.tabSummaryInfor.isMainTab
    );
    if (mainTabHeader.length) {
      tabs.forEach((tab) => {
        const rs = mainTabHeader.find(
          (p) => p.tabSummaryInfor.tabID == tab.TabID
        );
        if (rs) {
          mainTabContent = tab;
          mainTabContent.visible = true;
          mainTabContent.accessRight = rs.accessRight;
          mainTabContent.keepContentState = !!toSafeInteger(
            tab.KeepContentState
          );
        }
      });
    }
    return mainTabContent;
  }

  /**
   * getOtherTabsContent
   * @param tabs
   * @param tabSummaries
   */
  getOtherTabsContent(tabs: Array<any>, tabSummaries: TabSummaryModel[]) {
    let otherTabsContent: Array<any> = [];
    const othersTabHeader = tabSummaries.filter(
      (t) => !t.tabSummaryInfor.isMainTab
    );
    if (othersTabHeader.length) {
      tabs.forEach((tab) => {
        const rs = othersTabHeader.find(
          (p) => p.tabSummaryInfor.tabID == tab.TabID
        );
        if (rs) {
          otherTabsContent.push(
            Object.assign({}, tab, { accessRight: rs.accessRight })
          );
        }
      });
    }
    return otherTabsContent;
  }

  unSelectTabs(tabs: TabSummaryModel[]) {
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].active = false;
    }
  }

  unSelectCurentActiveTab(tabs: TabSummaryModel[]) {
    const curActiveTab = tabs.filter((tab) => {
      return tab.active === true;
    });

    if (curActiveTab.length) {
      curActiveTab[0].active = false;
    }
  }

  buildOtherTabsContent(tabs: TabSummaryModel[], configTabs: any) {
    const newTabs = [];
    for (let i = 0; i < tabs.length; i++) {
      for (let j = 0; j < configTabs.length; j++) {
        if (tabs[i].tabSummaryInfor.tabID === configTabs[j].TabID) {
          newTabs.push(configTabs[j]);
        }
      }
    }

    return newTabs;
  }

  appendProp(tabs, prop, val) {
    for (let i = 0; i < tabs.length; i++) {
      tabs[i][prop] = val;
    }

    return tabs;
  }

  appendMainTabData(mainTab, data) {
    mainTab.tabSummaryInfor = data[0].tabSummaryInfor;
    mainTab.tabSummaryData = data[0].tabSummaryData;
    mainTab.disabled = isNil(data[0].disabled) ? false : data[0].disabled;
    mainTab.visible = isNil(data[0].visible) ? true : data[0].visible;
    return mainTab;
  }

  appendOtherTabsData(otherTabs, data) {
    const tabData = data.slice(1, data.length);

    for (let i = 0; i < tabData.length; i++) {
      for (let j = 0; j < otherTabs.length; j++) {
        if (
          tabData[i].tabSummaryInfor.tabID ===
          otherTabs[j].tabSummaryInfor.tabID
        ) {
          otherTabs[j].tabSummaryInfor = tabData[i].tabSummaryInfor;
          otherTabs[j].tabSummaryData = tabData[i].tabSummaryData;
          otherTabs[j].disabled = isNil(tabData[i].disabled)
            ? false
            : tabData[i].disabled;
          otherTabs[j].visible = isNil(tabData[i].visible)
            ? true
            : tabData[i].visible;
        }
      }
    }

    return otherTabs;
  }

  resetVisible(otherTabs) {
    for (const tab of otherTabs) {
      tab.visible = true;
    }
  }

  isTabStructureChanged(mainTab, otherTabs, data) {
    return isEmpty(mainTab) || otherTabs.length !== data.length - 1;
  }

  isMainTabSelected(selectedTab: TabSummaryModel) {
    return selectedTab.tabSummaryInfor.isMainTab;
  }

  isAllowEdit(selectedTab: TabSummaryModel) {
    return selectedTab.tabSummaryInfor.allowEdit;
  }

  disabledTab(tabs: TabSummaryModel[], selectedTab: TabSummaryModel) {
    for (const tab of tabs) {
      if (tab.tabSummaryInfor.tabID === selectedTab.tabSummaryInfor.tabID) {
        tab.disabled = false;
      } else {
        tab.disabled = true;
      }
    }

    return tabs;
  }

  createNewTabConfig(
    isMainTab: boolean,
    activeModule: Module,
    selectedTab: TabSummaryModel,
    selectedSimpleTab?: SimpleTabModel,
    tabSetting?: any,
    contentDisplayMode?: string
  ) {
    let simpleTabSetting: any;
    if (selectedSimpleTab) {
      simpleTabSetting = tabSetting.Content.CustomTabs.find(
        (ct) => ct.TabID == selectedTab.tabSummaryInfor.tabID
      );
      if (simpleTabSetting) {
        let simpleTabs: SimpleTabModel[] = [];
        if (
          simpleTabSetting.TabContent[contentDisplayMode].Split &&
          simpleTabSetting.TabContent[contentDisplayMode].Split.Items
        ) {
          for (const item of simpleTabSetting.TabContent[contentDisplayMode]
            .Split.Items) {
            if (!isNil(item.TabContent[contentDisplayMode].SimpleTabs)) {
              simpleTabs = item.TabContent[contentDisplayMode].SimpleTabs;
              break;
            }
          }
        } else if (simpleTabSetting.TabContent[contentDisplayMode].SimpleTabs) {
          simpleTabs =
            simpleTabSetting.TabContent[contentDisplayMode].SimpleTabs;
        }

        for (const simpleTab of simpleTabs) {
          simpleTabSetting = {
            // TODO: will fix for business later
            // Fix javascript error
            // [selectedSimpleTab.TabID]: activeModule.idSettingsGUI + '-' + selectedSimpleTab.TabID
            [selectedSimpleTab.TabID]:
              (activeModule.idSettingsGUI || '') +
              '-' +
              selectedSimpleTab.TabID,
          };
        }
      }
    }

    return {
      normalTab: selectedSimpleTab
        ? null
        : {
            isMainTab: isMainTab,
            activeModuleId: activeModule.idSettingsGUI,
            tabID: isMainTab
              ? this.uti.getDefaultMainTabId(activeModule)
              : selectedTab.tabSummaryInfor.tabID,
            moduleTabCombineName:
              activeModule.idSettingsGUI +
              '-' +
              (isMainTab
                ? this.uti.getDefaultMainTabId(activeModule)
                : selectedTab.tabSummaryInfor.tabID),
          },
      simpleTab: !selectedSimpleTab
        ? null
        : {
            activeModuleId: activeModule.idSettingsGUI,
            tabID: selectedSimpleTab.TabID,
            moduleTabCombineName: simpleTabSetting,
          },
    };
  }

  buildEditingData(editingTabData, moduleName) {
    if (!editingTabData) {
      return null;
    }

    switch (moduleName) {
      case 'Customer':
        return this.buildCustomerHeader(editingTabData);
      case 'Administration':
        return this.buildAdministrationHeader(editingTabData);
      case 'Warehouse Movement':
        return this.buildSortingGoodsHeader(editingTabData);

      default:
        return '';
    }
  }

  buildSortingGoodsHeader(editingTabData) {
    if (editingTabData.idWarehouseMovement) {
      const result = `Movement Id : ${editingTabData.idWarehouseMovement}`;
      return result;
    }
  }

  buildCustomerHeader(editingTabData) {
    let result =
      (editingTabData.title || '') +
      ' ' +
      (editingTabData.lastName || '') +
      ' ' +
      (editingTabData.firstName || '');

    if (editingTabData.address) {
      result +=
        (editingTabData.address.street || '') +
        ' ' +
        (editingTabData.address.streetNr || '') +
        ' ' +
        (editingTabData.address.place || '');
    }

    result += ' ' + (editingTabData.countryCode || '');

    return result;
  }

  buildAdministrationHeader(editingTabData) {
    let result = '';

    if (editingTabData.adMainFieldForm) {
      result =
        (editingTabData.adMainFieldForm.title || '') +
        ' ' +
        (editingTabData.adMainFieldForm.lastName || '') +
        ' ' +
        (editingTabData.adMainFieldForm.firstName || '');
    }

    if (editingTabData.address) {
      result +=
        (editingTabData.address.street || '') +
        ' ' +
        (editingTabData.address.streetNr || '') +
        ' ' +
        (editingTabData.address.place || '');
    }

    result += ' ' + (editingTabData.countryCode || '');

    return result;
  }

  buildColumnFilter(httpLink) {
    const result = {};

    const keyName = httpLink.substr(0, httpLink.indexOf('='));
    const value = httpLink.substr(httpLink.indexOf('=') + 1);

    result[keyName] = [value];

    return result;
  }

  checkKeyNameExist(obj, filterItem) {
    for (const fieldName in obj) {
      if (fieldName === Object.keys(filterItem)[0]) {
        return true;
      }
    }

    return false;
  }

  buildCoumnFilterFromList(menuItems) {
    const result = {};

    for (const item of menuItems) {
      const filterItem = this.buildColumnFilter(item.httpLink);
      if (this.checkKeyNameExist(result, filterItem)) {
        result[Object.keys(filterItem)[0]].push(
          filterItem[Object.keys(filterItem)[0]][0]
        );
      } else {
        result[Object.keys(filterItem)[0]] = [
          filterItem[Object.keys(filterItem)[0]][0],
        ];
      }
    }

    return result;
  }

  getActiveMenuItems(menuItems) {
    return menuItems.filter((item) => {
      return item.isChecked === true;
    });
  }
}
