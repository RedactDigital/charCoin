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

  // sign(dataHash) {
  //   return this.keyPair.sign(dataHash).toHex();
  // }

  // Move to Transactions File
  // createTransaction(to, from, amount, instructions) {
  // this.balance = getBalance(from);

  // // Convert CHAR to ASH
  // let totalAmount = (+amount * chars(1)).toFixed(fixed);

  // // Calculate the transaction fee
  // const fees = this.calculateFee(totalAmount, instructions);

  // if (+totalAmount + +fees.total < ashes(1)) {
  //   return { success: false, message: 'Minimum transaction must be 14 ASH or greater' };
  // }

  // // Ensure sender has enough balance
  // if (+totalAmount + +fees.total > +this.balance) {
  //   return { success: false, message: 'Insufficient funds' };
  // }

  // Convert ASH to CHAR
  //   totalAmount = (+totalAmount / chars(1)).toFixed(fixed);

  //   // Create transaction object
  //   const transaction = {
  //     id: ChainUtil.id(),
  //     timestamp: Date.now(),
  //     blockHash: '',
  //     status: '',
  //     data: {
  //       addresses: {
  //         from,
  //         to,
  //       },
  //       senderAmount: +totalAmount + +fees.total,
  //       recipientAmount: +totalAmount,
  //       fees,
  //       instructions: instructions,
  //     },
  //     signature: '',
  //   };

  //   // Sign the transaction
  //   transaction.signatures = this.sign(ChainUtil.hash(transaction.data));

  //   return { success: true, transaction };
  // }

  getPublicKey() {
    return this.publicKey;
  }
}

module.exports = Wallet;
