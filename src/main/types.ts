import { EventEmitter } from "events";
import { ChangeContext } from "../common/types";



export type ClipboardValue = string

export interface SelectedClipboard {
    index: number
    value: ClipboardValue
}

export type ClearCallback = (c: ChangeContext)=>void
export type ConfigChanged = ()=>void
export type EditConfig = ()=>void
export type TextChangedCallback = (s:SelectedClipboard, h: Array<ClipboardValue>, c: ChangeContext)=>void
export type RemoveCallback = (c: ChangeContext)=>void
export type SelectCallback = (i: number, c: ChangeContext)=>void


export enum ClipboardEventEnum {
    Clear = 'clear_history',
    ConfigChanged = 'config_change',
    EditConfig = 'edit_config',
    TextChanged = 'text_changed',
    Select = 'select',
    RemoveCurrentItem = 'remove_current_item',
}

export interface ClipboardEventEmitter extends EventEmitter{
    emit(ev: ClipboardEventEnum.Clear, c: ChangeContext):boolean
    on(ev: ClipboardEventEnum.Clear, cb: ClearCallback)

    emit(ev: ClipboardEventEnum.ConfigChanged):boolean
    on(ev: ClipboardEventEnum.ConfigChanged, cb: ConfigChanged)

    emit(ev: ClipboardEventEnum.EditConfig):boolean
    on(ev: ClipboardEventEnum.EditConfig, cb: EditConfig)

    emit(ev: ClipboardEventEnum.TextChanged, s: SelectedClipboard, h: Array<ClipboardValue>, c: ChangeContext):boolean
    on(ev: ClipboardEventEnum.TextChanged, cb:TextChangedCallback)

    emit(ev: ClipboardEventEnum.Select, i: number, c: ChangeContext):boolean
    on(ev: ClipboardEventEnum.Select, cb: SelectCallback)

    emit(ev: ClipboardEventEnum.RemoveCurrentItem, c: ChangeContext):boolean
    on(ev: ClipboardEventEnum.RemoveCurrentItem, cb: RemoveCallback)

}