import { Checkbox as FabricCheckbox } from 'office-ui-fabric-react/lib/Checkbox';
import React from 'react';
import { CheckboxProps } from "../types";

const Checkbox=({onChange, value, text}:CheckboxProps) =>{
    return <FabricCheckbox checked={value} label={text} onChange={(ev)=>{
        ev.preventDefault()
        onChange(!value)
    }}/>
}

export default Checkbox