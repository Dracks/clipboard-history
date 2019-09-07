import React from 'react';
import { ContextData, PlatformEnum } from '../common/types';

const context = React.createContext<ContextData>({
    platform: PlatformEnum.linux
})

export default context

