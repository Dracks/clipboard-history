
import React from 'react';
import ReactDOM from 'react-dom';
import { EventsName } from '../common/types';
import Root from './root';

declare global {
    interface Window { require: (mod:string)=>any; }
}

const ipc = window.require('electron').ipcRenderer


console.log = (...args: any)=>{
    ipc.send(EventsName.Log, args)
}

console.error = (...args: any)=>{
    ipc.send(EventsName.Error, args)
}
//*/

interface HelloProps {}




ReactDOM.render(
    <Root ipc={ipc}/>,
    document.getElementById("root")
);