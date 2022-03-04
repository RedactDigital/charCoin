// const ChainUtil = require('../chain-util');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  thresholdReached() {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) return true;
    return false;
  }

  // addTransaction(transaction) {
  // this.transactions.push(transaction);
  // if (this.transactions.length >= TRANSACTION_THRESHOLD) {
  //   return true;
  // } else {
  //   return false;
  // }
  // }

  // validTransactions() {
  //   this.transactions.filter(transaction => {
  //     const validTransaction = ChainUtil.verifySignature(
  //       transaction.input.from,
  //       transaction.input.signature,
  //       ChainUtil.hash(transaction.output)
  //     );

  //     if (!validTransaction) {
  //       log.info(`Invalid signature from ${transaction.data.from}`);
  //       return;
  //     }

  //     return transaction;
  //   });
  // }

  transactionExists(transaction) {
    const exists = this.transactions.find(t => t.id === transaction.id);
    return exists;
  }

  clear() {
    this.transactions = [];
  }
}

// module.exports = TransactionPool;

const transactions = [];

module.exports = {
  transactions,
  thresholdReached: () => {
    return this.transactions.length >= TRANSACTION_THRESHOLD;
  },
  addTransactionToPool: transaction => {
    transactions.push(transaction);
  },
};
