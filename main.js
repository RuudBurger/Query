'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
var settings_shown = false;
var device_windows = {};
var window_size = [750, 80];
var current_url = null;

var createWindow = function () {
	mainWindow = new BrowserWindow({
		width: window_size[0],
		height: window_size[1],
		resizable: false,
		maximizable: false,
		title: 'Sizer',
		frame: false
	});

	mainWindow.loadURL('http://127.0.0.1:9010/');

	mainWindow.webContents.openDevTools({
		detach: true
	});

	mainWindow.webContents.on('did-finish-load', function(){
		mainWindow.webContents.send('set-url', current_url);
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
electron.ipcMain.on('add-device', function(e, id, width, height){
	var w = device_windows[id];
	if (!w) {
		w = new BrowserWindow({
			width: width || 600,
			height: height || 400,
			minHeight: 100,
			minWidth: 200,
			frame: false
		});
		device_windows[id] = w;

		// Emitted when the window is closed.
		w.on('closed', function() {

			w = null;
			delete device_windows[id];

			if(mainWindow && mainWindow.webContents){
				mainWindow.webContents.send('close-device', id);
			}
		});

		w.loadURL('http://127.0.0.1:9010/#/device');
		w.webContents.on('did-finish-load', function(){
			w.webContents.send('set-url', current_url);
		});
		//w.webContents.openDevTools();

		mainWindow.focus();
	}

});

electron.ipcMain.on('resize-device', function(e, id, width, height){
	//console.log('resize-device', id, width, height, device_windows.length);

	var w = device_windows[id];
	if (w) {
		w.focus();
		mainWindow.focus();

		var current = w.getBounds();

		var diff_width = current.width - width,
			diff_height = current.height - height;

		current.width = Math.round(width);
		current.height = Math.round(height);
		current.x = Math.round(Math.max(0, current.x + (diff_width/2)));
		current.y = Math.round(Math.max(0, current.y + (diff_height/2)));

		w.setBounds(current, true);
	}

});

electron.ipcMain.on('focus-device', function(e, id){
	//console.log('focus-device', id);

	var w = device_windows[id];
	if (w) {
		w.focus();
		mainWindow.focus();
	}
});

electron.ipcMain.on('set-url', function(e, url){
	mainWindow.webContents.send('set-url', url);

	Object.keys(device_windows).forEach(k => {
		if(device_windows[k]){
			device_windows[k].webContents.send('set-url', url);
		}
	});

	current_url = url;
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
