import { Notification, NotificationConstructorOptions } from "electron";
import { ConstructorClass } from "../../../common/utils";
import { name } from '../../package';
import NotificationSystem from "./type";


class ElectronNotificationSystem implements NotificationSystem {
    private last: Notification | null = null;
    constructor(private NotCreator: ConstructorClass<NotificationConstructorOptions, Notification>){}

    notify(current: string) {
        if (this.last){
            this.last.close()
        }
        this.last = new this.NotCreator({
            title: name,
            body: current,
            silent: true,
        })
        this.last.show()
    }
}

export default ElectronNotificationSystem
