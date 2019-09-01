import { EventEmitter, Menu, MenuItemConstructorOptions, Tray } from "electron";
import { ChangeContext } from "../../common/types";
import { ClipboardValue, SelectedClipboard } from "../core/types";
import { EDIT_CONFIG, ON_CLEAR, ON_REMOVE_CURRENT_ITEM, ON_SELECT, TEXT_CHANGED } from '../events';
import { icon } from "../package";
import { REMOVE_ITEM_SHORTCUT } from "./shortcuts";


export default class ClipboardHistoryTray{
    private tray: Tray
    private template = []
    private contextMenu: Electron.Menu

    constructor(private bus: EventEmitter, app: Electron.App){
        this.tray = new Tray(icon)
        this.tray.setToolTip('Click to show your clipboard history')

        this.template.push({ type: 'separator' })
        this.template.push({
            label: 'settings',
            click: ()=>{
                bus.emit(EDIT_CONFIG)
            }
        })

        this.template.push({ type: 'separator' })
        this.template.push({
            label: 'Clear history',
            click: ()=>{
                bus.emit(ON_CLEAR, ChangeContext.manual)
            }
        })
        this.template.push({
            label: 'Remove current item',
            click: ()=>{
                bus.emit(ON_REMOVE_CURRENT_ITEM, ChangeContext.manual)
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
        this.bus.on(TEXT_CHANGED, this.onChanges.bind(this))
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
                this.bus.emit(ON_SELECT, index, ChangeContext.manual)
            }
        })))
    }
}