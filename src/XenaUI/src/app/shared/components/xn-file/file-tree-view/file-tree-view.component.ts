import {
    Component, OnInit, Input, Output, EventEmitter,
    ChangeDetectorRef, OnDestroy,
    SimpleChanges, OnChanges, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Uti } from 'app/utilities';
import { ModalService } from 'app/services';
import { MessageModel } from 'app/models';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { WjTreeView } from 'wijmo/wijmo.angular2.nav';
import * as Ps from 'perfect-scrollbar';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    MessageModal
} from 'app/app.constants';

@Component({
    selector: 'app-file-tree-view',
    styleUrls: ['./file-tree-view.component.scss'],
    templateUrl: './file-tree-view.component.html',
    host: {
        '(contextmenu)': 'onRightClick($event)'
    }
})
export class FileTreeViewComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
    public contextMenuData: any;
    public treeViewData: any;

    private currentTreeNodeItem: any;
    private tempData: any;
    private editingItem: any = {};
    private addItems = [];
    private editItems = [];
    private deleteItems = [];

    @Input() data: any;

    @Output() dataChangeAction: EventEmitter<any> = new EventEmitter();
    @Output() showFileUploadDialogAction: EventEmitter<any> = new EventEmitter();
    @Output() outputDataAction: EventEmitter<any> = new EventEmitter();

    @ViewChild('tvEdit') wjTreeView: WjTreeView;

    constructor(
        private ref: ChangeDetectorRef,
        private modalService: ModalService,
        protected router: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.contextMenuData = this.createMenuContextData(false);
        this.addPerfectScrollbar();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onRightClick($event: MouseEvent) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    public ngOnChanges(changes: SimpleChanges) {
        const hasChangesData = this.hasChanges(changes['data']);
        if (hasChangesData) {
            this.makeData();
        }
    }

    public selectedItemChange(tvEdit: any, event: any) {
        if (!event || !event.id) return;

        this.findTreeViewItemById(this.treeViewData, event.id);

        // call this at the end of this function
        // to get the last seleted data item
        this.dataChangeAction.emit(this.currentTreeNodeItem);
    }

    public nodeEditStarted(tvEdit: any, event: any) {
        this.editingItem = cloneDeep(event.node.dataItem);
    }

    public nodeEditEnded(tvEdit: any, event: any) {
        if (event.node.dataItem.header == this.editingItem.header) return;
        const header: string = event.node.dataItem.header;
        if (!header || !(header.trim())) {
            event.node.dataItem.header = this.editingItem.header;
            this.resetTreeViewData();
            return;
        }
        this.addEditItemToEditItems(event.node.dataItem);
        this.resetTreeViewData();
        this.setOutputData();
    }

    public updateIdForAddItem(realId: any, addedId: any) {
        this.updateDataForAddItem(realId, addedId, 'id');
    }

    public resetDataAfterSaving() {
        this.addItems = [];
        this.editItems = [];
        this.deleteItems = [];
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private updateDataForAddItem(realId: any, addedId: any, prop: string) {
        for (let item of this.treeViewData) {
            if (item.id === addedId) {
                item.id = realId;
                if (prop === 'id') {
                    this.data.push({
                        id: realId,
                        text: item.header,
                        parentId: null
                    });
                }
                return;
            }
            if (this.setDataForChildren(item, addedId, prop, realId)) return;
        }
    }

    private setDataForChildren(treeNode: any, id: any, prop: string, data: any): boolean {
        if (!treeNode || !treeNode.items || !treeNode.items.length) return false;
        for (let item of treeNode.items) {
            if (item.id == id) {
                item[prop] = data;
                if (prop === 'id') {
                    this.data.push({
                        id: data,
                        text: item.header,
                        parentId: treeNode.id
                    });
                }
                return true;
            }
            if (this.setDataForChildren(item, id, prop, data)) return true;
        }
        return false;
    }

    private pushAddItemToData() {

    }

    private addPerfectScrollbar() {
        setTimeout(() => {
            const wijmoGridElm = $(this.wjTreeView.hostElement);
            if (wijmoGridElm.length) {
                Ps.destroy(wijmoGridElm.get(0));
                Ps.initialize(wijmoGridElm.get(0));

                setTimeout(() => {
                    $('.ps-scrollbar-x-rail', this.wjTreeView.hostElement).css('z-index', 9999);
                    $('.ps-scrollbar-y-rail', this.wjTreeView.hostElement).css('z-index', 9999);
                }, 200);
            }
        });
    }

    private hasChanges(changes) {
        return changes && changes.hasOwnProperty('currentValue') && changes.hasOwnProperty('previousValue');
    }

    //#region Make Data Tree
    private makeData() {
        this.currentTreeNodeItem = null;
        this.treeViewData = [];
        this.tempData = [];

        if (!this.data || !this.data.length) {
            //this.treeViewData = [];
            //this.tempData = [];
            return;
        }

        this.makeTreeViewData();
        this.treeViewData = this.tempData;
    }
    private makeTreeViewData() {
        this.makeParentTreeViewData();
        let child: any;
        for (const item of this.tempData) {
            child = this.data.filter(x => x.parentId === item.id);
            this.makeChildrenTreeViewData(item, child, 1);
        }
    }

    private makeParentTreeViewData() {
        const parent = this.data.filter(x => !x.parentId);
        this.tempData = parent.map(x => {
            return {
                id: x.id,
                header: x.text,
                img: '',
                parentId: 0,
                level: 0
            };
        });
    }

    private makeChildrenTreeViewData(parent: any, children: any, level: number) {
        if (!children || !children.length) { return; }
        parent.items = [];
        let _children: any;
        for (const item of children) {
            if (!item || !item.id) continue;
            const child: any = {
                id: item.id,
                header: item.text,
                img: '',
                parentId: parent.id,
                level: level
            };
            parent.items.push(child);
            _children = this.data.filter(x => x.parentId === item.id);
            this.makeChildrenTreeViewData(child, _children, (level + 1));
        }
    }
    //#endregion

    //#region ContextMenu

    private setOutputData() {
        this.outputDataAction.emit({
            addItems: this.addItems,
            editItems: this.editItems,
            deleteItems: this.deleteItems
        });
    }
    private rebindContextMenu(isDisable) {
        if (this.treeViewData && this.treeViewData.length) return;

        this.contextMenuData = this.createMenuContextData(isDisable);
    }

    private createMenuContextData(isDisable: boolean) {
        return [
            {
                id: 'campaign-file-tree-view-add-folder',
                title: 'Add Folder',
                iconName: 'fa-plus',
                callback: () => { this.addFolder(false); },
                subject: new Subject(),
                disabled: isDisable,
                children: []
            },
            {
                id: 'campaign-file-tree-view-delete',
                title: 'Delete Folder',
                iconName: 'fa-trash-o',
                callback: () => { this.deleteFolder(); },
                subject: new Subject(),
                disabled: isDisable,
                children: []
            },
            {
                id: 'campaign-file-tree-view-add-to-root',
                title: 'Add Folder To Root',
                iconName: 'fa-plus-circle',
                callback: () => { this.addFolder(true); },
                subject: new Subject(),
                disabled: false,
                children: []
            },
            {
                id: 'campaign-file-tree-view-add-to-root',
                title: 'Upload File',
                iconName: 'fa-upload',
                callback: (event) => { this.uploadFile(event); },
                subject: new Subject(),
                disabled: isDisable,
                children: []
            }
        ];
    }

    private addFolder(isRoot: boolean) {
        const addedItemId = this.getTempId();
        const addItem = {
            header: 'New Folder',
            id: addedItemId
        }
        if (this.currentTreeNodeItem && !isRoot) {
            this.addToNode(addItem);
            this.addToAddItems(addedItemId, this.currentTreeNodeItem.id);
        }
        else {
            this.addToRoot(addItem);
            this.addToAddItems(addedItemId, null);
        }
        this.selectAddedItem(addedItemId);
        this.setOutputData();
    }

    private addToNode(addItem: any) {
        this.currentTreeNodeItem.items = this.currentTreeNodeItem.items || [];
        this.currentTreeNodeItem.items.push(addItem);
        this.resetTreeViewData();
    }

    private addToRoot(addItem: any) {
        this.treeViewData = this.treeViewData || [];
        this.treeViewData.push(addItem);
        this.resetDataForTreeView(false);
    }

    private addToAddItems(addedItemId: any, parentId: any) {
        this.addItems.push({
            text: 'New Folder',
            id: addedItemId,
            parentId: parentId
        });
    }

    private selectAddedItem(addedItemId: any) {
        if (this.wjTreeView.selectedNode && this.wjTreeView.selectedNode.nodes) {
                setTimeout(() => {
                const nodeIndex = this.wjTreeView.selectedNode.nodes.findIndex(n => n.dataItem.id == addedItemId);
                if (nodeIndex >= 0)
                    this.wjTreeView.selectedNode.nodes[nodeIndex].select();
            }, 100);
        }
    }

    private deleteFolder() {
        this.modalService.confirmMessageHtmlContent(new MessageModel({
            messageType: MessageModal.MessageType.error,
            headerText: 'Delete Iolder',
            message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Items'},
                {key: '</p>'}],
            buttonType1: MessageModal.ButtonType.danger,
            callBack1: () => {
                this.deleteAfterConfirm();
            }
        }));
    }

    private deleteAfterConfirm() {
        Uti.removeItemInArray(this.addItems, cloneDeep(this.currentTreeNodeItem), 'id');
        Uti.removeItemInArray(this.editItems, cloneDeep(this.currentTreeNodeItem), 'id');
        Uti.removeItemInArray(this.data, cloneDeep(this.currentTreeNodeItem), 'id');
        this.deleteItems.push(cloneDeep(this.currentTreeNodeItem));
        Uti.removeItemInTreeArray(this.treeViewData, this.currentTreeNodeItem, 'id', 'items');
        this.resetDataForTreeView(true);
        this.setOutputData();
    }

    private uploadFile(event) {
        this.showFileUploadDialogAction.emit(true);
    }

    private resetTreeViewData() {
        const temp = this.treeViewData;
        this.treeViewData = [];
        for (const item of temp) {
            this.treeViewData.push(item);
        }
        this.ref.detectChanges();
    }

    private resetDataForTreeView(isDisable) {
        this.resetTreeViewData();
        this.rebindContextMenu(isDisable);
    }
    //#endregion

    //#region Events

    private addEditItemToEditItems(editItem: any) {
        if (editItem.id < 0) {
            this.updateTextForAddedItem(editItem);
            return;
        }
        for (let item of this.editItems) {
            if (item.id === editItem.id) {
                item.text = editItem.header;
                return;
            }
        }
        for (let item of this.data) {
            if (item.id !== editItem.id) continue;
            item.text = editItem.header;
            this.editItems.push(item);
            return;
        }
    }

    private updateTextForAddedItem(editItem) {
        for (let item of this.addItems) {
            if (item.id !== editItem.id) continue;
            item.text = editItem.header;
        }
    }
    //#endregion

    //#region Helpers
    private getTempId(): number {
        let newId = Math.round(((Math.random() * 100000) * -1));
        let currentItem = this.treeViewData.find(x => x.id === newId);
        while (currentItem && currentItem.id) {
            newId = Math.round(((Math.random() * 100000) * -1));
            currentItem = this.treeViewData.find(x => x.id === newId);
        }
        return newId;
    }

    private findTreeViewItemById(treeViewData: any, treeNodeId: any) {
        for (const item of treeViewData) {
            const result = this.findInChildren(item, treeNodeId);
            if (result) return;
        }
    }

    private findInChildren(treeNodeItem: any, treeNodeId: any): boolean {
        if (treeNodeItem.id === treeNodeId) {
            this.currentTreeNodeItem = treeNodeItem;
            return true;
        }
        if (!treeNodeItem.items || !treeNodeItem.items.length) {
            this.currentTreeNodeItem = null;
            return false;
        }
        for (const item of treeNodeItem.items) {
            const result = this.findInChildren(item, treeNodeId);
            if (result) return result;
        }
    }
    //#endregion
}
