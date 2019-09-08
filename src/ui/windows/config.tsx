import React, { useCallback } from 'react';
import { Config } from "../../common/config";
import { ChangeContext } from '../../common/types';
import { Checkbox, Page, Section, Spacer, TextField } from '../theme';
import { getGeneric, mergeObjects } from '../utils/utils';
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
    const config = data
    const setConfig = save
    const update = useCallback((newData: Partial<Config>)=>{
        setConfig(mergeObjects(config, newData))
    }, [config])
    return <Page >
            <Section title="General" >
                <h2>History length</h2>
                <TextField.Number {...getGeneric(["historyLength"], config, update)}/>
            </Section>
            <Spacer/>
            <Section title="notifications">
                {Object.values(ChangeContext).map((key:ChangeContext)=>(
                    <div key={key}>
                        <Checkbox
                            id={key}
                            text={EXPLANATIONS[key]}
                            {...getGeneric(["notifications", key], config, update)}
                            />
                    </div>
                ))}
            </Section>
        </Page>
}

export default Configuration