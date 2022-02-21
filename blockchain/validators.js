const {VALIDATOR_FEE} = require("../config");

class Validators {
  constructor() {
    this.list = [
      "5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614"
    ];
  }

  update(transaction) {
    if (transaction.output.amount >= VALIDATOR_FEE && transaction.output.to == "0") {
      this.list.push(transaction.input.from);
      console.log("New Validator:", transaction.input.from);
      return true;
    }
    return false;
  }
}

module.exports = Validators;
