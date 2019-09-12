import React from 'react';

interface RegisterShortcutsProps {
    onAllReleased:(keys: string[])=>void
    children:React.ComponentType<{keys:string[]}>
}

interface RegisterShortcutsState {
    keys: string[]
}

enum AlterKeys {
    shift="shift",
    meta="meta",
    ctrl="ctrl",
    alt="alt",
}
type AlterKeysStatus = {
    [k in AlterKeys]: boolean
}

class RegisterShortcuts extends React.Component<RegisterShortcutsProps,RegisterShortcutsState>{
    private count:number=0;

    private lastAlterKeys : AlterKeysStatus = {
        shift: false,
        meta: false,
        ctrl: false,
        alt: false
    }

    constructor(props: RegisterShortcutsProps){
        super(props)
        this.state = {keys:[]}
        this.onDown=this.onDown.bind(this)
        this.onUp=this.onUp.bind(this)
    }

    private updateLastAlterKeys(e: KeyboardEvent):number{
        let countDown =0
        Object.values(AlterKeys).forEach((name)=>{
            const newStatus = (e as any)[`${name}Key`]
            const oldStatus = this.lastAlterKeys[name]
            if (newStatus != oldStatus){
                this.lastAlterKeys[name]=newStatus
                if (!newStatus && oldStatus){
                    countDown ++;
                }
            }
        })
        return countDown
    }

    componentDidMount(){
        window.addEventListener('keyup', this.onUp, true)
        window.addEventListener('keydown', this.onDown, true)
    }

    componentWillUnmount(){
        window.removeEventListener('keyup', this.onUp, true)
        window.removeEventListener('keydown', this.onDown, true)
    }

    updateFromName (camelName:string, status: boolean){
        let keyName = camelName.toLocaleLowerCase()
        console.log(keyName)
        if (keyName==="control"){
            keyName='ctrl'
        }
        if (Object.values(AlterKeys).indexOf(keyName as any)!==-1){
            this.lastAlterKeys[keyName as AlterKeys] = status;
        }

    }

    onDown (e: KeyboardEvent){
        if (e.repeat){
            return
        }
        this.count++;
        var keys = this.state.keys
        this.updateLastAlterKeys(e)
        if (keys.indexOf(e.key)===-1){
            this.setState({keys: [...keys, e.key]})
        }
        e.preventDefault()
    }

    onUp(e: KeyboardEvent){
        this.count--;
        this.updateFromName(e.key, false)
        this.count -= this.updateLastAlterKeys(e)
        console.log(this.count)
        if (this.count===0){
            this.props.onAllReleased(this.state.keys)
        }else if (this.count<0){
            throw new Error("Count lower than zereo:"+this.count)
        }
    }

    render(){
        const Child = this.props.children
        const keys = this.state.keys

        return <Child keys={keys} />
    }
}

export default RegisterShortcuts