import * as $ from 'jquery';
import { GuidHelper } from 'app/utilities/guild.helper';
declare const GoldenLayout: any;
export class GoldenLayoutService {
  private settings: any = {
    hasHeaders: true,
    constrainDragToContainer: true,
    reorderEnabled: true,
    selectionEnabled: true,
    popoutWholeStack: false,
    blockedPopoutsThrowError: true,
    closePopoutsOnUnload: true,
    showPopoutIcon: false,
    showMaximiseIcon: false,
    showCloseIcon: true,
  };
  private dimensions: any = {
    borderWidth: 5,
    minItemHeight: 10,
    minItemWidth: 10,
    headerHeight: 20,
    dragProxyWidth: 300,
    dragProxyHeight: 200,
  };
  private labels: any = {
    close: 'close',
    maximise: 'maximise',
    minimise: 'minimise',
    popout: 'open in new window',
  };

  private defaultConfig: any = {
    content: [],
    settings: this.settings,
    dimensions: this.dimensions,
    labels: this.labels,
  };
  private selectorContainer: string = '.edit-layout-setting-stage'; //you can override it
  private layout: any = undefined;
  private cachedConfigContent: Array<any> = undefined;
  private arrayCachedConfigContent: Array<any> = []; //used for undo each step
  private stateChangedTimeout: any = undefined;
  private formatLayoutTimeout: any = undefined;
  private allowSaveState: boolean = false;
  private $elmContainer: any = undefined;

  public constructor(selectorContainer: string) {
    this.selectorContainer = selectorContainer;
  }

