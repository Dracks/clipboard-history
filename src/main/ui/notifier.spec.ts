import { EventEmitter } from "events";
import createMockInstance from "jest-create-mock-instance";
import ConfigService from "../config/config.service";
import { getCallback, GetRegisteredCallbackFn, setProp } from "../core/utils.test";
import { TEXT_CHANGED } from "../events";
import { ElectronNotificationSystem, NodeNotificationSystem } from "./notifications";
import NotificationSystem from './notifications/type';
import NotifierUI from './notifier';

describe('Notifier', ()=>{
    let subject : NotifierUI
    let busMock : jest.Mocked<EventEmitter>
    let configMock : jest.Mocked<ConfigService>
    let electronNotMock: jest.Mocked<NotificationSystem>
    let nodeNotMock: jest.Mocked<NotificationSystem>
    let getBusCallback: GetRegisteredCallbackFn

    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        configMock = createMockInstance(ConfigService)
        electronNotMock = createMockInstance(ElectronNotificationSystem)
        nodeNotMock = createMockInstance(NodeNotificationSystem)
        getBusCallback = getCallback(busMock.on);

        setProp(configMock, "selectedContextNotifications", ["enabled"])

        subject = new NotifierUI(busMock, configMock, {
            electron: electronNotMock,
            node: nodeNotMock
        })
    })

    it('It will create correctly', ()=>{
        expect(subject).toBeTruthy()
        expect(busMock.on).toBeCalledTimes(1)
        expect(busMock.on).toBeCalledWith(TEXT_CHANGED, expect.any(Function))
    })

    it('When us not configured, do not launch any notification', ()=>{
        let changeCallback = getBusCallback(TEXT_CHANGED)

        changeCallback({index: 0, value: "New value"}, [], "enabled")
        expect(electronNotMock.notify).toBeCalledTimes(0)
        expect(nodeNotMock.notify).toBeCalledTimes(0)
    })

    it('When configured electron, launch electron', ()=>{
        setProp(configMock,"typeNotifications","electron")
        let changeCallback = getBusCallback(TEXT_CHANGED)

        changeCallback({index: 0, value: "New value"}, [], "enabled")
        expect(electronNotMock.notify).toBeCalledTimes(1)
        expect(electronNotMock.notify).toBeCalledWith("New value")
        expect(nodeNotMock.notify).toBeCalledTimes(0)
    })

    it('When configured node, launch node', ()=>{
        setProp(configMock,"typeNotifications","node")
        let changeCallback = getBusCallback(TEXT_CHANGED)

        changeCallback({index: 0, value: "New value"}, [], "enabled")
        expect(nodeNotMock.notify).toBeCalledTimes(1)
        expect(nodeNotMock.notify).toBeCalledWith("New value")
        expect(electronNotMock.notify).toBeCalledTimes(0)
    })

    it('When configured some but not enabled context, don not launch', ()=>{
        setProp(configMock,"typeNotifications","node")
        let changeCallback = getBusCallback(TEXT_CHANGED)

        changeCallback({index: 0, value: "New value"}, [], "disabled")
        expect(electronNotMock.notify).toBeCalledTimes(0)
        expect(nodeNotMock.notify).toBeCalledTimes(0)
    })
})