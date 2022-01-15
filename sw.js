// Change this to your repository name
var FILE_PATH = '/underlords-compare-heroes';

// Choose a different app prefix name
var APP_PREFIX = 'uch_';

// The version of the cache. Every time you change any of the files
// you need to change this version (version_01, version_02…). 
// If you don't change the version, the service worker will give your
// users the old files!
var VERSION = 'version_00';

// The files to make available for offline use. make sure to add 
// others to this list
var URLS = [    
  `${FILE_PATH}/`,
  `${FILE_PATH}/index.html`,
  `${FILE_PATH}/style.css`,
  `${FILE_PATH}/script.js`,
  `${FILE_PATH}/data/underlords.json`,
  `${FILE_PATH}/images/heroes/Abaddon_portrait_icon.png`
]