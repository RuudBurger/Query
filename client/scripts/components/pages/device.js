'use strict';

import React from 'react';
//import Reflux from 'reflux';

import {TitleBar} from 'react-desktop';

import $ from 'jquery';

export default React.createClass({

	getInitialState(){
		return {
			height: 0,
			width: 0
		}
	},

	componentDidMount(){
		$(window).on('resize', this.resize);
	},

	resize(){
		var w = $(window),
			width = w.width(),
			height = w.height();

		this.setState({
			height: height,
			width: width
		})
	},

	onSizeChange(){

	},

	render(){
		var size = <input value={this.state.width + ' x ' + this.state.height} onChange={this.onSizeChange} />;

		return (
			<div className="device">
				<div className="title-controls">{size}</div>
				<TitleBar className="title-bar"
					  controls
					  background={true}
					  onClosePress={this.close}
				/>
				<webview src="https://www.github.com/" />
			</div>
		);
	}
});
