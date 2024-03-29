/// <reference types="mousetrap" />
import { IHotkeyOptions } from './hotkey.options';
import { Subject } from 'rxjs/Subject';
import { Hotkey } from './hotkey.model';
import 'mousetrap';
import { MousetrapInstance } from 'mousetrap';
export declare class HotkeysService {
    private options;
    hotkeys: Hotkey[];
    pausedHotkeys: Hotkey[];
    mousetrap: MousetrapInstance;
    cheatSheetToggle: Subject<any>;
    private _preventIn;
    constructor(options: IHotkeyOptions);
    add(hotkey: Hotkey | Hotkey[], specificEvent?: string): Hotkey | Hotkey[];
    remove(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[];
    get(combo?: string | string[]): Hotkey | Hotkey[];
    pause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[];
    unpause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[];
    reset(): void;
    private findHotkey(hotkey);
}
