const puppeteer = require('puppeteer');
const logger = require('winston');
// const targetUrl = 'https://web.bankin.com/challenge/index.html';
const targetUrl = 'file:///C:/Users/AlSo/projects/bankin-challenge/sample/cas-ideal-fin.html';
var headlessMode = true;
if (process.env.hasOwnProperty('DISABLE_HEADLESS') && process.env.DISABLE_HEADLESS == 1) {
  headlessMode = false;
}
logger.configure({
  transports: [
    new (logger.transports.File)({ filename: 'debug.log' })
  ]
});
logger.level = 'debug';

const storage = require('./src/storage.js').newInstance();
const Crawler = require('./src/crawler.js');

(async () => {

  logger.log('debug', 'Démarrage du script');
  const browser = await puppeteer.launch({headless: headlessMode});
  const crawler = new Crawler(browser, storage, logger);

  crawler.run(targetUrl);

})();
