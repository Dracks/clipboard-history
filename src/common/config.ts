import { ChangeContext } from "./types";

export type NotificationSystem = 'electron' | 'node';

export type KeyboardShortcut = string

export interface ShortcutsConfig {
    next: KeyboardShortcut,
    previous: KeyboardShortcut,
    removeCurrent: KeyboardShortcut
}

export interface Config {
    historyLength: number,
    notifications: {
        type?: NotificationSystem,
    } & {
        [key in ChangeContext]: boolean
    },
    shortcuts: ShortcutsConfig
}
