import { BrowserWindow, BrowserWindowConstructorOptions, IpcMain } from "electron";
import { Observable, Subscriber } from 'rxjs';
import { EventsName, PageData, PageDataSend, WindowPage } from "../../common/types";


class WindowManager{
    private pageInstances: {[key in WindowPage]?:Subscriber<PageData[key]>} = {}

    constructor(ipc: IpcMain, private winFactory: {new(options?: BrowserWindowConstructorOptions):BrowserWindow}){
        ipc.on(EventsName.Log, (events, messages)=>{
            console.log(...messages)
        });
        ipc.on(EventsName.Error, (events, messages)=>{
            console.error(...messages)
        });
        ipc.on(EventsName.Save, (_, {page, data}: PageDataSend)=>{
            this.pageInstances[page].next(data as any)
        })
    }

    createSingleInstance<T extends WindowPage>(page: T, data: PageData[T]):Observable<PageData[T]>{
        if (!this.pageInstances[page]){
            const window = this.create(page, data)
            let observable = Observable.create((subs)=>{
                this.pageInstances[page] = subs
            })
            window.on('closed', ()=>{
                console.log("Window clossed!")
                this.pageInstances[page].complete()
                this.pageInstances[page]=null;
            })
            return observable
        } else {
            console.log("Window already open")
            return null
        }
    }


    create<T extends WindowPage>(page: T,data: PageData[T]){
        const WinFact = this.winFactory
        const window = new WinFact({
            width: 800,
            height: 600,
            show: false,
            webPreferences:{
                devTools:true,
                nodeIntegration: true,
            },
        })


        // and load the index.html of the app.
        window.loadFile('dist/ui/index.html')
        window.setTitle(page)
        window.once("ready-to-show", ()=>{
            window.webContents.send(EventsName.Load, {
                page,
                data
            })
            window.show()
        })
        return window
    }
}

export default WindowManager