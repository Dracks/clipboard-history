
import React from 'react';
import ReactDOM from 'react-dom';
import { Observable, Subscriber } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { EventsName, LoadPage, PageDataSend } from '../common/types';
import Root from './root';
import ErrorBoundary from './utils/ErrorHandler';

declare global {
    interface Window {
        require: (mod:string)=>any;
    }
}


const ipc = window.require('electron').ipcRenderer

console.log = (...args: any)=>{
    ipc.send(EventsName.Log, args)
}

console.error = (...args: any)=>{
    ipc.send(EventsName.Error, args)
}

//*/

const pageInfo : Observable<LoadPage> = Observable.create((subs: Subscriber<LoadPage>)=>{
    ipc.on(EventsName.Load, (_: any, data: LoadPage)=>{
        subs.next(data)
    })
}).pipe(shareReplay(1))

// Subscrive, otherwise It won't recive the first update
const loadSubscription = pageInfo.subscribe(()=>{})

let onSave : Subscriber<PageDataSend>;
const saveSubscription = Observable.create((i:any)=>{
    onSave=i
}).subscribe((data:PageDataSend)=>{
    ipc.send(EventsName.Save, data)
})

window.addEventListener('close', ()=>{
    loadSubscription.unsubscribe()
    saveSubscription.unsubscribe()
})

ReactDOM.render(
    <ErrorBoundary>
        <Root onSave={(data)=>{
            onSave.next(data)
        }} loadPageInfo={pageInfo}/>
    </ErrorBoundary>,
    document.getElementById("root")
);