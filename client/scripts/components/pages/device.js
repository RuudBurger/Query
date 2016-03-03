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
		var w = $(window),
			width = w.width(),
			height = w.height() - 44;

		return {
			failed: false,
			url: '',
			userAgent: null,
			height: height,
			width: width
		}
	},

	componentDidMount(){
		$(window).on('resize', this.resize);

		ipc.on('set-url', this.updateUrl);

		var wv = this.refs.webview;
		wv.addEventListener('will-navigate', function(e){ ipc.send('set-url', e.url); });
		wv.addEventListener('did-navigate-in-page', function(e){ ipc.send('set-url', e.url); });
		wv.addEventListener('did-start-loading', this.startLoader);
		wv.addEventListener('did-stop-loading', this.stopLoader);
		wv.addEventListener('did-fail-load', this.showFailed);
	},

	showFailed(){
		this.setState({
			failed: true
		});
	},

	startLoader(){
		this.setState({
			failed: false,
			loading: true
		});
	},

	stopLoader(){
		this.setState({
			loading: false
		});
	},

	updateUrl(e, url){
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
		this.setState({
			width: parseInt(this.refs.size_x.value),
			height: parseInt(this.refs.size_y.value)
		});
	},

	doChangeSize(e){
		if(e.which == 13 || e.which === undefined) {
			var width = Math.max(200, parseInt(this.state.width) || 400);
			var height = Math.max(200, parseInt(this.state.height) || 400);

			var size = electron.screen.getPrimaryDisplay().workAreaSize;

			width = Math.min(size.width, width);
			height = Math.min(size.height, height);

			remote.getCurrentWindow().setSize(width, height + 44);
		}
	},

	close(){
		remote.getCurrentWindow().close();
	},

	minimize(){
		remote.getCurrentWindow().minimize();
	},

	render(){
		return (
			<div className={'device ' + (this.state.failed ? 'failed' : '')}>
				<div className="title-controls">
					<div className="input">
						<input ref="size_x" type="text"
							   value={this.state.width}
							   onChange={this.onSizeChange}
							   onKeyDown={this.doChangeSize}
							   onBlur={this.doChangeSize} />
						x
						<input ref="size_y" type="text"
							   value={this.state.height}
							   onChange={this.onSizeChange}
							   onKeyDown={this.doChangeSize}
							   onBlur={this.doChangeSize} />
					</div>
					<div className="loading">{this.state.loading ? <IndeterminateProgressWheel /> : null }</div>
				</div>
				<TitleBar className="title-bar"
					  controls
					  background={true}
					  onClosePress={this.close}
					  onMinimizePress={this.minimize}
				/>
				<webview ref="webview"
						 src={this.state.url}
						 useragent={this.state.userAgent}
						 partition="query"
				/>
				<div className="failed-overlay">
					Failed loading {this.state.url}
				</div>
			</div>
		);
	}
});
