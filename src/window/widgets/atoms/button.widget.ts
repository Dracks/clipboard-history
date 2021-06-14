import { QPushButton } from "@nodegui/nodegui";
import baseEnrich, { IBaseOptions } from "./base.widget";

export interface IButtonOptions extends IBaseOptions{}

const buttonWx = (text: string, cb: ()=>void, options?: IButtonOptions) => {
    const button = new QPushButton()
    button.setText(text)
    button.addEventListener('clicked', cb)

    if (options){
        baseEnrich(button, options)
    }

    return button
}

export default buttonWx