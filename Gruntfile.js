module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochacov: {
      coveralls: {
        options: {
          coveralls: true
        }
      },
      test: {
        options: {
          reporter: 'spec'
        }
      },
      options: {
        files: 'test/*.js'
      }
    }
  });

  grunt.registerTask('coveralls', ['mochacov:coveralls']);
  grunt.registerTask('test', ['mochacov:test']);

};
