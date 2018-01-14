const puppeteer = require('puppeteer');
const logger = require('winston');
// const targetUrl = 'https://web.bankin.com/challenge/index.html';
const targetUrl = 'file:///C:/Users/AlSo/Downloads/cas-ideal.html';
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

  logger.log('debug', 'Ouverture de ' + targetUrl);
  await page.goto(targetUrl);

  var transactionRows = await page.$$('#dvTable table tr');

  if (transactionRows.length) {
    logger.log('debug', 'Lignes trouvées');

    // TODO séparer amount et currency
    for (var i = 0; i < transactionRows.length; i++) {
      var row = transactionRows[i];
      var val = await page.evaluate(row => {
        return {
          account: row.children[0].innerText,
          transaction: row.children[1].innerText,
          amount: row.children[2].innerText,
          currency: row.children[2].innerText,
        };
      }, row);
      logger.log('debug', val);
    }

  }

  logger.log('debug', 'Fin du script');

  // TODO supprimer délai quand terminé
  setTimeout(function () {
    browser.close();
    console.log(JSON.stringify(transactions));
  }, 500);
})();
