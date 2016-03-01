'use strict';

import React from 'react';
//import Reflux from 'reflux';
import Isvg from 'react-inlinesvg';
var ipc = window.require('electron').ipcRenderer;

import Device from '../icon';

export default React.createClass({

	devices: [
		{type: 'phone'},
		{type: 'phone', orientation: 'landscape'},
		{type: 'tablet'},
		{type: 'tablet', orientation: 'landscape'},
		{type: 'laptop'},
		{type: 'desktop'},
		{type: 'tv'}
	],

	componentDidMount(){
		setInterval(() => {
			this.setState({});
		}, 2000);
	},

	componentWillMount(){
		//ipc.send('toggle-device', 'mobile', 320, 480);
	},

	shuffle: function(arr){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	},

	render(){
		var devices = this.shuffle(this.devices).map((dev, nr) =>
			<Device key={'device-' + nr} type={dev.type} orientation={dev.orientation || null} />
		);

		return (
			<div className="controls">
				<div className="input">
					<input type="text" placeholder="https://yourresponsive.site" />
				</div>
				<div className="actions">
					<div className="devices">
						{devices}
					</div>
				</div>
			</div>
		);
	}
});
