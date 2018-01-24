class Crawler {

  constructor(browser, storage, logger) {
    this.browser = browser;
    this.storage = storage;
    this.logger = logger;
    this.threads = 5;
    this.openThreads = 0;
    this.offsetParam = 'start';
    this.step = 50;
    this.latestOffset = null;
    this.targetUrl = null;
  }

  nextOffset() {
    if (this.latestOffset === null) {
        this.latestOffset = 0;
    } else {
      this.latestOffset += this.step;
    }
    return this.latestOffset;
  }

  completeUrl(url) {
    return url + '?' + this.offsetParam + '=' + this.nextOffset();
  }

  async run(targetUrl) {
    this.targetUrl = targetUrl;
    for (let i = 0; i < this.threads; i++) {
      this.openThreads++;
      this.crawl(this.completeUrl(this.targetUrl));
    }
  }

  async crawl(url) {
    const self = this;
    const page = await this.browser.newPage();

    page.on('dialog', async dialog => {
      self.logger.log('debug', 'Apparition d\'un dialogue...fermeture');
      await dialog.dismiss();
    });

    this.logger.log('debug', 'Ouverture de ' + url);
    await page.goto(url);

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
        this.logger.log('debug', 'Prêt pour la page suivante');
        await page.close();
        this.crawl(this.completeUrl(this.targetUrl));
      } else {
        await page.close();
        self.openThreads--;
        if (self.openThreads == 0) {
          self.logger.log('debug', 'Fin du script');
          self.browser.close().then(function () {
            console.log(JSON.stringify(self.storage.getTransactions()));
          });
        }
      }

    } else {
      this.logger.log('debug', 'Echec - nouvelle tentative pour ' + url);
      await page.close();
      this.crawl(url);
    }

  }

};

module.exports = Crawler;
