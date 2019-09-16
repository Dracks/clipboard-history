import { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { ChangeContext } from "../../common/types";
import ConfigService from "../config/config.service";
import { icon } from "../package";
import { ClipboardEventEmitter, ClipboardEventEnum, ClipboardValue, SelectedClipboard } from "../types";
import { REMOVE_ITEM_SHORTCUT } from "./shortcuts";


export default class ClipboardHistoryTray{
    private tray: Tray
    private template : Array<MenuItemConstructorOptions>= []
    private contextMenu?: Electron.Menu
    private status ={
        list: Array<ClipboardValue>(),
        current: -1
    }

    constructor(private bus: ClipboardEventEmitter, private config: ConfigService, app: Electron.App){
        this.tray = new Tray(icon)
        this.tray.setToolTip('Click to show your clipboard history')

        this.template.push({ type: 'separator' })
        this.template.push({
            label: 'settings',
            click: ()=>{
                bus.emit(ClipboardEventEnum.EditConfig)
            }
        })

        this.template.push({ type: 'separator' })
        this.template.push({
            label: 'Clear history',
            click: ()=>{
                bus.emit(ClipboardEventEnum.Clear, ChangeContext.manual)
            }
        })
        this.template.push({
            label: 'Remove current item',
            click: ()=>{
                bus.emit(ClipboardEventEnum.RemoveCurrentItem, ChangeContext.manual)
            },
            accelerator: REMOVE_ITEM_SHORTCUT
        })
        this.template.push({
            label: 'Exit',
            click: () => {
                app.exit()
            }
        })
        this.reloadContextMenu([])
        this.bus.on(ClipboardEventEnum.TextChanged, this.onChanges.bind(this))
        this.bus.on(ClipboardEventEnum.ConfigChanged, this.refresh.bind(this))
    }

    registerOpen(){
        this.tray.on('double-click', () => {
            this.tray.popUpContextMenu(this.contextMenu)
        })

        this.tray.on('click', () => {
            this.tray.popUpContextMenu(this.contextMenu)
        })
    }

    private reloadContextMenu(options: Array<MenuItemConstructorOptions>){
        this.contextMenu = Menu.buildFromTemplate([...options, ...this.template])
        this.tray.setContextMenu(this.contextMenu)
    }

    private getCurrentHistory(): MenuItemConstructorOptions[]{
        const currentIndex = this.status.current
        let list = this.status.list
        const config = this.config.tray
        if (config.trim){
            list = list.map(e=>e.trim())
        }

        return list.map(e=> e.length >config.size ? e.slice(0, config.size)+'...': e)
            .map((obj, index)=>({
            label: obj,
            checked: currentIndex === index,
            type: 'checkbox',
            click: ()=>{
                this.bus.emit(ClipboardEventEnum.Select, index, ChangeContext.manual)
            }
        }))
    }

    private onChanges(selected: SelectedClipboard, list: Array<ClipboardValue>){
        this.status = {
            list,
            current: selected.index
        }
        this.reloadContextMenu(this.getCurrentHistory())
    }

    private refresh(){
        this.reloadContextMenu(this.getCurrentHistory())
    }
}