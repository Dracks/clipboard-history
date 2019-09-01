import React, { useEffect } from 'react';
import { WindowPageProps } from './interface';


const Debug=(args: WindowPageProps<String>)=>{
    useEffect(()=>{
        args.save("ping" as any)
    })
    return <div>{args.data}</div>
}


export default Debug