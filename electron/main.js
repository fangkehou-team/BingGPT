import {app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, shell, protocol, net} from 'electron'
import contextMenu from 'electron-context-menu'
import path from 'node:path'
import Store from 'electron-store'
import * as urlUtil from "node:url"
import {autoUpdater, UpdateInfo} from "electron-updater"
import * as url from "node:url"
import packageJson from "../package.json";
import requestAllMediaAccess from "./macPermission";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

app.commandLine.appendSwitch('disable-site-isolation-trials');

let mainWindow
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

//config init
const configSchema = {
    theme: {
        enum: ['system', 'light', 'dark'],
        default: 'system',
    },
    fontSize: {
        enum: [14, 16, 18, 20],
        default: 14,
    },
    alwaysOnTop: {
        type: 'boolean',
        default: false,
    },
}
const config = new Store({schema: configSchema, clearInvalidConfig: true})

function getWrapperUrl() {
    // and load the index.html of the app.
    if (VITE_DEV_SERVER_URL) {
        return VITE_DEV_SERVER_URL;
    } else {
        return urlUtil.format({
            protocol: 'edge',
            slashes: true,
            host: "copilot",
            pathname: 'index.html'
        })
    }
}

function createWindow() {

    // Get theme settings
    const theme = config.get('theme')
    const isDarkMode =
        theme === 'system'
            ? nativeTheme.shouldUseDarkColors
            : theme === 'dark'
                ? true
                : false

    nativeTheme.themeSource = theme

    //request camera and microphone permission(only for macOS)
    if (process.platform === 'darwin') {
        requestAllMediaAccess();
    }

    // win = new BrowserWindow({
    //   icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload.js'),
    //   },
    // })

    mainWindow = new BrowserWindow({
        title: 'BingGPT',
        backgroundColor: isDarkMode ? '#1c1c1c' : '#eeeeee',
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        width: 601,
        height: 800,
        // titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: isDarkMode ? '#333333' : '#ffffff',
            symbolColor: isDarkMode ? '#eeeeee' : '#1c1c1c',
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true
        },
    })

    // Get always on top settings
    const alwaysOnTop = config.get('alwaysOnTop')
    mainWindow.setAlwaysOnTop(alwaysOnTop)

    // darwin表示macOS，针对macOS的设置  process.platform === 'darwin'
    if (process.platform === 'darwin') {
        const template = [{
            //label: '我的应用',
            label: 'BingGPT',
            submenu: [
                {label: 'About BingGPT', accelerator: 'CmdOrCtrl+I', role: 'about'},
                {type: 'separator'},
                {label: 'Hide BingGPT', role: 'hide'},
                {label: 'Hide Others', role: 'hideOthers'},
                {type: 'separator'},
                {label: 'Services', role: 'services'},
                {label: 'Quit BingGPT', accelerator: 'Command+Q', role: 'quit'}
            ]
        },
            {
                label: 'Edit',
                submenu: [
                    {label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
                    {label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
                    {label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
                    {label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo'},
                    {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo'},
                    {label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll'}
                ]
            }]
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    } else {
        // windows及linux系统 Hide main menu
        Menu.setApplicationMenu(Menu.buildFromTemplate([]))
    }
    // Create context menu
    contextMenu({
        window: mainWindow.webContents,
        showServices: true,
        showSelectAll: false,
        append: (defaultActions, parameters, browserWindow) => [
            {
                label: 'Open Devtools',
                visible: parameters.selectionText.trim().length === 0,
                click: () => {
                    mainWindow.webContents.openDevTools();
                },
            },
            {
                label: 'Reload',
                visible: parameters.selectionText.trim().length === 0,
                click: () => {
                    mainWindow.reload()
                },
            },
            {
                label: 'Export',
                visible: parameters.selectionText.trim().length === 0,
                submenu: [
                    {
                        label: 'Markdown',
                        click() {
                            mainWindow.webContents.send('export', 'md', isDarkMode)
                        },
                    },
                    {
                        label: 'PNG',
                        click() {
                            mainWindow.webContents.send('export', 'png', isDarkMode)
                        },
                    },
                    {
                        label: 'PDF',
                        click() {
                            mainWindow.webContents.send('export', 'pdf', isDarkMode)
                        },
                    },
                ],
            },
            {
                type: 'separator',
                visible: parameters.selectionText.trim().length === 0,
            },
            {
                label: 'Always on Top',
                type: 'checkbox',
                checked: mainWindow.isAlwaysOnTop() ? true : false,
                visible: parameters.selectionText.trim().length === 0,
                click: () => alwaysOnTopHandler(),
            },
            {
                type: 'separator',
                visible: parameters.selectionText.trim().length === 0,
            },
            {
                label: 'Appearance',
                visible: parameters.selectionText.trim().length === 0,
                submenu: [
                    {
                        label: 'Theme',
                        submenu: [
                            {
                                label: 'System',
                                type: 'radio',
                                checked: config.get('theme') === 'system',
                                click() {
                                    themeHandler('system')
                                },
                            },
                            {
                                label: 'Light',
                                type: 'radio',
                                checked: config.get('theme') === 'light',
                                click() {
                                    themeHandler('light')
                                },
                            },
                            {
                                label: 'Dark',
                                type: 'radio',
                                checked: config.get('theme') === 'dark',
                                click() {
                                    themeHandler('dark')
                                },
                            },
                        ],
                    },
                    {
                        label: 'Font Size',
                        submenu: [
                            {
                                label: 'Default',
                                type: 'radio',
                                checked: config.get('fontSize') === 14,
                                click() {
                                    fontSizeHandler(14)
                                },
                            },
                            {
                                label: 'Medium',
                                type: 'radio',
                                checked: config.get('fontSize') === 16,
                                click() {
                                    fontSizeHandler(16)
                                },
                            },
                            {
                                label: 'Large',
                                type: 'radio',
                                checked: config.get('fontSize') === 18,
                                click() {
                                    fontSizeHandler(18)
                                },
                            },
                            {
                                label: 'Extra Large',
                                type: 'radio',
                                checked: config.get('fontSize') === 20,
                                click() {
                                    fontSizeHandler(20)
                                },
                            },
                        ],
                    },
                ],
            },
            {
                type: 'separator',
                visible: parameters.selectionText.trim().length === 0,
            },
            {
                label: 'Reset',
                visible: parameters.selectionText.trim().length === 0,
                click: () => {
                    mainWindow.webContents.session.clearStorageData().then(() => {
                        mainWindow.reload()
                    })
                },
            },
            {
                type: 'separator',
                visible: parameters.selectionText.trim().length === 0,
            },
            {
                label: 'Feedback',
                visible: parameters.selectionText.trim().length === 0,
                click: () => {
                    shell.openExternal('https://github.com/fangkehou-team/BingGPT_Enhanced_Editon/issues')
                },
            },
            {
                label: `BingGPT v${packageJson.version}`,
                visible: parameters.selectionText.trim().length === 0,
                click: () => {
                    shell.openExternal('https://github.com/fangkehou-team/BingGPT_Enhanced_Editon/releases')
                },
            },
        ],
    })

    const bingUrl = getWrapperUrl()
    mainWindow.loadURL(urlUtil.format(bingUrl), {
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
    })

    // mainWindow.webContents.openDevTools();

    // Open links in default browser
    mainWindow.webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url)
        return {action: 'deny'}
    })
    // Login
    // mainWindow.webContents.on('will-redirect', (event, url) => {
    //     if (
    //         url.indexOf('https://bing.com') !== -1
    //     ) {
    //         event.preventDefault()
    //         // Get cookies
    //         mainWindow.loadURL("https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=11&ct=1705494251&rver=6.0.5286.0&wp=MBI_SSL&wreply=https:%2F%2fwww.bing.com%2Fsecure%2FPassport.aspx%3Fpopup%3D1%26ssl%3D1&lc=1033&id=264960&checkda=1")
    //     }
    // })
    // Modify Content Security Policy
    mainWindow.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            let responseHeaders = details.responseHeaders
            const CSP = responseHeaders['content-security-policy']
            if (details.url === bingUrl && CSP) {
                responseHeaders['content-security-policy'] = CSP[0]
                    .replace(`require-trusted-types-for 'script'`, '')
                    .replace('report-to csp-endpoint', '')
                callback({
                    cancel: false,
                    responseHeaders,
                })
            } else {
                return callback({cancel: false})
            }
        }
    )
    // Always on top
    const alwaysOnTopHandler = () => {
        config.set('alwaysOnTop', !mainWindow.isAlwaysOnTop())
        mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
    }
    // Theme
    const themeHandler = (newTheme) => {
        config.set('theme', newTheme)
        dialog
            .showMessageBox(mainWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                message: 'Theme Saved',
                detail: 'Do you want to reload BingGPT now?',
            })
            .then((result) => {
                if (result.response === 0) {
                    mainWindow.close()
                    createWindow()
                }
            })
    }
    // Font size
    const fontSizeHandler = (newSize) => {
        config.set('fontSize', newSize)
        mainWindow.webContents.send('set-font-size', newSize)
    }
    // Shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
        const cmdKey = process.platform === 'darwin' ? input.meta : input.control
        if (cmdKey) {
            switch (input.code) {
                case 'KeyN':
                    mainWindow.webContents.send('new-topic')
                    event.preventDefault()
                    break
                case 'KeyR':
                    mainWindow.reload()
                    event.preventDefault()
                    break
                case 'KeyT':
                    alwaysOnTopHandler()
                    event.preventDefault()
                    break
                case 'KeyI':
                    mainWindow.webContents.send('focus-on-textarea')
                    event.preventDefault()
                    break
                case 'KeyS':
                    mainWindow.webContents.send('stop-responding')
                    event.preventDefault()
                    break
                case 'Equal':
                    if (
                        configSchema.fontSize.enum.indexOf(config.get('fontSize') + 2) !==
                        -1
                    ) {
                        fontSizeHandler(config.get('fontSize') + 2)
                        event.preventDefault()
                    }
                    break
                case 'Minus':
                    if (
                        configSchema.fontSize.enum.indexOf(config.get('fontSize') - 2) !==
                        -1
                    ) {
                        fontSizeHandler(config.get('fontSize') - 2)
                        event.preventDefault()
                    }
                    break
                case 'Comma':
                    mainWindow.webContents.send('switch-tone', 'left')
                    event.preventDefault()
                    break
                case 'Period':
                    mainWindow.webContents.send('switch-tone', 'right')
                    event.preventDefault()
                    break
                default:
                    if (input.code.indexOf('Digit') === 0) {
                        const id = input.code.split('Digit')[1]
                        mainWindow.webContents.send('quick-reply', Number(id))
                        event.preventDefault()
                    }
            }
        }
    })
    // Replace compose page or reload window
    // mainWindow.webContents.on('dom-ready', () => {
    //     const url = mainWindow.webContents.getURL()
    //     if (url === bingUrl) {
    //         mainWindow.webContents.send('replace-compose-page', isDarkMode)
    //     }
    //
    //     // if (url.indexOf('https://www.bing.com/') !== -1) {
    //     //     setTimeout(()=>{
    //     //         mainWindow.webContents.loadURL(urlUtil.format(bingUrl + "?login=1"));
    //     //     }, 3000);
    //     // }
    // })
}

