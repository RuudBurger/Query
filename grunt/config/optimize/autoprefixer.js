// Configuration for Autoprefixer task(s)
// Automatically adds vendor prefixes to stylesheets if they are needed
'use strict';

var taskConfig = function (grunt) {

	grunt.config.set('autoprefixer', {
		server: {
			options: {
				browsers: ['last 4 versions'],
				map: true
			},
			files: [{
				expand: true,
				flatten: true,
				src: '<%= yeogurt.tmp %>/styles/*.css',
				dest: '<%= yeogurt.tmp %>/styles/'
			}]
		},
		build: {
			options: {
				browsers: ['last 4 versions'],
				map: false
			},
			files: [{
				expand: true,
				flatten: true,
				src: '<%= yeogurt.dist %>/styles/*.css',
				dest: '<%= yeogurt.dist %>/styles/'
			}]
		}
	});

};

module.exports = taskConfig;
