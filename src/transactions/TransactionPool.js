class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  removeTransactions(transactions) {
    transactions.forEach(transaction => {
      this.transactions = this.transactions.filter(t => t.id !== transaction.id);
    });
  }

  transactionExists(transaction) {
    return this.transactions.find(t => t.id === transaction.id);
  }

  thresholdReached() {
    return this.transactions.length >= TRANSACTION_THRESHOLD;
  }
}

module.exports = TransactionPool;
