'use strict';

import React from 'react';
//import Reflux from 'reflux';
var electron = window.require('electron');
var ipc = electron.ipcRenderer;
import Device from '../icon';

import classNames from 'classnames';


export default React.createClass({

	timeout: null,
	scroll: true,
	prev_scroll: 0,

	devices: [
		{type: 'phone', size: [320, 480], userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'},
		{type: 'phone', orientation: 'landscape', size: [480, 320], userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'},
		{type: 'tablet', size: [768, 1024], userAgent: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'},
		{type: 'tablet', orientation: 'landscape', size: [1024, 768], userAgent: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'},
		{type: 'laptop', size: [1280, 700]},
		{type: 'desktop', size: [1680, 1200]},
		{type: 'tv', size: [1920, 1080]}
	],

	getInitialState(){
		var saved_state = ls.get('control-state') || {};
		return Object.assign({
			url: 'http://sizer.xyz/',
			focused: null,
			devices: [{
				id: this.getId(),
				device: 0
			}]
		}, saved_state);
	},

	componentWillMount(){
		this.enabledDevices().forEach(dev => {
			this.addDevice(dev);
		});

		ipc.on('set-url', this.updateUrl);
		ipc.on('add-device', this.addDevice.bind(this, null));
		ipc.on('close-device', this.closeDevice);
		ipc.on('blur-device', this.blurDevice);
		ipc.on('focus-device', this.focusDevice);
	},

	componentWillUpdate(nextProps, nextState){
		ls.set('control-state', nextState);
	},

	getId(){
		return 'id-' + Date.now() + '-' + ((1.1+Math.random()).toString(36).substring(2, 7));
	},

	closeDevice(e, device_id){
		this.setState({
			devices: this.state.devices.filter(device =>  device.id != device_id)
		});
	},

	blurDevice(e, device_id){
		//p('blurDevice', device_id);
		if(this.state.focused == device_id){
			this.setState({
				focused: null
			});
		}
	},

	focusDevice(e, device_id){
		//p('focusDevice', device_id);
		this.setState({
			focused: device_id
		});
	},

	updateUrl(e, url){

		if(this.state.url != url){
			this.setState({
				url: url
			});
		}
	},

	onChange(){
		if(this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(this.setURL, 300);

		this.setState({
			url: this.getURL()
		});
	},

	onKeyDown(e){
		if(e.which == 13){
			this.setURL();
		}
	},

	setURL(){
		ipc.send('set-url', this.getURL());
	},

	getURL(){
		var url = this.refs.input.value;
		url = !/^https?:\/\//i.test(url) ? 'http://' + url : url;
		return url != 'http://' ? url : '';
	},

	toggleSettings(e){
		(e).preventDefault();
		ipc.send('toggle-settings');
	},

	addDevice(device, e){
		if(e && e.preventDefault) e.preventDefault();

		if(!device){
			var last_device = this.state.devices[this.state.devices.length - 1] || {device: -1};
			var new_device_nr = device !== null ? device : (last_device.device + 1) || 0;
			device = {
				id: this.getId(),
				device: new_device_nr
			};

			var devices = this.state.devices;
			devices.push(device);

			this.setState({
				devices: devices
			});
		}

		var new_device = this.devices[device.device];
		ipc.send('add-device', device.id, new_device.size[0], new_device.size[1] + 44, new_device.userAgent || null);

	},

	enabledDevices(){
		return this.state.devices;
	},

	deviceGrow(device_id, e){
		if(e) e.preventDefault();

		var device = this.getDevice(device_id);
			device.device += 1;
			device.device = device.device <= this.devices.length - 1 ? device.device : this.devices.length - 1;

		this.setState({
			devices: this.state.devices
		});

		this.resizeDevice(device_id);
	},

	deviceShrink(device_id, e){
		if(e) e.preventDefault();

		var device = this.getDevice(device_id);
		device.device -= 1;
		device.device = device.device >= 0 ? device.device : 0;

		this.setState({
			devices: this.state.devices
		});

		this.resizeDevice(device_id);
	},

	resizeDevice(device_id){
		var size = this.devices[this.getDevice(device_id).device].size;
		ipc.send('resize-device', device_id, size[0], size[1] + 44);
	},

	deviceScroll(device_id, e){
		(e).preventDefault();
		if(!this.scroll || e.deltaY == 0) return;

		var t = Date.now(),
			diff = t - this.prev_scroll;
		if(diff > 1000){
			if(e.deltaY < 0 && this.getDevice(device_id).device < this.devices.length-1){
				this.deviceGrow(device_id);
			}
			else if(e.deltaY > 0 && this.getDevice(device_id).device > 0) {
				this.deviceShrink(device_id);
			}
			this.prev_scroll = t;
		}
	},

	focusWindow(device_id){
		ipc.send('focus-device', device_id);
	},

	getDevice(device_id){
		return this.state.devices.find(dev => dev.id == device_id);
	},

	render(){
		var devices = this.enabledDevices().map((dev, nr) => {
			var classes = classNames('device', {
				'hide-shrink': dev.device == 0,
				'hide-grow': dev.device == this.devices.length-1,
				'focused': this.state.focused && this.state.focused == dev.id
			});

			var device = this.devices[dev.device];

			return <div className={classes} key={'device-' + dev.id}
						data-device={dev.device}
						onClick={this.focusWindow.bind(this, dev.id)}
						onWheel={this.deviceScroll.bind(this, dev.id)}>
				<a className="change-size grow" href="#" onClick={this.deviceGrow.bind(this, dev.id)}></a>
				<Device type={device.type} orientation={device.orientation || null} nr={nr+1} />
				<a className="change-size shrink" href="#" onClick={this.deviceShrink.bind(this, dev.id)}></a>
			</div>
		});

		return (
			<div className="controls">
				<div className="main">
					<div className="input">
						<input value={this.state.url} defaultValue={this.state.url}
							   ref="input" type="text" placeholder="http://sizer.xyz"
							   onKeyDown={this.onKeyDown}
							   onChange={this.onChange} />
					</div>
					<div className="actions">
						<a href="#" style={{display: 'none'}} className="settings" onClick={this.toggleSettings}><span /><span /><span /></a>
						<div className={'devices ' + (this.state.focused ? 'has-focus' : '')}>
							{devices}
						</div>
						<a href="#" className="add" onClick={this.addDevice.bind(this, null)}><span /><span /></a>
					</div>
				</div>
				<div className="sub">
					<div className="settings">
						<label>Screensize: <input /></label>
					</div>
				</div>
			</div>
		);
	}
});
