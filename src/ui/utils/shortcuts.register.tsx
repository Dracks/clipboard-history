import React, { useEffect, useRef, useState } from 'react';

interface RegisterShortcutsProps {
    onAllReleased:(keys: string[])=>void
    children:React.ComponentType<{keys:string[]}>
}

const RegisterShortcuts = ({children, onAllReleased}: RegisterShortcutsProps)=>{
    const count = useRef(0)
    const [ keys, setKeys ] = useState<string[]>([])

    useEffect(()=>{
        const onDown = (e: KeyboardEvent)=>{
            if (e.repeat){
                return
            }
            count.current++;
            if (keys.indexOf(e.key)===-1){
                setKeys([...keys, e.key])
            }
            e.preventDefault()
        }

        const onUp = (e: any)=>{
            console.log(e)
            count.current--;
            console.log(count.current)
            if (count.current===0){
                console.log("Release!")
                onAllReleased(keys)
            }
        }

        window.addEventListener('keyup', onUp, true)
        window.addEventListener('keydown', onDown, true)

        return ()=>{
            window.removeEventListener('keyup', onUp, true)
            window.removeEventListener('keydown', onDown, true)
        }
    }, [keys])

    const Child = children

    return <Child keys={keys} />
}

export default RegisterShortcuts