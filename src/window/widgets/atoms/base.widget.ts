import { NodeWidget, QWidgetSignals } from "@nodegui/nodegui";
import { NodeFrame } from "@nodegui/nodegui/dist/lib/QtWidgets/QFrame";

export interface IBaseOptions {
    objectName?: string
}

const baseEnrich = <T extends QWidgetSignals>(obj: NodeWidget<T>, options?: IBaseOptions)=>{
    if (options){
        if (options.objectName){
            obj.setObjectName(options.objectName)
        }
    }
}

export default baseEnrich