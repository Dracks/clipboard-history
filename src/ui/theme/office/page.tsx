import React from 'react';
import { PageProps } from "../types";


const Page = ({children}: PageProps)=>
    <div style={{padding: "10px"}}>
        {children}
    </div>


export default Page