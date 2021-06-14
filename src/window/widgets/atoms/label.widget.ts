import { AlignmentFlag, QLabel } from "@nodegui/nodegui"
import baseEnrich, { IBaseOptions } from "./base.widget"

export interface ILabelOptions extends IBaseOptions{
    alignment?: AlignmentFlag
}

const labelWx = (text: string, options?: ILabelOptions)=>{
    const label = new QLabel()
    label.setText(text)

    if (options){
        baseEnrich(label, options)
        if (options.alignment){
            label.setAlignment(options.alignment)
        }
    }

    return label;
}

export default labelWx;