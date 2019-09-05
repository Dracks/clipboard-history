import React, { useState } from 'react';
import ShortcutsRegister from '../utils/shortcuts.register';
import { WindowPageProps } from './interface';


const Debug=(args: WindowPageProps<String>)=>{
    const [ finalKeys, setFinalKeys] = useState<string[]>([])
    return <div>
        {args.data}
        <div>
            Final keys:
            {finalKeys.reduce((ac, e)=>ac+", "+e, "")}
        </div>
        <ShortcutsRegister onAllReleased={setFinalKeys}>
            {({keys})=>(<div>
                Pressed keys:
                {keys.reduce((ac,e)=>ac+", "+e, "")}
            </div>)}

        </ShortcutsRegister>
    </div>
}
export default Debug