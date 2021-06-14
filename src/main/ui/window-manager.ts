import { Config } from "../../common/config"
import ConfigWindow from "../../window/config-window"
import { Observable } from 'rxjs';

type subscription<T>= {subscribe: (cb:(d:T)=>void)=>void}

class WindowManager {

    createConfigWindow(data: Config): subscription<Config> {
        return new Observable((subscription)=>{
            const window = ConfigWindow(data, (newData)=>{
                subscription.next(newData)
            });

            (window as any).addEventListener('Close', ()=>{
                console.log("Hey we close the window!")
                subscription.complete()
            })
        });
    }
}

export default WindowManager