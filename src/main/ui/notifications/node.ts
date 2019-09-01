import * as NodeNotifier from 'node-notifier';
import { icon, name } from '../../package';
import NotificationSystem from "./type";

class NodeNotificationSystem implements NotificationSystem{
    constructor(private notifier: NodeNotifier.NodeNotifier) {}
    notify(current: string) {
        this.notifier.notify({
            icon,
            title: name,
            message: current
        })
    }
}

export default NodeNotificationSystem