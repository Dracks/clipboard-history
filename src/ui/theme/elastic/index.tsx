import React from 'react';
import Checkbox from './checkbox';
import './index.scss';
import Page from './page';
import Section from './section';
import Select from './select';
import Spacer from './spacer';
import TextField from './text_field';


export default {
    Checkbox,
    Provider: ({children}:any)=><div className="elastic">{children}</div>,
    Section,
    Select,
    Spacer,
    TextField,
    Page

}