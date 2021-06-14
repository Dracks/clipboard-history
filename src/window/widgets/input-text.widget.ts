import { QWidget, FlexLayout, QLabel, AlignmentFlag, QLineEdit } from "@nodegui/nodegui";
import labelWx from "./atoms/label.widget";
import { getUniqueId } from "./unique-id";

const InputText = (label: string, initialText: string, onChange: (data:string)=>void) => {
    const uuid = getUniqueId()
    const rootWidget = new QWidget();
    const layout = new FlexLayout();
    rootWidget.setObjectName(`layout-${uuid}`);
    rootWidget.setLayout(layout)

    const lblWx = labelWx(label, {
        objectName: `label-${uuid}`,
        alignment: AlignmentFlag.AlignRight
    })
    layout.addWidget(lblWx)

    const inputWx = new QLineEdit()
    inputWx.setObjectName(`input-${uuid}`)
    inputWx.setText(initialText)
    inputWx.type
    layout.addWidget(inputWx)
    
    rootWidget.setLayout(layout)
    rootWidget.setStyleSheet(`
    #layout-${uuid} {
        flex-direction: row;
    }
    #label-${uuid} {
        padding-right: 10px;
        flex: 1;
    }
    #input-${uuid} {
        flex: 1;
    }
    `)
    return rootWidget
}

export default InputText