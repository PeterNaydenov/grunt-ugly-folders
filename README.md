# Ugly Folders for Grunt

 Automated uglify method based on folders. Just set source ( development 'JS' folder) and target ( production 'JS' folder). Uglyfolders will scan 'source' folder and will uglify all items found. The items are folders and javascript files from first level of depth.
 Example: 
  
  - If our source folder looks like this:
 
 ```
  |- jquery.js
  |- someScript.js
  |- combine |
             |- first.js
             |- other.js
             |- abra_cadabra.js
             |- sub |
                    |- second.js

 ```
 
- Here is the target(destination) folder content:
 
 ```
  |- jquery.js
  |- someScript.js
  |- combine.js

 ```

Only the first level of depth is important. Javascript files will be processed and saved with the same name. The content of the folders will be combined and recorded as a file with the name of the folder. In this example files first.js, other.js, abra_cadabra.js, and second.js were saved as combine.js.

Plugin uses only files with 'js' extension. All other files are ignored.










## Installation
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ugly-folders --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ugly-folders');
```



### Overview
In your project's Gruntfile, add a section named `uglyfolders` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig ({
  uglyfolders : {
                  mytask : {
                            options : {
                                      // Task-specific options go here.
                                    }
                         }
                }
});
```



### Options and Defaults
Here are all options and their default values:
```js
{
      src            : 'js-dev'
    , target         : 'js'
    , ignore         : false
    , rename         : false
    , renameFile     : false
    , import         : false
    , filter         : false
    , uglifyOptions  : {}
}
```

Read in 'Features' section for details and examples.









## Dictionary
 - *Source items* - Only first level of depth members of source folder;
 - *Folder item*  - Source item is folder;
 - *File item*    - Source item is file;










## How it works?

Uglyfolders has 7 major steps. They are executed always in same order.

 - **Step 1** Read source items (files and folders).
      Fill 'task-listing' object. The object contains all source and destination files. Contains also banner information if it's exists. Listing collect only '.js' extension files.
 - **Step 2** Ignore (optional)
           Apply 'ignore' to 'task-listing' object. Remove all items that have specific pattern in their path (folders and files). It's a regular expression test
 - **Step 3** Import System scripts (optional)
       It adds system scripts to existing source items.
 - **Step 4** Rename Folders Items (optional)
       Apply 'rename' to 'task-listing' object. Change target files if source is folder item.
 - **Step 5** Rename File Items (optional)
           Apply 'renameFile' to 'task-listing' object. Change target files if source is file item.
 - **Step 6** Watcher filter (optional)
           Apply 'filter' to 'task-listing' object. Remove all source-target elements that not contain chaiged file.
 - **Step 7** Uglify
           Uglify files by using data in 'task-listing' object. Set banner if exists. Use uglify settings written in 'uglifyOptions' option.












## Features



### General Settings
In most of the projects is enough to set the source and target folders ( your development and production JS folders).
```js
uglyfolders : {
                general : {
                              options : {
                                           src    : 'js-dev'
                                         , target : 'js'
                                      }
                        }
              }
```

In this example our development javascript folder is `js-dev` and our production folder is `js`. 

One level depth of 'source' and 'target' is not required. Set them according your project infrastructure. Here is an example:

```js
uglyfolders : {
                general : {
                              options : {
                                           src    : 'dev/js'
                                         , target : 'app/js'
                                      }
                        }
              }
```



### Ignore Files in Package
Uglyfolders read only files with '.js' extension. Simple way to ignore file is to change the extension to something else. Example: Change extension to '.js-'. Minus will tell you that file is not in use.

Uglyfolders task has an 'ignore' option. Use it to ignore some files from your source folder items. Compiler will ignore all files that contain string in their path. Example:
```js
uglyfolders : {
                general : {
                              options : {
                                           src    : 'js-dev'
                                         , target : 'js'
                                         , ignore : {
                                                      simple : ['del']
                                                    }
                                      }
                        }
              }
```
Ignore option says that source folder item  'js-dev/simple' has an ignore-filter. All files with 'del' in their paths will be ignored. Ignore will works for :

  - js-dev/simple/del.js
  - js-dev/simple/delete.js
  - js-dev/simple/del/anyFileName.js
  - js-dev/simple/delgado/anyFileName.js

Use of more then one ignore-filter per folder is an option.
```js
uglyfolders : {
                general : {
                              options : {
                                           src    : 'js-dev'
                                         , target : 'js'
                                         , ignore : {
                                                      simple : ['del' , 'otherFilterString']
                                                    }
                                      }
                        }
              }
```

The 'ignore' paterns ('del' and 'otherFilterString' in last example) are treated as **regular expressions**.



### Rename Result File
There are two types of items in 'source' folder: '.js' files and folders. Renaming of source items will change results in 'target' folder. It's a most common approach. Sometimes we using complex open source libraries and may be changing file names is not an option. Then we can use 'rename' option for folders and 'renameFile' option for files.

Rename example:
```js
uglyfolders : {
                sometask : {
                              options : {
                                           src    : 'js-dev'
                                         , target : 'js'
                                         , rename : {
                                                      simple : 'sim'
                                                    }
                                      }
                          }
              }
```

If 'js-dev/simple' exists, result will be written in 'sim.js' file. If folder 'simple' doesn't exists, the operation 'rename' will be ignored.

Rename file example:
```js
 uglyfolders : {
                mytask : {
                            options : {
                                         src        : 'js-dev'
                                       , target     : 'js'
                                       , renameFile : {
                                                         'example.js' : 'res.js'
                                                    }
                                    }
                        }

              }
```
This will take 'js-dev/example.js' and after uglify will write result into 'js/res.js' file.


