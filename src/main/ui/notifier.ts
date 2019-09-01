import { EventEmitter } from "events";
import { NotificationSystem } from '../../common/config';
import { ChangeContext } from "../../common/types";
import ConfigService from "../config/config.service";
import { SelectedClipboard } from "../core/types";
import { TEXT_CHANGED } from "../events";
import NotificationSystemType from "./notifications/type";

export type NotifierDict = {
    [key in NotificationSystem]: NotificationSystemType
}

class NotifierUI {
    constructor(private bus: EventEmitter, private config: ConfigService, private notifier:NotifierDict){
        this.bus.on(TEXT_CHANGED, this.changed.bind(this))
    }

    private changed(current: SelectedClipboard, _, context: ChangeContext){
        const type = this.config.typeNotifications
        if (type){
            const enabledContext = this.config.selectedContextNotifications
            if (enabledContext.includes(context)){
                this.notifier[type].notify(current.value)
            }
        }
    }
}

export default NotifierUI