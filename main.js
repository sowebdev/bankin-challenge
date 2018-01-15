const puppeteer = require('puppeteer');
const logger = require('winston');
// const targetUrl = 'https://web.bankin.com/challenge/index.html';
const targetUrl = 'file:///C:/Users/AlSo/Downloads/cas-ideal.html';
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

    for (var i = 0; i < transactionRows.length; i++) {

      let row = transactionRows[i];
      let transaction = await page.evaluate(row => {

        if (row.children[0].tagName.toLowerCase() == 'td') {

          let amount = row.children[2].innerText.trim();
          let currency = amount.substr(amount.length - 1, 1);
          amount = parseInt(amount.substr(0, amount.length - 1));

          return {
            Account: row.children[0].innerText.trim(),
            Transaction: row.children[1].innerText.trim(),
            Amount: amount,
            Currency: currency,
          };

        }

      }, row);

      if (transaction) {
        logger.log('debug', 'Ajout transaction au stockage');
        storage.addTransaction(transaction);
      }

    }

    // TODO gérer page suivante
    logger.log('debug', 'Prêt pour la page suivante');

  }

  logger.log('debug', 'Fin du script');

  // TODO supprimer délai quand terminé
  setTimeout(function () {
    browser.close();
    console.log(JSON.stringify(storage.getTransactions()));
  }, 500);
})();
