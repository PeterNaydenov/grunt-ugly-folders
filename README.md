# grunt-uglyFolders

*WARNING* - it's just a test. It's still not a functional software.

Folders based uglify. Every folder become a 'js' uglify container. All files in folder become content of result file.



## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-uglyFolders --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-uglyFolders');
```

## The "uglyFolders" task

### Overview
In your project's Gruntfile, add a section named `uglyFolders` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig ({
  uglyFolders : {
                options : {
                          // Task-specific options go here.
                        }
              }
});
```




### Options

#### src
Type: `String`
Default value: `js-dev`

Source folder name. If it's not defined 'uglyFolder' will search 'js-dev' folder.



#### target
Type: `String`
Default value: `js`

Uglified 'js' files will go in this folder. Default value is 'js' folder.





### Other Options

#### ignore

Use it if you want to ignore some files from your folder containers. Compiler will ignore all files that contain string in their path. Example:
```js
uglyFolders : {
                options : {
                             src    : 'js-dev'
                           , target : 'js'
                           , ignore : {
                                        simple : ['del']
                                      }
                        }
              }
```
Example has source 'js-dev' and results are in 'js' folder. Ignore option says that folder-container 'js-dev/simple' has a ignore filter. All files with 'del' in their paths will be ignored. Ignore will works for :
  - js-dev/simple/del.js
  - js-dev/simple/delete.js
  - js-dev/simple/del/anyFileName.js
  - js-dev/simple/delgado/anyFileName.js

Add more then one ignore filter per container if you want.

#### rename

You can use to set target file without change source folder name. Example:

```js
uglyFolders : {
                options : {
                             src    : 'js-dev'
                           , target : 'js'
                           , rename : {
                                        simple : 'sim'
                                      }
                        }
              }
```

If 'js-dev/simple' exists, result will be written in 'sim.js' file.



#### renameFile

It's like 'rename' but it's used for files in source root folder. Normally 'uglyFolders' will get the file from 'js-dev/example.js' and after uglify will write result into 'js/example.js'. RenameFile example:

```js
 uglyFolders : {
                options : {
                             src        : 'js-dev'
                           , target     : 'js'
                           , renameFile : {
                                             'example.js' : 'res.js'
                                        }
                        }
              }
```
This will take 'js-dev/example.js' and after uglify will write result into 'js/res.js' file.



#### filter

Option is used by watch task. Write path of changed file as filter option. Then start a 'uglyFolders' task. It will rebuild one file only.



### Order of operations
Task `ugliFolders` has 6 steps:
 1. Find files and folders
 2. Ignore filtering
 3. Folder Rename
 4. File Rename
 5. Filter
 6. Uglify





## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).





## Release History
_(Nothing yet)_


=======
uglyFolder
==========

Grunt plugin. Folder based uglify.
