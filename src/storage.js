/**
* Stockage des transactions
*/
class Storage {

  constructor(stepSize) {
    this.stepSize = stepSize;
    this.transactions = [];
    this.transactionIndex = [];
    this.greatestOffset = 0;
  }

  getTransactions() {
    // On réordonne avant restitution
    let sortedTransactions = [];
    for (let i = 0; i <= this.greatestOffset; i += this.stepSize) {
      for (let j = 0; j < this.transactions[i].length; j++) {
          sortedTransactions.push(this.transactions[i][j]);
      }
    }
    return sortedTransactions;
  }

  addTransaction(transaction, offset) {
    // On s'assure qu'il n'y ait pas de transaction ajoutée en doublon
    if (!this.transactionIndex.includes(transaction.Transaction)) {
        this.transactionIndex.push(transaction.Transaction);
        // Les transactions sont rangées par offset afin qu'on puisse les réordonner à la restitution
        if (this.transactions[offset] == undefined) {
          this.transactions[offset] = [];
        }
        this.transactions[offset].push(transaction);
        if (offset > this.greatestOffset) {
          this.greatestOffset = offset;
        }
    }
  }

};

module.exports = Storage;
