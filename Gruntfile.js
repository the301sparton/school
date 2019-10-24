module.exports = function (grunt) {
  grunt.initConfig({

    watch: {
      js: {
        files: ['home/**/*.js', 'js/*.js'], tasks: ['concat', 'obfuscator'], options: {
          livereload: true,
        }
      }
    },


    concat: {
      options: {
        separator: ';',
      },

      homeJS: {
        src: ['home/**/*.js', './js/setAll.js', './js/firebaseAuth.js', './js/home_main.js', './js/main.js'],
        dest: 'dist/builtHome.js',
      },

      indexJS: {
        src: [ './js/firebaseAuth.js', './js/index_main.js', './js/main.js'],
        dest: 'dist/builtIndex.js',
      }

    },


    obfuscator: {
      options: {
        banner: '// Copyright vaicomp.com 2019 India.\n',
        debugProtection: true,
        debugProtectionInterval: true
      },

      homeObfuscator: {
        files: {
          'dist/': [ // the files and their directories will be created in this folder
            'dist/builtHome.js'
          ]
        }
      },

      indexObfuscator: {
        files: {
          'dist/': [ // the files and their directories will be created in this folder
            'dist/builtIndex.js'
          ]
        }
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-obfuscator');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};

