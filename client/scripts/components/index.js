'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Reflux from 'reflux';
import {History} from 'react-router';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';


import MainActions from '../actions/main';
import MainStore from '../stores/main';

import classNames from 'classnames';
import $ from 'jquery';

export default React.createClass({

	mixins: [
		Reflux.listenTo(MainActions.toggleMenu, 'toggleMenu'),
		History
	],

	wrapper: null,
	show_menu: false,

	getInitialState(){
		return {
		};
	},

	componentDidMount(){

		this.wrapper = $(ReactDOM.findDOMNode(this.refs.wrapper));

		// Catch clicks and touch events
		this.wrapper
			//.on('click', 'a, button, .button', this.ripple)
			.on('touchstart', 'a, button, .button', this.ripple);
			//.on('mousedown', 'a', this.navigate)
			//.on('touchstart', 'a', this.navigate)

	},

	toggleMenu(){
		$('body').toggleClass('show-menu');
	},

	/**
	 * Fill the touched area with a ripple effect
	 */
	ripple(e){
		var el = $(e.currentTarget),
			button = el.offset(),
			touch = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
			x = touch.pageX - button.left,
			y = touch.pageY - button.top,
			ripple = $('<div class="ripple" />').css({
				left: x,
				top: y
			});

		el.append(ripple);

		requestTimeout(() => ripple.addClass('animate'), 0);
		requestTimeout(() => ripple.remove(), 2100);
	},

	render(){
		var classes = classNames('app', {
			});

		return (
			<div ref="wrapper" className={classes}>
				{this.props.children}
			</div>
		);

	}
});
