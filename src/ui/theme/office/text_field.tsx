import { TextField as FabricTextField } from 'office-ui-fabric-react/lib/TextField';
import React, { useCallback } from 'react';
import { TextFieldProps } from "../types";
import { identity, number } from '../utils';

const getOnChange=<T extends any>(onChange: (newValue:T)=>void, parser:(newValue:string)=>T)=>
    useCallback((_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string)=>{
        onChange(parser(newValue))
    }, [onChange])

const TextField = {
    String: ({value, onChange}: TextFieldProps<string>)=>
        <FabricTextField
            value={value}
            onChange={getOnChange(onChange, identity)} />
    ,
    Number: ({value, onChange}: TextFieldProps<number>)=>
        <FabricTextField
            type="number"
            value={value as any}
            onChange={getOnChange(onChange, number)} />,
}

export default TextField