### Set a Banner
Create file with name 'banner.js' in your source folder item. If file 'banner.js' is in sub-folder of folder item will be ignored.
Example:
 
- source folder
```
 |-some.js
 |-wrapperFolder|
                |-banner.js
                |-jQuery.js
                |-backbone.js
```
 
- result folder
```
 |-some.js
 |-wrapperFolder.js
```

The 'wrapperFolder.js' file will have as a content 'jQuery.js' and 'backbone.js' files. On top of them 'banner.js' content. Don't forget to put 'banner.js' content in comments - use `/* */ `.


**Ignore example**:

- Source folder
```
 |-some.js
 |-wrapperFolder|
                |-jQuery.js
                |-backbone.js
                |-sub|
                     |-banner.js
```

- Target folder
 ```
 |-some.js
 |-wrapperFolder.js
 ```

Result looks like in previous example but in this case 'wrapperFolder.js' will contain only 'jQuery.js' and 'backbone.js'. The file 'banner.js' will be ignored as subfolder member of source folder item.

### Set a Watcher
 Write path of changed file as filter option. Then start a 'uglyfolders' task. It will rebuild one file only.



### Set Uglify Options
 Control uglify options by setting a 'uglifyOptions' option. We using standard 'grunt-contrib-uglify' task. For more details read 'grunt-contrib-uglify' documentation. Here is an example:
 
 ```js
     uglyfolders: {
              ignoreSub : {
                            options : {
                                        src            : 'dev-js'
                                      , target         : 'js'
                                      , uglifyOptions  : {
                                                          "beautify"   : false,
                                                            "mangle"   : true,
                                                            "compress" : {
                                                                          "dead_code" : true,
                                                                          "warnings"  : true
                                                                        }
                                                        }
                                    }
                         }
    } 
```



### Import files
> Use this option with caution! The attribute not follow general usability rules applied to this plugin.

I'm using it only when I have to add a 'system script' to already defined source item in development folder. 

```js
uglyfolders : {
                task : {
                          options : {
                                          src    : 'dev-js'
                                        , target : 'js'
                                        , import : {
                                                   "core" : [ "system/main.js"]
                                                   }
                                    }
                        }
            } 

```
This instruction will search for source item "core" and will add to it file "system/main.js".






## Examples

### Rearange Source Folders

In this example our goal is to see how will look our project with only one javascript file. Let's start with such a 'source-folder' structure:

```
|-jquery.js
|-core|
|     |-backbone.js
|     |-underscore.js
|
|- bootstrap|
            |-alert.js
            |-button.js
            |-carousel.js
            |-tab.js
```

By using standard setting with options `src` and `target`, result will look like that:

```
|-jquery.js
|-core.js
|-bootstrap.js
```
Drag and drop `bootstrap` folder into 'core' folder. Do the same with `jquery.js`. Then folder will look like:

```
|-core|
|     |-backbone.js
|     |-underscore.js
|     |-jquery.js
|     |-bootstrap|
                 |-alert.js
                 |-button.js
                 |-carousel.js
                 |-tab.js
```

and result in 'target-folder' will look like this:

```
|-core.js
```

Yes, just that simple.



### Advance Folder Settings

Apply different 'uglify' rules to 'pages' sub-folder in our 'source' folder.

- source-folder structure

```
 |-lib.js
 |-core|
 |     |-backbone.js
 |     |-underscore.js
 |
 |-pages|
        |-home.js
        |-services.js
        |-contact.js

```

- 'target' folder structure should looks like this:

```
 |-lib.js
 |-core.js
 |-pages|
        |-home.js
        |-services.js
        |-contact.js

```

- here is our grunt task description:

```js
uglyfolders : {
                 first : {
                              options : {
                                           src    : 'js-dev'
                                         , target : 'js'
                                         , ignore : {
                                                      pages : ['pages']
                                                    }
                                      }
                        } ,
                second  : {
                              options : {
                                           src    : 'js-dev/pages'
                                         , target : 'js/pages'
                                      }
                        }

              }
```
First task will create all files ignoring 'pages' folder. The second task will take 'js-dev/pages' as root folder and 'js/pages' as target. This means that all files in pages will be treated as file items (first level of depth).





## Known bugs
_(Nothing yet)_





## Release History

### 0.1.5 (2015-01-30)
- [ ] Bugfix:  Ignore 'include' setting if source folder is empty;
- [ ] Unit tests are not complete

### 0.1.4 (2015-01-28)

 - [x] Bugfix: 'banner.js' in first level was not ignored;
 - [x] Bugfix: Filtered folder spreading its banner among other folders with filter;
 - [x] Documentation update;
 - [x] Ignore uglify if source array is empty;
 - [x] setting 'include' was added;
 - [ ] Bug :  Ignore 'include' setting if source folder is empty;
 - [ ] Unit tests are not complete

### 0.1.3 (2015-01-07)

 - [x] Documentation update.
 - [x] Source code comments update.
 - [ ] Unit tests are not complete
 - [ ] 'banner.js' in first level is not ignored;
 - [ ] Filtered folder spreading its banner among other folders with filter;

### 0.1.2 (2015-01-03)

 - [x] Documentation improvement
 - [x] '.npmignore' file added
 - [ ] 'banner.js' in first level is not ignored;
 - [ ] Filtered folder spreading its banner among other folders with filter;
 - [ ] Unit tests are not complete





## Credits
'grunt-ugly-folders' was created by Peter Naydenov. It uses ['grunt-contrib-uglify'](https://github.com/gruntjs/grunt-contrib-uglify) task provided by Grunt team.




## License
Uglyfolders is released under the [MIT License](http://opensource.org/licenses/MIT).