  public initLayout(configContent: Array<any>) {
    this.$elmContainer = $(this.selectorContainer);
    if (!this.$elmContainer.length) {
      console.log(
        'GoldenLayoutService -> initLayout failed because the Element Container cannot found.'
      );
      return;
    }

    configContent = configContent || [];

    if (this.layout) {
      //In case reInitLayout, we did manually content -> so toConfig().content will always be empty
      if (!configContent || !configContent.length) {
        configContent = this.layout.toConfig().content;
        configContent = configContent.length
          ? configContent
          : this.layout.config.content;
      }
      this.reInitLayout(configContent);
    } else {
      const that = this;

      let config = Object.assign({}, this.defaultConfig, {
        content: configContent,
      });
      this.layout = new GoldenLayout(config, this.$elmContainer);

      this.layout.registerComponent('goldComp', function (container, state) {
        // Add event element whenever a tab is created
        container.on('tab', function (tab) {
          setTimeout(() => {
            //set data for tab, register event dbClick to change title
            that.configTab(tab);
          });
        });
      });

      this.layout.on('initialised', function () {
        //console.log('originalConfigContent', this.layout.toConfig().content);
        //console.log('initialised: ' + new Date());

        if (
          that.layout.root &&
          that.layout.root.contentItems &&
          that.layout.root.contentItems.length
        )
          that.registerEventAllTabs(
            that.layout.root.contentItems[0].contentItems
          );

        that.allowSaveState = true;
      });

      //Must place the 'init' function after the 'initialised' event
      this.layout.init();

      //#region Dom Events

      //destroy popover when click ount
      this.$elmContainer.on('click', function (e) {
        that.$elmContainer.find('.popover').each(function () {
          let $popover = $(this);
          //the 'is' for buttons that trigger popups
          //the 'has' for icons within a button that triggers a popup
          if (
            !$popover.is(e.target) &&
            $popover.has(e.target).length === 0 &&
            $('.popover').has(e.target).length === 0
          ) {
            $popover.remove();
          }
        });
      });

      $(document).on('keyup', function (e) {
        if (e.keyCode == 27 || e.key === 'Escape') {
          // escape key maps to keycode `27`
          if (!that.$elmContainer) return;
          that.$elmContainer.find('.popover').remove();
        }
      });

      $(window).resize(function () {
        if (that.layout) that.layout.updateSize();
      });
      //#endregion

      //#region Golden Events
      //http://golden-layout.com/tutorials/saving-state.html
      this.layout.on('stateChanged', function () {
        //console.log('stateChanged');
        //now save the state
        if (that.allowSaveState) {
          that.updateCache();
          that.formatLayout();
        }
      });
      this.layout.on('stackCreated', function (stack) {
        //console.log('stackCreated', stack);

        //register event close stack when will save state
        stack.header.controlsContainer
          .find('.lm_close') //get the close icon
          .off('click') //unbind the current click handler
          .click(function () {
            stack.remove();
            that.allowSaveState = true;
          });
      });
      this.layout.on('tabCreated', function (tab) {
        //console.log('tabCreated', tab);

        //register event close tab when will save state
        tab.closeElement
          .off('click') //unbind the current click handler
          .click(function () {
            tab.contentItem.remove();
            that.allowSaveState = true;
          });
      });
      this.layout.on('rowCreated', function (item) {
        //console.log('rowCreated', item);
        if (!item.config.id) item.config.id = GuidHelper.generateGUID();

        if (item.contentItems.length && item.config.id)
          item.element.attr('id', item.config.id);
      });
      this.layout.on('columnCreated', function (item) {
        //console.log('columnCreated', item);
        if (!item.config.id) item.config.id = GuidHelper.generateGUID();

        if (item.contentItems.length && item.config.id)
          item.element.attr('id', item.config.id);
      });

      //https://github.com/golden-layout/golden-layout/issues/122
      this.layout.on('itemDropped', function (item) {
        //console.log('itemDropped', item);

        //when itemDropped -> will save state
        that.allowSaveState = true;
        let isCreateDragItem = true;

        //Determine new target: row or column
        if (
          item.isComponent &&
          item.config &&
          item.config.id &&
          item.parent &&
          item.parent.isStack &&
          item.parent.parent &&
          item.parent.parent.contentItems &&
          item.parent.parent.contentItems.length > 1 &&
          (item.parent.parent.isColumn || item.parent.parent.isRow)
        ) {
          let targetItem = that.getTargetItem(
            item.parent.parent.contentItems,
            item.config.id
          );
          //component is dragged to the first position
          if (targetItem.oldCom && targetItem.newCom) {
            const newConfigContent = that.findAndCreateNewNode(
              item.parent.parent.type,
              targetItem.oldCom,
              targetItem.newCom
            );
            if (newConfigContent && newConfigContent.length) {
              that.reInitLayout(newConfigContent);
              isCreateDragItem = false;
            }
          }
        }

        //Change drag sources
        if (isCreateDragItem) that.changeDragSources();

        //console.log('itemDropped', myLayout.toConfig().content);
      });
      //#endregion events

      //create DragSources for the first load
      this.createDragSources();
    }
  }

  public destroyLayout() {
    if (!this.layout) return;

    try {
      this.layout.destroy();
      this.layout = null;

      this.cachedConfigContent = null;
      this.arrayCachedConfigContent = [];

      clearTimeout(this.stateChangedTimeout);
      clearTimeout(this.formatLayoutTimeout);
      this.stateChangedTimeout = null;
      this.formatLayoutTimeout = null;

      this.allowSaveState = false;

      if (this.$elmContainer) {
        this.$elmContainer.unbind('click');
        this.$elmContainer.empty();
        this.$elmContainer = null;
      }

      $(window).unbind('resize');
    } catch (error) {
      console.log('GoldenLayoutService -> destroyLayout: ' + error);
    }
  }

  public getConfigContent() {
    if (!this.layout) return null;

    try {
      //return _.cloneDeep(this.layout.toConfig().content);
      return this.layout.toConfig().content;
    } catch (error) {
      console.log('GoldenLayoutService -> getConfigContent: ' + error);
    }
    return null;
  }

