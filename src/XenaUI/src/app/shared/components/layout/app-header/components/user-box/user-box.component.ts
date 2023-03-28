import {
    Component,
    OnInit,
    Output,
    OnDestroy,
    ViewChild,
    ViewChildren,
    ChangeDetectorRef,
    QueryList,
    EventEmitter,
} from "@angular/core";
import {
    UserService,
    AuthenticationService,
    AppErrorHandler,
    PropertyPanelService,
    ModalService,
    CommonService,
    UserProfileService,
} from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Uti } from "app/utilities";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { BaseComponent, ModuleList } from "app/pages/private/base";
import { Router } from "@angular/router";
import {
    FormOutputModel,
    MessageModel,
    User,
    ApiResultResponse,
    Module,
} from "app/models";
import { UserProfileFormComponent } from "app/shared/components/form";
import {
    MessageModal,
    UploadFileMode,
    Configuration,
    ComboBoxTypeConstant,
} from "app/app.constants";
import { XnImageLoaderDirective } from "app/shared/directives/xn-image-loader/xn-image-loader.directive";
import isBoolean from "lodash-es/isBoolean";
import { formatDistance, format } from "date-fns/esm";
import { ModuleActions } from "app/state-management/store/actions";
import { UnsavedModuleCanDeactivate } from "app/services";
import * as widgetContentReducer from "app/state-management/store/reducer/widget-content-detail";
import * as processDataReducer from "app/state-management/store/reducer/process-data";

