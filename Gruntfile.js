module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-blanket');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      coverage: {
        src: ['coverage/']
      }
    },
    copy: {
      coverage: {
        src: ['static/**', 'test/**'],
        dest: 'coverage/'
      }
    },
    blanket: {
      server: {
        src: ['lib/'],
        dest: 'coverage/lib/'
      },
      client: {
        src: ['static/'],
        dest: 'coverage/static/'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['coverage/test/**/*.js']
      },
      lcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'coverage/coverage.lcov'
        },
        src: ['coverage/test/**/*.js']
      }
    }
  });
  
  
  grunt.registerTask('test', ['clean', 'copy', 'blanket', 'mochaTest']);

};
