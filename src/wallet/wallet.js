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

  // Move to Transactions File
  createTransaction(to, amount, type, blockchain) {
    if (num(amount).toFixed(FIXED) < ONE_ASH) {
      log.error(num(amount).toFixed(FIXED));
      log.error(ONE_ASH);
    }

    this.balance = blockchain.getBalance(this.publicKey);

    // Calculate the transaction fee
    const transactionFee = this.calculateFee(amount);

    // TODO - Calculate the donation fee

    // TODO - Calculate the burn fee

    // TODO - calculate total fee
    const fee = transactionFee;

    // Ensure sender has enough balance
    if (num(amount).toFixed(FIXED) + num(fee).toFixed(FIXED) > this.balance) {
      log.info(`Amount : ${amount + fee} exceeds the balance of ${this.balance}`);
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
        amount: amount - fee,
        transactionFee,
        donationFee: 0,
        burnFee: 0,
      },
    };

    // Sign the transaction
    transaction.input.signature = this.sign(ChainUtil.hash(transaction.output));

    return transaction;
  }

  calculateFee(amount) {
    // TODO - Calculate the transaction fee
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees
    return num(amount).multiplyBy('.01').toFixed(FIXED);
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
