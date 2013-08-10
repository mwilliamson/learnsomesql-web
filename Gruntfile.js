module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        serve_qunit_tests: {
            src: "tests/**/*.test.js",
            options: {
                port: 54321,
                dependencies: {
                    "/learnsomesql.js": "_build/learnsomesql.js"
                }
            }
        },
        qunit: {
            files: ["test.html"],
            options: {
                urls: ["http://localhost:54321"],
                timeout: 10000
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-serve-qunit-tests');
    
    grunt.registerTask("test", ["serve_qunit_tests", "qunit"]);
};
