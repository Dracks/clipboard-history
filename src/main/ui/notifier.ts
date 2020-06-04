import { NotificationSystem } from '../../common/config';
import { ChangeContext, ChangeContextNotification } from "../../common/types";
import ConfigService from "../config/config.service";
import { ClipboardEventEmitter, ClipboardEventEnum, ClipboardValue, SelectedClipboard } from "../types";
import NotificationSystemType from "./notifications/type";

export type NotifierDict = {
    [key in NotificationSystem]: NotificationSystemType
}

class NotifierUI {
    constructor(private bus: ClipboardEventEmitter, private config: ConfigService, private notifier:NotifierDict){
        this.bus.on(ClipboardEventEnum.TextChanged, this.changed.bind(this))
    }

    private changed(current: SelectedClipboard, _:Array<ClipboardValue>, context: ChangeContext){
        const type = this.config.typeNotifications
        if (type){
            const enabledContext = this.config.selectedContextNotifications
            if (enabledContext.includes(context as unknown as ChangeContextNotification)){
                this.notifier[type].notify(current.value)
            }
        }
    }
}

export default NotifierUI