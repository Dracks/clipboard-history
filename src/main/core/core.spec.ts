
import { EventEmitter } from 'events';
import createMockInstance from 'jest-create-mock-instance';
import { ChangeContext } from '../../common/types';
import ConfigService from '../config/config.service';
import { ON_CLEAR, ON_REMOVE_CURRENT_ITEM, ON_SELECT, TEXT_CHANGED } from '../events';
import Core from './core';
import DataBase from './db';
import { getCallback, GetRegisteredCallbackFn } from './utils.test';

describe('core', ()=>{
    let subject: Core
    let busMock: jest.Mocked<EventEmitter>
    let configService: jest.Mocked<ConfigService>
    let clipboardMock: jest.Mocked<Electron.Clipboard>
    let dbMock: jest.Mocked<DataBase<any>>
    let bigHistory : Array<String>
    let getBusCallback: GetRegisteredCallbackFn
    const contextMock = "something"

    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        clipboardMock = {
            readText: jest.fn().mockReturnValue('3'),
            clear: jest.fn(),
            writeText: jest.fn()
        } as any
        configService = createMockInstance(ConfigService)
        dbMock = createMockInstance(DataBase)
        bigHistory = Array(20).fill(null).map((_, index)=>""+index)

        getBusCallback = getCallback(busMock.on)

        dbMock.read.mockReturnValue([...bigHistory])

        subject = new Core(busMock, configService, clipboardMock, dbMock)
    })

    it('Initialize correctly',()=>{
        expect(subject).toBeTruthy()
        expect(busMock.on).toBeCalledTimes(3)
        expect(busMock.on).toBeCalledWith(ON_SELECT, expect.any(Function))
        expect(busMock.on).toBeCalledWith(ON_CLEAR, expect.any(Function))
        expect(busMock.on).toBeCalledWith(ON_REMOVE_CURRENT_ITEM, expect.any(Function))
        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 3, value:"3"}, bigHistory, ChangeContext.start)
    })

    it('Initialize correctly with diferent value', ()=>{
        (configService as any).maxHistory = 13
        jest.resetAllMocks()
        clipboardMock.readText.mockReturnValueOnce("Hi world!")

        subject = new Core(busMock, configService, clipboardMock, dbMock)

        expect(subject).toBeTruthy()
        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 0, value: 'Hi world!'}, ['Hi world!', ...bigHistory.slice(0,12)], ChangeContext.start)

    })

    it('Selecting a value, it will change it and emit it', ()=>{
        const onSelectCallback = getBusCallback(ON_SELECT)
        onSelectCallback(4, contextMock)

        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 4, value:'4'}, bigHistory, contextMock)
    })

    it('Clear history requested, it will clear completly', ()=>{
        const onClearCallback = getBusCallback(ON_CLEAR)
        onClearCallback(contextMock)

        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 0, value:''}, [''], contextMock)
    })

    it('Remove current element event, It will be remove and selected the next one', ()=>{
        const onRemoveItemCallback = getBusCallback(ON_REMOVE_CURRENT_ITEM)
        onRemoveItemCallback(contextMock)
        bigHistory.splice(3,1)

        expect(clipboardMock.writeText).toBeCalledWith('4')
        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 3, value:'4'}, bigHistory, contextMock)
        expect(dbMock.write).toBeCalledWith(bigHistory)
    })

    it('Remove current element event when selected the last, It will be remove and selected the first one', ()=>{
        const lastHistoryIndex = bigHistory.length-1

        getBusCallback(ON_SELECT)(lastHistoryIndex)

        const onRemoveItemCallback = getBusCallback(ON_REMOVE_CURRENT_ITEM)
        onRemoveItemCallback(contextMock)
        bigHistory.splice(lastHistoryIndex,1)

        expect(clipboardMock.writeText).toBeCalledWith('0')
        expect(busMock.emit).toBeCalledWith(TEXT_CHANGED, {index: 0, value:'0'}, bigHistory, contextMock)
    })
})