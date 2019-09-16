import { EuiButton, EuiButtonIcon } from '@elastic/eui';
import React from 'react';
import { ButtonProps } from '../types';

const Button = {
    Normal: ({children, onClick, size, disabled}: ButtonProps)=>{
    return <EuiButton
        onClick={onClick}
        size={size}
        disabled={disabled}
        >{children}</EuiButton>
    },
    Icon: ({children, onClick, size, icon, disabled}: ButtonProps & { icon: string})=>{
        return <EuiButtonIcon
        onClick={onClick}
        size={size}
        iconType={icon}
        disabled={disabled}
        >{children}</EuiButtonIcon>
    }
}


export default Button