class TransactionStorage {

  constructor() {
    this.transactions = [];
    this.transactionKeys = [];
  }

  getTransactions() {
    return this.transactions;
  }

  addTransaction(transaction) {
    if (!this.transactionKeys.includes(transaction.Transaction)) {
        this.transactions.push(transaction);
        this.transactionKeys.push(transaction.Transaction);
    }
  }

  static newInstance() {
    return new this;
  }

};

module.exports = TransactionStorage;
