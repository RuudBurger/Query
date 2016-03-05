'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const shell = electron.shell;

const crashReporter = electron.crashReporter;
crashReporter.start();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var developing = process.env.NODE_ENV == 'development';
var root_url = developing ? 'http://127.0.0.1:9010/' : `file://${__dirname}/index.html`;

let mainWindow;
let menu;
let template;
let settings_shown = false;
let device_windows = {};
let window_size = [750, 80];
let current_url = null;

var createWindow = function () {
	mainWindow = new BrowserWindow({
		width: window_size[0],
		height: window_size[1],
		resizable: false,
		maximizable: false,
		title: 'Sizer',
		frame: false
	});

	mainWindow.loadURL(root_url);

	//if(developing){
	//	mainWindow.webContents.openDevTools({
	//		detach: true
	//	});
	//}

	mainWindow.webContents.on('did-finish-load', function(){
		mainWindow.webContents.send('set-url', current_url);
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	createMenu();

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

		w.on('focus', function(){
			if(mainWindow && mainWindow.webContents){
				mainWindow.webContents.send('focus-device', id);
			}
		});

		w.on('blur', function(){
			if(mainWindow && mainWindow.webContents){
				mainWindow.webContents.send('blur-device', id);
			}
		});

		w.loadURL(root_url + '#/device');
		w.webContents.on('did-finish-load', function(){
			if(current_url) w.webContents.send('set-url', current_url);
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

		w.setBounds(current);
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

var createMenu = function(){
	if (process.platform === 'darwin') {

		template = [{
			label: 'Sizer',
			submenu: [{
				label: 'About Sizer',
				selector: 'orderFrontStandardAboutPanel:'
			}, {
				type: 'separator'
			}, {
				label: 'Hide Sizer',
				accelerator: 'Command+H',
				selector: 'hide:'
			}, {
				label: 'Hide Others',
				accelerator: 'Command+Shift+H',
				selector: 'hideOtherApplications:'
			}, {
				label: 'Show All',
				selector: 'unhideAllApplications:'
			}, {
				type: 'separator'
			}, {
				label: 'Quit',
				accelerator: 'Command+Q',
				click() {
					app.quit();
				}
			}]
		}, {
			label: 'View',
			submenu: (process.env.NODE_ENV === 'development') ? [{
				label: 'Reload',
				accelerator: 'Command+R',
				click() {
					mainWindow.restart();
				}
			}, {
				label: 'Toggle Developer Tools',
				accelerator: 'Alt+Command+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}] : []
		}, {
			label: 'Window',
			submenu: [{
				label: 'Minimize',
				accelerator: 'Command+M',
				selector: 'performMiniaturize:'
			}, {
				label: 'Close',
				accelerator: 'Command+W',
				selector: 'performClose:'
			}, {
				type: 'separator'
			}, {
				label: 'New Device',
				accelerator: 'Command+N',
				click() {
					mainWindow.webContents.send('add-device');
				}
			}, {
				type: 'separator'
			}, {
				label: 'Bring All to Front',
				selector: 'arrangeInFront:'
			}]
		}, {
			label: 'Help',
			submenu: [{
				label: 'Learn More',
				click() {
					shell.openExternal('http://sizer.xyz');
				}
			}, {
				label: 'Search Issues',
				click() {
					shell.openExternal('https://github.com/RuudBurger/Sizer/issues');
				}
			}]
		}];

		menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	} else {

		template = [{
			label: '&File',
			submenu: [ {
				label: '&Close',
				accelerator: 'Ctrl+W',
				click() {
					mainWindow.close();
				}
			}]
		}, {
			label: '&View',
			submenu: (process.env.NODE_ENV === 'development') ? [{
				label: '&Reload',
				accelerator: 'Ctrl+R',
				click() {
					mainWindow.restart();
				}
			}, {
				label: 'Toggle &Developer Tools',
				accelerator: 'Alt+Ctrl+I',
				click() {
					mainWindow.toggleDevTools();
				}
			}] : []
		}, {
			label: 'Help',
			submenu: [{
				label: 'Learn More',
				click() {
					shell.openExternal('http://sizer.xyz');
				}
			}, {
				label: 'Search Issues',
				click() {
					shell.openExternal('https://github.com/RuudBurger/Sizer/issues');
				}
			}]
		}];

		menu = Menu.buildFromTemplate(template);
		mainWindow.setMenu(menu);
	}
}
