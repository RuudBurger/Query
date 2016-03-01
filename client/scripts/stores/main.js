'use strict';

import Reflux from 'reflux';
import actions from '../actions/main';

// Creates a DataStore
export default Reflux.createStore({
	listenables: [actions],

	env: 'production',

	menu_shown: false,

	init(){
		this.env = process.env.NODE_ENV;
	},

	/**
	 * Toggle only when menu is shown
	 */
	onHideMenu(){
		if(this.menu_shown){
			actions.toggleMenu();
		}
	},

	/**
	 * Toggle only when menu is not shown
	 */
	onShowMenu(){
		if(!this.menu_shown){
			actions.toggleMenu();
		}
	},

	/**
	 * Toggle menu
	 */
	onToggleMenu(){
		this.menu_shown = !this.menu_shown;
	},

	isMenuShown(){
		return this.menu_shown;
	},

	/**
	 * Check if dev
	 */
	isDevelop(){
		return this.env == 'development';
	}
});
