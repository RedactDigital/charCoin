const { VALIDATOR_FEE } = require('../config');

const validators = [
  {
    // TODO - update this address before launch
    address: '5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614',
    blocks: [],
    stake: 0,
  },
];

module.exports = {
  commitValidator: transaction => {
    // TODO - Ensure address is not blacklisted and not already in list
    if (transaction.output.amount >= VALIDATOR_FEE && transaction.output.to == '0') {
      this.list.push(transaction.input.from);
      this.count++;
      console.log('New Validator:', transaction.input.from);
      return true;
    }
    return false;
  },

  getValidators: () => {
    return { validators, count: validators.length };
  },

  getValidatorWithMostStake: validatorAddresses => {
    const balance = -1;
    let leader = undefined;
    for (let i = 0; i < validatorAddresses.length; i++) {
      if (this.getBalance(validatorAddresses[i]) > balance) {
        leader = validatorAddresses[i];
      }
    }
    return leader;
  },
};
