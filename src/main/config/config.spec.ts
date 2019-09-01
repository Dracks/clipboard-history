import { EventEmitter } from 'events';
import createMockInstance from 'jest-create-mock-instance';
import DataBase from '../core/db';
import { CONFIG_CHANGE } from '../events';
import WindowManager from '../window/window.manager';
import ConfigService, { initialConfig } from './config.service';

describe('Config Service', ()=>{
    let subject: ConfigService
    let busMock: jest.Mocked<EventEmitter>
    let dbMock: jest.Mocked<DataBase<any>>
    let wmMock: jest.Mocked<WindowManager>

    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        dbMock = createMockInstance(DataBase)
        wmMock = createMockInstance(WindowManager)

        dbMock.read.mockReturnValue(initialConfig)

        subject = new ConfigService(busMock, dbMock, wmMock)
    })

    it('To Be Trusty', ()=>{
        expect(subject).toBeTruthy()
        expect(subject.maxHistory).toBe(15)
        expect(subject.typeNotifications).toBeTruthy()
        expect(subject.selectedContextNotifications).toEqual(["shortcut"])
    })

    it('Whe it\'s saved, it will notify everyon', ()=>{
        subject.save()
        expect(busMock.emit).toBeCalledTimes(1)
        expect(busMock.emit).toBeCalledWith(CONFIG_CHANGE)
    })

})