// Configuration for Uglify task(s)
// Minifies JavaScript files
'use strict';

var taskConfig = function (grunt) {

	grunt.config.set('uglify', {
		minify: {
			files: {
				'<%= yeogurt.dist %>/scripts/global.js': ['<%= yeogurt.dist %>/scripts/global.js'],
				'<%= yeogurt.dist %>/scripts/main.js': ['<%= yeogurt.dist %>/scripts/main.js']
			}
		}
	});

};

module.exports = taskConfig;
