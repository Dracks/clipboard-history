import { EuiSelect } from '@elastic/eui';
import React from 'react';
import { SelectProps } from "../types";

const Select = ({selected, text, options, onChange}: SelectProps)=>{

    return  <EuiSelect
            options={Object.keys(options).map((key)=>({
                value: key,
                text: options[key]
            }))}
            value={selected}
            onChange={(e: any)=>onChange(e.target.value)}
            aria-label={text}
        />

}

export default Select