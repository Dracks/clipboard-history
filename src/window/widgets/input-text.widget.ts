import { QWidget, FlexLayout, QLabel, AlignmentFlag, QLineEdit } from "@nodegui/nodegui";

const InputText = (label: string, initialText: string, onChange: (data:string)=>void) => {
    const rootWidget = new QWidget();
    const layout = new FlexLayout();
    rootWidget.setObjectName('layout');
    rootWidget.setLayout(layout)
    
    const labelWx = new QLabel()
    labelWx.setObjectName('label')
    labelWx.setText(label)
    labelWx.setAlignment(AlignmentFlag.AlignRight)
    layout.addWidget(labelWx)

    const inputWx = new QLineEdit()
    inputWx.setObjectName('input')
    inputWx.setText(initialText)
    inputWx.type
    layout.addWidget(inputWx)
    
    rootWidget.setLayout(layout)
    rootWidget.setStyleSheet(`
    #layout {
        flex-direction: row;
        padding: 10px;
    }
    #label {
        padding-right: 10px;
        flex: 1;
    }
    #input {
        flex: 1;
    }
    `)
    return rootWidget
}

export default InputText