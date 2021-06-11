import { Config, NotificationSystem, ShortcutsConfig, TrayConfig } from "../../common/config";
import { ChangeContext } from "../../common/types";
import DataBase from "../core/db";
import { ClipboardEventEmitter, ClipboardEventEnum } from "../types";
import WindowManager from "../ui/window-manager";


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

    get shortcuts(): ShortcutsConfig{
        return this.config.shortcuts
    }

    get tray(): TrayConfig{
        return this.config.tray
    }

    constructor(private bus: ClipboardEventEmitter, private db: DataBase<Config>, private wm: WindowManager){
        this.config = this.db.read()
        this.bus.on(ClipboardEventEnum.EditConfig, this.openEdit.bind(this))
    }

    openEdit(){
        const data = this.wm.createConfigWindow( this.config)
        if (data){
            data.subscribe((d: Config)=>{
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