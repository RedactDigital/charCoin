let transactions = [];

module.exports = {
  transactions,
  thresholdReached: () => {
    return transactions.length >= TRANSACTION_THRESHOLD;
  },
  // addTransactionToPool: transaction => {
  //   transactions.push(transaction);
  // },
  // removeTransactionsFromPool: () => {
  //   transactions = [];
  // },
  transactionExists: transaction => {
    return transactions.find(t => t.id === transaction.id);
  },
  validTransactions: () => {
    // Ensure transactions match local transactions
    // Ensure each transaction has a valid signature
  },
};

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

const { id } = require('../util/chain-util');

class Transactions {
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

module.exports = Transactions;
