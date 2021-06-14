import { FlexLayout, QIcon, QLabel, QPushButton, QWidget } from "@nodegui/nodegui"
import { getUniqueId } from "./unique-id"

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

    const setButton = new QPushButton()
    setButton.setObjectName(`set-${uuid}`)

    setButton.setText('🔄 ')
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