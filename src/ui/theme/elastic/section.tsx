import { EuiPanel } from '@elastic/eui';
import React from 'react';
import { SectionProps } from '../types';


const Section = ({title, children}: SectionProps) => (
    <EuiPanel betaBadgeLabel={title}>
        {children}
    </EuiPanel>
)

export default Section