import { ShortcutsConfig } from '../../common/config';
import { ChangeContext } from '../../common/types';
import ConfigService from '../config/config.service';
import { ClipboardEventEmitter, ClipboardEventEnum, SelectedClipboard } from '../types';

export const NEXT_SHORTCUT = 'CommandOrControl+F12'
export const PREV_SHORTCUT = 'CommandOrControl+F11'
export const REMOVE_ITEM_SHORTCUT = 'CommandOrControl+F9'

export class ClipboardShortcuts {
    private currentIndex: number = -1;
    private historyLength: number = 0;
    private isRegistered: boolean = false;
    private shortcutsConfig: ShortcutsConfig

    constructor(private bus: ClipboardEventEmitter, private config: ConfigService, private globalShortcuts: Electron.GlobalShortcut){
        this.shortcutsConfig = config.shortcuts
        this.bus.on(ClipboardEventEnum.TextChanged, this.onSelectedChange.bind(this))
        this.bus.on(ClipboardEventEnum.ConfigChanged, this.onChangeConfig.bind(this))

        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
        this.removeCurrent = this.removeCurrent.bind(this)
    }

    private onSelectedChange(selected: SelectedClipboard, history: Array<any>){
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

    private onChangeConfig(){
        if (this.isRegistered){
            this.unregisterShortcuts()
            this.shortcutsConfig = this.config.shortcuts
            this.registerShortcuts()
        } else {
            this.shortcutsConfig = this.config.shortcuts
        }
    }

    registerShortcuts(){
        this.globalShortcuts.register(this.shortcutsConfig.next, this.next)
        this.globalShortcuts.register(this.shortcutsConfig.previous, this.previous)
        this.globalShortcuts.register(this.shortcutsConfig.removeCurrent, this.removeCurrent)
        this.isRegistered = true;
    }

    unregisterShortcuts(){
        this.isRegistered = false
        this.globalShortcuts.unregister(this.shortcutsConfig.next)
        this.globalShortcuts.unregister(this.shortcutsConfig.previous)
        this.globalShortcuts.unregister(this.shortcutsConfig.removeCurrent)
    }
}

export default ClipboardShortcuts