import { Notification } from "electron";
import { name } from '../../package';
import NotificationSystem from "./type";


class ElectronNotificationSystem implements NotificationSystem {
    private last: Notification | null = null;
    constructor(){}

    notify(current: string) {
        if (this.last){
            this.last.close()
        }
        this.last = new Notification({
            title: name,
            body: current,
            silent: true,
        })
        this.last.show()
    }
}

export default ElectronNotificationSystem
