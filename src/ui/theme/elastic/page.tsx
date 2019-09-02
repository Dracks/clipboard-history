import { EuiPage, EuiPageBody } from '@elastic/eui';
import React from 'react';
import { PageProps } from "../types";


const Page = ({children}: PageProps)=>
    <EuiPage >
        <EuiPageBody>
            {children}
        </EuiPageBody>
    </EuiPage>


export default Page