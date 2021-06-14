import { QApplication, QSystemTrayIcon, QIcon, QMenu, QAction, QSettings, QUrl } from '@nodegui/nodegui';
import * as NodeNotifier from 'node-notifier';
import { EventEmitter } from 'events';
import { Config, initialConfig } from './common/config';
import ConfigService from './main/config/config.service';
import Core from './main/core/core';
import DataBase from './main/core/db';
import { ClipboardEventEmitter, ClipboardValue } from './main/types';
//import { NodeNotificationSystem } from './main/ui/notifications';
//import NotifierUI from './main/ui/notifier';
import ClipboardHistoryTray from './main/ui/tray';
import WindowManager from './main/ui/window-manager';
import NotifierUI from './main/ui/notifier';
import { NodeNotificationSystem } from './main/ui/notifications';
import envPaths from 'env-paths';
const path = envPaths('es.jaumesingla.clipboard-manager')

const getPathMock = {getPath: ()=>path.data}

const bus : ClipboardEventEmitter = new EventEmitter()
const app =  QApplication.instance()
app.setQuitOnLastWindowClosed(false)

const configDb = new DataBase<Config>('config.json', getPathMock, initialConfig)
const windowManager = new WindowManager()
const configService = new ConfigService(bus, configDb, windowManager)
configService.openEdit()

new NotifierUI(bus, configService, {
    node: new NodeNotificationSystem(NodeNotifier),
})

const tray = new ClipboardHistoryTray(bus, configService, app);
//tray.registerOpen()

//const shortcuts = new ClipboardShortcuts(bus, configService, globalShortcut);
//shortcuts.registerShortcuts()

const db = new DataBase<Array<ClipboardValue>>('clipboard.json', getPathMock, [])

const core = new Core(bus, configService, QApplication.clipboard(), db)
core.startMonitoringClipboard()
console.log("We are readier")

/*/
const app = QApplication.instance()

const trayIcon = new QSystemTrayIcon()
trayIcon.setIcon(new QIcon('assets/logox200.png'))
trayIcon.show()

const menu = new QMenu()
const exitAction = new QAction()
exitAction.setText('exit')
exitAction.addEventListener('triggered', ()=>app.exit(0))
menu.addAction(exitAction)

const qsettings = new QSettings("es.jaumesingla", "clipboard")
console.log(process.env)


trayIcon.setContextMenu(menu)
/*
app.addEventListener('Close', ()=>{
    app.exit(0)
})
*/

// setTimeout(()=>app.exit(0), 10000)