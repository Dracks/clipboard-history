import React, { useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { ContextData, LoadPage, PageDataSend, PlatformEnum } from '../common/types';
import Context from './context';
import Title from './title';
import Content from './windows';

interface RootProps{
    onSave: (data: PageDataSend)=>void,
    loadPageInfo: Observable<LoadPage>
}

const Root = ({onSave,loadPageInfo}: RootProps) => {
    const [ pageInfo, setPageInfo ] = useState<PageDataSend>()
    const [ contextInfo, setContextInfo ] = useState<ContextData>({
        platform: PlatformEnum.mac
    })
    useEffect(()=>{
        const subscription = loadPageInfo.subscribe(({page, context})=>{
            setPageInfo(page)
            setContextInfo(context)
        })
        return ()=>{
            subscription.unsubscribe()
        }
    }, [])

    const save = useCallback((data: PageDataSend)=>{
        setPageInfo(data)
        onSave(data)
    }, [])

    if (pageInfo){
        return <Context.Provider value={contextInfo}>
                    <Title name={pageInfo.name}/>
                    <Content data={pageInfo} setData={save}/>
                </Context.Provider>
    }
    return <div >
        <Title name="Loading..."/>
        </div>
};


export default Root