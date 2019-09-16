import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React, { useEffect } from 'react';
import useKeyDown from './useKeyDown';


const TestCmp = ({onUpdate}: {onUpdate: (s:string[])=>void})=>{
    const keys = useKeyDown()
    useEffect(()=>onUpdate(keys), [keys])
    return <div />
}
describe('Use Key Down', ()=>{
    let onUpdate: jest.Mock

    beforeEach(()=>{
        onUpdate = jest.fn()

        render(<TestCmp onUpdate={onUpdate} />)
    })

    it('Catch all the elements', ()=>{
        expect(onUpdate).toBeCalledWith([])

        fireEvent.keyDown(window, {key:"Meta"})
        fireEvent.keyDown(window, {key:'Alt', repeat: true})
        expect(onUpdate).toBeCalledWith(["Meta"])
    })

    it('When repeating key, it will not take account', ()=>{
        fireEvent.keyDown(window, {key:"Meta"})
        expect(onUpdate).toBeCalledWith([ "Meta"])

        fireEvent.keyDown(window, {key:"Meta"})
        fireEvent.keyDown(window, {key:"Alt"})
        expect(onUpdate).toBeCalledWith(["Meta", "Alt"])
    })
})