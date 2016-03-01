'use strict';

/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {Router, Route} from 'react-router';

// History
import createHistory from 'history/lib/createHashHistory';

import Index from './components/index';
import Controls from './components/pages/controls';
import Device from './components/pages/device';


export default (
	<Router history={createHistory()}>
		<Route path="/" component={Index}>
			<Route path="controls" component={Controls} />
			<Route path="device" component={Device} />
		</Route>
	</Router>
);
