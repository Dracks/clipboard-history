import { BrowserWindow, BrowserWindowConstructorOptions, IpcMain } from "electron";
import { Observable, Subscriber } from 'rxjs';
import { ContextData, EventsName, LoadPage, NodePlatformToEnum, PageData, PageDataSend, WindowPage } from "../../common/types";


class WindowManager{
    private pageInstances: {[key in WindowPage]?:Subscriber<PageData[key]>} = {}
    private context: ContextData

    constructor(ipc: IpcMain, private winFactory: {new(options?: BrowserWindowConstructorOptions):BrowserWindow}){
        ipc.on(EventsName.Log, (events, messages)=>{
            console.log(...messages)
        });
        ipc.on(EventsName.Error, (events, messages)=>{
            console.error(...messages)
        });
        ipc.on(EventsName.Save, (_, {name, data}: PageDataSend)=>{
            let subscriber = this.pageInstances[name]
            if (subscriber){
                subscriber.next(data as any)
            }
        })

        this.context = {
            platform: NodePlatformToEnum[process.platform]
        }
    }

    createSingleInstance<T extends WindowPage>(page: T, data: PageData[T]):Observable<PageData[T]>|null{
        if (!this.pageInstances[page]){
            const window = this.create(page, data)
            let observable = Observable.create((subs: any)=>{
                this.pageInstances[page] = subs
            })
            window.on('closed', ()=>{
                (this.pageInstances[page] as any).complete()
                this.pageInstances[page]=undefined;
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
        window.webContents.on('did-finish-load', ()=>{
                window.webContents.send(EventsName.Load, {
                    context: this.context,
                    page: {
                        name: page,
                        data
                    }
                } as LoadPage)
            window.show()
        })
        return window
    }
}


export default WindowManager