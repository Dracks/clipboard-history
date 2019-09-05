import { useEffect, useRef, useState } from "react"


const useKeyDown = ()=>{
    const [keys, setKeys ] = useState<string[]>([])
    const keysRefs = useRef<string[]>([])
    keysRefs.current = keys
    useEffect(()=>{
        const onDown = (e: KeyboardEvent)=>{
            if (e.repeat){
                return
            }
            const listKeys = keysRefs.current
            if (listKeys.indexOf(e.key)===-1){
                keysRefs.current = [...listKeys, e.key]
                setKeys(keysRefs.current)
            }
            e.preventDefault()
        }

        window.addEventListener('keydown', onDown, true)

        return ()=>{
            window.removeEventListener('keydown', onDown, true)
        }
    }, [setKeys])

    return keys

}

export default useKeyDown