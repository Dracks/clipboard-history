import { FlexLayout, QLabel, QPushButton, QWidget } from "@nodegui/nodegui"
import buttonWx from "../atoms/button.widget"
import { getUniqueId } from "../unique-id"

const shortcutWx = (initial: string, onSelected: (value: string)=>void, reset: ()=>void)=>{
    const uuid = getUniqueId()
    const rootView = new QWidget()
    const layout = new FlexLayout()
    rootView.setObjectName(`layout-${uuid}`)
    rootView.setLayout(layout)

    const labelWx = new QLabel()
    labelWx.setObjectName(`shortcut-${uuid}`)
    labelWx.setText(initial)
    layout.addWidget(labelWx)

    const setButton = buttonWx('🔄 ', reset, {objectName: `set-${uuid}`})
    layout.addWidget(setButton)

    rootView.setStyleSheet(`
        #layout-${uuid}{
            flex-direction: row;
        }

        #shortcut-${uuid}{
            flex: 1;
        }
    `)

    return rootView
}

export default shortcutWx