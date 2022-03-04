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
  createTransaction(to, from, amount, instruction) {
    this.balance = getBalance(from);

    // Convert CHAR to ASH
    let totalAmount = (+amount * chars(1)).toFixed(fixed);

    // Calculate the transaction fee
    const fees = this.calculateFee(totalAmount, instruction);

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
        instructions: [instruction],
      },
      signature: '',
    };

    // Sign the transaction
    transaction.signatures = this.sign(ChainUtil.hash(transaction.data));

    return { success: true, transaction };
  }

  calculateFee(amount, instruction) {
    // https://docs.solana.com/transaction_fees
    // https://docs.solana.com/implemented-proposals/transaction-fees#congestion-driven-fees

    let instructionFee = 0;

    if (instruction === 'transfer') instructionFee = ashes(100);
    if (instruction === 'stake') instructionFee = ashes(300);
    // if(instruction === 'donate' ) instructionFee = ashes(50)

    // const donation = +amount * +0.005;
    const donation = 0;

    // TODO - Calculate storage fee (for arweave.org)
    const storageFee = ashes(5);

    const burnFee = +instructionFee * +0.5;

    const fees = {
      instructionFee,
      storageFee,
      donation,
      donationToAsh: burnFee,
      total: +instructionFee + +donation + +storageFee + +burnFee,
    };

    return fees;
  }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
