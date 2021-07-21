const { app, BrowserWindow, Menu } = require('electron')

// Set env
process.env.NODE_ENV = 'development'
const isDev = process.env.NODE_ENV !== 'production' ? true : false

let mainWin
let aboutWin

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: isDev ? 1120 : 440,
    // width: 440,
    height: 800,
    minWidth: 370,
    minHeight: 600,
    icon: `${__dirname}/assets/icons/tetris.png`,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })
  // if (isDev) mainWin.webContents.openDevTools()
  mainWin.loadFile('./app/index.html')
  // mainWin.loadURL(`file://${__dirname}/app/index.html`)
}

function createAboutWindow() {
  aboutWin = new BrowserWindow({
    width: 640,
    height: 360,
    autoHideMenuBar: true,
    icon: `${__dirname}/assets/icons/tetris.png`,
  })
  aboutWin.setResizable(false)
  aboutWin.loadFile('./app/about.html')
  // aboutWin.loadURL(`file://${__dirname}/app/about.html`)
}


app.on('ready', () => {
  createMainWindow()
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  mainWin.on('closed', () => mainWin = null)
})

const menu = [
  {
    label: 'File', submenu:
      [
        { role: 'close', accelerator: 'Ctrl+Q' },
        { label: 'About', click: createAboutWindow },
      ],
  },
  {
    label: 'Dev',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'toggledevtools', label: 'Dev Tools', accelerator: 'Ctrl+D' },
    ]
  }
]