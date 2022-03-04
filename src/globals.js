/* eslint-disable */
const { log: logger } = require('./middleware');

const transactionThreshold = 5;
const toFixed = 5;

const oneAsh = 1;
const oneChar = 1000 * 1000;
const totalCoins = 250000000 * +oneChar;
const getNumOfAshes = num => +num * +oneAsh;
const getNumOfChars = num => (+num * +oneChar).toFixed(toFixed);

const validatorStakeRequirement = getNumOfChars(10);

// ------------------------------ Fees ------------------------------

const transactionFeeBurn = +0.23; // 23% of the fee
const transactionFeeStorage = getNumOfAshes(5);

// ------------------------------------------------------------------

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
VALIDATOR_STAKE_REQUIREMENT = validatorStakeRequirement;

log = logger;
ashes = getNumOfAshes;
chars = getNumOfChars;
fixed = toFixed;

module.exports = {
  global,
};
250, 000, 000;
