import { EventEmitter } from "events";
import createMockInstance from "jest-create-mock-instance";
import { ChangeContext } from "../../common/types";
import { getCallback, GetRegisteredCallbackFn } from "../core/utils.test";
import { ClipboardEventEnum, ClipboardValue, TextChangedCallback } from "../types";
import ClipboardShortcuts, { NEXT_SHORTCUT, PREV_SHORTCUT, REMOVE_ITEM_SHORTCUT } from "./shortcuts";

const ON_REMOVE_CURRENT_ITEM = ClipboardEventEnum.RemoveCurrentItem
const ON_SELECT = ClipboardEventEnum.Select
const TEXT_CHANGED = ClipboardEventEnum.TextChanged

describe('Shortcuts', ()=>{
    let subject : ClipboardShortcuts
    let busMock: jest.Mocked<EventEmitter>
    let shortcutsMock: jest.Mocked<Electron.GlobalShortcut>
    let history : Array<ClipboardValue>
    let selectedChange: TextChangedCallback
    let getRegisterCb: GetRegisteredCallbackFn

    beforeEach(()=>{
        busMock = createMockInstance(EventEmitter)
        shortcutsMock = {
            register: jest.fn()
        } as any
        history = Array(10).fill(null).map(k=>k)
        getRegisterCb = getCallback(shortcutsMock.register)
        subject = new ClipboardShortcuts(busMock, shortcutsMock)
        selectedChange = getCallback(busMock.on)(TEXT_CHANGED)
    })

    it('Is well created', ()=>{
        expect(subject).toBeTruthy()
        expect(busMock.on).toBeCalledWith(TEXT_CHANGED, expect.any(Function))
    })

    it('Register correctly the shortcuts', ()=>{
        const shortcuts = [NEXT_SHORTCUT, PREV_SHORTCUT, REMOVE_ITEM_SHORTCUT]

        subject.registerShortcuts()

        expect(shortcutsMock.register).toBeCalledTimes(shortcuts.length)
        shortcuts.forEach(shortcut=>{
            expect(shortcutsMock.register).toBeCalledWith(shortcut, expect.any(Function))
        })
    })

    describe("Check shortcuts", ()=>{
        let nextFn: Function
        let prevFn: Function
        let removeCurrentFn: Function
        beforeEach(()=>{
            subject.registerShortcuts()

            nextFn = getRegisterCb(NEXT_SHORTCUT)
            prevFn = getRegisterCb(PREV_SHORTCUT)
            removeCurrentFn = getRegisterCb(REMOVE_ITEM_SHORTCUT)
        })

        it('When call next, go to the next item', ()=>{
            selectedChange({
                index:1,
                value: "1"
            }, history, "" as any)

            nextFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ON_SELECT, 2, ChangeContext.shortcut)
        })

        it('When call next and is in the last, go to the first item', ()=>{
            selectedChange({
                index:history.length-1,
                value: "1"
            }, history, "" as any)

            nextFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ON_SELECT, 0, ChangeContext.shortcut)
        })

        it('When call previous, go to the previous item', ()=>{
            selectedChange({
                index:1,
                value: "1"
            }, history, "" as any)

            prevFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ON_SELECT, 0, ChangeContext.shortcut)
        })

        it('When call previous and is in the first, go to the last item', ()=>{
            selectedChange({
                index:0,
                value: "1"
            }, history, "" as any)

            prevFn()

            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ON_SELECT, history.length-1, ChangeContext.shortcut)
        })

        it('When call remove current element', ()=>{
            removeCurrentFn()
            expect(busMock.emit).toBeCalledTimes(1)
            expect(busMock.emit).toBeCalledWith(ON_REMOVE_CURRENT_ITEM, ChangeContext.shortcut)
        })
    })
})