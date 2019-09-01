import { EventEmitter } from 'events';
import createMockInstance from 'jest-create-mock-instance';
import { Observable, Subscriber } from 'rxjs';
import { Config } from '../../common/config';
import DataBase from '../core/db';
import { getCallback, GetRegisteredCallbackFn } from '../core/utils.test';
import { CONFIG_CHANGE, EDIT_CONFIG } from '../events';
import WindowManager from '../window/window.manager';
import ConfigService, { initialConfig } from './config.service';

describe('Config Service', ()=>{
    let subject: ConfigService
    let busMock: jest.Mocked<EventEmitter>
    let dbMock: jest.Mocked<DataBase<any>>
    let wmMock: jest.Mocked<WindowManager>
    let getBusCallback: GetRegisteredCallbackFn

    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        dbMock = createMockInstance(DataBase)
        wmMock = createMockInstance(WindowManager)

        dbMock.read.mockReturnValue(initialConfig)

        subject = new ConfigService(busMock, dbMock, wmMock)

        getBusCallback = getCallback(busMock.on)
    })

    it('To Be Trusty', ()=>{
        expect(subject).toBeTruthy()
        expect(subject.maxHistory).toBe(15)
        expect(subject.typeNotifications).toBeTruthy()
        expect(subject.selectedContextNotifications).toEqual(["shortcut"])
        expect(busMock.on).toBeCalledWith(EDIT_CONFIG, expect.any(Function))
    })

    it('When edit, opens a window & save the data', ()=>{
        let subscription: Subscriber<Config>
        const obs = Observable.create((s: Subscriber<Config>)=>{
            subscription = s
        })

        wmMock.createSingleInstance.mockReturnValue(obs)
        getBusCallback(EDIT_CONFIG)()
        expect(wmMock.createSingleInstance).toBeCalledTimes(1)
        expect(wmMock.createSingleInstance).toBeCalledWith("config", initialConfig)

        const updateData = {
            historyLength: 5,
            notifications: {
                type: null,
                manual: true,
                shortcut:false,
                new: true,
                start: true
            }
        }

        subscription.next(updateData)
        expect(busMock.emit).toBeCalledTimes(1)
        expect(busMock.emit).toBeCalledWith(CONFIG_CHANGE)
        expect(dbMock.write).toBeCalledTimes(1)
        expect(dbMock.write).toBeCalledWith(updateData)
        expect(subject.maxHistory).toBe(5)
        expect(subject.selectedContextNotifications).toEqual(["new", "manual", "start"])
    })

})