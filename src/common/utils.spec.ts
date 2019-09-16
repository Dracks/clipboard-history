import { mergeObjects } from "./utils";

describe('utils', ()=>{
    describe('mergeObjects', ()=>{
        const subject = mergeObjects

        it('first level merge', ()=>{
            const result = subject({"hola": "mon", "hello": "world"}, {"hola": "world"})
            expect(result).toEqual({hola:"world", hello:"world"})
        })

        it('second level merge', ()=>{
            const data1 = {
                "hi": "world",
                "other":{
                    "ping": "pong"
                }
            }

            const data2= {
                "other": {
                    "peperoni": "sofrito"
                }
            }

            const result = subject(data1, data2)
            expect(result).toEqual({
                "hi": "world",
                "other": {
                    "ping": "pong",
                    peperoni: "sofrito",
                }
            })
        })

        it('nothing in the first', ()=>{
            const data1= {}
            const data2= {
                key1: "something",
                key2: {
                    subkey: "other"
                }
            }
            const result = subject(data1, data2)
            expect(result).toEqual(data2)
        })

        it('It won\'t merge arrays', ()=>{
            const data1= {something: []}
            const data2= {somethingElse: {
                array: []
            }}

            const result = subject(data1, data2)
            expect(result).toEqual({
                something: [],
                somethingElse: {
                    array: []
                }
            })
        })
    })
})