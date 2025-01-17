module.exports = function (grunt) {

  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      js: {
        src: [
          'app.js',
          '../js/shared.js',
          'scripts/*.js',
          'controllers/*.js'
        ],
        dest: 'build/js/anyplace.js'
      },
      css: {
        src: [
          'style/*.css',
          '../style/*.css'
        ],
        dest: 'build/css/anyplace.css'
      }
    },

    uglify: {
      js: {
        src: 'build/js/anyplace.js',
        dest: 'build/js/anyplace.min.js'
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'build/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'images/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'build/images/'
        },
          // shared images folder
          {
            expand: true,
            cwd: '../images/',
            src: ['**/*.{png,jpg,gif,svg}'],
            dest: 'build/images/'
          }

        ]
      }
    },

    //compress: {
    //    main: {
    //        options: {
    //            mode: 'gzip'
    //        },
    //        files: [
    //            {expand: true, src: ['build/js/*.min.js'], dest: '.', ext: '.min.js.gz'},
    //            {expand: true, src: ['build/css/*.min.css'], dest: '.', ext: '.min.css.gz'}
    //        ]
    //    }
    //},

    watch: {
      js: {
        files: ['app.js', '../js/shared.js', 'scripts/*.js', 'controllers/*.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          spawn: false
        }
      },
      css: {
        files: ['style/*.css', '../style/*.css'],
        tasks: ['concat:css', 'cssmin'],
        options: {
          spawn: false
        }
      },
      images: {
        files: ['../images/*'],
        tasks: ['imagemin'],
        options: {
          spawn: false
        }
      }
    }

  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  //grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.loadNpmTasks('grunt-contrib-watch');

  // 4. Tasks:
  // default: keep recompiling the code on each change (watch)
  //  deploy: compile the code
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'imagemin', 'watch']);
  grunt.registerTask('deploy', ['concat', 'uglify', 'cssmin', 'imagemin']);
};
