const ChainUtil = require('../chain-util');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.type = null;
    this.input = null;
    this.output = null;
  }

  static newTransaction(senderWallet, to, amount, type) {
    if (Number(amount) + Number(TRANSACTION_FEE) > senderWallet.balance) {
      log.info(`Amount : ${amount + TRANSACTION_FEE} exceeds the balance of ${senderWallet.balance}`);
      return;
    }

    return Transaction.generateTransaction(senderWallet, to, amount, type);
  }

  static generateTransaction(senderWallet, to, amount, type) {
    const transaction = new this();
    transaction.type = type;
    transaction.output = {
      to: to,
      amount: amount - TRANSACTION_FEE,
      fee: TRANSACTION_FEE,
    };
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  // TODO -- validate transactions method

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      from: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.output)),
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.from,
      transaction.input.signature,
      ChainUtil.hash(transaction.output)
    );
  }
}

module.exports = Transaction;
