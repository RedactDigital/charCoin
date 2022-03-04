/* eslint-disable */
const BigNumber = require('bignumber.js');

const { log: logger } = require('./middleware');
const totalCoins = BigNumber('250000000');
const oneAsh = BigNumber('.0000001');
const transactionThreshold = 5;
const validatorStakeRequirement = BigNumber('10');

const transactionFeeMin = BigNumber('.00001');
const transactionFeeMax = BigNumber('.0001');
const transactionFeeBurn = BigNumber('.4'); // 40%
const transactionFeeDonation = BigNumber('.18'); // 18%

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
VALIDATOR_STAKE_REQUIREMENT = validatorStakeRequirement;
TRANSACTION_FEE_MIN = transactionFeeMin;
TRANSACTION_FEE_MAX = transactionFeeMax;
TRANSACTION_FEE_BURN = transactionFeeBurn;
TRANSACTION_FEE_DONATION = transactionFeeDonation;
ONE_ASH = oneAsh;

log = logger;
num = value => BigNumber(value);

module.exports = {
  global,
};
