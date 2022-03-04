/* eslint-disable */
const { log: logger } = require('./middleware');

const transactionThreshold = 5;

const oneAsh = 1;
const oneChar = 1000 * 1000;
const totalCoins = 250000000 * +oneChar;
const getNumOfAshes = num => +num * +oneAsh;
const getNumOfChars = num => +num * +oneChar;

const validatorStakeRequirement = getNumOfChars(10);
const transactionFeeMin = getNumOfAshes(10);
const transactionFeeMax = getNumOfAshes(100);
const transactionFeeBurn = +0.4; // 40%
const transactionFeeDonation = +0.18; // 18%

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
VALIDATOR_STAKE_REQUIREMENT = validatorStakeRequirement;
TRANSACTION_FEE_MIN = transactionFeeMin;
TRANSACTION_FEE_MAX = transactionFeeMax;
TRANSACTION_FEE_BURN = transactionFeeBurn;
TRANSACTION_FEE_DONATION = transactionFeeDonation;

log = logger;
ashes = getNumOfAshes;
chars = getNumOfChars;

module.exports = {
  global,
};
