'use strict';

import React from 'react';
//import Reflux from 'reflux';
var electron = window.require('electron');
var ipc = electron.ipcRenderer;
var remote = electron.remote;

import {TitleBar, IndeterminateProgressWheel} from 'react-desktop';

import $ from 'jquery';

export default React.createClass({

	getInitialState(){
		return {
			url: 'https://github.com/RuudBurger/Query',
			height: 0,
			width: 0
		}
	},

	componentDidMount(){
		$(window).on('resize', this.resize);

		ipc.on('set-url', this.updateUrl);

		var wv = this.refs.webview;
		wv.addEventListener('will-navigate', function(e){
			ipc.send('set-url', e.url);
		});

		wv.addEventListener('did-navigate-in-page', function(e){
			ipc.send('set-url', e.url);
		});

		wv.addEventListener("did-start-loading", this.toggleLoader);
		wv.addEventListener("did-stop-loading", this.toggleLoader);
	},

	toggleLoader(){
		this.setState({
			loading: this.refs.webview.isLoading()
		})
	},

	updateUrl(e, url){
		//p('update URL', url, this.state.url, this.refs.webview.src);

		if(url != this.state.url && url != this.refs.webview.src){
			this.setState({
				url: url
			});
		}
	},

	resize(){
		var w = $(window),
			width = w.width(),
			height = w.height() - 44;

		this.setState({
			height: height,
			width: width
		})
	},

	onSizeChange(){
		var size = this.refs.size.value.split(/\sx/);
		var width = Math.max(200, parseInt(size[0] || 400));
		var height = Math.max(200, parseInt(size[size.length-1] || 400));

		p(size, width, height);
		//p(size[0] || 400, size[size.length-1] || 400);
		remote.getCurrentWindow().setSize(width, height);
	},

	close(){
		remote.getCurrentWindow().close();
	},

	minimize(){
		remote.getCurrentWindow().minimize();
	},

	render(){
		var size = <input ref="size" type="text"
						  value={this.state.width + ' x ' + this.state.height}
						  defaultValue={this.state.width + ' x ' + this.state.height}
						  onChange={this.onSizeChange} />;

		return (
			<div className="device">
				<div className="title-controls">
					{size}
					<div className="loading">{this.state.loading ? <IndeterminateProgressWheel /> : null }</div>
				</div>
				<TitleBar className="title-bar"
					  controls
					  background={true}
					  onClosePress={this.close}
					  onMinimizePress={this.minimize}
				/>
				<webview ref="webview" src={this.state.url} />
			</div>
		);
	}
});
