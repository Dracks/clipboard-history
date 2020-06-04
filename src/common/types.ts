import { Config } from "./config";

export type WindowPage = "config" | "Debug"

export type PageData = {
    "config": Config,
    "Debug": String
}

export type PageDataSend = {
    name: WindowPage,
    data: Config | String
}

export type LoadPage = {
    context: ContextData,
    page: PageDataSend
}

export enum EventsName {
    Log = "log",
    Error = "error",
    Load = "load",
    Save = "save"
}

export enum PlatformEnum {
    mac="mac",
    win="win",
    linux="linux",
}

type NodePlatform = 'aix'
| 'android'
| 'darwin'
| 'freebsd'
| 'netbsd'
| 'linux'
| 'openbsd'
| 'sunos'
| 'win32'
| 'cygwin';

export const NodePlatformToEnum : {[key in NodePlatform]:PlatformEnum} = {
    aix: PlatformEnum.linux,
    android: PlatformEnum.linux,
    darwin: PlatformEnum.mac,
    freebsd: PlatformEnum.linux,
    netbsd: PlatformEnum.linux,
    linux: PlatformEnum.linux,
    openbsd: PlatformEnum.linux,
    sunos: PlatformEnum.linux,
    win32: PlatformEnum.win,
    cygwin: PlatformEnum.win,
}

export interface ContextData {
    platform: PlatformEnum
}
export enum ChangeContextNotification {
    // When there is a new clipboard detected
    new = "new",
    // If the change is provoqued by a shortcut
    shortcut = "shortcut",
    // If it's selected from the tray
    manual = "manual",
    // If is when the application starts
    start = "start",
}
export enum ChangeContext {
    new = "new",
    // If the change is provoqued by a shortcut
    shortcut = "shortcut",
    // If it's selected from the tray
    manual = "manual",
    // If is when the application starts
    start = "start",
    // internal update, no notification
    update = "update"
}