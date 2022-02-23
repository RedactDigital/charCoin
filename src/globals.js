/* eslint-disable */
const { log: logger } = require('./middleware');
const totalCoins = Number(329.5 * 1000000);
const transactionThreshold = 5;
const transactionFee = 5;
const validatorFee = 25;
const tierTwoBlockRequirement = 10;
const tierOneBlockRequirement = 20;

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
TRANSACTION_FEE = transactionFee;
VALIDATOR_FEE = validatorFee;
TIER_TWO_BLOCK_REQUIREMENT = tierTwoBlockRequirement;
TIER_ONE_BLOCK_REQUIREMENT = tierOneBlockRequirement;
log = logger;

module.exports = {
  global,
};
