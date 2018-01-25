const Storage = require('./storage.js');

/**
* Le crawler parcourt une URL cible et extrait toutes les transactions bancaires trouvées.
* Afin d'accélérer son parcours, il crée un nombre défini de threads, chaque thread
* étant responsable de l'analyse d'une page.
**/
class Crawler {

  constructor(browser, logger) {

    this.browser = browser;
    this.logger = logger;
    this.storage = new Storage();
    this.maxThreads = 1;
    this.offsetParam = 'start';
    this.stepSize = 50;

    this.openThreads = 0;
    this.latestOffset = null;
    this.targetUrl = null;

  }

  setMaxThreads(maxThreads) {
    this.maxThreads = parseInt(maxThreads);
  }

  nextOffset() {

    if (this.latestOffset === null) {
        this.latestOffset = 0;
    } else {
      this.latestOffset += this.stepSize;
    }

    return this.latestOffset;

  }

  completeUrl(url, offset) {
    return url + '?' + this.offsetParam + '=' + offset;
  }

  async run(targetUrl) {

    this.logger.log('debug', 'Démarrage de ' + this.maxThreads + ' threads pour crawler ' + targetUrl);
    this.targetUrl = targetUrl;

    for (let i = 0; i < this.maxThreads; i++) {
      this.openThreads++;
      this.crawl(this.nextOffset());
    }

  }

  async crawl(offset) {

    const self = this;
    const page = await this.browser.newPage();
    const url = this.completeUrl(this.targetUrl, offset);

    page.on('dialog', async dialog => {
      self.logger.log('debug', 'Apparition d\'un dialogue...fermeture');
      await dialog.dismiss();
    });

    this.logger.log('debug', 'Ouverture de ' + url);
    await page.goto(url);

    var transactionRows = await page.$$('#dvTable table tr');

    if (transactionRows.length) {
      this.logger.log('debug', 'Grille de transactions trouvée');

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
          this.logger.log('debug', 'Ajout transaction "' + transaction.Transaction + '"');
          this.storage.addTransaction(transaction);
        }

      }

      if (transactionRows.length > 1) {

        this.logger.log('debug', 'OK pour ' + url + ' - page suivante');
        await page.close();
        this.crawl(this.nextOffset());

      } else {

        await page.close();
        this.openThreads--;
        this.logger.log('debug', 'Plus de transactions disponibles');

        if (this.openThreads == 0) {

          this.logger.log('debug', 'Fin du script');
          this.browser.close().then(function () {
            console.log(JSON.stringify(self.storage.getTransactions()));
          });

        }

      }

    } else {

      this.logger.log('debug', 'Echec - nouvelle tentative pour ' + url);
      await page.close();
      this.crawl(offset);

    }

  }

};

module.exports = Crawler;
