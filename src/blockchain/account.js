require('../globals');

class Account {
  constructor() {
    this.addresses = ['5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614'];
    this.balance = {
      '5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614': +TOTAL_COINS,
    };
  }

  initialize(address) {
    if (this.balance[address] == undefined) {
      this.balance[address] = +0;
      this.addresses.push(address);
    }
  }

  transfer(from, to, recipientAmount, senderAmount) {
    this.initialize(from);
    this.initialize(to);
    this.increment(to, recipientAmount);
    this.decrement(from, senderAmount);
  }

  increment(to, amount) {
    this.balance[to] += +amount.toFixed(fixed);
  }

  decrement(from, amount) {
    this.balance[from] += +amount.toFixed(fixed);
  }

  getBalance(address) {
    this.initialize(address);
    return +this.balance[address];
  }

  // update(transaction) {
  //   const amount = transaction.output.amount;
  //   const from = transaction.input.from;
  //   const to = transaction.output.to;
  //   this.transfer(from, to, amount);
  // }

  transferFee(block, transaction) {
    const amount = transaction.output.fee;
    const from = transaction.input.from;
    const to = block.validator;
    this.transfer(from, to, amount);
  }
}

module.exports = Account;
