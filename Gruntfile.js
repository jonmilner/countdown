module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    'webfont': {
      icons: {
        src: 'public/assets/fonts/svg/*.svg', // Path to .svg icons
        dest: 'public/assets/fonts/icon-font/', // Destination for font files
        destCss: 'public/assets/css/generated/', // Destination for .scss file
        options: {
          stylesheet: 'scss',
          syntax: 'bootstrap',
          hashes: false,
          font: 'icon-font', // Name of .scss file
          relativeFontPath: '../fonts/icon-font/',
          templateOptions: {
            classPrefix: 'icon-'
          },
          htmlDemo: false
        }
      }
    },

    'compass': {
      dist: {
        options: {
          sassDir: 'public/assets/css',
          cssDir: 'public/assets/css',
          outputStyle: 'nested',
          noLineComments: true
        }
      }
    },

    'autoprefixer': {
      options: {
        browsers: 'last 2 versions'
      },
      single_file: {
        src: 'public/assets/css/styles.css',
        dest: 'public/assets/css/styles.css'
      }
    },

    'cssmin': {
      minify: {
        expand: true,
        cwd: 'public/assets/css/',
        src: 'styles.css',
        dest: 'public/assets/css/',
        ext: '.css'
      }
    },

    'concat': {
      dist: {
        src: [
          'public/assets/js/vendor/*.js',
          'public/assets/js/plugins/*.js',
          'public/assets/js/scripts.js'
        ],
        dest: 'public/assets/js/scripts.concat.js'
      }
    },

    'uglify': {
      build: {
        src: 'public/assets/js/scripts.concat.js',
        dest: 'public/assets/js/scripts.min.js'
      }
    },

    'imagemin': {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/assets/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/assets/images/'
        }]
      }
    },

    'nodemon': {
      dev: {
        options: {
          file: 'server/app.js',
          watchedExtensions: ['js'],
          watchedFolders: ['server'],
          delayTime: 0
        }
      }
    },

    'concurrent': {
      default: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    'watch': {
      fonts: {
        files: ['public/assets/fonts/svg/*.svg'],
        tasks: ['webfont', 'compass', 'autoprefixer', 'cssmin']
      },
      css: {
        files: ['public/assets/css/**/*.scss'],
        tasks: ['compass', 'autoprefixer', 'cssmin']
      },
      js: {
        files: ['public/assets/js/*.js'],
        tasks: ['concat', 'uglify']
      },
      images: {
        files: ['public/assets/images/*'],
        tasks: ['imagemin']
      },
      options: {
        livereload: true,
      }
    }

  });

  grunt.registerTask('default', ['compile', 'concurrent']);
  grunt.registerTask('server', ['nodemon:dev']);
  grunt.registerTask('compile', ['webfont', 'compass', 'autoprefixer', 'cssmin', 'concat', 'uglify', 'imagemin']);

};