
module.exports = function (grunt) {
    grunt.initConfig({

        // define source files and their destinations
        obfuscator: {
            options: {
                // global options for the obfuscator
            },
            task1: {
                options: {
                    // options for each sub task
                },
                files: {
                    'dest/': [ // the files and their directories will be created in this folder
                        './home/**/*.js',
                        './js/**/*.js',
                        './receipt/**/*.js',
                        './register/**/*.js',
                        './studentView/**/*.js'
                    ]
                }
            }
        },
        watch: {
            js: {
                files: './**/*.js', tasks: ['obfuscator'], options: {
                    livereload: true,
                }
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-obfuscator')

    // register at least this one task
    grunt.registerTask('default', ['obfuscator']);
};