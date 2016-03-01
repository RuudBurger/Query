// Configuration for JSLHint task(s)
// Runs JSHint on specified files
'use strict';

var taskConfig = function (grunt) {

	grunt.config.set('eslint', {
		target: [
			'<%= yeogurt.client %>/scripts/**/*.js',
			'!<%= yeogurt.client %>/scripts/vendor/**/*.*'
		]
	});

};

module.exports = taskConfig;
