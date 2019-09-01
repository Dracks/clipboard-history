import { ChangeContext } from "./types";

export type NotificationSystem = 'electron' | 'node';


export interface Config {
    historyLength: number,
    notifications: {
        type?: NotificationSystem,
    } & {
        [key in ChangeContext]: boolean
    }
}
