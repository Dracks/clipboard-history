import React, { useCallback, useContext } from 'react';
import { PlatformEnum } from '../../common/types';
import context from '../context';
import ShortcutsRegister from '../utils/shortcuts.register';

interface SetShortcutProps{
    save: (shortcut:string)=>void
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

const SetShortcut = ({save}: SetShortcutProps)=>{
    const {platform} = useContext(context)
    const mapFn = useCallback((k:string)=>{
        const mapper = MAP_TO_STANDARD[platform]
        return mapper[k] || k
    }, [platform])
    const saveFn = useCallback((keys:string[])=>{
        save(keys.map(mapFn).reduce((ac,e)=>ac+"+"+e))
    }, [mapFn, save])
    return <div>
        Pres keys to change it, when all where released, it will saved automatically
        <ShortcutsRegister onAllReleased={saveFn}>
        {({keys})=>{
            if (keys.length){
                return <div>Keys pressed: {keys.map(mapFn).reduce((ac,e)=>ac+", "+e)}</div>
            } else {
                return <div>Press some keys for start the new shortcut</div>
            }
        }}
        </ShortcutsRegister>
    </div>
}

export default SetShortcut