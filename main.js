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
	  template.unshift(
    {
      label: 'File'
    },
    {
      label : 'Edit'
    },
    {
      label: 'View'
    },
    {
		label: 'Help',
		submenu: [
		  {
			label: 'Check For Update',
			click(){
			  autoUpdater.checkForUpdates();
			}
		  },
		  {
			label: 'Version: '+app.getVersion()
		  },
		]
    }
  )
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
  let message = 'DMS 2.0 new update is now available. It will be installed the next time you restart the application.';
    dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch'],
    defaultId: 0,
    detail: message
  }, response => {
    if (response === 0) {
      dialog.showMessageBox({
        type:'info',
        detail:'Please wait update is in progess'
      })
    }
  });
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    type:'info',
    detail:'No new update available',
    buttons:['OK']
  });
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
})
autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();  
})
app.on('ready', () => {
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
	createDefaultWindow();
});
app.on('window-all-closed', () => {
  app.quit();
});