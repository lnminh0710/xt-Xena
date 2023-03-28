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
} from "@angular/core";
import {
    AppErrorHandler,
    UserProfileService,
    DatatableService,
} from "app/services";
import { Module, User } from "app/models";
import { ModuleList } from "app/pages/private/base";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { Configuration } from "app/app.constants";
import { Dialog } from "primeng/components/dialog/dialog";

@Component({
    selector: "app-dialog-apply-widget-settings",
    styleUrls: ["./dialog-apply-widget-settings.component.scss"],
    templateUrl: "./dialog-apply-widget-settings.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogApplyWidgetSettingsComponent implements OnInit, OnDestroy {
    public showDialog = false;
    public modules: Module[] = [];
    public moduleComboFocused = false;
    public userDatasource: any;
    public selectedModule: any;
    public showLoading = false;
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;
    public dialogStyleClass = this.consts.popupResizeClassName;

    private stopNow = false;
    private isSelectionProject = false;
    private preDialogW: string;
    private preDialogH: string;
    private preDialogLeft: string;
    private preDialogTop: string;
    @Input() userGridId: string;
    @Input() currentUser: User;

    @Output() onApply = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();

    @ViewChild("userGrid") userGrid: XnAgGridComponent;
    private pDialogApplyWidgetSetting: any;
    @ViewChild("pDialogApplyWidgetSetting")
    set pDialogApplyWidgetSettingInstance(
        pDialogApplyWidgetSettingInstance: Dialog
    ) {
        this.pDialogApplyWidgetSetting = pDialogApplyWidgetSettingInstance;
    }
    constructor(
        private appErrorHandler: AppErrorHandler,
        private userProfileService: UserProfileService,
        private consts: Configuration,
        private datatableService: DatatableService,
        private changeDetectorRef: ChangeDetectorRef,
        private toasterService: ToasterService
    ) {
        this.isSelectionProject =
            Configuration.PublicSettings.isSelectionProject;
    }

    ngOnInit() {
        this.getModuleList();
        this.getUserList();
    }

    ngOnDestroy() {}

    private getModuleList() {
        this.modules = [];
        if (!this.isSelectionProject) {
            let objectKeys = Object.keys(ModuleList);
            for (let i = 0; i < objectKeys.length; i++) {
                if (
                    objectKeys[i] !== "BackOffice" &&
                    objectKeys[i] !== "Statistic" &&
                    objectKeys[i] !== "Tools" &&
                    objectKeys[i] !== "TracksSetup"
                ) {
                    if (objectKeys[i] === "Base") {
                        this.modules.push({
                            idSettingsGUI: -1,
                            moduleName: "All Modules",
                        });
                    } else {
                        this.modules.push({
                            idSettingsGUI:
                                ModuleList[objectKeys[i]].idSettingsGUI,
                            moduleName: ModuleList[objectKeys[i]].moduleName,
                        });
                    }
                }
            }
        } else {
            this.modules.push({
                idSettingsGUI: -1,
                moduleName: "All Modules",
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
            "  " +
            this.consts.popupFullViewClassName;
        if (this.pDialogApplyWidgetSetting) {
            this.preDialogW =
                this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.width;
            this.preDialogH =
                this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.height;
            this.preDialogLeft =
                this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.left;
            this.preDialogTop =
                this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.top;

            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.width =
                $(document).width() + "px";
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.height =
                $(document).height() + "px";
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.top =
                "0px";
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.left =
                "0px";
        }
    }

    private restore() {
        // if (this.translateWidget)
        //     this.translateWidget.resized();
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.consts.popupResizeClassName;
        if (this.pDialogApplyWidgetSetting) {
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.width =
                this.preDialogW;
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.height =
                this.preDialogH;
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.top =
                this.preDialogTop;
            this.pDialogApplyWidgetSetting.containerViewChild.nativeElement.style.left =
                this.preDialogLeft;
        }
        // setTimeout(() => {
        //     this.bindResizeEvent();
        // }, 200);
    }

    public open() {
        this.showDialog = true;
        this.stopNow = false;
        this.changeDetectorRef.markForCheck();
    }

    public apply() {
        let selectedUsers: any[] = this.userGrid
            .getCurrentNodeItems()
            .filter((x) => x.select);
        if (!this.selectedModule || !selectedUsers.length) {
            this.toasterService.pop(
                "warning",
                "Validation Failed",
                "Must select at least a module and an user"
            );
            return;
        }

        this.showLoading = true;
        let totalCalls = selectedUsers.length;
        let current = 0;

        let callSaveUserWidgetLayout = (current, totals) => {
            if (current <= totals - 1) {
                this.userProfileService
                    .saveUserWidgetLayout(
                        selectedUsers[current].IdLogin,
                        this.selectedModule.idSettingsGUI
                    )
                    .subscribe(
                        (data: any) => {
                            selectedUsers[current].status = true;
                            selectedUsers[current].select = false;

                            this.userGrid.updateRowData([
                                selectedUsers[current],
                            ]);

                            if (this.stopNow) {
                                this.stopNow = false;
                                this.showLoading = false;
                                this.changeDetectorRef.markForCheck();
                                return;
                            }

                            current += 1;
                            callSaveUserWidgetLayout(current, totalCalls);
                            this.changeDetectorRef.markForCheck();
                        },
                        (error) => {
                            this.stopNow = false;
                            this.showLoading = false;
                            this.toasterService.pop(
                                "error",
                                "Failed",
                                "Apply widget settings is not successful"
                            );
                            this.changeDetectorRef.markForCheck();
                        }
                    );
            } else {
                this.showLoading = false;
                this.stopNow = false;
                this.toasterService.pop(
                    "success",
                    "Success",
                    "Apply widget settings successfully"
                );
                this.changeDetectorRef.markForCheck();
            }
        };

        callSaveUserWidgetLayout(current, totalCalls);
    }

    public cancel() {
        if (this.showLoading) {
            this.stopNow = true;
        } else {
            this.stopNow = false;
            this.showDialog = false;
            this.onClose.emit();
        }
        this.changeDetectorRef.markForCheck();
    }

    public onModuleComboChanged(item) {
        this.selectedModule = item;
        if (this.moduleComboFocused) {
            if (this.userGrid.getCurrentNodeItems().length) {
                this.userGrid.getCurrentNodeItems().forEach((user) => {
                    user.status = false;
                    this.userGrid.updateRowData([user]);
                });
            }
        }
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
                    let currentLoggedInUserIdx = dataSource.data.findIndex(
                        (x) => x.IdLogin == this.currentUser.id
                    );
                    if (currentLoggedInUserIdx !== -1) {
                        dataSource.data.splice(currentLoggedInUserIdx, 1);
                    }
                }

                this.userDatasource = dataSource;

                this.changeDetectorRef.markForCheck();
            });
        });
    }

    private processDataSource(dataSource: any) {
        for (let i = 0; i < dataSource.columns.length; i++) {
            if (
                dataSource.columns[i].data !== "LoginName" &&
                dataSource.columns[i].data !== "FirstName" &&
                dataSource.columns[i].data !== "LastName" &&
                dataSource.columns[i].data !== "Email"
            ) {
                if (
                    dataSource.columns[i].setting.Setting &&
                    dataSource.columns[i].setting.Setting.length
                ) {
                    if (
                        dataSource.columns[i].setting.Setting[0].hasOwnProperty(
                            "DisplayField"
                        )
                    ) {
                        dataSource.columns[
                            i
                        ].setting.Setting[0].DisplayField.Hidden = "1";
                        dataSource.columns[
                            i
                        ].setting.Setting[0].DisplayField.ReadOnly = "1";
                    } else {
                        dataSource.columns[i].setting.Setting[0].DisplayField =
                            {
                                Hidden: "1",
                                ReadOnly: "1",
                            };
                    }
                } else {
                    dataSource.columns[i].setting.Setting.push({
                        DisplayField: {
                            Hidden: "1",
                            ReadOnly: "1",
                        },
                    });
                }
            }
        }

        dataSource.columns.splice(0, 0, {
            data: "select",
            title: "Select",
            visible: true,
            setting: {
                Setting: [
                    {
                        ControlType: {
                            Type: "Checkbox",
                        },
                    },
                ],
            },
        });

        dataSource.columns.push({
            data: "status",
            title: "Status",
            visible: true,
            setting: {
                Setting: [
                    {
                        ControlType: {
                            Type: "Checkbox",
                        },
                        DisplayField: {
                            ReadOnly: "1",
                        },
                    },
                ],
            },
        });

        return dataSource;
    }
}
