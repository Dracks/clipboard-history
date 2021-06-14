import { QCheckBox } from "@nodegui/nodegui"

const checkboxWx = (text: string, initial: boolean, onChange: (newValue: boolean)=>void)=>{
    const cb = new QCheckBox();
    cb.setText(text)
    cb.setChecked(initial)
    cb.setCheckable(true)
    
    return cb;
}

export default checkboxWx