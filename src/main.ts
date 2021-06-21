import { QApplication } from '@nodegui/nodegui';
import { EventEmitter } from 'events';
import { Config, initialConfig } from './common/config';
import ConfigService from './main/config/config.service';
import Core from './main/core/core';
import DataBase from './main/core/db';
import { ClipboardEventEmitter, ClipboardValue } from './main/types';
//import { NodeNotificationSystem } from './main/ui/notifications';

import ClipboardHistoryTray from './main/ui/tray';
import WindowManager from './main/ui/window-manager';
import NotifierUI from './main/ui/notifier';
import { NodeNotificationSystem } from './main/ui/notifications';
import envPaths from 'env-paths';

import NN = require('node-notifier')

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
    node: new NodeNotificationSystem(NN),
})

const tray = new ClipboardHistoryTray(bus, configService, app);
//tray.registerOpen()

//const shortcuts = new ClipboardShortcuts(bus, configService, globalShortcut);
//shortcuts.registerShortcuts()

const db = new DataBase<Array<ClipboardValue>>('clipboard.json', getPathMock, [])

const core = new Core(bus, configService, QApplication.clipboard(), db)
core.startMonitoringClipboard()
console.log("We are readier")