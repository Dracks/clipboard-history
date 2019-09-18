import { act, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { Observable, Subscriber } from "rxjs";
import { LoadPage, PlatformEnum } from "../common/types";
import Subject from './root';
import { WindowPageProps } from './windows/interface';

jest.mock('./windows/debug', ()=>{
    return ({save, data}: WindowPageProps<String>)=>(
        <div>
            {data}
            <button onClick={()=>save('other info')}>save</button>
        </div>
    )
})

const debugPage : LoadPage = {page: {data:"Debug data", name: "Debug"}, context: {platform: PlatformEnum.linux}}

describe('ui/root', ()=>{
    let onSave : jest.Mock
    let pageInfoSubscription: Subscriber<LoadPage>
    let titleMock: any
    let getElementsByTagNameSpied: jest.SpyInstance
    let query: RenderResult
    beforeEach(()=>{
        titleMock = {}
        getElementsByTagNameSpied = jest.spyOn(document, 'getElementsByTagName').mockReturnValue([titleMock] as any)
        onSave = jest.fn()
        const loadPage = Observable.create((s:Subscriber<LoadPage>)=>{
            pageInfoSubscription = s
        })
        query = render(<Subject onSave={onSave} loadPageInfo={loadPage}/>)
    })

    afterEach(()=>{
        getElementsByTagNameSpied.mockRestore()
    })

    it('Should render basically', ()=>{
        expect(titleMock).toEqual({innerHTML: 'Loading...'})
    })

    it('Should render the debug screen', ()=>{

        act(()=>pageInfoSubscription.next(debugPage))
        expect(titleMock).toEqual({innerHTML: 'Debug'})
        expect(query.container).toMatchSnapshot()
    })

    it("When saving data, it will change the status, and launch onSave",()=>{
        act(()=>pageInfoSubscription.next(debugPage))
        const button = query.getByRole('button')
        act(()=>{button.dispatchEvent(new MouseEvent("click", { bubbles: true }))})
        expect(onSave).toHaveBeenCalledTimes(1)
        expect(onSave).toHaveBeenCalledWith({data:"other info", name: "Debug"})
        expect(query.container).toMatchSnapshot()
    })
})