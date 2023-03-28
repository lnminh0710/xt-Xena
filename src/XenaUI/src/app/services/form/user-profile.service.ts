import { Injectable, Injector, Inject, forwardRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BaseService } from "../base.service";
import { Uti } from "app/utilities";
import { WidgetDetail } from "app/models";
import { WidgetTemplateSettingService } from "app/services";

@Injectable()
export class UserProfileService extends BaseService {
    constructor(
        injector: Injector,
        @Inject(forwardRef(() => WidgetTemplateSettingService))
        private widgetTemplateSettingService: WidgetTemplateSettingService
    ) {
        super(injector);
    }

    public getUserById(idPerson?: number): Observable<any> {
        return this.get<any>(this.serUrl.getUserById, {
            idPerson: idPerson,
        });
    }

    public getAllUserRole(): Observable<any> {
        return this.get<any>(this.serUrl.getAllUserRole);
    }

    public listUserRoleByUserId(userId?): Observable<any> {
        return this.get<any>(this.serUrl.listUserRoleByUserId, {
            userId: userId,
        });
    }

    public listUserRoleInclueUserId(idPerson?: number): Observable<any> {
        return this.get<any>(this.serUrl.listUserRoleInclueUserId, {
            idPerson: idPerson,
        });
    }

    public checkExistUserByField(
        fieldName: string,
        fieldValue: string
    ): Observable<any> {
        fieldValue = fieldValue ? fieldValue.trim() : "";
        if (fieldValue) {
            return this.get<any>(this.serUrl.checkExistUserByField, {
                fieldName: fieldName,
                fieldValue: fieldValue,
            }).map((res: any) => {
                return res.item.data.length > 1 ? { exists: true } : null;
            });
        } else {
            return Observable.of(null);
        }
    }

    public checkExistUserByFieldInEdit(
        fieldName: string,
        fieldValue: string
    ): Observable<any> {
        fieldValue = fieldValue ? fieldValue.trim() : "";
        if (fieldValue) {
            return this.get<any>(this.serUrl.checkExistUserByField, {
                fieldName: fieldName,
                fieldValue: fieldValue,
            }).map((res: any) => {
                if (res.item.data.length <= 1) {
                    return null;
                }
                let item = Uti.getItemFromArrayByProperty(
                    res.item.data[1],
                    fieldName,
                    fieldValue
                );
                return item && item.Value === fieldValue
                    ? null
                    : { exists: true };
            });
        } else {
            return Observable.of(null);
        }
    }

    public saveUserProfile(data: any): Observable<any> {
        return this.post<any>(
            this.serUrl.saveUserProfile,
            JSON.stringify(data)
        );
    }

    public saveRolesForUser(roles, isSetDefaultRole?: any): Observable<any> {
        let rolesObject = [];
        if (roles.length) {
            rolesObject = roles.map((role) => {
                return {
                    IdLoginRolesLoginGw: role.IdLoginRolesLoginGw,
                    IdLoginRoles: role.IdLoginRoles,
                    IsDefault: role.IsDefault,
                    IdLogin: role.IdLogin,
                };
            });
        }
        const data = {
            Roles: rolesObject,
            IsSetDefaultRole: isSetDefaultRole,
        };
        return this.post<any>(
            this.serUrl.saveRoleForUser,
            JSON.stringify(data)
        );
    }

    public getUserList(): Observable<any> {
        const requestData = {
            MethodName: "SpAppWg002UserList",
            CrudType: "Read",
            Object: "GetUserList",
            Mode: null,
            WidgetTitle: "Begin new World...",
            IsDisplayHiddenFieldWithMsg: "1",
            LoginInformation: "",
            InputParameter: "",
        };
        const request = {
            Request: {
                ModuleName: "GlobalModule",
                ServiceName: "GlobalService",
                Data: JSON.stringify(requestData),
            },
        };

        let widgetDetail: any = {
            id: Uti.guid(), //'201ea1c5-a7d7-a9f3-7889-90b2b29a1f58'
            idRepWidgetApp: 104,
            idRepWidgetType: 3,
            moduleName: "System Management",
            request: JSON.stringify(request),
            title: "User List",
        };

        return this.widgetTemplateSettingService.getWidgetDetailByRequestString(
            widgetDetail,
            null
        );
    }

    public saveUserWidgetLayout(
        userId: any,
        idSettingsGUI: any
    ): Observable<any> {
        let saveData = {
            IdMember: userId,
            ObjectNr: idSettingsGUI,
        };

        return this.post<any>(
            this.serUrl.saveUserWidgetLayout,
            JSON.stringify(saveData)
        );
    }

    public getUserFunctionList(idLoginRoles): Observable<any> {
        return this.get<any>(this.serUrl.getUserFunctionList, {
            idLoginRoles: idLoginRoles,
        });
    }

    public assignRoleToMultipleUser(idLogins, idLoginRoles): Observable<any> {
        return this.post<any>(this.serUrl.assignRoleToMultipleUser, null, {
            idLogins: idLogins,
            idLoginRoles: idLoginRoles,
        });
    }
}
