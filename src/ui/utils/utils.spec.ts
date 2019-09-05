import { getGeneric, mergeObjects } from "./utils";

describe('utils', ()=>{
    describe('mergeObjects', ()=>{
        const subject = mergeObjects

        it('first level merge', ()=>{
            const result = subject({"hola": "mon", "hello": "world"}, {"hola": "world"})
            expect(result).toEqual({hola:"world", hello:"world"})
        })

        it('second level merge', ()=>{
            const data1 = {
                hi: "world",
                other:{
                    ping: "pong"
                }
            }

            const data2= {
                other: {
                    peperoni: "sofrito"
                }
            }

            const result = subject(data1, data2)
            expect(result).toEqual({
                hi: "world",
                other: {
                    ping: "pong",
                    peperoni: "sofrito",
                }
            })
        })


    })

    describe('getGeneric', ()=>{
        const cb = jest.fn()
        const subject = getGeneric

        it('Getts the value correctly', ()=>{
            const result = subject(['key', 'subkey'], {key:{subkey: 'hi'}, other: 'world'}, cb)

            expect(result.value).toEqual('hi')
        })

        it('Setts the value correctly', ()=>{
            const input = subject(['key', 'subkey'], {}, cb)

            input.onChange("hei we are alive!")

            expect(cb).toBeCalledTimes(1)
            expect(cb).toBeCalledWith({key:{subkey: "hei we are alive!"}})
        })
    })
})