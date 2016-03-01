// `grunt test`
// Runs all tests and static analysis (i.e. JSHint)

'use strict';

var taskConfig = function (grunt) {
	grunt.registerTask('test', 'Peform tests on JavaScript', function (target) {

		grunt.task.run([
			'eslint'
		]);
	});
};

module.exports = taskConfig;
