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
