import React from 'react';
import { ThemeContext } from '../theme/context';
import { WindowPageProps } from './interface';


const Debug=(args: WindowPageProps<String>)=>{
    return (<ThemeContext.Consumer>
        {({Section})=>(
        <Section title="Section title!">
            Contents
        </Section>
        )}
        </ThemeContext.Consumer>
    )
}

export default Debug