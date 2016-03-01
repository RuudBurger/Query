// Configuration for browserify task(s)
// Compiles JavaScript into single bundle file
'use strict';

var taskConfig = function (grunt) {
	var envify = require('envify/custom');

	grunt.config.set('browserify', {
		server: {
			options: {
				transform: [
					['babelify', { compact: false, "presets": ['react', 'es2015']}],
					envify({NODE_ENV: 'development'})
				],
				browserifyOptions: {
					debug: true
				},
				watch: true
			},
			files: {
				'<%= yeogurt.tmp %>/scripts/main.js': ['<%= yeogurt.client %>/scripts/main.js']
			}
		},
		dist: {
			options: {
				transform: [
					['babelify', { compact: false, "presets": ['react', 'es2015']}],
					envify({NODE_ENV: 'production'})
				],
				browserifyOptions: {
					debug: false
				}
			},
			files: {
				'<%= yeogurt.dist %>/scripts/main.js': ['<%= yeogurt.client %>/scripts/main.js']
			}
		},
	});

};

module.exports = taskConfig;
