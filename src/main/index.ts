
import { app, BrowserWindow, clipboard, dialog, globalShortcut, ipcMain, Notification } from 'electron';
import { EventEmitter } from 'events';
import * as NodeNotifier from 'node-notifier';
import { Config, initialConfig } from '../common/config';
import ConfigService from './config/config.service';
import Core from './core/core';
import DataBase from './core/db';
import { name as title } from './package';
import { ClipboardEventEmitter, ClipboardValue } from './types';
import { ElectronNotificationSystem, NodeNotificationSystem } from './ui/notifications';
import NotifierUI from './ui/notifier';
import ClipboardShortcuts from './ui/shortcuts';
import ClipboardHistoryTray from './ui/tray';
import WindowManager from './window/window.manager';


app.on('second-instance', () => {
    dialog.showMessageBox({
        type: 'info',
        title,
        message: 'An instance of ' + title + ' already open'
    })
})

app.on('window-all-closed', (events: Event)=>{
    events.preventDefault()
})

app.on('ready', () => {
    const bus : ClipboardEventEmitter= new EventEmitter()

    const configDb = new DataBase<Config>('config.json', app, initialConfig)
    const windowManager = new WindowManager(ipcMain, BrowserWindow)
    const configService = new ConfigService(bus, configDb, windowManager)

    new NotifierUI(bus, configService, {
        node: new NodeNotificationSystem(NodeNotifier),
        electron: new ElectronNotificationSystem(Notification)
    })

    const tray = new ClipboardHistoryTray(bus, configService, app);
    tray.registerOpen()

    const shortcuts = new ClipboardShortcuts(bus, configService, globalShortcut);
    shortcuts.registerShortcuts()

    const db = new DataBase<Array<ClipboardValue>>('clipboard.json', app, [])

    const core = new Core(bus, configService, clipboard, db)
    core.startMonitoringClipboard()
    console.log("We are ready")

    // new WindowManager(ipcMain, BrowserWindow).create('Debug', "Test!")
})
