import { ChangeContextNotification } from "./types";

export type NotificationSystem = 'electron' | 'node';

export type KeyboardShortcut = string

export interface ShortcutsConfig {
    next: KeyboardShortcut,
    previous: KeyboardShortcut,
    removeCurrent: KeyboardShortcut
}

export interface TrayConfig {
    trim: boolean
    size: number
}

export interface Config {
    historyLength: number,
    notifications: {
        type?: NotificationSystem,
    } & {
        [key in ChangeContextNotification]: boolean
    },
    shortcuts: ShortcutsConfig
    tray: TrayConfig
}

export const initialConfig : Config = {
    historyLength: 15,
    notifications: {
        type: 'electron',
        new: false,
        shortcut: true,
        manual: false,
        start: false
    },
    shortcuts: {
        next: 'CommandOrControl+F12',
        previous: 'CommandOrControl+F11',
        removeCurrent: 'CommandOrControl+F9',
    },
    tray: {
        trim: false,
        size: 20
    }
}
