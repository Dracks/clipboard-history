import React, { useCallback } from 'react';
import { Config } from "../../common/config";
import { ChangeContext } from '../../common/types';
import { getCheckboxProps, getInputProps, mergeObjects } from '../utils';
import { WindowPageProps } from './interface';

const EXPLANATIONS : {
    [key in ChangeContext]: string
} = {
    manual: "When some clipboard is selected from the tray",
    new: "When the clipboard changed",
    shortcut: "When the change is provoqued by a shortcut",
    start: "When the application starts"
}

const Configuration = ({data, save}: WindowPageProps<Config>)=>{
    //const [config, setConfig] = useState(data)
    const config = data
    const setConfig = save
    const update = useCallback((newData: Partial<Config>)=>{
        setConfig(mergeObjects(config, newData))
    }, [config])
    console.log(config)
    return (<div>
        <h2>History length</h2>
        <input type="number" {...getInputProps(["historyLength"], config, update)}/>
        <h2>Notifications</h2>
        {Object.values(ChangeContext).map((key:ChangeContext)=>(
            <div key={key}>

                <input type="checkbox" {...getCheckboxProps(["notifications", key], config, update)} />
                <span>{EXPLANATIONS[key]}</span>
            </div>
        ))}
    </div>)
}

export default Configuration