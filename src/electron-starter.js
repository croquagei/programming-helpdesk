const { app, BrowserWindow, ipcMain } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const url = require('url');

let mainWindow;

ipcMain.on('testMessage', (e, args) => {
  console.log(args);
  e.sender.send('testResponse', 'coming in loud and clear, harry potter');
});

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);
  mainWindow.webContents.openDevTools();
  // mainWindow.setFullScreen(true);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
