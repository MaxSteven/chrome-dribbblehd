/*global module */
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('extension/manifest.json'),

		// JSHint the code.
		jshint: {
			options: {
				jshintrc: '.jshintrc',
			},
			all: ['extension/js/*.js'],
		},

		// Clean folders.
		clean: {
			build: ['build/**', '!build']
		},

		// Bump up the version in JSON file.
		bumpup: 'extension/manifest.json',

		// Commit last changes and tag the commit with a version from this JSON file.
		tagrelease: 'extension/manifest.json',

		// Build an archive ready to be uploaded to web store.
		compress: {
			main: {
				options: {
					mode: 'zip',
					level: 1,
					archive: 'build/<%= pkg.name %>-<%= manifest.version %>.zip'
				},
				expand: true,
				cwd: 'extension/',
				src: ['**'],
				dest: '/'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-tagrelease');
	grunt.loadNpmTasks('grunt-bumpup');

	// Build task.
	grunt.registerTask('build', function () {
		grunt.task.run('clean');
		grunt.task.run('compress');
	});

	// Release task.
	grunt.registerTask('release', function (type) {
		type = type ? type : 'patch';
		grunt.task.run('jshint');
		grunt.task.run('bumpup:' + type);
		grunt.task.run('tagrelease');
	});

	// By default, lint.
	grunt.registerTask('default', ['jshint']);
};