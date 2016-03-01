'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

// Main window
app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 700,
		height: 80,
		x: 2000,
		y: 1500,
		frame: false
	});

	mainWindow.loadURL('http://127.0.0.1:9010/');

	mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
});

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
var device_windows = {};

electron.ipcMain.on('toggle-device', function (e, type, width, height) {

	var w = device_windows[type];
	if (!w) {
		w = new BrowserWindow({
			width: width || 600,
			height: height || 400,
			frame: false
		});
		device_windows[type] = w;

		// Emitted when the window is closed.
		w.on('closed', function () {
			w = null;
			device_windows[type] = null;
		});
	}

	w.loadURL('http://127.0.0.1:9010/#/device');
	w.webContents.openDevTools();


});
