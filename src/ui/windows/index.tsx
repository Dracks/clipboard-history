import React, { useCallback } from "react";
import { PageData, PageDataSend, WindowPage } from "../../common/types";
import Configuration from "./config";
import Debug from "./debug";
import { WindowPageProps } from "./interface";

type PagesList = {
    [k in WindowPage]: React.ComponentType<WindowPageProps<PageData[k]>>
}

const PAGES_LIST : PagesList= {
    "Debug": Debug,
    "config": Configuration
}



const Content = ({data, setData}: {data: PageDataSend, setData:(a:PageDataSend)=>void})=>{
    const { name } = data;
    const save = useCallback((data)=>{
        setData({
            name,
            data
        })
    }, [name] )

    const Page = PAGES_LIST[name] as React.ComponentType<WindowPageProps<any>>
    return <Page data={data.data} save={save}/>
}

export default Content