


export type ClipboardValue = string

export interface SelectedClipboard {
    index: number
    value: ClipboardValue
}

export type TextChangedCallback = (s:SelectedClipboard, h: Array<ClipboardValue>)=>void
