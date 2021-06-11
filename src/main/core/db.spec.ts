import { QApplication } from '@nodegui/nodegui';
import * as fs from 'fs';
import DataBase from './db';

const TEST_PATH='/tmp/test-clipboard-manager'

describe('Database', ()=>{
    let subject: DataBase<any>
    let app: jest.Mocked<{getPath: ()=>string} & QApplication>

    beforeEach(()=>{
        app = {
            getPath: jest.fn().mockReturnValue(TEST_PATH)
        } as any

        subject = new DataBase('empty-array.json', app, [])
    })
    afterAll(()=>{
        fs.unlinkSync(TEST_PATH+"/empty-array.json")
        fs.rmdirSync(TEST_PATH)

    })

    it('Starting by default', ()=>{
        expect(subject).toBeTruthy()
        expect(app.getPath).toBeCalledTimes(1)
        expect(app.getPath).toBeCalledWith('userData')
        expect(fs.existsSync(TEST_PATH+'/empty-array.json')).toBeTruthy()
    })

    it('Automatically full the new defaults', ()=>{
        const file = "withSomeInfo.json"
        fs.writeFileSync(TEST_PATH+"/"+file, '{"key1":"value"}', {encoding: "utf-8"})

        subject = new DataBase(file, app, {newKey: {subkey: "I'm here"}})

        const data = fs.readFileSync(TEST_PATH+"/"+file, {encoding: "utf-8"})
        expect(JSON.parse(data)).toEqual({key1: "value", newKey: {subkey: "I'm here"}})
        fs.unlinkSync(TEST_PATH+"/"+file)
    })

    it('It writtes correctly the content', ()=>{
        const dataToSave = {"something":"is saved"}
        subject.write(dataToSave)

        const data = fs.readFileSync(TEST_PATH+'/empty-array.json', {encoding: "utf-8"})
        expect(JSON.parse(data)).toEqual(dataToSave)
    })

    it('Read the file correctly', ()=>{
        fs.writeFileSync(TEST_PATH+"/empty-array.json", '{"something": "To Be Read"}', {encoding:"utf-8"})

        expect(subject.read()).toEqual({"something": "To Be Read"})
    })
})