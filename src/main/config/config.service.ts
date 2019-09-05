import { Config, NotificationSystem } from "../../common/config";
import { ChangeContext } from "../../common/types";
import DataBase from "../core/db";
import { ClipboardEventEmitter, ClipboardEventEnum } from "../types";
import WindowManager from '../window/window.manager';

export const initialConfig : Config = {
    historyLength: 15,
    notifications: {
        type: 'electron',
        new: false,
        shortcut: true,
        manual: false,
        start: false
    }
}

class ConfigService{
    private config: Config

    get maxHistory(): number {
        return this.config.historyLength
    }

    get typeNotifications(): NotificationSystem | undefined{
        return this.config.notifications.type
    }

    get selectedContextNotifications(): Array<ChangeContext>{
        const configNotifications = this.config.notifications
        return Object
            .values(ChangeContext)
            .filter((key:ChangeContext)=>configNotifications[key])
    }

    constructor(private bus: ClipboardEventEmitter, private db: DataBase<Config>, private wm: WindowManager){
        this.config = this.db.read()
        this.bus.on(ClipboardEventEnum.EditConfig, this.openEdit.bind(this))
    }

    openEdit(){
        const data = this.wm.createSingleInstance("config", this.config)
        if (data){
            data.subscribe((d)=>{
                this.config = d;
                this.save()
            })
        }
    }

    save(){
        this.db.write(this.config)
        this.bus.emit(ClipboardEventEnum.ConfigChanged)
    }
}

export default ConfigService