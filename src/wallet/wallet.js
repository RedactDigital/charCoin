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

    // Convert CHAR to ASH
    let totalAmount = (+amount * chars(1)).toFixed(fixed);

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
    const transaction = {
      id: ChainUtil.id(),
      timestamp: Date.now(),
      blockHash: '',
      status: '',
      data: {
        addresses: {
          from,
          to,
        },
        totalAmount: (+totalAmount + +fees.total).toFixed(fixed),
        sentAmount: (+totalAmount).toFixed(fixed),
        fees,
        instructions: [type],
      },
      signature: '',
    };

    // Sign the transaction
    transaction.signatures = this.sign(ChainUtil.hash(transaction.data));

    return { success: true, transaction };
  }

  calculateFee(amount, transactions) {
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees

    // TODO - Figure out validator fees
    const validatorFee = () => {
      let fee = +amount * +TRANSACTION_FEE_VALIDATOR;

      let transactionBonus = transactions.length * +TRANSACTION_FEE_VALIDATOR_BONUS;

      fee += transactionBonus;

      if (fee > +TRANSACTION_FEE_MAX) fee = +TRANSACTION_FEE_MAX;
      if (fee < +TRANSACTION_FEE_MIN) fee = +TRANSACTION_FEE_MIN;

      console.log(fee);

      return fee;
    };

    const donationFee = +validatorFee * +TRANSACTION_FEE_DONATION;

    // TODO - Calculate storage fee (for arweave.org)
    const storageFee = +TRANSACTION_FEE_STORAGE;

    const burnFee = +validatorFee * +TRANSACTION_FEE_BURN;

    const fees = {
      validatorFee,
      storageFee,
      donationFee,
      burnFee,
      total: (+validatorFee + +donationFee + +storageFee + +burnFee) / +chars(1),
    };

    return fees;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
