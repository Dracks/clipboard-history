export type Ipc = {
    on: (channel: string, cb:(...args: any[])=>void)=>void,
    removeAllListeners: (channel: string)=>void,
    send: (channel: string, data: any)=>void,
}