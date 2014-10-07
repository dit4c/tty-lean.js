module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-istanbul');
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
    clean: {
      coverage: "coverage/"
    },
    copy: {
      clientStatic: {
        expand: true,
        flatten: true,
        src: ['static/**/*', 'coverage/client/instrument/static/*'],
        dest: 'coverage/client/static/'
      }
    },
    instrument: {
      files: 'static/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/client/instrument/'
      }
    },
    mochaTest: {
      client: {
        options: {
          reporter: 'spec',
          quiet: false,
          timeout: 10000
        },
        src: ['test/ttyjs_spec_client.js']
      }
    }
  });
  
  grunt.registerTask('test:server', ['mocha_istanbul:server']);
  grunt.registerTask('test:client',
    ['clean', 'instrument', 'copy', 'mochaTest:client']);

  grunt.registerTask('test', ['test:server', 'test:client']);

};
