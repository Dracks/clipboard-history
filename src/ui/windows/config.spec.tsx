import { fireEvent, render, RenderResult } from '@testing-library/react'
import React from 'react'
import { Config, initialConfig } from '../../common/config'
import Subject from './config'


describe('ui/windows/config', ()=>{
    let onSave: jest.Mock
    let query: RenderResult

    beforeEach(()=>{
        onSave = jest.fn()

        //euiIconSpied = jest.spyOn(EuiIcon as any, "loadIconComponent").mockReturnValue(null)
    })
    const mount = (data: Config)=>{
        query = render(<Subject data={data} save={onSave}/>)
    }

    afterEach(()=>{
        query.unmount()
    })

    it('Renders well', ()=>{
        mount(initialConfig)
        expect(query.container).toMatchSnapshot()
    })

    it('Restore defaults', ()=>{
        const config : Config = {
            ...initialConfig,
            shortcuts: {
                ...initialConfig.shortcuts,
                next: "Ping Pollo"
            }
        }
        mount(config)
        expect(query.container).toMatchSnapshot("Button refresh not disabled")

        const button = query.getAllByRole('button').filter(e=>e.getAttribute('disabled')===null)
        expect(button).toHaveLength(1)
        fireEvent.click(button[0])
        expect(onSave).toBeCalledTimes(1)
        expect(onSave).toBeCalledWith(initialConfig)
    })

    it('Change configuration for the tray', ()=>{
        mount(initialConfig)

        // Tray length
        let search = query.getByText('Length show in tray')
        const input = search.nextElementSibling!.firstChild!.firstChild as HTMLInputElement
        fireEvent.change(input, {target: {value: "30"}})

        expect(onSave).toBeCalledTimes(1)
        expect(onSave).toBeCalledWith({
            ...initialConfig,
            tray: {
                trim: false,
                size: 30
            }
        })

        // Trim tray
        search = query.getByText('Trim clipboard values')
        const checkbox = search.previousElementSibling!.previousElementSibling as HTMLInputElement
        fireEvent.click(checkbox)

        expect(onSave).toBeCalledTimes(2)
        expect(onSave).toBeCalledWith({
            ...initialConfig,
            tray: {
                trim: true,
                size: 20
            }
        })
    })
})
