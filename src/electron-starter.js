const { app, BrowserWindow, ipcMain } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const url = require('url');
const PouchDB = require('pouchdb');

let mainWindow;

ipcMain.on('addNewRequest', (e, args) => {
  const request = JSON.parse(args);
  const db = new PouchDB('request_log');
  const now = new Date();
  const doc = Object.assign({ timeRequested: now }, request);
  db
    .post(doc)
    .then(response => {
      doc.id = response.id;
      e.sender.send('addNewRequestResponse', JSON.stringify({ doc }));
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
});

ipcMain.on('closeRequest', (e, args) => {
  const request = JSON.parse(args);
  const db = new PouchDB('request_log');
  db
    .get(request.id)
    .then(doc => {
      const updatedDoc = Object.assign({ timeClosed: new Date() }, doc);
      e.sender.send('closeRequestResponse', JSON.stringify({ updatedDoc }));
      return db.put(updatedDoc);
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
});

ipcMain.on('getAllRequests', e => {
  const db = new PouchDB('request_log');
  db
    .getAll()
    .then(docs => {
      e.sender.send('getAllRequestsResponse', JSON.stringify({ docs }));
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
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
  mainWindow.setFullScreen(true);
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
