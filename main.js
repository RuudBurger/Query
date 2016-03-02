'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
var settings_shown = false;
var device_windows = [];
var window_size = [750, 80];

var createWindow = function () {
	mainWindow = new BrowserWindow({
		width: window_size[0],
		height: window_size[1],
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
electron.ipcMain.on('toggle-device', function(e, nr, width, height){

	var w = device_windows[nr];
	if (!w) {
		w = new BrowserWindow({
			width: width || 600,
			height: height || 400,
			minHeight: 100,
			minWidth: 200,
			frame: false
		});
		device_windows[nr] = w;

		// Emitted when the window is closed.
		w.on('closed', function() {
			w = null;
			device_windows.splice(nr, 1);

			if(mainWindow && mainWindow.webContents){
				mainWindow.webContents.send('close-device', nr);
			}
		});

		w.loadURL('http://127.0.0.1:9010/#/device');
		//w.webContents.openDevTools();
	}

});

electron.ipcMain.on('resize-device', function(e, nr, width, height){

	var w = device_windows[nr];
	if (w) {
		w.focus();
		mainWindow.focus();

		var current = w.getBounds();

		var diff_width = current.width - width,
			diff_height = current.height - height;

		current.width = width;
		current.height = height;
		current.x = current.x + (diff_width/2);
		current.y = current.y + (diff_height/2);

		w.setBounds(current, true);
	}

});

electron.ipcMain.on('set-url', function(e, url){
	mainWindow.webContents.send('set-url', url);

	device_windows.forEach(w => {
		w.webContents.send('set-url', url);
	});
});

electron.ipcMain.on('toggle-settings', function(e){
	settings_shown = !settings_shown;

	var width = window_size[0],
		height = window_size[1];

	if(settings_shown){
		height += window_size[1];
	}

	mainWindow.setSize(width, height, true);
});
