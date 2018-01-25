/**
* Dépendances
**/
const puppeteer = require('puppeteer');
const logger = require('winston');
const Crawler = require('./src/crawler.js');

/**
* Configuration
**/
const targetUrl = 'https://web.bankin.com/challenge/index.html';

var headlessMode = true;
if (process.env.hasOwnProperty('DISABLE_HEADLESS') && process.env.DISABLE_HEADLESS == 1) {
  headlessMode = false;
}
var maxThreads = 10;
if (process.env.hasOwnProperty('MAX_THREADS')) {
  maxThreads = process.env.MAX_THREADS;
}

logger.configure({
  transports: [
    new (logger.transports.File)({ filename: 'debug.log' })
  ]
});
logger.level = 'debug';

/**
* Script principal
**/
(async () => {

  logger.log('debug', 'Démarrage du script');
  const browser = await puppeteer.launch({headless: headlessMode});
  const crawler = new Crawler(browser, logger);
  crawler.setMaxThreads(maxThreads);

  crawler.run(targetUrl);

})();
