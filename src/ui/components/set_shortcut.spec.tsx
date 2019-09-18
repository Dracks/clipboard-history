import { fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import Subject from './set_shortcut'

describe('SetShortcut', ()=>{
    let query: RenderResult
    let onSave: jest.Mock

    beforeEach(()=>{
        onSave = jest.fn()
    })
    const mount = ()=>{
        query = render(<Subject title="Some Mock Title" save={onSave} value="peperoni" />)
    }

    it('Renders well', ()=>{
        mount()
        expect(query.container).toMatchSnapshot()
    })

    it('when click opens modal window', ()=>{
        mount()
        fireEvent.click(query.getByRole('textbox'))
        expect(query.container.parentElement).toMatchSnapshot("Showing the modal")
        fireEvent.click(query.getByText('Save and close'))
        expect(onSave).toBeCalledTimes(0)
    })

    it('when adding new shortcut it saves correctly', ()=>{
        mount()
        fireEvent.click(query.getByRole('textbox'))
        fireEvent.keyDown(window, {key: 'Alt'})
        fireEvent.keyDown(window, {key: 'A'})
        fireEvent.click(query.getByText('Save and close'))
        expect(onSave).toBeCalledTimes(1)
        expect(onSave).toBeCalledWith("Alt+A")
    })
})