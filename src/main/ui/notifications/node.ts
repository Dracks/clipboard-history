import * as NotifySend from 'node-notifier/notifiers/notifysend';
import { icon, name } from '../../package';
import NotificationSystem from "./type";

class NodeNotificationSystem implements NotificationSystem{
    constructor(private notifier: {notify: (n?: NotifySend.Notification)=>void}) {}
    notify(current: string) {
        // console.log(this.notifier)
        this.notifier.notify({
            icon,
            title: name,
            message: current
        })
    }
}

export default NodeNotificationSystem