  public popCacheConfigContent() {
    if (!this.arrayCachedConfigContent || !this.arrayCachedConfigContent.length)
      return null;

    try {
      let tempContent = this.arrayCachedConfigContent.pop();

      //when the stageChanged Event is fired, we always push configContent to array, so the last item is always current stage
      //So if you want to pop last item to undo, you must get item before last item
      if (this.arrayCachedConfigContent.length > 0)
        tempContent = this.arrayCachedConfigContent.pop();

      return tempContent;
    } catch (error) {
      console.log('GoldenLayoutService -> popCacheConfigContent: ' + error);
    }
    return null;
  }

  //#region Private
  private updateCache() {
    if (!this.allowSaveState) return;

    console.log('updateCache: ' + new Date());
    try {
      let tempContent = this.getConfigContent();
      //must change data
      if (tempContent) {
        this.cachedConfigContent = tempContent;
        this.arrayCachedConfigContent.push(tempContent);
      }
    } catch (error) {
      console.log('GoldenLayoutService -> updateCache: ' + error);
    }

    this.allowSaveState = false;
  }
  private setCacheConfigContent(timeout?: number) {
    clearTimeout(this.stateChangedTimeout);
    this.stateChangedTimeout = null;

    timeout = timeout || 300;
    this.stateChangedTimeout = setTimeout(() => {
      this.updateCache();
    }, timeout);
  }

  private changeDragSources(): void {
    let dragSources = this.layout['_dragSources'];
    if (!dragSources || !dragSources.length) return;

    for (let i = 0, length = dragSources.length; i < length; i++) {
      let item = dragSources[i];
      item._itemConfig.id = GuidHelper.generateGUID();

      let title = item._itemConfig.title || 'Untitled';
      item._itemConfig.title = title;
      if (item._itemConfig.componentState)
        item._itemConfig.componentState.label = title;
    }
  }

  private deleteNode(array, id): boolean {
    for (let i = 0, length = array.length; i < length; i++) {
      let obj = array[i];
      if (obj.id && obj.id === id) {
        // splice out 1 element starting at position i
        array.splice(i, 1);
        return true;
      }
      if (obj.content) {
        if (this.deleteNode(obj.content, id)) {
          if (obj.content.length === 0) {
            // delete children property when empty
            delete obj.content;

            // or, to delete this parent altogether
            // as a result of it having no more children
            // do this instead
            array.splice(i, 1);
          }
          return true;
        }
      }
    } //for
    return false;
  }
  private deleteNodes(array, id): void {
    for (let i = 0, length = array.length; i < length; i++) {
      let obj = array[i];
      if (obj.id && obj.id === id) {
        // splice out 1 element starting at position i
        array.splice(i, 1);
      }
      if (obj.content) {
        this.deleteNodes(obj.content, id);
        if (obj.content.length === 0) {
          // delete children property when empty
          delete obj.content;

          // or, to delete this parent altogether
          // as a result of it having no more children
          // do this instead
          array.splice(i, 1);
        }
      }
    } //for
  }
  private findNode(array, id) {
    for (let i = 0, length = array.length; i < length; i++) {
      let obj = array[i];
      if (obj.id && obj.id === id) {
        return obj;
      }
      if (obj.content) {
        let ret = this.findNode(obj.content, id);
        if (ret) return ret;
      }
    } //for
  }

  //#region Event Tab, Format Tab, Update Title
  private formatLayout() {
    try {
      clearTimeout(this.formatLayoutTimeout);
      this.formatLayoutTimeout = null;

      this.formatLayoutTimeout = setTimeout(() => {
        this.layout.container.find('.lm_header').each(function (key, value) {
          let $header = $(value),
            $ulTab = $header.find('ul.lm_tabs');
          if ($ulTab.length) {
            let $liTabs = $ulTab.find('li.lm_tab'),
              $lmItems = $header.next('.lm_items').find('.lm_content'),
              $spanTitle = $liTabs.find('.lm_title');
            //only has one tab and one item
            if ($liTabs.length == 1 && $lmItems.length == 1) {
              $header.addClass('lm_noHeader');
              $lmItems.css('border-top', 'none');
              $spanTitle.html('').addClass('lm_notitle');
            } else {
              $header.removeClass('lm_noHeader');
              $lmItems.css('border-top', '1px solid #cccccc');

              if ($spanTitle.hasClass('lm_notitle'))
                $spanTitle.html('Untitled');
              $spanTitle.removeClass('lm_notitle');
            }
            $liTabs.show();
          } //ul
        });
      }, 200);
    } catch (error) {
      console.log('GoldenLayoutService -> formatLayout: ' + error);
    }
  }

