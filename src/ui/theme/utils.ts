

export const identity = (a:any)=>a
export const number = (a: any)=>{
    var v = parseInt(a)
    if (v!==NaN){
        return v
    }
    return 0
}