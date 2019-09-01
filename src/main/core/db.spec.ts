import * as fs from 'fs';
import DataBase from './db';

describe('Database', ()=>{
    let subject: DataBase<any>
    let app: jest.Mocked<Electron.App>

    beforeEach(()=>{
        app = {
            getPath: jest.fn().mockReturnValue('/tmp/test-clipboard-manager')
        } as any

        subject = new DataBase('empty-array.json', app, [])
    })
    afterAll(()=>{
        fs.unlinkSync(app.getPath('')+"/empty-array.json")
        fs.rmdirSync(app.getPath(''))

    })

    it('Starting by default', ()=>{
        expect(subject).toBeTruthy()
        expect(app.getPath).toBeCalledTimes(1)
        expect(app.getPath).toBeCalledWith('userData')
        expect(fs.existsSync(app.getPath('')+'/empty-array.json')).toBeTruthy()
    })

    it('It writtes correctly the content', ()=>{
        const dataToSave = {"something":"is saved"}
        subject.write(dataToSave)

        const data = fs.readFileSync(app.getPath('')+'/empty-array.json', {encoding: "utf-8"})
        expect(JSON.parse(data)).toEqual(dataToSave)
    })

    it('Read the file correctly', ()=>{
        fs.writeFileSync(app.getPath('')+"/empty-array.json", '{"something": "To Be Read"}', {encoding:"utf-8"})

        expect(subject.read()).toEqual({"something": "To Be Read"})
    })
})