  private onDoubleClickTab(tab) {
    const that = this;

    tab.element
      .off('dblclick') //unbind the current click handler
      .bind('dblclick', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        let $popover = tab.element.find('.popover');
        if ($popover.length) {
          $popover.remove();
          $popover = null;
        }

        let tabId = tab.element.attr('id'),
          tabTitle = tab.titleElement.html(),
          tabConfig = tab['contentItem']['config'];

        let height = tab.element.outerHeight();
        let popoverTemplate =
          '<div class="popover fade bottom in" style="top: ' +
          height +
          'px;">' +
          '<div class="arrow"></div>' +
          '<div class="popover-content"><div>' +
          '<input class="form-control input-title" type="text" value="' +
          tabTitle +
          '" id="' +
          tabId +
          '"/></div></div></div > ';
        tab.element.append(popoverTemplate);

        if (!$popover || !$popover.length)
          $popover = tab.element.find('.popover');

        let $inputTitle = $popover.find('input');
        if (!$inputTitle.length) return;

        let oldTitle = $inputTitle.val() + '';
        const updateTitle = (
          id: string,
          newTitle: string,
          forceUpdate?: boolean
        ) => {
          let updatedItem: any;
          if (oldTitle !== newTitle) {
            updatedItem = that.changeTabTitle(id, newTitle);
            if (updatedItem) {
              tabConfig.title = newTitle;
              if (tabConfig.componentState)
                tabConfig.componentState.label = newTitle;

              tab.element.attr('title', newTitle);
              tab.titleElement.html(newTitle);
              oldTitle = newTitle;
              that.allowSaveState = true;
              that.updateCache();

              if (forceUpdate) {
                $('li#' + id + '')
                  .attr('title', newTitle)
                  .find('span#' + id + '')
                  .html(newTitle);
              }
            } else {
              console.log(
                'Update title failed with id: ' + id + '. Retry to update.'
              );
              that.reInitLayout(that.layout.toConfig().content);
              setTimeout(() => {
                updateTitle(id, newTitle, true);
              }, 200);
            }
          }

          if ($popover) {
            $popover.remove();
            $popover = null;
          }
        };

        $inputTitle.select();
        $inputTitle.focus();

        $inputTitle.keypress(function (e) {
          if (e.which == 13) {
            updateTitle($inputTitle.attr('id'), $inputTitle.val());
          }
        });
        $inputTitle.bind('blur', function (e) {
          updateTitle($inputTitle.attr('id'), $inputTitle.val());
        });

        $popover.bind('mousedown dblclick', function (event2) {
          event2.stopImmediatePropagation();
        });
      }); //dblclick
  }

  //set data for tab, register event dbClick to change title
  private configTab(tab) {
    if (!tab['contentItem']) return;

    let tabConfig = tab['contentItem']['config'];

    if (!tabConfig) return;

    let id = tabConfig.id || GuidHelper.generateGUID();
    //id: set id for element and titleElement. We base on this id to change title
    tabConfig.id = id;
    tab.element.attr('id', id);
    tab.titleElement.attr('id', id);

    //title: set title for element and titleElement
    let title = tab.element.attr('title');
    title = title || 'Untitled';
    tab.element.attr('title', title);
    tab.titleElement.html(title);

    //update state
    tabConfig.title = title;
    if (tabConfig.componentState) tabConfig.componentState.label = title;

    //bind dbClick event to change title
    this.onDoubleClickTab(tab);
  }

  private changeTitleOfNodes(array: any, id: string, title: string): any {
    for (let i = 0, length = array.length; i < length; i++) {
      let obj = array[i];
      if (obj.id && obj.id === id) {
        obj.title = title;
        return obj;
      }
      if (obj.content) {
        let ret = this.changeTitleOfNodes(obj.content, id, title);
        if (ret) return ret;
      }
    }
  }

  private changeTabTitle(id: string, title: string): any {
    const array = this.layout.root.contentItems[0].contentItems;
    for (let i = 0, length = array.length; i < length; i++) {
      let obj = array[i];
      if (!obj.config) continue;

      if (obj.config.id && obj.config.id === id) {
        obj.config.title = title;
        return obj.config;
      }

      //if (!obj.config.content) {
      //    if (obj.config.id && obj.config.id === id) {
      //        obj.config.title = title;
      //        return obj.config;
      //    }
      //}
      //else {
      //    const updatedItem = this.changeTitleOfNodes(obj.config.content, id, title);
      //    if (updatedItem) return updatedItem;
      //}

      if (obj.config.content) {
        const updatedItem = this.changeTitleOfNodes(
          obj.config.content,
          id,
          title
        );
        if (updatedItem) return updatedItem;
      }
    }
    return null;
  }

  private registerEventAllTabs(contentItems: any) {
    if (!contentItems || !contentItems.length) return;
    for (let i = 0, length = contentItems.length; i < length; i++) {
      let obj = contentItems[i];
      if (obj['tab']) this.configTab(obj['tab']);

      //recursive to config tab
      if (obj['contentItems']) this.registerEventAllTabs(obj['contentItems']);
    } //for
  }
  //#endregion

  private getTargetItem(contentItems, currentId) {
    let oldCom, newCom;
    if (contentItems.length && contentItems.length > 1) {
      //The original behavior of golden layout is: when drag one item into content it will create a splitter:
      //  - if drag into the first position --> will delete it
      //  - find to the second position (index = 1): it must be Stack -> we will make it to become RowOrColumn and add 2 items for it
      //If drag into the first position: left hoặc top
      let firstContentItem = contentItems[0].config.content[0];
      if (currentId == firstContentItem.id) {
        oldCom = firstContentItem;

        //newCom
        let secondItem = contentItems[1];
        if (
          secondItem.isStack &&
          secondItem.config &&
          secondItem.config.content &&
          secondItem.config.content.length
        ) {
          //If there is tabs, find to active tab
          if (
            secondItem.header &&
            secondItem.header.tabs &&
            secondItem.header.tabs.length > 1
          ) {
            for (
              let i = 0, length = secondItem.header.tabs.length;
              i < length;
              i++
            ) {
              if (secondItem.header.tabs[i].isActive) {
                newCom = secondItem.header.tabs[i].contentItem.config;
                break;
              }
            } //for
          } else {
            newCom = secondItem.config.content[0];
          }

          if (!newCom) {
            console.log(
              'GoldenLayoutService -> getTargetItem: Cannot find the new target.'
            );
          }
        }
      }
    }
    return {
      oldCom: oldCom,
      newCom: newCom,
    };
  }

  private findAndCreateNewNode(type, oldCom, newCom) {
    let configContent = this.layout.toConfig().content;

    let node = this.findNode(configContent, newCom.id);
    if (!node) {
      console.log(
        'GoldenLayoutService -> findAndCreateNewNode: Cannot find node with Id: ' +
          newCom.id
      );
      return null;
    }

    //create new note
    node.id = GuidHelper.generateGUID();
    node.title = node.title || 'Tab';
    node.componentName = undefined;
    node.componentState = undefined;

    node.type = type;
    node.content = [];
    node.content.push(GoldenLayoutService.createComponent());
    node.content.push(GoldenLayoutService.createComponent());

    //node.type = 'stack';
    //let childContent = [];
    //childContent.push(GoldenLayoutService.createComponent());
    //childContent.push(GoldenLayoutService.createComponent());
    //node.content = [
    //    {
    //        type: type,
    //        id: GuidHelper.generateGUID(),
    //        title: type,
    //        content: childContent
    //    }
    //];

    //delete old node
    const deleteSuccess = this.deleteNode(configContent, oldCom.id);
    if (!deleteSuccess) {
      console.log('GoldenLayoutService -> deleteNode failed: ', oldCom);
    }

    console.log('configContent', configContent);

    return configContent;
  }

  private reInitLayout(configContent) {
    try {
      this.layout.destroy();
      this.layout.config.content = configContent;
      this.layout.init();
      this.createDragSources();

      this.cachedConfigContent = configContent;
    } catch (error) {
      /*
             * Error: activeItemIndex out of bounds golden layout
               the user deletes the tab without making it the active tab.
               https://github.com/golden-layout/golden-layout/issues/418
            */
      console.log('GoldenLayoutService -> reInitLayout: ' + error);
      console.log('configContent', configContent);
      try {
        //display the previous ConfigContent
        this.layout.config.content = this.cachedConfigContent;
        this.layout.init();
        this.createDragSources();
      } catch (error) {
        console.log('GoldenLayoutService -> reInitLayout2: ' + error);
        console.log('cachedConfigContent', this.cachedConfigContent);
      }
    }
  }

  private createDragSources() {
    const that = this;
    $('.layout-drag-drop-source-block .drag-drop-item').each(function (
      key,
      value
    ) {
      const $element = $(value);
      const itemType = $element.attr('data-type');
      if (itemType === 'Page')
        that.layout.createDragSource(
          $element,
          GoldenLayoutService.createPage('Page', 'Untitled')
        );
      else if (itemType === 'Tab')
        that.layout.createDragSource(
          $element,
          GoldenLayoutService.createPage('Tab', 'Untitled')
        );
    });
  }
  //#endregion

  //#region Static
  static createPage(
    type?: string,
    title?: string,
    id?: string,
    width?: number,
    height?: number,
    itemId?: string
  ): any {
    type = type || 'Page';
    title = title || 'Untitled';
    id = id || GuidHelper.generateGUID();
    return {
      type: 'component',
      componentName: 'goldComp',
      componentState: { label: title },
      title: title, //Untitled
      id: id,
      width: width,
      height: height,
      itemId: itemId,
    };
  }

  static createStack(
    type?: string,
    title?: string,
    id?: string,
    width?: number,
    height?: number
  ): any {
    type = type || 'Stack';
    title = title || 'Tab';
    id = id || GuidHelper.generateGUID();
    return {
      type: 'stack',
      content: [],
      title: title,
      id: id,
      width: width,
      height: height,
    };
  }

  static createRow(
    type?: string,
    title?: string,
    id?: string,
    width?: number,
    height?: number
  ): any {
    type = type || 'Row';
    title = title || 'Row';
    id = id || GuidHelper.generateGUID();
    return {
      type: 'row',
      content: [],
      title: title,
      id: id,
      width: width,
      height: height,
    };
  }

  static createColumn(
    type?: string,
    title?: string,
    id?: string,
    width?: number,
    height?: number
  ): any {
    type = type || 'Column';
    title = title || 'Column';
    id = id || GuidHelper.generateGUID();
    return {
      type: 'column',
      content: [],
      title: title,
      id: id,
      width: width,
      height: height,
    };
  }

  static createComponent(title?: string, id?: string): any {
    title = title || 'Untitled';
    id = id || GuidHelper.generateGUID();
    return {
      type: 'component',
      componentName: 'goldComp',
      componentState: { label: title },
      title: title,
      id: id,
    };
  }
  //#endregion Static
}
