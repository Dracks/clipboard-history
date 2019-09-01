import { EventEmitter } from "events";
import { Config, NotificationSystem } from "../../common/config";
import { ChangeContext } from "../../common/types";
import DataBase from "../core/db";
import { CONFIG_CHANGE, EDIT_CONFIG } from "../events";
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

    get typeNotifications(): NotificationSystem{
        return this.config.notifications.type
    }

    get selectedContextNotifications(): Array<ChangeContext>{
        const configNotifications = this.config.notifications
        return Object
            .values(ChangeContext)
            .filter(key=>configNotifications[key])
    }

    constructor(private bus: EventEmitter, private db: DataBase<Config>, private wm: WindowManager){
        this.config = this.db.read()
        this.bus.on(EDIT_CONFIG, this.openEdit.bind(this))
    }

    openEdit(){
        const data = this.wm.createSingleInstance("config", this.config)
        data.subscribe((d)=>{
            this.config = d;
            this.save()
        })
    }

    save(){
        this.db.write(this.config)
        this.bus.emit(CONFIG_CHANGE)
    }
}

export default ConfigService