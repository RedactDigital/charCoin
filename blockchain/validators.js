const { VALIDATOR_FEE, TIER_TWO_BLOCK_REQUIREMENT, TIER_ONE_BLOCK_REQUIREMENT, TOTAL_COINS } = require('../config');

const validators = [
  {
    // TODO - update this address before launch
    address: '5aad9b5e21f63955e8840e8b954926c60e0e2d906fdbc0ce1e3afe249a67f614',
    blocks: [],
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

  getValidator: address => {
    return validators.find(validator => validator.address == address);
  },

  getValidators: () => {
    return { validators, count: validators.length };
  },

  getTierOneValidators: () => {
    return validators.filter(validator => validator.blocks.length >= TIER_ONE_BLOCK_REQUIREMENT);
  },

  getTierTwoValidators: () => {
    return validators.filter(validator => validator.blocks.length >= TIER_TWO_BLOCK_REQUIREMENT);
  },

  getTierThreeValidators: () => {
    return validators.filter(validator => validator.blocks.length < TIER_TWO_BLOCK_REQUIREMENT);
  },

  getValidatorWithMostStake: validators => {
    // const balance = -1;
    // let chosenValidator = undefined;
    // for (let i = 0; i < validators.length; i++) {
    //   if (this.accounts.getBalance(validators[i]) > balance) {
    //     chosenValidator = validators[i];
    //   }
    // }
    // return chosenValidator;
    let chosenValidator = validators[0];
    console.log(validators);
    for (let i = 0; i < validators.length; i++) {
      if (this.accounts.getBalance(validators[i].address) > this.accounts.getBalance(chosenValidator.address)) {
        chosenValidator = validators[i];
      }
    }
    return chosenValidator;
  },
};
