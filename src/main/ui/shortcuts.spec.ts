import { EventEmitter } from "events";
import createMockInstance from "jest-create-mock-instance";
import { ShortcutsConfig } from "../../common/config";
import { ChangeContext } from "../../common/types";
import ConfigService from "../config/config.service";
import { getCallback, GetRegisteredCallbackFn, setProp } from "../core/utils.test";
import { ClipboardEventEnum, ClipboardValue, TextChangedCallback } from "../types";
import ClipboardShortcuts from "./shortcuts";

describe('Shortcuts', ()=>{
    let subject : ClipboardShortcuts
    let busMock: jest.Mocked<EventEmitter>
    let configMock: jest.Mocked<ConfigService>
    let shortcutsMock: jest.Mocked<Electron.GlobalShortcut>
    let history : Array<ClipboardValue>
    let selectedChange: TextChangedCallback
    let configChange: ()=>void
    let shortcutsConfig: ShortcutsConfig
    let getRegisterCb: GetRegisteredCallbackFn


    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        shortcutsMock = {
            register: jest.fn(),
            unregister: jest.fn()
        } as any
        configMock = createMockInstance(ConfigService)

        shortcutsConfig = {
            next: "Next shortcut",
            previous: "Previous shortcut",
            removeCurrent: "Remove current shortcut"
        }
        setProp(configMock, 'shortcuts', shortcutsConfig)

        history = Array(10).fill(null).map(k=>k)
        getRegisterCb = getCallback(shortcutsMock.register)
        subject = new ClipboardShortcuts(busMock, configMock, shortcutsMock)
        selectedChange = getCallback(busMock.on)(ClipboardEventEnum.TextChanged)
        configChange = getCallback(busMock.on)(ClipboardEventEnum.ConfigChanged)
    })

    it('Is well created', ()=>{
        expect(subject).toBeTruthy()
        expect(busMock.on).toBeCalledWith(ClipboardEventEnum.TextChanged, expect.any(Function))
        expect(busMock.on).toBeCalledWith(ClipboardEventEnum.ConfigChanged, expect.any(Function))
    })

    it('Register correctly the shortcuts', ()=>{
        const shortcuts = [shortcutsConfig.next, shortcutsConfig.previous, shortcutsConfig.removeCurrent]

        subject.registerShortcuts()

        expect(shortcutsMock.register).toBeCalledTimes(shortcuts.length)
        shortcuts.forEach(shortcut=>{
            expect(shortcutsMock.register).toBeCalledWith(shortcut, expect.any(Function))
        })
    })

    it('Unregister correctly the shortcuts', ()=>{
        const shortcuts = [shortcutsConfig.next, shortcutsConfig.previous, shortcutsConfig.removeCurrent]

        subject.unregisterShortcuts()

        expect(shortcutsMock.unregister).toBeCalledTimes(shortcuts.length)
        shortcuts.forEach(shortcut=>{
            expect(shortcutsMock.unregister).toBeCalledWith(shortcut)
        })
    })

    it('On config change, do nothing if no registered', ()=>{
        configChange()

        expect(shortcutsMock.register).toBeCalledTimes(0)
        expect(shortcutsMock.unregister).toBeCalledTimes(0)
    })

    it('On config change if registered, unregister, and register again with new ones', ()=>{
        type keysShortcut = keyof ShortcutsConfig

        const shortcutsName : keysShortcut[] = Object.keys(shortcutsConfig) as any
        const newShortcuts : ShortcutsConfig = {
            next: "New next",
            previous: "New previous",
            removeCurrent: "New remove"
        }
        setProp(configMock, "shortcuts", newShortcuts)
        subject.registerShortcuts()
        shortcutsMock.register.mockReset()

        configChange()

        expect(shortcutsMock.unregister).toBeCalledTimes(shortcutsName.length)
        shortcutsName.forEach(shortcut=>{
            expect(shortcutsMock.unregister).toBeCalledWith(shortcutsConfig[shortcut])
        })

        expect(shortcutsMock.register).toBeCalledTimes(shortcutsName.length)
        shortcutsName.forEach(shortcut=>{
            expect(shortcutsMock.register).toBeCalledWith(newShortcuts[shortcut], expect.any(Function))
        })
    })


    describe("Check shortcuts", ()=>{
        let nextFn: Function
        let prevFn: Function
        let removeCurrentFn: Function
        beforeEach(()=>{
            subject.registerShortcuts()

            nextFn = getRegisterCb(shortcutsConfig.next)
            prevFn = getRegisterCb(shortcutsConfig.previous)
            removeCurrentFn = getRegisterCb(shortcutsConfig.removeCurrent)
        })

        it('When call next, go to the next item', ()=>{
            selectedChange({
                index:1,
                value: "1"
            }, history, "" as any)

            nextFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ClipboardEventEnum.Select, 2, ChangeContext.shortcut)
        })

        it('When call next and is in the last, go to the first item', ()=>{
            selectedChange({
                index:history.length-1,
                value: "1"
            }, history, "" as any)

            nextFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ClipboardEventEnum.Select, 0, ChangeContext.shortcut)
        })

        it('When call previous, go to the previous item', ()=>{
            selectedChange({
                index:1,
                value: "1"
            }, history, "" as any)

            prevFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ClipboardEventEnum.Select, 0, ChangeContext.shortcut)
        })

        it('When call previous and is in the first, go to the last item', ()=>{
            selectedChange({
                index:0,
                value: "1"
            }, history, "" as any)

            prevFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ClipboardEventEnum.Select, history.length-1, ChangeContext.shortcut)
        })

        it('When call remove current element', ()=>{
            removeCurrentFn()
            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ClipboardEventEnum.RemoveCurrentItem, ChangeContext.shortcut)
        })
    })
})