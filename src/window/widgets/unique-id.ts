export const getUniqueId = (()=>{
    let count=100
    return ()=>{
        ++count;
        return `u${count.toString(16)}`
    }
})()