protocol.registerSchemesAsPrivileged([
    {scheme: 'edge', privileges: {secure: true, standard: true, supportFetchAPI: true}}
])

app.whenReady().then(() => {

    protocol.handle('edge', (request) => {
        const fileUrl = new URL(request.url);

        // console.log(fileUrl)

        let fileString = urlUtil.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(process.env.DIST, fileUrl.pathname),
            ...fileUrl
        })

        // console.log(fileString);

        return net.fetch(fileString)
    })

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('update-available', (info) => {
        let result = dialog.showMessageBoxSync({
            message: "A new version of BingGPT available.\n",
            detail: `New version ${info.version} released. Would you like to download it?\nAnd if you don't want to update the whole Application，You can download the app.asar from the latest GitHub Action build that matches your platform and replace the original one on your own, which is just a file about 11 MB`,
            type: "info",
            buttons: ["Later", "Detail", "Download Now"],
            defaultId: 1,
            cancelId: 0,
            title: `New version ${info.version}`
        })

        if (result == 2) {
            autoUpdater.downloadUpdate()
        } else if (result == 1) {
            shell.openExternal('https://github.com/fangkehou-team/BingGPT_Enhanced_Editon/releases')
        }
    })

    autoUpdater.on('update-downloaded', (r) => {
        let result = dialog.showMessageBoxSync({
            message: "New version of BingGPT is ready for install.\n",
            detail: `Would you like to install now?`,
            type: "info",
            buttons: ["Later", "Install Now"],
            defaultId: 1,
            cancelId: 0,
            title: `New version is ready to install`
        })

        if (result == 1) {
            autoUpdater.quitAndInstall()
        }
    })

    autoUpdater.checkForUpdatesAndNotify()

    // Save to file
    ipcMain.on('export-data', (event, format, dataURL) => {
        if (format) {
            const fileName = `BingGPT-${Math.floor(Date.now() / 1000)}.${format}`
            let filters
            switch (format) {
                case 'md':
                    filters = [{name: 'Markdown', extensions: ['md']}]
                    break
                case 'png':
                    filters = [{name: 'Image', extensions: ['png']}]
                    break
                case 'pdf':
                    filters = [{name: 'PDF', extensions: ['pdf']}]
            }
            dialog
                .showSaveDialog(BrowserWindow.getAllWindows()[0], {
                    title: 'Export',
                    defaultPath: fileName,
                    filters: filters,
                })
                .then((result) => {
                    if (!result.canceled) {
                        const filePath = result.filePath
                        const data = dataURL.replace(/^data:\S+;base64,/, '')
                        fs.writeFile(filePath, data, 'base64', (err) => {
                            if (err) {
                                dialog.showMessageBox({
                                    type: 'info',
                                    message: 'Error',
                                    detail: err,
                                })
                            }
                        })
                    }
                })
        }
    })
    // Init style
    ipcMain.on('init-style', () => {
        const fontSize = config.get('fontSize')
        setTimeout(() => {
            if (fontSize !== 14) {
                BrowserWindow.getAllWindows()[0].webContents.send(
                    'set-font-size',
                    fontSize
                )
            }
            BrowserWindow.getAllWindows()[0].webContents.send('set-initial-style')
        }, 1000)
    })
    // Error message
    ipcMain.on('error', (event, detail) => {
        dialog.showMessageBox({
            type: 'info',
            message: 'Error',
            detail: detail,
        })
    })
    //getChatUrl
    ipcMain.on("get-chat-url", (event, page) => {

        // Get theme settings
        const theme = config.get('theme')
        const isDarkMode =
            theme === 'system'
                ? nativeTheme.shouldUseDarkColors
                : theme === 'dark'
                    ? true
                    : false
        const locale = app.getLocale() || 'en-US'

        // Load Bing
        event.returnValue = `https://edgeservices.bing.com/edgesvc/${page}?&${
            isDarkMode ? 'dark' : 'light'
        }schemeovr=1&FORM=SHORUN&udscs=1&udsnav=1&setlang=${locale}&features=udssydinternal&clientscopes=noheader,coauthor,chat,channelstable,&udsframed=1`

    })

    //getWrapperUrl
    ipcMain.on("get-wrapper-url", (event) => {
        event.returnValue = getWrapperUrl();
    })

    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
