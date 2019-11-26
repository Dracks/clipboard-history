import { Notification } from "electron";
import { ElectronNotificationSystem } from ".";
import { name } from "../../package";

describe('ElectronNotificationSystem', ()=>{
    let subject : ElectronNotificationSystem
    let notConstructor: jest.Mock
    let notMock: jest.Mocked<Notification>

    beforeEach(()=>{

        notMock = {
            show: jest.fn(),
            close: jest.fn()
        } as any
        notConstructor = jest.fn()

        function temp(...args: any[]){
            notConstructor(...args)
        }
        temp.prototype = notMock

        subject = new ElectronNotificationSystem(temp as any)
    })


    it('Create a notification and show it', ()=>{
        subject.notify('Ping pong pollo')

        expect(notConstructor).toBeCalledTimes(1)
        expect(notConstructor).toBeCalledWith({
            title: name,
            body: 'Ping pong pollo',
            silent: true
        })
        expect(notMock.show).toBeCalledTimes(1)
    })

    it('Close the previous notification', ()=>{
        subject.notify('Ping pong pollo')
        subject.notify('Ping pong pollo2')

        expect(notConstructor).toBeCalledTimes(2)
        expect(notConstructor).toBeCalledWith({
            title: name,
            body: 'Ping pong pollo2',
            silent: true
        })
        expect(notMock.close).toBeCalledTimes(1)
        expect(notMock.show).toBeCalledTimes(2)
    })
})