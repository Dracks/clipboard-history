import { QMainWindow } from "@nodegui/nodegui"
import { Config } from "../../common/config"
import ConfigWindow from "../../window/config-window"

type subscription<T>= {subscribe: (cb:(d:T)=>void)=>void}


class WindowManager {
    private configWindow?: QMainWindow

    createConfigWindow(data: Config): subscription<Config> {
        this.configWindow = ConfigWindow(data)
        return {
            subscribe: (cb: (d:Config)=>void)=>undefined
        }
    }
}

export default WindowManager