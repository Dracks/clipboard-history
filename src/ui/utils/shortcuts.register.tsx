import React from 'react';

interface RegisterShortcutsProps {
    onAllReleased:(keys: string[])=>void
    children:React.ComponentType<{keys:string[]}>
}

interface RegisterShortcutsState {
    keys: string[]
}

class RegisterShortcuts extends React.Component<RegisterShortcutsProps,RegisterShortcutsState>{
    private count:number=0;

    constructor(props: RegisterShortcutsProps){
        super(props)
        this.state = {keys:[]}
        this.onDown=this.onDown.bind(this)
        this.onUp=this.onUp.bind(this)
    }

    componentDidMount(){
        window.addEventListener('keyup', this.onUp, true)
        window.addEventListener('keydown', this.onDown, true)
    }

    componentWillUnmount(){
        window.removeEventListener('keyup', this.onUp, true)
        window.removeEventListener('keydown', this.onDown, true)
    }

    onDown (e: KeyboardEvent){
        if (e.repeat){
            return
        }
        this.count++;
        var keys = this.state.keys
        if (keys.indexOf(e.key)===-1){
            this.setState({keys: [...keys, e.key]})
        }
        e.preventDefault()
    }

    onUp(e: KeyboardEvent){
        this.count--;
        if (this.count===0){
            this.props.onAllReleased(this.state.keys)
        }
    }

    render(){
        const Child = this.props.children
        const keys = this.state.keys

        return <Child keys={keys} />
    }
}

export default RegisterShortcuts