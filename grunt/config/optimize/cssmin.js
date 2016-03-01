// Configuration for CSSMin task(s)
// Minifies CSS files
'use strict';

var taskConfig = function (grunt) {

	grunt.config.set('cssmin', {
		options: {
			sourceMap: false
		},
		target: {
			files: [{
				expand: true,
				cwd: '<%= yeogurt.dist %>/styles/',
				src: '*.css',
				dest: '<%= yeogurt.dist %>/styles/'
			}]
		}
	});

};

module.exports = taskConfig;
