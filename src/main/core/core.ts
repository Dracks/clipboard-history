import { EventEmitter } from "events";
import { ChangeContext } from "../../common/types";
import ConfigService from "../config/config.service";
import { ON_CLEAR, ON_REMOVE_CURRENT_ITEM, ON_SELECT, TEXT_CHANGED } from "../events";
import DataBase from "./db";
import { ClipboardValue, SelectedClipboard } from "./types";

export default class Core{
    private clipboardHistory = new Array<ClipboardValue>()
    private selected?: SelectedClipboard
    private watchId: NodeJS.Timeout;

    constructor(private bus: EventEmitter, private config: ConfigService, private clipboard: Electron.Clipboard, private db: DataBase<Array<ClipboardValue>>){
        this.clipboardHistory = db.read()
        this.bus.on(ON_SELECT, this.onSelect.bind(this))
        this.bus.on(ON_CLEAR, this.clear.bind(this))
        this.bus.on(ON_REMOVE_CURRENT_ITEM, this.removeCurrent.bind(this))
        this.checkCurrent(ChangeContext.start)
    }

    private checkMaxHistorySize(){
        const maxHistorySize = this.config.maxHistory
        while(maxHistorySize<this.clipboardHistory.length){
            this.clipboardHistory.pop()
        }
    }

    private textChanged(newText: ClipboardValue, context: ChangeContext){
        const clipboardIndex = this.clipboardHistory.indexOf(newText)
        if (clipboardIndex===-1){
            this.clipboardHistory.unshift(newText)
            this.setSelected( {
                index: 0,
                value: newText
            }, context)
            this.checkMaxHistorySize()
            this.db.write(this.clipboardHistory)
        } else {
            this.setSelected( {
                index: clipboardIndex,
                value: newText
            }, context)
        }
    }

    private setSelected(selected: SelectedClipboard, context: ChangeContext){
        this.selected = selected
        this.bus.emit(TEXT_CHANGED, this.selected, this.clipboardHistory, context)
    }

    private checkCurrent(context: ChangeContext = ChangeContext.new){
        const current = this.clipboard.readText()

        if (!this.selected || this.selected.value !== current){
            if (current){
                this.textChanged(current, context)
            } else {
                this.setSelected({
                    index: -1,
                    value: ""
                }, context)
            }
        }
    }

    private onSelect(index: number, context: ChangeContext){
        if (index<this.clipboardHistory.length){
            const value = this.clipboardHistory[index]
            this.clipboard.writeText(value as any)
            this.setSelected({
                index,
                value
            }, context)
        }
    }

    private removeCurrent(context: ChangeContext){
        let currentIndex = this.selected.index
        this.clipboardHistory.splice(currentIndex, 1)
        if (currentIndex>= this.clipboardHistory.length){
            currentIndex = 0
        }
        const value = this.clipboardHistory[currentIndex]
        this.clipboard.writeText(value)
        this.db.write(this.clipboardHistory)
        this.setSelected({
            index: currentIndex,
            value
        }, context)
    }

    private clear(context: ChangeContext){
        this.clipboardHistory = ['']
        this.onSelect(0, context)
    }

    startMonitoringClipboard(){
        this.watchId=setInterval(this.checkCurrent.bind(this), 500)
    }
}
