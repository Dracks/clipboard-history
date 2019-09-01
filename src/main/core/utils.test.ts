
export type GetRegisteredCallbackFn = (event: string)=> Function
export const getCallback = (fn: jest.MockInstance<any, any>) => (event: String)=>{
    const onSelectArray = fn.mock.calls.filter(([action, ..._])=>action===event)
        .map(([_, callback])=>callback)
    expect(onSelectArray).toHaveLength(1)
    return onSelectArray[0]
}

export const setProp = <T extends {}>(obj:T, key:keyof T, value: any)=>{
    let objUnkown = (obj as any);
    objUnkown[key]=value
}