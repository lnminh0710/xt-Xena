import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import {
  AppErrorHandler,
  UserProfileService,
  DatatableService,
  UserModuleWorkspaceService,
} from 'app/services';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Configuration, ModuleIdSettingGuid } from 'app/app.constants';
import { Uti } from 'app/utilities';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Dialog } from 'primeng/components/dialog/dialog';

@Component({
  selector: 'dialog-save-workspace-template',
  styleUrls: ['./dialog-save-workspace-template.component.scss'],
  templateUrl: './dialog-save-workspace-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSaveWorkspaceTemplateComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public showDialog = false;
  public userDatasource: any;
  public isUserGridReadOnly = false;
  public isUserGridDisabled = false;
  public sharingMode = 'SelectedUser';
  public formGroup: FormGroup;
  public submitted = false;
  public isResizable = true;
  public isDraggable = true;
  public isMaximized = false;
  public dialogStyleClass = this.consts.popupResizeClassName;

  private editData: any;
  private idSettingsGUI: any;
  private preDialogW: string;
  private preDialogH: string;
  private preDialogLeft: string;
  private preDialogTop: string;

  @Output() onClose = new EventEmitter<any>();

  @ViewChild('userGrid') userGrid: XnAgGridComponent;
  private pDialogSaveWorkspaceTemplate: any;
  @ViewChild('pDialogSaveWorkspaceTemplate')
  set pDialogSaveWorkspaceTemplateInstance(
    pDialogSaveWorkspaceTemplateInstance: Dialog
  ) {
    this.pDialogSaveWorkspaceTemplate = pDialogSaveWorkspaceTemplateInstance;
  }
  constructor(
    private appErrorHandler: AppErrorHandler,
    private changeDetectorRef: ChangeDetectorRef,
    protected router: Router,
    private userProfileService: UserProfileService,
    private datatableService: DatatableService,
    private uti: Uti,
    private consts: Configuration,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private userModuleWorkspaceService: UserModuleWorkspaceService
  ) {
    super(router);
  }

  ngOnInit() {
    this.getUserList();

    this.formGroup = this.formBuilder.group({
      idWorkspaceTemplate: '',
      workspaceName: ['', Validators.required],
    });
  }

  ngOnDestroy() {}

  public open(data?: any, idSettingsGUI?: any) {
    this.showDialog = true;
    this.idSettingsGUI = idSettingsGUI;
    if (data) {
      this.editData = data;
      this.formGroup.setValue({
        idWorkspaceTemplate: data.IdWorkspaceTemplate,
        workspaceName: data.WorkSpaceName,
      });
    }

    this.changeDetectorRef.markForCheck();
  }

  public cancel() {
    this.showDialog = false;

    this.onClose.emit();
    this.changeDetectorRef.markForCheck();
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
    if (this.pDialogSaveWorkspaceTemplate) {
      this.preDialogW =
        this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.width;
      this.preDialogH =
        this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.height;
      this.preDialogLeft =
        this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.left;
      this.preDialogTop =
        this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.top;

      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.width =
        $(document).width() + 'px';
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.height =
        $(document).height() + 'px';
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.top =
        '0px';
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.left =
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
    if (this.pDialogSaveWorkspaceTemplate) {
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.width =
        this.preDialogW;
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.height =
        this.preDialogH;
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.top =
        this.preDialogTop;
      this.pDialogSaveWorkspaceTemplate.containerViewChild.nativeElement.style.left =
        this.preDialogLeft;
    }
    // setTimeout(() => {
    //     this.bindResizeEvent();
    // }, 200);
  }

  private getUserList() {
    this.userProfileService.getUserList().subscribe((data: any) => {
      this.appErrorHandler.executeAction(() => {
        if (!data || !data.contentDetail) {
          return;
        }

        let dataSource = this.datatableService.buildDataSource(
          data.contentDetail
        );
        dataSource = this.processDataSource(dataSource);

        if (dataSource.data.length) {
          const currentLoggedInUserIdx = dataSource.data.findIndex(
            (x) => x.IdLogin == this.uti.getUserInfo().id
          );
          if (currentLoggedInUserIdx !== -1) {
            dataSource.data.splice(currentLoggedInUserIdx, 1);
          }
        }

        this.userDatasource = dataSource;

        setTimeout(() => {
          if (this.editData) {
            this.sharingMode = this.editData.IsForAllUser
              ? 'Public'
              : 'SelectedUser';
            this.onSharingModeChanged();
            if (this.sharingMode === 'SelectedUser') {
              this.selectSharingUser(this.editData);
            }
          }
        });

        this.changeDetectorRef.markForCheck();
      });
    });
  }

  private selectSharingUser(data) {
    if (this.userGrid) {
      this.userGrid.agGridDataSource.rowData.forEach((user) => {
        const found = data.ShareList.find((u) => u.IdLogin == user.IdLogin);
        if (found) {
          user.IdWorkspaceTemplateSharing = found.IdWorkspaceTemplateSharing;
          user.select = true;

          this.userGrid.updateRowData([user]);
        }
      });
      this.userGrid.refresh();
    }
  }

  private processDataSource(dataSource: any) {
    for (let i = 0; i < dataSource.columns.length; i++) {
      if (
        dataSource.columns[i].data !== 'LoginName' &&
        dataSource.columns[i].data !== 'FirstName' &&
        dataSource.columns[i].data !== 'LastName' &&
        dataSource.columns[i].data !== 'Email'
      ) {
        if (
          dataSource.columns[i].setting.Setting &&
          dataSource.columns[i].setting.Setting.length
        ) {
          if (
            dataSource.columns[i].setting.Setting[0].hasOwnProperty(
              'DisplayField'
            )
          ) {
            dataSource.columns[i].setting.Setting[0].DisplayField.Hidden = '1';
            dataSource.columns[i].setting.Setting[0].DisplayField.ReadOnly =
              '1';
          } else {
            dataSource.columns[i].setting.Setting[0].DisplayField = {
              Hidden: '1',
              ReadOnly: '1',
            };
          }
        } else {
          dataSource.columns[i].setting.Setting.push({
            DisplayField: {
              Hidden: '1',
              ReadOnly: '1',
            },
          });
        }
      }
    }

    dataSource.columns.splice(0, 0, {
      data: 'IdWorkspaceTemplateSharing',
      title: 'IdWorkspaceTemplateSharing',
      visible: false,
      setting: {
        Setting: [
          {
            DisplayField: {
              Hidden: '1',
              ReadOnly: '1',
            },
          },
        ],
      },
    });

    dataSource.columns.splice(0, 0, {
      data: 'select',
      title: 'Select',
      visible: true,
      setting: {
        Setting: [
          {
            ControlType: {
              Type: 'Checkbox',
            },
          },
        ],
      },
    });

    return dataSource;
  }

  public onSharingModeChanged() {
    this.isUserGridDisabled = this.sharingMode === 'Public';
    this.isUserGridReadOnly = this.sharingMode === 'Public';

    this.changeDetectorRef.markForCheck();

    setTimeout(() => {
      if (this.userGrid) {
        if (this.isUserGridDisabled) {
          const data = this.userGrid.getGridData();
          data.forEach((item) => {
            item['select'] = false;
            this.userGrid.updateRowData([item]);
          });
        }

        this.userGrid.refresh();
      }
    });
  }

  public save() {
    this.submitted = true;
    this.formGroup.updateValueAndValidity();
    try {
      if (!this.formGroup.valid) {
        this.toasterService.pop(
          'warning',
          'Validation Fail',
          'There are some fields do not pass validation.'
        );
        return;
      }

      const data: any = {
        IdWorkspaceTemplate:
          this.formGroup.value.idWorkspaceTemplate || undefined,
        WorkSpaceName: this.formGroup.value.workspaceName,
        ObjectNr: this.idSettingsGUI,
        IsActive: 1,
        IsUserDefault: 0,
        IsForAllUser: this.sharingMode !== 'SelectedUser' ? 1 : 0,
        IsOwner: 1,
        ShareList: this.buildShareList(),
      };
      if (this.idSettingsGUI === ModuleIdSettingGuid.AllModules) {
        this.userModuleWorkspaceService
          .saveWorkspaceTemplateAll(data)
          .subscribe((response) => {
            this.toasterService.pop(
              'success',
              'Success',
              `Workspace is saved successfully`
            );

            this.cancel();
          });
      } else {
        this.userModuleWorkspaceService
          .saveWorkspaceTemplate(data)
          .subscribe((response) => {
            this.toasterService.pop(
              'success',
              'Success',
              `Workspace is saved successfully`
            );
            this.cancel();
          });
      }
    } catch (ex) {
      this.submitted = false;
    }
  }

  private buildShareList() {
    const result: any[] = [];
    if (this.sharingMode === 'SelectedUser') {
      let found: any;
      if (this.editData && this.editData.ShareList.length) {
        found = this.editData.ShareList.find(
          (u) => u.IdLogin == this.uti.getUserInfo().id
        );
      }
      result.push({
        IdWorkspaceTemplateSharing: found
          ? found.IdWorkspaceTemplateSharing
          : undefined,
        IdWorkspaceTemplate:
          this.formGroup.value.idWorkspaceTemplate || undefined,
        IdLogin: this.uti.getUserInfo().id,
        IsActive: 1,
      });

      this.userGrid.getGridData().forEach((user) => {
        if (user.select) {
          result.push({
            IdWorkspaceTemplateSharing:
              user.IdWorkspaceTemplateSharing || undefined,
            IdWorkspaceTemplate:
              this.formGroup.value.idWorkspaceTemplate || undefined,
            IdLogin: user.IdLogin,
            IsActive: 1,
            IsDeleted: 0,
          });
        } else if (!user.select && user.IdWorkspaceTemplateSharing) {
          result.push({
            IdWorkspaceTemplateSharing: user.IdWorkspaceTemplateSharing,
            IdWorkspaceTemplate: this.formGroup.value.idWorkspaceTemplate,
            IdLogin: user.IdLogin,
            IsActive: 0,
            IsDeleted: 1,
          });
        }
      });
    }

    return result;
  }
}
