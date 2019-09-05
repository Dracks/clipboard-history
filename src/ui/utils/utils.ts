
export const getGeneric = <T extends {}, E>(key: string[], config: T, set: (value:T)=>void)=>{
    return {
        value: key.reduce((ac:any, e)=>ac ? ac[e]: null, config),
        onChange: (newValue: E)=>{
            set(key.reverse().reduce((ac, e)=>({[e]: ac} as any), newValue as any))
        }
    }
}