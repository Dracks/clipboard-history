import { FlexLayout, NodeWidget, QWidget } from "@nodegui/nodegui"
import { getUniqueId } from "../unique-id"


const hbox = (children: NodeWidget<any>[])=>{
    const uuid = getUniqueId()
    const rootView = new QWidget()
    rootView.setObjectName(`hbox-${uuid}`)
    const layout = new FlexLayout()
    rootView.setLayout(layout)

    children.forEach(child => layout.addWidget(child))

    rootView.setStyleSheet(`
        #hbox-${uuid}{
            flex-direction: row;
        }
    `)

    return rootView
}

export default hbox