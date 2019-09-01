import * as fs from 'fs';
import * as path from 'path';

class DataBase<T> {
    private dbPath: string;

    constructor(fileName: string, app: Electron.App, def: T){
        const userData = app.getPath('userData')
        this.dbPath = path.join(userData, fileName)
        if (!fs.existsSync(userData)){
            fs.mkdirSync(userData)
        }
        if (!fs.existsSync(this.dbPath)){
            this.write(def);
        }
    }

    read(): T{
        return JSON.parse(fs.readFileSync(this.dbPath, {encoding: "utf-8"}))
    }

    write(data: T){
        fs.writeFileSync(this.dbPath, JSON.stringify(data), {encoding: "utf-8"})
    }
}

export default DataBase;