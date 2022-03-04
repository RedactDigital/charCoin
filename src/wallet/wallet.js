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
  createTransaction(to, from, totalAmount, type) {
    this.balance = getBalance(from);

    // Calculate the transaction fee
    const fees = this.calculateFee(totalAmount);

    if (+totalAmount + +fees.total < ashes(1)) {
      return { success: false, message: 'Minimum transaction must be 14 ASH or greater' };
    }

    // Ensure sender has enough balance
    if (+totalAmount + +fees.total > +this.balance) {
      return { success: false, message: 'Insufficient funds' };
    }

    // Create transaction object
    // TODO - make this look like solana https://solscan.io/block/123348478
    const transaction = {
      id: ChainUtil.id(),
      timestamp: Date.now(),
      blockHash: '',
      data: {
        addresses: {
          from,
          to,
        },
        totalAmount,
        sentAmount: +totalAmount - +fees.total,
        fees,
        instructions: [type],
      },
      signature: '',
      status: '',
    };

    // Sign the transaction
    transaction.signatures = this.sign(ChainUtil.hash(transaction.data));

    return { success: true, transaction };
  }

  calculateFee(amount) {
    // TODO - Calculate the transaction fee
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees

    const validatorFee = TRANSACTION_FEE_MIN;

    const donationFee = +amount * +TRANSACTION_FEE_DONATION;

    // TODO - Calculate storage fee (for arweave.org)
    const storageFee = +TRANSACTION_FEE_STORAGE;

    // TODO - Calculate the burn fee
    const burnFee = +amount * +TRANSACTION_FEE_BURN;

    const fees = {
      validatorFee,
      storageFee,
      donationFee,
      burnFee,
      total: +validatorFee + +donationFee + +storageFee + +burnFee,
    };

    return fees;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
