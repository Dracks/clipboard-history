import { AlignmentFlag, FlexLayout, QLabel, QLineEdit, QMainWindow, QPlainTextEdit, QTextEdit, QWidget } from "@nodegui/nodegui";
import { Config } from "../common/config";
import group from "./widgets/group.widget";
import InputText from "./widgets/input-text.widget";

const newLabelCounter =(()=>{
    let count=0
    return ()=>{
        const label = new QLabel()
        label.setObjectName('labelCounter')
        label.setText(`${++count}`)
        return label
    }
})()


const ConfigWindow = (data: Config)=>{
    const newData = {...data}
    const rootView = new QWidget()
    const layout = new FlexLayout()
    rootView.setLayout(layout)
    rootView.setObjectName("rootView");


    const historyLength = InputText("History length", `${data.historyLength}`, (v)=>newData.historyLength=parseInt(v))
    
    
    layout.addWidget(group("History", [historyLength]))
     
     const win = new QMainWindow()
     win.setCentralWidget(rootView)
     win.setObjectName('Config')
     win.setMinimumSize(600, 600)
     win.show()

     return win;
 }

 export default ConfigWindow