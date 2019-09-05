import React, { useEffect } from 'react';
import useKeyDown from '../utils/useKeyDown';

const metaKeys = ["control", "alt", "cmd", "Meta", "shift"]
const isNotMeta = (e:string)=>{
    return metaKeys.indexOf(e.toLowerCase())===-1
}

const ShortcutModalBody = ({onUpdate}:{onUpdate:(s:string[])=>void})=>{
    const keysList = useKeyDown()
    useEffect(()=>onUpdate(keysList), [keysList])
    const valid = keysList.filter(isNotMeta).length>0
    return <div>
        Press keys for the new shortcut. <br/>
        Selected: {keysList.length && keysList.reduce((ac,e)=>ac+", "+e)} <br />
        {valid && "Valid shortcut" || "Not valid shortcut"}
    </div>
}
export default ShortcutModalBody
