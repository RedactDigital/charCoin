const { id } = require('../chain-util');
const { getBalance } = require('../blockchain/blockchain');

class Transaction {
  constructor(sender, recipient, amount, instructions) {
    // Convert amount to ASH
    const ashes = (+amount * chars(1)).toFixed(fixed);

    // Calculate the transaction fees
    const fees = this._calculateFee(ashes, instructions);

    // Ensure the minimum amount is met
    if (!this._meetsMinimumAmount(ashes, fees.total)) return { success: false, message: 'Minimum amount not met' };

    // Ensure sender has enough balance
    if (!this._hasSufficientBalance(ashes, fees.total, sender))
      return { success: false, message: 'Insufficient funds' };

    // Create transaction object
    this.id = id();
    this.timestamp = Date.now();
    this.blockHash = '';
    this.status = '';
    this.data = {
      addresses: {
        sender,
        recipient,
      },
      senderAmount: +amount + +fees.total,
      recipientAmount: +amount,
      fees,
      instructions,
    };
    this.signature = '';

    return { success: true, transaction: this };
  }

  _calculateFee(amount, instructions) {
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

  _meetsMinimumAmount(amount, fees) {
    return +amount + +fees > ashes(1);
  }

  _hasSufficientBalance(amount, fees, sender) {
    const walletBalance = getBalance(sender);
    return +amount + +fees > +walletBalance;
  }
}

module.exports = Transaction;
