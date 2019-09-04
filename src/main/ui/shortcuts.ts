import { ChangeContext } from '../../common/types';
import { ClipboardEventEmitter, ClipboardEventEnum, SelectedClipboard } from '../types';

export const NEXT_SHORTCUT = 'CommandOrControl+F12'
export const PREV_SHORTCUT = 'CommandOrControl+F11'
export const REMOVE_ITEM_SHORTCUT = 'CommandOrControl+F9'

export class ClipboardShortcuts {
    private currentIndex: number;
    private historyLength: number;

    constructor(private bus: ClipboardEventEmitter, private globalShortcuts: Electron.GlobalShortcut){
        this.bus.on(ClipboardEventEnum.TextChanged, this.on_selected_change.bind(this))
    }

    private on_selected_change(selected: SelectedClipboard, history: Array<any>){
        this.currentIndex = selected.index;
        this.historyLength = history.length
    }

    private next(){
        let currentIndex = this.currentIndex+1;
        if (currentIndex >= this.historyLength){
            currentIndex = 0
        }
        this.bus.emit(ClipboardEventEnum.Select, currentIndex, ChangeContext.shortcut)
    }

    private previous(){
        let currentIndex = this.currentIndex;
        if (currentIndex<=0){
            currentIndex = this.historyLength
        }
        this.bus.emit(ClipboardEventEnum.Select, currentIndex-1, ChangeContext.shortcut)
    }

    private removeCurrent(){
        this.bus.emit(ClipboardEventEnum.RemoveCurrentItem, ChangeContext.shortcut)
    }

    registerShortcuts(){
        this.globalShortcuts.register(NEXT_SHORTCUT, this.next.bind(this))
        this.globalShortcuts.register(PREV_SHORTCUT, this.previous.bind(this))
        this.globalShortcuts.register(REMOVE_ITEM_SHORTCUT, this.removeCurrent.bind(this))
    }
}

export default ClipboardShortcuts