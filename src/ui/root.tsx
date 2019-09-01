import React, { useCallback, useEffect, useState } from 'react';
import { EventsName, PageData, PageDataSend, WindowPage } from '../common/types';
import Title from './title';
import { Ipc } from './types';
import Configuration from './windows/config';
import Debug from './windows/debug';
import { WindowPageProps } from './windows/interface';

interface RootProps{
    ipc: Ipc
}

type PagesList = {
    [k in WindowPage]: React.ComponentType<WindowPageProps<PageData[k]>>
}

const PAGES_LIST : PagesList= {
    "Debug": Debug,
    "config": Configuration
}



const Content = ({data, setData}: {data: PageDataSend, setData:(a:PageDataSend)=>void})=>{
    const { page } = data;
    const save = useCallback((data)=>{
        setData({
            page,
            data
        })
    }, [data.page] )

    const Page = PAGES_LIST[data.page] as React.ComponentType<WindowPageProps<any>>
    return <Page data={data.data} save={save}/>

}

const Root = ({ipc}: RootProps) => {
    const [ data, setData ] = useState<PageDataSend>()
    useEffect(()=>{
        ipc.on(EventsName.Load, (_, data: PageDataSend)=>{
            setData(data)
        })

        return ()=>{
            ipc.removeAllListeners(EventsName.Load)
        }
    })
    const save = useCallback((data: PageDataSend)=>{
        setData(data)
        ipc.send(EventsName.Save, data)
    }, [])

    if (data){
        return <div>
                <Title name={data.page}/>
                <Content data={data} setData={save}/>
            </div>
    }
    return <div >
        <Title name="Loading..."/>
        </div>
};

export default Root