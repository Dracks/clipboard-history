import { useMemo } from 'react';

interface TitleArgs {
    name: string
}

const Title = ({name}: TitleArgs): null=>{
    const page = useMemo(()=>document.getElementsByTagName('title')[0], [])
    page.innerHTML = name
    return null
}

export default Title