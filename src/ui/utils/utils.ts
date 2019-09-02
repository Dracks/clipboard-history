
export const mergeObjects = (obj1: any, obj2: any)=>{
    const newProps = Object.keys(obj2)
        .reduce((ac, key)=>{
            let obj2Prop = obj2[key]
            if (typeof obj2Prop === "object"){
                obj2Prop = mergeObjects(obj1[key] || {}, obj2Prop)
            }
            return {
                ...ac,
                [key]: obj2Prop,
            }
        }, {} as any)
    return {
        ...obj1,
        ...newProps,
    }

}

export const getGeneric = <T extends {}, E>(key: string[], config: T, set: (value:T)=>void)=>{
    return {
        value: key.reduce((ac:any, e)=>ac ? ac[e]: null, config),
        onChange: (newValue: E)=>{
            set(key.reverse().reduce((ac, e)=>({[e]: ac} as any), newValue))
        }
    }
}