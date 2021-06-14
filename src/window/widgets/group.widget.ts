import { AlignmentFlag, FlexLayout, NodeWidget, QLabel, QWidget } from "@nodegui/nodegui";
import { getUniqueId } from "./unique-id";


const group = (title: string, children: NodeWidget<any>[])=>{
    const uuid = getUniqueId()
    const root = new QWidget()
    const layout = new FlexLayout()
    root.setLayout(layout)
    root.setObjectName(`layout-${uuid}`)

    const label = new QLabel()
    label.setObjectName(`label-${uuid}`)
    label.setText(title)
    label.setAlignment(AlignmentFlag.AlignHCenter)
    
    layout.addWidget(label)


    children.forEach(child=>layout.addWidget(child))
    root.setStyleSheet(`
        #layout-${uuid} {
            flex-direction: column;
            border: 1px solid;
            margin: 5px;
            padding: 10px;
        }

        #label-${uuid} {
            font-size: 25px;
        }
    `)

    return root;
}

export default group