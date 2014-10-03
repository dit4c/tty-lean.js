module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*_spec.js',
          root: 'lib',
          reportFormats: ['text-summary','lcovonly']
        }
      }
    }
  });
  
  
  grunt.registerTask('test', ['mocha_istanbul:coverage']);

};
