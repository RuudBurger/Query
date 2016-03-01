'use strict';

import React from 'react';
//import Reflux from 'reflux';
var ipc = window.require('electron').ipcRenderer;

import Device from '../icon';

export default React.createClass({

	timeout: null,
	devices: [
		{type: 'phone', enabled: true, size: [320, 480]},
		{type: 'phone', orientation: 'landscape', size: [480, 320]},
		{type: 'tablet', size: [768, 1024]},
		{type: 'tablet', enabled: true, orientation: 'landscape', size: [1024, 768]},
		{type: 'laptop', enabled: false, size: [1280, 700]},
		{type: 'desktop', size: [1680, 1200]},
		{type: 'tv', size: [1920, 1080]}
	],

	getInitialState(){
		return {
			url: ''
		}
	},

	componentDidMount(){
		//setInterval(() => {
		//	this.setState({});
		//}, 2000);
	},

	componentWillMount(){

		this.enabledDevices().forEach(dev => {
			ipc.send('toggle-device', dev.type, dev.size[0], dev.size[1] + 44);
		});

		ipc.on('set-url', this.updateUrl);
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

	//shuffle: function(arr){
	//	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
	//	return arr;
	//},

	enabledDevices(){
		return this.devices.filter(dev => dev.enabled);
	},

	render(){
		var devices = this.enabledDevices().map((dev, nr) =>
			<a href="">
				<Device key={'device-' + nr} type={dev.type} orientation={dev.orientation || null} />
			</a>
		);

		return (
			<div className="controls">
				<div className="input">
					<input value={this.state.url} defaultValue={this.state.url}
						   ref="input" type="text" placeholder="https://yourresponsive.site"
						   onKeyDown={this.onKeyDown}
						   onChange={this.onChange} />
				</div>
				<div className="actions">
					<div className="devices">
						{devices}
					</div>
					<a href="#" className="add"><span /><span /></a>
				</div>
			</div>
		);
	}
});
