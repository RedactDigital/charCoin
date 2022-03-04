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
    const validatorFee = this.calculateFee(totalAmount);

    // TODO - Calculate the donation fee
    const donationFee = 1;

    // TODO - Calculate storage fee (for arweave.org)
    const storageFee = 1;

    // TODO - Calculate the burn fee
    const burnFee = 1;

    const fees = +validatorFee + +donationFee + +storageFee + +burnFee;

    if (+totalAmount + +fees < ashes(1)) {
      return { success: false, message: 'Amount must be greater than 1 ASH' };
    }

    // Ensure sender has enough balance
    if (+totalAmount + +fees > +this.balance) {
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
        sentAmount: +totalAmount - +fees,
        fees: {
          validatorFee,
          storageFee,
          donationFee,
          burnFee,
        },
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
    return amount * TRANSACTION_FEE_MIN;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
