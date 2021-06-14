import { FlexLayout, FocusReason,QMainWindow, QWidget } from "@nodegui/nodegui";
import { Config } from "../common/config";
import buttonWx from "./widgets/atoms/button.widget";
import checkboxWx from "./widgets/atoms/checkbox.widget";
import labelWx from "./widgets/atoms/label.widget";
import { group, hbox, inputText, shortcut } from "./widgets/molecules";


const ConfigWindow = (data: Config, save: (data:Config)=>void)=>{
    const newData = {...data}
    const rootView = new QWidget()
    const layout = new FlexLayout()
    rootView.setLayout(layout)
    rootView.setObjectName("rootView");

    const historyLength = inputText("History length", `${data.historyLength}`, (v)=>newData.historyLength=parseInt(v))
    layout.addWidget(group("General", [
        historyLength,
        labelWx('The shortcut to select next value'),
        shortcut(data.shortcuts.next, (newShortcut)=>newData.shortcuts.next=newShortcut, ()=>undefined),
        labelWx('The shortcut to select previous value'),
        shortcut(data.shortcuts.previous, (newShortcut)=>newData.shortcuts.previous=newShortcut, ()=>undefined),
        labelWx('The shortcut to remove the current value from the history and move to next'),
        shortcut(data.shortcuts.removeCurrent, (newShortcut)=>newData.shortcuts.removeCurrent=newShortcut, ()=>undefined),
    ]))

    layout.addWidget(group("Tray", [
        inputText("Length show in tray", `${data.tray.size}`, (newValue)=>newData.tray.size=parseInt(newValue)),
        checkboxWx('Trim clipboard values', data.tray.trim, (isChecked)=>data.tray.trim=isChecked)
    ]))

    layout.addWidget(group("Notifications", [
        checkboxWx('When the clipboard changed', data.notifications.manual, (isChecked)=>data.notifications.manual=isChecked),
        checkboxWx('When the change is provoqued by a shortcut', data.notifications.new, (isChecked)=>data.notifications.new=isChecked),
        checkboxWx('When some clipboard is selected from the tray', data.notifications.shortcut, (isChecked)=>data.notifications.shortcut=isChecked),
        checkboxWx('When the application starts', data.notifications.start, (isChecked)=>data.notifications.start=isChecked),
    ]))

    const win = new QMainWindow()

    layout.addWidget(hbox([
        buttonWx('save', ()=>save(newData)),
        buttonWx('save & close', ()=>{
            save(newData)
            win.close()
        })
    ]))
     
     win.setCentralWidget(rootView)
     win.setObjectName('Config')
     win.setMinimumSize(600, 520)
     win.show()
     win.setFocus(FocusReason.ActiveWindowFocusReason)

     return win;
 }

 export default ConfigWindow