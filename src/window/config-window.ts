import { FlexLayout, FocusReason,QMainWindow, QWidget } from "@nodegui/nodegui";
import { Config } from "../common/config";
import checkboxWx from "./widgets/atoms/checkbox.widget";
import labelWx from "./widgets/atoms/label.widget";
import group from "./widgets/group.widget";
import InputText from "./widgets/input-text.widget";
import shortcutWx from "./widgets/shortcut.widget";

const ConfigWindow = (data: Config)=>{
    const newData = {...data}
    const rootView = new QWidget()
    const layout = new FlexLayout()
    rootView.setLayout(layout)
    rootView.setObjectName("rootView");

    const historyLength = InputText("History length", `${data.historyLength}`, (v)=>newData.historyLength=parseInt(v))
    layout.addWidget(group("General", [
        historyLength,
        labelWx('The shortcut to select next value'),
        shortcutWx(data.shortcuts.next, (newShortcut)=>newData.shortcuts.next=newShortcut, ()=>undefined),
        labelWx('The shortcut to select previous value'),
        shortcutWx(data.shortcuts.previous, (newShortcut)=>newData.shortcuts.previous=newShortcut, ()=>undefined),
        labelWx('The shortcut to remove the current value from the history and move to next'),
        shortcutWx(data.shortcuts.removeCurrent, (newShortcut)=>newData.shortcuts.removeCurrent=newShortcut, ()=>undefined),
    ]))

    layout.addWidget(group("Tray", [
        InputText("Length show in tray", `${data.tray.size}`, (newValue)=>newData.tray.size=parseInt(newValue)),
        checkboxWx('Trim clipboard values', data.tray.trim, (isChecked)=>data.tray.trim=isChecked)
    ]))

    layout.addWidget(group("Notifications", [
        checkboxWx('When the clipboard changed', data.notifications.manual, (isChecked)=>data.notifications.manual=isChecked),
        checkboxWx('When the clipboard changed', data.notifications.new, (isChecked)=>data.notifications.new=isChecked),
        checkboxWx('When the clipboard changed', data.notifications.shortcut, (isChecked)=>data.notifications.shortcut=isChecked),
        checkboxWx('When the clipboard changed', data.notifications.start, (isChecked)=>data.notifications.start=isChecked),
    ]))
     
     const win = new QMainWindow()
     win.setCentralWidget(rootView)
     win.setObjectName('Config')
     win.setMinimumSize(600, 520)
     win.show()
     win.setFocus(FocusReason.ActiveWindowFocusReason)

     return win;
 }

 export default ConfigWindow