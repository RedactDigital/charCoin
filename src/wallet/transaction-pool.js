const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  thresholdReached() {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) return true;
    return false;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true;
    } else {
      return false;
    }
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      if (!Transaction.verifyTransaction(transaction)) {
        log.info(`Invalid signature from ${transaction.data.from}`);
        return;
      }

      return transaction;
    });
  }

  transactionExists(transaction) {
    const exists = this.transactions.find(t => t.id === transaction.id);
    return exists;
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
