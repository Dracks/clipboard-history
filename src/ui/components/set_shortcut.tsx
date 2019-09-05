import React, { useCallback, useContext, useRef } from 'react';
import { PlatformEnum } from '../../common/types';
import context from '../context';
import { Button, TextField, useModal } from '../theme';
import ShortcutModalBody from './set_shortcut_body';

interface SetShortcutProps{
    title: string
    save: (shortcut:string)=>void
    value: string
}

const MAP_TO_STANDARD :{[k in PlatformEnum]: {[k:string]:string}} = {
    mac: {
        Meta: "Cmd"
    },
    linux: {},
    win: {
        Meta: "Win"
    }
}


const SetShortcut = ({title, value, save}: SetShortcutProps)=>{
    const {platform} = useContext(context)
    const mapFn = useCallback((k:string)=>{
        const mapper = MAP_TO_STANDARD[platform]
        return mapper[k] || k
    }, [platform])

    const selectedKeys = useRef<string[]>([])
    const onUpdate = useCallback((keys: string[])=>{
        selectedKeys.current = keys
    }, [selectedKeys])
    const saveFn = useCallback((close:()=>void)=>{
        const keys = selectedKeys.current
        if (keys.length>0){
            save(keys.map(mapFn).reduce((ac,e)=>ac+"+"+e))
        }
        close()
    }, [mapFn, save, selectedKeys])

    const {modal, show} = useModal(({})=><ShortcutModalBody onUpdate={onUpdate}/>, {
        title: title,
        Footer: ({close})=><Button.Normal
            onClick={() => saveFn(close)}>
            Save and close
        </Button.Normal>
    })
    return <div>
        {modal}
        <TextField.String
            value={value}
            onClick={show}
            disabled
            />
    </div>
}

export default SetShortcut