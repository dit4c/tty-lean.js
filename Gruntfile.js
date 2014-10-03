module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mocha_istanbul: {
      server: {
        src: 'test',
        options: {
          mask: '*_spec.js',
          root: 'lib',
          reportFormats: ['lcovonly']
        }
      }
    },
    mochaTest: {
      client: {
        options: {
          reporter: 'spec',
          quiet: false
        },
        src: ['test/ttyjs_spec_client.js']
      }
    }
  });
  
  
  grunt.registerTask('test', ['mocha_istanbul:server', 'mochaTest:client']);

};
