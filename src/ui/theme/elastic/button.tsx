import { EuiButton } from '@elastic/eui';
import React from 'react';
import { ButtonProps } from '../types';

const Button = ({children, onClick, size}: ButtonProps)=>{
    return <EuiButton
        onClick={onClick}
        size={size}
        >{children}</EuiButton>
}

export default Button