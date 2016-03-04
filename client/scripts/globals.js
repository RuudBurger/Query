'use strict';

// Helper console log
global.p = console ? function(){ console.log(arguments.length === 1 ? arguments[0] : arguments); } : function(){};

// Localstorage helper
import Basil from 'basil.js';
global.ls = new Basil();
delete window.Basil;

// Shims and polyfills
import './vendor/requestAnimationFrame';

// Make click events on touch devices faster
//import QuickClick from 'quickclick';
//QuickClick(document.body);

// Load jQuery and remove globals
import 'jquery';
delete window.jQuery;
delete window.$;
