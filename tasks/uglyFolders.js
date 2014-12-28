/*
 * uglyFolders
 * https://github.com/PeterNaydenov/grunt-uglyFolders
 *
 * Copyright (c) 2014 Peter Naydenov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function ( grunt ) {

  grunt.loadNpmTasks ( 'grunt-contrib-uglify' );

  grunt.task.registerMultiTask ('uglyFolders', 'Folders based uglify.', function () {
    var   
         options = this.options({
                                      src            : 'js-dev'
                                    , target         : 'js'
                                    , ignore         : false
                                    , rename         : false
                                    , renameFile     : false
                                    , filter         : false
                                    , uglifyOptions  : {}
                                })
        , listing    = {}            // list with all targets and source files. Banners are also here.
        , namePlugin = 'uglyFolders' // Used in uglify sub-task names on step 3 - uglify.
        , hash       = '#slfl0!'     // File source mask. Prevents target file name duplication - file and folders
        ;

// *** STEP 1 - Read files and foldes. Get only 'JS' files. Read banners if exists;
( function () {
    var 
          count = 0;

 grunt.file.recurse ( options.src, function ( abspath, rootdir , subdir , filename ) {
 // find all files and folders. Prepare 'listing' content.
                              var 
                                    t                  // 't' splits 'filename' on '.' symbol. 
                                                       // 't' splits 'subdir' on '/' symbol. Subdir should contain only first element of this array;
                                  , tLength            // Length of 't' when 'filename' is splited on '.' symbol. Files with extensions are at least with length = 2;
                                  , extension          // file extension
                                  , banner = false;    // Banner flag. If file name is 'banner.js', then value is true. Default value is false.
                                  ;

                             t = filename.split('.');
                             tLength = t.length;
                             if ( tLength < 2  ) return;
                             extension = t [ tLength-1 ];
                             if ( extension != 'js') return;
                             if ( filename == 'banner.js' ) banner = true;

                             if ( subdir == undefined ) {
                                // Files in main source folder. Add hash to them.
                                                             listing [ hash + filename ] = abspath;
                                                             count++;   
                                  }
                             else {
                                // Files in sub-folders
                                                            t = subdir.split('/');
                                                            subdir = t[0];
                                                            listing[subdir] = listing[subdir] || [];
                                                            if ( banner && t.length == 1 ) listing[subdir]['banner'] = grunt.file.read ( abspath, { encoding :'utf-8'} );
                                                            else                          
                                                                            if ( !banner ) listing[subdir].push(abspath);
                              }
             }); // file recurse
})(); // end step 1



// *** STEP 2 - filter Ignore (optional). Ignore files that contain specific pattern in their path (folders and files). Regular expression test;
if ( options.ignore ) {
( function () {
      var
            ignore  = options.ignore   // alias for options.ignore
          , banner                    // preserve folder's banner if exists
          ;



      for ( var folderName in ignore ) {
              if ( !listing[folderName] ) {
                                            grunt.log.error ('Warning: Active filter on non-existing folder "' + folderName + '"');
                                            continue;
                                          }

              if ( listing[folderName]['banner'] ) banner = listing[folderName]['banner'];
              
              ignore[folderName].forEach ( function ( pattern ) {
                                          var regX = new RegExp(pattern);
                                          listing[folderName].forEach ( function ( fileName , index ) {
                                                          if ( regX.test(fileName) ) delete listing[folderName][index];
                                                }) // forEach fileName

                                          // clean array. Remove indexes of deleted items
                                          listing[folderName] = listing[folderName].filter ( function ( item ) { if ( item ) return item; });
                                          listing[folderName]['banner'] = banner;
              }); // forEach ignoreList
      } // for ignoreList
})(); 
} // end step 2



// *** STEP 3 - Folder software rename (optional). Change target files without chainging source folder name.
if ( options.rename ) {
( function () {
    var 
          l      = listing
        , rename = options.rename
        ;

    for ( var name in rename ) {
                                  if ( !l[name] ) {
                                                    grunt.log.error( 'Warning : Rename failed --> ' + name + ' to ' + rename[name] );
                                                    return;
                                                  }
                                  l[rename[name]] = l[name];
                                  delete l[name];
                            } // for name


})(); 
} // end step 3



// *** STEP 4 - File software rename ( optional). Change target files without chainging source file name.
if ( options.renameFile ) {
( function () {
    var 
          l      = listing
        , rename = options.renameFile
        ;

    for ( var name in rename ) {
                                  if ( !l[hash+name] ) {
                                                    grunt.log.error( 'Warning : RenameFile failed --> ' + name + ' to ' + rename[name] );
                                                    return;
                                                  }
                                  l[hash+rename[name]] = l[hash+name];
                                  delete l[hash+name];
                            } // for name
})(); 
} // end step 4



// *** STEP 5 - Watch filter ( optional). Remove from 'listing' all elements that are not changed.
if ( options.filter ) { 
( function () {
      var 
            filter     = options.filter // option filter should contain abs. path to edited file;
          , oldListing = listing 
          , result     = {}
          ;

    for ( var el in oldListing ) {
            if ( typeof oldListing[el] == 'string' ) {
                                                if ( filter == oldListing[el] )  result[el] = oldListing[el];
                  }
              else {
                                               oldListing[el].forEach ( function ( item , index ) {
                                                        if ( item == filter ) {
                                                                                result[el] = oldListing[el];
                                                                                return;
                                                                            }
                                               });
              } // else

            if ( result[el] ) {
                                listing = result;
                                return;
                              }

    } // for el in oldListing

})();
} // end step 5



// *** STEP 6 - uglify
( function () {
  var 
        count = 0       // uglify item counter
      , targetFolder  = options.target
      , uglifyOptions = options.uglifyOptions
      , taskList = []   // define 'uglify' tasks here
      , sourceFiles     // array of source files
      , targetFile      // write uglify result in this file
      , fileSet         // prepare uglify options here
      , step            // Uglify option name is here
      , checkNames = [] // Collect target file names. If filename is already exists - send a error message.
      ;



 grunt.config.set('uglify.options', uglifyOptions );

 for ( var index in listing ) {

    count++;

    if ( targetFolder.lastIndexOf('/') != (targetFolder.length-1) ) targetFolder = targetFolder + '/';

    // if source has a 'hash' mean that the source is a javascript file. Otherwise source is a folder.
    if ( index.indexOf(hash) == -1 ) {
                                       if ( index.substr(index.length-3)!='.js' ) targetFile = index + '.js';
                                       else                                       targetFile = index;
                                     }                    
    else                               targetFile = index.substr(hash.length);


    targetFile  = targetFolder + targetFile;
    
    checkNames.forEach ( function ( name ) {
                                if ( name == targetFile ) grunt.log.error ( 'ERROR : Duplicated target filenames --> ' + name );
                        });
    checkNames.push(targetFile);

    
    sourceFiles = listing[index];
    if ( typeof sourceFiles == 'string')  sourceFiles = [ sourceFiles ];

    fileSet = {};
    fileSet[targetFile] =  sourceFiles;

    step = namePlugin + '-step' + count;

    if ( sourceFiles['banner'] ) {
                                   grunt.config.set('uglify.'+ step + '.options', { 'banner' : sourceFiles['banner']} );
                                 }
                                   grunt.config.set('uglify.'+ step + '.files', fileSet );

    
    taskList.push ( 'uglify:'+ step );
    // console information about this step result. 
    grunt.log.ok('Uglify "' + step + '" --> ' + targetFile );
    
}; // forEach listing

    grunt.task.run(taskList);

})(); // end step 6


  });

};


