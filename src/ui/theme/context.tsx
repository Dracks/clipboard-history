import React from 'react';
import { PlatformEnum } from '../../common/types';
import elastic from './elastic';
import office from './office';

export const libraries = {
    mac: office,
    linux: elastic,
    win: office
}

export const ThemeContext = React.createContext(
    libraries.mac
)

interface ThemeProviderArgs {
    platform: PlatformEnum,
    children?: any[]
}

export const ThemeProvider = ({platform, children}: ThemeProviderArgs)=>{
    const selected = libraries[platform]
    const { Provider} = selected
    return (
    <ThemeContext.Provider value={selected}>
        <Provider>
            {children}
        </Provider>
    </ThemeContext.Provider>
)}


export default ThemeContext.Consumer