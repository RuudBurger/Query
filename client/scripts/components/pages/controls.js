'use strict';

import React from 'react';
//import Reflux from 'reflux';
var electron = window.require('electron');
var ipc = electron.ipcRenderer;

import classNames from 'classnames';

import Device from '../icon';

export default React.createClass({

	timeout: null,
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
		return {
			url: '',
			devices: [0]
		}
	},

	componentDidMount(){
		//setInterval(() => {
		//	this.setState({});
		//}, 2000);
	},

	componentWillMount(){

		this.enabledDevices().forEach((dev, nr) => {
			ipc.send('toggle-device', nr, dev.size[0], dev.size[1] + 44, dev.userAgent || null);
		});

		ipc.on('set-url', this.updateUrl);
		ipc.on('close-device', this.closeDevice);
	},

	closeDevice(e, nr){
		var devices = this.state.devices;
			devices.splice(nr, 1);

		this.setState({
			devices: devices
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
		return !/^https?:\/\//i.test(url) ? 'http://' + url : url;
	},

	toggleSettings(e){
		(e).preventDefault();
		ipc.send('toggle-settings');
	},

	addDevice(e){
		(e).preventDefault();

		var last_device = this.state.devices[this.state.devices.length - 1];
		var new_device_nr = last_device + 1;
		var new_device = this.devices[new_device_nr] || this.devices[0];

		var devices = this.state.devices;
			devices.push(new_device_nr);

		this.setState({
			devices: devices
		});

		ipc.send('toggle-device', this.state.devices.length-1, new_device.size[0], new_device.size[1] + 44, new_device.userAgent || null);
	},

	enabledDevices(){
		return this.state.devices.map(nr => this.devices[nr]);
	},

	deviceGrow(device_nr, e){
		(e).preventDefault();
		var devices = this.state.devices;
		devices[device_nr] = devices[device_nr]+1;

		this.setState({
			devices: devices
		});

		this.resizeDevice(device_nr);
	},

	deviceShrink(device_nr, e){
		(e).preventDefault();
		var devices = this.state.devices;
		devices[device_nr] = devices[device_nr]-1;

		this.setState({
			devices: devices
		});

		this.resizeDevice(device_nr);
	},

	resizeDevice(device_nr){
		var size = this.devices[this.state.devices[device_nr]].size;
		ipc.send('resize-device', device_nr, size[0], size[1] + 44);
	},

	deviceScroll(device_nr, e){
		if(e.deltaY < 0 && this.state.devices[device_nr] < this.devices.length-1){
			this.deviceGrow(device_nr, e);
		}
		else if(e.deltaY > 0 && this.state.devices[device_nr] > 0) {
			this.deviceShrink(device_nr, e);
		}
	},

	render(){
		var devices = this.enabledDevices().map((dev, nr) => {
			var classes = classNames('device', {
				'hide-shrink': this.state.devices[nr] == 0,
				'hide-grow': this.state.devices[nr] == this.devices.length-1
			})

			return <div className={classes} key={'device-' + nr}
						data-device={this.state.devices[nr]}
						onWheel={this.deviceScroll.bind(this, nr)}>
				<a className="change-size grow" href="#" onClick={this.deviceGrow.bind(this, nr)}></a>
				<Device type={dev.type} orientation={dev.orientation || null} />
				<a className="change-size shrink" href="#" onClick={this.deviceShrink.bind(this, nr)}></a>
			</div>
		});

		return (
			<div className="controls">
				<div className="main">
					<div className="input">
						<input value={this.state.url} defaultValue={this.state.url}
							   ref="input" type="text" placeholder="https://yourresponsive.site"
							   onKeyDown={this.onKeyDown}
							   onChange={this.onChange} />
					</div>
					<div className="actions">
						<a href="#" style={{display: 'none'}} className="settings" onClick={this.toggleSettings}><span /><span /><span /></a>
						<div className="devices">
							{devices}
						</div>
						<a href="#" className="add" onClick={this.addDevice}><span /><span /></a>
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
