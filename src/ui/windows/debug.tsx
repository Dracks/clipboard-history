import React from 'react';
import { WindowPageProps } from './interface';


const Debug=(args: WindowPageProps<String>)=>{
    return <div>
        {args.data}
    </div>
}
export default Debug