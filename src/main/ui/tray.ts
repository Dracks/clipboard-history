import { QAction, QApplication, QIcon, QMenu, QSystemTrayIcon } from "@nodegui/nodegui";
// import { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { ChangeContext } from "../../common/types";
import ConfigService from "../config/config.service";
import { icon } from "../package";
import { ClipboardEventEmitter, ClipboardEventEnum, ClipboardValue, SelectCallback, SelectedClipboard } from "../types";
// import { REMOVE_ITEM_SHORTCUT } from "./shortcuts";

interface MenuAction {
    label: string,
    click: SelectCallback
    type?: string
}

interface MenuCheckbox {
    label: string
    type: 'checkbox'
    click: SelectCallback
    checked: boolean
}

interface MenuSeparator {
    type: 'separator'
}

export type MenuItemConstructorOptions = MenuAction | MenuSeparator | MenuCheckbox

export default class ClipboardHistoryTray{
    private tray: QSystemTrayIcon
    private template : Array<MenuItemConstructorOptions>= []
    private contextMenu?: QMenu
    private status ={
        list: Array<ClipboardValue>(),
        current: -1
    }

    constructor(private bus: ClipboardEventEmitter, private config: ConfigService, app: QApplication){
        this.tray = new QSystemTrayIcon()
        this.tray.setIcon(new QIcon("icons/1024x1024.png"))
        this.tray.setToolTip('Click to show your clipboard history')
        this.tray.show()

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
        })
        this.template.push({
            label: 'Exit',
            click: () => {
                app.exit(0)
            }
        })
        this.reloadContextMenu([])
        this.bus.on(ClipboardEventEnum.TextChanged, this.onChanges.bind(this))
        this.bus.on(ClipboardEventEnum.ConfigChanged, this.refresh.bind(this))
    }

    private reloadContextMenu(options: Array<MenuItemConstructorOptions>){
        this.contextMenu = new QMenu();
        [...this.getCurrentHistory(), ...this.template].forEach(data=>{
            if (data.type==='separator'){
                this.contextMenu?.addSeparator()
            } else if (data.type==='checkbox') {
                const action = data as MenuCheckbox
                const qaction = new QAction()
                qaction.setCheckable(true)
                qaction.setChecked(action.checked)
                qaction.setText(action.label)
                qaction.addEventListener('triggered', action.click as any)
                this.contextMenu?.addAction(qaction)
            } else {
                const action = data as MenuAction
                const qaction = new QAction()
                qaction.setText(action.label)
                qaction.addEventListener('triggered', action.click as any)
                this.contextMenu?.addAction(qaction)
            }
        })
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