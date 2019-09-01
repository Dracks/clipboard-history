import { BrowserWindow, IpcMain } from "electron";
import createMockInstance from "jest-create-mock-instance";
import { Observable, Subscriber } from "rxjs";
import { EventsName } from "../../common/types";
import { getCallback, GetRegisteredCallbackFn } from "../core/utils.test";
import WindowManager from "./window.manager";
//console.log(BrowserWindow);
/*
class BrowserWindowMock<T extends {}> {
    static constMock: jest.Mock
    static mocks: jest.Mocked<any>

    constructor(...args){
        BrowserWindowMock.constMock(...args);
    }
}
*/

describe('Window manager', ()=>{
    let subject: WindowManager;
    let ipcMock: jest.Mocked<IpcMain>
    let bwConstructor: jest.Mock
    let bwMock: jest.Mocked<BrowserWindow>
    let getWinOnce: GetRegisteredCallbackFn
    let getWinOn: GetRegisteredCallbackFn
    let getIpcOn: GetRegisteredCallbackFn

    beforeEach(()=>{
        ipcMock = {
            on: jest.fn()
        } as any;
        bwMock ={
            loadFile: jest.fn(),
            setTitle: jest.fn(),
            once: jest.fn(),
            on: jest.fn(),
            webContents: {
                send: jest.fn()
            },
            show: jest.fn()
        } as any;
        bwConstructor = jest.fn()
        function temp(...args){
            bwConstructor(...args)
        }
        temp.prototype = bwMock

        subject = new WindowManager(ipcMock, temp as any)
        getWinOnce = getCallback(bwMock.once)
        getWinOn = getCallback(bwMock.on)
        getIpcOn = getCallback(ipcMock.on)

    })

    it('Create correctly', ()=>{
        expect(subject).toBeTruthy()
        expect(ipcMock.on).toBeCalledWith(EventsName.Save, expect.any(Function))
    })

    it('Create some window', ()=>{
        // bwSpied.mockImplementation(()=>'value')
        subject.create('Debug', 'data to debug')
        expect(bwConstructor).toBeCalledTimes(1)
        expect(bwMock.loadFile).toBeCalledTimes(1)
        expect(bwMock.loadFile).toBeCalledWith('dist/ui/index.html')
        expect(bwMock.setTitle).toBeCalledWith('Debug')


        getWinOnce('ready-to-show')()
        expect(bwMock.webContents.send).toBeCalledTimes(1)
        expect(bwMock.webContents.send).toBeCalledWith(EventsName.Load, {
            page: 'Debug',
            data: 'data to debug'
        })
        expect(bwMock.show).toBeCalledTimes(1)
    })

    describe('createSingleWindow', ()=>{
        let createSpied: jest.SpyInstance
        let subscriberMock: jest.Mocked<Subscriber<any>>
        let oldCreate: any
        let observerCreateMock: jest.Mock

        beforeEach(()=>{
            createSpied = jest.spyOn(subject, 'create').mockReturnValue(bwMock)
            oldCreate = Observable.create
            subscriberMock = createMockInstance(Subscriber)
            observerCreateMock = jest.fn().mockImplementation(oldCreate as any)
            Observable.create = observerCreateMock
        })

        afterEach(()=>{
            createSpied.mockRestore()
        })

        it('Create Single Window', ()=>{
            subject.createSingleInstance('Debug', 'Other data');
            expect(observerCreateMock).toBeCalledTimes(1)
            observerCreateMock.mock.calls[0][0](subscriberMock)

            expect(subject.createSingleInstance('Debug', 'Other data')).toBeNull();

            expect(createSpied).toBeCalledTimes(1)
            expect(createSpied).toBeCalledWith('Debug', 'Other data')

            getWinOn('closed')()

            expect(subscriberMock.complete).toBeCalledTimes(1)

            Observable.create = oldCreate

            subject.createSingleInstance('Debug', 'more times')
            expect(createSpied).toBeCalledTimes(2)
        })

        it('Calling on save', ()=>{
            subject.createSingleInstance('Debug', 'Other data');
            expect(observerCreateMock).toBeCalledTimes(1)
            observerCreateMock.mock.calls[0][0](subscriberMock)

            getIpcOn(EventsName.Save)({}, {page: 'Debug', data: 'Some data'})
            expect(subscriberMock.next).toBeCalledTimes(1)
            expect(subscriberMock.next).toBeCalledWith('Some data')
        })
    })
})