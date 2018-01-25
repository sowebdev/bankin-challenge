/**
* Stockage des transactions
*/
class Storage {

  constructor() {
    this.transactions = [];
    this.transactionIndex = [];
  }

  getTransactions() {
    return this.transactions;
  }

  addTransaction(transaction) {
    // On s'assure qu'il n'y ait pas de transaction ajoutée en doublon
    if (!this.transactionIndex.includes(transaction.Transaction)) {
        this.transactions.push(transaction);
        this.transactionIndex.push(transaction.Transaction);
    }
  }

};

module.exports = Storage;
