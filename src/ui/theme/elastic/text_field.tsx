import { EuiFieldNumber, EuiFieldText } from "@elastic/eui";
import React, { ChangeEvent, useCallback } from 'react';
import { TextFieldProps } from "../types";
import { identity, number } from "../utils";

const getOnChange = <T extends any>(onChange:(newValue:T)=>void, parser:(newValue:string)=>T)=>
    useCallback((e: ChangeEvent<HTMLInputElement>)=>{
        onChange(parser(e.target.value))
    }, [onChange])


const TextField = {
    String: ({value, onChange, disabled, onClick}:TextFieldProps<string>)=>
        <EuiFieldText
          value={value}
          onChange={onChange && getOnChange(onChange, identity) }
          readOnly={disabled}
          onClick={onClick}
        />,

    Number: ({value, onChange, disabled}: TextFieldProps<number>)=>
        <EuiFieldNumber
          value={value}
          onChange={onChange && getOnChange(onChange, number)}
          disabled={disabled}
        />,
}

export default TextField