const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");

class Wallet {
  constructor(secret) {
    this.balance = 0;
    this.keyPair = ChainUtil.genKeyPair(secret);
    this.publicKey = this.keyPair.getPublic("hex");
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
    this.balance = blockchain.getBalance(this.publicKey)

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds the current balance: ${this.balance}`);
      return;
    }
    const transaction = Transaction.newTransaction(this, to, amount, type);
    transactionPool.addTransaction(transaction);
    return transaction;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
