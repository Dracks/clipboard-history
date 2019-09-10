import { EuiCheckbox } from "@elastic/eui";
import React from 'react';
import { CheckboxProps } from "../types";


const Checkbox = ({id, text, value, onChange}: CheckboxProps)=>{
    const onChangeFn = (): void => {
        onChange(!value);
      }
    return <EuiCheckbox
            id={id}
            label={text}
            checked={value}
            onChange={onChangeFn}
        />
}

export default Checkbox