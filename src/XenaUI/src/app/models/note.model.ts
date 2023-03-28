export class Note {
    date: Date;
    IdSharingNotes?: string = null;
    LoginName: string;
    IdLogin: string;
    Notes: string;
    IsActive: NoteEnum = NoteEnum.ONE;
    IsDeleted: NoteEnum = NoteEnum.ZERO;
    Editing: boolean;
    Cancelable: boolean;
    Removeable: boolean;

    constructor(init?: Partial<Note>) {
        if (init) {
            Object.keys(init).forEach((k: string) => {
                if (k === "Date") {
                    const dateValue = init[k]
                        ? init[k].replace(/(\d{2}).(\d{2}).(\d{4})/, "$2/$1/$3")
                        : null;
                    this.date = new Date(dateValue);
                    return;
                }
                // this[k.charAt(0).toLowerCase() + k.slice(1)] = init[k];
                this[k] = init[k];
            });
        }
    }
}

export class NoteFormButtonStatus {
    isAdd: boolean;
    hasData: boolean;

    constructor(isAdd: boolean, hasData: boolean) {
        this.isAdd = isAdd;
        this.hasData = hasData;
    }
}

export class NoteFormDataAction {
    action: NoteActionEnum;
    status: NoteFormButtonStatus;
    data: any;
}

export enum NoteEnum {
    ZERO = "0",
    ONE = "1",
}

export enum NoteActionEnum {
    EDIT_MODE = 1,
    VIEW_MODE = 2,
    ADD = 3,
    SAVE = 4,
}

export interface NoteLoading {
    share: boolean;
    download: boolean;
    print: boolean;
}
