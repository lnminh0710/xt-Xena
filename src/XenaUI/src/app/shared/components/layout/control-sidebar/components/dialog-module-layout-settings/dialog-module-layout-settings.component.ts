import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import {
  AppErrorHandler,
  DatatableService,
  ModalService,
  UserModuleWorkspaceService,
} from 'app/services';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { MessageModel, Module } from 'app/models';
import {
  Configuration,
  MessageModal,
  ModuleName,
  ModuleIdSettingGuid,
} from 'app/app.constants';
import { DialogSaveWorkspaceTemplateComponent } from '../dialog-save-workspace-template';
import { Uti } from 'app/utilities';
import { ToasterService } from 'angular2-toaster';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { Dialog } from 'primeng/components/dialog/dialog';

@Component({
  selector: 'dialog-module-layout-settings',
  styleUrls: ['./dialog-module-layout-settings.component.scss'],
  templateUrl: './dialog-module-layout-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogModuleLayoutSettingsComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public showDialog = false;
  public workspaceDataSource: any;
  public ofModuleLocal: Module;
  public modules: Module[] = [];
  public selectedModule: any;
  public moduleComboFocused = false;
  public selectedValue: any;
  public isResizable = true;
  public isDraggable = true;
  public isMaximized = false;
  public dialogStyleClass = this.consts.popupResizeClassName;

  @Input() workspaceGridId: string;
  @Input() globalProperties: any[] = [];

  @Output() onClose = new EventEmitter<any>();

  @ViewChild('workspaceGrid') workspaceGrid: XnAgGridComponent;
  @ViewChild('moduleCombo') moduleCombo: AngularMultiSelect;

  public showSaveWorkspaceTemplateDialog = false;
  private dialogSaveWorkspaceTemplate: DialogSaveWorkspaceTemplateComponent;
  private isSelectionProject = false;
  private preDialogW: string;
  private preDialogH: string;
  private preDialogLeft: string;
  private preDialogTop: string;

  @ViewChild(DialogSaveWorkspaceTemplateComponent)
  set dialogSaveWorkspaceTemplateInstance(
    dialogSaveWorkspaceTemplateInstance: DialogSaveWorkspaceTemplateComponent
  ) {
    this.dialogSaveWorkspaceTemplate = dialogSaveWorkspaceTemplateInstance;
  }

  private pDialogModuleLayoutSetting: any;
  @ViewChild('pDialogModuleLayoutSetting')
  set pDialogModuleLayoutSettingInstance(
    pDialogModuleLayoutSettingInstance: Dialog
  ) {
    this.pDialogModuleLayoutSetting = pDialogModuleLayoutSettingInstance;
  }

  constructor(
    private appErrorHandler: AppErrorHandler,
    private changeDetectorRef: ChangeDetectorRef,
    protected router: Router,
    private consts: Configuration,
    private modalService: ModalService,
    private userModuleWorkspaceService: UserModuleWorkspaceService,
    private datatableService: DatatableService,
    private toasterService: ToasterService
  ) {
    super(router);
    this.isSelectionProject = Configuration.PublicSettings.isSelectionProject;
    this.ofModuleLocal = this.ofModule;
    this.selectedValue = this.ofModule.idSettingsGUI;
  }

  ngOnInit() {
    this.getWorkspaceTemplate();
    this.getModuleList();
  }

  ngOnDestroy() {}

  private getModuleList() {
    this.modules = [];
    if (!this.isSelectionProject) {
      const objectKeys = Object.keys(ModuleList);
      for (let i = 0; i < objectKeys.length; i++) {
        if (
          objectKeys[i] !== ModuleName.BackOffice &&
          objectKeys[i] !== ModuleName.Statistic &&
          objectKeys[i] !== ModuleName.Logistic &&
          objectKeys[i] !== ModuleName.DataExport &&
          objectKeys[i] !== ModuleName.Doublette &&
          objectKeys[i] !== ModuleName.Tools &&
          objectKeys[i] !== ModuleName.TracksSetup &&
          objectKeys[i] !== ModuleName.Selection &&
          objectKeys[i] !== ModuleName.CampaignSelection &&
          objectKeys[i] !== ModuleName.ArchivedCampaign &&
          objectKeys[i] !== ModuleName.CollectSelection &&
          objectKeys[i] !== ModuleName.BrokerSelection
        ) {
          if (objectKeys[i] === ModuleName.Base) {
            this.modules.push({
              idSettingsGUI: -1,
              moduleName: ModuleName.AllModules,
            });
          } else {
            this.modules.push({
              idSettingsGUI: ModuleList[objectKeys[i]].idSettingsGUI,
              moduleName: ModuleList[objectKeys[i]].moduleName,
            });
          }
        }
      }
    } else {
      this.modules.push({
        idSettingsGUI: -1,
        moduleName: ModuleName.AllModules,
      });
      this.modules.push({
        idSettingsGUI: ModuleList.CampaignSelection.idSettingsGUI,
        moduleName: ModuleList.CampaignSelection.moduleName,
      });
      this.modules.push({
        idSettingsGUI: ModuleList.BrokerSelection.idSettingsGUI,
        moduleName: ModuleList.BrokerSelection.moduleName,
      });
      this.modules.push({
        idSettingsGUI: ModuleList.CollectSelection.idSettingsGUI,
        moduleName: ModuleList.CollectSelection.moduleName,
      });
      this.modules.push({
        idSettingsGUI: ModuleList.ArchivedCampaign.idSettingsGUI,
        moduleName: ModuleList.ArchivedCampaign.moduleName,
      });
    }
  }

  private maximize() {
    // if (this.translateWidget)
    //     this.translateWidget.resized();
    this.isMaximized = true;
    this.isResizable = false;
    this.isDraggable = false;
    this.dialogStyleClass =
      this.consts.popupResizeClassName +
      '  ' +
      this.consts.popupFullViewClassName;
    if (this.pDialogModuleLayoutSetting) {
      this.preDialogW =
        this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.width;
      this.preDialogH =
        this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.height;
      this.preDialogLeft =
        this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.left;
      this.preDialogTop =
        this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.top;

      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.width =
        $(document).width() + 'px';
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.height =
        $(document).height() + 'px';
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.top =
        '0px';
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.left =
        '0px';
    }
  }

  private restore() {
    // if (this.translateWidget)
    //     this.translateWidget.resized();
    this.isMaximized = false;
    this.isResizable = true;
    this.isDraggable = true;
    this.dialogStyleClass = this.consts.popupResizeClassName;
    if (this.pDialogModuleLayoutSetting) {
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.width =
        this.preDialogW;
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.height =
        this.preDialogH;
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.top =
        this.preDialogTop;
      this.pDialogModuleLayoutSetting.containerViewChild.nativeElement.style.left =
        this.preDialogLeft;
    }
    // setTimeout(() => {
    //     this.bindResizeEvent();
    // }, 200);
  }

  public open() {
    this.showDialog = true;
    this.changeDetectorRef.markForCheck();
  }

  public cancel() {
    this.showDialog = false;
    this.onClose.emit();
    this.changeDetectorRef.markForCheck();
  }

  public onModuleComboChanged() {
    const idSettingsGui =
      this.moduleCombo &&
      this.moduleCombo.selectedItem &&
      this.moduleCombo.selectedItem.idSettingsGUI;
    this.getWorkspaceTemplate(idSettingsGui);
  }

  private getWorkspaceTemplate(idSettingsGui?: string) {
    const resultIdSettingsGui = idSettingsGui || this.ofModule.idSettingsGUI;
    this.userModuleWorkspaceService
      .getAllWorkspaceTemplates(resultIdSettingsGui)
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }

          const dataSource = this.datatableService.buildEditableDataSource(
            response.item.data
          );

          const sortData: any[] = [];

          const systemTemplate = dataSource.data.find(
            (item) => item.IsSystem === true
          );
          if (systemTemplate) {
            sortData.push(systemTemplate);
          }

          const defaultTemplate = dataSource.data.find(
            (item) => item.IsUserDefault === true
          );
          if (defaultTemplate) {
            sortData.push(defaultTemplate);
          }

          for (let i = 0; i < dataSource.data.length; i++) {
            if (
              systemTemplate &&
              dataSource.data[i].IdWorkspaceTemplate ==
                systemTemplate.IdWorkspaceTemplate
            ) {
              continue;
            }

            if (
              defaultTemplate &&
              dataSource.data[i].IdWorkspaceTemplate ==
                defaultTemplate.IdWorkspaceTemplate
            ) {
              continue;
            }

            sortData.push(dataSource.data[i]);
          }

          this.workspaceDataSource = {
            data: sortData,
            columns: dataSource.columns,
          };

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  public applyTemplate() {
    const idSettingsGUI =
      this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Apply Template',
        messageType: MessageModal.MessageType.warning,
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Apply_Workspace_Template_Will_Reload_Page_Do_You_Want_To_Change',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.warning,
        callBack1: () => {
          const data = {
            ObjectNr: idSettingsGUI,
            IdWorkspaceTemplate:
              this.workspaceGrid.getSelectedNode().data['IdWorkspaceTemplate'],
          };
          if (idSettingsGUI === ModuleIdSettingGuid.AllModules) {
            this.userModuleWorkspaceService
              .applyWorkspaceTemplateAll(data)
              .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                  if (!Uti.isResquestSuccess(response)) {
                    return;
                  }

                  location.reload();
                  this.changeDetectorRef.markForCheck();
                });
              });
          } else {
            this.userModuleWorkspaceService
              .applyWorkspaceTemplate(data)
              .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                  if (!Uti.isResquestSuccess(response)) {
                    return;
                  }

                  location.reload();
                  this.changeDetectorRef.markForCheck();
                });
              });
          }
        },
        callBack2: () => {},
        callBackCloseButton: () => {},
      })
    );
  }

  public templateClick(e) {}

  public updateTemplate() {
    const idSettingsGUI =
      this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
    this.userModuleWorkspaceService
      .getWorkspaceTemplate(
        this.workspaceGrid.getSelectedNode().data.IdWorkspaceTemplate,
        idSettingsGUI
      )
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }

          this.workspaceGrid.deselectRow();

          this.showSaveWorkspaceTemplateDialog = true;
          setTimeout(() => {
            if (this.dialogSaveWorkspaceTemplate) {
              this.dialogSaveWorkspaceTemplate.open(
                {
                  ...response.item.data[0][0],
                  ShareList: response.item.data[1],
                },
                idSettingsGUI
              );
            }
          }, 50);

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  public newTemplate() {
    this.workspaceGrid.deselectRow();

    this.showSaveWorkspaceTemplateDialog = true;
    setTimeout(() => {
      if (this.dialogSaveWorkspaceTemplate) {
        const idSettingsGUI =
          this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
        this.dialogSaveWorkspaceTemplate.open(null, idSettingsGUI);
      }
    }, 50);
  }

  public onCloseSaveWorkspaceTemplateDialog() {
    const idSettingsGUI =
      this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
    this.showSaveWorkspaceTemplateDialog = false;
    this.getWorkspaceTemplate(idSettingsGUI);
  }

  public onDeleteWorkspace(e) {
    const idSettingsGUI =
      this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
    if (e) {
      this.modalService.confirmMessageHtmlContent(
        new MessageModel({
          messageType: MessageModal.MessageType.error,
          headerText: 'Delete Workspace',
          message: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Are_You_Sure_You_Want_To_Delete',
            },
            { key: '<strong>' },
            { key: e.WorkSpaceName },
            { key: 'Modal_Message__Workspace' },
            { key: '</p>`' },
          ],
          buttonType1: MessageModal.ButtonType.danger,
          callBack1: () => {
            this.userModuleWorkspaceService
              .deleteWorkspaceTemplate({
                IdWorkspaceTemplate: e.IdWorkspaceTemplate,
                IsDeleted: 1,
              })
              .subscribe((response) => {
                this.toasterService.pop(
                  'success',
                  'Success',
                  `Workspace is deleted successfully`
                );
                this.getWorkspaceTemplate(idSettingsGUI);
              });
          },
        })
      );
    }
  }

  public saveDefaultTemplate() {
    const idSettingsGUI =
      this.moduleCombo && this.moduleCombo.selectedItem.idSettingsGUI;
    const data: any = {
      ObjectNr: idSettingsGUI,
      IdWorkspaceTemplate:
        this.workspaceGrid.getSelectedNode().data['IdWorkspaceTemplate'],
    };

    this.userModuleWorkspaceService
      .saveDefaultWorkspaceTemplate(data)
      .subscribe((response) => {
        this.toasterService.pop(
          'success',
          'Success',
          `Default workspace is saved successfully`
        );
        this.getWorkspaceTemplate(idSettingsGUI);
      });
  }
}
