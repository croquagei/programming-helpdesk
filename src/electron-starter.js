const { app, BrowserWindow, ipcMain } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const url = require('url');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;

ipcMain.on('addNewRequest', (e, args) => {
  const request = JSON.parse(args);
  const db = new sqlite3.Database('./request_log.db');
  const createQuery =
    'CREATE TABLE IF NOT EXISTS REQUEST (desc TEXT, unit TEXT, timeRequested INTEGER, timeClosed INTEGER)';
  const insertQuery = `INSERT INTO REQUEST VALUES("${request.desc}", "${
    request.unit
  }", strftime('%s','now'), NULL)`;
  const lastInsertIdQuery = 'SELECT last_insert_rowid() as id';
  db.serialize(() => {
    db.run(createQuery, err => {
      if (err) {
        e.sender.send(
          'errorResponse',
          JSON.stringify({ origin: 'electron create table query', err }),
        );
      }
    });
    db.run(insertQuery, err => {
      if (err) {
        e.sender.send(
          'errorResponse',
          JSON.stringify({ origin: 'electron insert query', err }),
        );
      }
    });
    db.get(lastInsertIdQuery, (err, row) => {
      if (err) {
        e.sender.send(
          'errorResponse',
          JSON.stringify({
            origin: 'electron select last insert id query',
            err,
          }),
        );
      } else {
        const response = Object.assign({ id: row.id }, request);
        e.sender.send('getAllRequestsResponse', JSON.stringify({ response }));
      }
    });
  });
  db.close();
});

ipcMain.on('closeRequest', (e, args) => {
  const request = JSON.parse(args);
  const db = new sqlite3.Database('./request_log.db');
  const updateQuery = `UPDATE REQUEST SET timeClosed = strftime('%s','now') WHERE rowid = ${
    request.id
  }`;
  db.run(updateQuery, err => {
    if (err) {
      e.sender.send(
        'errorResponse',
        JSON.stringify({ origin: 'electron update timeClosed query', err }),
      );
    }
  });
  db.close();
});

ipcMain.on('getAllRequests', e => {
  const db = new sqlite3.Database('./request_log.db');
  const selectAllQuery =
    'SELECT rowid AS id, desc, unit, timeRequested, timeClosed FROM REQUEST';
  db.all(selectAllQuery, (err, rows) => {
    if (err) {
      e.sender.send(
        'errorResponse',
        JSON.stringify({
          origin: 'electron select all requests query',
          err,
        }),
      );
    } else {
      e.sender.send('getAllRequestsResponse', JSON.stringify({ rows }));
    }
  });
  db.close();
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
