import React from 'react';
import { Section } from '../theme';
import { WindowPageProps } from './interface';


const Debug=(args: WindowPageProps<String>)=>{
    return (
        <Section title="Section title!">
            {args.data}
        </Section>
    )
}

export default Debug