import React, { useCallback } from 'react';
import { Config, initialConfig, ShortcutsConfig } from "../../common/config";
import { ChangeContext } from '../../common/types';
import { mergeObjects } from '../../common/utils';
import SetShortcut from '../components/set_shortcut';
import { Button, Checkbox, Page, Section, Spacer, TextField } from '../theme';
import { getGeneric } from '../utils/utils';
import { WindowPageProps } from './interface';


const NOTIFICATIONS_EXPLANATIONS : {
    [key in ChangeContext]: string
} = {
    manual: "When some clipboard is selected from the tray",
    new: "When the clipboard changed",
    shortcut: "When the change is provoqued by a shortcut",
    start: "When the application starts"
}

const SHORTCUTS_EXPLANATIONS : {
    [key in keyof ShortcutsConfig]: string
} = {
    next: "The shortcut to select next value",
    previous: "The shortcut to select previous value",
    removeCurrent: "The shortcut to remove the current value from the history and move to next"
}

const Configuration = ({data, save}: WindowPageProps<Config>)=>{
    const config = data
    const setConfig = save
    const update = useCallback((newData: Partial<Config>)=>{
        setConfig(mergeObjects(config, newData))
    }, [config])
    const shortcuts = Object.keys(config.shortcuts) as any

    return <Page >
            <Section title="General" >
                <h2>History length</h2>
                <TextField.Number {...getGeneric(["historyLength"], config, update)}/>
                <Spacer />
                {shortcuts.map((key: keyof ShortcutsConfig)=>{
                    const {value, onChange} = getGeneric(["shortcuts", key], config, update)
                    const original = initialConfig.shortcuts[key];
                    return <div key={key}>
                        <div>{SHORTCUTS_EXPLANATIONS[key]}</div>
                        <div style={{display: "flex"}}>
                            <div style={{flexGrow: 1}}>
                                <SetShortcut title={key} value={value} save={onChange} />
                            </div>
                            <Button.Icon onClick={()=>onChange(original)} icon={"refresh"} disabled={value==original}></Button.Icon>
                        </div>
                    </div>
                })}
            </Section>
            <Spacer/>
            <Section title="Tray" >
                <h2>Length show in tray</h2>
                <TextField.Number {...getGeneric(["tray", "size"], config, update)}/>
                <Spacer />
                    <Checkbox
                        id="tray.trim"
                        text="Trim clipboard values"
                        {...getGeneric(["tray", "trim"], config, update)}
                        />
            </Section>
            <Spacer/>
            <Section title="notifications">
                {Object.values(ChangeContext).map((key:ChangeContext)=>(
                    <div key={key}>
                        <Checkbox
                            id={key}
                            text={NOTIFICATIONS_EXPLANATIONS[key]}
                            {...getGeneric(["notifications", key], config, update)}
                            />
                    </div>
                ))}
            </Section>
        </Page>
}

export default Configuration