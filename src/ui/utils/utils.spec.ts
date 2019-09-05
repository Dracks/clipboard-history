import { getGeneric } from "./utils";

describe('utils', ()=>{

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
