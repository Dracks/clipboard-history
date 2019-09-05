import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import ShortcutsRegister from './shortcuts.register';


describe('shortcuts register', ()=>{
    let keysPressed: string[];
    let onComplete: jest.Mock;
    let handler: ReturnType<typeof render>

    beforeEach(()=>{
        keysPressed = []
        onComplete = jest.fn()
        handler=render(<ShortcutsRegister onAllReleased={onComplete}>
            {({keys})=>{
                keysPressed=keys
                return <div></div>
            }}
        </ShortcutsRegister>)
    })

    it('When the keys go down, it updates the list', ()=>{
        expect(keysPressed).toEqual([])

        fireEvent.keyDown(window, {key:"Meta"})
        expect(keysPressed).toEqual(["Meta"])
        expect(onComplete).toBeCalledTimes(0)

        fireEvent.keyUp(window, {key:"Meta"})
        expect(onComplete).toBeCalledTimes(1)
        expect(onComplete).toBeCalledWith(["Meta"])
    })

    it('Adds multiples to the list', ()=>{
        fireEvent.keyDown(window, {key:"Meta"})
        fireEvent.keyDown(window, {key:"Alt"})
        fireEvent.keyDown(window, {key:"Control"})
        fireEvent.keyDown(window, {key:"A"})
        fireEvent.keyDown(window, {key:"B"})

        expect(keysPressed).toEqual(["Meta", "Alt", "Control", "A", "B"])
    })
})