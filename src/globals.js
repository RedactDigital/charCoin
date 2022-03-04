/* eslint-disable */
const BigNumber = require('bignumber.js');

const { log: logger } = require('./middleware');

const fixed = 7;

const totalCoins = BigNumber('250000000').toFixed(fixed);
const oneAsh = BigNumber('.0000001').toFixed(fixed);
const transactionThreshold = 5;
const validatorStakeRequirement = BigNumber('10').toFixed(fixed);
const transactionFeeMin = BigNumber('.00001').toFixed(fixed);
const transactionFeeMax = BigNumber('.0001').toFixed(fixed);
const transactionFeeBurn = BigNumber('.4').toFixed(fixed); // 40%
const transactionFeeDonation = BigNumber('.18').toFixed(fixed); // 18%

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
VALIDATOR_STAKE_REQUIREMENT = validatorStakeRequirement;
TRANSACTION_FEE_MIN = transactionFeeMin;
TRANSACTION_FEE_MAX = transactionFeeMax;
TRANSACTION_FEE_BURN = transactionFeeBurn;
TRANSACTION_FEE_DONATION = transactionFeeDonation;
ONE_ASH = oneAsh;
FIXED = fixed;

log = logger;
num = BigNumber;

module.exports = {
  global,
};
