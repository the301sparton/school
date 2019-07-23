module.exports = function (grunt) {
    grunt.initConfig({

        jshint: {
            options: {
              curly: true,
              eqnull: true,
              browser: true,
              "esversion": 6,
              globals: {
                jQuery: true
              },
            },
            files: ['home/**/*.js', 'js/*.js']
        },
        watch: {
          js: {
              files: ['home/**/*.js', 'js/*.js'], tasks: ['jshint'], options: {
                  livereload: true,
              }
          }
      }   
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['jshint']);
};