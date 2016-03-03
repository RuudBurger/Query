'use strict';

import React from 'react';
//import Reflux from 'reflux';

import classNames from 'classnames';

export default React.createClass({

	render(){
		var classes = classNames('icon ' + this.props.type + ' ' + (this.props.orientation || ''));

		return (
			<div className={classes}>
				<div className="screen">{this.props.nr}</div>
				<div className="button" />
				<div className="stand" />
			</div>
		);
	}
});
