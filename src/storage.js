class TransactionStorage {

  constructor() {
    this.transactions = [];
  }

  getTransactions() {
    return this.transactions;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  static newInstance() {
    return new this;
  }

};

module.exports = TransactionStorage;
