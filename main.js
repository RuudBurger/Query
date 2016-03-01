'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
var device_windows = {}

var createWindow = function () {
	mainWindow = new BrowserWindow({
		width: 750,
		height: 80,
		x: 2000,
		y: 1500,
		resizable: false,
		maximizable: false,
		frame: false
	});

	mainWindow.loadURL('http://127.0.0.1:9010/');

	mainWindow.webContents.openDevTools({
		detach: true
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	//mainWindow.on('focus', function(){
	//	Object.keys(device_windows).forEach(key => {
	//		if(device_windows[key]){
	//			device_windows[key].focus();
	//		}
	//	});
	//});
};

// Main window
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

// Device windows

electron.ipcMain.on('toggle-device', function(e, type, width, height){

	var w = device_windows[type];
	if (!w) {
		w = new BrowserWindow({
			width: width || 600,
			height: height || 400,
			frame: false
		});
		device_windows[type] = w;

		// Emitted when the window is closed.
		w.on('closed', function() {
			w = null;
			device_windows[type] = null;
		});
	}

	w.loadURL('http://127.0.0.1:9010/#/device');
	w.webContents.openDevTools();

});

electron.ipcMain.on('close-device', function(e){
	console.log(e);
	//e.sender.close();
});

electron.ipcMain.on('set-url', function(e, url){
	mainWindow.webContents.send('set-url', url);

	Object.keys(device_windows).forEach(key => {
		if(device_windows[key]){
			device_windows[key].webContents.send('set-url', url);
		}
	});
});
