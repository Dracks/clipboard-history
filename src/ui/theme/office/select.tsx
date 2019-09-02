import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
import React from 'react';
import { SelectProps } from "../types";

const Select = ({selected, text, options, onChange}: SelectProps)=>{
    const onChangeCb = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        onChange(item.key as string)
      };

    return  <Dropdown
                label={text}
                selectedKey={selected}
                onChange={onChangeCb}
                options={Object.keys(options).map((key)=>({
                    key: key,
                    text: options[key]
                }))}
            />

}

export default Select