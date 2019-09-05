import { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { ChangeContext } from "../../common/types";
import { icon } from "../package";
import { ClipboardEventEmitter, ClipboardEventEnum, ClipboardValue, SelectedClipboard } from "../types";
import { REMOVE_ITEM_SHORTCUT } from "./shortcuts";


export default class ClipboardHistoryTray{
    private tray: Tray
    private template : Array<MenuItemConstructorOptions>= []
    private contextMenu?: Electron.Menu

    constructor(private bus: ClipboardEventEmitter, app: Electron.App){
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

    private onChanges(selected: SelectedClipboard, list: Array<ClipboardValue>){
        this.reloadContextMenu(list.map((obj, index)=>({
            label: obj.length >10 ? obj.slice(0, 20)+'...': obj,
            checked: selected.index === index,
            type: 'checkbox',
            click: ()=>{
                this.bus.emit(ClipboardEventEnum.Select, index, ChangeContext.manual)
            }
        })))
    }
}