const puppeteer = require('puppeteer');
const logger = require('winston');
const maxTimeout = 1000;
var headlessMode = true;
if (process.env.hasOwnProperty('DISABLE_HEADLESS')
  && process.env.DISABLE_HEADLESS == 1) {
  headlessMode = false;
}
logger.configure({
  transports: [
    new (logger.transports.File)({ filename: 'debug.log' })
  ]
});
logger.level = 'debug';
var transactions = [];

(async () => {
  logger.log('debug', 'Démarrage du script');
  const browser = await puppeteer.launch({headless: headlessMode});
  const page = await browser.newPage();

  page.on('dialog', async dialog => {
    logger.log('debug', 'Apparition d\'un dialogue...fermeture');
    await dialog.dismiss();
  });

  logger.log('debug', 'Ouverture de https://web.bankin.com/challenge/index.html');
  await page.goto('https://web.bankin.com/challenge/index.html');

  page.waitForSelector('#dvTable table tr', {timeout: maxTimeout})
    .then(function () {
      logger.log('debug', 'TODO compter les lignes');
    }, function () {
      logger.log('debug', 'TODO gérer quand ce n\'est pas le cas idéal');
    });

  logger.log('debug', 'Fin du script');

  // TODO supprimer délai quand terminé
  setTimeout(function () {
    browser.close();
    console.log(JSON.stringify(transactions));
  }, 500);
})();
