import * as NodeNotifier from 'node-notifier';
import NodeNotificationSystem from "./node";


describe('NodeNotificationSystem', ()=>{
    let subject : NodeNotificationSystem
    let notificationMock: jest.Mocked<NodeNotifier.NodeNotifier>

    beforeEach(()=>{
        notificationMock = {
            notify: jest.fn()
        } as any
        subject = new NodeNotificationSystem(notificationMock)
    })

    it('Call notifications', ()=>{
        subject.notify("Ping pom pollo!")

        expect(notificationMock.notify).toBeCalledTimes(1)
    })
})