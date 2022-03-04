/* eslint-disable */
const { log: logger } = require('./middleware');

const transactionThreshold = 5;

const oneAsh = 1;
const oneChar = 1000 * 1000;
const totalCoins = 250000000 * +oneChar;
const getNumOfAshes = num => +num * +oneAsh;
const getNumOfChars = num => +num * +oneChar;

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = +1;
VALIDATOR_STAKE_REQUIREMENT = getNumOfChars(10);
TRANSACTION_FEE_MIN = getNumOfAshes(10);
TRANSACTION_FEE_MAX = getNumOfAshes(100);
TRANSACTION_FEE_BURN = +0.4; // 40%
TRANSACTION_FEE_DONATION = +0.18; // 18%
TRANSACTION_FEE_STORAGE = +1;

log = logger;
ashes = getNumOfAshes;
chars = getNumOfChars;

module.exports = {
  global,
};
