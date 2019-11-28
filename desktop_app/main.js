const { app, BrowserWindow } = require('electron')
// const path = require('path');

// const pathstr = path.resolve('../front_end/dist/Quack/index.html');
// console.log(pathstr);

let win;

function createWindow () {
  // 新規ウインドウ生成
  win = new BrowserWindow({
    width: 1920*0.5, 
    height: 1080*0.5,
    useContentSize: true,
    transparent: true,
    frame: true
  });

  win.loadURL(`file://${__dirname}/Quack-Desctop/dist/Quack/index.html`);

  //// 起動時に開発者ツールを開く　（コメントアウトしてます）
  //win.webContents.openDevTools()

  // ウインドウが閉じたときのイベント
  win.on('closed', function () {
    win = null
  })
}

// Electron初期化時にウィンドウ生成
app.on('ready', createWindow)

// すべてのウインドウが閉じたときにElectronを終了する。
app.on('window-all-closed', function () {

  // macOSの場合
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOSの場合
  if (win === null) {
    createWindow()
  }
})
