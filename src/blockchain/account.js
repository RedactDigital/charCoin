class Account {
  constructor() {
    this.addresses = ['5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614'];
    this.balance = {
      '5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614': TOTAL_COINS,
    };
  }

  initialize(address) {
    if (this.balance[address] == undefined) {
      this.balance[address] = num('0').toFixed(FIXED);
      this.addresses.push(address);
    }
  }

  transfer(from, to, amount) {
    this.initialize(from);
    this.initialize(to);
    this.increment(to, amount);
    this.decrement(from, amount);
  }

  increment(to, amount) {
    this.balance[to] = num(this.balance[to]).plus(amount).toFixed(FIXED);
  }

  decrement(from, amount) {
    this.balance[from] = num(this.balance[from]).minus(amount).toFixed(FIXED);
  }

  getBalance(address) {
    this.initialize(address);
    return num(this.balance[address]).toFormat();
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
