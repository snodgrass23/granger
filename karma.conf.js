autoWatch = false;

basePath = '';

frameworks = ['jasmine'];

browsers = ['Safari', 'Firefox']//, 'PhantomJS'];
  /*
    Chrome
    ChromeCanary
    Firefox
    Opera
    Safari
    PhantomJS
  */
//captureTimeout = 60000,

colors = true;

//exclude = [],
files = [
  JASMINE,
  JASMINE_ADAPTER,
  //'src/**/*.coffee',
  'dist/*.js',
  'tests/*.coffee'
];


//hostname = 'localhost',
//logLevel = 'LOG_INFO',
  /* LOG_DISABLE LOG_ERROR LOG_WARN LOG_INFO LOG_DEBUG */
//loggers = [{type = 'console'}],

port = 9876;

preprocessers = { '**/*.coffee': 'coffee' };

//proxies = {},
//reportSlowerThan = 200;

reporters = ['dots']; /* dots progress junit growl coverage */

runnerPort = 9100;
singleRun = false;
//urlRoot = ''

