/* eslint-disable */
const { log: logger } = require('./middleware');

const fixed = 7;
const transactionThreshold = 5;

const oneAsh = 1;
const oneChar = 1000 * 1000;
const totalCoins = 250000000 * +oneChar;
const ashes = num => +num * +oneAsh;
const chars = num => +num * +oneChar;

const validatorStakeRequirement = chars(10);
const transactionFeeMin = ashes(10);
const transactionFeeMax = ashes(100);
const transactionFeeBurn = +0.4; // 40%
const transactionFeeDonation = +0.18; // 18%

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

module.exports = {
  global,
};
