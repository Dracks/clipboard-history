
export const mergeObjects = (obj1: any, obj2: any)=>{
    if (obj2 instanceof Array){
        return obj2
    }
    const newProps = Object.keys(obj2)
        .reduce((ac, key)=>{
            let obj2Prop = obj2[key]
            if (typeof obj2Prop === "object" ){
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

export type ConstructorClass<O extends {}, T extends {}> = {new(options: O):T}
