class Crawler {

  constructor(browser, storage, logger) {
    this.browser = browser;
    this.storage = storage;
    this.logger = logger;
    this.openPages = 0;
    this.threads = 10;
    this.offsetParam = 'start';
    this.step = 50;
  }

  async run(targetUrl) {
    for (let i = 0; i < this.threads; i++) {
      let offset = i * this.step;
      this.crawl(targetUrl + '?' + this.offsetParam + '=' + offset);
    }
  }

  async crawl(targetUrl) {
    const self = this;
    const page = await this.browser.newPage();
    this.openPages++;

    page.on('dialog', async dialog => {
      self.logger.log('debug', 'Apparition d\'un dialogue...fermeture');
      await dialog.dismiss();
    });

    this.logger.log('debug', 'Ouverture de ' + targetUrl);
    await page.goto(targetUrl);

    var transactionRows = await page.$$('#dvTable table tr');

    if (transactionRows.length) {
      this.logger.log('debug', 'Tableau trouvé');

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
          this.logger.log('debug', 'Ajout transaction au stockage');
          this.storage.addTransaction(transaction);
        }

      }

      if (transactionRows.length > 1) {
        // TODO gérer page suivante
        this.logger.log('debug', 'Prêt pour la page suivante');
      } else {
        page.close().then(function () {
          self.openPages--;
          if (self.openPages == 0) {
            self.logger.log('debug', 'Fin du script');
            // TODO trouver pk parfois plusieurs tableaux sont retournés
            // et pk le navigateur est déjà fermé
              self.browser.close().then(function () {
                console.log(JSON.stringify(self.storage.getTransactions()));
              });
          }
        });
      }

    }

  }

};

module.exports = Crawler;