@Component({
    /* tslint:disable */
    selector: ".userBox",
    /* tslint:enable */
    styleUrls: ["./user-box.component.scss"],
    templateUrl: "./user-box.component.html",
})
export class UserBoxComponent
    extends UnsavedModuleCanDeactivate
    implements OnInit, OnDestroy
{
    public currentUser: User = new User();
    public lastUpdated: Date;
    public showForm: boolean = false;
    public formLoaded: boolean = false;
    public globalProperties: any;
    public globalDateFormat = "";
    public profileImageUrl: string = "";
    private languages: any[] = [];
    public userLanguage: string = null;
    public roles: any[] = [];
    public selectedRole: any = null;
    public selectedRoleOrigin: any = null;
    public buildVersion = "";

    private isRoleFocused: boolean = false;
    private dirtyModules: Module[] = [];
    private activeModule: Module;
    private editingWidgets: any[] = [];
    private formDirty = false;

    private isUserProfileDirty: boolean = false;
    private globalPropertiesStateSubscription: Subscription;
    private dirtyModulesStateSubscription: Subscription;
    private activeModuleStateSubscription: Subscription;
    private editingWidgetsStateSubscription: Subscription;
    private formDirtyStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private dirtyModulesState: Observable<Module[]>;
    private activeModuleState: Observable<Module>;
    private editingWidgetsState: Observable<any[]>;
    private formDirtyState: Observable<boolean>;
    @ViewChild("userProfileForm")
    private userProfileForm: UserProfileFormComponent;
    @ViewChildren(XnImageLoaderDirective)
    xnImageLoaders: QueryList<XnImageLoaderDirective>;

    @Output() updateAutoClose: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        private userServ: UserService,
        private authenticationService: AuthenticationService,
        private modalService: ModalService,
        private toasterService: ToasterService,
        private ref: ChangeDetectorRef,
        protected router: Router,
        private consts: Configuration,
        private commonService: CommonService,
        private userProfileService: UserProfileService,
        private moduleActions: ModuleActions,
        private uti: Uti
    ) {
        super();

        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
        this.dirtyModulesState = store.select(
            (state) => state.mainModule.dirtyModules
        );
        this.activeModuleState = store.select(
            (state) => state.mainModule.activeModule
        );

        this.userServ.currentUser.subscribe((user: User) => {
            this.appErrorHandler.executeAction(() => {
                this.currentUser = user;
                this.profileImageUrl =
                    Uti.getFileUrl(
                        this.currentUser.loginPicture,
                        UploadFileMode.Profile
                    ) + "&w=300";

                setTimeout(() => {
                    if (this.xnImageLoaders && this.xnImageLoaders.length) {
                        this.xnImageLoaders.forEach((item) => {
                            item.reloadImg(this.profileImageUrl);
                        });
                    }
                });
            });
        });

        this.lastUpdated = new Date();
    }

    canDeactivate(): boolean {
        return (
            !this.formDirty &&
            this.editingWidgets.length === 0 &&
            this.dirtyModules.length === 0
        );
    }

    deactivateCancelCallback() {
        if (this.dirtyModules.length) {
            this.store.dispatch(
                this.moduleActions.requestChangeModule(this.dirtyModules[0])
            );
        }
    }

    public ngOnInit() {
        this.subscribeGlobalProperties();
        this.subscribeDirtyModulesState();
        this.subscribeActiveModuleState();
        this.getMainLanguages();
        this.getRoles();
        this.getAppVersion();
    }

    private getAppVersion() {
        this.buildVersion = Configuration.PublicSettings.appVersion;
        this.ref.markForCheck();
    }

    public preventClose(event: MouseEvent) {
        event.stopImmediatePropagation();
    }

    public logout = (): void => {
        if (this.dirtyModules.length) {
            const modalOptions: any = {
                headerText: "Saving Changes",
                message: [{ key: "Modal_Message__Saving_Change_Log_Out" }],
                onModalSaveAndExit: () => {
                    this.store.dispatch(
                        this.moduleActions.requestChangeModule(
                            this.dirtyModules[0]
                        )
                    );
                },
                onModalExit: () => {
                    this.authenticationService.logout();
                    location.href = this.consts.loginUrl;
                    location.reload();
                },
            };

            this.modalService.unsavedWarningMessage(modalOptions);
        } else {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Logout",
                    messageType: MessageModal.MessageType.error,
                    message: [
                        { key: "Modal_Message__Do_You_Want_To_Logout_System" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        this.authenticationService.logout();
                        location.href = this.consts.loginUrl;
                        location.reload();
                    },
                })
            );
        }
    };

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public editProfile() {
        this.showForm = true;
    }

    public userProfileFormLoaded() {
        this.formLoaded = true;

        this.toggleAvatar(false);
    }

    public close() {
        if (this.isUserProfileDirty) {
            this.confirmWhenClose();
            return;
        }
        this.showForm = false;
        this.formLoaded = false;
        this.toggleAvatar(true);
    }

    public saveUserProfile() {
        if (!this.isUserProfileDirty) {
            this.toasterService.pop(
                "warning",
                "Validation Failed",
                "No entry data for saving!"
            );
            return;
        }
        this.userProfileForm.submit();
    }

    public userProfileOutput(data: FormOutputModel) {
        if (isBoolean(data.submitResult)) {
            if (data.submitResult) {
                if (data.returnID) {
                    this.toasterService.pop(
                        "success",
                        "Success",
                        "Save user successfully"
                    );
                    this.isUserProfileDirty = false;
                    this.updateAutoClose.emit(true);
                    return;
                } else {
                    this.toasterService.pop(
                        "error",
                        "Message",
                        "Has service error!!!"
                    );
                    this.updateAutoClose.emit(false);
                }
            } else {
                this.toasterService.pop(
                    "warning",
                    "Validation Failed",
                    "There are some fields do not pass validation!"
                );
                this.isUserProfileDirty = true;
                this.updateAutoClose.emit(false);
            }
        } else {
            this.isUserProfileDirty = data.isDirty;
            this.updateAutoClose.emit(!data.isDirty);
        }
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties) {
                        this.globalProperties = globalProperties;
                        this.globalDateFormat =
                            this.propertyPanelService.buildGlobalDateFormatFromProperties(
                                globalProperties
                            );
                    }
                });
            });
    }

    private subscribeDirtyModulesState() {
        this.dirtyModulesStateSubscription = this.dirtyModulesState.subscribe(
            (dirtyModulesState: Module[]) => {
                this.appErrorHandler.executeAction(() => {
                    if (dirtyModulesState) {
                        this.dirtyModules = dirtyModulesState;
                    }
                });
            }
        );
    }

    private subscribeActiveModuleState() {
        this.activeModuleStateSubscription = this.activeModuleState.subscribe(
            (activeModuleState: Module) => {
                this.appErrorHandler.executeAction(() => {
                    this.activeModule = activeModuleState;

                    if (this.activeModule && this.activeModule.moduleNameTrim) {
                        if (this.editingWidgetsStateSubscription) {
                            this.editingWidgetsStateSubscription.unsubscribe();
                        }
                        this.editingWidgetsState = this.store.select(
                            (state) =>
                                widgetContentReducer.getWidgetContentDetailState(
                                    state,
                                    this.activeModule.moduleNameTrim
                                ).editingWidgets
                        );
                        this.subscribeWidgetDetailState();

                        if (this.formDirtyStateSubscription) {
                            this.formDirtyStateSubscription.unsubscribe();
                        }
                        this.formDirtyState = this.store.select(
                            (state) =>
                                processDataReducer.getProcessDataState(
                                    state,
                                    this.activeModule.moduleNameTrim
                                ).formDirty
                        );
                        this.subcribeFormDirtyState();
                    }
                });
            }
        );
    }

    private subscribeWidgetDetailState() {
        this.editingWidgetsStateSubscription =
            this.editingWidgetsState.subscribe((editingWidgets: Array<any>) => {
                this.appErrorHandler.executeAction(() => {
                    this.editingWidgets = editingWidgets;
                });
            });
    }

    private subcribeFormDirtyState() {
        this.formDirtyStateSubscription = this.formDirtyState.subscribe(
            (formDirtyState: boolean) => {
                this.appErrorHandler.executeAction(() => {
                    this.formDirty = formDirtyState;
                });
            }
        );
    }

    private confirmWhenClose() {
        this.modalService.unsavedWarningMessageDefault({
            headerText: "Saving Changes",
            showCloseButton: false,
            onModalSaveAndExit: () => {
                this.updateAutoClose.emit(false);
                this.saveUserProfile();
                this.ref.detectChanges();
            },
            onModalExit: () => {
                this.isUserProfileDirty = false;
                this.showForm = false;
                this.formLoaded = false;
                this.toggleAvatar(true);
                this.updateAutoClose.emit(true);
                this.ref.detectChanges();
            },
            onModalCancel: () => {
                this.updateAutoClose.emit(false);
            },
        });
    }

    private getMainLanguages() {
        this.commonService
            .getListComboBox("" + ComboBoxTypeConstant.language)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.language
                    ) {
                        return;
                    }
                    this.languages = response.item.language;

                    if (
                        this.languages &&
                        this.languages.length &&
                        this.currentUser
                    ) {
                        let userLanguage = this.languages.find(
                            (l) => l.idValue == this.currentUser.preferredLang
                        );
                        if (userLanguage) {
                            this.userLanguage = userLanguage.textValue;
                        }
                    }
                });
            });
    }

    private getRoles() {
        this.userProfileService
            .listUserRoleByUserId()
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.data ||
                        !response.item.data[0] ||
                        !response.item.data[0].length
                    ) {
                        return;
                    }

                    this.roles.push({
                        RoleName: "All",
                        IdLoginRolesLoginGw: -1,
                        IdLoginRoles: -1,
                    });

                    response.item.data[0].forEach((role) => {
                        this.roles.push(role);
                    });

                    let defaultRoles = this.roles.filter(
                        (r) =>
                            isBoolean(r.IsDefault) &&
                            r.IsDefault &&
                            r.IdLoginRoles != -1
                    );
                    if (defaultRoles && defaultRoles.length) {
                        let idLoginRoles: string;

                        if (defaultRoles.length === this.roles.length - 1) {
                            this.selectedRole =
                                this.roles[0].IdLoginRolesLoginGw;
                            this.selectedRoleOrigin = this.selectedRole;

                            idLoginRoles = this.roles[0].IdLoginRoles;
                        } else {
                            this.selectedRole =
                                defaultRoles[0].IdLoginRolesLoginGw;
                            this.selectedRoleOrigin = this.selectedRole;

                            idLoginRoles = defaultRoles[0].IdLoginRoles;
                        }

                        //store DefaultRoleId to localStorage
                        if (idLoginRoles)
                            this.uti.storeDefaultRole(idLoginRoles);
                    }
                });
            });
    }

    private toggleAvatar(isShowed) {
        if (isShowed) {
            $(".avatar img").css({
                opacity: 1,
                "-webkit-transition": "all 0s",
                transition: "all 0s",
            });
        } else {
            $(".avatar img").css({
                opacity: 0,
                "-webkit-transition": "all 0.1s",
                transition: "all 0.1s",
            });
        }
    }

    public roleChanged() {
        if (this.isRoleFocused && this.selectedRole) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Change User Role",
                    messageType: MessageModal.MessageType.error,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__The_Page_Will_Reload_To_Apply_New_Role",
                        },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        if (this.selectedRole === -1) {
                            for (let i = 1; i < this.roles.length; i++) {
                                this.roles[i].IsDefault = true;
                            }
                        } else {
                            for (let i = 1; i < this.roles.length; i++) {
                                if (
                                    this.roles[i].IdLoginRolesLoginGw !==
                                    this.selectedRole
                                ) {
                                    this.roles[i].IsDefault = false;
                                } else {
                                    this.roles[i].IsDefault = true;
                                }
                            }
                        }

                        this.selectedRoleOrigin = this.selectedRole;

                        //store DefaultRoleId to localStorage
                        let role = this.roles.find(
                            (r) => r.IdLoginRolesLoginGw == this.selectedRole
                        );
                        if (role) this.uti.storeDefaultRole(role.IdLoginRoles);

                        const isSetDefaultRole = "1";
                        this.userProfileService
                            .saveRolesForUser(
                                this.buildRolesData(),
                                isSetDefaultRole
                            )
                            .subscribe((response: ApiResultResponse) => {
                                this.appErrorHandler.executeAction(() => {
                                    if (!Uti.isResquestSuccess(response)) {
                                        this.toasterService.pop(
                                            "error",
                                            "Failed",
                                            "Save user role is not successful."
                                        );
                                        return;
                                    }

                                    this.toasterService.pop(
                                        "success",
                                        "Success",
                                        "Save user role successfully"
                                    );

                                    location.reload();
                                });
                            });
                    },
                    callBack2: () => {
                        this.selectedRole = this.selectedRoleOrigin;
                    },
                    showCloseButton: false,
                })
            );
        }
    }

    public roleFocus(isFocused: boolean) {
        this.isRoleFocused = isFocused;
    }

    private buildRolesData() {
        let data: any[] = [];

        for (let i = 1; i < this.roles.length; i++) {
            data.push(this.roles[i]);
        }

        return data;
    }

    public buildWorkingTime(date) {
        return formatDistance(new Date(date), new Date());
    }

    formatDate(data: any, formatPattern: string) {
        const result = !data
            ? ""
            : this.uti.formatLocale(new Date(data), formatPattern);
        return result;
    }
}
