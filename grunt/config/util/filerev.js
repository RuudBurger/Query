// Static asset revisioning through file content hash
'use strict';

var taskConfig = function (grunt) {

	var assets = {
		src: [
			'<%= yeogurt.dist %>/images/**/*.{jpg,jpeg,gif,png,webp}',
			'<%= yeogurt.dist %>/styles/*.css',
			'<%= yeogurt.dist %>/scripts/*.js'
		]
	};

	grunt.config.set('filerev', {
		options: {
			algorithm: 'md5',
			length: 8
		},
		assets: assets
	});

	grunt.config.set('filerev_replace', {
		options: {
			assets_root: '<%= yeogurt.dist %>'
		},
		assets: assets,
		views: {
			options: {
				views_root: '<%= yeogurt.dist %>'
			},
			src: '<%= yeogurt.dist %>/**/*.html'
		}
	});

};

module.exports = taskConfig;
