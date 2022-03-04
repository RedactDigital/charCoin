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
  createTransaction(to, from, amount, instructions) {
    this.balance = getBalance(from);

    // Convert CHAR to ASH
    let totalAmount = (+amount * chars(1)).toFixed(fixed);

    // Calculate the transaction fee
    const fees = this.calculateFee(totalAmount, instructions);

    if (+totalAmount + +fees.total < ashes(1)) {
      return { success: false, message: 'Minimum transaction must be 14 ASH or greater' };
    }

    // Ensure sender has enough balance
    if (+totalAmount + +fees.total > +this.balance) {
      return { success: false, message: 'Insufficient funds' };
    }

    // Convert ASH to CHAR
    totalAmount = (+totalAmount / chars(1)).toFixed(fixed);

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
        senderAmount: +totalAmount + +fees.total,
        recipientAmount: +totalAmount,
        fees,
        instructions: instructions,
      },
      signature: '',
    };

    // Sign the transaction
    transaction.signatures = this.sign(ChainUtil.hash(transaction.data));

    return { success: true, transaction };
  }

  calculateFee(amount, instructions) {
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees

    let instructionsFee = 0;

    if (instructions === 'transfer') instructionsFee = ashes(100);
    if (instructions === 'stake') instructionsFee = ashes(300);
    // if(instructions === 'donate' ) instructionsFee = ashes(50)

    const donation = +amount * +0.005;

    // TODO - Calculate storage fee (for arweave.org)
    const storageFee = ashes(5);

    const burnFee = +instructionsFee * +0.5;

    const fees = {
      instructionsFee: (+instructionsFee / chars(1)).toFixed(fixed),
      storageFee: (+storageFee / chars(1)).toFixed(fixed),
      donation: (+donation / chars(1)).toFixed(fixed),
      feesBurntToAsh: (+burnFee / chars(1)).toFixed(fixed),
      total: ((+instructionsFee + +donation + +storageFee + +burnFee) / chars(1)).toFixed(fixed),
    };

    return fees;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
