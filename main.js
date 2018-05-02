const {app, BrowserWindow,Menu,dialog} = require('electron')
const path = require('path');
const url = require('url');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
let template = [];
let win = null;

	if (process.platform === 'win32') {
	  // OS X
	  const name = app.getName();
	  template.unshift({
		label: name,
		submenu: [
		  {
			label: 'Check For Update',
			click(){
			  autoUpdater.checkForUpdates();
			}
		  },
		  {
			label: 'Quit',
			accelerator: 'Command+Q',
			click() { app.quit(); }
		  },
		]
	  })
	}

  function createDefaultWindow () {
    app.server = require(path.join(__dirname, '/express/app.js'));
    // Create the browser window.
    win = new BrowserWindow({width: 2000, height: 1100})
    win.loadURL('http://localhost:8004/');
    win.focus();
    //win.webContents.openDevTools();
}

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update downloaded');
  let message = app.getName() +  ' is now available. It will be installed the next time you restart the application.';
    dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version of ' + app.getName() + ' has been downloaded',
    detail: message
  }, response => {
    if (response === 0) {
      setTimeout(() => app.quit(), 1);
    }
  });
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    type:'info',
    detail:'No Latest Upadate Available',
    buttons:['OK']
  });
  sendStatusToWindow("No Latest Upadate Available")

})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

app.on('ready', () => {
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
	createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});