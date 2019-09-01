import { Config } from "./config";

export type WindowPage = "config" | "Debug"

export type PageData = {
    "config": Config,
    "Debug": String
}

export type PageDataSend = {
    page: WindowPage,
    data: Config | String
}

export enum EventsName {
    Log = "log",
    Error = "error",
    Load = "load",
    Save = "save",
}

export enum ChangeContext{
    // When there is a new clipboard detected
    new = "new",
    // If the change is provoqued by a shortcut
    shortcut = "shortcut",
    // If it's selected from the tray
    manual = "manual",
    // If is when the application starts
    start = "start"
}