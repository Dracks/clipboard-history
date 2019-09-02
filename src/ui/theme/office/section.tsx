import { IStackTokens, Stack } from 'office-ui-fabric-react';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import React from 'react';
import { SectionProps } from '../types';

const stackTokens: IStackTokens = { childrenGap: 12 };

const Section = ({title, children}: SectionProps)=>{
    return <div>
         <Stack tokens={stackTokens}>
            <Separator vertical>{title}</Separator>
            {children}
         </Stack>
    </div>
}

export default Section;