const ChainUtil = require('../chain-util');
const { getBalance } = require('../blockchain/blockchain');
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
  createTransaction(to, from, amount, type) {
    this.balance = getBalance(from);

    // Calculate the transaction fee
    const transactionFee = this.calculateFee(amount);

    // TODO - Calculate the donation fee

    // TODO - Calculate storage fee (for arweave.org)

    // TODO - Calculate the burn fee

    // TODO - calculate total fee
    const fee = transactionFee;

    if (num(amount).toFixed(FIXED) + num(fee).toFixed(FIXED) < num(ONE_ASH).toFixed(FIXED)) {
      return { success: false, message: 'Amount must be greater than 1 ASH' };
    }

    // Ensure sender has enough balance
    if (num(amount).toFixed(FIXED) + num(fee).toFixed(FIXED) > num(this.balance).toFixed(FIXED)) {
      log.error(`Insufficient balance: ${this.balance}`);
      return { success: false, message: 'Insufficient funds' };
    }

    // Create transaction object
    // TODO - make this look like solana https://solscan.io/block/123348478
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
        total: amount,
        amount: amount - fee,
        transactionFee,
        donationFee: 0,
        burnFee: 0,
      },
    };

    // Sign the transaction
    transaction.input.signature = this.sign(ChainUtil.hash(transaction.output));

    return { success: true, transaction };
  }

  calculateFee(amount) {
    // TODO - Calculate the transaction fee
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees
    return num(amount).multipliedBy('.01').toFixed(FIXED);
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
