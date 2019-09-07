import React, { useCallback } from 'react';
import { Config, ShortcutsConfig } from "../../common/config";
import { ChangeContext } from '../../common/types';
import { mergeObjects } from '../../common/utils';
import { Checkbox, Page, Section, Spacer, TextField, useModal } from '../theme';
import { getGeneric } from '../utils/utils';
import { WindowPageProps } from './interface';
import SetShortcut from './set_shortcut';


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
                    const {value, onChange} = getGeneric(["shortcuts", key], config, ()=>undefined)
                    const {modal, show} = useModal(({close})=><SetShortcut save={(shortcut)=>{onChange(shortcut);close()}}/>, key)
                    return <div key={key}>
                        {modal}
                        <div>{SHORTCUTS_EXPLANATIONS[key]}</div>
                        <TextField.String
                            value={value}
                            onClick={show}
                            disabled
                            />
                        <Spacer />
                    </div>
                })}
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