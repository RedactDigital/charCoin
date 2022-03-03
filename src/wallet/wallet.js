const ChainUtil = require('../chain-util');
// const Transaction = require('./transaction');

class Wallet {
  constructor(secret) {
    this.balance = 0;
    this.keyPair = ChainUtil.genKeyPair(secret);
    this.publicKey = this.keyPair.getPublic('hex');
  }

  toString() {
    return `Wallet - 
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash).toHex();
  }

  createTransaction(to, amount, type, blockchain, transactionPool) {
    this.balance = blockchain.getBalance(this.publicKey);

    // Ensure sender has enough balance
    if (+amount + +TRANSACTION_FEE > this.balance) {
      log.info(`Amount : ${amount + TRANSACTION_FEE} exceeds the balance of ${this.balance}`);
      return;
    }

    // Create transaction object
    const transaction = {
      id: ChainUtil.id(),
      type,
      input: {
        timestamp: Date.now(),
        from: this.publicKey,
        signature: null,
      },
      output: {
        to,
        amount: amount - TRANSACTION_FEE,
        fee: TRANSACTION_FEE,
      },
    };

    // Sign the transaction
    transaction.input.signature = this.sign(ChainUtil.hash(transaction.output));

    return transaction;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
