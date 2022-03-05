class TransactionPool {
  constructor() {
    this.transactions = [];
    this.count = 0;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.count++;
  }

  removeTransactions(transactions) {
    transactions.forEach(transaction => {
      this.transactions = this.transactions.filter(t => t.id !== transaction.id);
    });
    this.count -= transactions.length;
  }

  transactionExists(transaction) {
    return this.transactions.find(t => t.id === transaction.id);
  }

  thresholdReached() {
    return this.transactions.length >= TRANSACTION_THRESHOLD;
  }
}

module.exports = TransactionPool;
