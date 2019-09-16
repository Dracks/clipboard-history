import { BrowserWindow, IpcMain } from "electron";
import createMockInstance from "jest-create-mock-instance";
import { Observable, Subscriber } from "rxjs";
import { EventsName, NodePlatformToEnum } from "../../common/types";
import { getCallback, GetRegisteredCallbackFn } from "../core/utils.test";
import WindowManager from "./window.manager";

describe('Window manager', ()=>{
    let subject: WindowManager;
    let ipcMock: jest.Mocked<IpcMain>
    let bwConstructor: jest.Mock
    let bwMock: jest.Mocked<BrowserWindow>
    let getWebcontentOn: GetRegisteredCallbackFn
    let getWinOn: GetRegisteredCallbackFn
    let getIpcOn: GetRegisteredCallbackFn

    beforeEach(()=>{
        ipcMock = {
            on: jest.fn()
        } as any;
        const webContentsMock = {
            on: jest.fn(),
            send: jest.fn()
        }
        bwMock ={
            loadFile: jest.fn(),
            setTitle: jest.fn(),
            // once: jest.fn(),
            on: jest.fn(),
            webContents: webContentsMock,
            show: jest.fn()
        } as any;
        bwConstructor = jest.fn()
        function temp(...args: any[]){
            bwConstructor(...args)
        }
        temp.prototype = bwMock

        subject = new WindowManager(ipcMock, temp as any)
        getWebcontentOn = getCallback(webContentsMock.on)
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

        getWebcontentOn('did-finish-load')()
        expect(bwMock.webContents.send).toBeCalledTimes(1)
        expect(bwMock.webContents.send).toBeCalledWith(EventsName.Load, {
            context: {
                platform: NodePlatformToEnum[process.platform]
            },
            page: {
                name: 'Debug',
                data: 'data to debug'
            }
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
            subject.createSingleInstance('Debug', 'Other data')
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

            getIpcOn(EventsName.Save)({}, {name: 'Debug', data: 'Some data'})
            expect(subscriberMock.next).toBeCalledTimes(1)
            expect(subscriberMock.next).toBeCalledWith('Some data')
        })
    })

    describe('Log output', ()=>{
        let oldLog: any
        let oldError: any

        beforeEach(()=>{
            oldLog = console.log
            oldError = console.error
            console.log= jest.fn()
            console.error = jest.fn()
        })

        afterEach(()=>{
            console.log = oldLog,
            console.error = oldError
        })

        it('Call correcly on log', ()=>{
            const subject = getIpcOn(EventsName.Log)
            subject({}, ["Hi", "world"])
            expect(console.log).toBeCalledTimes(1)
            expect(console.log).toBeCalledWith("Hi", "world")
        })

        it('Call correcly on error', ()=>{
            const subject = getIpcOn(EventsName.Error)
            subject({}, ["Hi", "error"])
            expect(console.error).toBeCalledTimes(1)
            expect(console.error).toBeCalledWith("Hi", "error")
        })
    })
})